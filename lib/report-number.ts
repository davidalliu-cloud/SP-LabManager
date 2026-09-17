/**
 * Report numbers, in the form SARP has always issued them: a bare sequence and
 * the two-digit year, as in 5868/26. No prefix — the number on the paper is the
 * number, and it is what a client quotes back when they call.
 *
 * The sequence restarts on 1 January: the lab's January 2026 reports are in the
 * hundreds while September's are in the 5800s. The year in the suffix therefore
 * also scopes the count, and two reports a year apart can never collide.
 */
export const REPORT_NUMBER_PATTERN = /^(\d+)\/(\d{2})$/;

export function isReportNumber(value?: string) {
  return Boolean(value && REPORT_NUMBER_PATTERN.test(value));
}

/**
 * The next number in the series for `year`.
 *
 * Taken from the highest already issued that year rather than from how many
 * reports exist — that is what lets the app adopt a series already in progress:
 * set the existing numbers and the next one simply follows on. It also survives
 * a gap or a voided report, which a count does not.
 *
 * `offset` numbers a batch: one test that splits into three reports takes three
 * consecutive numbers from one pass over the existing set.
 */
export function nextReportNumber(existingNumbers: string[], year: number, offset = 0) {
  const suffix = String(year % 100).padStart(2, "0");
  const highest = existingNumbers.reduce((max, value) => {
    const match = REPORT_NUMBER_PATTERN.exec(value ?? "");
    return match && match[2] === suffix ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${highest + 1 + offset}/${suffix}`;
}

/**
 * A key that sorts report numbers the way a person reads them. Sorting the raw
 * text puts 999/26 after 5868/26, because "9" > "5" one character at a time.
 * Year first, then the sequence as a number.
 */
export function reportNumberSortKey(value?: string) {
  const match = REPORT_NUMBER_PATTERN.exec(value ?? "");
  // Always a number, so the comparator never sees a mix of text and numbers.
  // Anything unrecognised sorts ahead of the series rather than among it.
  if (!match) return -1;
  return Number(match[2]) * 1_000_000 + Number(match[1]);
}
