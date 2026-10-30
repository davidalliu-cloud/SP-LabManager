import type { LabTest, Report } from "@/lib/types";
import type { ClientSlice } from "./session";

/**
 * Which of a client's reports the client may see.
 *
 * Only what the laboratory has finished with: a report is visible once the
 * laboratory responsible has approved it and there is a stored file to open. A
 * draft, one waiting for approval, and one that was rejected are the
 * laboratory's own working papers — a client watching a number appear and then
 * change would be worse than waiting for it.
 */
const VISIBLE_STATUSES = new Set(["Approved", "Report Approved", "Issued", "Sent to Client"]);

export function clientVisibleReports(slice: ClientSlice): Report[] {
  return slice.reports.filter((report) => VISIBLE_STATUSES.has(report.reportStatus) && Boolean(report.pdfUrl));
}

/**
 * Where a piece of work has got to, said the way a client would ask it.
 *
 * The register's own statuses are about who has to act next inside the
 * laboratory — "Pending Technical Review", "Report Drafted" — which tells a
 * client nothing and invites a phone call about a step that is not theirs.
 * Four states answer the only question they have: is it done, is it being
 * worked on, or is it still waiting.
 */
export function workStatus(test: LabTest, report?: Report) {
  if (report) return "Raporti gati / Report ready";

  switch (test.status) {
    case "Completed":
    case "Approved":
    case "Report Drafted":
    case "Pending Approval":
    case "Pending Technical Review":
      return "Në raportim / Being reported";
    case "In Progress":
      return "Në testim / Testing";
    case "Delayed":
      return "Në testim / Testing";
    default:
      return "Në pritje / Scheduled";
  }
}
