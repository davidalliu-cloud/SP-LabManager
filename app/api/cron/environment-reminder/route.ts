import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { tiranaNow } from "@/lib/daily-tasks";
import { isWorkingDay } from "@/lib/environment";
import { buildReminderDigest, reminderEmailHtml } from "@/lib/environment-reminder";
import type { LabState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_ROW_ID = "shared-lab-state";
/** Its own marker, so it cannot collide with the daily task digest's. */
const LOG_ROW_ID = "environment-reminder-log";

/** Fatime Laçi keeps the register; the two managers are copied. */
const DEFAULT_TO = "f.laci@sarpandlab.al";
const DEFAULT_CC = "d.alliu@sarpandlab.al,a.duzha@sarpandlab.al";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (request.headers.get("authorization") === `Bearer ${secret}`) return true;
  return new URL(request.url).searchParams.get("key") === secret;
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
  if (!response.ok) throw new Error(`Graph token error ${response.status}: ${await response.text()}`);
  return ((await response.json()) as { access_token: string }).access_token;
}

const addresses = (value: string) =>
  value
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
    .map((address) => ({ emailAddress: { address } }));

// Same shared mailbox the other two schedules send from.
async function sendMail(params: { to: string; cc: string; subject: string; html: string }) {
  const mailbox = process.env.MS_SENDER_MAILBOX || "njoftime@sarpandlab.al";
  const token = await getGraphToken();
  const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: {
        subject: params.subject,
        body: { contentType: "HTML", content: params.html },
        toRecipients: addresses(params.to),
        ccRecipients: addresses(params.cc)
      },
      saveToSentItems: "false"
    })
  });
  if (!response.ok) throw new Error(`Graph sendMail error ${response.status}: ${await response.text()}`);
}

/**
 * The 08:00 reminder to take the day's ambient readings.
 *
 * Monday to Saturday. Sunday is not a working day, so no reading is due and no
 * reminder is sent — a message that arrives on a day nothing is expected is the
 * fastest way to teach someone to stop reading it.
 *
 * ?dryRun=1 builds the digest and returns it without sending. ?force=1 ignores
 * the 08:00 window and the once-a-day guard.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const force = params.get("force") === "1";
  const dryRun = params.get("dryRun") === "1";

  const now = tiranaNow();

  if (!force && !dryRun && !isWorkingDay(new Date(`${now.date}T00:00:00`))) {
    return NextResponse.json({ ok: true, skipped: "sunday", date: now.date });
  }

  // DST-proof: two crons fire (06:00 and 07:00 UTC) and only the one landing in
  // the lab's 08:00 hour proceeds — the same arrangement as the task digest.
  if (!force && !dryRun && now.hour !== 8) {
    return NextResponse.json({ ok: true, skipped: "outside-window", localTime: `${now.hour}:${now.minute}` });
  }

  const supabase = supabaseServer();

  if (!force && !dryRun) {
    const { data: log } = await supabase.from("app_state").select("state").eq("id", LOG_ROW_ID).maybeSingle();
    if ((log?.state as { date?: string } | null)?.date === now.date) {
      return NextResponse.json({ ok: true, skipped: "already-sent", date: now.date });
    }
  }

  const { data, error } = await supabase.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? "State not found" }, { status: 500 });
  }

  const state = data.state as Partial<LabState>;
  const digest = buildReminderDigest(state.environmentReadings ?? [], now.date);

  const to = process.env.ENVIRONMENT_REMINDER_TO || DEFAULT_TO;
  const cc = process.env.ENVIRONMENT_REMINDER_CC || DEFAULT_CC;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sarp-lab-manager.com";

  if (dryRun) {
    return NextResponse.json({ ok: true, dryRun: true, to, cc, ...digest });
  }

  await sendMail({
    to,
    cc,
    subject: digest.subject,
    html: reminderEmailHtml(digest, appUrl, (state.environmentReadings ?? []).length > 0)
  });

  await supabase
    .from("app_state")
    .upsert({ id: LOG_ROW_ID, state: { date: now.date }, updated_at: new Date().toISOString() });

  return NextResponse.json({
    ok: true,
    sent: true,
    date: now.date,
    outstanding: digest.outstanding.length,
    previousMissing: digest.previousMissing.length,
    to,
    cc
  });
}
