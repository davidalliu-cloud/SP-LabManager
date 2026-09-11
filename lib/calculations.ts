export function calculateArea(lengthMm: number, widthMm: number) {
  return round(lengthMm * widthMm, 2);
}

export function calculateCompressiveStrength(maximumLoadKn: number, areaMm2: number) {
  if (!areaMm2) return 0;
  return round((maximumLoadKn * 1000) / areaMm2, 2);
}

export function calculateConcreteCoreResults(input: { diameterMm: number; heightMm: number; weightKg: number; loadKn: number }) {
  const diameterCm = round(input.diameterMm / 10, 2);
  const heightCm = round(input.heightMm / 10, 2);
  const contactAreaCm2 = diameterCm ? round((Math.PI * diameterCm ** 2) / 4, 2) : 0;
  const heightDiameterRatio = diameterCm ? round(heightCm / diameterCm, 2) : 0;
  const volumeM3 = input.diameterMm && input.heightMm ? (Math.PI * input.diameterMm ** 2 / 4) * input.heightMm / 1_000_000_000 : 0;
  const densityKgM3 = volumeM3 ? round(input.weightKg / volumeM3, 0) : 0;
  const cylindricalStrengthMpa = contactAreaCm2 ? round(input.loadKn / contactAreaCm2 * 10, 2) : 0;
  const conversionFactor = cylindricalStrengthMpa < 25 ? 0.8 : 0.83;
  const ratioType: "1:1" | "1:2" = Math.abs(heightDiameterRatio - 2) < Math.abs(heightDiameterRatio - 1) ? "1:2" : "1:1";
  const cubicStrengthMpa = ratioType === "1:2" ? round(cylindricalStrengthMpa / conversionFactor, 2) : round(cylindricalStrengthMpa * conversionFactor, 2);
  return {
    diameterCm,
    heightCm,
    heightDiameterRatio,
    contactAreaCm2,
    densityKgM3,
    cylindricalStrengthMpa,
    conversionFactor,
    cubicStrengthMpa,
    ratioType
  };
}

export function calculateAgeDays(castingDate: string, testDate: string) {
  const cast = new Date(castingDate);
  const test = new Date(testDate);
  if (Number.isNaN(cast.getTime()) || Number.isNaN(test.getTime())) return 0;
  return Math.max(0, Math.round((test.getTime() - cast.getTime()) / 86_400_000));
}

export function calculateCircularArea(diameterMm: number) {
  if (!diameterMm) return 0;
  return round((Math.PI * diameterMm ** 2) / 4, 2);
}

export function calculateSteelStrength(loadKn: number, areaMm2: number) {
  if (!areaMm2) return 0;
  return round((loadKn * 1000) / areaMm2, 2);
}

export function calculateElongation(initialLengthMm: number, finalLengthMm: number) {
  if (!initialLengthMm) return 0;
  return round(((finalLengthMm - initialLengthMm) / initialLengthMm) * 100, 2);
}

export function calculateUnitWeightKgPerM(weightG: number, totalLengthMm: number) {
  if (!totalLengthMm) return 0;
  return round(weightG / totalLengthMm, 3);
}

export function calculateReductionOfArea(originalAreaMm2: number, finalAreaMm2: number) {
  if (!originalAreaMm2) return 0;
  return round(((originalAreaMm2 - finalAreaMm2) / originalAreaMm2) * 100, 2);
}

export function calculateAggregateGradation(rows: Array<{ sieveSizeMm: number; retainedMassG: number }>, sampleMassG: number) {
  let cumulativeRetainedMassG = 0;
  return rows.map((row) => {
    cumulativeRetainedMassG += row.retainedMassG || 0;
    const cumulativeRetainedPercent = sampleMassG ? round((cumulativeRetainedMassG / sampleMassG) * 100, 2) : 0;
    return {
      ...row,
      cumulativeRetainedMassG: round(cumulativeRetainedMassG, 2),
      cumulativeRetainedPercent,
      cumulativePassingPercent: round(Math.max(0, 100 - cumulativeRetainedPercent), 2)
    };
  });
}

export function calculateAsphaltBitumen(input: {
  basketFilterMassG: number;
  beforeExtractionMassG: number;
  afterExtractionMassG: number;
  fillerMassG: number;
}) {
  const conglomerateMassG = round(input.beforeExtractionMassG - input.basketFilterMassG, 1);
  const aggregateMassG = round(input.afterExtractionMassG - input.basketFilterMassG + input.fillerMassG, 1);
  const bitumenMassG = round(conglomerateMassG - aggregateMassG, 1);
  return {
    ...input,
    conglomerateMassG,
    aggregateMassG,
    bitumenMassG,
    bitumenContentPercent: conglomerateMassG ? round((bitumenMassG / conglomerateMassG) * 100, 2) : 0,
    bitumenOnAggregatePercent: aggregateMassG ? round((bitumenMassG / aggregateMassG) * 100, 2) : 0
  };
}

export function calculateAsphaltMarshallDensity(input: {
  airMassG: number;
  waterMassG: number;
  ssdMassG: number;
  waterTemperatureC: number;
}) {
  const waterDensityGcm3 = round(1.00025205 + (7.59 * input.waterTemperatureC - 5.32 * input.waterTemperatureC ** 2) / 1_000_000, 5);
  const bulkDensityGcm3 = input.ssdMassG - input.waterMassG ? round((input.airMassG / (input.ssdMassG - input.waterMassG)) * waterDensityGcm3, 3) : 0;
  return { waterDensityGcm3, bulkDensityGcm3 };
}

export function calculateAsphaltMaximumDensity(input: {
  conglomerateMassG: number;
  pycnometerMassG: number;
  pycnometerWaterMassG: number;
  pycnometerSampleWaterMassG: number;
}) {
  const denominator = input.pycnometerWaterMassG + input.conglomerateMassG - input.pycnometerSampleWaterMassG;
  return denominator ? round(input.conglomerateMassG / denominator, 3) : 0;
}

export function calculateAsphaltAirVoids(maximumDensityGcm3: number, bulkDensityGcm3: number) {
  if (!maximumDensityGcm3) return 0;
  return round(((maximumDensityGcm3 - bulkDensityGcm3) / maximumDensityGcm3) * 100, 1);
}

export function calculateMarshallCorrectionCoefficient(heightMm: number) {
  const volumeMm3 = Math.PI * 50.8 ** 2 * heightMm;
  return round(5.2 * Math.exp(-3.2e-6 * volumeMm3), 3);
}

export function calculateAsphaltCompaction(input: {
  specimenAirMassG: number;
  specimenParaffinAirMassG: number;
  specimenParaffinWaterMassG: number;
  paraffinSpecificGravity: number;
  maximumDensityGcm3: number;
}) {
  const paraffinMassG = input.specimenParaffinAirMassG - input.specimenAirMassG;
  const apparentDisplacedVolume = input.specimenParaffinAirMassG - input.specimenParaffinWaterMassG;
  const paraffinVolume = input.paraffinSpecificGravity ? paraffinMassG / input.paraffinSpecificGravity : 0;
  const specimenVolume = apparentDisplacedVolume - paraffinVolume;
  const bulkSpecificGravityGcm3 = specimenVolume ? round(input.specimenAirMassG / specimenVolume, 3) : 0;
  return {
    bulkSpecificGravityGcm3,
    compactionPercent: input.maximumDensityGcm3 ? round((bulkSpecificGravityGcm3 / input.maximumDensityGcm3) * 100, 1) : 0
  };
}

export function calculateLosAngelesResults(rows: Array<{ fractionMassG: number }>, retainedOnOnePointSixMmG: number) {
  const totalMassG = round(rows.reduce((sum, row) => sum + (row.fractionMassG || 0), 0), 1);
  const passingOnePointSixMmG = round(Math.max(0, totalMassG - retainedOnOnePointSixMmG), 1);
  const fragmentationLossPercent = totalMassG ? round((passingOnePointSixMmG / totalMassG) * 100, 1) : 0;
  return { totalMassG, passingOnePointSixMmG, fragmentationLossPercent };
}

export function calculateFreezeThawMassLoss(initialDryMassG: number, finalDryMassG: number) {
  if (!initialDryMassG) return 0;
  return round(((initialDryMassG - finalDryMassG) / initialDryMassG) * 100, 2);
}

export function calculateAcvPercent(totalDrySampleMassG: number, passingTwoPointThirtySixMmMassG: number) {
  if (!totalDrySampleMassG) return 0;
  return round((passingTwoPointThirtySixMmMassG / totalDrySampleMassG) * 100, 2);
}

export function calculateDensityAbsorption(input: {
  ovenDryMassG: number;
  ssdMassG: number;
  pycnometerWaterMassG: number;
  pycnometerWaterSampleMassG: number;
}) {
  const volumeSsd = input.pycnometerWaterMassG + input.ssdMassG - input.pycnometerWaterSampleMassG;
  const volumeOvenDry = input.pycnometerWaterMassG + input.ovenDryMassG - input.pycnometerWaterSampleMassG;
  return {
    absorptionPercent: input.ovenDryMassG ? round(((input.ssdMassG - input.ovenDryMassG) / input.ovenDryMassG) * 100, 2) : 0,
    ovenDryBulkDensity: volumeSsd ? round(input.ovenDryMassG / volumeSsd, 3) : 0,
    ssdBulkDensity: volumeSsd ? round(input.ssdMassG / volumeSsd, 3) : 0,
    apparentDensity: volumeOvenDry ? round(input.ovenDryMassG / volumeOvenDry, 3) : 0
  };
}

export function calculateFillerParticleDensity(input: {
  liquidDensity: number;
  emptyPycnometerMassG: number;
  pycnometerSampleMassG: number;
  pycnometerSampleLiquidMassG: number;
  pycnometerVolumeMl: number;
}) {
  if (!input.liquidDensity) return 0;
  const fillerMass = input.pycnometerSampleMassG - input.emptyPycnometerMassG;
  const displacedVolume = input.pycnometerVolumeMl - (input.pycnometerSampleLiquidMassG - input.pycnometerSampleMassG) / input.liquidDensity;
  return displacedVolume ? round(fillerMass / displacedVolume, 3) : 0;
}

export function calculateShapeIndex(testPortionMassG: number, nonCubicalMassG: number) {
  if (!testPortionMassG) return 0;
  return round((nonCubicalMassG / testPortionMassG) * 100, 1);
}

export function calculateFlakinessPercent(retainedMassG: number, passingBarSieveMassG: number) {
  if (!retainedMassG) return 0;
  return round((passingBarSieveMassG / retainedMassG) * 100, 1);
}

export function calculateBulkDensity(containerSampleMassKg: number, emptyContainerMassKg: number, containerCapacityM3: number) {
  if (!containerCapacityM3) return 0;
  return round(((containerSampleMassKg - emptyContainerMassKg) / containerCapacityM3) / 1000, 3);
}

export function calculateVoidsPercent(specificDensityMgM3: number, bulkDensityMgM3: number) {
  if (!specificDensityMgM3) return 0;
  return round(((specificDensityMgM3 - bulkDensityMgM3) / specificDensityMgM3) * 100, 1);
}

export function calculateMoisturePercent(emptyDishMassG: number, dishWetSampleMassG: number, dishDrySampleMassG: number) {
  const drySampleMass = dishDrySampleMassG - emptyDishMassG;
  if (!drySampleMass) return 0;
  return round(((dishWetSampleMassG - dishDrySampleMassG) / drySampleMass) * 100, 1);
}

export function calculateFinesPercent(sampleMassG: number, retained0063MassG: number) {
  if (!sampleMassG) return 0;
  return round(((sampleMassG - retained0063MassG) / sampleMassG) * 100, 1);
}

export function calculateSandEquivalent(clayReadingMm: number, sandReadingMm: number) {
  if (!clayReadingMm) return 0;
  return round((sandReadingMm / clayReadingMm) * 100, 0);
}

export function calculateSoundnessLossPercent(initialMassG: number, finalRetainedMassG: number) {
  if (!initialMassG) return 0;
  return round(((initialMassG - finalRetainedMassG) / initialMassG) * 100, 2);
}

export function calculateFlexuralStrengthMpa(maximumLoadKn: number, spanMm: number, widthMm: number, thicknessMm: number) {
  if (!spanMm || !widthMm || !thicknessMm) return 0;
  return round((maximumLoadKn * 1000 * spanMm) / (widthMm * thicknessMm ** 2), 2);
}

export function calculateSpecimenVolumeM3(lengthMm: number, widthMm: number, thicknessMm: number) {
  return round((lengthMm * widthMm * thicknessMm) / 1_000_000_000, 6);
}

export function calculateApparentDensityKgM3(weightKg: number, volumeM3: number) {
  if (!volumeM3) return 0;
  return round(weightKg / volumeM3, 0);
}

export function calculateConcreteDensityKgM3(massKg: number, volumeM3: number) {
  if (!volumeM3) return 0;
  return round(massKg / volumeM3, 0);
}

export function calculateIrregularVolumeM3(airMassKg: number, waterMassKg: number, waterDensityKgM3: number) {
  if (!waterDensityKgM3) return 0;
  return round((airMassKg - waterMassKg) / waterDensityKgM3, 6);
}

export function calculateIndirectTensileStrengthMpa(maximumLoadN: number, contactLengthMm: number, crossSectionMm: number) {
  if (!contactLengthMm || !crossSectionMm) return 0;
  return round((2 * maximumLoadN) / (Math.PI * contactLengthMm * crossSectionMm), 2);
}

export function calculateThermalVolumeM3(lengthMm: number, widthMm: number, thicknessMm: number) {
  return round((lengthMm * widthMm * thicknessMm) / 1_000_000_000, 6);
}

export function calculateThermalApparentDensityKgM3(massKg: number, volumeM3: number) {
  if (!volumeM3) return 0;
  return round(massKg / volumeM3, 1);
}

export function calculateThermalAbsorptionKgM2(massBeforeKg: number, massAfterKg: number, lengthMm: number, widthMm: number) {
  const areaM2 = (lengthMm * widthMm) / 1_000_000;
  if (!areaM2) return 0;
  return round((massAfterKg - massBeforeKg) / areaM2, 2);
}

export function calculateCompressionStressKpa(forceN: number, lengthMm: number, widthMm: number) {
  const areaMm2 = lengthMm * widthMm;
  if (!areaMm2) return 0;
  return round((forceN / areaMm2) * 1000, 1);
}

export function calculateCompressionDeformationPercent(displacementMm: number, initialThicknessMm: number) {
  if (!initialThicknessMm) return 0;
  return round((displacementMm / initialThicknessMm) * 100, 1);
}

export function calculateWaterDemandPercent(waterMassG: number, cementMassG: number) {
  if (!cementMassG) return 0;
  return round((waterMassG / cementMassG) * 100, 1);
}

export function calculateMinutesBetweenTimes(startTime: string, endTime: string) {
  const parse = (value: string) => {
    const [hours = "0", minutes = "0", seconds = "0"] = value.split(":");
    return Number(hours) * 60 + Number(minutes) + Number(seconds) / 60;
  };
  if (!startTime || !endTime) return 0;
  const start = parse(startTime);
  const end = parse(endTime);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return round(end >= start ? end - start : end + 1440 - start, 0);
}

export function calculateExpansionMm(readingAtStartMm: number, readingAtAmbientMm: number) {
  return round(readingAtAmbientMm - readingAtStartMm, 1);
}

export function calculateCementStrengthMpa(loadKn: number, areaMm2: number) {
  if (!areaMm2) return 0;
  return round((loadKn / areaMm2) * 1000, 2);
}

export function calculateBlaineDensity(sampleMassG: number, displacedWaterMassG: number, waterDensityGcm3: number) {
  if (!displacedWaterMassG) return 0;
  return round((sampleMassG / displacedWaterMassG) * waterDensityGcm3, 3);
}

export function calculateBlaineBedVolumeCm3(internalCellHeightMm: number, plungerLengthMm: number, cellRadiusMm: number) {
  const bedHeightMm = internalCellHeightMm - plungerLengthMm;
  if (!bedHeightMm || !cellRadiusMm) return 0;
  return round((bedHeightMm * cellRadiusMm ** 2 * Math.PI) / 1000, 3);
}

export function calculateBlaineSampleMassG(porosity: number, densityGcm3: number, bedVolumeCm3: number) {
  return round(porosity * densityGcm3 * bedVolumeCm3, 3);
}

export function calculateBlaineBsEnConstant(referenceSurfaceCm2G: number, referenceDensityGcm3: number, porosity: number, referenceTimeS: number, airViscosity: number) {
  if (!porosity || !referenceTimeS) return 0;
  return round((referenceSurfaceCm2G * referenceDensityGcm3 * (1 - porosity) * Math.sqrt(10 * airViscosity)) / (Math.sqrt(porosity ** 3) * Math.sqrt(referenceTimeS)), 3);
}

export function calculateBlaineBsEnSurface(constantK: number, densityGcm3: number, porosity: number, measuredTimeS: number, airViscosity: number) {
  if (!densityGcm3 || !porosity || porosity === 1 || !airViscosity) return 0;
  return round((constantK / densityGcm3) * (Math.sqrt(porosity ** 3) / (1 - porosity)) * (Math.sqrt(measuredTimeS) / Math.sqrt(10 * airViscosity)), 0);
}

export function calculateBlaineAstmBedVolumeCm3(fullMercuryMassG: number, emptyMercuryMassG: number, mercuryDensityGcm3: number) {
  if (!mercuryDensityGcm3) return 0;
  return round((fullMercuryMassG - emptyMercuryMassG) / mercuryDensityGcm3, 3);
}

export function calculateBlaineAstmConstant(referenceSurfaceCm2G: number, referenceTimeS: number) {
  if (!referenceTimeS) return 0;
  return round(referenceSurfaceCm2G / Math.sqrt(referenceTimeS), 3);
}

export function calculateBlaineAstmSurface(constantK: number, measuredTimeS: number) {
  if (!measuredTimeS) return 0;
  return round(constantK * Math.sqrt(measuredTimeS), 0);
}

export function calculateChloridePercent(silverNitrateVolumeMl: number, waterAggregateRatio: number) {
  return round(0.01 * 0.03545 * silverNitrateVolumeMl * waterAggregateRatio * 4, 3);
}

export function calculateWaterSolubleSulfateSo3Percent(waterAggregateRatio: number, calcinedMaterialMassG: number) {
  return round(2 * waterAggregateRatio * 0.343 * calcinedMaterialMassG, 3);
}

export function calculateAcidSolubleSulfateSo3Percent(sampleMassG: number, calcinedMaterialMassG: number) {
  if (!sampleMassG) return 0;
  return round((calcinedMaterialMassG / sampleMassG) * 34.3, 3);
}

export function calculateSulfateSo4FromSo3(so3Percent: number) {
  return round(so3Percent * 1.2, 3);
}

export function calculateMortarFlexuralStrengthMpa(loadKn: number, spanMm: number, widthMm: number, heightMm: number) {
  if (!spanMm || !widthMm || !heightMm) return 0;
  return round((1.5 * loadKn * 1000 * spanMm) / (widthMm * heightMm ** 2), 2);
}

export function calculateMortarFreshDensityKgM3(emptyContainerMassG: number, filledContainerMassG: number, containerVolumeL: number) {
  if (!containerVolumeL) return 0;
  return round((filledContainerMassG - emptyContainerMassG) / containerVolumeL, 0);
}

export function calculateMortarDryDensityKgM3(dryMassG: number, lengthMm: number, widthMm: number, heightMm: number) {
  const volumeM3 = (lengthMm * widthMm * heightMm) / 1_000_000_000;
  if (!volumeM3) return 0;
  return round((dryMassG / 1000) / volumeM3, 0);
}

export function calculateMortarAdhesionStrengthMpa(forceN: number, areaMm2: number) {
  if (!areaMm2) return 0;
  return round(forceN / areaMm2, 2);
}

export function averageNumbers(values: number[], decimals = 3) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) return 0;
  return round(valid.reduce((sum, value) => sum + value, 0) / valid.length, decimals);
}

export function averageDays(rows: Array<{ start?: string; end?: string }>) {
  const durations = rows
    .map((row) => {
      if (!row.start || !row.end) return undefined;
      const start = new Date(row.start).getTime();
      const end = new Date(row.end).getTime();
      if (Number.isNaN(start) || Number.isNaN(end)) return undefined;
      return Math.max(0, (end - start) / 86_400_000);
    })
    .filter((value): value is number => typeof value === "number");
  if (!durations.length) return 0;
  return round(durations.reduce((sum, value) => sum + value, 0) / durations.length, 1);
}

export function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * BS EN 480-8 — conventional dry material content of a concrete admixture.
 *
 * The technician types three weighings per determination; everything else is
 * derived here rather than in the form, so the arithmetic is in one place and
 * can be checked.
 *
 * A determination only counts toward the mean when it has a real sample mass
 * and a dried mass. A blank weighing reads as `undefined`, not zero — a cube
 * test once reported 7.92 MPa instead of 31.69 because empty inputs became
 * genuine zeros and were averaged in.
 */
export function deriveAdmixtureDetermination(input: {
  dishMassG?: number;
  dishPlusSampleMassG?: number;
  dishPlusDriedMassG?: number;
}) {
  const { dishMassG, dishPlusSampleMassG, dishPlusDriedMassG } = input;
  const hasDish = typeof dishMassG === "number" && Number.isFinite(dishMassG);

  const sampleMassG =
    hasDish && typeof dishPlusSampleMassG === "number" && Number.isFinite(dishPlusSampleMassG)
      ? round(dishPlusSampleMassG - dishMassG, 4)
      : undefined;

  const driedMassG =
    hasDish && typeof dishPlusDriedMassG === "number" && Number.isFinite(dishPlusDriedMassG)
      ? round(dishPlusDriedMassG - dishMassG, 4)
      : undefined;

  const dryMaterialPercent =
    typeof sampleMassG === "number" && sampleMassG > 0 && typeof driedMassG === "number" && driedMassG >= 0
      ? round((driedMassG / sampleMassG) * 100, 2)
      : undefined;

  return { sampleMassG, driedMassG, dryMaterialPercent };
}

/** Mean of the determinations that were actually completed. Returns undefined
 *  rather than 0 when none were, so a partial test cannot report a number. */
export function averageAdmixtureDryMaterial(values: Array<number | undefined>) {
  const usable = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);
  if (!usable.length) return undefined;
  return round(usable.reduce((sum, value) => sum + value, 0) / usable.length, 2);
}

/**
 * BS EN 480-8 asks for the determinations to agree. Flags a spread the
 * technician should look at before the result is reported, rather than
 * silently averaging two numbers that disagree.
 */
export function admixtureDeterminationsDisagree(values: Array<number | undefined>, allowedSpreadPercent = 1) {
  const usable = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);
  if (usable.length < 2) return false;
  return Math.max(...usable) - Math.min(...usable) > allowedSpreadPercent;
}

// --- Masonry units, BS EN 772-1 / -13 / -16 / -21 -------------------------

const finiteNumber = (value?: number): value is number => typeof value === "number" && Number.isFinite(value);

/**
 * Mean of the specimens that carry a value for this column.
 *
 * Zeros are kept, because zero is a legitimate reading for a masonry column
 * (an absorption of 0.0 %) whereas a missing reading is not. Returns undefined
 * when nothing was measured, so a half-finished test reports a blank rather
 * than a number.
 */
export function averageMasonryColumn(values: Array<number | undefined>, decimals = 2) {
  const usable = values.filter(finiteNumber);
  if (!usable.length) return undefined;
  return round(usable.reduce((sum, value) => sum + value, 0) / usable.length, decimals);
}

/**
 * Everything derivable from one masonry unit's measurements.
 *
 * Each result appears only when the readings it needs are present, so a unit
 * that was weighed but not crushed reports a density and no strength.
 */
export function deriveMasonryUnitSpecimen(
  input: {
    lengthMm?: number;
    widthMm?: number;
    heightMm?: number;
    shellWebLongitudinalMm?: number;
    shellWebTransverseMm?: number;
    meanHoleDepthMm?: number;
    sumLongitudinalMm?: number;
    sumTransverseMm?: number;
    dryMassG?: number;
    saturatedMassG?: number;
    voidVolumeMm3?: number;
    netVolumeMm3?: number;
    loadedAreaMm2?: number;
    maximumLoadKn?: number;
  },
  factors: { shapeFactorDelta?: number; conditioningFactor?: number } = {}
) {
  const {
    lengthMm,
    widthMm,
    heightMm,
    sumLongitudinalMm,
    sumTransverseMm,
    dryMassG,
    saturatedMassG,
    voidVolumeMm3,
    maximumLoadKn
  } = input;

  // BS EN 772-16 — gross (total) volume from the measured dimensions.
  const grossVolumeMm3 =
    finiteNumber(lengthMm) && finiteNumber(widthMm) && finiteNumber(heightMm) && lengthMm > 0 && widthMm > 0 && heightMm > 0
      ? round(lengthMm * widthMm * heightMm, 0)
      : undefined;

  // Net volume: use the directly-measured net volume when given, otherwise
  // derive it as gross volume minus the measured void volume (perforated units).
  const netVolumeMm3 =
    finiteNumber(input.netVolumeMm3) && input.netVolumeMm3 > 0
      ? input.netVolumeMm3
      : finiteNumber(grossVolumeMm3) && finiteNumber(voidVolumeMm3) && grossVolumeMm3 - voidVolumeMm3 > 0
        ? round(grossVolumeMm3 - voidVolumeMm3, 0)
        : undefined;

  // BS EN 772-13 — g / mm3 to kg/m3 is a factor of 1e6.
  const grossDryDensityKgM3 =
    finiteNumber(dryMassG) && finiteNumber(grossVolumeMm3) && grossVolumeMm3 > 0
      ? round((dryMassG * 1_000_000) / grossVolumeMm3, 0)
      : undefined;

  const netDryDensityKgM3 =
    finiteNumber(dryMassG) && finiteNumber(netVolumeMm3) && netVolumeMm3 > 0
      ? round((dryMassG * 1_000_000) / netVolumeMm3, 0)
      : undefined;

  // BS EN 772-13 — moisture / water content against the dry mass.
  const waterAbsorptionPercent =
    finiteNumber(dryMassG) && dryMassG > 0 && finiteNumber(saturatedMassG)
      ? round(((saturatedMassG - dryMassG) / dryMassG) * 100, 2)
      : undefined;

  // BS EN 772-16 — combined thickness of webs+shells as a % of the overall
  // dimension: longitudinal against the length, transverse against the width.
  const combinedThicknessLongitudinalPercent =
    finiteNumber(sumLongitudinalMm) && finiteNumber(lengthMm) && lengthMm > 0
      ? round((sumLongitudinalMm / lengthMm) * 100, 2)
      : undefined;
  const combinedThicknessTransversePercent =
    finiteNumber(sumTransverseMm) && finiteNumber(widthMm) && widthMm > 0
      ? round((sumTransverseMm / widthMm) * 100, 2)
      : undefined;

  // BS EN 772-1 — strength is failure load over the measured loaded (bearing)
  // area. The area is measured; fall back to length x width only if it was not
  // entered.
  const loadedAreaMm2 =
    finiteNumber(input.loadedAreaMm2) && input.loadedAreaMm2 > 0
      ? round(input.loadedAreaMm2, 0)
      : finiteNumber(lengthMm) && finiteNumber(widthMm) && lengthMm > 0 && widthMm > 0
        ? round(lengthMm * widthMm, 0)
        : undefined;

  const compressiveStrengthMpa =
    finiteNumber(maximumLoadKn) && finiteNumber(loadedAreaMm2) && loadedAreaMm2 > 0
      ? round((maximumLoadKn * 1000) / loadedAreaMm2, 2)
      : undefined;

  // Normalised strength needs both factors from the standard. Absent either,
  // the strength stands unnormalised rather than being silently multiplied by 1.
  const { shapeFactorDelta, conditioningFactor } = factors;
  const normalisedStrengthMpa =
    finiteNumber(compressiveStrengthMpa) && finiteNumber(shapeFactorDelta) && finiteNumber(conditioningFactor)
      ? round(compressiveStrengthMpa * shapeFactorDelta * conditioningFactor, 2)
      : undefined;

  return {
    grossVolumeMm3,
    netVolumeMm3,
    grossDryDensityKgM3,
    netDryDensityKgM3,
    waterAbsorptionPercent,
    combinedThicknessLongitudinalPercent,
    combinedThicknessTransversePercent,
    loadedAreaMm2,
    compressiveStrengthMpa,
    normalisedStrengthMpa
  };
}

/**
 * Deviation of a measured mean dimension from the declared one, in mm.
 * BS EN 772-16 reports the unit against what the manufacturer declared.
 */
export function masonryDimensionDeviation(measured?: number, declared?: number) {
  if (!finiteNumber(measured) || !finiteNumber(declared)) return undefined;
  return round(measured - declared, 1);
}

// --- Water for concrete, BS EN 1008 / EN 196-2 / EN ISO 10523 / ISO 758 ----

/** Density of distilled water at 20 °C, g/ml — the worksheet's default. */
export const WATER_DENSITY_20C_G_ML = 0.9982;
/** Density of air, g/ml — the worksheet's default. */
export const AIR_DENSITY_G_ML = 0.0012;

/**
 * Mass percent to mg/l, taking one litre of water as 1000 g.
 * 0.1 % lands on BS EN 1008's 1000 mg/l chloride limit, which is the check
 * that this is the intended reading of the worksheet.
 */
export const PERCENT_TO_MG_PER_L = 10_000;

/**
 * The sulfate worksheet's gravimetric factor of 34.3 is SO3/BaSO4
 * (80.06 / 233.39), so it yields sulfur trioxide, not sulfate. The report
 * column, and BS EN 1008's 2000 mg/l limit, are both SO4-2, so the SO3 result
 * is converted by the mass ratio below. The worksheet still shows SO3; only
 * the reported figure is converted.
 */
const SO3_MOLAR_MASS = 80.06;
const SO4_MOLAR_MASS = 96.06;
export const SO4_PER_SO3 = SO4_MOLAR_MASS / SO3_MOLAR_MASS;

const finiteWater = (value?: number): value is number => typeof value === "number" && Number.isFinite(value);

/**
 * ISO 758 — density of the water, by weighing the sample against the same
 * volume of distilled water and correcting for the buoyancy of air.
 * A = air density x m2; density = (m1 + A) / (m2 + A) x water density.
 */
export function deriveWaterDensityRun(input: {
  sampleMassG?: number;
  distilledWaterMassG?: number;
  waterDensityGMl?: number;
  airDensityGMl?: number;
}) {
  const m1 = input.sampleMassG;
  const m2 = input.distilledWaterMassG;
  const rho = input.waterDensityGMl ?? WATER_DENSITY_20C_G_ML;
  const rhoAir = input.airDensityGMl ?? AIR_DENSITY_G_ML;

  const correctionFactorA = finiteWater(m2) && finiteWater(rhoAir) ? round(rhoAir * m2, 5) : undefined;

  const densityGMl =
    finiteWater(m1) && finiteWater(m2) && finiteWater(correctionFactorA) && finiteWater(rho) && m2 + correctionFactorA !== 0
      ? round(((m1 + correctionFactorA) / (m2 + correctionFactorA)) * rho, 4)
      : undefined;

  // The worksheet works in g/ml; the report column is kg/m3.
  const densityKgM3 = finiteWater(densityGMl) ? round(densityGMl * 1000, 1) : undefined;

  return { correctionFactorA, densityGMl, densityKgM3 };
}

/**
 * EN 196-2 — chlorides by silver nitrate titration against a blank.
 * The worksheet's formula, verbatim: 0.8865 x ((V0 - V1) / (V0 x m)).
 */
export function deriveWaterChlorideRun(input: {
  sampleMassG?: number;
  blankAgNo3Ml?: number;
  sampleAgNo3Ml?: number;
}) {
  const { sampleMassG: m, blankAgNo3Ml: v0, sampleAgNo3Ml: v1 } = input;

  const chloridePercent =
    finiteWater(m) && m > 0 && finiteWater(v0) && v0 > 0 && finiteWater(v1)
      ? round(0.8865 * ((v0 - v1) / (v0 * m)), 4)
      : undefined;

  const chlorideMgL = finiteWater(chloridePercent) ? round(chloridePercent * PERCENT_TO_MG_PER_L, 1) : undefined;

  return { chloridePercent, chlorideMgL };
}

/**
 * EN 196-2 — sulfates gravimetrically as barium sulfate.
 * m3 = m2 - m1; SO3 % = 34.3 x (m3 / m0); sulfate follows by mass ratio.
 */
export function deriveWaterSulfateRun(input: {
  sampleMassG?: number;
  emptyCrucibleG?: number;
  crucibleAndResidueG?: number;
}) {
  const { sampleMassG: m0, emptyCrucibleG: m1, crucibleAndResidueG: m2 } = input;

  const bariumSulfateMassG = finiteWater(m1) && finiteWater(m2) ? round(m2 - m1, 5) : undefined;

  const sulfurTrioxidePercent =
    finiteWater(m0) && m0 > 0 && finiteWater(bariumSulfateMassG)
      ? round(34.3 * (bariumSulfateMassG / m0), 4)
      : undefined;

  const sulfatePercent = finiteWater(sulfurTrioxidePercent) ? round(sulfurTrioxidePercent * SO4_PER_SO3, 4) : undefined;
  const sulfateMgL = finiteWater(sulfatePercent) ? round(sulfatePercent * PERCENT_TO_MG_PER_L, 1) : undefined;

  return { bariumSulfateMassG, sulfurTrioxidePercent, sulfatePercent, sulfateMgL };
}

/**
 * Mean of the runs that were actually completed, so a single-run test reports
 * that run rather than half of it, and an empty section reports nothing.
 */
export function averageWaterRuns(values: Array<number | undefined>, decimals = 2) {
  const usable = values.filter(finiteWater);
  if (!usable.length) return undefined;
  return round(usable.reduce((sum, value) => sum + value, 0) / usable.length, decimals);
}

// --- Rebound hammer (sclerometer), BS EN 12504-2 --------------------------

/** BS EN 12504-2 takes at least nine readings at each test location. */
export const SCLEROMETER_MIN_READINGS = 9;
/** A reading further than this from the median is discarded. */
const SCLEROMETER_OUTLIER_LIMIT = 6;
/** Discarding more than this share of the readings rejects the whole set. */
const SCLEROMETER_MAX_DISCARDED_SHARE = 0.2;

const finiteReading = (value?: number): value is number => typeof value === "number" && Number.isFinite(value);

function medianOf(values: number[]) {
  if (!values.length) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : round((sorted[middle - 1] + sorted[middle]) / 2, 2);
}

/**
 * How BS EN 12504-2 turns a set of rebound readings into one index.
 *
 * Take the median of the readings, discard any that differ from it by more
 * than six units, then take the median of what remains. If more than a fifth
 * of the readings had to be discarded the location is not representative and
 * the whole set is rejected rather than reported.
 */
export function deriveSclerometerLocation(
  readings: Array<number | undefined>,
  correlation: {
    kind?: "linear" | "power";
    coefficientA?: number;
    coefficientB?: number;
  } = {}
) {
  const taken = readings.filter(finiteReading);
  if (!taken.length) {
    return {
      readingCount: 0,
      // A location nobody surveyed is empty, not deficient — only a location
      // that was surveyed can fall short of the nine readings required.
      belowMinimumReadings: false,
      initialMedian: undefined,
      discardedCount: 0,
      discardedPercent: undefined,
      setRejected: false,
      reboundIndex: undefined,
      compressiveStrengthMpa: undefined
    };
  }

  const initialMedian = medianOf(taken);
  const retained = taken.filter((value) => Math.abs(value - (initialMedian as number)) <= SCLEROMETER_OUTLIER_LIMIT);
  const discardedCount = taken.length - retained.length;
  const discardedPercent = round((discardedCount / taken.length) * 100, 1);
  const setRejected = discardedCount / taken.length > SCLEROMETER_MAX_DISCARDED_SHARE;

  const reboundIndex = setRejected ? undefined : medianOf(retained);

  // The standard yields a rebound index, not a strength. The conversion comes
  // from the correlation on the instrument's certificate, which the technician
  // supplies; without it the index stands on its own rather than being run
  // through a curve the app invented.
  const { kind, coefficientA: a, coefficientB: b } = correlation;
  let compressiveStrengthMpa: number | undefined;
  if (finiteReading(reboundIndex) && finiteReading(a) && finiteReading(b)) {
    if (kind === "power") {
      compressiveStrengthMpa = reboundIndex > 0 ? round(a * Math.pow(reboundIndex, b), 2) : undefined;
    } else if (kind === "linear") {
      compressiveStrengthMpa = round(a * reboundIndex + b, 2);
    }
  }

  return {
    readingCount: taken.length,
    belowMinimumReadings: taken.length < SCLEROMETER_MIN_READINGS,
    initialMedian,
    discardedCount,
    discardedPercent,
    setRejected,
    reboundIndex,
    compressiveStrengthMpa
  };
}

/** Mean across the locations that produced a value. */
export function averageSclerometerColumn(values: Array<number | undefined>, decimals = 2) {
  const usable = values.filter(finiteReading);
  if (!usable.length) return undefined;
  return round(usable.reduce((sum, value) => sum + value, 0) / usable.length, decimals);
}
