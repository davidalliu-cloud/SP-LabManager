import {
  averageMeasured,
  calculateCompressionDeformationPercent,
  calculateCompressionStressKpa,
  calculateThermalAbsorptionKgM2,
  calculateThermalApparentDensityKgM3,
  calculateThermalVolumeM3
} from "./calculations";
import type {
  ThermalInsulationAverages,
  ThermalInsulationSpecimen,
  ThermalInsulationSubSpecimen,
  ThermalInsulationTest
} from "./types";

/**
 * Thermal insulation is measured on two different things, and the certificate
 * has to say which.
 *
 * Dimensions and apparent density describe a board that was delivered: three
 * boards arrive, three rows. Short-term water absorption (EN ISO 29767) and
 * compression behaviour (EN 826) each want five determinations, and five is
 * what the laboratory cuts whatever arrived — one board can yield all five.
 * They are therefore not properties of the delivered boards and cannot share
 * their columns; they belong to sub-specimens, each of which records the board
 * it came from.
 */

/** How many sub-specimens the two five-fold determinations are run on. */
export const THERMAL_SUB_SPECIMEN_COUNT = 5;

/**
 * The six averages the certificate prints, worked out from the readings.
 *
 * Derived on every read rather than taken from the `averages` the record was
 * saved with. A stored average is only as right as the rules in force the day
 * somebody pressed save: the certificates written while blank sample columns
 * counted as zeros hold 600 mm for three boards of 1000, and went on printing
 * it after the rule was fixed, because the report was reading the number
 * rather than the measurements. The measurements are what the laboratory
 * recorded; the mean of them is arithmetic, and arithmetic is cheap.
 *
 * The first four are taken over the boards delivered and the last two over
 * the sub-specimens the five-fold determinations were run on - a different
 * count of a different set of things - and in both cases only over the cells
 * that hold a reading. Each is held to the width its row prints at on
 * SL-RA-PT-7.8/1.
 */
export function thermalAverages(
  test: Pick<ThermalInsulationTest, "specimens" | "subSpecimens">
): ThermalInsulationAverages {
  const boards = thermalBoards(test);
  const subSpecimens = thermalSubSpecimens(test);
  return {
    lengthMm: averageMeasured(boards.map((row) => row.lengthMm), 1),
    widthMm: averageMeasured(boards.map((row) => row.widthMm), 1),
    thicknessMm: averageMeasured(boards.map((row) => row.thicknessMm), 1),
    apparentDensityKgM3: averageMeasured(boards.map((row) => row.apparentDensityKgM3), 2),
    waterAbsorptionKgM2: averageMeasured(subSpecimens.map((row) => row.waterAbsorptionKgM2), 3),
    compressiveStressKpa: averageMeasured(
      subSpecimens.map((row) => row.compressiveStressAtTenPercentKpa || row.compressiveStressKpa),
      1
    )
  };
}

/**
 * The boards delivered, with what follows from their readings worked out
 * afresh.
 *
 * Same reasoning as the averages: a density stored in 2024 was rounded by
 * whatever rule applied then, and the certificates written before apparent
 * density went to two places hold 20.6 where the measurement says 20.57. The
 * mass and the three sides are the readings; the density is arithmetic over
 * them, so it is done when it is needed. A row that kept a density but lost
 * the readings behind it keeps the density.
 */
export function thermalBoards(
  test: Pick<ThermalInsulationTest, "specimens">
): ThermalInsulationSpecimen[] {
  return test.specimens.map((row) => {
    if (!row.massKg || !row.lengthMm || !row.widthMm || !row.thicknessMm) return row;
    const volumeM3 = calculateThermalVolumeM3(row.lengthMm, row.widthMm, row.thicknessMm);
    return { ...row, volumeM3, apparentDensityKgM3: calculateThermalApparentDensityKgM3(row.massKg, volumeM3) };
  });
}

/**
 * The sub-specimens absorption and compression were measured on.
 *
 * Written straight onto the test since the split. Three certificates predate
 * it and carried one set of sub-specimen figures on each sample row; those are
 * read back as the sub-specimens they effectively were, cut from the board the
 * figures sat on. Nothing is migrated — the record is read as what it is.
 */
export function thermalSubSpecimens(
  test: Pick<ThermalInsulationTest, "specimens" | "subSpecimens">
): ThermalInsulationSubSpecimen[] {
  const rows = test.subSpecimens?.length ? test.subSpecimens : legacySubSpecimens(test.specimens);
  return rows.map(recomputed);
}

/** A row of the sample table that a board was actually delivered against. */
function isDeliveredBoard(specimen: ThermalInsulationSpecimen) {
  return Boolean(specimen.lengthMm || specimen.widthMm || specimen.thicknessMm || specimen.massKg);
}

/**
 * The sub-specimens of a certificate written before they were recorded as
 * such, and the board each is shown against.
 *
 * The old sheet had one row per sample carrying both, so the obvious reading
 * is that the fourth set of absorption figures belongs to the fourth sample.
 * It does not: five determinations were run whatever arrived, and where three
 * boards arrived the fourth and fifth rows carried absorption against a board
 * that was never delivered. The certificate said so in as many words —
 * "Nga mostra 4" under a column with no board in it.
 *
 * Which board each was actually cut from was not recorded by that sheet and
 * cannot be recovered. They are therefore dealt out evenly over the boards
 * that did arrive: an arbitrary assignment, but one over real material, and
 * the same every time the certificate is printed rather than a number that
 * changes between a reading on screen and the PDF beside it. Worksheets filled
 * in since record the real answer, because the technician chooses it.
 */
function legacySubSpecimens(specimens: ThermalInsulationSpecimen[]): ThermalInsulationSubSpecimen[] {
  const delivered = specimens.filter(isDeliveredBoard);
  return specimens
    .filter(hasLegacySubSpecimenData)
    .map(fromLegacySpecimen)
    .map((row, index) => ({
      ...row,
      fromSpecimenCode: delivered.length ? delivered[index % delivered.length].specimenCode : ""
    }));
}

/** As thermalBoards, for the figures a sub-specimen's readings imply. */
function recomputed(row: ThermalInsulationSubSpecimen): ThermalInsulationSubSpecimen {
  const absorbed = row.massAfterImmersionKg && row.absorptionLengthMm && row.absorptionWidthMm;
  const pressed = row.compressionLengthMm && row.compressionWidthMm;
  return {
    ...row,
    waterAbsorptionKgM2: absorbed
      ? calculateThermalAbsorptionKgM2(row.massBeforeImmersionKg, row.massAfterImmersionKg, row.absorptionLengthMm, row.absorptionWidthMm)
      : row.waterAbsorptionKgM2,
    deformationPercent: row.initialThicknessMm
      ? calculateCompressionDeformationPercent(row.displacementMm, row.initialThicknessMm)
      : row.deformationPercent,
    compressiveStressKpa: pressed
      ? calculateCompressionStressKpa(row.maximumForceN, row.compressionLengthMm, row.compressionWidthMm)
      : row.compressiveStressKpa,
    compressiveStressAtTenPercentKpa: pressed
      ? calculateCompressionStressKpa(row.forceAtTenPercentN, row.compressionLengthMm, row.compressionWidthMm)
      : row.compressiveStressAtTenPercentKpa
  };
}

function hasLegacySubSpecimenData(specimen: ThermalInsulationSpecimen) {
  return Boolean(
    specimen.waterAbsorptionKgM2 ||
      specimen.compressiveStressKpa ||
      specimen.compressiveStressAtTenPercentKpa ||
      specimen.maximumForceN ||
      specimen.massAfterImmersionKg
  );
}

function fromLegacySpecimen(specimen: ThermalInsulationSpecimen): ThermalInsulationSubSpecimen {
  return {
    subSpecimenCode: specimen.specimenCode,
    fromSpecimenCode: specimen.specimenCode,
    absorptionLengthMm: specimen.absorptionLengthMm ?? 0,
    absorptionWidthMm: specimen.absorptionWidthMm ?? 0,
    massBeforeImmersionKg: specimen.massBeforeImmersionKg ?? 0,
    massAfterImmersionKg: specimen.massAfterImmersionKg ?? 0,
    waterAbsorptionKgM2: specimen.waterAbsorptionKgM2 ?? 0,
    compressionLengthMm: specimen.compressionLengthMm ?? 0,
    compressionWidthMm: specimen.compressionWidthMm ?? 0,
    initialThicknessMm: specimen.initialThicknessMm ?? 0,
    displacementMm: specimen.displacementMm ?? 0,
    deformationPercent: specimen.deformationPercent ?? 0,
    maximumForceN: specimen.maximumForceN ?? 0,
    forceAtTenPercentN: specimen.forceAtTenPercentN ?? 0,
    compressiveStressKpa: specimen.compressiveStressKpa ?? 0,
    compressiveStressAtTenPercentKpa: specimen.compressiveStressAtTenPercentKpa ?? 0
  };
}

/**
 * How the certificate names the board a sub-specimen was cut from.
 *
 * The board's position in the delivery — "Mostra 2" — rather than its code,
 * because the column headings above it are numbered the same way and the two
 * have to line up at a glance. Counted over the whole sample table, so the
 * number names the column the board is printed in.
 *
 * A link pointing at a row no board was delivered against is not shown: the
 * certificate would otherwise cite a sample that is blank three lines above
 * it. A link to something outside the table altogether falls back to whatever
 * was recorded, so it is visible rather than swallowed.
 */
export function thermalSampleLabel(fromSpecimenCode: string, specimens: ThermalInsulationSpecimen[]) {
  if (!fromSpecimenCode) return "";
  const index = specimens.findIndex((specimen) => specimen.specimenCode === fromSpecimenCode);
  if (index < 0) return fromSpecimenCode;
  return isDeliveredBoard(specimens[index]) ? String(index + 1) : "";
}
