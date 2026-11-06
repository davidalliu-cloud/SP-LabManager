import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  MAX_RECIPIENTS,
  MAX_TOTAL_PDF_BYTES,
  authoriseSender,
  invalidRecipients,
  parseRecipients,
  sendMail,
  withoutDuplicates
} from "@/lib/graph-mail";

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

// The size cap, the sender allowlist, the sign-in check and the Graph token all
// live in lib/graph-mail now, shared with the client-summary send. One copy,
// because a second would be the one that quietly stops checking who may send.

type SendRequest = {
  reportIds: string[];
  /** One address or several, typed into the box or already split. */
  to: string | string[];
  /** Copied in: the office, the project manager, whoever else keeps the file. */
  cc?: string | string[];
  subject: string;
  body: string;
  /** Route the mail to the caller instead of the client, to check the result
   *  before anything reaches a client. */
  testToSelf?: boolean;
};

export async function POST(request: Request) {
  const auth = await authoriseSender(request);
  if ("error" in auth) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 403 });
  }

  let payload: SendRequest;
  try {
    payload = (await request.json()) as SendRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  // A test copy goes to the sender alone — copying the client on a trial run
  // is exactly what the trial run exists to avoid.
  const recipients = payload.testToSelf ? [auth.email] : parseRecipients(payload.to);
  const copies = payload.testToSelf ? [] : withoutDuplicates(parseRecipients(payload.cc), recipients);
  if (!recipients.length) return NextResponse.json({ ok: false, error: "No recipient address." }, { status: 400 });
  const malformed = invalidRecipients([...recipients, ...copies]);
  if (malformed.length) {
    return NextResponse.json(
      { ok: false, error: `Adresa e pavlefshme: ${malformed.join(", ")}` },
      { status: 400 }
    );
  }
  if (recipients.length + copies.length > MAX_RECIPIENTS) {
    return NextResponse.json(
      { ok: false, error: `Shumë marrës (${recipients.length + copies.length}); kufiri është ${MAX_RECIPIENTS}.` },
      { status: 400 }
    );
  }
  if (!payload.reportIds?.length) return NextResponse.json({ ok: false, error: "No reports selected." }, { status: 400 });

  // Read the reports server-side. The browser does not get to decide which file
  // is attached to which report number.
  // Service role only. The publishable key reads nothing from the register
  // now, and a send that silently found no reports would look to the sender
  // exactly like a send that went out.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ ok: false, error: "Shërbimi nuk është konfiguruar (mungon SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { persistSession: false }
  });
  // The shared JSON blob (app_state) is the single source of truth. The
  // normalized app_* tables are only a mirror kept by a DB trigger, and that
  // trigger has been disabled because re-syncing the whole blob on every save
  // was timing out and blocking all writes. So read reports straight from the
  // blob here rather than from app_reports, which can be stale or empty.
  const { data: stateRow, error: readError } = await supabase
    .from("app_state")
    .select("state")
    .eq("id", "shared-lab-state")
    .maybeSingle();

  if (readError) return NextResponse.json({ ok: false, error: `Could not load reports: ${readError.message}` }, { status: 500 });

  type BlobReport = { id?: string; reportNumber?: string; reportStatus?: string; pdfUrl?: string };
  const wanted = new Set(payload.reportIds);
  const blobReports = (stateRow?.state as { reports?: BlobReport[] } | null)?.reports ?? [];
  const reports = blobReports
    .filter((r) => r.id && wanted.has(r.id))
    .map((r) => ({ id: r.id!, report_number: r.reportNumber ?? r.id!, report_status: r.reportStatus, pdf_url: r.pdfUrl }));

  if (!reports.length) return NextResponse.json({ ok: false, error: "Those reports could not be found." }, { status: 404 });

  // Approved, or already sent and going out again. A report the client asks
  // for a second time is the same approved report; what must never go out is
  // one that has not been approved at all.
  const notSendable = reports.filter((r) => r.report_status !== "Approved" && r.report_status !== "Sent to Client");
  if (notSendable.length) {
    return NextResponse.json(
      { ok: false, error: `Only approved reports can be sent. Not approved: ${notSendable.map((r) => r.report_number).join(", ")}` },
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

  try {
    // Replies go to whoever pressed the button, not the notifications mailbox.
    await sendMail({
      to: recipients,
      cc: copies,
      replyTo: auth.email,
      subject: payload.subject,
      body: payload.body,
      attachments
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Send failed." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    sentTo: recipients.join(", "),
    copiedTo: copies.join(", "),
    testToSelf: Boolean(payload.testToSelf),
    attached: attachments.map((a) => a.name),
    totalBytes
  });
}
