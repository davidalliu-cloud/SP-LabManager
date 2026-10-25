import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { signedInEmail } from "@/lib/api-auth";
import { inflateEntry, readZip, replaceEntry, writeZip } from "@/lib/docx-zip";
import { OFFER_KINDS, OFFER_TEMPLATES, type OfferKind } from "@/lib/offer-fields";
import { fillOfferDocument, offerFileName, remainingMarkers, type OfferValues } from "@/lib/offer-fill";
import { canGenerateOffers } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Generates one offer from its Word template.
 *
 * Who may call this is settled here, against the caller's bearer token, before
 * anything else happens. The page hides its own button from everyone else, but
 * a route is reachable by anyone who knows its path, and what comes back is a
 * document on SARP & LAB letterhead carrying the accreditation number — so
 * hiding the button is not a control, it is only tidiness.
 *
 * The templates are read from `offer-templates/` at the project root, which
 * nothing serves. They used to sit in `public/`, where the full price list was
 * downloadable by anyone who guessed the file name. next.config.ts traces them
 * into the function bundle so the read works once deployed.
 *
 * The response is the .docx itself, so the offer arrives in Word ready to be
 * read over, signed and sent. If any marker is still unfilled the route sends
 * back the list instead of the document — an offer with `[PLOTËSO]` in it
 * reaching a client is worse than one that failed to generate.
 */

const TEMPLATE_DIRECTORY = "offer-templates";

async function loadTemplate(fileName: string): Promise<Buffer> {
  // Joined from the declaration, never from the request, so a crafted `kind`
  // cannot walk out of the directory.
  return readFile(path.join(process.cwd(), TEMPLATE_DIRECTORY, path.basename(fileName)));
}

type GenerateRequest = {
  kind?: string;
  values?: OfferValues;
};

const isOfferKind = (value: unknown): value is OfferKind =>
  typeof value === "string" && (OFFER_KINDS as string[]).includes(value);

export async function POST(request: Request) {
  const caller = await signedInEmail(request);
  if ("error" in caller) {
    return NextResponse.json({ ok: false, error: caller.error }, { status: 401 });
  }
  if (!canGenerateOffers(caller.email)) {
    return NextResponse.json({ ok: false, error: "Nuk jeni i autorizuar të përgatitni oferta." }, { status: 403 });
  }

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
    archive = await loadTemplate(template.templateFile);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "arsye e panjohur";
    return NextResponse.json(
      { ok: false, error: `Shablloni ${template.templateFile} nuk u lexua: ${reason}` },
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
