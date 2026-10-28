/**
 * Concrete maturity: the age at test, and the dates either side of it.
 *
 * Three values, any one of which follows from the other two: the casting date,
 * the age at test, and the test date. The register was built to take the first
 * two and compute the third, which is right when a cube is cast and booked in
 * the same week. It is wrong whenever a sample arrives late — a cube cast on
 * 12 September and delivered on 27 October is 45 days old before anyone has
 * seen it, and asking for 28 days produces a test date six weeks in the past.
 *
 * So the arithmetic runs both ways here: give it an age and it dates the test,
 * give it a date and it reports the age the cube will actually be.
 */

/** A yyyy-mm-dd string as a UTC date, or undefined when it is not one. */
function parseIsoDate(iso?: string) {
  if (!iso) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return undefined;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

const MS_PER_DAY = 86_400_000;

/** yyyy-mm-dd, the format every date input and stored date in the app uses. */
export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

/** The date `days` after `iso`, or "" when the input is not a date. */
export function addDaysIso(iso: string | undefined, days: number) {
  const date = parseIsoDate(iso);
  if (!date) return "";
  return toIsoDate(new Date(date.getTime() + days * MS_PER_DAY));
}

/**
 * The age in days a specimen reaches on its test date.
 *
 * Undefined rather than zero when either date is missing, so a caller can tell
 * "cast and tested the same day" from "nobody recorded when it was cast".
 */
export function maturityDays(concretingDate?: string, testDate?: string) {
  const cast = parseIsoDate(concretingDate);
  const test = parseIsoDate(testDate);
  if (!cast || !test) return undefined;
  return Math.round((test.getTime() - cast.getTime()) / MS_PER_DAY);
}

/** The test date for a given casting date and age. */
export function testDateFor(concretingDate: string | undefined, ageDays: number) {
  return addDaysIso(concretingDate, ageDays);
}

/**
 * When the report is due for a test on a given date.
 *
 * A day after the test, which is what the register has always meant — it just
 * used to reach it as casting + age + 1. Said this way it stays a day after
 * the test even when the test date was set directly, instead of landing before
 * the test it reports on.
 */
export function reportDueFor(testDate: string | undefined) {
  return addDaysIso(testDate, 1);
}

/**
 * The lowest age a schedule row may carry.
 *
 * A row is only saved when its age is above zero, so a test date on or before
 * the casting date would drop the row without saying so. One day is the
 * earliest a cube can meaningfully be tested anyway.
 */
export const MIN_MATURITY_DAYS = 1;

/** The age implied by a chosen test date, floored so the row cannot vanish. */
export function maturityFromTestDate(concretingDate: string | undefined, testDate: string) {
  const days = maturityDays(concretingDate, testDate);
  if (days === undefined) return undefined;
  return Math.max(MIN_MATURITY_DAYS, days);
}
