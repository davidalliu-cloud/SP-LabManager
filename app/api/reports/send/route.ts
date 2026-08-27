import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends approved reports to a client with the PDFs actually attached.
 *
 * mailto: cannot carry files - no mail client will attach one - so the browser
 * can never do this. Microsoft Graph can, using the Mail.Send application
 * permission the daily digest already uses, scoped by ApplicationAccessPolicy
 * to njoftime@sarpandlab.al.
 *
 * Mail therefore leaves as njoftime@, with Reply-To set to whoever pressed the
 * button so client replies land with them. Drafting into a personal mailbox for
 * review inside Outlook needs Mail.ReadWrite and that mailbox added to the
 * access policy; this route is deliberately independent of that.
 */

/** Graph rejects a request body over ~4 MB. Base64 inflates by ~4/3, so cap the
 *  raw total below that and say so rather than failing at the API. */
const MAX_TOTAL_PDF_BYTES = 2_800_000;

const ALLOWED_SENDERS = ["d.alliu@sarpandlab.al", "a.duzha@sarpandlab.al"];

type SendRequest = {
  reportIds: string[];
  to: string;
  subject: string;
  body: string;
  /** Route the mail to the caller instead of the client, to check the result
   *  before anything reaches a client. */
  testToSelf?: boolean;
};

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

/** Confirms the caller is signed in, and is one of the two people allowed to
 *  release a report. Never trust the browser's word for either. */
async function authorise(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { error: "Supabase is not configured." as const };

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Not signed in." as const };

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  const email = data?.user?.email?.trim().toLowerCase();
  if (error || !email) return { error: "Not signed in." as const };
  if (!ALLOWED_SENDERS.includes(email)) return { error: "You are not permitted to send reports." as const };
  return { email };
}

export async function POST(request: Request) {
  const auth = await authorise(request);
  if ("error" in auth) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 403 });
  }

  let payload: SendRequest;
  try {
    payload = (await request.json()) as SendRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const recipient = payload.testToSelf ? auth.email : (payload.to ?? "").trim();
  if (!recipient) return NextResponse.json({ ok: false, error: "No recipient address." }, { status: 400 });
  if (!payload.reportIds?.length) return NextResponse.json({ ok: false, error: "No reports selected." }, { status: 400 });

  // Read the reports server-side. The browser does not get to decide which file
  // is attached to which report number.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false }
  });
  const { data: reports, error: readError } = await supabase
    .from("app_reports")
    .select("id, report_number, report_status, pdf_url")
    .in("id", payload.reportIds);

  if (readError) return NextResponse.json({ ok: false, error: `Could not load reports: ${readError.message}` }, { status: 500 });
  if (!reports?.length) return NextResponse.json({ ok: false, error: "Those reports could not be found." }, { status: 404 });

  const notApproved = reports.filter((r) => r.report_status !== "Approved");
  if (notApproved.length) {
    return NextResponse.json(
      { ok: false, error: `Only approved reports can be sent. Not approved: ${notApproved.map((r) => r.report_number).join(", ")}` },
      { status: 400 }
    );
  }
  const missingPdf = reports.filter((r) => !r.pdf_url);
  if (missingPdf.length) {
    return NextResponse.json(
      { ok: false, error: `No stored PDF for: ${missingPdf.map((r) => r.report_number).join(", ")}. Generate it first.` },
      { status: 400 }
    );
  }

  // Fetch each PDF and base64 it for Graph.
  const attachments: Array<{ "@odata.type": string; name: string; contentType: string; contentBytes: string }> = [];
  let totalBytes = 0;
  for (const report of reports) {
    const file = await fetch(report.pdf_url as string);
    if (!file.ok) {
      return NextResponse.json({ ok: false, error: `Could not download the PDF for ${report.report_number}.` }, { status: 502 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    totalBytes += buffer.byteLength;
    if (totalBytes > MAX_TOTAL_PDF_BYTES) {
      return NextResponse.json(
        { ok: false, error: `Those reports total more than ${(MAX_TOTAL_PDF_BYTES / 1_000_000).toFixed(1)} MB. Send them in smaller batches.` },
        { status: 413 }
      );
    }
    attachments.push({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: `${report.report_number}.pdf`,
      contentType: "application/pdf",
      contentBytes: buffer.toString("base64")
    });
  }

  const mailbox = process.env.MS_SENDER_MAILBOX || "njoftime@sarpandlab.al";
  try {
    const token = await getGraphToken();
    const response = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(mailbox)}/sendMail`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: {
          subject: payload.subject,
          body: { contentType: "Text", content: payload.body },
          toRecipients: [{ emailAddress: { address: recipient } }],
          // Replies go to whoever pressed the button, not the notifications mailbox.
          replyTo: [{ emailAddress: { address: auth.email } }],
          attachments
        },
        saveToSentItems: "true"
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ ok: false, error: `Graph rejected the send (${response.status}): ${detail}` }, { status: 502 });
    }
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Send failed." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    sentTo: recipient,
    testToSelf: Boolean(payload.testToSelf),
    attached: attachments.map((a) => a.name),
    totalBytes
  });
}
