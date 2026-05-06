import type { Role } from "./types";

export function canViewClientIdentity(role?: Role) {
  return role === "Admin / Managing Director" || role === "Chief of Lab" || role === "Document Controller";
}

export function canAssignSampleClient(role?: Role) {
  return role === "Admin / Managing Director" || role === "Chief of Lab";
}

export function canRegisterSamples(role?: Role) {
  return role === "Admin / Managing Director" || role === "Operations Manager" || role === "Technician";
}

export function canManageEmployees(role?: Role) {
  return role === "Admin / Managing Director";
}
