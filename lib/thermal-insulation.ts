import type { ThermalInsulationSpecimen, ThermalInsulationSubSpecimen, ThermalInsulationTest } from "./types";

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
  if (test.subSpecimens?.length) return test.subSpecimens;
  return test.specimens.filter(hasLegacySubSpecimenData).map(fromLegacySpecimen);
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
 * have to line up at a glance. A sub-specimen whose board is not among the
 * delivered rows falls back to whatever was recorded, so a link that points
 * somewhere unexpected is shown rather than swallowed.
 */
export function thermalSampleLabel(
  fromSpecimenCode: string,
  specimens: Array<{ specimenCode: string }>
) {
  if (!fromSpecimenCode) return "";
  const index = specimens.findIndex((specimen) => specimen.specimenCode === fromSpecimenCode);
  return index >= 0 ? String(index + 1) : fromSpecimenCode;
}
