import { NextResponse } from "next/server";
import { buildClientAnalysis, monthPeriod } from "@/lib/client-analysis";
import { currentPortalUser, readClientSlice } from "@/lib/portal/session";
import { buildSummaryPdf } from "@/lib/summary-pdf";

export const dynamic = "force-dynamic";

/**
 * The client's own summary, built when they ask for it.
 *
 * This is the whole point of the portal over a link to a stored file: the sheet
 * is produced from the register as it stands at the moment of the request, so
 * nobody at the laboratory has to remember to regenerate it.
 *
 * Without prices. A client's self-service copy says what was tested and when,
 * not what it cost — the priced version is the one the laboratory generates and
 * sends with an invoice, where someone has looked at the figures first.
 *
 * Without charts, too: those are photographed from a rendered page in the
 * laboratory's own app, and there is no page to photograph on a server. Every
 * table and figure is drawn as text either way.
 */
export async function GET(request: Request) {
  const user = await currentPortalUser();
  if (!user) return new NextResponse("Jo i autorizuar.", { status: 401 });

  const slice = await readClientSlice(user.clientId);
  if (!slice) return new NextResponse("Nuk u gjet.", { status: 404 });

  const url = new URL(request.url);
  const fallback = monthPeriod();
  const from = url.searchParams.get("from") || fallback.from;
  const to = url.searchParams.get("to") || fallback.to;
  const period = from <= to ? { from, to } : { from: to, to: from };

  const analysis = buildClientAnalysis(slice, user.clientId, period);
  const blob = await buildSummaryPdf({
    analysis,
    issuedBy: "SARP & LAB sh.p.k.",
    charts: [],
    includePricing: false
  });

  const client = slice.clients[0];
  const name = `permbledhje-${client?.clientCode ?? "klient"}-${period.from}-${period.to}.pdf`;
  return new NextResponse(await blob.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "no-store"
    }
  });
}
