/**
 * Testet e zotësisë dhe krahasimet ndërlaboratorike — ISO/IEC 17025 §7.7.2,
 * register SL-RP-7.7.1k, plans SL-FP-7.7.1k (annual) and 7.7.1k.1 (four-year).
 *
 * This is the register that cost the lab a finding. Nonconformity 115, raised
 * at the March 2025 external audit, records no participation across the
 * 2021–2024 four-year cycle for nineteen accredited tests. A Word table cannot
 * answer "what have we not covered this cycle" — you have to read thirteen
 * pages and hold the scope in your head — which is exactly how nineteen tests
 * go unnoticed.
 */

/** Tipi i krahasimit, as the register writes it. */
export const PT_TYPES = ["Test zotësie", "Test nderlaboratorik", "Krahasim nderlaboratorik"] as const;

/** Matrica e testimit — the material families the register uses. */
export const PT_MATRICES = [
  "Agregate",
  "Beton i ngurtësuar",
  "Beton i freskët",
  "Çimento",
  "Asfalt",
  "Bitum",
  "Dhera",
  "Shufra çeliku",
  "Tulla Qeramike",
  "Llaç",
  "Shtesa për beton (Aditivë)",
  "Produkte termoizoluese",
  "Shkëmb natyror",
  "Ujë"
] as const;

export type ProficiencyResult = "I kënaqshëm" | "I dyshimtë" | "I pakënaqshëm" | "Pa vlerësim";

export type ProficiencyTest = {
  id: string;
  /** Testi i performuar */
  testName: string;
  /** Matrica e testimit */
  matrix: string;
  /** Metoda e testimit */
  method: string;
  /** Tipi i krahasimit */
  comparisonType: string;
  /** Organizuesi */
  organiser: string;
  /** Kodi i laboratorit */
  labCode?: string;
  /** Muaji / Viti, as written — rounds span months, so this is text. */
  period: string;
  /**
   * The year the round is counted against, for cycle coverage. Taken from the
   * period when it is entered, because "Korrik 2025 – Janar 2026" has to land
   * in one cycle and the round belongs to the year it started.
   */
  year: number;
  /** Zeta Score "Z" */
  zScore?: number;
  /** Shënime */
  notes?: string;
  /** A finding raised because the result was not satisfactory. */
  nonconformityId?: string;
  createdAt: string;
  updatedAt?: string;
};

/**
 * The verdict, from the z-score alone.
 *
 * ISO 13528: |z| ≤ 2 satisfactory, 2 < |z| ≤ 3 questionable, |z| > 3
 * unsatisfactory. Computing it rather than typing it is worth doing — the paper
 * register has a −2.03 recorded as satisfactory, which it is not, and that is
 * the kind of slip that only ever surfaces when somebody else is reading it.
 */
export function proficiencyResult(zScore?: number): ProficiencyResult {
  if (zScore === undefined || Number.isNaN(zScore)) return "Pa vlerësim";
  const z = Math.abs(zScore);
  if (z <= 2) return "I kënaqshëm";
  return z <= 3 ? "I dyshimtë" : "I pakënaqshëm";
}

/** Anything other than satisfactory needs looking at under §7.7.3. */
export function needsAction(item: ProficiencyTest) {
  const result = proficiencyResult(item.zScore);
  return result === "I dyshimtë" || result === "I pakënaqshëm";
}

/**
 * The four-year cycle a year falls in.
 *
 * The audit measured 2021–2024, so cycles run 2021–2024, 2025–2028, and so on.
 * Anchoring to 2021 keeps the app counting the same window the assessor does.
 */
export const CYCLE_ANCHOR = 2021;
export const CYCLE_LENGTH = 4;

export function cycleFor(year: number) {
  const start = CYCLE_ANCHOR + Math.floor((year - CYCLE_ANCHOR) / CYCLE_LENGTH) * CYCLE_LENGTH;
  return { start, end: start + CYCLE_LENGTH - 1 };
}

export function cycleLabel(year: number) {
  const { start, end } = cycleFor(year);
  return `${start}–${end}`;
}

export function inCycle(item: ProficiencyTest, year: number) {
  const { start, end } = cycleFor(year);
  return item.year >= start && item.year <= end;
}

export type MatrixCoverage = {
  matrix: string;
  /** Rounds in the current cycle. */
  rounds: number;
  /** Distinct tests covered in the current cycle. */
  tests: number;
  /** The most recent year covered, for matrices with any history at all. */
  lastYear?: number;
  /** Results in the cycle that were not satisfactory. */
  unsatisfactory: number;
};

/**
 * What the current cycle looks like, by matrix. A matrix with history but
 * nothing in this cycle is the shape of the 2025 finding, so it is the thing
 * the page has to make visible.
 */
export function coverageByMatrix(items: ProficiencyTest[], year: number): MatrixCoverage[] {
  const matrices = Array.from(new Set(items.map((item) => item.matrix))).sort();
  return matrices.map((matrix) => {
    const all = items.filter((item) => item.matrix === matrix);
    const current = all.filter((item) => inCycle(item, year));
    return {
      matrix,
      rounds: new Set(current.map((item) => `${item.organiser}|${item.period}`)).size,
      tests: new Set(current.map((item) => item.testName)).size,
      lastYear: all.reduce<number | undefined>((max, item) => (!max || item.year > max ? item.year : max), undefined),
      unsatisfactory: current.filter(needsAction).length
    };
  });
}

export type ProficiencyInput = Omit<ProficiencyTest, "id" | "createdAt" | "updatedAt">;
