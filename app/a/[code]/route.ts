import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { parseAnalysisShareCode } from "@/lib/analysis-link";
import type { LabState } from "@/lib/types";

/**
 * The short link a client opens for their summary: /a/K05-9f2c41a7
 *
 * Finds the summary by token, checks the client code in front of it agrees, and
 * sends the browser on to the stored PDF.
 *
 * A wrong token answers exactly as an unknown one does, so the response cannot
 * be used to find out which summaries exist — and a summary lists another
 * company's projects and volumes, which is worth more care than a single result.
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
  const parsed = parseAnalysisShareCode(code);
  if (!parsed) return notFound();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Serves people who are not signed in, so it reads as the service role — the
  // same as the report link and the cron jobs, and for the same reason.
  if (!url || !serviceKey) {
    return new NextResponse("Shërbimi nuk është konfiguruar.", { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  if (error || !data?.state) return notFound();

  const state = data.state as Partial<LabState>;
  const record = (state.clientAnalyses ?? []).find(
    (row) => row.shareToken?.toLowerCase() === parsed.token
  );
  if (!record?.pdfUrl) return notFound();

  const client = (state.clients ?? []).find((row) => row.id === record.clientId);
  if (!client || client.clientCode.replace(/[^A-Za-z0-9]/g, "").toUpperCase() !== parsed.clientCode) {
    return notFound();
  }

  return NextResponse.redirect(record.pdfUrl, { status: 302 });
}
