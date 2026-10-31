import type { LifecycleDetail } from "@/lib/sample-stage";
import type { LabTest, Report, ReportStatus, SampleStatus } from "@/lib/types";
import type { ClientSlice } from "./session";

/**
 * Which of a client's reports the client may open.
 *
 * Only what the laboratory has finished with: a report is openable once the
 * laboratory responsible has approved it and there is a stored file behind it.
 * A draft, one waiting for approval, and one that was rejected are the
 * laboratory's own working papers — a client watching a number appear and then
 * change would be worse than waiting for it.
 *
 * The register still *lists* those reports, with the stage they have reached,
 * because that is the live status the portal exists to show. It is only the
 * file that waits for approval.
 */
const OPENABLE_STATUSES = new Set(["Approved", "Report Approved", "Issued", "Sent to Client"]);

export function clientVisibleReports(slice: ClientSlice): Report[] {
  return slice.reports.filter((report) => OPENABLE_STATUSES.has(report.reportStatus) && Boolean(report.pdfUrl));
}

/**
 * The laboratory's own vocabulary, in Albanian, for a page rendered on the
 * server.
 *
 * The staff app reads these out of the `useI18n` dictionary, which lives in a
 * client module behind a provider the portal does not mount — so the same
 * wording is repeated here rather than approximated. A client who rings the
 * laboratory about a sample must hear back the words they are looking at;
 * inventing a second, softer vocabulary for the portal would guarantee they
 * do not.
 */
export const STAGE_LABELS: Record<SampleStatus, string> = {
  Registered: "Regjistruar",
  Accepted: "Pranuar",
  "In Testing": "Në testim",
  "Partially Tested": "Testuar pjesërisht",
  Tested: "Testuar / Përfunduar",
  "In Reporting": "Në raportim",
  "Report Issued": "Raporti i lëshuar",
  Delivered: "Dërguar klientit"
};

export const DETAIL_LABELS: Record<LifecycleDetail, string> = {
  awaitTesting: "Pret testim",
  testing: "Në testim e sipër",
  awaitTechApproval: "Pret aprovim teknik",
  awaitReport: "Pret përgatitje raporti",
  reportPreparing: "Raporti në përgatitje",
  reportAwaitApproval: "Raporti pret aprovim",
  reportApproved: "Raporti i miratuar, gati për lëshim",
  rejected: "U refuzua – për korrigjim",
  delivered: "Dërguar te klienti",
  registered: "Regjistruar – pret pranim"
};

export const REPORT_STATUS_LABELS: Record<ReportStatus | "No Report", string> = {
  Draft: "Draft",
  "Report Drafted": "Raport i përgatitur",
  "Pending Approval": "Në pritje miratimi",
  Approved: "Miratuar",
  Rejected: "Refuzuar",
  Issued: "Raporti i lëshuar",
  "Sent to Client": "Dërguar klientit",
  "No Report": "Pa raport"
};

/** The badge colours of `components/ui/status-badge`, which is a client component. */
export const TONE_CLASS: Record<string, string> = {
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  blue: "bg-lab-mist text-lab-navy ring-cyan-100",
  amber: "bg-[#fff3de] text-[#a9761b] ring-[#ffe0a6]",
  green: "bg-[#e7f8f1] text-brand-green ring-[#bfeeda]",
  purple: "bg-fuchsia-50 text-lab-purple ring-fuchsia-100",
  red: "bg-[#ffeaea] text-brand-late ring-[#ffcccc]",
  darkGreen: "bg-brand-green text-white ring-[#0e9d6e]"
};

/** The statuses the laboratory counts as "tested", used for the client's tiles. */
export const COMPLETED_TEST_STATUSES: LabTest["status"][] = [
  "Completed",
  "Report Drafted",
  "Pending Approval",
  "Approved",
  "Report Approved",
  "Rejected",
  "Issued",
  "Sent to Client"
];

export const WAITING_TEST_STATUSES: LabTest["status"][] = ["Pending", "Scheduled", "In Progress"];
