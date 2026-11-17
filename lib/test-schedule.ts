import { MIN_MATURITY_DAYS, reportDueFor, testDateFor } from "./maturity";
import type { Sample } from "./types";

/**
 * Correcting the ages a concrete sample's cubes are booked for.
 *
 * The arithmetic of it, kept out of the store so it can be exercised on its
 * own: a schedule row is a booking, and a booking is only a date because of
 * the casting date and the age. Give it the rows as they stand and the ages
 * somebody has just typed, and it answers with the plan that follows - or with
 * nothing, when the edit is one that must not be made.
 */

export type TestScheduleRow = NonNullable<Sample["testSchedules"]>[number];

/** What the screen sends back: the two numbers, and the casting date. */
export type TestScheduleEdit = { cubeCount: number; ageDays: number; concretingDate?: string };

/**
 * The plan after the edit, or undefined when there is nothing to save.
 *
 * Refused outright - rather than half applied - when the rows do not line up
 * with the plan, or when two of them would end up at the same age: the age is
 * the only thing that survives from a row onto the test it books, so two rows
 * sharing one would leave no way to tell their tests apart.
 *
 * A row whose cubes have already gone on the press is left exactly as it is.
 * It is history by then, not a booking, and the certificate will say what was
 * actually done.
 */
export function correctTestSchedules(
  existing: TestScheduleRow[],
  edits: TestScheduleEdit[],
  hasStarted: (ageDays: number) => boolean
): TestScheduleRow[] | undefined {
  if (!existing.length || edits.length !== existing.length) return undefined;
  const ages = edits.map((row) => Math.max(MIN_MATURITY_DAYS, Math.round(Number(row.ageDays) || 0)));
  if (new Set(ages).size !== ages.length) return undefined;

  const next = existing.map((row, index) => {
    const ageDays = ages[index];
    const cubeCount = Math.max(0, Math.round(Number(edits[index].cubeCount) || 0));
    const concretingDate = edits[index].concretingDate?.trim() || row.concretingDate;
    if (ageDays === row.ageDays && cubeCount === row.cubeCount && concretingDate === row.concretingDate) return row;
    if (hasStarted(row.ageDays)) return row;
    // The date follows from the other two rather than being typed beside them,
    // which is what keeps a report from falling due before its own test.
    const requiredTestDate = testDateFor(concretingDate, ageDays) || row.requiredTestDate;
    return {
      ...row,
      cubeCount,
      ageDays,
      concretingDate,
      requiredTestDate,
      reportDueDate: reportDueFor(requiredTestDate) || row.reportDueDate
    };
  });

  return next.every((row, index) => row === existing[index]) ? undefined : next;
}

/**
 * The row that booked this test, but only where it has just moved.
 *
 * Matched on the age the test was scheduled at, because that is the only mark
 * the booking leaves on it. A test whose age matches no row - one left behind
 * by an older edit - is not touched.
 */
export function movedScheduleFor(
  existing: TestScheduleRow[],
  next: TestScheduleRow[],
  scheduledAgeDays?: number
): TestScheduleRow | undefined {
  const index = existing.findIndex((row) => row.ageDays === scheduledAgeDays);
  if (index === -1) return undefined;
  return next[index] === existing[index] ? undefined : next[index];
}

/** "Rezistenca ... - 7 ditë" renamed to the age the group now carries. */
export function retargetedTestType(testType: string, ageDays: number) {
  return testType.replace(/ - \d+ ditë$/, ` - ${ageDays} ditë`);
}
