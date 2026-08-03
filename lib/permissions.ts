import type { LabUser, Role, TestStatus } from "./types";

export function isSuperAdmin(role?: Role) {
  return role === "Admin / Managing Director";
}

export function canReviewTests(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canManageClients(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canViewClientIdentity(role?: Role) {
  return role === "Admin / Managing Director" || role === "Chief of Lab" || role === "Document Controller";
}

export function canAssignSampleClient(role?: Role, user?: Pick<LabUser, "fullName" | "email">) {
  const normalizedName = user?.fullName?.trim().toLowerCase() ?? "";
  const normalizedEmail = user?.email?.trim().toLowerCase() ?? "";
  return (
    role === "Admin / Managing Director" ||
    role === "Chief of Lab" ||
    normalizedName === "astrit prethi" ||
    normalizedEmail.includes("astrit")
  );
}

export function canRegisterSamples(role?: Role) {
  return role === "Admin / Managing Director" || role === "Operations Manager" || role === "Technician";
}

export function canManageEmployees(role?: Role) {
  return role === "Admin / Managing Director";
}

export function canDeleteSamples(role?: Role) {
  return role === "Admin / Managing Director";
}

export function canEditSampleAfterRegistration(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

export function canEditTestData(role?: Role, status?: TestStatus) {
  if (isSuperAdmin(role)) return true;
  return Boolean(status && ["Pending", "Scheduled", "In Progress", "Delayed", "Rejected"].includes(status));
}

export function canGenerateReportForTest(role?: Role, status?: TestStatus, hasReport = false) {
  if (isSuperAdmin(role) || hasReport) return true;
  return status === "Approved";
}
