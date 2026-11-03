import { concreteCubeAverageStrength, concreteCubeSpecimens, concreteStrengthClass } from "@/components/reports/report-shared";
import { formatEuropeanDate } from "@/lib/date-format";
import type { ConcreteCompressiveTest, LabTest, Report, Sample } from "@/lib/types";

/**
 * What a client is told when a report is sent, in one place.
 *
 * The same message is composed from two screens — one report from its own
 * page, or a batch from the register — and the two must not drift apart in
 * what they say. A client who gets five reports in one message should read the
 * same lines they would have read in five.
 */
export type ReportMessageItem = {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  concrete?: ConcreteCompressiveTest;
  shareUrl: string;
};

/**
 * The pour date and the strengths, for a cube report only.
 *
 * A client reading a compressive-strength result wants two things before they
 * open anything: which pour this is, and whether it passed. Putting them in
 * the message means the answer is in the chat, searchable, next to the date it
 * arrived — and a result that came out low is seen rather than sitting
 * unopened in a link.
 *
 * Every figure comes from the helpers the certificate prints from, so the
 * message is a shorter view of the same report and not a second transcription
 * of it. A cube test is the only worksheet a test can carry (nothing in the
 * register holds two), so `concrete` existing is the same as the cube report
 * being the sheet that printed.
 *
 * Only this family: a strength is a number a client can read at a glance and
 * check against their mix. The other reports are tables.
 *
 * "compact" folds the same figures onto one line. A message carrying nine
 * reports cannot give six lines to each without burying the links, and the
 * figure the client scans for is the strength.
 */
export function concreteResultLines(item: ReportMessageItem, style: "full" | "compact" = "full"): string[] {
  const { report, sample, concrete } = item;
  if (!concrete) return [];
  const specimens = concreteCubeSpecimens(report, sample, concrete);
  if (!specimens.length) return [];
  const average = concreteCubeAverageStrength(specimens);
  const strengthClass = concreteStrengthClass(concrete, sample);
  // The age the cubes were actually crushed at, which is what the certificate's
  // curing column shows. The test's name carries the age it was *scheduled*
  // for, and the two part company whenever a pour is crushed a day either side
  // of its date.
  const ages = Array.from(new Set(specimens.map((specimen) => specimen.ageDays)));
  const strengths = specimens.map((specimen) => specimen.compressiveStrengthMpa);
  // One cube is its own average, and saying so twice reads like two different
  // measurements.
  const averageSuffix = strengths.length > 1 && average !== undefined ? ` (mes. ${average} MPa)` : "";
  if (style === "compact") {
    return [
      [
        concrete.castingDate ? `betonuar ${formatEuropeanDate(concrete.castingDate)}` : undefined,
        strengthClass,
        `${ages.join(", ")} ditë`
      ]
        .filter(Boolean)
        .join(" · "),
      `Rezistenca në shtypje: ${strengths.join(" / ")} MPa${averageSuffix}`
    ];
  }
  return [
    "",
    concrete.castingDate ? `Data e betonimit: ${formatEuropeanDate(concrete.castingDate)}` : undefined,
    strengthClass ? `Klasa e rezistencës: ${strengthClass}` : undefined,
    `Mosha: ${ages.join(", ")} ditë`,
    "",
    `Rezistenca në shtypje: ${strengths.join(" / ")} MPa`,
    strengths.length > 1 && average !== undefined ? `Mesatarja: ${average} MPa` : undefined
  ].filter((line): line is string => line !== undefined);
}

/** "Raporti 6947/26 — Shufra çeliku", the one line every message starts a report with. */
function reportHeading(item: ReportMessageItem, prefix: string) {
  return `${prefix}${item.report.reportNumber}${item.test?.testType ? ` — ${item.test.testType}` : ""}`;
}

/**
 * The WhatsApp message: a greeting, what each report is, its result where the
 * client can read one at a glance, and the link that opens the signed PDF. The
 * PDF is still the report; these lines are its headline.
 *
 * The strength is given as the report prints it rather than left to the link
 * alone, but nothing here replaces the certificate — a strength typed into a
 * chat is an uncontrolled result, and transcription is exactly where those go
 * wrong, which is why every figure is read from the report's own helpers.
 */
export function reportWhatsAppMessage(items: ReportMessageItem[]) {
  if (items.length === 1) {
    const [item] = items;
    return ["Përshëndetje,", "", reportHeading(item, "Raporti "), ...concreteResultLines(item), "", item.shareUrl].join("\n");
  }
  return [
    "Përshëndetje,",
    "",
    `Raportet e miratuara (${items.length}):`,
    ...items.flatMap((item) => ["", reportHeading(item, ""), ...concreteResultLines(item, "compact"), item.shareUrl])
  ].join("\n");
}
