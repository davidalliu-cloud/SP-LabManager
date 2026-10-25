/**
 * Filling an offer template.
 *
 * The output is the template itself with the markers replaced — same branding,
 * same tables, same table of contents — so what the client receives is the
 * Word file David already approved, and he can still edit it before sending.
 * That rules out redrawing the offer as HTML, and it means everything here is
 * string work on `word/document.xml`.
 *
 * Two details decide whether the result looks professional or looks filled in:
 *
 *   - Every marker sits in its own run carrying `<w:highlight w:val="yellow"/>`
 *     with bold and burgundy. Left alone, a finished offer would be a page of
 *     yellow boxes, so a filled run loses exactly those four properties and
 *     ends up matching the plain runs beside it.
 *   - A marker that resolves to nothing has its whole run deleted, and the
 *     space that preceded it goes with it — otherwise deleting a note leaves
 *     "kombëtare ." behind. When the marker opened the paragraph there is no
 *     preceding space to take, and the full stop that followed it is dropped
 *     instead.
 *
 * Nothing here trusts the declaration blindly: `fillOfferDocument` reports
 * every marker it could not account for, and the route refuses to return a
 * document when anything bracketed survives.
 */

import {
  GEOTECH_BOQ,
  DEFAULT_TRANSPORT_ZONE,
  GEOTECH_FIXED_LINES,
  GEOTECH_LAB_PROGRAMME,
  OFFER_TEMPLATES,
  albanianDate,
  money,
  type OfferKind,
  type OfferTemplate
} from "./offer-fields";
import { OFFER_CATALOGUE, catalogueByCode } from "./offer-catalogue";
import {
  BILL_NOTE_PRICES,
  BILL_NOTE_QUANTITIES,
  CATALOGUE_INTRO_SENTENCE,
  CATALOGUE_CLOSING_SENTENCE,
  ORDER_FORM_INTRO,
  fillOrderForm,
  pruneCatalogue,
  replaceSentence,
  writeBillOfQuantities,
  writeContacts,
  writeCatalogueQuantities,
  writeCataloguePrices
} from "./offer-tables";

export type OfferValues = Record<string, string>;

const VAT_RATE = 0.2;

/**
 * The employee directory, as the form carries it.
 *
 * The route has no access to the register — it is handed everything it needs —
 * so the names and addresses travel with the offer, as "Name=address" pairs.
 * They are stored with it too, which is right: the contacts printed on an
 * offer are the contacts that offer went out with, whoever has left since.
 */
export function encodeDirectory(people: { fullName: string; email: string }[]): string {
  return people
    .filter((person) => person.fullName.trim() && person.email.trim())
    .map((person) => `${person.fullName.trim()}=${person.email.trim()}`)
    .join(";");
}

/** Lower-cased name to address, for matching the names printed in the table. */
export function decodeDirectory(values: OfferValues): Map<string, string> {
  const byName = new Map<string, string>();
  for (const entry of String(values.directory ?? "").split(";")) {
    const at = entry.indexOf("=");
    if (at <= 0) continue;
    byName.set(entry.slice(0, at).trim().toLocaleLowerCase("sq-AL"), entry.slice(at + 1).trim());
  }
  return byName;
}

/* ------------------------------------------- the laboratory test selection */

/**
 * How the laboratory offer quotes its tests.
 *
 * "unit" leaves Section 9 as a price list and Section 12's order form blank
 * for the client to fill — the right shape when the scope is not yet known and
 * the client will order test by test. "quantity" quotes a specific job: the
 * quantities go into Section 9 and the order form comes out priced and
 * totalled.
 */
export type QuantityMode = "unit" | "quantity";

export function quantityMode(values: OfferValues): QuantityMode {
  return values.quantityMode === "quantity" ? "quantity" : "unit";
}

/** The ticked catalogue codes, in catalogue order. */
export function selectedCodes(values: OfferValues): string[] {
  const chosen = new Set(
    String(values.codes ?? "")
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean)
  );
  return OFFER_CATALOGUE.filter((test) => chosen.has(test.code)).map((test) => test.code);
}

/**
 * How many of a test the offer covers.
 *
 * A ticked test with the quantity box left alone is one of that test — which
 * is what it usually is, and what the box shows as its placeholder. Nobody
 * ticks a test meaning none of it.
 */
export function labQuantity(values: OfferValues, code: string): number {
  const typed = values[`qty.${code}`];
  if (typed === undefined || typed === "") return 1;
  return Math.max(0, numberOf(values, `qty.${code}`));
}

export interface LabLine {
  code: string;
  name: string;
  unit: string;
  /** The catalogue price, before any discount or typed-in figure. */
  listPrice: number;
  /** What this offer quotes. */
  price: number;
  /** How the catalogue prints the price, which is "Falas" for the free tests. */
  priceLabel: string;
  quantity: number;
  value: number;
}

/** The ticked tests with their quantities and line values. */
export function labLines(values: OfferValues): LabLine[] {
  // Three catalogue rows name the transport zone in their text, so when the
  // offer quotes a different zone the order form has to say the same thing the
  // price list does.
  const zone = String(values.transportZone ?? "").trim();
  const rezone = (text: string) =>
    zone && zone !== DEFAULT_TRANSPORT_ZONE ? text.split(DEFAULT_TRANSPORT_ZONE).join(zone) : text;

  return selectedCodes(values).map((code) => {
    const test = catalogueByCode.get(code)!;
    const quantity = labQuantity(values, code);
    return {
      code,
      name: rezone(test.name),
      unit: test.unit,
      listPrice: test.price,
      price: unitPrice(values, code, test.price),
      priceLabel: test.priceLabel,
      quantity,
      value: quantity * unitPrice(values, code, test.price)
    };
  });
}

export function labTotals(values: OfferValues): OfferTotals {
  const subtotal = labLines(values).reduce((sum, line) => sum + line.value, 0);
  const vat = subtotal * VAT_RATE;
  return { subtotal, vat, total: subtotal + vat };
}

/* ------------------------------------------------------------------ prices */

/**
 * What a line actually costs on this offer.
 *
 * Three things can set it, in order. A price typed against the line wins
 * outright — it is a decision, not a starting point, so the discount does not
 * then take another slice off it. Failing that the list price carries the
 * offer's discount. Failing that it is the list price as the template prints
 * it.
 *
 * Rounded to whole lekë, because every printed figure in both templates is.
 */
export function unitPrice(values: OfferValues, code: string, listPrice: number): number {
  const typed = values[`price.${code}`];
  if (typed !== undefined && typed !== "") return Math.max(0, Math.round(numberOf(values, `price.${code}`)));

  const discount = discountPercent(values);
  return Math.max(0, Math.round(listPrice * (1 - discount / 100)));
}

/** The offer's discount, clamped to something a price can survive. */
export function discountPercent(values: OfferValues): number {
  const raw = numberOf(values, "discountPercent");
  return Math.min(100, Math.max(0, raw));
}

/** True when the line carries a price typed against it rather than a derived one. */
export function hasPriceOverride(values: OfferValues, code: string): boolean {
  const typed = values[`price.${code}`];
  return typed !== undefined && typed !== "";
}

/** VAT-inclusive, the way the catalogue's second price column is worked out. */
export const withVat = (net: number) => Math.round(net * (1 + VAT_RATE));

/** A number typed into the form, or 0 when it is blank or not a number. */
export function numberOf(values: OfferValues, key: string): number {
  const parsed = Number(String(values[key] ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export interface BoqRow {
  code: string;
  description: string;
  unit: string;
  /** The template price, before any discount or typed-in figure. */
  listPrice: number;
  /** What this offer quotes. */
  price: number;
  quantity: number;
  value: number;
}

/** Section 10.1 with the quantities the form holds, or the derived defaults. */
export function geotechBoq(values: OfferValues): BoqRow[] {
  const get = (key: string) => numberOf(values, key);
  return GEOTECH_BOQ.map((line) => {
    const typed = values[`qty.${line.code}`];
    const quantity = typed === undefined || typed === "" ? line.derive(get) : numberOf(values, `qty.${line.code}`);
    const price = unitPrice(values, line.code, line.price);
    return { ...line, listPrice: line.price, price, quantity, value: quantity * price };
  });
}

/** The lump-sum rows, with their prices as this offer quotes them. */
export function geotechFixedLines(values: OfferValues): BoqRow[] {
  return GEOTECH_FIXED_LINES.map((line) => {
    const price = unitPrice(values, line.code, line.price);
    return { ...line, listPrice: line.price, price, quantity: 1, value: price };
  });
}

/** Section 2.1, the orientative laboratory programme, with its quantities. */
export function geotechLabProgramme(values: OfferValues): { key: string; label: string; quantity: number }[] {
  const get = (key: string) => numberOf(values, key);
  return GEOTECH_LAB_PROGRAMME.map((row) => {
    const typed = values[row.key];
    return {
      key: row.key,
      label: row.label,
      quantity: typed === undefined || typed === "" ? row.derive(get) : numberOf(values, row.key)
    };
  });
}

const LAB_PROGRAMME_KEYS = new Set(GEOTECH_LAB_PROGRAMME.map((row) => row.key));

export interface OfferTotals {
  subtotal: number;
  vat: number;
  total: number;
}

export function geotechTotals(values: OfferValues): OfferTotals {
  const lines = [...geotechFixedLines(values), ...geotechBoq(values)];
  const subtotal = lines.reduce((sum, row) => sum + row.value, 0);
  const vat = subtotal * VAT_RATE;
  return { subtotal, vat, total: subtotal + vat };
}

/**
 * What a replacement key is worth.
 *
 * Keys beginning `@` are computed; the rest come straight from the form. A
 * missing key resolves to the empty string, which deletes its run — a field
 * left blank should leave no trace, not an empty yellow box.
 */
export function resolveOfferValue(template: OfferTemplate, values: OfferValues, key: string): string {
  if (LAB_PROGRAMME_KEYS.has(key)) {
    const row = geotechLabProgramme(values).find((item) => item.key === key);
    return row ? money(row.quantity) : "";
  }

  if (!key.startsWith("@")) {
    const typed = String(values[key] ?? "").trim();
    if (typed) return typed;

    // A field that is empty has its run deleted, which is right for an
    // optional note at the end of a sentence and wrong for a number in the
    // middle of one: clearing the variation threshold would otherwise leave
    // "Punimet shtesë mbi% të vlerës". A field that declares a starting value
    // falls back to it, because that value is what the template itself said.
    return template.fields.find((field) => field.key === key)?.value ?? "";
  }

  if (key === "@offerRef") return `SL-OF-${String(values.offerNumber ?? "").trim()}/2026`;
  if (key === "@offerDate") return albanianDate(String(values.offerDate ?? ""));
  if (key === "@priceValidity") return albanianDate(String(values.priceValidity ?? ""));
  if (key === "@frameworkThreshold") return money(numberOf(values, "frameworkThreshold"));
  if (key === "@zoneOutside") return `jashtë zonës ${String(values.transportZone ?? "").trim()}`;

  if (template.kind === "geotech") {
    if (key === "@totalMetres") return money(numberOf(values, "boreholeCount") * numberOf(values, "boreholeDepth"));

    const totals = geotechTotals(values);
    if (key === "@subtotal") return money(totals.subtotal);
    if (key === "@vat") return money(totals.vat);
    if (key === "@totalWithVat") return money(totals.total);

    const quantity = /^@qty\.(.+)$/.exec(key);
    const lineValue = /^@value\.(.+)$/.exec(key);
    if (quantity || lineValue) {
      const code = (quantity ?? lineValue)![1];
      const row = geotechBoq(values).find((item) => item.code === code);
      if (!row) return "";
      return money(quantity ? row.quantity : row.value);
    }
  }

  return "";
}

/* ---------------------------------------------------------------- xml bits */

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FIELD_RUN = '<w:highlight w:val="yellow"/>';

/** The four properties that mark a run as "fill me in". */
function clearFieldStyling(run: string) {
  return run
    .replace(/<w:highlight w:val="yellow"\/>/g, "")
    .replace(/<w:b\/>/g, "")
    .replace(/<w:bCs\/>/g, "")
    .replace(/<w:color w:val="7A0000"\/>/g, "")
    .replace(/<w:rPr><\/w:rPr>/g, "");
}

/** The `<w:r>` opening tag at or before `at`, skipping `<w:rPr>` and friends. */
function runStartBefore(xml: string, at: number) {
  let index = at + 4;
  for (;;) {
    index = xml.lastIndexOf("<w:r", index - 1);
    if (index < 0) return -1;
    const next = xml.charAt(index + 4);
    if (next === ">" || next === " ") return index;
  }
}

/**
 * Replace each occurrence of `find`, in document order, with whatever
 * `valueAt` returns for that occurrence. Returning `null` leaves the
 * occurrence alone, which is how a declaration that names fewer fields than
 * there are occurrences gets reported rather than silently filling the rest.
 */
function replaceMarker(xml: string, find: string, valueAt: (index: number) => string | null) {
  let out = "";
  let cursor = 0;
  let index = 0;

  for (;;) {
    const at = xml.indexOf(find, cursor);
    if (at < 0) break;

    const value = valueAt(index);
    index += 1;

    if (value === null) {
      out += xml.slice(cursor, at + find.length);
      cursor = at + find.length;
      continue;
    }

    const runStart = runStartBefore(xml, at);
    const runEnd = xml.indexOf("</w:r>", at);

    // A marker outside a run, or sharing a run with an earlier replacement, is
    // substituted as plain text: no styling to clear and no run to delete.
    if (runStart < cursor || runEnd < 0) {
      out += xml.slice(cursor, at) + escapeXml(value);
      cursor = at + find.length;
      continue;
    }

    const runAfter = runEnd + "</w:r>".length;
    const run = xml.slice(runStart, runAfter);
    const isFieldRun = run.includes(FIELD_RUN);
    out += xml.slice(cursor, runStart);
    cursor = runAfter;

    if (value !== "") {
      const filled = run.replace(find, escapeXml(value));
      out += isFieldRun ? clearFieldStyling(filled) : filled;
      continue;
    }

    // Nothing to say: drop the run, and take the space in front of it with it.
    const trimmed = out.replace(/ (<\/w:t><\/w:r>)$/, "$1");
    if (trimmed !== out) {
      out = trimmed;
      continue;
    }

    // There was no space, so the marker opened its paragraph and the
    // punctuation that followed it would now open the sentence. Step over
    // that punctuation by copying the next run's opening tags without it.
    const opening = /^(<w:r(?:\s[^>]*)?>(?:<w:rPr>[\s\S]*?<\/w:rPr>)?<w:t(?:\s[^>]*)?>)[.,;:]\s+/.exec(
      xml.slice(cursor)
    );
    if (opening) {
      out += opening[1];
      cursor += opening[0].length;
    }
  }

  return { xml: out + xml.slice(cursor), count: index };
}

export interface FillResult {
  xml: string;
  /** Markers the declaration did not account for, and counts that did not match. */
  warnings: string[];
}

/**
 * Fill `word/document.xml` for one offer.
 *
 * Declared replacements run first, longest-wrapped markers before the bare
 * ones. Whatever field run survives that is a price in the catalogue: the
 * brackets come off and the yellow goes, which is the whole of what the price
 * list needs. Anything left bracketed after that is reported.
 */
export function fillOfferDocument(xml: string, kind: OfferKind, values: OfferValues): FillResult {
  const template = OFFER_TEMPLATES[kind];
  const warnings: string[] = [];
  let working = xml;

  for (const replacement of template.replacements) {
    const expected = "fields" in replacement ? replacement.fields.length : null;

    const valueAt = (index: number): string | null => {
      if ("text" in replacement) return replacement.text;
      if ("field" in replacement) return resolveOfferValue(template, values, replacement.field);
      const key = replacement.fields[index];
      return key === undefined ? null : resolveOfferValue(template, values, key);
    };

    const result = replaceMarker(working, replacement.find, valueAt);
    working = result.xml;

    if (result.count === 0) {
      warnings.push(`Shënuesi "${replacement.find}" nuk u gjet në shabllon.`);
    } else if (expected !== null && result.count !== expected) {
      warnings.push(
        `Shënuesi "${replacement.find}" shfaqet ${result.count} herë, ndërsa pritej ${expected} herë.`
      );
    }
  }

  // The price catalogue, and the safety net: no yellow bracket reaches a client.
  working = working.replace(/<w:r(?:\s[^>]*)?>[\s\S]*?<\/w:r>/g, (run) => {
    if (!run.includes(FIELD_RUN)) return run;
    const stripped = clearFieldStyling(run).replace(
      /(<w:t(?:\s[^>]*)?>)\[([^[\]]*)\](<\/w:t>)/,
      "$1$2$3"
    );
    const inner = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/.exec(run);
    const text = inner ? inner[1] : "";
    if (!/^\[[\d,.\s]*\]$/.test(text)) {
      warnings.push(`Shënuesi "${text}" nuk kishte vlerë të caktuar dhe u lanë vetëm kllapat jashtë.`);
    }
    return stripped;
  });

  const discount = discountPercent(values);

  // Both templates print the lab's general inbox against every name in the
  // contacts table, so a client replying to the offer reaches nobody in
  // particular.
  const directory = decodeDirectory(values);
  if (directory.size) {
    const contacts = writeContacts(working, directory);
    working = contacts.xml;
    warnings.push(...contacts.warnings);
  }

  // The tables come last, once every marker in them has been resolved: pruning
  // or repricing first would lose rows the declared counts still expect.
  if (kind === "geotech") {
    const lines = [
      ...geotechFixedLines(values).map((row) => ({
        code: row.code,
        price: money(row.price),
        // Printed rather than filled, so it has to be rewritten with the price.
        value: money(row.value)
      })),
      ...geotechBoq(values).map((row) => ({ code: row.code, price: money(row.price) }))
    ];
    const repriced = [...geotechFixedLines(values), ...geotechBoq(values)].some(
      (row) => row.price !== row.listPrice
    );

    if (repriced) {
      const bill = writeBillOfQuantities(working, lines);
      working = bill.xml;
      warnings.push(...bill.warnings);
    }

    // The note claims the prices are the standard 2026 ones. Once they are
    // discounted that is no longer true, and a client reading it would think
    // they had been quoted list.
    if (discount > 0) {
      const note = replaceSentence(
        working,
        BILL_NOTE_PRICES,
        `çmimet njësi përmbajnë një zbritje prej ${money(discount)}% ndaj çmimeve standarde të SARP & LAB për vitin 2026 dhe jepen pa TVSH.`
      );
      working = note.xml;
      if (!note.replaced) warnings.push("Shënimi i çmimeve nën Tabelën 10.1 nuk u gjet për t'u përshtatur.");
    }

    // And it tells the reader the yellow fields get filled in per project,
    // which was a note to whoever held the template.
    const filled = replaceSentence(working, BILL_NOTE_QUANTITIES, "Vlera e çdo rreshti = sasia × çmimi njësi.");
    working = filled.xml;
    if (!filled.replaced) warnings.push("Shënimi i sasive nën Tabelën 10.1 nuk u gjet për t'u përshtatur.");
  }

  if (kind === "lab") {
    const codes = selectedCodes(values);
    if (codes.length) {
      const pruned = pruneCatalogue(working, new Set(codes));
      working = pruned.xml;
      warnings.push(...pruned.warnings);

      // Both price columns of the surviving rows, whether or not quantities
      // are quoted: a discounted offer that still prints list prices gives the
      // discount away for nothing.
      const repriced = labLines(values).filter(
        (line) => line.price !== line.listPrice && /\d/.test(line.priceLabel)
      );
      if (repriced.length) {
        working = writeCataloguePrices(
          working,
          new Map(repriced.map((line) => [line.code, { net: money(line.price), gross: money(withVat(line.price)) }]))
        );
      }

      if (discount > 0) {
        const note = replaceSentence(
          working,
          CATALOGUE_CLOSING_SENTENCE,
          `Çmimet e mëposhtme përmbajnë një zbritje prej ${money(discount)}% ndaj çmimeve standarde të vitit 2026. ${CATALOGUE_CLOSING_SENTENCE}`
        );
        working = note.xml;
        if (!note.replaced) warnings.push("Teksti i çmimeve në Seksionin 9 nuk u gjet për t'u përshtatur.");
      }

      if (quantityMode(values) === "quantity") {
        const lines = labLines(values).filter((line) => line.quantity > 0);
        working = writeCatalogueQuantities(
          working,
          new Map(lines.map((line) => [line.code, money(line.quantity)]))
        );

        const totals = labTotals(values);
        const form = fillOrderForm(
          working,
          lines.map((line) => ({
            code: line.code,
            description: line.name,
            quantity: money(line.quantity),
            unitPrice: /\d/.test(line.priceLabel) ? money(line.price) : line.priceLabel,
            value: money(line.value)
          })),
          { subtotal: money(totals.subtotal), vat: money(totals.vat), total: money(totals.total) }
        );
        working = form.xml;
        warnings.push(...form.warnings);

        // The two sentences that ask the client to pick the tests and write in
        // the quantities, which this offer has already done for them.
        const intro = replaceSentence(
          working,
          ORDER_FORM_INTRO,
          "Tabela 12.1 përmban testimet e porositura, sasitë dhe vlerën e tyre. " +
            "Konfirmojeni porosinë me nënshkrim dhe dërgojeni formularin me e-mail në info@sarpandlab.al."
        );
        working = intro.xml;
        if (!intro.replaced) warnings.push("Teksti hyrës i Formularit të Porosisë nuk u gjet për t'u përshtatur.");

        const preamble = replaceSentence(
          working,
          CATALOGUE_INTRO_SENTENCE,
          "Sasitë e parashikuara janë shënuar në kolonën e fundit dhe përmblidhen në Formularin e Porosisë në Seksionin 12."
        );
        working = preamble.xml;
        if (!preamble.replaced) warnings.push("Teksti hyrës i Seksionit 9 nuk u gjet për t'u përshtatur.");
      }
    }
  }

  return { xml: working, warnings };
}

/**
 * What the offer is worth, or null when it does not name a figure.
 *
 * A laboratory offer quoting unit prices only has no total — the client has
 * not said how many of anything they want yet — and the register shows that
 * as a dash rather than as zero.
 */
export function offerTotals(kind: OfferKind, values: OfferValues): OfferTotals | null {
  if (kind === "geotech") return geotechTotals(values);
  return quantityMode(values) === "quantity" ? labTotals(values) : null;
}

/** Any bracketed marker still in the document text, for the final check. */
export function remainingMarkers(xml: string): string[] {
  const found = new Set<string>();
  for (const match of xml.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)) {
    for (const marker of match[1].matchAll(/\[[^[\]]{1,120}\]/g)) found.add(marker[0]);
  }
  return [...found];
}

/** The download name, with the offer number and client in it. */
export function offerFileName(kind: OfferKind, values: OfferValues): string {
  const client = String(values.clientName ?? "").trim() || "Klient";
  const number = String(values.offerNumber ?? "").trim() || "XXX";
  return OFFER_TEMPLATES[kind].download
    .replace("{nr}", number)
    .replace("{klienti}", client)
    .replace(/[\\/:*?"<>|]/g, "-");
}
