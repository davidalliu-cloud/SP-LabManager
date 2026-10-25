import fs from "fs";
import zlib from "zlib";

/** Reads the lab template and emits lib/offer-catalogue.ts from Section 9. */
function readZip(file) {
  const b = fs.readFileSync(file);
  let e = b.length - 22;
  while (e >= 0 && b.readUInt32LE(e) !== 0x06054b50) e -= 1;
  const c = b.readUInt16LE(e + 10);
  let o = b.readUInt32LE(e + 16);
  const m = new Map();
  for (let i = 0; i < c; i += 1) {
    if (b.readUInt32LE(o) !== 0x02014b50) break;
    const meth = b.readUInt16LE(o + 10);
    const size = b.readUInt32LE(o + 20);
    const nl = b.readUInt16LE(o + 28);
    const el = b.readUInt16LE(o + 30);
    const cl = b.readUInt16LE(o + 32);
    const loc = b.readUInt32LE(o + 42);
    const name = b.toString("utf8", o + 46, o + 46 + nl);
    const lnl = b.readUInt16LE(loc + 26);
    const lel = b.readUInt16LE(loc + 28);
    const s = loc + 30 + lnl + lel;
    const raw = b.subarray(s, s + size);
    m.set(name, meth === 0 ? raw : zlib.inflateRawSync(raw));
    o += 46 + nl + el + cl;
  }
  return m;
}

const unesc = (t) =>
  t
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
const textOf = (s) => [...s.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map((m) => unesc(m[1])).join("");
const paras = (s) => [...s.matchAll(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g)].map((m) => textOf(m[0]).trim()).filter(Boolean);

const xml = readZip(process.argv[2]).get("word/document.xml").toString("utf8");

/** The caption paragraph sits immediately before its table. */
function captionBefore(at) {
  const before = xml.slice(0, at);
  const paragraphs = [...before.matchAll(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g)];
  for (let i = paragraphs.length - 1; i >= 0; i -= 1) {
    const text = textOf(paragraphs[i][0]).trim();
    if (text) return text;
  }
  return "";
}

const money = (raw) => {
  const cleaned = raw.replace(/[[\]]/g, "").trim();
  if (!/\d/.test(cleaned)) return { label: cleaned, value: 0 };
  return { label: cleaned, value: Number(cleaned.replace(/,/g, "")) };
};

const rows = [];
for (const table of xml.matchAll(/<w:tbl>[\s\S]*?<\/w:tbl>/g)) {
  const trs = [...table[0].matchAll(/<w:tr\b[^>]*>[\s\S]*?<\/w:tr>/g)];
  if (!trs.length) continue;
  const header = [...trs[0][0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)].map((c) => textOf(c[0]).trim());
  if (header[0] !== "Kodi" || header[6] !== "Sasia e kërkuar") continue;

  const caption = captionBefore(table.index);
  const group = /^Tabela 9\.\d+:\s*(.+)$/.exec(caption)?.[1] ?? caption;

  for (const tr of trs.slice(1)) {
    const cells = [...tr[0].matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)];
    if (cells.length !== 7) continue;
    const code = textOf(cells[0][0]).trim();
    if (!/^[A-Z]+\d+$/.test(code)) continue;
    // A name can carry a fill-in marker of its own: P1 names the transport
    // zone. The brackets come off here, leaving the default text, and
    // labLines() swaps in the zone the offer actually quotes.
    const name = paras(cells[1][0]).map((line) => line.replace(/[[\]]/g, ""));
    const exVat = money(textOf(cells[4][0]));
    const incVat = money(textOf(cells[5][0]));
    rows.push({
      code,
      group,
      name: name[0] ?? "",
      detail: name.slice(1).join(" "),
      accredited: textOf(cells[2][0]).trim() === "●",
      unit: textOf(cells[3][0]).trim(),
      price: exVat.value,
      priceLabel: exVat.label,
      priceIncVat: incVat.value
    });
  }
}

const groups = [...new Set(rows.map((row) => row.group))];
const q = (value) => JSON.stringify(value);

const out = `/**
 * Section 9 of the laboratory offer: every test the lab sells, with its price.
 *
 * Generated from public/offer-templates/oferta-laboratorike.docx by
 * scripts/gen-offer-catalogue.mjs — the template is the price list, and this
 * is a copy of it the form can tick through. Do not hand-edit: change the
 * template and regenerate, or the offer and the picker will disagree about
 * what a test costs.
 *
 * \`price\` is the figure excluding VAT, as a number for arithmetic;
 * \`priceLabel\` is how the template prints it, which for the free tests that
 * ride along with another one is the word "Falas" rather than a figure.
 */

export interface CatalogueTest {
  /** The code printed in the offer, e.g. "C1". Unique across the catalogue. */
  code: string;
  /** The Section 9 table it belongs to, e.g. "Beton i ngurtësuar". */
  group: string;
  name: string;
  /** Standard, sample size and turnaround, as one line. */
  detail: string;
  /** Inside the ISO/IEC 17025 scope, certificate DPA LT 069. */
  accredited: boolean;
  /** What one unit of this test is: a report, a cube, a visit, a month. */
  unit: string;
  price: number;
  priceLabel: string;
  priceIncVat: number;
}

export const OFFER_CATALOGUE_GROUPS: string[] = ${JSON.stringify(groups, null, 2)};

export const OFFER_CATALOGUE: CatalogueTest[] = [
${rows
  .map(
    (row) =>
      `  { code: ${q(row.code)}, group: ${q(row.group)}, name: ${q(row.name)}, detail: ${q(row.detail)}, accredited: ${row.accredited}, unit: ${q(row.unit)}, price: ${row.price}, priceLabel: ${q(row.priceLabel)}, priceIncVat: ${row.priceIncVat} }`
  )
  .join(",\n")}
];

export const catalogueByCode = new Map(OFFER_CATALOGUE.map((test) => [test.code, test]));
`;

fs.writeFileSync(process.argv[3], out);
const duplicates = rows.map((r) => r.code).filter((code, i, all) => all.indexOf(code) !== i);
console.log(`${rows.length} tests in ${groups.length} groups; accredited: ${rows.filter((r) => r.accredited).length}`);
console.log("duplicate codes:", duplicates.length ? duplicates.join(", ") : "none");
console.log("free/non-numeric prices:", rows.filter((r) => !/\d/.test(r.priceLabel)).map((r) => `${r.code}=${r.priceLabel}`).join(" ") || "none");
