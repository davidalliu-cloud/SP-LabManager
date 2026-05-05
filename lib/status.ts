import type { ReportStatus, SampleStatus, TestStatus } from "./types";

type Tone = "gray" | "blue" | "amber" | "green" | "purple" | "red" | "darkGreen";

const statusTone: Record<TestStatus | SampleStatus | ReportStatus, Tone> = {
  Registered: "gray",
  "Pending Testing": "blue",
  Pending: "blue",
  Scheduled: "blue",
  "In Progress": "amber",
  "Partially Tested": "amber",
  Completed: "green",
  Delayed: "red",
  "Report Drafted": "purple",
  "Pending Approval": "purple",
  Approved: "green",
  Rejected: "red",
  Issued: "darkGreen",
  Draft: "gray"
};

export function getStatusTone(status: TestStatus | SampleStatus | ReportStatus) {
  return statusTone[status] ?? "gray";
}

export function isOverdue(date: string, status: TestStatus) {
  const doneStatuses: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"];
  if (doneStatuses.includes(status)) return false;
  const due = new Date(`${date}T23:59:59`).getTime();
  return due < Date.now();
}

export function isApproaching(date: string) {
  const due = new Date(`${date}T23:59:59`).getTime();
  const diffDays = (due - Date.now()) / 86_400_000;
  return diffDays >= 0 && diffDays <= 3;
}
