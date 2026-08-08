import type { ReportStatus, Role, TestStatus } from "./types";

export function isSuperAdmin(role?: Role) {
  return role === "Admin / Managing Director";
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
  if (!status) return false;
  if (status === "Pending Approval") return canReviewTests(role);
  if (["Approved", "Issued", "Sent to Client"].includes(status)) return isSuperAdmin(role);
  return false;
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
    role === "Technician" ||
    role === "Quality Manager"
  );
}

export function canManageEmployees(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canDeleteSamples(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canEditSampleAfterRegistration(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab" || role === "Operations Manager" || role === "Technician";
}

export function canEditTestData(role?: Role, status?: TestStatus) {
  if (isSuperAdmin(role) || role === "Chief of Lab") return true;
  return Boolean(status && ["Pending", "Scheduled", "In Progress", "Delayed", "Rejected"].includes(status));
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
