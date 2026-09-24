import type { ProcedureDocument, ProcedureRevision } from "./types";

/**
 * Procedurat teknike të provës (SOP) — the register of test methods.
 *
 * The 87 procedures ship as a seed in code rather than in the shared state,
 * for the same reason the equipment inventory does: the register is written
 * whole on every save, and reference data that nobody edits has no business
 * being in that payload. Only a procedure somebody has actually revised is
 * stored.
 */
export type ProcedureSeedEntry = {
  id: string;
  code: string;
  title: string;
  category: string;
  fileName: string;
  /** The controlled document in SharePoint. Opening it needs a lab login. */
  fileUrl: string;
};

/**
 * The seeded procedures as ProcedureDocument records.
 *
 * `currentRevisionId` is empty: a seeded procedure has no revision on file
 * here, because the version and effective date live inside the Word document
 * and have not been read into the app. The page shows that plainly rather
 * than implying a revision it does not have.
 */
export function seedAsDocuments(seed: ProcedureSeedEntry[]): ProcedureDocument[] {
  return seed.map((entry) => ({
    id: entry.id,
    category: entry.category,
    code: entry.code,
    title: entry.title,
    testName: entry.title,
    currentRevisionId: "",
    ownerRole: "Chief of Lab" as const,
    createdAt: "2026-09-24T00:00:00.000Z"
  }));
}

/**
 * Seed plus anything saved, matched on code rather than id.
 *
 * Code is what identifies a controlled document — two records carrying
 * SL-SOP-AG-7.2-1.1 are the same procedure however they were created. The
 * eleven aggregate procedures already in the register were added before this
 * seed existed and carry their own ids and revision history, so matching on
 * id would list each of them twice.
 *
 * A saved record wins outright: it is the one with revisions wired to it.
 */
export function mergeProceduresWithSeed(
  saved: ProcedureDocument[] | undefined,
  seed: ProcedureSeedEntry[]
): ProcedureDocument[] {
  const seeded = seedAsDocuments(seed);
  if (!saved?.length) return seeded;

  const savedByCode = new Map(saved.map((row) => [normaliseCode(row.code), row]));
  const merged = seeded.map((row) => savedByCode.get(normaliseCode(row.code)) ?? row);
  const seededCodes = new Set(seeded.map((row) => normaliseCode(row.code)));
  return [...merged, ...saved.filter((row) => !seededCodes.has(normaliseCode(row.code)))];
}

/**
 * What is worth storing: a procedure with a revision on file, or one the seed
 * does not know about because it was added later. Everything else is reference
 * data that already ships with the code.
 *
 * This is only ever applied at the point of writing. Handing a trimmed state to
 * the conflict merge is what destroyed a morning of equipment records, and the
 * same trap is waiting here for anyone who moves this call earlier.
 */
export function proceduresForPersistence(
  procedures: ProcedureDocument[],
  seed: ProcedureSeedEntry[]
): ProcedureDocument[] {
  const seededCodes = new Set(seed.map((entry) => normaliseCode(entry.code)));
  return procedures.filter((row) => row.currentRevisionId || !seededCodes.has(normaliseCode(row.code)));
}

/** Codes differ only by spacing and case between the file and the register. */
export function normaliseCode(code: string) {
  return code.replace(/\s+/g, "").toUpperCase();
}

/**
 * The category as it should read on screen.
 *
 * The original eleven were filed under the English "Aggregate" while every
 * document and folder says "Agregate". Left alone they would sit in a group of
 * their own, a foot away from the other aggregate procedures.
 */
const CATEGORY_ALIASES: Record<string, string> = { Aggregate: "Agregate" };

export function displayCategory(category: string) {
  return CATEGORY_ALIASES[category] ?? category;
}

export type ProcedureGroup = { category: string; procedures: ProcedureDocument[] };

/** Grouped for the register page, sampling procedures last. */
export function groupProcedures(procedures: ProcedureDocument[]): ProcedureGroup[] {
  const groups = new Map<string, ProcedureDocument[]>();
  for (const procedure of procedures) {
    const key = displayCategory(procedure.category);
    const list = groups.get(key);
    if (list) list.push(procedure);
    else groups.set(key, [procedure]);
  }
  return [...groups.entries()]
    .map(([category, list]) => ({
      category,
      procedures: [...list].sort((a, b) => a.code.localeCompare(b.code, "sq"))
    }))
    .sort((a, b) => {
      const sampling = (value: string) => (value.startsWith("Marrja e mostrave") ? 1 : 0);
      return sampling(a.category) - sampling(b.category) || a.category.localeCompare(b.category, "sq");
    });
}

/** The revision in force, when the app knows of one. */
export function currentRevisionOf(procedure: ProcedureDocument, revisions: ProcedureRevision[]) {
  if (!procedure.currentRevisionId) return undefined;
  return revisions.find((revision) => revision.id === procedure.currentRevisionId);
}
