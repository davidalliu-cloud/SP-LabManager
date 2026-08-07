import type { LabTest, Report, Sample, SampleStatus } from "./types";

// The agreed sample lifecycle, in order. Used for the badge label, the stage
// stepper and for sorting the register by how far along a sample is.
export const SAMPLE_STAGES: SampleStatus[] = [
  "Registered",
  "Accepted",
  "In Testing",
  "Partially Tested",
  "Tested",
  "Report Issued",
  "Delivered"
];

export function sampleStageIndex(status: SampleStatus) {
  const index = SAMPLE_STAGES.indexOf(status);
  return index === -1 ? 0 : index;
}

// How far a single test has progressed along the pipeline. Testing progress is
// read from the test status; the report-issued / delivered steps are read from
// the test's report(s) so that a test whose data is technically approved but has
// no issued report yet still counts as only "tested".
//   0 accepted, awaiting testing   (Pending / Scheduled)
//   1 testing underway / rework    (In Progress / Pending Technical Review / Rejected / Delayed)
//   2 testing finished             (Completed / Report Drafted / Pending Approval / Approved)
//   3 report approved & issued     (a report exists and every report is approved or sent)
//   4 delivered to the client      (a report exists and every report is sent to client)
function testTestingRank(status: LabTest["status"]): number {
  switch (status) {
    case "In Progress":
    case "Pending Technical Review":
    case "Rejected":
    case "Delayed":
      return 1;
    case "Completed":
    case "Report Drafted":
    case "Pending Approval":
    case "Approved":
    case "Issued":
    case "Sent to Client":
      return 2;
    default:
      return 0; // Pending / Scheduled
  }
}

function testRank(test: LabTest, reports: Report[]): number {
  const testReports = reports.filter((report) => report.testId === test.id);
  if (testReports.length > 0) {
    if (testReports.every((report) => report.reportStatus === "Sent to Client")) return 4;
    if (testReports.every((report) => report.reportStatus === "Approved" || report.reportStatus === "Sent to Client")) return 3;
  }
  return testTestingRank(test.status);
}

// Derive the sample's current stage from its tests and their reports. A sample
// with no tests is still only "Registered"; once accepted, tests exist
// (initially "Pending") and the stage advances as those tests are worked,
// reported and delivered.
export function deriveSampleStage(sample: Pick<Sample, "id">, tests: LabTest[], reports: Report[] = []): SampleStatus {
  const sampleTests = tests.filter((test) => test.sampleId === sample.id);
  if (sampleTests.length === 0) return "Registered";
  const ranks = sampleTests.map((test) => testRank(test, reports));
  if (ranks.every((rank) => rank >= 4)) return "Delivered";
  if (ranks.every((rank) => rank >= 3)) return "Report Issued";
  if (ranks.every((rank) => rank >= 2)) return "Tested";
  if (ranks.some((rank) => rank >= 2)) return "Partially Tested";
  if (ranks.some((rank) => rank >= 1)) return "In Testing";
  return "Accepted";
}
