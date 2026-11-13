import { normalizeSampleType } from "./accredited-tests";

/**
 * Sand and gravel arrive as more than their material name.
 *
 * Two deliveries both registered as "Rërë / Sand" can be river sand of
 * 0.0/0.2 and mountain sand of 0.0/0.4 — different materials to anyone reading
 * the certificate, and the grading curve of one says nothing about the other.
 * The register carried neither fact: it was typed into the free-text
 * description when somebody remembered, and left blank when they did not.
 *
 * So both are kept on the sample and written into the description the
 * certificates already print. Structured, because "every river sand we tested
 * this year" is a question the client asks and free text cannot answer.
 *
 * They are not asked at the same moment. The origin is known when the bag is
 * carried in, so it is asked at registration. The fraction is not: it is what
 * the sieving says, so it is offered once a worksheet on the sample has been
 * saved — see components/samples/aggregate-fraction-card.tsx. Until then the
 * sample is a river sand with no size, which is exactly what the lab knows
 * about it.
 *
 * Neither closes when the certificate is drafted. Most of the register was
 * tested before either was asked for and is reported already, so the samples
 * that most need naming are precisely the ones that have certificates; what
 * narrows with each step the report takes is who may do it, not whether it
 * can be done at all — see canNameAggregateSample in lib/permissions.ts.
 */

/** Which materials carry an origin and a fraction at all. */
export function aggregateSubtypeKind(sampleType: string) {
  const name = normalizeSampleType(sampleType);
  if (name === "Rërë / Sand") return "sand" as const;
  if (name === "Zhavorr 1 / Gravel 1" || name === "Zhavorr 2 / Gravel 2") return "gravel" as const;
  return undefined;
}

export type AggregateSubtypeKind = NonNullable<ReturnType<typeof aggregateSubtypeKind>>;

/** Where the material was won. */
export const AGGREGATE_ORIGINS = ["Lumi / River", "Mali / Mountain"];

/**
 * The fraction is two numbers the laboratory measured, not a pick from a list.
 *
 * It was a list to begin with, holding the sizes the yards around Durrës
 * usually deliver. That was wrong twice over: a list long enough to cover
 * every supplier is too long to read, and a short one quietly rounds a real
 * sample to the nearest entry somebody thought of in advance — which is how
 * two river sands came to be recorded as "0.0/0.2 mm" when no sand is graded
 * in tenths of a millimetre. The sieving gives a smallest and a largest size;
 * the lab types those, and they are what the certificate prints.
 *
 * `d` and `D` are the EN 12620 names for the pair, which is why the card
 * labels them that way.
 */
const MIXED = "I përzier / Mixed";

/** Nothing larger than this is an aggregate, and a typo like 250 instead of 25 is worth catching. */
const MAX_SIZE_MM = 1000;

export function isValidAggregateFraction(minMm: number, maxMm: number) {
  if (!Number.isFinite(minMm) || !Number.isFinite(maxMm)) return false;
  if (minMm < 0 || maxMm > MAX_SIZE_MM) return false;
  return maxMm > minMm;
}

/** The fraction as the certificate prints it: "0/4 mm", "12.5/25 mm". */
export function formatAggregateFraction(minMm?: number, maxMm?: number) {
  if (minMm === undefined || maxMm === undefined) return undefined;
  if (!isValidAggregateFraction(minMm, maxMm)) return undefined;
  return `${minMm}/${maxMm} mm`;
}

/**
 * The two sizes behind a fraction that was recorded as text.
 *
 * Three samples were named from the old list before this changed, and their
 * label is all there is. Reading the pair back out of it means the card opens
 * on the numbers rather than on two empty boxes, and saving stores them
 * properly. "I përzier / Mixed" names no sizes and yields nothing, which is
 * correct — it was never a size.
 */
export function parseAggregateFraction(fraction?: string) {
  const match = fraction?.match(/^\s*([0-9]+(?:\.[0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return undefined;
  const minMm = Number(match[1]);
  const maxMm = Number(match[2]);
  return isValidAggregateFraction(minMm, maxMm) ? { minMm, maxMm } : undefined;
}

const MATERIAL_WORDS: Record<AggregateSubtypeKind, { sq: string; en: string }> = {
  sand: { sq: "Rërë", en: "Sand" },
  gravel: { sq: "Zhavorr", en: "Gravel" }
};

const ORIGIN_WORDS: Record<string, { sq: string; en: string }> = {
  "Lumi / River": { sq: "lumi", en: "River" },
  "Mali / Mountain": { sq: "mali", en: "Mountain" }
};

/**
 * The sample description a certificate prints, built from the two choices.
 *
 * Both halves read as the language writes them: "Rërë lumi 0.0/0.4 mm" puts
 * the origin after the material, "River Sand 0.0/0.4 mm" puts it before. The
 * result goes into `sampleDescription`, which every report already prints
 * ahead of the bare sample type, so no certificate had to be changed to show
 * it.
 *
 * Either choice may be missing, and the name is simply shorter for it:
 * "Rërë lumi / River Sand" between registration and the grading, the full
 * name once the fraction is known.
 *
 * `fraction` is the printed label, which is now built from the measured sizes
 * by formatAggregateFraction. It still takes the three samples named from the
 * old list, "I përzier / Mixed" among them, as the text they were given.
 */
export function aggregateSampleDescription(sampleType: string, origin?: string, fraction?: string) {
  const kind = aggregateSubtypeKind(sampleType);
  if (!kind) return "";
  const material = MATERIAL_WORDS[kind];
  const place = origin ? ORIGIN_WORDS[origin] : undefined;
  const size =
    fraction === MIXED
      ? { sq: "fraksion i përzier", en: "mixed fraction" }
      : fraction
        ? { sq: fraction, en: fraction }
        : undefined;
  const sq = [material.sq, place?.sq, size?.sq].filter(Boolean).join(" ");
  const en = [place?.en, material.en, size?.en].filter(Boolean).join(" ");
  return `${sq} / ${en}`;
}
