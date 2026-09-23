import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { parseReportShareCode } from "@/lib/report-link";
import type { LabState } from "@/lib/types";

/**
 * The short link a client opens: /r/5926-26-9f2c41a7
 *
 * It finds the report by number, checks the token matches the one stored
 * against that report, and sends the browser on to the stored PDF. Nothing is
 * rendered here — the client sees their report, not this app.
 *
 * Deliberately open to anyone holding the link, because that is what a link
 * given to a client is for. The token is the credential: report numbers run in
 * sequence and would otherwise let anyone read the register a number at a time.
 *
 * A wrong or missing token answers exactly as an unknown report does, so the
 * response cannot be used to learn which report numbers exist.
 */
export const dynamic = "force-dynamic";

const STATE_ROW_ID = "shared-lab-state";

function notFound() {
  return new NextResponse(
    "Ky link nuk është i vlefshëm ose ka skaduar. / This link is not valid or has expired.",
    { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}

export async function GET(_request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const parsed = parseReportShareCode(code);
  if (!parsed) return notFound();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // The register refuses anonymous readers, and this route serves people who
  // are not signed in at all, so it reads as the service role — the same as the
  // send and cron routes, and for the same reason.
  if (!url || !serviceKey) {
    return new NextResponse("Shërbimi nuk është konfiguruar.", { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  if (error || !data?.state) return notFound();

  const reports = (data.state as Partial<LabState>).reports ?? [];
  const report = reports.find((row) => row.reportNumber === parsed.reportNumber);
  if (!report?.shareToken || !report.pdfUrl) return notFound();
  if (report.shareToken.toLowerCase() !== parsed.token) return notFound();
  // A report pulled back from the client should stop resolving; the link is the
  // issued copy, and a rejected report was never one.
  if (report.reportStatus === "Rejected") return notFound();

  return NextResponse.redirect(report.pdfUrl, { status: 302 });
}
