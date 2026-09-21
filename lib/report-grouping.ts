/**
 * How specimens are divided between the reports of one test.
 *
 * A report template holds a fixed number of specimen columns — three on the
 * concrete cube report SL-RA-B-7.8/1.3, two on the core report — so a test with
 * more specimens than that is issued as several reports.
 *
 * The division is balanced, not greedy. Filling each report to capacity and
 * letting the remainder fall into the last one puts four cubes on two reports
 * as 3 + 1, which is the same number of reports as 2 + 2 but leaves a report
 * carrying a single specimen. A mean of one cube is not a mean; the reader of
 * that report cannot see the spread the other three showed, and a client
 * receiving two reports from one pour reasonably expects them to be comparable.
 *
 * So: use the fewest reports the capacity allows, then spread the specimens
 * across them as evenly as possible, fuller reports first.
 *
 *   4 specimens, capacity 3  ->  2 + 2
 *   7 specimens, capacity 3  ->  3 + 2 + 2
 *  10 specimens, capacity 3  ->  3 + 3 + 2 + 2
 */
export function balancedGroups<T>(rows: T[], capacity: number): T[][] {
  if (rows.length === 0) return [];
  if (capacity < 1) return [rows];

  const groups = Math.ceil(rows.length / capacity);
  const base = Math.floor(rows.length / groups);
  // The first `remainder` groups take one extra, which is what puts the fuller
  // reports first and keeps the sizes within one of each other.
  const remainder = rows.length % groups;

  const result: T[][] = [];
  let index = 0;
  for (let group = 0; group < groups; group += 1) {
    const size = base + (group < remainder ? 1 : 0);
    result.push(rows.slice(index, index + size));
    index += size;
  }
  return result;
}

/** The sizes alone, for tests and for explaining a split. */
export function groupSizes(count: number, capacity: number) {
  return balancedGroups(Array.from({ length: count }, (_, index) => index), capacity).map((group) => group.length);
}
