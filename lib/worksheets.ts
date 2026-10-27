import type { LabState, LabUser } from "./types";

/**
 * Every worksheet collection in the state.
 *
 * One list, because two things need it and they must not drift apart: the
 * performance page counts work per technician, and a rejection has to reach
 * the person who did the work.
 */
export const WORKSHEET_COLLECTIONS = [
  "concreteTests", "concreteWaterPenetrationTests", "concreteFlexuralTests", "concreteDensityTests",
  "concreteIndirectTensileTests", "concreteCoreTests", "asphaltTests", "asphaltJobMixTests", "thermalInsulationTests",
  "cementConsistencyTests", "cementStrengthTests", "cementBlaineTests", "admixtureTests",
  "masonryUnitTests", "pavingElementTests", "waterAnalysisTests", "sclerometerTests", "mortarTests",
  "steelTests", "aggregateTests", "aggregateChemicalTests", "aggregateLosAngelesTests",
  "aggregateFreezeThawTests", "aggregateAcvTests", "aggregateDensityAbsorptionTests",
  "aggregateFillerDensityTests", "aggregateShapeIndexTests", "aggregateFlakinessIndexTests",
  "aggregateElongationIndexTests", "aggregateBulkDensityTests", "aggregateSandEquivalentTests",
  "aggregateSoundnessTests"
] as const;

type WorksheetRow = { testId?: string; technicianName?: string; checkedBy?: string };

/** The name on a test's worksheet, or undefined when none has been saved. */
export function worksheetTechnicianName(state: LabState, testId: string): string | undefined {
  for (const collection of WORKSHEET_COLLECTIONS) {
    const rows = (state as unknown as Record<string, WorksheetRow[]>)[collection];
    if (!Array.isArray(rows)) continue;
    const row = rows.find((item) => item?.testId === testId);
    const name = row?.technicianName?.trim();
    if (name) return name;
  }
  return undefined;
}

/**
 * Who actually performed a test, as a user id.
 *
 * Not `test.assignedTechnician`: that is who the work was booked to, and in
 * this register almost everything is booked to one person, so a rejection sent
 * there reaches the wrong desk. The worksheet carries the name the technician
 * chose from the employee list when they signed it — the same `fullName` the
 * select stores — so matching it back to a user gives the person who has to
 * redo the work.
 *
 * Returns undefined when no worksheet has been saved yet, or when the name on
 * it no longer matches any employee (somebody renamed, or the name was typed
 * before the select existed). The caller then falls back to whoever it already
 * notified, so nobody loses a notification because of a rename.
 */
export function worksheetPerformerId(state: LabState, testId: string, users: LabUser[]): string | undefined {
  const name = worksheetTechnicianName(state, testId);
  if (!name) return undefined;
  const target = name.toLocaleLowerCase("sq-AL");
  return users.find((user) => user.fullName.trim().toLocaleLowerCase("sq-AL") === target)?.id;
}
