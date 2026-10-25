import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { inflateEntry, readZip, replaceEntry, writeZip } from "@/lib/docx-zip";
import { OFFER_KINDS, OFFER_TEMPLATES, type OfferKind } from "@/lib/offer-fields";
import { fillOfferDocument, offerFileName, remainingMarkers, type OfferValues } from "@/lib/offer-fill";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Generates one offer from its Word template.
 *
 * The template comes from `public/offer-templates`, read off disk and, failing
 * that, fetched over this app's own origin. Disk first on purpose: a preview
 * deployment sits behind Vercel deployment protection, where a function
 * fetching its own domain is answered with a sign-in page rather than the
 * file. next.config.ts traces the templates into the function bundle so the
 * disk read is the one that normally succeeds.
 *
 * The response is the .docx itself, so the offer arrives in Word ready to be
 * read over, signed and sent. If any marker is still unfilled the route sends
 * back the list instead of the document — an offer with `[PLOTËSO]` in it
 * reaching a client is worse than one that failed to generate.
 */

/** The template bytes: from the bundle if they are there, otherwise over HTTP. */
async function loadTemplate(file: string, requestUrl: string): Promise<Buffer> {
  try {
    return await readFile(path.join(process.cwd(), "public", file.replace(/^\//, "")));
  } catch {
    const response = await fetch(new URL(file, requestUrl), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
}

type GenerateRequest = {
  kind?: string;
  values?: OfferValues;
};

const isOfferKind = (value: unknown): value is OfferKind =>
  typeof value === "string" && (OFFER_KINDS as string[]).includes(value);

export async function POST(request: Request) {
  let body: GenerateRequest;
  try {
    body = (await request.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ ok: false, error: "Kërkesa nuk është JSON i vlefshëm." }, { status: 400 });
  }

  if (!isOfferKind(body.kind)) {
    return NextResponse.json({ ok: false, error: "Lloji i ofertës nuk është i njohur." }, { status: 400 });
  }

  const kind = body.kind;
  const values = body.values ?? {};
  const template = OFFER_TEMPLATES[kind];

  if (!String(values.offerNumber ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "Numri i ofertës është i detyrueshëm." }, { status: 400 });
  }

  let archive: Buffer;
  try {
    archive = await loadTemplate(template.file, request.url);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "arsye e panjohur";
    return NextResponse.json(
      { ok: false, error: `Shablloni ${template.file} nuk u lexua: ${reason}` },
      { status: 500 }
    );
  }

  try {
    const entries = readZip(archive);
    const document = entries.find((entry) => entry.name === "word/document.xml");
    if (!document) {
      return NextResponse.json({ ok: false, error: "Shablloni nuk përmban word/document.xml." }, { status: 500 });
    }

    const { xml, warnings } = fillOfferDocument(inflateEntry(document).toString("utf8"), kind, values);
    const unfilled = remainingMarkers(xml);
    if (unfilled.length) {
      return NextResponse.json(
        {
          ok: false,
          error: "Oferta nuk u gjenerua: në dokument kanë mbetur fusha të paplotësuara.",
          markers: unfilled,
          warnings
        },
        { status: 422 }
      );
    }

    const filled = writeZip(replaceEntry(entries, "word/document.xml", Buffer.from(xml, "utf8")));
    const name = offerFileName(kind, values);

    return new NextResponse(new Uint8Array(filled), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // The name carries the client's, so it can hold ë and ç. Only the
        // RFC 5987 form survives that; the plain one is the ASCII fallback.
        "Content-Disposition": `attachment; filename="${name.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(name)}`,
        "Content-Length": String(filled.length),
        "X-Offer-Warnings": String(warnings.length),
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gabim i panjohur gjatë gjenerimit.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
