import type { Client, LabTest, LabUser, Project, Report, Sample } from "./types";

/**
 * Lookup maps for the registers.
 *
 * Without these, drawing one register row costs a full scan of `tests`,
 * `reports`, `clients`, `projects` and `users` — and the sort comparator pays
 * the same again for every row. That is fine at a hundred samples and
 * unworkable at ten thousand.
 *
 * Build one of these per render with `useLabIndex`, then look everything up in
 * constant time. Cost drops from O(rows x records) to O(records) once.
 */
export type LabIndex = {
  testsBySample: Map<string, LabTest[]>;
  reportsBySample: Map<string, Report[]>;
  reportsByTest: Map<string, Report[]>;
  sampleById: Map<string, Sample>;
  clientById: Map<string, Client>;
  projectById: Map<string, Project>;
  userById: Map<string, LabUser>;
};

function groupBy<T>(rows: T[], keyOf: (row: T) => string | undefined): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const key = keyOf(row);
    if (!key) continue;
    const bucket = map.get(key);
    if (bucket) bucket.push(row);
    else map.set(key, [row]);
  }
  return map;
}

function keyById<T extends { id: string }>(rows: T[]): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) map.set(row.id, row);
  return map;
}

export function buildLabIndex(source: {
  samples: Sample[];
  tests: LabTest[];
  reports: Report[];
  clients: Client[];
  projects: Project[];
  users: LabUser[];
}): LabIndex {
  return {
    testsBySample: groupBy(source.tests, (test) => test.sampleId),
    reportsBySample: groupBy(source.reports, (report) => report.sampleId),
    reportsByTest: groupBy(source.reports, (report) => report.testId),
    sampleById: keyById(source.samples),
    clientById: keyById(source.clients),
    projectById: keyById(source.projects),
    userById: keyById(source.users)
  };
}

/** The empty buckets returned for a sample that has no tests/reports yet.
 *  Shared constants so we never allocate a throwaway array per row. */
export const NO_TESTS: LabTest[] = [];
export const NO_REPORTS: Report[] = [];
