import type { LabState, LabTest } from "./types";

export interface TestResultSummary {
  testStartDate?: string;
  testEndDate?: string;
  technicianName?: string;
  checkedBy?: string;
  result: string;
}

function formatNumber(value?: number, digits = 2) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  return Number(value).toFixed(digits).replace(/\.?0+$/, "");
}

export function getTestResultSummary(store: LabState, test: LabTest): TestResultSummary {
  const concrete = store.concreteTests.find((item) => item.testId === test.id);
  if (concrete) {
    const specimens = concrete.specimens ?? [];
    const specimenCount = specimens.length;
    const average = specimenCount
      ? specimens.reduce((sum, specimen) => sum + specimen.compressiveStrengthMpa, 0) / specimenCount
      : concrete.compressiveStrengthMpa;
    return {
      testStartDate: concrete.testStartDate || concrete.testDate,
      testEndDate: concrete.testEndDate || concrete.testDate,
      technicianName: concrete.technicianName,
      result: `Rezistenca mesatare në shtypje: ${formatNumber(average)} MPa (${specimenCount || 1} kube)`
    };
  }

  const concreteWater = store.concreteWaterPenetrationTests.find((item) => item.testId === test.id);
  if (concreteWater) return {
    testStartDate: concreteWater.testStartDate,
    testEndDate: concreteWater.testEndDate,
    technicianName: concreteWater.technicianName,
    checkedBy: concreteWater.checkedBy,
    result: `Depërtimi mesatar i ujit: ${formatNumber(concreteWater.averagePenetrationMm)} mm`
  };

  const concreteFlexural = store.concreteFlexuralTests.find((item) => item.testId === test.id);
  if (concreteFlexural) return {
    testStartDate: concreteFlexural.testStartDate,
    testEndDate: concreteFlexural.testEndDate,
    technicianName: concreteFlexural.technicianName,
    checkedBy: concreteFlexural.checkedBy,
    result: `Rezistenca mesatare në përkulje: ${formatNumber(concreteFlexural.averageFlexuralStrengthMpa)} MPa`
  };

  const concreteDensity = store.concreteDensityTests.find((item) => item.testId === test.id);
  if (concreteDensity) return {
    testStartDate: concreteDensity.testStartDate,
    testEndDate: concreteDensity.testEndDate,
    technicianName: concreteDensity.technicianName,
    checkedBy: concreteDensity.checkedBy,
    result: `Densiteti mesatar: ${formatNumber(concreteDensity.averageDensityKgM3, 0)} kg/m3`
  };

  const concreteIndirect = store.concreteIndirectTensileTests.find((item) => item.testId === test.id);
  if (concreteIndirect) return {
    testStartDate: concreteIndirect.testStartDate,
    testEndDate: concreteIndirect.testEndDate,
    technicianName: concreteIndirect.technicianName,
    checkedBy: concreteIndirect.checkedBy,
    result: `Rezistenca mesatare në tërheqje indirekte: ${formatNumber(concreteIndirect.averageTensileStrengthMpa)} MPa`
  };

  const thermal = store.thermalInsulationTests.find((item) => item.testId === test.id);
  if (thermal) return {
    testStartDate: thermal.testStartDate,
    testEndDate: thermal.testEndDate,
    technicianName: thermal.technicianName,
    checkedBy: thermal.checkedBy,
    result: `Densiteti: ${formatNumber(thermal.averages.apparentDensityKgM3, 0)} kg/m3; absorbimi: ${formatNumber(thermal.averages.waterAbsorptionKgM2)} kg/m2; shtypja: ${formatNumber(thermal.averages.compressiveStressKpa, 0)} kPa`
  };

  const cementConsistency = store.cementConsistencyTests.find((item) => item.testId === test.id);
  if (cementConsistency) return {
    testStartDate: cementConsistency.testStartDate,
    testEndDate: cementConsistency.testEndDate,
    technicianName: cementConsistency.technicianName,
    checkedBy: cementConsistency.checkedBy,
    result: `Konsistenca: ${formatNumber(cementConsistency.consistency.waterDemandPercent)}%; fillimi: ${formatNumber(cementConsistency.setting.initialSettingMinutes, 0)} min; expansion: ${formatNumber(cementConsistency.expansion.expansionMm)} mm`
  };

  const cementStrength = store.cementStrengthTests.find((item) => item.testId === test.id);
  if (cementStrength) return {
    testStartDate: cementStrength.testStartDate,
    testEndDate: cementStrength.testEndDate,
    technicianName: cementStrength.technicianName,
    checkedBy: cementStrength.checkedBy,
    result: `Shtypje 28 ditë: ${formatNumber(cementStrength.averages.compressive28DayMpa)} MPa; përkulje 28 ditë: ${formatNumber(cementStrength.averages.flexural28DayMpa)} MPa`
  };

  const cementBlaine = store.cementBlaineTests.find((item) => item.testId === test.id);
  if (cementBlaine) return {
    testStartDate: cementBlaine.testStartDate,
    testEndDate: cementBlaine.testEndDate,
    technicianName: cementBlaine.technicianName,
    checkedBy: cementBlaine.checkedBy,
    result: `Sipërfaqja specifike ${cementBlaine.method}: ${formatNumber(cementBlaine.specificSurfaceCm2G, 0)} cm2/g`
  };

  const steel = store.steelTests.find((item) => item.testId === test.id);
  if (steel) {
    const count = steel.specimens.length || 1;
    const avgYield = steel.specimens.reduce((sum, specimen) => sum + specimen.yieldStrengthMpa, 0) / count;
    const avgTensile = steel.specimens.reduce((sum, specimen) => sum + specimen.tensileStrengthMpa, 0) / count;
    return {
      testStartDate: steel.testStartDate,
      testEndDate: steel.testEndDate,
      technicianName: steel.technicianName,
      checkedBy: steel.checkedBy,
      result: `ReH mesatare: ${formatNumber(avgYield)} MPa; Rm mesatare: ${formatNumber(avgTensile)} MPa (${steel.specimens.length} mostra)`
    };
  }

  const aggregate = store.aggregateTests.find((item) => item.testId === test.id);
  if (aggregate) return {
    testStartDate: aggregate.testStartDate,
    testEndDate: aggregate.testEndDate,
    technicianName: aggregate.technicianName,
    checkedBy: aggregate.checkedBy,
    result: `Granulometri: ${aggregate.rows.length} sita; kalimi final ${formatNumber(aggregate.rows.at(-1)?.cumulativePassingPercent)}%`
  };

  const aggregateChemical = store.aggregateChemicalTests.find((item) => item.testId === test.id);
  if (aggregateChemical) return {
    testStartDate: aggregateChemical.testStartDate,
    testEndDate: aggregateChemical.testEndDate,
    technicianName: aggregateChemical.technicianName,
    checkedBy: aggregateChemical.checkedBy,
    result: `Klorure: ${formatNumber(aggregateChemical.results.chloridePercent)}%; sulfate SO3: ${formatNumber(aggregateChemical.results.waterSolubleSulfateSo3Percent)}%`
  };

  const aggregateLosAngeles = store.aggregateLosAngelesTests.find((item) => item.testId === test.id);
  if (aggregateLosAngeles) return {
    testStartDate: aggregateLosAngeles.testStartDate,
    testEndDate: aggregateLosAngeles.testEndDate,
    technicianName: aggregateLosAngeles.technicianName,
    checkedBy: aggregateLosAngeles.checkedBy,
    result: `Koeficienti Los Angeles: ${formatNumber(aggregateLosAngeles.fragmentationLossPercent)}%`
  };

  const aggregateFreezeThaw = store.aggregateFreezeThawTests.find((item) => item.testId === test.id);
  if (aggregateFreezeThaw) return {
    testStartDate: aggregateFreezeThaw.testStartDate,
    testEndDate: aggregateFreezeThaw.testEndDate,
    technicianName: aggregateFreezeThaw.technicianName,
    checkedBy: aggregateFreezeThaw.checkedBy,
    result: `Humbja mesatare në masë: ${formatNumber(aggregateFreezeThaw.averageMassLossPercent)}% (${aggregateFreezeThaw.totalCycles} cikle)`
  };

  const aggregateAcv = store.aggregateAcvTests.find((item) => item.testId === test.id);
  if (aggregateAcv) return {
    testStartDate: aggregateAcv.testStartDate,
    testEndDate: aggregateAcv.testEndDate,
    technicianName: aggregateAcv.technicianName,
    checkedBy: aggregateAcv.checkedBy,
    result: `ACV mesatare: ${formatNumber(aggregateAcv.averageAcvPercent)}%`
  };

  const aggregateDensity = store.aggregateDensityAbsorptionTests.find((item) => item.testId === test.id);
  if (aggregateDensity) return {
    testStartDate: aggregateDensity.testStartDate,
    testEndDate: aggregateDensity.testEndDate,
    technicianName: aggregateDensity.technicianName,
    checkedBy: aggregateDensity.checkedBy,
    result: `Absorbimi: ${formatNumber(aggregateDensity.averageAbsorptionPercent)}%; densiteti SSD: ${formatNumber(aggregateDensity.averageSsdBulkDensity)} Mg/m3`
  };

  const aggregateFillerDensity = store.aggregateFillerDensityTests.find((item) => item.testId === test.id);
  if (aggregateFillerDensity) return {
    testStartDate: aggregateFillerDensity.testStartDate,
    testEndDate: aggregateFillerDensity.testEndDate,
    technicianName: aggregateFillerDensity.technicianName,
    checkedBy: aggregateFillerDensity.checkedBy,
    result: `Densiteti i grimcave të filer-it: ${formatNumber(aggregateFillerDensity.averageParticleDensity)} Mg/m3`
  };

  const aggregateShape = store.aggregateShapeIndexTests.find((item) => item.testId === test.id);
  if (aggregateShape) return {
    testStartDate: aggregateShape.testStartDate,
    testEndDate: aggregateShape.testEndDate,
    technicianName: aggregateShape.technicianName,
    checkedBy: aggregateShape.checkedBy,
    result: `Indeksi i formës: ${formatNumber(aggregateShape.shapeIndexPercent)}%`
  };

  const aggregateFlakiness = store.aggregateFlakinessIndexTests.find((item) => item.testId === test.id);
  if (aggregateFlakiness) return {
    testStartDate: aggregateFlakiness.testStartDate,
    testEndDate: aggregateFlakiness.testEndDate,
    technicianName: aggregateFlakiness.technicianName,
    checkedBy: aggregateFlakiness.checkedBy,
    result: `Indeksi i ciflosjes: ${formatNumber(aggregateFlakiness.totals.finalFlakinessIndexPercent)}%`
  };

  const aggregateElongation = store.aggregateElongationIndexTests.find((item) => item.testId === test.id);
  if (aggregateElongation) return {
    testStartDate: aggregateElongation.testStartDate,
    testEndDate: aggregateElongation.testEndDate,
    technicianName: aggregateElongation.technicianName,
    checkedBy: aggregateElongation.checkedBy,
    result: `Indeksi i zgjatimit: ${formatNumber(aggregateElongation.elongationIndexPercent)}%`
  };

  const aggregateBulkDensity = store.aggregateBulkDensityTests.find((item) => item.testId === test.id);
  if (aggregateBulkDensity) return {
    testStartDate: aggregateBulkDensity.testStartDate,
    testEndDate: aggregateBulkDensity.testEndDate,
    technicianName: aggregateBulkDensity.technicianName,
    checkedBy: aggregateBulkDensity.checkedBy,
    result: `Pesha volumore: ${formatNumber(aggregateBulkDensity.averageBulkDensityMgM3)} Mg/m3; boshllëqet: ${formatNumber(aggregateBulkDensity.averageVoidsPercent)}%`
  };

  const aggregateSandEquivalent = store.aggregateSandEquivalentTests.find((item) => item.testId === test.id);
  if (aggregateSandEquivalent) return {
    testStartDate: aggregateSandEquivalent.testStartDate,
    testEndDate: aggregateSandEquivalent.testEndDate,
    technicianName: aggregateSandEquivalent.technicianName,
    checkedBy: aggregateSandEquivalent.checkedBy,
    result: `Ekuivalenti i rërës: ${formatNumber(aggregateSandEquivalent.sandEquivalentValue, 0)}; imtësitë: ${formatNumber(aggregateSandEquivalent.averageFinesPercent)}%`
  };

  const aggregateSoundness = store.aggregateSoundnessTests.find((item) => item.testId === test.id);
  if (aggregateSoundness) return {
    testStartDate: aggregateSoundness.testStartDate,
    testEndDate: aggregateSoundness.testEndDate,
    technicianName: aggregateSoundness.technicianName,
    checkedBy: aggregateSoundness.checkedBy,
    result: `Soundness: ${formatNumber(aggregateSoundness.averageSoundnessLossPercent)}% humbje`
  };

  return {
    testStartDate: test.requiredTestDate,
    testEndDate: test.completedAt?.slice(0, 10) || test.requiredTestDate,
    result: test.completedAt ? "Test i përfunduar, por të dhënat e rezultatit nuk janë ruajtur ende." : "Në pritje të përfundimit të testit."
  };
}
