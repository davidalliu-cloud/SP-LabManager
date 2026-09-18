/**
 * Sample register numbers, in the form SARP writes them on its paperwork:
 * series, sequence, month — 0-46/09 for a laboratory sample, 1-01/09 for work
 * done on site. The two series run side by side, so a sample taken in the field
 * never consumes a laboratory number and each register reads independently.
 *
 * The sequence restarts each month, which is what the month suffix scopes.
 */
export const LAB_SERIES = 0;
export const FIELD_SERIES = 1;
export type SampleSeries = typeof LAB_SERIES | typeof FIELD_SERIES;

export const SAMPLE_CODE_PATTERN = /^([01])-(\d+)\/(\d{2})$/;

/**
 * The form the app issued before it adopted the lab's own: 2026-09-046, which
 * is the same register entry as 0-46/09.
 *
 * Every function here has to understand it. When the new format shipped ahead
 * of the data being converted, the generator saw no 0-NN/MM codes at all, judged
 * September empty and issued 0-01/09 on top of a register that already ran to
 * 53. Reading both forms is what makes the changeover safe in either order, and
 * it costs nothing once the last legacy code is gone.
 */
const LEGACY_CODE_PATTERN = /^(\d{4})-(\d{2})-(\d+)$/;

/** Both forms, reduced to series, sequence and month, or undefined. */
function parseSampleCode(code: string | undefined, year?: number) {
  const current = SAMPLE_CODE_PATTERN.exec(code ?? "");
  if (current) {
    return { series: Number(current[1]) as SampleSeries, sequence: Number(current[2]), month: current[3] };
  }
  const legacy = LEGACY_CODE_PATTERN.exec(code ?? "");
  // Legacy codes carry their year where the new form does not, so when a year
  // is in hand only that year's codes count — otherwise next January would
  // number itself against this January's.
  if (legacy && (year === undefined || Number(legacy[1]) === year)) {
    return { series: LAB_SERIES as SampleSeries, sequence: Number(legacy[3]), month: legacy[2] };
  }
  return undefined;
}

export function isSampleCode(code?: string) {
  return Boolean(parseSampleCode(code));
}

/** Which register a code belongs to, or undefined if it is not one of ours. */
export function sampleCodeSeries(code?: string): SampleSeries | undefined {
  return parseSampleCode(code)?.series;
}

/**
 * The next number in `series` for the month `dateReceived` falls in.
 *
 * Taken from the highest already issued that month in that series, not from a
 * count — a count breaks the moment the set has a gap or a duplicate, which is
 * how 09-035 once became 09-037, and a deletion would make it reuse a number
 * still in use. Max + 1 survives both.
 */
export function nextSampleCode(series: SampleSeries, dateReceived: string, existingCodes: string[]) {
  const date = new Date(`${dateReceived}T00:00:00`);
  const month = String(
    Number.isNaN(date.getTime()) ? new Date().getMonth() + 1 : date.getMonth() + 1
  ).padStart(2, "0");
  const year = Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
  // Both forms count. A register half-converted is still one register, and the
  // next number has to clear everything in it.
  const highest = existingCodes.reduce((max, code) => {
    const parsed = parseSampleCode(code, year);
    return parsed && parsed.series === series && parsed.month === month
      ? Math.max(max, parsed.sequence)
      : max;
  }, 0);
  return `${series}-${String(highest + 1).padStart(2, "0")}/${month}`;
}

/**
 * A key that sorts register numbers the way the register reads: series, then
 * month, then sequence as a number. Sorting the raw text puts 0-9/09 after
 * 0-46/09, and groups every month's 0-1 together.
 *
 * Legacy codes reduce to the same key as their new-format equivalent, so a
 * half-converted register still reads in one order instead of splitting into
 * two blocks. Anything unrecognised keeps its own text, so a stray code lands
 * somewhere stable rather than collapsing to one position.
 */
export function sampleCodeSortKey(value?: string) {
  const parsed = parseSampleCode(value);
  if (!parsed) return value ?? "";
  return `${parsed.series}-${parsed.month}-${String(parsed.sequence).padStart(4, "0")}`;
}
