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

export function isSampleCode(code?: string) {
  return Boolean(code && SAMPLE_CODE_PATTERN.test(code));
}

/** Which register a code belongs to, or undefined if it is not one of ours. */
export function sampleCodeSeries(code?: string): SampleSeries | undefined {
  const match = SAMPLE_CODE_PATTERN.exec(code ?? "");
  if (!match) return undefined;
  return Number(match[1]) === FIELD_SERIES ? FIELD_SERIES : LAB_SERIES;
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
  const highest = existingCodes.reduce((max, code) => {
    const match = SAMPLE_CODE_PATTERN.exec(code ?? "");
    return match && Number(match[1]) === series && match[3] === month
      ? Math.max(max, Number(match[2]))
      : max;
  }, 0);
  return `${series}-${String(highest + 1).padStart(2, "0")}/${month}`;
}

/**
 * A key that sorts register numbers the way the register reads: series, then
 * month, then sequence as a number. Sorting the raw text puts 0-9/09 after
 * 0-46/09, and groups every month's 0-1 together.
 *
 * Anything unrecognised keeps its own text as the key, so a stray code still
 * lands somewhere stable rather than collapsing to one position.
 */
export function sampleCodeSortKey(value?: string) {
  const match = SAMPLE_CODE_PATTERN.exec(value ?? "");
  if (!match) return value ?? "";
  const [, series, sequence, month] = match;
  return `${series}-${month}-${String(sequence).padStart(4, "0")}`;
}
