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

// Who may reject a report, and from which state. A reviewer (Chief of Lab or
// superadmin) rejects what is waiting for them, and can also take back an
// approval: the Chief of Lab is usually the one who approved it in the first
// place, and having to ask the superadmin to undo that approval put a person in
// the way of a correction. Once the report has left the building — issued or
// sent to the client — only the superadmin can call it back, because by then it
// is the client's copy that is wrong and somebody has to tell them.
export function canRejectReport(role?: Role, status?: ReportStatus) {
  if (!status || status === "Rejected") return false;
  if (status === "Pending Approval" || status === "Approved") return canReviewTests(role);
  // Drafted, issued or already sent: the superadmin's call.
  return isSuperAdmin(role);
}

export function canManageClients(role?: Role) {
  return isSuperAdmin(role) || role === "Chief of Lab";
}

/**
 * Who may see which client a sample belongs to.
 *
 * The restriction exists for impartiality (§4.1): whoever runs the test should
 * not know whose concrete it is, so technicians see a client code and nothing
 * else. It is not a confidentiality rule — it is there to keep the result
 * uninfluenced.
 *
 * The line therefore used to fall between people who perform tests and people
 * who run the business of the lab. The Operations Manager books the samples in,
 * assigns them and answers the client on the phone; withholding the name made
 * that job harder without making any result more impartial.
 *
 * The Lab Engineer sits on both sides of that line — they register the sample,
 * assign its client, run the test and prepare the report — and on 20 October
 * 2026 David ruled they see the name throughout. The impartiality safeguard for
 * them is therefore not blindness to the client but the separation of approval:
 * the Chief of Lab signs off every result an engineer produces, and no engineer
 * can approve their own work. Technicians, who only perform tests, still see a
 * client code and nothing else.
 */
export function canViewClientIdentity(role?: Role) {
  return (
    role === "Admin / Managing Director" ||
    role === "Chief of Lab" ||
    role === "Document Controller" ||
    role === "Operations Manager" ||
    role === "Lab Engineer"
  );
}

/**
 * Who may point a registered sample at its client and project.
 *
 * Reception books samples in before the client is settled, so whoever runs
 * reception has to be able to finish the job — otherwise the sample waits on
 * the Chief of Lab for a step that is pure administration. The Operations
 * Manager is that person here.
 *
 * Note this is not the same right as seeing who the client is: a role without
 * `canViewClientIdentity` picks from a list of client codes with no names
 * against them, which is what keeps the testing itself impartial. The sample
 * page already draws the list that way.
 */
export function canAssignSampleClient(role?: Role) {
  return (
    isSuperAdmin(role) ||
    role === "Chief of Lab" ||
    role === "Operations Manager" ||
    role === "Lab Engineer"
  );
}

export function canRegisterSamples(role?: Role) {
  return (
    isSuperAdmin(role) ||
    role === "Chief of Lab" ||
    role === "Operations Manager" ||
    role === "Lab Engineer" ||
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

/**
 * Who may price work and send an offer out.
 *
 * Commercial terms, not lab work: the discounts, the payment milestones and
 * the bill of quantities commit the company, so this stays with the Managing
 * Director and the Chief of Lab even though a Lab Engineer may do everything
 * else on a sample.
 *
 * Locked to these two people by name, not by role, for the same reason as
 * sample editing and report sending below: an offer commits the company to a
 * price and leaves in the lab's name, and a second Chief of Lab added later
 * should not inherit that by accident. The route enforces the same list
 * server-side — this check only decides what the screen shows.
 */
const OFFER_ALLOWED_EMAILS = ["d.alliu@sarpandlab.al", "a.duzha@sarpandlab.al"];

export function canGenerateOffers(email?: string) {
  return Boolean(email && OFFER_ALLOWED_EMAILS.includes(email.trim().toLowerCase()));
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
    role === "Document Controller" ||
    role === "Lab Engineer";

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

/**
 * How far a sand or gravel sample's certificates have got.
 *
 * The origin and the fraction are not registration data, they are the name
 * the certificate prints, so what decides who may still set them is not the
 * sample's own lock but how far that name has already travelled.
 */
export type AggregateNamingStage = "unreported" | "reported" | "issued";

export function aggregateNamingStage(reportStatuses: ReportStatus[]): AggregateNamingStage {
  if (!reportStatuses.length) return "unreported";
  return reportStatuses.includes("Sent to Client") ? "issued" : "reported";
}

/**
 * Who may name a sand or gravel sample at each of those stages.
 *
 * Before any certificate exists the name is still the laboratory's own
 * working description, and the particle size is read off the grading, so it
 * belongs to whoever worked on the sample. Deliberately not the two-name
 * sample-edit allow-list: this is a result being recorded, not a correction
 * to somebody's registration.
 *
 * Once a certificate exists the name is on it, and completing it belongs to
 * the person who signs it. That is the ordinary case, not the exception:
 * everything tested before the fraction was asked for at all is already
 * reported, and refusing to name those would have left the entire backlog
 * permanently nameless while only new deliveries could ever be described
 * properly.
 *
 * That holds after the report has gone to the client too, where it was the
 * Managing Director's alone until David opened it to the Chief of Lab on 13
 * November 2026. She signs these certificates as laboratory responsible, so
 * deciding that one has to go out again with the material properly named is
 * her call; the card tells her the client's copy must be regenerated and
 * re-sent.
 */
export function canNameAggregateSample(role: Role | undefined, stage: AggregateNamingStage) {
  if (stage === "unreported") {
    return isSuperAdmin(role) || role === "Chief of Lab" || role === "Lab Engineer" || isTechnicianRole(role);
  }
  return canReviewTests(role);
}
