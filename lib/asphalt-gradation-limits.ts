import type { AsphaltGradationLimit, AsphaltGradationRow, AsphaltGradationTarget } from "@/lib/types";

/**
 * The grading envelope a bituminous mixture has to sit inside.
 *
 * Transcribed from the lab's own SL-RA-AS-7.8/1.2 master, which carries the
 * bands under the heading "Limitet e sipërme e të poshtme EN-13108-1". Each
 * target has its own sieve set, because the nominal maximum size differs: the
 * conglomerate band starts at 40 mm, the wearing course at 31.5 mm.
 *
 * Why this lives in one table rather than on the sheet:
 *
 * On the master, the envelope is supposed to follow a CHOOSE() switch on the
 * selected mixture — but only the first two rows actually read it. Rows 25 to
 * 32 are typed constants. They happen to agree with whichever mixture was
 * selected when someone last saved, so the sheet looks right; change the
 * switch and the top two rows move while the other eight stay put, giving a
 * silent hybrid of two envelopes and a conformity call that cannot be trusted.
 * Here the target picks the whole band or none of it.
 *
 * The bands are the lab's, not a standard quoted from source — the master is a
 * 2021 revision and should be checked against the current EN 13108-1 before
 * these are relied on for a conformity statement.
 */
export const EN_13108_GRADATION_LIMITS: Record<AsphaltGradationTarget, AsphaltGradationLimit[]> = {
  Konglomerat: [
    { sieveSizeMm: 40, minPercent: 100, maxPercent: 100 },
    { sieveSizeMm: 31.5, minPercent: 90, maxPercent: 100 },
    { sieveSizeMm: 20, minPercent: 60, maxPercent: 95 },
    { sieveSizeMm: 12.5, minPercent: 45, maxPercent: 75 },
    { sieveSizeMm: 8, minPercent: 35, maxPercent: 60 },
    { sieveSizeMm: 4, minPercent: 25, maxPercent: 50 },
    { sieveSizeMm: 2, minPercent: 18, maxPercent: 40 },
    { sieveSizeMm: 0.5, minPercent: 6, maxPercent: 20 },
    { sieveSizeMm: 0.25, minPercent: 4, maxPercent: 14 },
    { sieveSizeMm: 0.063, minPercent: 3, maxPercent: 8 }
  ],
  Binder: [
    { sieveSizeMm: 40, minPercent: 100, maxPercent: 100 },
    { sieveSizeMm: 31.5, minPercent: 100, maxPercent: 100 },
    { sieveSizeMm: 20, minPercent: 90, maxPercent: 100 },
    { sieveSizeMm: 12.5, minPercent: 65, maxPercent: 100 },
    { sieveSizeMm: 8, minPercent: 50, maxPercent: 80 },
    { sieveSizeMm: 4, minPercent: 30, maxPercent: 60 },
    { sieveSizeMm: 2, minPercent: 20, maxPercent: 45 },
    { sieveSizeMm: 0.5, minPercent: 7, maxPercent: 25 },
    { sieveSizeMm: 0.25, minPercent: 5, maxPercent: 11 },
    { sieveSizeMm: 0.063, minPercent: 4, maxPercent: 8 }
  ],
  Tapet: [
    { sieveSizeMm: 31.5, minPercent: 100, maxPercent: 100 },
    { sieveSizeMm: 20, minPercent: 100, maxPercent: 100 },
    { sieveSizeMm: 16, minPercent: 90, maxPercent: 100 },
    { sieveSizeMm: 12.5, minPercent: 80, maxPercent: 100 },
    { sieveSizeMm: 8, minPercent: 65, maxPercent: 90 },
    { sieveSizeMm: 4, minPercent: 45, maxPercent: 70 },
    { sieveSizeMm: 2, minPercent: 25, maxPercent: 50 },
    { sieveSizeMm: 0.5, minPercent: 10, maxPercent: 25 },
    { sieveSizeMm: 0.25, minPercent: 8, maxPercent: 18 },
    { sieveSizeMm: 0.063, minPercent: 6, maxPercent: 11 }
  ]
};

export const ASPHALT_GRADATION_TARGETS: AsphaltGradationTarget[] = ["Konglomerat", "Binder", "Tapet"];

/**
 * The target a layer is judged against when nobody has said otherwise.
 *
 * "Tapet + Binder" is one worksheet covering two layers, and the two have
 * different envelopes — there is no single band that would be honest for it,
 * so it falls to the binder course and the technician can change it.
 */
export function defaultGradationTarget(mixtureKind?: string): AsphaltGradationTarget {
  if (mixtureKind === "Tapet") return "Tapet";
  return "Binder";
}

/** Sieve sizes compare by value, but they arrive as floats from form input. */
function sameSieve(a: number, b: number) {
  return Math.abs(a - b) < 1e-9;
}

/**
 * The band that applies at one sieve, preferring a project-specific limit.
 *
 * A project band overrides the standard one outright rather than narrowing it:
 * when a client specifies their own envelope, that envelope is the acceptance
 * criterion, and showing them against EN as well would invite an argument
 * about which one the result failed.
 */
export function limitAtSieve(
  sieveSizeMm: number,
  target: AsphaltGradationTarget,
  projectLimits?: AsphaltGradationLimit[]
): AsphaltGradationLimit | undefined {
  const project = projectLimits?.find((limit) => sameSieve(limit.sieveSizeMm, sieveSizeMm));
  if (project) return project;
  return EN_13108_GRADATION_LIMITS[target].find((limit) => sameSieve(limit.sieveSizeMm, sieveSizeMm));
}

export type GradationVerdict = "within" | "outside" | "no-limit";

/**
 * Where one measured passing percentage sits against its band.
 *
 * A sieve with no band returns "no-limit" rather than passing. The worksheet
 * runs 31.5 down to 0 including 25 and the pan, and no envelope covers all of
 * those, so some rows genuinely have nothing to be judged against — saying so
 * is the difference between an unjudged sieve and a satisfied one.
 */
export function gradationVerdict(
  passingPercent: number | undefined,
  limit: AsphaltGradationLimit | undefined
): GradationVerdict {
  if (!limit) return "no-limit";
  if (passingPercent == null) return "no-limit";
  return passingPercent >= limit.minPercent && passingPercent <= limit.maxPercent ? "within" : "outside";
}

export interface GradationAssessment {
  rows: Array<{
    row: AsphaltGradationRow;
    limit?: AsphaltGradationLimit;
    verdict: GradationVerdict;
  }>;
  /** Sieves actually judged, i.e. those the envelope covers. */
  judged: number;
  outside: number;
  /**
   * Undefined when nothing could be judged. A mixture is only declared
   * conforming once at least one sieve has been compared — "no failures" out
   * of no comparisons is not a pass.
   */
  conforms?: boolean;
}

/** Every row of a gradation measured against its envelope. */
export function assessGradation(
  rows: AsphaltGradationRow[],
  target: AsphaltGradationTarget,
  projectLimits?: AsphaltGradationLimit[]
): GradationAssessment {
  const assessed = rows.map((row) => {
    const limit = limitAtSieve(row.sieveSizeMm, target, projectLimits);
    return { row, limit, verdict: gradationVerdict(row.cumulativePassingPercent, limit) };
  });
  const judged = assessed.filter((entry) => entry.verdict !== "no-limit").length;
  const outside = assessed.filter((entry) => entry.verdict === "outside").length;
  return { rows: assessed, judged, outside, conforms: judged ? outside === 0 : undefined };
}

/** "6 ÷ 11" the way the masters write a band, or an em dash where there is none. */
export function formatLimit(limit?: AsphaltGradationLimit) {
  if (!limit) return "—";
  if (limit.minPercent === limit.maxPercent) return `${limit.minPercent}`;
  return `${limit.minPercent} ÷ ${limit.maxPercent}`;
}
