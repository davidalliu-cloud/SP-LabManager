export function calculateArea(lengthMm: number, widthMm: number) {
  return round(lengthMm * widthMm, 2);
}

export function calculateCompressiveStrength(maximumLoadKn: number, areaMm2: number) {
  if (!areaMm2) return 0;
  return round((maximumLoadKn * 1000) / areaMm2, 2);
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
