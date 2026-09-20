import type { ReportStatus, Role, TestStatus } from "./types";

export function isSuperAdmin(role?: Role) {
  return role === "Admin / Managing Director";
}

// Chief Technician is Technician with a distinct title (e.g. for a senior/lead
// technician) but identical rights everywhere in the app — always check both
// together via this helper rather than "Technician" alone.
export function isTechnicianRole(role?: Role) {
  return role === "Technician" || role === "Chief Technician";
}

export function canReviewTests(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

// Who may reject a report, and from which state. A report awaiting approval can
// be rejected by any reviewer (Chief of Lab or superadmin). Beyond that, the
// superadmin can override-reject a report that was already approved, issued or
// sent to the client but turns out to be incorrect, sending it back for
// correction.
export function canRejectReport(role?: Role, status?: ReportStatus) {
  if (!status || status === "Rejected") return false;
  if (status === "Pending Approval") return canReviewTests(role);
  // The superadmin can reject a report at any other stage — drafted, approved,
  // issued or already sent — sending it back for correction.
  return isSuperAdmin(role);
}

export function canManageClients(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canViewClientIdentity(role?: Role) {
  return role === "Admin / Managing Director" || role === "Chief of Lab" || role === "Document Controller";
}

export function canAssignSampleClient(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canRegisterSamples(role?: Role) {
  return (
    isSuperAdmin(role) ||
    role === "Chief of Lab" ||
    role === "Operations Manager" ||
    isTechnicianRole(role) ||
    role === "Quality Manager"
  );
}

/**
 * Who may change the equipment register.
 *
 * The Quality Manager keeps the calibration programme and the Head of
 * Laboratory approves it — they are the two names on SL-FB-6.4.7 — plus the
 * Managing Director as the account that can do anything. Everyone else reads it.
 */
export function canManageEquipment(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab" || role === "Quality Manager";
}

/**
 * Who may record the ambient conditions.
 *
 * Everyone who works in the lab: SL-PB-6.3 §3.2 makes monitoring and recording
 * the conditions of their own area a duty of the personnel, not of management.
 * A reading nobody is allowed to enter is a reading that does not get taken.
 */
export function canRecordEnvironment(role?: Role) {
  return Boolean(role);
}

/** Correcting or removing a reading already filed stays with the register's owners. */
export function canAmendEnvironment(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab" || role === "Quality Manager";
}

/**
 * Who may raise a nonconformity or log a complaint.
 *
 * Anyone signed in. A nonconformity nobody can raise is one that gets discussed
 * in the corridor instead of recorded, and §7.10 expects the lab to act when
 * any of its work does not conform — not only when a manager notices.
 */
export function canRaiseNonconformity(role?: Role) {
  return Boolean(role);
}

/**
 * Who may close one: sign off the root cause, the action and the verification
 * of effectiveness. On SL-FP-7.10.1 that signature is the Quality Manager's.
 */
export function canCloseNonconformity(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab" || role === "Quality Manager";
}

export function canManageEmployees(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canDeleteSamples(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

// Editing a sample's details after it has been registered (including its sample
// type) is deliberately locked to these two people by name, not by role - a
// mistake here can misdirect testing/reporting, so it isn't opened up to every
// Chief of Lab / Operations Manager / Technician the way registration itself is.
const SAMPLE_EDIT_ALLOWED_EMAILS = ["d.alliu@sarpandlab.al", "a.duzha@sarpandlab.al"];

export function canEditSampleAfterRegistration(email?: string) {
  return Boolean(email && SAMPLE_EDIT_ALLOWED_EMAILS.includes(email.trim().toLowerCase()));
}

// Sending a report to a client is the moment a lab result leaves the building,
// so like sample editing it is locked to these two people by name rather than by
// role. Nobody else can select reports for sending or trigger the send.
const REPORT_SEND_ALLOWED_EMAILS = ["d.alliu@sarpandlab.al", "a.duzha@sarpandlab.al"];

export function canSendReportsToClient(email?: string) {
  return Boolean(email && REPORT_SEND_ALLOWED_EMAILS.includes(email.trim().toLowerCase()));
}

// A test result is "signed off" once it is approved or has entered the report
// pipeline. From this point the worksheet is frozen for EVERYONE — including the
// superadmin and Chief of Lab — because an approved/issued result must not be
// altered casually. The only way back in is an explicit re-write (which voids
// the approvals) or a report rejection (which sends the test back to "Rejected").
export const SIGNED_OFF_TEST_STATUSES: TestStatus[] = [
  "Approved",
  "Report Drafted",
  "Pending Approval",
  "Report Approved",
  "Issued",
  "Sent to Client"
];

export function isTestSignedOff(status?: TestStatus) {
  return Boolean(status && SIGNED_OFF_TEST_STATUSES.includes(status));
}

export function canEditTestData(role?: Role, status?: TestStatus) {
  // Locked for everyone once signed off — no superadmin/Chief bypass here.
  if (isTestSignedOff(status)) return false;
  // Before sign-off, Chief of Lab and superadmin may correct data at any of the
  // remaining stages (including the review window); others only while the test
  // is still open.
  if (isSuperAdmin(role) || role === "Chief of Lab") return true;
  return Boolean(status && ["Pending", "Scheduled", "In Progress", "Delayed", "Rejected"].includes(status));
}

// A sample's registration data (client, project, sample type, dates…) is locked
// once any signed-off work depends on it — i.e. any of its tests is signed off
// or any report has been generated. Editing it then would silently change the
// basis of an approved result, so it requires a deliberate re-write instead.
export function isSampleLocked(testStatuses: Array<TestStatus | undefined>, hasReport: boolean) {
  return hasReport || testStatuses.some((status) => isTestSignedOff(status));
}

// Re-writing a sample voids its approvals and rewinds the whole flow, so it is
// held to the same named allow-list as ordinary sample editing.
export function canRewriteSample(email?: string) {
  return canEditSampleAfterRegistration(email);
}

export function canGenerateReportForTest(role?: Role, status?: TestStatus, hasReport = false) {
  const canPrepareReports =
    role === "Admin / Managing Director" ||
    role === "Chief of Lab" ||
    role === "Document Controller";

  if (!canPrepareReports) return false;
  if (hasReport) return true;
  return status === "Approved";
}

// Mobile-only guardrail: a technician on the /tech experience may only see and
// open tests assigned to them. This is a UI-layer restriction, not enforced by
// the store or Supabase RLS (the desktop app remains advisory-only, unchanged).
export function canTechnicianAccessTest(currentUserId: string, test: { assignedTechnician: string }) {
  return test.assignedTechnician === currentUserId;
}
