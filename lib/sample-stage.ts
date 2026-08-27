import type { LabTest, Report, ReportStatus, Sample, SampleStatus } from "./types";

// The single lifecycle, in order. Samples, tests and reports are all shown
// against this one vocabulary; only the granularity differs.
export const SAMPLE_STAGES: SampleStatus[] = [
  "Registered",
  "Accepted",
  "In Testing",
  "Partially Tested",
  "Tested",
  "In Reporting",
  "Report Issued",
  "Delivered"
];

export function sampleStageIndex(status: SampleStatus) {
  const index = SAMPLE_STAGES.indexOf(status);
  return index === -1 ? 0 : index;
}

// The small muted "what's pending" note shown under a stage on the registers,
// and used as the late-reason on the dashboard. Rendered via i18n key
// `lifecycleDetail.<key>`.
export type LifecycleDetail =
  | "awaitTesting"
  | "testing"
  | "awaitTechApproval"
  | "awaitReport"
  | "reportPreparing"
  | "reportAwaitApproval"
  | "reportApproved"
  | "rejected"
  | "delivered"
  | "registered";

export type Lifecycle = { stage: SampleStatus; detail: LifecycleDetail };

// How far along the lifecycle a single test sits (rank → stage):
//   0 Accepted · 1 In Testing · 2 Tested · 3 In Reporting · 4 Report Issued · 5 Delivered
function testStatusRank(status: LabTest["status"]): number {
  switch (status) {
    case "In Progress":
    case "Pending Technical Review":
    case "Rejected":
    case "Delayed":
      return 1;
    case "Approved":
    case "Completed":
      return 2;
    case "Report Drafted":
    case "Pending Approval":
      return 3;
    case "Report Approved":
    case "Issued":
      return 4;
    case "Sent to Client":
      return 5;
    default:
      return 0; // Pending / Scheduled
  }
}

function reportStatusRank(status: ReportStatus): number {
  switch (status) {
    case "Approved":
    case "Issued":
      return 4;
    case "Sent to Client":
      return 5;
    default:
      return 3; // Draft / Report Drafted / Pending Approval / Rejected
  }
}

const RANK_STAGE: SampleStatus[] = ["Accepted", "In Testing", "Tested", "In Reporting", "Report Issued", "Delivered"];

// Rank for a test whose reports have already been resolved by the caller.
function rankFromReports(test: LabTest, testReports: Report[]): number {
  const reportRank = testReports.reduce((max, report) => Math.max(max, reportStatusRank(report.reportStatus)), -1);
  return Math.max(testStatusRank(test.status), reportRank);
}

function testRank(test: LabTest, reports: Report[]): number {
  return rankFromReports(test, reports.filter((report) => report.testId === test.id));
}

// A single test's position in the lifecycle + the pending detail.
export function testLifecycle(test: LabTest, reports: Report[] = []): Lifecycle {
  return { stage: RANK_STAGE[testRank(test, reports)] ?? "Accepted", detail: detailForTestStatus(test.status) };
}

/** Indexed twin of `testLifecycle`. Same answer, but the caller supplies the
 *  test's own reports, so the full report list is never scanned per row. */
export function testLifecycleFrom(test: LabTest, testReports: Report[]): Lifecycle {
  return { stage: RANK_STAGE[rankFromReports(test, testReports)] ?? "Accepted", detail: detailForTestStatus(test.status) };
}

function detailForTestStatus(status: LabTest["status"]): LifecycleDetail {
  let detail: LifecycleDetail;
  switch (status) {
    case "In Progress":
      detail = "testing";
      break;
    case "Pending Technical Review":
      detail = "awaitTechApproval";
      break;
    case "Rejected":
      detail = "rejected";
      break;
    case "Delayed":
      detail = "testing";
      break;
    case "Approved":
    case "Completed":
      detail = "awaitReport";
      break;
    case "Report Drafted":
      detail = "reportPreparing";
      break;
    case "Pending Approval":
      detail = "reportAwaitApproval";
      break;
    case "Report Approved":
    case "Issued":
      detail = "reportApproved";
      break;
    case "Sent to Client":
      detail = "delivered";
      break;
    default:
      detail = "awaitTesting"; // Pending / Scheduled
  }
  return detail;
}

// A single report's position in the lifecycle + the pending detail.
export function reportLifecycle(report: Pick<Report, "reportStatus">): Lifecycle {
  switch (report.reportStatus) {
    case "Pending Approval":
      return { stage: "In Reporting", detail: "reportAwaitApproval" };
    case "Approved":
    case "Issued":
      return { stage: "Report Issued", detail: "reportApproved" };
    case "Sent to Client":
      return { stage: "Delivered", detail: "delivered" };
    case "Rejected":
      return { stage: "In Reporting", detail: "rejected" };
    default:
      return { stage: "In Reporting", detail: "reportPreparing" }; // Draft / Report Drafted
  }
}

// Derive the sample's aggregate stage from its tests + reports. No tests →
// "Registered"; otherwise the sample advances only as far as its least-advanced
// test, except that a mix of finished and unfinished tests reads as
// "Partially Tested".
function stageFromRanks(ranks: number[]): SampleStatus {
  if (ranks.length === 0) return "Registered";
  if (ranks.every((rank) => rank >= 5)) return "Delivered";
  if (ranks.every((rank) => rank >= 4)) return "Report Issued";
  if (ranks.every((rank) => rank >= 3)) return "In Reporting";
  if (ranks.every((rank) => rank >= 2)) return "Tested";
  if (ranks.some((rank) => rank >= 2)) return "Partially Tested";
  if (ranks.some((rank) => rank >= 1)) return "In Testing";
  return "Accepted";
}

export function deriveSampleStage(sample: Pick<Sample, "id">, tests: LabTest[], reports: Report[] = []): SampleStatus {
  const sampleTests = tests.filter((test) => test.sampleId === sample.id);
  return stageFromRanks(sampleTests.map((test) => testRank(test, reports)));
}

/** Indexed twin of `deriveSampleStage`. Same answer, but the caller supplies
 *  the sample's own tests and a testId → reports map, so nothing is scanned.
 *  Use this on the registers, where the un-indexed version costs
 *  O(tests + reports) per row. */
export function deriveSampleStageFrom(sampleTests: LabTest[], reportsByTest: Map<string, Report[]>): SampleStatus {
  return stageFromRanks(sampleTests.map((test) => rankFromReports(test, reportsByTest.get(test.id) ?? [])));
}

// The sample's aggregate stage plus the pending detail of its least-advanced
// unfinished test (the bottleneck) — used for the dashboard reason.
export function sampleLifecycle(sample: Pick<Sample, "id">, tests: LabTest[], reports: Report[] = []): Lifecycle {
  const stage = deriveSampleStage(sample, tests, reports);
  const sampleTests = tests.filter((test) => test.sampleId === sample.id);
  if (sampleTests.length === 0) return { stage, detail: "registered" };
  // The bottleneck test = the one furthest behind.
  const bottleneck = sampleTests
    .map((test) => ({ test, rank: testRank(test, reports) }))
    .sort((a, b) => a.rank - b.rank)[0];
  return { stage, detail: testLifecycle(bottleneck.test, reports).detail };
}
