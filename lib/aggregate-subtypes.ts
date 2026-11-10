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
 * So the origin and the fraction are asked at registration, kept on the sample,
 * and written into the description the certificates already print. Structured,
 * because "every river sand we tested this year" is a question the client asks
 * and free text cannot answer.
 */

/** Which fraction list a material takes, or nothing where the question does not arise. */
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
 * The fraction, named exactly as the lab names it on the bag and the delivery
 * note. Listed smallest first so a technician reading down the list is reading
 * a scale; "mixed" is last because it is not a size.
 */
const SAND_FRACTIONS = ["0.0/0.2 mm", "0.0/0.3 mm", "0.0/0.4 mm", "I përzier / Mixed"];
const GRAVEL_FRACTIONS = ["04/08 mm", "05/10 mm", "10/20 mm", "12.5/25 mm", "I përzier / Mixed"];

const MIXED = "I përzier / Mixed";

export function aggregateFractions(kind: AggregateSubtypeKind) {
  return kind === "sand" ? SAND_FRACTIONS : GRAVEL_FRACTIONS;
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
