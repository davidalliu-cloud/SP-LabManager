import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MAX_TOTAL_PDF_BYTES, authoriseSender, pdfAttachment, sendMail } from "@/lib/graph-mail";
import type { LabState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends a client's monthly summary from njoftime@ with the PDF attached.
 *
 * The browser cannot do this: mailto cannot carry a file. It also should not
 * decide what is sent — the PDF and the recipient are read server-side from the
 * register, so the message that reaches a client is the document the lab filed,
 * not whatever a page had in memory.
 */

const STATE_ROW_ID = "shared-lab-state";

type SendRequest = {
  clientId: string;
  from: string;
  to: string;
  /** Route the mail to the sender instead of the client, to check it first. */
  testToSelf?: boolean;
};

export async function POST(request: Request) {
  const auth = await authoriseSender(request);
  if ("error" in auth) return NextResponse.json({ ok: false, error: auth.error }, { status: 403 });

  let payload: SendRequest;
  try {
    payload = (await request.json()) as SendRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }
  if (!payload.clientId || !payload.from || !payload.to) {
    return NextResponse.json({ ok: false, error: "Mungon klienti ose periudha." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json({ ok: false, error: "Shërbimi nuk është konfiguruar (mungon SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  if (error || !data?.state) {
    return NextResponse.json({ ok: false, error: "Nuk u lexua regjistri." }, { status: 502 });
  }

  const state = data.state as Partial<LabState>;
  const client = (state.clients ?? []).find((row) => row.id === payload.clientId);
  if (!client) return NextResponse.json({ ok: false, error: "Klienti nuk u gjet." }, { status: 404 });

  const record = (state.clientAnalyses ?? []).find(
    (row) => row.clientId === payload.clientId && row.from === payload.from && row.to === payload.to
  );
  if (!record?.pdfUrl) {
    return NextResponse.json(
      { ok: false, error: "Nuk ka PDF të ruajtur për këtë periudhë. Gjenerojeni së pari." },
      { status: 400 }
    );
  }

  const recipient = payload.testToSelf ? auth.email : (client.email ?? "").trim();
  if (!recipient) {
    return NextResponse.json({ ok: false, error: "Klienti nuk ka email të regjistruar." }, { status: 400 });
  }

  const name = `Permbledhje-${client.clientCode}-${payload.from}_${payload.to}`;
  const prepared = await pdfAttachment(record.pdfUrl, name);
  if ("error" in prepared) return NextResponse.json({ ok: false, error: prepared.error }, { status: 502 });
  if (prepared.bytes > MAX_TOTAL_PDF_BYTES) {
    return NextResponse.json(
      { ok: false, error: `PDF-ja i kalon ${(MAX_TOTAL_PDF_BYTES / 1_000_000).toFixed(1)} MB.` },
      { status: 413 }
    );
  }

  const subject = `Përmbledhje e punës laboratorike — ${client.clientName} — ${payload.from} / ${payload.to}`;
  const body = [
    "Pershendetje,",
    "",
    `Bashkengjitur permbledhja e punes laboratorike per periudhen ${payload.from} - ${payload.to}.`,
    "",
    "Me respekt,",
    "SARP & LAB sh.p.k."
  ].join("\n");

  try {
    await sendMail({ to: recipient, replyTo: auth.email, subject, body, attachments: [prepared.attachment] });
  } catch (sendError) {
    return NextResponse.json(
      { ok: false, error: sendError instanceof Error ? sendError.message : "Dërgimi dështoi." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    sentTo: recipient,
    testToSelf: Boolean(payload.testToSelf),
    attached: `${name}.pdf`,
    bytes: prepared.bytes
  });
}
