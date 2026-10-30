import { NextResponse } from "next/server";
import { currentPortalUser, readClientSlice } from "@/lib/portal/session";
import { clientVisibleReports } from "@/lib/portal/view";

export const dynamic = "force-dynamic";

/**
 * One of this client's finished reports.
 *
 * The id is checked against the slice the signed-in account is entitled to, not
 * against the register, so guessing another client's report id gets the same
 * answer as asking for one that does not exist: a report belonging to someone
 * else was never in the list this check runs over.
 */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await currentPortalUser();
  if (!user) return new NextResponse("Jo i autorizuar.", { status: 401 });

  const slice = await readClientSlice(user.clientId);
  if (!slice) return new NextResponse("Nuk u gjet.", { status: 404 });

  const { id } = await context.params;
  const report = clientVisibleReports(slice).find((row) => row.id === id);
  if (!report?.pdfUrl) return new NextResponse("Nuk u gjet.", { status: 404 });

  return NextResponse.redirect(report.pdfUrl, { status: 302 });
}
