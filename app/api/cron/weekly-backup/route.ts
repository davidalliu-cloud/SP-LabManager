import { gzipSync } from "node:zlib";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { backupEmailHtml, summariseBackup } from "@/lib/backup";
import { tiranaNow } from "@/lib/daily-tasks";
import type { LabState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_ROW_ID = "shared-lab-state";

/** How many weekly snapshots stay in the database. A quarter of history. */
const KEEP_SNAPSHOTS = 12;

/**
 * Graph accepts a 4 MB message; a simple attachment must stay well inside it.
 * Below this the data goes as plain JSON, which anyone can open. Above it the
 * file is gzipped rather than dropped — a backup that stops arriving because
 * the lab got busy is the one failure this must not have.
 */
const PLAIN_JSON_LIMIT_BYTES = 3_000_000;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get("authorization") === `Bearer ${secret}`) return true;
  return new URL(request.url).searchParams.get("key") === secret;
}

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Writing a backup row and pruning old ones needs the service role; the anon
  // key would be silently blocked by RLS and the backup would look successful.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url, key, { auth: { persistSession: false } });
}

async function getGraphToken() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing MS_TENANT_ID / MS_CLIENT_ID / MS_CLIENT_SECRET.");
  }
  const response = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials"
    })
  });
  if (!response.ok) throw new Error(`Graph token error ${response.status}: ${await response.text()}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

// Same shared mailbox the daily digest already sends from.
async function sendWithAttachment(params: {
  to: string[];
  subject: string;
  html: string;
  fileName: string;
  contentType: string;
  contentBase64: string;
}) {
  const mailbox = process.env.MS_SENDER_MAILBOX || "njoftime@sarpandlab.al";
  const token = await getGraphToken();
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: {
          subject: params.subject,
          body: { contentType: "HTML", content: params.html },
          toRecipients: params.to.map((address) => ({ emailAddress: { address } })),
          attachments: [
            {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: params.fileName,
              contentType: params.contentType,
              contentBytes: params.contentBase64
            }
          ]
        },
        // Kept in Sent Items: a second copy of every backup, in the mailbox,
        // independent of whether the recipient deletes theirs.
        saveToSentItems: "true"
      })
    }
  );
  if (!response.ok) throw new Error(`Graph sendMail error ${response.status}: ${await response.text()}`);
}

function recipients() {
  const configured = (process.env.BACKUP_RECIPIENTS || "d.alliu@sarpandlab.al")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
  return Array.from(new Set(configured));
}

/**
 * Weekly backup of the whole lab record.
 *
 * Two copies, because they fail differently: a snapshot row in the database,
 * which makes an accidental deletion a one-statement undo, and an emailed file,
 * which survives the database itself being lost. Neither is much use alone.
 *
 * ?dryRun=1 builds everything and reports what it would do, without writing a
 * snapshot or sending mail. ?force=1 ignores the day-of-week guard.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const force = params.get("force") === "1";
  const dryRun = params.get("dryRun") === "1";

  const now = tiranaNow();
  // The cron fires Sunday in UTC, which is still Sunday in Tirana at that hour,
  // so this guard only catches a manual or misconfigured trigger.
  const isSunday = new Date(`${now.date}T00:00:00Z`).getUTCDay() === 0;
  if (!force && !dryRun && !isSunday) {
    return NextResponse.json({ ok: true, skipped: "not-sunday", date: now.date });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("app_state")
    .select("state")
    .eq("id", STATE_ROW_ID)
    .maybeSingle();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? "State not found" }, { status: 500 });
  }

  const state = data.state as Partial<LabState>;
  const summary = summariseBackup(state);

  // A backup of nothing would quietly replace a good snapshot with an empty
  // one, and the failure would only surface the day it was needed.
  if (summary.samples === 0 && summary.reports === 0) {
    return NextResponse.json({ ok: false, error: "Refusing to back up an empty state." }, { status: 500 });
  }

  const backupId = `weekly-${now.date}`;
  const json = Buffer.from(JSON.stringify(state), "utf8");
  const compress = json.byteLength > PLAIN_JSON_LIMIT_BYTES;
  const payload = compress ? gzipSync(json) : json;
  const fileName = `sarp-lab-backup-${now.date}.json${compress ? ".gz" : ""}`;
  const contentType = compress ? "application/gzip" : "application/json";

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      backupId,
      date: now.date,
      summary,
      fileName,
      bytes: payload.byteLength,
      compressed: compress,
      recipients: recipients()
    });
  }

  // Snapshot first. If the mail fails, the database copy still exists, and the
  // error below tells us the offsite copy is the part that needs attention.
  const { error: snapshotError } = await supabase.from("app_state_backups").upsert({
    id: backupId,
    source_id: STATE_ROW_ID,
    note: `Weekly automatic backup — ${summary.samples} samples, ${summary.tests} tests, ${summary.reports} reports.`,
    state
  });
  if (snapshotError) {
    return NextResponse.json({ ok: false, error: `Snapshot failed: ${snapshotError.message}` }, { status: 500 });
  }

  // Keep the most recent weekly snapshots; one-off manual backups taken by hand
  // are left alone, so a deliberate pre-migration copy is never pruned away.
  const { data: weekly } = await supabase
    .from("app_state_backups")
    .select("id")
    .like("id", "weekly-%")
    .order("created_at", { ascending: false });
  const expired = (weekly ?? []).slice(KEEP_SNAPSHOTS).map((row) => row.id as string);
  if (expired.length > 0) {
    await supabase.from("app_state_backups").delete().in("id", expired);
  }

  const to = recipients();
  await sendWithAttachment({
    to,
    subject: `Kopja rezervë e laboratorit / Lab backup — ${now.date}`,
    html: backupEmailHtml({
      backupId,
      date: now.date,
      summary,
      attachmentName: fileName,
      keptSnapshots: KEEP_SNAPSHOTS
    }),
    fileName,
    contentType,
    contentBase64: payload.toString("base64")
  });

  return NextResponse.json({
    ok: true,
    backupId,
    date: now.date,
    summary,
    fileName,
    bytes: payload.byteLength,
    compressed: compress,
    emailedTo: to.length,
    prunedSnapshots: expired.length
  });
}
