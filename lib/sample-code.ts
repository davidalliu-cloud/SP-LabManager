/**
 * Sample register numbers.
 *
 * The laboratory register is, and stays, YYYY-MM-NNN — 2026-09-054. It runs
 * unbroken from the first sample the app ever registered, and every new sample
 * simply continues it. Report PDFs already in storage carry these numbers on the
 * page, so the series is not something to reshape.
 *
 * The Field Register is the one exception, and a deliberate one: work carried
 * out on site is numbered 1-NN/MM, its own series restarting each month, so a
 * sample taken in the field never consumes a laboratory number and the two
 * registers can be read independently.
 */
export const LAB_SERIES = 0;
export const FIELD_SERIES = 1;
export type SampleSeries = typeof LAB_SERIES | typeof FIELD_SERIES;

/** The laboratory register: 2026-09-054. */
const LAB_CODE_PATTERN = /^(\d{4})-(\d{2})-(\d+)$/;

/** The field register: 1-01/09. */
const FIELD_CODE_PATTERN = /^1-(\d+)\/(\d{2})$/;

/**
 * A short-lived third form, 0-54/09, issued to three samples on 18 September
 * 2026 before the laboratory register was put back to YYYY-MM-NNN. Those three
 * were renumbered, so none should remain — it is still counted here so that a
 * straggler could never be handed a number already in use.
 */
const WITHDRAWN_LAB_CODE_PATTERN = /^0-(\d+)\/(\d{2})$/;

/** Any of the forms, reduced to series, sequence and month. */
function parseSampleCode(code: string | undefined, year?: number) {
  const lab = LAB_CODE_PATTERN.exec(code ?? "");
  // A laboratory code carries its year, so when a year is in hand only that
  // year's codes count — otherwise next January would number itself against
  // this January's.
  if (lab && (year === undefined || Number(lab[1]) === year)) {
    return { series: LAB_SERIES as SampleSeries, sequence: Number(lab[3]), month: lab[2] };
  }
  const field = FIELD_CODE_PATTERN.exec(code ?? "");
  if (field) {
    return { series: FIELD_SERIES as SampleSeries, sequence: Number(field[1]), month: field[2] };
  }
  const withdrawn = WITHDRAWN_LAB_CODE_PATTERN.exec(code ?? "");
  if (withdrawn) {
    return { series: LAB_SERIES as SampleSeries, sequence: Number(withdrawn[1]), month: withdrawn[2] };
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
 * Taken from the highest already issued that month, not from a count — a count
 * breaks the moment the set has a gap or a duplicate, which is how 09-035 once
 * became 09-037, and a deletion would make it reuse a number still in use.
 * Max + 1 survives both.
 */
export function nextSampleCode(series: SampleSeries, dateReceived: string, existingCodes: string[]) {
  const date = new Date(`${dateReceived}T00:00:00`);
  const valid = !Number.isNaN(date.getTime());
  const month = String((valid ? date : new Date()).getMonth() + 1).padStart(2, "0");
  const year = (valid ? date : new Date()).getFullYear();

  const highest = existingCodes.reduce((max, code) => {
    const parsed = parseSampleCode(code, year);
    return parsed && parsed.series === series && parsed.month === month
      ? Math.max(max, parsed.sequence)
      : max;
  }, 0);
  const next = highest + 1;

  return series === FIELD_SERIES
    ? `1-${String(next).padStart(2, "0")}/${month}`
    : `${year}-${month}-${String(next).padStart(3, "0")}`;
}

/**
 * A key that sorts register numbers the way the register reads: series, then
 * month, then sequence as a number. The laboratory form is fixed-width and
 * sorts correctly as text on its own, but the field form does not — 1-9/09
 * would land after 1-46/09 — and the two must not interleave.
 *
 * Anything unrecognised keeps its own text, so a stray code lands somewhere
 * stable rather than collapsing to one position.
 */
export function sampleCodeSortKey(value?: string) {
  const parsed = parseSampleCode(value);
  if (!parsed) return value ?? "";
  return `${parsed.series}-${parsed.month}-${String(parsed.sequence).padStart(4, "0")}`;
}
