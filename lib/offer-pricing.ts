import { catalogueByCode, type CatalogueTest } from "./offer-catalogue";
import { labLines, quantityMode, unitPrice, type OfferValues } from "./offer-fill";
import type { OfferRecord } from "./types";

/**
 * What a piece of finished work is worth.
 *
 * The register records what was tested; the catalogue records what a test
 * costs. Nothing joined the two, so a month of work could be listed but not
 * valued. This is that join: a report is matched to a catalogue code, and the
 * code is priced — at the client's own accepted offer where there is one, and
 * at the 2026 list price where there is not.
 *
 * The unit is the report, not the test, because that is how the catalogue is
 * written: C1 is "raport (≤ 3 kubikë)", and the register already groups cubes
 * into reports of at most three. One approved report is one billable line.
 *
 * Where a match is a judgement rather than a certainty it is marked `assumed`,
 * and every screen that shows a price shows that too. A wrong code here is a
 * wrong figure on an invoice, so the honest answer to "I am not sure" is to
 * say so on the line rather than to quietly pick one.
 */

/** Matching ignores diacritics: the register holds both "Kubikë" and "Kubike". */
const plain = (value: string) =>
  value
    .toLocaleLowerCase("sq-AL")
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export interface PricingRule {
  code: string;
  /** Against the sample type. */
  sample: RegExp;
  /** Against the test type; omitted matches any test on that sample. */
  test?: RegExp;
  /**
   * The code is a reading rather than a certainty — the catalogue offers more
   * than one plausible line and the register does not say which.
   */
  assumed?: string;
}

/**
 * First match wins, so the specific rules come before the general ones: a
 * flexural test on concrete cubes is C5 and must be seen before the C1 rule
 * claims everything cast as a cube.
 */
export const PRICING_RULES: PricingRule[] = [
  { code: "C5", sample: /kubik/, test: /perkulje/ },
  { code: "C1", sample: /kubik/, test: /shtypje/ },
  {
    code: "D1",
    sample: /karrot/,
    assumed: "Karrota çmimohen si raport 1:1 (D1). Nëse priten 2:1, kodi është D2 me 6,250 ALL."
  },
  { code: "D3", sample: /sklerometer|rebound/ },
  { code: "I2", sample: /celik|rebar|shufr/, test: /perkulje|riperkulje/ },
  { code: "I1", sample: /celik|rebar|shufr/, test: /terheqje|rrjedhshmeri/ },
  { code: "A3", sample: /rer|sand/, test: /ekuivalent/ },
  { code: "A1", sample: /rer|sand|zhavorr|gravel|agregat/, test: /granulometri|granulometrik/ },
  { code: "A2", sample: /rer|sand|zhavorr|gravel|agregat/, test: /dendesi|ujethithj/ },
  { code: "E2", sample: /cimento|cement/, test: /konsistenc|prez|ekspansion|ngurtesim/ },
  { code: "E1", sample: /cimento|cement/, test: /shtypje|perkulje/ },
  { code: "G4", sample: /llac|mortar/, test: /granulometri/ },
  {
    code: "G3",
    sample: /llac|mortar/,
    test: /ngjitje|aderenc|pull-off/,
    assumed: "Ngjitja e llaçit çmimohet si prova pull-off (G3). Për ngjitës pllakash qeramike kodi është G6 me 6,000 ALL."
  },
  { code: "G1", sample: /llac|mortar/, test: /shtypje|perkulje/ },
  { code: "H1", sample: /murature|masonry|tulla|blloqe/ },
  { code: "J1", sample: /eps|xps|termoizolues|polystyrene|lesh guri/ },
  { code: "O1", sample: /uje|water/ },
  {
    code: "F1",
    sample: /aditiv|admixture|shtesa per beton/,
    assumed:
      "Aditivët çmimohen si paketa e plotë e përputhshmërisë (F1, 20,000 ALL). Nëse kryhen vetëm prova të veçanta, kodet janë F2–F4."
  },
  {
    code: "N1",
    sample: /binder|tapet|asfalt|bitum/,
    assumed: "Asfalti çmimohet si përmbajtja e bitumit (N1). Nëse kryhet edhe granulometria pas ekstraktimit, shtohet N2."
  },
  { code: "Q2", sample: /bordur/ },
  { code: "Q3", sample: /pllak.*betoni|pllaka trotuar/ }
];

export interface PricedCode {
  code: string;
  test: CatalogueTest;
  /** Flagged when the code was a reading rather than a certainty. */
  assumed?: string;
}

/** The catalogue line a report belongs to, or undefined when nothing matches. */
export function catalogueCodeFor(sampleType: string, testType: string): PricedCode | undefined {
  const sample = plain(sampleType ?? "");
  const test = plain(testType ?? "");
  for (const rule of PRICING_RULES) {
    if (!rule.sample.test(sample)) continue;
    if (rule.test && !rule.test.test(test)) continue;
    const entry = catalogueByCode.get(rule.code);
    if (!entry) continue;
    return { code: rule.code, test: entry, assumed: rule.assumed };
  }
  return undefined;
}

export type PriceSource = "offer" | "catalogue" | "unmapped";

export interface ReportPrice {
  code?: string;
  name?: string;
  unit?: string;
  unitPrice?: number;
  source: PriceSource;
  /** Why this figure should be looked at before it reaches an invoice. */
  caution?: string;
}

/**
 * Price one report.
 *
 * The client's accepted offer wins, because that is the figure they agreed to
 * — including any discount or hand-set price on the line. Work the offer never
 * quoted still gets a figure, from the catalogue, and says so: leaving it off
 * the sheet would understate the month, and leaving it unpriced would stop the
 * sheet totalling at all.
 */
export function priceReport(sampleType: string, testType: string, offer?: OfferRecord): ReportPrice {
  const matched = catalogueCodeFor(sampleType, testType);
  if (!matched) {
    return {
      source: "unmapped",
      caution: `Testimi "${testType || sampleType}" nuk lidhet me asnjë kod të katalogut, ndaj nuk u çmimua.`
    };
  }

  const base = {
    code: matched.code,
    name: matched.test.name,
    unit: matched.test.unit,
    caution: matched.assumed
  };

  const quoted = offer ? quotedPrice(offer, matched.code) : undefined;
  if (quoted !== undefined) return { ...base, unitPrice: quoted, source: "offer" };

  return {
    ...base,
    unitPrice: matched.test.price,
    source: "catalogue",
    caution:
      matched.assumed ??
      (offer ? `Jashtë ofertës ${offer.offerNumber}; çmimuar me listën 2026.` : undefined)
  };
}

/** The unit price an accepted offer puts on a code, if it quotes it at all. */
function quotedPrice(offer: OfferRecord, code: string): number | undefined {
  const values = offer.values as OfferValues;
  const chosen = labLines(values).find((line) => line.code === code);
  if (chosen) return chosen.price;

  // A catalogue offer quotes every code it did not strike out, at list less
  // any discount, even when no quantities were given.
  if (quantityMode(values) === "unit" && !String(values.codes ?? "").trim()) {
    const entry = catalogueByCode.get(code);
    if (entry) return unitPrice(values, code, entry.price);
  }
  return undefined;
}
