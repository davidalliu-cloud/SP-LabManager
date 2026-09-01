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
