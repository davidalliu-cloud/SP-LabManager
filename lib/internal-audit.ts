/**
 * Auditimet e brendshme — ISO/IEC 17025 §8.8, plan SL-FM-8.8.3, procedure
 * SL-PM-8.8.
 *
 * The plan is a matrix: every clause of the standard down the side, the twelve
 * months across the top, an X where that area will be audited. What the paper
 * cannot do is say, in November, which clauses still have no X against them —
 * and that has already been a finding here. Nonconformity 7, from the February
 * 2017 assessment, records that the annual plan did not address all clauses of
 * the standard and that no audit had been carried out against the ones it
 * missed.
 *
 * So the register holds one row per clause area per year, and the page answers
 * the two questions the assessor asks: is every clause covered this year, and
 * has what was planned actually happened.
 */
export type AuditArea = {
  /** Pika e standardit, as the plan writes it. */
  clause: string;
  title: string;
  /** Top-level headings group the rows; they are audited in their own right. */
  isHeading?: boolean;
};

/**
 * Fusha që do të auditohet — the plan's own rows, in its own order, including
 * the two vertical assessments it ends with.
 */
export const AUDIT_AREAS: AuditArea[] = [
  { clause: "4", title: "Kërkesat e përgjithshme", isHeading: true },
  { clause: "5", title: "Kërkesat strukturore", isHeading: true },
  { clause: "6", title: "Kërkesat e burimeve", isHeading: true },
  { clause: "6.1", title: "Të përgjithshme" },
  { clause: "6.2", title: "Personeli" },
  { clause: "6.3", title: "Akomodimi dhe kushtet ambjentale" },
  { clause: "6.4", title: "Pajisjet" },
  { clause: "6.5", title: "Gjurmueshmëria e matjes" },
  { clause: "6.6", title: "Produktet dhe shërbimet e ofruara nga jashtë" },
  { clause: "7", title: "Kërkesat e procesit", isHeading: true },
  { clause: "7.1", title: "Rishikimi i kërkesave, tenderave dhe kontratave" },
  { clause: "7.2", title: "Përzgjedhja, verifikimi dhe vlerësimi i metodës" },
  { clause: "7.3", title: "Marrja e mostrës" },
  { clause: "7.4", title: "Trajtimi i testimit dhe materialeve të kalibrimit" },
  { clause: "7.5", title: "Të dhënat teknike" },
  { clause: "7.6", title: "Vlerësimi i pasigurisë në matje" },
  { clause: "7.7", title: "Sigurimi i vlefshmërisë së rezultateve" },
  { clause: "7.8", title: "Raportimi i rezultateve" },
  { clause: "7.9", title: "Ankesat" },
  { clause: "7.10", title: "Menaxhimi i jokonformiteteve" },
  { clause: "7.11", title: "Kontrolli i të dhënave dhe menaxhimi i informacionit" },
  { clause: "8", title: "Kërkesat e sistemit të menaxhimit", isHeading: true },
  { clause: "8.1", title: "Opsionet" },
  { clause: "8.2", title: "Dokumentacioni i sistemit të menaxhimit" },
  { clause: "8.3", title: "Kontrolli i dokumentave të sistemit të menaxhimit" },
  { clause: "8.4", title: "Kontrolli i regjistrimeve" },
  { clause: "8.5", title: "Kontrolli i menaxhimit të risqeve dhe mundësive" },
  { clause: "8.6", title: "Përmirësimi" },
  { clause: "8.7", title: "Veprimet korrigjuese" },
  { clause: "8.8", title: "Auditimi i brendshëm" },
  { clause: "8.9", title: "Rishikimi i menaxhimit" },
  { clause: "VV.1", title: "Vlerësim vertikal: procedura e burimeve dhe dosjet e personelit" },
  { clause: "VV.2", title: "Vlerësim vertikal: auditimi i dosjeve të klientëve" }
];

export type AuditEntry = {
  id: string;
  /** Viti i planit */
  year: number;
  /** Pika e standardit — keys back to AUDIT_AREAS. */
  clause: string;
  /** Muaji i planifikuar, 1–12. Absent means not yet planned. */
  plannedMonth?: number;
  /** Data e kryerjes */
  completedDate?: string;
  /** Audituesi — SL-FM-8.8.5 Lista e audituesve. */
  auditor?: string;
  /** Numri i jokonformiteteve të gjetura */
  findings?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AuditStatus = "I kryer" | "I vonuar" | "I planifikuar" | "Pa planifikuar";

/**
 * Status is derived from the plan and the calendar, never typed.
 *
 * "I vonuar" is the one that matters: a month planned and passed with nothing
 * recorded against it. Left to a paper matrix that only becomes visible when
 * somebody counts the Xs in December.
 */
export function auditStatus(entry: AuditEntry | undefined, today = new Date()): AuditStatus {
  if (entry?.completedDate) return "I kryer";
  if (!entry?.plannedMonth) return "Pa planifikuar";
  const endOfPlanned = new Date(entry.year, entry.plannedMonth, 0, 23, 59, 59);
  return endOfPlanned < today ? "I vonuar" : "I planifikuar";
}

export const AUDIT_MONTHS = [
  "Janar",
  "Shkurt",
  "Mars",
  "Prill",
  "Maj",
  "Qershor",
  "Korrik",
  "Gusht",
  "Shtator",
  "Tetor",
  "Nëntor",
  "Dhjetor"
];

export type AuditYearSummary = {
  year: number;
  total: number;
  completed: number;
  overdue: number;
  planned: number;
  unplanned: number;
  findings: number;
};

export function summariseAuditYear(entries: AuditEntry[], year: number, today = new Date()): AuditYearSummary {
  const byClause = new Map(entries.filter((entry) => entry.year === year).map((entry) => [entry.clause, entry]));
  const summary: AuditYearSummary = {
    year,
    total: AUDIT_AREAS.length,
    completed: 0,
    overdue: 0,
    planned: 0,
    unplanned: 0,
    findings: 0
  };
  for (const area of AUDIT_AREAS) {
    const entry = byClause.get(area.clause);
    switch (auditStatus(entry, today)) {
      case "I kryer":
        summary.completed += 1;
        summary.findings += entry?.findings ?? 0;
        break;
      case "I vonuar":
        summary.overdue += 1;
        break;
      case "I planifikuar":
        summary.planned += 1;
        break;
      default:
        summary.unplanned += 1;
    }
  }
  return summary;
}

export function entryFor(entries: AuditEntry[], year: number, clause: string) {
  return entries.find((entry) => entry.year === year && entry.clause === clause);
}

export type AuditEntryInput = Omit<AuditEntry, "id" | "createdAt" | "updatedAt">;
