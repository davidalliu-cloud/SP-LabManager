import { NextResponse } from "next/server";
import { currentPortalUser, readClientSlice, serviceClient } from "@/lib/portal/session";
import { clientVisibleReports } from "@/lib/portal/view";

export const dynamic = "force-dynamic";

/**
 * One of this client's finished reports.
 *
 * The id is checked against the slice the signed-in account is entitled to, not
 * against the register, so guessing another client's report id gets the same
 * answer as asking for one that does not exist: a report belonging to someone
 * else was never in the list this check runs over.
 *
 * The file is signed again on every visit rather than forwarding the signature
 * stored against the report. That stored one is minted when the PDF is
 * generated and lasts a year, so the oldest reports in a client's register
 * would begin to 403 while still being listed as available — and the portal is
 * the one place a client goes back to a report long after it was sent. The
 * staff short link /r/<code> re-signs for the same reason.
 *
 * `?download=1` asks for the file as a saved copy rather than a page to read,
 * which is also what gives it a name: Storage writes the filename into the
 * signature, so the engineer saves "Raport 7212-26.pdf" instead of
 * "7212_26-1793617573808.pdf". Without it the report opens in the browser's own
 * viewer, which is what someone working down the register wants.
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentPortalUser();
  if (!user) return new NextResponse("Jo i autorizuar.", { status: 401 });

  const slice = await readClientSlice(user.clientId);
  if (!slice) return new NextResponse("Nuk u gjet.", { status: 404 });

  const { id } = await context.params;
  const report = clientVisibleReports(slice).find((row) => row.id === id);
  if (!report?.pdfUrl) return new NextResponse("Nuk u gjet.", { status: 404 });

  const asDownload = new URL(request.url).searchParams.get("download") === "1";
  const storedPath = report.pdfUrl.match(/\/reports\/([^?]+)/);
  const supabase = serviceClient();

  if (storedPath && supabase) {
    const { data: signed } = await supabase.storage
      .from("reports")
      .createSignedUrl(
        decodeURIComponent(storedPath[1]),
        60 * 10,
        asDownload ? { download: `Raport ${report.reportNumber.replace("/", "-")}.pdf` } : undefined
      );
    if (signed?.signedUrl) return NextResponse.redirect(signed.signedUrl, { status: 302 });
  }

  // Re-signing failed (the object was moved, or Storage is unhappy). The stored
  // link is still the client's report, so send them there rather than nowhere.
  return NextResponse.redirect(report.pdfUrl, { status: 302 });
}
