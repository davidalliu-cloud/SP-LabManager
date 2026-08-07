import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildDailyDigest, tiranaNow } from "@/lib/daily-tasks";
import type { LabState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_ROW_ID = "shared-lab-state";
const LOG_ROW_ID = "daily-tasks-log"; // idempotency marker: last date we sent

// Verify the caller is the Vercel Cron trigger (Authorization: Bearer <secret>)
// or a manual test hit carrying ?key=<secret>. Requires CRON_SECRET to be set,
// so the endpoint is never open.
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const key = new URL(request.url).searchParams.get("key");
  return key === secret;
}

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars.");
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
  if (!response.ok) {
    throw new Error(`Graph token error ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

// Sends via Microsoft Graph as the njoftime@sarpandlab.al shared mailbox. The
// app registration's Mail.Send permission is scoped by an Exchange
// ApplicationAccessPolicy to only that mailbox (see setup notes).
async function sendViaGraph(to: string[], subject: string, html: string) {
  const mailbox = process.env.MS_SENDER_MAILBOX || "njoftime@sarpandlab.al";
  const token = await getGraphToken();
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: "HTML", content: html },
        toRecipients: to.map((address) => ({ emailAddress: { address } }))
      },
      saveToSentItems: "false"
    })
  });
  if (!response.ok) {
    throw new Error(`Graph sendMail error ${response.status}: ${await response.text()}`);
  }
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const force = params.get("force") === "1"; // ignore the 08:0x time guard
  const dryRun = params.get("dryRun") === "1"; // build the digest but do not send

  const now = tiranaNow();
  // DST-proof scheduling: two Vercel crons fire (06:05 and 07:05 UTC); only the
  // one landing in the lab's 08:00 hour proceeds. `force` bypasses this for tests.
  if (!force && now.hour !== 8) {
    return NextResponse.json({ ok: true, skipped: "outside-window", localTime: `${now.hour}:${now.minute}` });
  }

  const supabase = supabaseServer();

  // Idempotency: only one send per calendar day (guards the two cron entries and
  // any retries). Skipped when forcing/dry-running so testing always runs.
  if (!force && !dryRun) {
    const { data: log } = await supabase.from("app_state").select("state").eq("id", LOG_ROW_ID).maybeSingle();
    const lastDate = (log?.state as { date?: string } | null)?.date;
    if (lastDate === now.date) {
      return NextResponse.json({ ok: true, skipped: "already-sent", date: now.date });
    }
  }

  const { data, error } = await supabase.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? "State not found" }, { status: 500 });
  }

  const state = data.state as Partial<LabState>;
  const digest = buildDailyDigest(state, now.date);

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      date: digest.date,
      taskCount: digest.taskCount,
      testCount: digest.testCount,
      reportCount: digest.reportCount,
      recipients: digest.recipients,
      subject: digest.subject,
      groups: digest.groups,
      reports: digest.reports
    });
  }

  if (digest.taskCount === 0) {
    return NextResponse.json({ ok: true, skipped: "no-tasks", date: digest.date });
  }
  if (digest.recipients.length === 0) {
    return NextResponse.json({ ok: true, skipped: "no-recipients", date: digest.date });
  }

  await sendViaGraph(digest.recipients, digest.subject, digest.html);

  // Record today's send so the second cron entry / retries don't duplicate it.
  await supabase.from("app_state").upsert({ id: LOG_ROW_ID, state: { date: now.date }, updated_at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    sent: true,
    date: digest.date,
    taskCount: digest.taskCount,
    recipientCount: digest.recipients.length
  });
}
