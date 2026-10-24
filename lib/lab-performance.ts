import { accreditedSampleTypes } from "./accredited-tests";
import type { LabState, Sample } from "./types";

/**
 * Laboratory performance, over a period rather than a single month.
 *
 * What the owner of a laboratory needs from the register is not a count of
 * this month's samples. It is four questions: is the lab getting faster or
 * slower, who is doing the work, what is selling, and what is the lab
 * accredited for but not selling. Everything below answers one of those, and
 * nothing is reported that the register cannot actually support.
 *
 * Three decisions about the data are worth knowing, because they change what
 * the numbers mean:
 *
 *   1. Work is dated by `completedAt` — when the technician finished — and
 *      never by a status. "Completed" and "Approved" are statuses nothing in
 *      the app assigns, and metrics built on them read zero forever.
 *
 *   2. A report is dated by `approvedAt`, not `issuedAt`. Only 4 of 1272
 *      reports carry an issue date, because issuing happens outside the app;
 *      approval is the last step the register actually witnesses.
 *
 *   3. "On time" is measured as the result being ENTERED by the due date, and
 *      is named that way throughout. The register knows when a result was
 *      typed in, not when the specimen was broken, and those differ by about
 *      five days on average. Calling it "tested on time" would be a harsher
 *      number than the lab deserves and a dishonest one.
 */

export type PerformancePeriod = { from: string; to: string };

/** Every worksheet collection, which together say who performed each test. */
const WORKSHEET_COLLECTIONS = [
  "concreteTests", "concreteWaterPenetrationTests", "concreteFlexuralTests", "concreteDensityTests",
  "concreteIndirectTensileTests", "concreteCoreTests", "asphaltTests", "thermalInsulationTests",
  "cementConsistencyTests", "cementStrengthTests", "cementBlaineTests", "admixtureTests",
  "masonryUnitTests", "pavingElementTests", "waterAnalysisTests", "sclerometerTests", "mortarTests",
  "steelTests", "aggregateTests", "aggregateChemicalTests", "aggregateLosAngelesTests",
  "aggregateFreezeThawTests", "aggregateAcvTests", "aggregateDensityAbsorptionTests",
  "aggregateFillerDensityTests", "aggregateShapeIndexTests", "aggregateFlakinessIndexTests",
  "aggregateElongationIndexTests", "aggregateBulkDensityTests", "aggregateSandEquivalentTests",
  "aggregateSoundnessTests"
] as const;

type WorksheetRow = { testId?: string; technicianName?: string; checkedBy?: string };

export type MonthPoint = {
  /** YYYY-MM, and the label the charts show. */
  key: string;
  label: string;
  samples: number;
  testsCompleted: number;
  reportsApproved: number;
  /** Days from the sample arriving to the result being entered. */
  turnaroundDays: number | undefined;
  /** Days between the due date and the result being entered — the part of the
   *  wait the laboratory actually controls. */
  lagAfterDueDays: number | undefined;
  /** Share of results entered by their due date, 0-100. */
  onTimePercent: number | undefined;
};

export type TechnicianRow = {
  name: string;
  tests: number;
  sharePercent: number;
  turnaroundDays: number | undefined;
  lagAfterDueDays: number | undefined;
  sampleTypes: number;
};

export type ReviewerRow = { name: string; approved: number; rejected: number };

export type TestTypeRow = {
  sampleType: string;
  samples: number;
  /** How late this type's results typically are, and how often they land on
   *  time — a type that sells well but always runs late is a complaint
   *  waiting to happen. */
  lagAfterDueDays: number | undefined;
  onTimePercent: number | undefined;
  previousSamples: number;
  /** Percentage change against the preceding period of equal length. */
  changePercent: number | undefined;
  sharePercent: number;
};

export type DormantRow = {
  sampleType: string;
  samples: number;
  /** When this type was last seen at all, period or no period. */
  lastSeen: string | undefined;
};

export type ClientRow = {
  clientId: string;
  name: string;
  samples: number;
  sampleTypes: number;
  sharePercent: number;
};

export type LabPerformance = {
  period: PerformancePeriod;
  months: MonthPoint[];
  totals: {
    samples: number;
    testsCompleted: number;
    reportsApproved: number;
    turnaroundDays: number | undefined;
    lagAfterDueDays: number | undefined;
    onTimePercent: number | undefined;
    reworkPercent: number | undefined;
    openTests: number;
    overdueTests: number;
  };
  /** The same headline figures over the preceding period of equal length. */
  previous: { samples: number; testsCompleted: number; turnaroundDays: number | undefined; lagAfterDueDays: number | undefined; onTimePercent: number | undefined };
  technicians: TechnicianRow[];
  reviewers: ReviewerRow[];
  testTypes: TestTypeRow[];
  dormant: DormantRow[];
  clients: ClientRow[];
  concentration: {
    topTechnicianShare: number | undefined;
    topTechnicianName: string | undefined;
    topClientShare: number | undefined;
    topClientName: string | undefined;
    /** Accredited sample types with no work at all in the period. */
    dormantCount: number;
    accreditedCount: number;
  };
};

const MONTHS_SQ = ["Jan", "Shk", "Mar", "Pri", "Maj", "Qer", "Kor", "Gus", "Sht", "Tet", "Nën", "Dhj"];

const day = (value?: string) => (value ? value.slice(0, 10) : undefined);

function inPeriod(value: string | undefined, period: PerformancePeriod) {
  const d = day(value);
  return Boolean(d && d >= period.from && d <= period.to);
}

function average(values: number[], decimals = 1) {
  if (!values.length) return undefined;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Number(mean.toFixed(decimals));
}

function daysBetween(from?: string, to?: string) {
  const a = day(from);
  const b = day(to);
  if (!a || !b) return undefined;
  const diff = (new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86_400_000;
  return Number.isFinite(diff) ? diff : undefined;
}

/**
 * A calendar date as YYYY-MM-DD, read off the local clock.
 *
 * Deliberately not toISOString(), which converts to UTC first: in Albania
 * (UTC+1, +2 in summer) local midnight is the previous day in UTC, so the
 * preceding period came back ending 30 July instead of 31.
 */
function isoDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/** The preceding window of the same length, for "up or down on last time". */
export function previousPeriod(period: PerformancePeriod): PerformancePeriod {
  const from = new Date(`${period.from}T00:00:00`);
  const to = new Date(`${period.to}T00:00:00`);
  const span = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1);
  const prevTo = new Date(from.getFullYear(), from.getMonth(), from.getDate() - 1);
  const prevFrom = new Date(prevTo.getFullYear(), prevTo.getMonth(), prevTo.getDate() - (span - 1));
  return { from: isoDay(prevFrom), to: isoDay(prevTo) };
}

/** A period covering the last `months` calendar months, ending today. */
export function lastMonths(months: number, today = new Date()): PerformancePeriod {
  const to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const from = new Date(today.getFullYear(), today.getMonth() - (months - 1), 1);
  return { from: isoDay(from), to: isoDay(to) };
}

export function buildLabPerformance(store: LabState, period: PerformancePeriod): LabPerformance {
  const sampleById = new Map(store.samples.map((sample) => [sample.id, sample]));
  const clientById = new Map(store.clients.map((client) => [client.id, client]));
  const userById = new Map(store.users.map((user) => [user.id, user]));

  // Who performed each test, gathered from every worksheet. The LabTest record
  // carries an assigned technician, but it is the worksheet that records who
  // actually did the work and signed it.
  const performerByTest = new Map<string, string>();
  const checkerByTest = new Map<string, string>();
  for (const name of WORKSHEET_COLLECTIONS) {
    const rows = (store as unknown as Record<string, WorksheetRow[]>)[name];
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (!row?.testId) continue;
      if (row.technicianName?.trim()) performerByTest.set(row.testId, row.technicianName.trim());
      if (row.checkedBy?.trim()) checkerByTest.set(row.testId, row.checkedBy.trim());
    }
  }

  const periodSamples = store.samples.filter((sample) => inPeriod(sample.dateReceived, period));
  const completedTests = store.tests.filter((test) => inPeriod(test.completedAt, period));
  const approvedReports = store.reports.filter((report) => inPeriod(report.approvedAt ?? report.createdAt, period));

  const prev = previousPeriod(period);
  const prevSamples = store.samples.filter((sample) => inPeriod(sample.dateReceived, prev));
  const prevCompleted = store.tests.filter((test) => inPeriod(test.completedAt, prev));

  const turnaroundOf = (tests: typeof store.tests) =>
    average(
      tests
        .map((test) => daysBetween(sampleById.get(test.sampleId)?.dateReceived, test.completedAt))
        .filter((value): value is number => value !== undefined && value >= 0)
    );

  // The wait the laboratory owns. Receipt-to-result is dominated by curing —
  // a 28-day cube cannot be tested sooner — so it measures the schedule, not
  // the lab. The gap between the due date and the result is what the lab can
  // actually shorten, and it is the number to steer by.
  const lagOf = (tests: typeof store.tests) =>
    average(
      tests
        .map((test) => daysBetween(test.requiredTestDate, test.completedAt))
        .filter((value): value is number => value !== undefined)
    );

  const onTimeOf = (tests: typeof store.tests) => {
    const judged = tests.filter((test) => test.requiredTestDate && test.completedAt);
    if (!judged.length) return undefined;
    const onTime = judged.filter((test) => day(test.completedAt)! <= day(test.requiredTestDate)!).length;
    return Number(((onTime / judged.length) * 100).toFixed(0));
  };

  // --- Month by month -------------------------------------------------------
  const monthKeys: string[] = [];
  {
    const cursor = new Date(`${period.from}T00:00:00`);
    const end = new Date(`${period.to}T00:00:00`);
    cursor.setDate(1);
    while (cursor <= end) {
      monthKeys.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`);
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  const months: MonthPoint[] = monthKeys.map((key) => {
    const monthOf = (value?: string) => day(value)?.slice(0, 7);
    const samples = periodSamples.filter((sample) => monthOf(sample.dateReceived) === key);
    const tests = completedTests.filter((test) => monthOf(test.completedAt) === key);
    const reports = approvedReports.filter((report) => monthOf(report.approvedAt ?? report.createdAt) === key);
    const [year, month] = key.split("-");
    return {
      key,
      label: `${MONTHS_SQ[Number(month) - 1]} ${year.slice(2)}`,
      samples: samples.length,
      testsCompleted: tests.length,
      reportsApproved: reports.length,
      turnaroundDays: turnaroundOf(tests),
      lagAfterDueDays: lagOf(tests),
      onTimePercent: onTimeOf(tests)
    };
  });

  // --- People ---------------------------------------------------------------
  const byTechnician = new Map<string, { tests: number; turnarounds: number[]; lags: number[]; types: Set<string> }>();
  for (const test of completedTests) {
    const who = performerByTest.get(test.id);
    if (!who) continue;
    const bucket = byTechnician.get(who) ?? { tests: 0, turnarounds: [], lags: [], types: new Set<string>() };
    bucket.tests += 1;
    const lag = daysBetween(test.requiredTestDate, test.completedAt);
    if (lag !== undefined) bucket.lags.push(lag);
    const turnaround = daysBetween(sampleById.get(test.sampleId)?.dateReceived, test.completedAt);
    if (turnaround !== undefined && turnaround >= 0) bucket.turnarounds.push(turnaround);
    const type = sampleById.get(test.sampleId)?.sampleType;
    if (type) bucket.types.add(type);
    byTechnician.set(who, bucket);
  }
  const attributedTests = [...byTechnician.values()].reduce((sum, bucket) => sum + bucket.tests, 0);
  const technicians: TechnicianRow[] = [...byTechnician.entries()]
    .map(([name, bucket]) => ({
      name,
      tests: bucket.tests,
      sharePercent: attributedTests ? Number(((bucket.tests / attributedTests) * 100).toFixed(1)) : 0,
      turnaroundDays: average(bucket.turnarounds),
      lagAfterDueDays: average(bucket.lags),
      sampleTypes: bucket.types.size
    }))
    .sort((a, b) => b.tests - a.tests);

  const byReviewer = new Map<string, { approved: number; rejected: number }>();
  for (const report of approvedReports) {
    const approver = report.approvedBy;
    if (approver) {
      const bucket = byReviewer.get(approver) ?? { approved: 0, rejected: 0 };
      bucket.approved += 1;
      byReviewer.set(approver, bucket);
    }
    if (report.rejectedBy) {
      const bucket = byReviewer.get(report.rejectedBy) ?? { approved: 0, rejected: 0 };
      bucket.rejected += 1;
      byReviewer.set(report.rejectedBy, bucket);
    }
  }
  const reviewers: ReviewerRow[] = [...byReviewer.entries()]
    .map(([id, bucket]) => ({ name: userById.get(id)?.fullName ?? id, ...bucket }))
    .sort((a, b) => b.approved - a.approved);

  // --- What is selling, and what is not -------------------------------------
  const countByType = (rows: Sample[]) => {
    const map = new Map<string, number>();
    for (const sample of rows) map.set(sample.sampleType, (map.get(sample.sampleType) ?? 0) + 1);
    return map;
  };
  const thisTypes = countByType(periodSamples);
  const prevTypes = countByType(prevSamples);

  // Completed tests grouped by the type of sample they were run on, so each
  // row can say how late that kind of work usually runs.
  const testsByType = new Map<string, typeof store.tests>();
  for (const test of completedTests) {
    const type = sampleById.get(test.sampleId)?.sampleType;
    if (!type) continue;
    const bucket = testsByType.get(type) ?? [];
    bucket.push(test);
    testsByType.set(type, bucket);
  }

  const testTypes: TestTypeRow[] = [...thisTypes.entries()]
    .map(([sampleType, samples]) => {
      const previousSamples = prevTypes.get(sampleType) ?? 0;
      const typeTests = testsByType.get(sampleType) ?? [];
      return {
        sampleType,
        samples,
        lagAfterDueDays: lagOf(typeTests),
        onTimePercent: onTimeOf(typeTests),
        previousSamples,
        changePercent: previousSamples ? Number((((samples - previousSamples) / previousSamples) * 100).toFixed(0)) : undefined,
        sharePercent: periodSamples.length ? Number(((samples / periodSamples.length) * 100).toFixed(1)) : 0
      };
    })
    .sort((a, b) => b.samples - a.samples);

  // Accredited capability that earned nothing this period. The lab holds a
  // scope far wider than the work coming through the door, and this is the
  // list of what it is already entitled to sell.
  const lastSeenByType = new Map<string, string>();
  for (const sample of store.samples) {
    const seen = day(sample.dateReceived);
    if (!seen) continue;
    const current = lastSeenByType.get(sample.sampleType);
    if (!current || seen > current) lastSeenByType.set(sample.sampleType, seen);
  }
  const dormant: DormantRow[] = accreditedSampleTypes
    .map((sampleType) => ({
      sampleType,
      samples: thisTypes.get(sampleType) ?? 0,
      lastSeen: lastSeenByType.get(sampleType)
    }))
    .filter((row) => row.samples === 0)
    .sort((a, b) => (b.lastSeen ?? "").localeCompare(a.lastSeen ?? ""));

  // --- Clients --------------------------------------------------------------
  const byClient = new Map<string, { samples: number; types: Set<string> }>();
  for (const sample of periodSamples) {
    if (!sample.clientId) continue;
    const bucket = byClient.get(sample.clientId) ?? { samples: 0, types: new Set<string>() };
    bucket.samples += 1;
    bucket.types.add(sample.sampleType);
    byClient.set(sample.clientId, bucket);
  }
  const clients: ClientRow[] = [...byClient.entries()]
    .map(([clientId, bucket]) => ({
      clientId,
      name: clientById.get(clientId)?.clientName ?? "—",
      samples: bucket.samples,
      sampleTypes: bucket.types.size,
      sharePercent: periodSamples.length ? Number(((bucket.samples / periodSamples.length) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.samples - a.samples);

  const everRejected = approvedReports.filter((report) => report.rejectedBy).length;

  return {
    period,
    months,
    totals: {
      samples: periodSamples.length,
      testsCompleted: completedTests.length,
      reportsApproved: approvedReports.length,
      turnaroundDays: turnaroundOf(completedTests),
      lagAfterDueDays: lagOf(completedTests),
      onTimePercent: onTimeOf(completedTests),
      reworkPercent: approvedReports.length
        ? Number(((everRejected / approvedReports.length) * 100).toFixed(1))
        : undefined,
      openTests: store.tests.filter((test) => !test.completedAt).length,
      overdueTests: store.tests.filter(
        (test) => !test.completedAt && test.requiredTestDate && day(test.requiredTestDate)! < new Date().toISOString().slice(0, 10)
      ).length
    },
    previous: {
      samples: prevSamples.length,
      testsCompleted: prevCompleted.length,
      turnaroundDays: turnaroundOf(prevCompleted),
      lagAfterDueDays: lagOf(prevCompleted),
      onTimePercent: onTimeOf(prevCompleted)
    },
    technicians,
    reviewers,
    testTypes,
    dormant,
    clients,
    concentration: {
      topTechnicianShare: technicians[0]?.sharePercent,
      topTechnicianName: technicians[0]?.name,
      topClientShare: clients[0]?.sharePercent,
      topClientName: clients[0]?.name,
      dormantCount: dormant.length,
      accreditedCount: accreditedSampleTypes.length
    }
  };
}
