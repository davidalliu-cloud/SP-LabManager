/**
 * Punët jokonforme dhe ankesat — ISO/IEC 17025 §7.10, §7.9 and §8.7.
 *
 * Two registers that belong together, because that is how the lab's own forms
 * work. SL-FP-7.10.1 is titled "FORMULARI I KONTROLLIT TË JOKONFORMITETEVE /
 * VEPRIMET KORRIGJUESE" — the nonconformity and the corrective action are one
 * record, from the finding through the root cause and the action to the
 * verification that it worked. SL-RP-7.10.2 files the same thing as a register
 * row. A complaint (SL-RP-7.9) is a separate record that may raise one.
 *
 * What the app adds to the paper is linkage and a deadline that chases itself:
 * a finding can point at the sample, test, report or instrument it concerns,
 * and an action past its afat says so without anyone going looking.
 */

/** Sektori — from the register's own entries, spelling settled. */
export const NC_SECTORS = [
  "Menaxhimi i Cilësisë",
  "Departamenti Fiziko-Mekanik",
  "Departamenti Kimik",
  "Departamenti Gjeoteknik",
  "Raportimi i rezultateve",
  "Administrativ"
] as const;

/**
 * Jo-konformiteti u konstatua nga. The form offers three; the register shows
 * two more in regular use, and a complaint raises one of its own.
 */
export const NC_SOURCES = [
  "DPA",
  "Auditimi i jashtëm",
  "Auditimi i brendshëm",
  "Kontrolli rutinë",
  "Ankesë e klientit"
] as const;

export type NonconformityStatus = "Hapur" | "Në proces" | "Mbyllur";

export type Nonconformity = {
  id: string;
  /** Nr. JK — continues SL-RP-7.10.2, which stood at 115 in March 2025. */
  number: number;
  /** Kodi i JK */
  code?: string;
  /** Data e raportimit të JK */
  reportedDate: string;
  /** Sektori */
  sector: string;
  /** Jo-konformiteti u konstatua nga */
  foundBy: string;
  /** Përshkrimi i JK */
  description: string;
  /** Analiza e shkakut të JK */
  rootCause?: string;
  /** Veprimi korrigjues që do të ndërmerret */
  correctiveAction?: string;
  /** Personi përgjegjës për kryerjen e veprimit korrigjues */
  responsiblePerson?: string;
  /** Afati — the date the action is due. What makes this register chase itself. */
  dueDate?: string;
  /** Data e kryerjes së veprimit */
  completedDate?: string;
  /** Verifikimi / Monitorimi i efikasitetit */
  effectivenessCheck?: string;
  /** Zgjidhja u monitorua nga */
  monitoredBy?: string;

  /**
   * What the finding concerns. None of these exist on the paper form, and they
   * are the reason for keeping the register here: an assessor asking "which
   * reports were affected" gets an answer instead of a search.
   */
  sampleId?: string;
  testId?: string;
  reportId?: string;
  equipmentId?: string;
  complaintId?: string;

  /** §7.10.1(c): whether the client had to be told, and when. */
  clientNotified?: boolean;
  clientNotifiedDate?: string;

  createdAt: string;
  updatedAt?: string;
};

export type ComplaintStatus = "E hapur" | "Në shqyrtim" | "E mbyllur";

export type Complaint = {
  id: string;
  /** Nr. i ankesës */
  number: number;
  /** Data e regjistrimit të ankesës */
  receivedDate: string;
  /** Ankimuesi */
  complainant: string;
  /** The client record behind the complainant, where there is one. */
  clientId?: string;
  /** Sektori të cilit i drejtohet */
  sector: string;
  /** Përshkrimi i ankesës */
  description: string;
  /** Statusi i ankesës */
  status: ComplaintStatus;
  /** Data e kthimit të përgjigjes */
  respondedDate?: string;
  /** How it was dealt with — SL-FP-7.9.2 Formulari i trajtimit. */
  resolution?: string;
  /** The report complained about, where the complaint is about one. */
  reportId?: string;
  createdAt: string;
  updatedAt?: string;
};

/**
 * Status is derived, never typed.
 *
 * A register where somebody sets the status by hand drifts from the facts the
 * moment one person forgets. Here the dates decide: an action verified as
 * effective is closed, an action taken but unverified is in progress, and
 * anything else is open.
 */
export function nonconformityStatus(item: Nonconformity): NonconformityStatus {
  if (item.completedDate && item.effectivenessCheck?.trim()) return "Mbyllur";
  if (item.completedDate || item.correctiveAction?.trim()) return "Në proces";
  return "Hapur";
}

export type DueState = "overdue" | "due-soon" | "scheduled" | "none";

/** Matches the equipment register: a month's warning, then red. */
export const NC_WARNING_DAYS = 30;

export function dueState(item: Nonconformity, today = new Date()): DueState {
  if (nonconformityStatus(item) === "Mbyllur") return "none";
  const due = parseDate(item.dueDate);
  if (!due) return "none";
  const days = daysBetween(today, due);
  if (days < 0) return "overdue";
  return days <= NC_WARNING_DAYS ? "due-soon" : "scheduled";
}

export function daysBetween(from: Date, to: Date) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** ISO in, Date out. Dates are stored ISO here and shown European. */
export function parseDate(value?: string) {
  const raw = value?.trim();
  if (!raw) return undefined;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!iso) return undefined;
  const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value?: string) {
  const date = parseDate(value);
  if (!date) return value || "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/**
 * The next number in each register.
 *
 * Taken from the highest already used, not from a count — the same rule as the
 * sample and report registers, and for the same reason: a count breaks the
 * moment the set has a gap.
 */
export function nextNonconformityNumber(existing: Nonconformity[], startFrom = 115) {
  return existing.reduce((max, item) => Math.max(max, item.number), startFrom) + 1;
}

export function nextComplaintNumber(existing: Complaint[]) {
  return existing.reduce((max, item) => Math.max(max, item.number), 0) + 1;
}

export type NonconformityInput = Omit<Nonconformity, "id" | "number" | "createdAt" | "updatedAt">;
export type ComplaintInput = Omit<Complaint, "id" | "number" | "createdAt" | "updatedAt">;
