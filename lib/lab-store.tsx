"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  averageNumbers,
  calculateAgeDays,
  calculateAcvPercent,
  calculateAggregateGradation,
  calculateAcidSolubleSulfateSo3Percent,
  calculateApparentDensityKgM3,
  calculateArea,
  calculateBlaineAstmBedVolumeCm3,
  calculateBlaineAstmConstant,
  calculateBlaineAstmSurface,
  calculateBlaineBedVolumeCm3,
  calculateBlaineBsEnConstant,
  calculateBlaineBsEnSurface,
  calculateBlaineDensity,
  calculateBlaineSampleMassG,
  calculateCementStrengthMpa,
  calculateChloridePercent,
  calculateCircularArea,
  calculateCompressiveStrength,
  calculateBulkDensity,
  calculateConcreteDensityKgM3,
  calculateDensityAbsorption,
  calculateElongation,
  calculateFillerParticleDensity,
  calculateFinesPercent,
  calculateFlexuralStrengthMpa,
  calculateFlakinessPercent,
  calculateFreezeThawMassLoss,
  calculateIndirectTensileStrengthMpa,
  calculateIrregularVolumeM3,
  calculateLosAngelesResults,
  calculateMoisturePercent,
  calculateExpansionMm,
  calculateMinutesBetweenTimes,
  calculateReductionOfArea,
  calculateSandEquivalent,
  calculateShapeIndex,
  calculateSoundnessLossPercent,
  calculateSpecimenVolumeM3,
  calculateSteelStrength,
  calculateSulfateSo4FromSo3,
  calculateCompressionDeformationPercent,
  calculateCompressionStressKpa,
  calculateThermalAbsorptionKgM2,
  calculateThermalApparentDensityKgM3,
  calculateThermalVolumeM3,
  calculateVoidsPercent,
  calculateWaterSolubleSulfateSo3Percent,
  calculateWaterDemandPercent,
  calculateUnitWeightKgPerM
} from "./calculations";
import { initialState } from "./seed-data";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabState, LabTest, LabUser, Notification, Project, Report, Role, Sample, SteelTensileTest, ThermalInsulationTest } from "./types";

interface NewSampleInput {
  clientId: string;
  projectId: string;
  sampleType: string;
  sampleDescription: string;
  quantity: number;
  dateReceived: string;
  timeReceived: string;
  collectionMethod: Sample["collectionMethod"];
  deliveredBy?: string;
  collectedBy?: string;
  requestedTestType: string;
  standard: string;
  requiredTestDate: string;
  reportDueDate: string;
  schedules: Array<{
    cubeCount: number;
    ageDays: number;
    requiredTestDate: string;
    reportDueDate: string;
  }>;
  notes?: string;
}

interface ConcreteInput {
  castingDate: string;
  testDate: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  cubeLength: number;
  cubeWidth: number;
  cubeHeight: number;
  weight: number;
  maximumLoadKn: number;
  failureType: string;
  machineUsed: string;
  technicianName: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    ageDays: number;
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    weightKg: number;
    maximumLoadKn: number;
    visualInspection: string;
    notes?: string;
  }>;
}

interface ConcreteWaterPenetrationInput {
  castingDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  curingMethod?: string;
  pressureDirection?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    maxPenetrationMm: number;
  }>;
}

interface ConcreteFlexuralInput {
  castingDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  apparatusType: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    widthMm: number;
    lengthMm: number;
    thicknessMm: number;
    weightKg: number;
    spanMm: number;
    maximumLoadKn: number;
  }>;
}

interface ConcreteDensityInput {
  testStartDate?: string;
  testEndDate?: string;
  specimenCondition?: string;
  volumeMethod?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    massKg: number;
    volumeM3: number;
    waterMassKg?: number;
    airMassKg?: number;
    dryMassKg?: number;
    waterDensityKgM3?: number;
  }>;
}

interface ConcreteIndirectTensileInput {
  castingDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  curingMethod?: string;
  surfaceCondition?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    contactLengthMm: number;
    crossSectionMm: number;
    maximumLoadN: number;
    failureType: string;
  }>;
}

interface ThermalInsulationInput {
  testStartDate?: string;
  testEndDate?: string;
  surfaceTreatment?: string;
  productType?: string;
  deliveredForm?: string;
  defects?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    lengthMm: number;
    widthMm: number;
    thicknessMm: number;
    massKg: number;
    absorptionLengthMm: number;
    absorptionWidthMm: number;
    massBeforeImmersionKg: number;
    massAfterImmersionKg: number;
    compressionLengthMm: number;
    compressionWidthMm: number;
    initialThicknessMm: number;
    displacementMm: number;
    maximumForceN: number;
    forceAtTenPercentN: number;
  }>;
}

interface CementConsistencyInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  consistency: {
    cementMassG: number;
    waterMassG: number;
    pasteStartTime: string;
    probePenetrationMm: number;
  };
  setting: {
    startTime: string;
    initialSettingTime: string;
    initialVicatReadingMm: number;
    finalSettingTime: string;
    finalVicatReadingMm: number;
  };
  expansion: {
    readingAfter24hMm: number;
    readingAfterBoilingMm: number;
    readingAtAmbientMm: number;
  };
}

interface CementStrengthInput {
  castingDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    rowNo: number;
    ageDays: number;
    testType: "Flexural" | "Compressive";
    surfaceAreaMm2: number;
    testDate?: string;
    loadKn: number;
  }>;
}

interface CementBlaineInput {
  method: "BS EN" | "ASTM";
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  density?: {
    sampleMassG: number;
    initialReadingMl: number;
    finalReadingMl: number;
    waterEquivalentMassG: number;
    waterTemperatureC: number;
    waterDensityGcm3: number;
  };
  bsEn?: {
    internalCellHeightMm: number;
    plungerLengthMm: number;
    cellRadiusMm: number;
    porosity: number;
    referenceSurfaceCm2G: number;
    referenceDensityGcm3: number;
    referenceTimeS: number;
    referenceAirViscosity: number;
    measuredTimeS: number;
    airViscosity: number;
  };
  astm?: {
    emptyCellMercuryMassG: number;
    fullCellMercuryMassG: number;
    mercuryDensityGcm3: number;
    referenceDensityGcm3: number;
    porosity: number;
    referenceSurfaceCm2G: number;
    referenceTimeS: number;
    measuredTimeS: number;
  };
}

interface SteelInput {
  supplyDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  equipmentUsed: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    nominalDiameterMm: number;
    actualDiameterMm: number;
    weightG: number;
    totalLengthMm: number;
    initialGaugeLengthMm: number;
    finalGaugeLengthMm: number;
    yieldLoadKn: number;
    ultimateLoadKn: number;
    postTestDiameterMm: number;
    fractureType: string;
    notes?: string;
  }>;
}

interface AggregateInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  testMethod: string;
  technicianName: string;
  checkedBy?: string;
  sampleMassG: number;
  notes?: string;
  rows: Array<{
    sieveSizeMm: number;
    retainedMassG: number;
  }>;
}

interface AggregateChemicalInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  chlorideTest1: {
    silverNitrateVolumeMl: number;
    waterAggregateRatio: number;
  };
  chlorideTest2: {
    silverNitrateVolumeMl: number;
    waterAggregateRatio: number;
  };
  waterSulfateTest1: {
    emptyCrucibleMassG: number;
    waterAggregateRatio: number;
    cruciblePlusCalcinedMassG: number;
  };
  waterSulfateTest2: {
    emptyCrucibleMassG: number;
    waterAggregateRatio: number;
    cruciblePlusCalcinedMassG: number;
  };
  acidSulfateTest1: {
    sampleMassG: number;
    emptyCrucibleMassG: number;
    cruciblePlusCalcinedMassG: number;
  };
  acidSulfateTest2: {
    sampleMassG: number;
    emptyCrucibleMassG: number;
    cruciblePlusCalcinedMassG: number;
  };
  totalSulfurPercent: number;
  lossOnIgnitionPercent: number;
}

interface AggregateLosAngelesInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  retainedOnOnePointSixMmG: number;
  rows: Array<{
    passingSieveMm: number;
    retainingSieveMm: number;
    sphereCount: number;
    fractionMassG: number;
  }>;
}

interface AggregateFreezeThawInput {
  testStartDate?: string;
  testEndDate?: string;
  totalCycles: number;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: Array<{
    specimenCode: string;
    maximumAggregateSizeMm: number;
    initialDryMassG: number;
    washingSieveSizeMm: number;
    finalDryMassG: number;
    particlesBefore: number;
    splitParticles: number;
    crackedParticles: number;
    flakedParticles: number;
    particlesAfter: number;
  }>;
}

interface AggregateAcvInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  test1: {
    totalDrySampleMassG: number;
    passingTwoPointThirtySixMmMassG: number;
  };
  test2: {
    totalDrySampleMassG: number;
    passingTwoPointThirtySixMmMassG: number;
  };
}

interface AggregateDensityAbsorptionInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  testMethod: string;
  specimens: Array<{
    specimenCode: string;
    waterTemperatureC: number;
    waterDensity: number;
    ovenDryMassG: number;
    ssdMassG: number;
    pycnometerWaterMassG: number;
    pycnometerWaterSampleMassG: number;
  }>;
}

interface AggregateFillerDensityInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  testMethod: string;
  runs: Array<{
    runLabel: string;
    temperatureC: number;
    liquidDensity: number;
    emptyPycnometerMassG: number;
    pycnometerSampleMassG: number;
    pycnometerSampleLiquidMassG: number;
    pycnometerVolumeMl: number;
  }>;
}

interface AggregateShapeIndexInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  rows: Array<{
    fractionLabel: string;
    testPortionMassG: number;
    nonCubicalMassG: number;
  }>;
}

interface AggregateFlakinessIndexInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  initialSampleMassesG: number[];
  discardedMassesG: number[];
  rows: Array<{
    fractionLabel: string;
    sieveOpeningMm: number;
    barSieveMm: number;
    retainedMassesG: number[];
    passingBarSieveMassesG: number[];
  }>;
}

interface AggregateElongationIndexInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  rows: Array<{
    fractionLabel: string;
    retainedMassG: number;
    elongatedMassG: number;
  }>;
}

interface AggregateBulkDensityInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specificDensityMgM3: number;
  runs: Array<{
    containerCapacityM3: number;
    emptyContainerMassKg: number;
    containerSampleMassKg: number;
  }>;
}

interface AggregateSandEquivalentInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  moistureRuns: Array<{
    emptyDishMassG: number;
    dishWetSampleMassG: number;
    dishDrySampleMassG: number;
  }>;
  finesRuns: Array<{
    sampleMassG: number;
    retained0063MassG: number;
  }>;
  sandRuns: Array<{
    materialMassG: number;
    clayReadingMm: number;
    sandReadingMm: number;
  }>;
}

interface AggregateSoundnessInput {
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  cycles: number;
  totalParticlesBefore: number;
  crackedParticles: number;
  brokenParticles: number;
  flakedParticles: number;
  totalParticlesAfter: number;
  runs: Array<{
    sampleNo: string;
    sieveSizeMm: string;
    initialMassG: number;
    finalRetainedMassG: number;
    cycles: number;
  }>;
}

interface NewClientInput {
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  projectName: string;
  projectLocation: string;
  projectDescription?: string;
}

interface EmployeeInput {
  fullName: string;
  email: string;
  role: Role;
  position?: string;
  phone?: string;
  workAreas: string[];
  isActive: boolean;
}

interface ProcedureRevisionInput {
  procedureId: string;
  assignedTo: string;
  changeSummary: string;
  fileName?: string;
  fileUrl?: string;
}

interface LabStoreValue extends LabState {
  currentUserId: string;
  createEmployee: (input: EmployeeInput) => string;
  updateEmployee: (id: string, input: EmployeeInput) => void;
  removeEmployee: (id: string) => void;
  createClient: (input: NewClientInput) => string;
  createSample: (input: NewSampleInput) => string;
  saveConcreteTest: (testId: string, input: ConcreteInput) => void;
  saveConcreteWaterPenetrationTest: (testId: string, input: ConcreteWaterPenetrationInput) => void;
  saveConcreteFlexuralTest: (testId: string, input: ConcreteFlexuralInput) => void;
  saveConcreteDensityTest: (testId: string, input: ConcreteDensityInput) => void;
  saveConcreteIndirectTensileTest: (testId: string, input: ConcreteIndirectTensileInput) => void;
  saveThermalInsulationTest: (testId: string, input: ThermalInsulationInput) => void;
  saveCementConsistencyTest: (testId: string, input: CementConsistencyInput) => void;
  saveCementStrengthTest: (testId: string, input: CementStrengthInput) => void;
  saveCementBlaineTest: (testId: string, input: CementBlaineInput) => void;
  saveSteelTest: (testId: string, input: SteelInput) => void;
  saveAggregateTest: (testId: string, input: AggregateInput) => void;
  saveAggregateChemicalTest: (testId: string, input: AggregateChemicalInput) => void;
  saveAggregateLosAngelesTest: (testId: string, input: AggregateLosAngelesInput) => void;
  saveAggregateFreezeThawTest: (testId: string, input: AggregateFreezeThawInput) => void;
  saveAggregateAcvTest: (testId: string, input: AggregateAcvInput) => void;
  saveAggregateDensityAbsorptionTest: (testId: string, input: AggregateDensityAbsorptionInput) => void;
  saveAggregateFillerDensityTest: (testId: string, input: AggregateFillerDensityInput) => void;
  saveAggregateShapeIndexTest: (testId: string, input: AggregateShapeIndexInput) => void;
  saveAggregateFlakinessIndexTest: (testId: string, input: AggregateFlakinessIndexInput) => void;
  saveAggregateElongationIndexTest: (testId: string, input: AggregateElongationIndexInput) => void;
  saveAggregateBulkDensityTest: (testId: string, input: AggregateBulkDensityInput) => void;
  saveAggregateSandEquivalentTest: (testId: string, input: AggregateSandEquivalentInput) => void;
  saveAggregateSoundnessTest: (testId: string, input: AggregateSoundnessInput) => void;
  markTestCompleted: (testId: string) => void;
  generateReport: (testId: string) => string;
  submitReport: (reportId: string) => void;
  approveReport: (reportId: string) => void;
  rejectReport: (reportId: string, comments: string) => void;
  issueReport: (reportId: string, clientEmail: string, notes?: string) => void;
  createProcedureRevision: (input: ProcedureRevisionInput) => string;
  submitProcedureRevision: (revisionId: string) => void;
  approveProcedureRevision: (revisionId: string) => void;
  rejectProcedureRevision: (revisionId: string, comments: string) => void;
}

const LabStoreContext = createContext<LabStoreValue | null>(null);
const STORAGE_KEY = "sarp-lab-management-state-v1";

function mergeWithInitialState(saved: Partial<LabState>): LabState {
  const procedureRevisions = (saved.procedureRevisions ?? initialState.procedureRevisions).map((revision) => ({
    ...revision,
    pdfUrl: revision.pdfUrl ?? (revision.fileUrl.endsWith(".doc") ? revision.fileUrl.replace(/\.doc$/, ".pdf") : revision.fileUrl)
  }));
  return {
    ...initialState,
    ...saved,
    users: saved.users ?? initialState.users,
    clients: saved.clients ?? initialState.clients,
    projects: saved.projects ?? initialState.projects,
    samples: saved.samples ?? initialState.samples,
    tests: saved.tests ?? initialState.tests,
    concreteTests: saved.concreteTests ?? initialState.concreteTests,
    concreteWaterPenetrationTests: saved.concreteWaterPenetrationTests ?? initialState.concreteWaterPenetrationTests,
    concreteFlexuralTests: saved.concreteFlexuralTests ?? initialState.concreteFlexuralTests,
    concreteDensityTests: saved.concreteDensityTests ?? initialState.concreteDensityTests,
    concreteIndirectTensileTests: saved.concreteIndirectTensileTests ?? initialState.concreteIndirectTensileTests,
    thermalInsulationTests: saved.thermalInsulationTests ?? initialState.thermalInsulationTests,
    cementConsistencyTests: saved.cementConsistencyTests ?? initialState.cementConsistencyTests,
    cementStrengthTests: saved.cementStrengthTests ?? initialState.cementStrengthTests,
    cementBlaineTests: saved.cementBlaineTests ?? initialState.cementBlaineTests,
    steelTests: saved.steelTests ?? initialState.steelTests,
    aggregateTests: saved.aggregateTests ?? initialState.aggregateTests,
    aggregateChemicalTests: saved.aggregateChemicalTests ?? initialState.aggregateChemicalTests,
    aggregateLosAngelesTests: saved.aggregateLosAngelesTests ?? initialState.aggregateLosAngelesTests,
    aggregateFreezeThawTests: saved.aggregateFreezeThawTests ?? initialState.aggregateFreezeThawTests,
    aggregateAcvTests: saved.aggregateAcvTests ?? initialState.aggregateAcvTests,
    aggregateDensityAbsorptionTests: saved.aggregateDensityAbsorptionTests ?? initialState.aggregateDensityAbsorptionTests,
    aggregateFillerDensityTests: saved.aggregateFillerDensityTests ?? initialState.aggregateFillerDensityTests,
    aggregateShapeIndexTests: saved.aggregateShapeIndexTests ?? initialState.aggregateShapeIndexTests,
    aggregateFlakinessIndexTests: saved.aggregateFlakinessIndexTests ?? initialState.aggregateFlakinessIndexTests,
    aggregateElongationIndexTests: saved.aggregateElongationIndexTests ?? initialState.aggregateElongationIndexTests,
    aggregateBulkDensityTests: saved.aggregateBulkDensityTests ?? initialState.aggregateBulkDensityTests,
    aggregateSandEquivalentTests: saved.aggregateSandEquivalentTests ?? initialState.aggregateSandEquivalentTests,
    aggregateSoundnessTests: saved.aggregateSoundnessTests ?? initialState.aggregateSoundnessTests,
    reports: saved.reports ?? initialState.reports,
    procedures: saved.procedures ?? initialState.procedures,
    procedureRevisions,
    notifications: saved.notifications ?? initialState.notifications,
    auditLog: saved.auditLog ?? initialState.auditLog
  };
}

export function LabStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LabState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const currentUserId = "u-admin";

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(mergeWithInitialState(JSON.parse(saved) as Partial<LabState>));
      }
    } catch (error) {
      console.warn("Could not load saved SARP LAB data.", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Could not save SARP LAB data.", error);
    }
  }, [isHydrated, state]);

  const value = useMemo<LabStoreValue>(() => {
    function addAudit(draft: LabState, action: string, entityType: string, entityId: string, description: string) {
      draft.auditLog = [
        {
          id: crypto.randomUUID(),
          userId: currentUserId,
          action,
          entityType,
          entityId,
          description,
          createdAt: new Date().toISOString()
        },
        ...draft.auditLog
      ];
    }

    function addNotification(
      draft: LabState,
      userId: string,
      title: string,
      message: string,
      relatedTestId?: string,
      relatedReportId?: string
    ) {
      const notification: Notification = {
        id: crypto.randomUUID(),
        userId,
        title,
        message,
        relatedTestId,
        relatedReportId,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      draft.notifications = [notification, ...draft.notifications];
    }

    function nextNumber(prefix: string, count: number) {
      return `${prefix}-2026-${String(count + 1).padStart(4, "0")}`;
    }

    function nextClientCode(clients: Client[]) {
      return `CL-${String(clients.length + 1).padStart(3, "0")}`;
    }

    function nextMonthlySampleCode(dateReceived: string, samples: Sample[]) {
      const date = new Date(`${dateReceived}T00:00:00`);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const prefix = `${year}-${month}`;
      const count = samples.filter((sample) => sample.sampleCode.startsWith(`${prefix}-`)).length;
      return `${prefix}-${String(count + 1).padStart(3, "0")}`;
    }

    function chunk<T>(rows: T[], size: number) {
      const chunks: T[][] = [];
      for (let index = 0; index < rows.length; index += size) {
        chunks.push(rows.slice(index, index + size));
      }
      return chunks;
    }

    function nextProcedureRevision(procedureId: string, revisions = state.procedureRevisions) {
      const numbers = revisions
        .filter((revision) => revision.procedureId === procedureId)
        .map((revision) => Number(revision.revision))
        .filter((revision) => Number.isFinite(revision));
      const latest = numbers.length ? Math.max(...numbers) : 0;
      return (latest + 1).toFixed(1);
    }

    function groupSteelSpecimensByDiameter(steel?: SteelTensileTest) {
      if (!steel?.specimens.length) return [];
      const groups = new Map<string, string[]>();
      steel.specimens.forEach((specimen) => {
        const key = String(specimen.nominalDiameterMm || specimen.actualDiameterMm || "unknown");
        groups.set(key, [...(groups.get(key) ?? []), specimen.specimenCode]);
      });
      return Array.from(groups.entries()).flatMap(([, codes]) => chunk(codes, 3));
    }

    function isTestingFinished(status: LabTest["status"]) {
      return ["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].includes(status);
    }

    return {
      ...state,
      currentUserId,
      createEmployee(input) {
        const employeeId = crypto.randomUUID();
        setState((previous) => {
          const employee: LabUser = {
            id: employeeId,
            fullName: input.fullName,
            email: input.email,
            role: input.role,
            position: input.position,
            phone: input.phone,
            workAreas: input.workAreas,
            isActive: input.isActive
          };
          const draft: LabState = {
            ...previous,
            users: [employee, ...previous.users],
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "employee_created", "user", employeeId, `Employee ${employee.fullName} added.`);
          return draft;
        });
        return employeeId;
      },
      updateEmployee(id, input) {
        setState((previous) => {
          const draft: LabState = {
            ...previous,
            users: previous.users.map((user) =>
              user.id === id
                ? {
                    ...user,
                    fullName: input.fullName,
                    email: input.email,
                    role: input.role,
                    position: input.position,
                    phone: input.phone,
                    workAreas: input.workAreas,
                    isActive: input.isActive
                  }
                : user
            ),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "employee_updated", "user", id, `Employee ${input.fullName} updated.`);
          return draft;
        });
      },
      removeEmployee(id) {
        setState((previous) => {
          const employee = previous.users.find((user) => user.id === id);
          const assignedTestCount = previous.tests.filter((test) => test.assignedTechnician === id).length;
          const draft: LabState = {
            ...previous,
            users: previous.users.filter((user) => user.id !== id),
            tests: previous.tests.map((test) => (test.assignedTechnician === id ? { ...test, assignedTechnician: "" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(
            draft,
            "employee_removed",
            "user",
            id,
            `${employee?.fullName ?? "Employee"} removed${assignedTestCount ? ` and unassigned from ${assignedTestCount} test${assignedTestCount === 1 ? "" : "s"}` : ""}.`
          );
          return draft;
        });
      },
      createClient(input) {
        const clientId = crypto.randomUUID();
        const projectId = crypto.randomUUID();
        setState((previous) => {
          const client: Client = {
            id: clientId,
            clientCode: nextClientCode(previous.clients),
            clientName: input.clientName,
            contactPerson: input.contactPerson,
            email: input.email,
            phone: input.phone,
            address: input.address,
            notes: input.notes
          };
          const project: Project = {
            id: projectId,
            clientId,
            projectName: input.projectName,
            location: input.projectLocation,
            description: input.projectDescription
          };
          const draft: LabState = {
            ...previous,
            clients: [client, ...previous.clients],
            projects: [project, ...previous.projects],
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "client_created", "client", clientId, `Client ${client.clientCode} created with project ${project.projectName}.`);
          return draft;
        });
        return clientId;
      },
      createSample(input) {
        const sampleId = crypto.randomUUID();
        const sampleCode = nextMonthlySampleCode(input.dateReceived, state.samples);
        const schedules =
          input.schedules.length > 0
            ? input.schedules
            : [{ cubeCount: input.quantity, ageDays: 0, requiredTestDate: input.requiredTestDate, reportDueDate: input.reportDueDate }];
        const firstTestId = crypto.randomUUID();
        setState((previous) => {
          const sample: Sample = {
            id: sampleId,
            sampleCode,
            clientId: input.clientId,
            projectId: input.projectId,
            sampleType: input.sampleType,
            sampleDescription: input.sampleDescription,
            quantity: input.quantity,
            dateReceived: input.dateReceived,
            timeReceived: input.timeReceived,
            collectionMethod: input.collectionMethod,
            deliveredBy: input.deliveredBy,
            collectedBy: input.collectedBy,
            requestedTestType: input.requestedTestType,
            standard: input.standard,
            requiredTestDate: input.requiredTestDate,
            reportDueDate: input.reportDueDate,
            status: "Registered",
            notes: input.notes,
            createdBy: currentUserId,
            createdAt: new Date().toISOString()
          };
          const tests: LabTest[] = schedules.map((schedule, index) => ({
            id: index === 0 ? firstTestId : crypto.randomUUID(),
            testCode: nextNumber("TEST", previous.tests.length + index),
            sampleId,
            clientId: input.clientId,
            projectId: input.projectId,
            testType: schedules.length > 1 && schedule.ageDays ? `${input.requestedTestType} - ${schedule.ageDays} days` : input.requestedTestType,
            standard: input.standard,
            assignedTechnician: "u-tech",
            cubeCount: schedule.cubeCount,
            scheduledAgeDays: schedule.ageDays,
            requiredTestDate: schedule.requiredTestDate,
            dueDate: schedule.reportDueDate,
            status: "Pending",
            priority: "Normal",
            notes: schedule.ageDays
              ? `${schedule.cubeCount} specimen${schedule.cubeCount === 1 ? "" : "s"} scheduled at ${schedule.ageDays} days.`
              : `${schedule.cubeCount} specimen${schedule.cubeCount === 1 ? "" : "s"} scheduled.`,
            createdAt: new Date().toISOString()
          }));
          const draft: LabState = {
            ...previous,
            samples: [sample, ...previous.samples],
            tests: [...tests, ...previous.tests],
            auditLog: [...previous.auditLog],
            notifications: [...previous.notifications]
          };
          tests.forEach((test) => {
            addNotification(
              draft,
              "u-tech",
              "New test batch assigned",
              test.scheduledAgeDays
                ? `${test.testCode}: ${test.cubeCount} specimen${test.cubeCount === 1 ? "" : "s"} at ${test.scheduledAgeDays} days.`
                : `${test.testCode}: ${test.cubeCount} specimen${test.cubeCount === 1 ? "" : "s"} assigned.`,
              test.id
            );
          });
          addAudit(draft, "sample_created", "sample", sampleId, `Sample ${sampleCode} created with ${tests.length} scheduled test batch${tests.length === 1 ? "" : "es"}.`);
          return draft;
        });
        return firstTestId;
      },
      saveConcreteTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.maximumLoadKn || row.weightKg)
            .map((row) => {
              const loadedAreaMm2 = calculateArea(row.lengthMm, row.widthMm);
              return {
                ...row,
                loadedAreaMm2,
                compressiveStrengthMpa: calculateCompressiveStrength(row.maximumLoadKn, loadedAreaMm2)
              };
            });
          const firstSpecimen = specimens[0];
          const loadedAreaMm2 = firstSpecimen?.loadedAreaMm2 ?? calculateArea(input.cubeLength, input.cubeWidth);
          const concreteTest: ConcreteCompressiveTest = {
            id: previous.concreteTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            cubeLength: firstSpecimen?.lengthMm ?? input.cubeLength,
            cubeWidth: firstSpecimen?.widthMm ?? input.cubeWidth,
            cubeHeight: firstSpecimen?.heightMm ?? input.cubeHeight,
            weight: firstSpecimen?.weightKg ?? input.weight,
            maximumLoadKn: firstSpecimen?.maximumLoadKn ?? input.maximumLoadKn,
            failureType: firstSpecimen?.visualInspection ?? input.failureType,
            ageDays: calculateAgeDays(input.castingDate, input.testDate),
            loadedAreaMm2,
            compressiveStrengthMpa: firstSpecimen?.compressiveStrengthMpa ?? calculateCompressiveStrength(input.maximumLoadKn, loadedAreaMm2),
            specimens,
            createdAt: new Date().toISOString()
          };
          const existing = previous.concreteTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            concreteTests: existing
              ? previous.concreteTests.map((row) => (row.testId === testId ? concreteTest : row))
              : [concreteTest, ...previous.concreteTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Concrete compressive strength data saved.");
          return draft;
        });
      },
      saveConcreteWaterPenetrationTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens.filter((row) => row.specimenCode || row.maxPenetrationMm || row.lengthMm || row.widthMm || row.heightMm);
          const waterTest: ConcreteWaterPenetrationTest = {
            id: previous.concreteWaterPenetrationTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            specimens,
            averagePenetrationMm: averageNumbers(specimens.map((row) => row.maxPenetrationMm), 1),
            createdAt: new Date().toISOString()
          };
          const existing = previous.concreteWaterPenetrationTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            concreteWaterPenetrationTests: existing
              ? previous.concreteWaterPenetrationTests.map((row) => (row.testId === testId ? waterTest : row))
              : [waterTest, ...previous.concreteWaterPenetrationTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Concrete water penetration data saved.");
          return draft;
        });
      },
      saveConcreteFlexuralTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.specimenCode || row.maximumLoadKn || row.weightKg)
            .map((row) => {
              const volumeM3 = calculateSpecimenVolumeM3(row.lengthMm, row.widthMm, row.thicknessMm);
              return {
                ...row,
                volumeM3,
                apparentDensityKgM3: calculateApparentDensityKgM3(row.weightKg, volumeM3),
                flexuralStrengthMpa: calculateFlexuralStrengthMpa(row.maximumLoadKn, row.spanMm, row.widthMm, row.thicknessMm)
              };
            });
          const flexuralTest: ConcreteFlexuralTest = {
            id: previous.concreteFlexuralTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            specimens,
            averageFlexuralStrengthMpa: averageNumbers(specimens.map((row) => row.flexuralStrengthMpa), 2),
            createdAt: new Date().toISOString()
          };
          const existing = previous.concreteFlexuralTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            concreteFlexuralTests: existing
              ? previous.concreteFlexuralTests.map((row) => (row.testId === testId ? flexuralTest : row))
              : [flexuralTest, ...previous.concreteFlexuralTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Concrete flexural strength data saved.");
          return draft;
        });
      },
      saveConcreteDensityTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.specimenCode || row.massKg || row.volumeM3 || row.airMassKg || row.waterMassKg || row.dryMassKg)
            .map((row) => {
              const calculatedVolume = row.volumeM3 || calculateIrregularVolumeM3(row.airMassKg ?? 0, row.waterMassKg ?? 0, row.waterDensityKgM3 ?? 998);
              const mass = row.dryMassKg || row.massKg;
              return {
                ...row,
                volumeM3: calculatedVolume,
                densityKgM3: calculateConcreteDensityKgM3(mass, calculatedVolume)
              };
            });
          const densityTest: ConcreteDensityTest = {
            id: previous.concreteDensityTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            specimens,
            averageDensityKgM3: averageNumbers(specimens.map((row) => row.densityKgM3), 0),
            createdAt: new Date().toISOString()
          };
          const existing = previous.concreteDensityTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            concreteDensityTests: existing
              ? previous.concreteDensityTests.map((row) => (row.testId === testId ? densityTest : row))
              : [densityTest, ...previous.concreteDensityTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Concrete density data saved.");
          return draft;
        });
      },
      saveConcreteIndirectTensileTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.specimenCode || row.maximumLoadN || row.contactLengthMm || row.crossSectionMm)
            .map((row) => ({
              ...row,
              tensileStrengthMpa: calculateIndirectTensileStrengthMpa(row.maximumLoadN, row.contactLengthMm, row.crossSectionMm)
            }));
          const tensileTest: ConcreteIndirectTensileTest = {
            id: previous.concreteIndirectTensileTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            specimens,
            averageTensileStrengthMpa: averageNumbers(specimens.map((row) => row.tensileStrengthMpa), 2),
            createdAt: new Date().toISOString()
          };
          const existing = previous.concreteIndirectTensileTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            concreteIndirectTensileTests: existing
              ? previous.concreteIndirectTensileTests.map((row) => (row.testId === testId ? tensileTest : row))
              : [tensileTest, ...previous.concreteIndirectTensileTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Concrete indirect tensile data saved.");
          return draft;
        });
      },
      saveThermalInsulationTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.specimenCode || row.lengthMm || row.widthMm || row.thicknessMm || row.massKg || row.maximumForceN)
            .map((row) => {
              const volumeM3 = calculateThermalVolumeM3(row.lengthMm, row.widthMm, row.thicknessMm);
              return {
                ...row,
                volumeM3,
                apparentDensityKgM3: calculateThermalApparentDensityKgM3(row.massKg, volumeM3),
                waterAbsorptionKgM2: calculateThermalAbsorptionKgM2(row.massBeforeImmersionKg, row.massAfterImmersionKg, row.absorptionLengthMm, row.absorptionWidthMm),
                deformationPercent: calculateCompressionDeformationPercent(row.displacementMm, row.initialThicknessMm),
                compressiveStressKpa: calculateCompressionStressKpa(row.maximumForceN, row.compressionLengthMm, row.compressionWidthMm),
                compressiveStressAtTenPercentKpa: calculateCompressionStressKpa(row.forceAtTenPercentN, row.compressionLengthMm, row.compressionWidthMm)
              };
            });
          const thermalTest: ThermalInsulationTest = {
            id: previous.thermalInsulationTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            surfaceTreatment: input.surfaceTreatment,
            productType: input.productType,
            deliveredForm: input.deliveredForm,
            defects: input.defects,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            specimens,
            averages: {
              lengthMm: averageNumbers(specimens.map((row) => row.lengthMm), 1),
              widthMm: averageNumbers(specimens.map((row) => row.widthMm), 1),
              thicknessMm: averageNumbers(specimens.map((row) => row.thicknessMm), 1),
              apparentDensityKgM3: averageNumbers(specimens.map((row) => row.apparentDensityKgM3), 1),
              waterAbsorptionKgM2: averageNumbers(specimens.map((row) => row.waterAbsorptionKgM2), 2),
              compressiveStressKpa: averageNumbers(specimens.map((row) => row.compressiveStressAtTenPercentKpa || row.compressiveStressKpa), 1)
            },
            createdAt: new Date().toISOString()
          };
          const existing = previous.thermalInsulationTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            thermalInsulationTests: existing
              ? previous.thermalInsulationTests.map((row) => (row.testId === testId ? thermalTest : row))
              : [thermalTest, ...previous.thermalInsulationTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Thermal insulation physical-mechanical data saved.");
          return draft;
        });
      },
      saveCementConsistencyTest(testId, input) {
        setState((previous) => {
          const cementTest: CementConsistencyTest = {
            id: previous.cementConsistencyTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            consistency: {
              ...input.consistency,
              waterDemandPercent: calculateWaterDemandPercent(input.consistency.waterMassG, input.consistency.cementMassG)
            },
            setting: {
              ...input.setting,
              initialSettingMinutes: calculateMinutesBetweenTimes(input.setting.startTime, input.setting.initialSettingTime),
              finalSettingMinutes: calculateMinutesBetweenTimes(input.setting.startTime, input.setting.finalSettingTime)
            },
            expansion: {
              ...input.expansion,
              expansionMm: calculateExpansionMm(input.expansion.readingAfter24hMm, input.expansion.readingAtAmbientMm)
            },
            createdAt: new Date().toISOString()
          };
          const existing = previous.cementConsistencyTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            cementConsistencyTests: existing
              ? previous.cementConsistencyTests.map((row) => (row.testId === testId ? cementTest : row))
              : [cementTest, ...previous.cementConsistencyTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Cement consistency, setting time, and expansion data saved.");
          return draft;
        });
      },
      saveCementStrengthTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.loadKn || row.testDate)
            .map((row) => ({
              ...row,
              strengthMpa: calculateCementStrengthMpa(row.loadKn, row.surfaceAreaMm2)
            }));
          const averageFor = (testType: "Flexural" | "Compressive", ageDays: number, decimals: number) =>
            averageNumbers(specimens.filter((row) => row.testType === testType && row.ageDays === ageDays).map((row) => row.strengthMpa), decimals);
          const cementTest: CementStrengthTest = {
            id: previous.cementStrengthTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            castingDate: input.castingDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            specimens,
            averages: {
              flexural2DayMpa: averageFor("Flexural", 2, 2),
              flexural7DayMpa: averageFor("Flexural", 7, 2),
              flexural28DayMpa: averageFor("Flexural", 28, 2),
              compressive2DayMpa: averageFor("Compressive", 2, 1),
              compressive7DayMpa: averageFor("Compressive", 7, 1),
              compressive28DayMpa: averageFor("Compressive", 28, 1)
            },
            createdAt: new Date().toISOString()
          };
          const existing = previous.cementStrengthTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            cementStrengthTests: existing
              ? previous.cementStrengthTests.map((row) => (row.testId === testId ? cementTest : row))
              : [cementTest, ...previous.cementStrengthTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Cement flexural and compressive strength data saved.");
          return draft;
        });
      },
      saveCementBlaineTest(testId, input) {
        setState((previous) => {
          const displacedMassG = input.density ? input.density.initialReadingMl - input.density.finalReadingMl : 0;
          const density = input.density
            ? {
                ...input.density,
                displacedMassG,
                cementDensityGcm3: calculateBlaineDensity(input.density.sampleMassG, input.density.waterEquivalentMassG || displacedMassG, input.density.waterDensityGcm3)
              }
            : undefined;
          const bsEnBedVolume = input.bsEn ? calculateBlaineBedVolumeCm3(input.bsEn.internalCellHeightMm, input.bsEn.plungerLengthMm, input.bsEn.cellRadiusMm) : 0;
          const bsEnDensity = density?.cementDensityGcm3 || input.bsEn?.referenceDensityGcm3 || 0;
          const bsEnConstant = input.bsEn ? calculateBlaineBsEnConstant(input.bsEn.referenceSurfaceCm2G, input.bsEn.referenceDensityGcm3, input.bsEn.porosity, input.bsEn.referenceTimeS, input.bsEn.referenceAirViscosity) : 0;
          const bsEn = input.bsEn
            ? {
                ...input.bsEn,
                bedVolumeCm3: bsEnBedVolume,
                sampleMassG: calculateBlaineSampleMassG(input.bsEn.porosity, bsEnDensity, bsEnBedVolume),
                constantK: bsEnConstant
              }
            : undefined;
          const astmBedVolume = input.astm ? calculateBlaineAstmBedVolumeCm3(input.astm.fullCellMercuryMassG, input.astm.emptyCellMercuryMassG, input.astm.mercuryDensityGcm3) : 0;
          const astmConstant = input.astm ? calculateBlaineAstmConstant(input.astm.referenceSurfaceCm2G, input.astm.referenceTimeS) : 0;
          const astm = input.astm
            ? {
                ...input.astm,
                bedVolumeCm3: astmBedVolume,
                sampleMassG: calculateBlaineSampleMassG(input.astm.porosity, input.astm.referenceDensityGcm3, astmBedVolume),
                constantK: astmConstant
              }
            : undefined;
          const cementTest: CementBlaineTest = {
            id: previous.cementBlaineTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            method: input.method,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            density,
            bsEn,
            astm,
            specificSurfaceCm2G: input.method === "ASTM"
              ? calculateBlaineAstmSurface(astmConstant, input.astm?.measuredTimeS ?? 0)
              : calculateBlaineBsEnSurface(bsEnConstant, bsEnDensity, input.bsEn?.porosity ?? 0, input.bsEn?.measuredTimeS ?? 0, input.bsEn?.airViscosity ?? 0),
            createdAt: new Date().toISOString()
          };
          const existing = previous.cementBlaineTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            cementBlaineTests: existing
              ? previous.cementBlaineTests.map((row) => (row.testId === testId ? cementTest : row))
              : [cementTest, ...previous.cementBlaineTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, `Cement Blaine ${input.method} data saved.`);
          return draft;
        });
      },
      saveSteelTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.actualDiameterMm || row.yieldLoadKn || row.ultimateLoadKn || row.weightG)
            .map((row) => {
              const crossSectionalAreaMm2 = calculateCircularArea(row.actualDiameterMm || row.nominalDiameterMm);
              const finalCrossSectionalAreaMm2 = calculateCircularArea(row.postTestDiameterMm);
              return {
                ...row,
                crossSectionalAreaMm2,
                yieldStrengthMpa: calculateSteelStrength(row.yieldLoadKn, crossSectionalAreaMm2),
                tensileStrengthMpa: calculateSteelStrength(row.ultimateLoadKn, crossSectionalAreaMm2),
                elongationPercent: calculateElongation(row.initialGaugeLengthMm, row.finalGaugeLengthMm),
                unitWeightKgPerM: calculateUnitWeightKgPerM(row.weightG, row.totalLengthMm),
                finalCrossSectionalAreaMm2,
                reductionOfAreaPercent: calculateReductionOfArea(crossSectionalAreaMm2, finalCrossSectionalAreaMm2)
              };
            });
          const steelTest: SteelTensileTest = {
            id: previous.steelTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            specimens,
            createdAt: new Date().toISOString()
          };
          const existing = previous.steelTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            steelTests: existing
              ? previous.steelTests.map((row) => (row.testId === testId ? steelTest : row))
              : [steelTest, ...previous.steelTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Steel tensile strength data saved.");
          return draft;
        });
      },
      saveAggregateTest(testId, input) {
        setState((previous) => {
          const calculatedRows = calculateAggregateGradation(
            input.rows.filter((row) => row.sieveSizeMm || row.retainedMassG),
            input.sampleMassG
          );
          const aggregateTest: AggregateGradationTest = {
            id: previous.aggregateTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            ...input,
            rows: calculatedRows,
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateTests: existing
              ? previous.aggregateTests.map((row) => (row.testId === testId ? aggregateTest : row))
              : [aggregateTest, ...previous.aggregateTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate granulometry data saved.");
          return draft;
        });
      },
      saveAggregateChemicalTest(testId, input) {
        setState((previous) => {
          const chlorideRun = (run: AggregateChemicalInput["chlorideTest1"]) => ({
            ...run,
            chloridePercent: calculateChloridePercent(run.silverNitrateVolumeMl, run.waterAggregateRatio)
          });
          const waterSulfateRun = (run: AggregateChemicalInput["waterSulfateTest1"]) => {
            const calcinedMaterialMassG = run.cruciblePlusCalcinedMassG - run.emptyCrucibleMassG;
            return {
              ...run,
              calcinedMaterialMassG,
              sulfateSo3Percent: calculateWaterSolubleSulfateSo3Percent(run.waterAggregateRatio, calcinedMaterialMassG)
            };
          };
          const acidSulfateRun = (run: AggregateChemicalInput["acidSulfateTest1"]) => {
            const calcinedMaterialMassG = run.cruciblePlusCalcinedMassG - run.emptyCrucibleMassG;
            const sulfateSo3Percent = calculateAcidSolubleSulfateSo3Percent(run.sampleMassG, calcinedMaterialMassG);
            return {
              ...run,
              calcinedMaterialMassG,
              sulfateSo3Percent,
              sulfateSo4Percent: calculateSulfateSo4FromSo3(sulfateSo3Percent)
            };
          };
          const chlorideTest1 = chlorideRun(input.chlorideTest1);
          const chlorideTest2 = chlorideRun(input.chlorideTest2);
          const waterSulfateTest1 = waterSulfateRun(input.waterSulfateTest1);
          const waterSulfateTest2 = waterSulfateRun(input.waterSulfateTest2);
          const acidSulfateTest1 = acidSulfateRun(input.acidSulfateTest1);
          const acidSulfateTest2 = acidSulfateRun(input.acidSulfateTest2);
          const chlorideValues = [chlorideTest1, chlorideTest2]
            .filter((run) => run.silverNitrateVolumeMl || run.waterAggregateRatio)
            .map((run) => run.chloridePercent);
          const waterSulfateValues = [waterSulfateTest1, waterSulfateTest2]
            .filter((run) => run.emptyCrucibleMassG || run.waterAggregateRatio || run.cruciblePlusCalcinedMassG)
            .map((run) => run.sulfateSo3Percent);
          const acidSulfateSo3Values = [acidSulfateTest1, acidSulfateTest2]
            .filter((run) => run.sampleMassG || run.emptyCrucibleMassG || run.cruciblePlusCalcinedMassG)
            .map((run) => run.sulfateSo3Percent);
          const acidSulfateSo4Values = [acidSulfateTest1, acidSulfateTest2]
            .filter((run) => run.sampleMassG || run.emptyCrucibleMassG || run.cruciblePlusCalcinedMassG)
            .map((run) => run.sulfateSo4Percent);
          const aggregateChemicalTest: AggregateChemicalTest = {
            id: previous.aggregateChemicalTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            chlorideTest1,
            chlorideTest2,
            waterSulfateTest1,
            waterSulfateTest2,
            acidSulfateTest1,
            acidSulfateTest2,
            results: {
              chloridePercent: averageNumbers(chlorideValues),
              waterSolubleSulfateSo3Percent: averageNumbers(waterSulfateValues),
              acidSolubleSulfateSo3Percent: averageNumbers(acidSulfateSo3Values),
              acidSolubleSulfateSo4Percent: averageNumbers(acidSulfateSo4Values),
              totalSulfurPercent: input.totalSulfurPercent,
              lossOnIgnitionPercent: input.lossOnIgnitionPercent
            },
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateChemicalTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateChemicalTests: existing
              ? previous.aggregateChemicalTests.map((row) => (row.testId === testId ? aggregateChemicalTest : row))
              : [aggregateChemicalTest, ...previous.aggregateChemicalTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate chloride and sulfate data saved.");
          return draft;
        });
      },
      saveAggregateLosAngelesTest(testId, input) {
        setState((previous) => {
          const rows = input.rows.filter((row) => row.passingSieveMm || row.retainingSieveMm || row.fractionMassG || row.sphereCount);
          const results = calculateLosAngelesResults(rows, input.retainedOnOnePointSixMmG);
          const losAngelesTest: AggregateLosAngelesTest = {
            id: previous.aggregateLosAngelesTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            rows,
            retainedOnOnePointSixMmG: input.retainedOnOnePointSixMmG,
            ...results,
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateLosAngelesTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateLosAngelesTests: existing
              ? previous.aggregateLosAngelesTests.map((row) => (row.testId === testId ? losAngelesTest : row))
              : [losAngelesTest, ...previous.aggregateLosAngelesTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Los Angeles fragmentation data saved.");
          return draft;
        });
      },
      saveAggregateFreezeThawTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.specimenCode || row.initialDryMassG || row.finalDryMassG)
            .map((row) => ({
              ...row,
              massLossPercent: calculateFreezeThawMassLoss(row.initialDryMassG, row.finalDryMassG)
            }));
          const massLossValues = specimens.map((row) => row.massLossPercent);
          const freezeThawTest: AggregateFreezeThawTest = {
            id: previous.aggregateFreezeThawTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            totalCycles: input.totalCycles,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            specimens,
            averageMassLossPercent: averageNumbers(massLossValues, 2),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateFreezeThawTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateFreezeThawTests: existing
              ? previous.aggregateFreezeThawTests.map((row) => (row.testId === testId ? freezeThawTest : row))
              : [freezeThawTest, ...previous.aggregateFreezeThawTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Freeze-thaw aggregate data saved.");
          return draft;
        });
      },
      saveAggregateAcvTest(testId, input) {
        setState((previous) => {
          const acvRun = (run: AggregateAcvInput["test1"]) => ({
            ...run,
            acvPercent: calculateAcvPercent(run.totalDrySampleMassG, run.passingTwoPointThirtySixMmMassG)
          });
          const test1 = acvRun(input.test1);
          const test2 = acvRun(input.test2);
          const acvValues = [test1, test2]
            .filter((run) => run.totalDrySampleMassG || run.passingTwoPointThirtySixMmMassG)
            .map((run) => run.acvPercent);
          const acvTest: AggregateAcvTest = {
            id: previous.aggregateAcvTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            test1,
            test2,
            averageAcvPercent: averageNumbers(acvValues, 2),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateAcvTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateAcvTests: existing
              ? previous.aggregateAcvTests.map((row) => (row.testId === testId ? acvTest : row))
              : [acvTest, ...previous.aggregateAcvTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate crushing value data saved.");
          return draft;
        });
      },
      saveAggregateDensityAbsorptionTest(testId, input) {
        setState((previous) => {
          const specimens = input.specimens
            .filter((row) => row.specimenCode || row.ovenDryMassG || row.ssdMassG || row.pycnometerWaterMassG || row.pycnometerWaterSampleMassG)
            .map((row) => ({
              ...row,
              ...calculateDensityAbsorption(row)
            }));
          const densityTest: AggregateDensityAbsorptionTest = {
            id: previous.aggregateDensityAbsorptionTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            testMethod: input.testMethod,
            specimens,
            averageAbsorptionPercent: averageNumbers(specimens.map((row) => row.absorptionPercent), 2),
            averageOvenDryBulkDensity: averageNumbers(specimens.map((row) => row.ovenDryBulkDensity), 3),
            averageSsdBulkDensity: averageNumbers(specimens.map((row) => row.ssdBulkDensity), 3),
            averageApparentDensity: averageNumbers(specimens.map((row) => row.apparentDensity), 3),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateDensityAbsorptionTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateDensityAbsorptionTests: existing
              ? previous.aggregateDensityAbsorptionTests.map((row) => (row.testId === testId ? densityTest : row))
              : [densityTest, ...previous.aggregateDensityAbsorptionTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate particle density and absorption data saved.");
          return draft;
        });
      },
      saveAggregateFillerDensityTest(testId, input) {
        setState((previous) => {
          const runs = input.runs
            .filter((row) => row.emptyPycnometerMassG || row.pycnometerSampleMassG || row.pycnometerSampleLiquidMassG || row.pycnometerVolumeMl)
            .map((row) => ({
              ...row,
              particleDensity: calculateFillerParticleDensity(row)
            }));
          const fillerDensityTest: AggregateFillerDensityTest = {
            id: previous.aggregateFillerDensityTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            testMethod: input.testMethod,
            runs,
            averageParticleDensity: averageNumbers(runs.map((row) => row.particleDensity), 3),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateFillerDensityTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateFillerDensityTests: existing
              ? previous.aggregateFillerDensityTests.map((row) => (row.testId === testId ? fillerDensityTest : row))
              : [fillerDensityTest, ...previous.aggregateFillerDensityTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Filler specific density data saved.");
          return draft;
        });
      },
      saveAggregateShapeIndexTest(testId, input) {
        setState((previous) => {
          const rows = input.rows
            .filter((row) => row.fractionLabel || row.testPortionMassG || row.nonCubicalMassG)
            .map((row) => ({
              ...row,
              shapeIndexPercent: calculateShapeIndex(row.testPortionMassG, row.nonCubicalMassG)
            }));
          const totalTestPortionMassG = rows.reduce((sum, row) => sum + row.testPortionMassG, 0);
          const totalNonCubicalMassG = rows.reduce((sum, row) => sum + row.nonCubicalMassG, 0);
          const shapeIndexTest: AggregateShapeIndexTest = {
            id: previous.aggregateShapeIndexTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            rows,
            totalTestPortionMassG,
            totalNonCubicalMassG,
            shapeIndexPercent: calculateShapeIndex(totalTestPortionMassG, totalNonCubicalMassG),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateShapeIndexTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateShapeIndexTests: existing
              ? previous.aggregateShapeIndexTests.map((row) => (row.testId === testId ? shapeIndexTest : row))
              : [shapeIndexTest, ...previous.aggregateShapeIndexTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate shape index data saved.");
          return draft;
        });
      },
      saveAggregateFlakinessIndexTest(testId, input) {
        setState((previous) => {
          const rows = input.rows
            .filter((row) => row.fractionLabel || row.retainedMassesG.some(Boolean) || row.passingBarSieveMassesG.some(Boolean))
            .map((row) => ({
              ...row,
              flakinessPercentages: [0, 1, 2].map((index) =>
                calculateFlakinessPercent(row.retainedMassesG[index] ?? 0, row.passingBarSieveMassesG[index] ?? 0)
              )
            }));
          const totalRetainedMassesG = [0, 1, 2].map((index) => rows.reduce((sum, row) => sum + (row.retainedMassesG[index] ?? 0), 0));
          const totalPassingMassesG = [0, 1, 2].map((index) => rows.reduce((sum, row) => sum + (row.passingBarSieveMassesG[index] ?? 0), 0));
          const sampleFlakinessPercentages = [0, 1, 2].map((index) => calculateFlakinessPercent(totalRetainedMassesG[index], totalPassingMassesG[index]));
          const averageRetainedMassG = averageNumbers(totalRetainedMassesG, 1);
          const averagePassingMassG = averageNumbers(totalPassingMassesG, 1);
          const flakinessTest: AggregateFlakinessIndexTest = {
            id: previous.aggregateFlakinessIndexTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            initialSampleMassesG: input.initialSampleMassesG,
            discardedMassesG: input.discardedMassesG,
            rows,
            totals: {
              sampleMassBeforeBarSieveG: [0, 1, 2].map((index) => (input.initialSampleMassesG[index] ?? 0) - (input.discardedMassesG[index] ?? 0)),
              totalRetainedMassesG,
              totalPassingMassesG,
              sampleFlakinessPercentages,
              averageRetainedMassG,
              averagePassingMassG,
              averageFlakinessPercent: averageNumbers(sampleFlakinessPercentages, 1),
              finalFlakinessIndexPercent: calculateFlakinessPercent(averageRetainedMassG, averagePassingMassG)
            },
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateFlakinessIndexTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateFlakinessIndexTests: existing
              ? previous.aggregateFlakinessIndexTests.map((row) => (row.testId === testId ? flakinessTest : row))
              : [flakinessTest, ...previous.aggregateFlakinessIndexTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate flakiness index data saved.");
          return draft;
        });
      },
      saveAggregateElongationIndexTest(testId, input) {
        setState((previous) => {
          const rows = input.rows
            .filter((row) => row.fractionLabel || row.retainedMassG || row.elongatedMassG)
            .map((row) => ({
              ...row,
              elongationPercent: calculateShapeIndex(row.retainedMassG, row.elongatedMassG)
            }));
          const totalRetainedMassG = rows.reduce((sum, row) => sum + row.retainedMassG, 0);
          const totalElongatedMassG = rows.reduce((sum, row) => sum + row.elongatedMassG, 0);
          const elongationTest: AggregateElongationIndexTest = {
            id: previous.aggregateElongationIndexTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            rows,
            totalRetainedMassG,
            totalElongatedMassG,
            elongationIndexPercent: calculateShapeIndex(totalRetainedMassG, totalElongatedMassG),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateElongationIndexTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateElongationIndexTests: existing
              ? previous.aggregateElongationIndexTests.map((row) => (row.testId === testId ? elongationTest : row))
              : [elongationTest, ...previous.aggregateElongationIndexTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate elongation index data saved.");
          return draft;
        });
      },
      saveAggregateBulkDensityTest(testId, input) {
        setState((previous) => {
          const runs = input.runs
            .filter((row) => row.containerCapacityM3 || row.emptyContainerMassKg || row.containerSampleMassKg)
            .map((row) => {
              const bulkDensityMgM3 = calculateBulkDensity(row.containerSampleMassKg, row.emptyContainerMassKg, row.containerCapacityM3);
              return {
                ...row,
                bulkDensityMgM3,
                voidsPercent: calculateVoidsPercent(input.specificDensityMgM3, bulkDensityMgM3)
              };
            });
          const bulkDensityTest: AggregateBulkDensityTest = {
            id: previous.aggregateBulkDensityTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            specificDensityMgM3: input.specificDensityMgM3,
            runs,
            averageBulkDensityMgM3: averageNumbers(runs.map((row) => row.bulkDensityMgM3), 3),
            averageVoidsPercent: averageNumbers(runs.map((row) => row.voidsPercent), 1),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateBulkDensityTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateBulkDensityTests: existing
              ? previous.aggregateBulkDensityTests.map((row) => (row.testId === testId ? bulkDensityTest : row))
              : [bulkDensityTest, ...previous.aggregateBulkDensityTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate bulk density data saved.");
          return draft;
        });
      },
      saveAggregateSandEquivalentTest(testId, input) {
        setState((previous) => {
          const moistureRuns = input.moistureRuns
            .filter((row) => row.emptyDishMassG || row.dishWetSampleMassG || row.dishDrySampleMassG)
            .map((row) => ({
              ...row,
              moisturePercent: calculateMoisturePercent(row.emptyDishMassG, row.dishWetSampleMassG, row.dishDrySampleMassG)
            }));
          const finesRuns = input.finesRuns
            .filter((row) => row.sampleMassG || row.retained0063MassG)
            .map((row) => ({
              ...row,
              finesPercent: calculateFinesPercent(row.sampleMassG, row.retained0063MassG)
            }));
          const sandRuns = input.sandRuns
            .filter((row) => row.materialMassG || row.clayReadingMm || row.sandReadingMm)
            .map((row) => ({
              ...row,
              sandEquivalent: calculateSandEquivalent(row.clayReadingMm, row.sandReadingMm)
            }));
          const averageMoisturePercent = averageNumbers(moistureRuns.map((row) => row.moisturePercent), 1);
          const averageFinesPercent = averageNumbers(finesRuns.map((row) => row.finesPercent), 1);
          const materialForTestG = averageFinesPercent > 10
            ? Math.round((1200 / averageFinesPercent) * (1 + averageMoisturePercent / 100) * 10) / 10
            : Math.round(((120 * (100 + averageMoisturePercent)) / 100) * 10) / 10;
          const sandEquivalentTest: AggregateSandEquivalentTest = {
            id: previous.aggregateSandEquivalentTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            moistureRuns,
            finesRuns,
            sandRuns,
            averageMoisturePercent,
            averageFinesPercent,
            materialForTestG,
            sandEquivalentValue: averageNumbers(sandRuns.map((row) => row.sandEquivalent), 0),
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateSandEquivalentTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateSandEquivalentTests: existing
              ? previous.aggregateSandEquivalentTests.map((row) => (row.testId === testId ? sandEquivalentTest : row))
              : [sandEquivalentTest, ...previous.aggregateSandEquivalentTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate sand equivalent data saved.");
          return draft;
        });
      },
      saveAggregateSoundnessTest(testId, input) {
        setState((previous) => {
          const runs = input.runs
            .filter((row) => row.sampleNo || row.initialMassG || row.finalRetainedMassG)
            .map((row) => ({
              ...row,
              cycles: row.cycles || input.cycles,
              soundnessLossPercent: calculateSoundnessLossPercent(row.initialMassG, row.finalRetainedMassG)
            }));
          const soundnessTest: AggregateSoundnessTest = {
            id: previous.aggregateSoundnessTests.find((row) => row.testId === testId)?.id ?? crypto.randomUUID(),
            testId,
            testStartDate: input.testStartDate,
            testEndDate: input.testEndDate,
            temperature: input.temperature,
            humidity: input.humidity,
            testingLocation: input.testingLocation,
            technicianName: input.technicianName,
            checkedBy: input.checkedBy,
            notes: input.notes,
            cycles: input.cycles,
            runs,
            averageSoundnessLossPercent: averageNumbers(runs.map((row) => row.soundnessLossPercent), 2),
            totalParticlesBefore: input.totalParticlesBefore,
            crackedParticles: input.crackedParticles,
            brokenParticles: input.brokenParticles,
            flakedParticles: input.flakedParticles,
            totalParticlesAfter: input.totalParticlesAfter,
            createdAt: new Date().toISOString()
          };
          const existing = previous.aggregateSoundnessTests.some((row) => row.testId === testId);
          const draft: LabState = {
            ...previous,
            aggregateSoundnessTests: existing
              ? previous.aggregateSoundnessTests.map((row) => (row.testId === testId ? soundnessTest : row))
              : [soundnessTest, ...previous.aggregateSoundnessTests],
            tests: previous.tests.map((test) => (test.id === testId ? { ...test, status: "In Progress" } : test)),
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "test_data_saved", "test", testId, "Aggregate soundness data saved.");
          return draft;
        });
      },
      markTestCompleted(testId) {
        setState((previous) => {
          const test = previous.tests.find((row) => row.id === testId);
          if (!test) return previous;
          const draft: LabState = {
            ...previous,
            tests: previous.tests.map((row) =>
              row.id === testId
                ? { ...row, status: "Completed", completedAt: new Date().toISOString(), completedBy: currentUserId }
                : row
            ),
            samples: previous.samples.map((sample) => {
              if (sample.id !== test.sampleId) return sample;
              const sampleTests = previous.tests.map((row) =>
                row.id === testId ? { ...row, status: "Completed" as const } : row
              ).filter((row) => row.sampleId === test.sampleId);
              const finishedCount = sampleTests.filter((row) => isTestingFinished(row.status)).length;
              const status = finishedCount === sampleTests.length ? "Completed" : "Partially Tested";
              return { ...sample, status };
            }),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addNotification(draft, "u-doc", "Report ready to prepare", `${test.testCode} has been completed.`, testId);
          addAudit(draft, "test_completed", "test", testId, `${test.testCode} marked as completed.`);
          return draft;
        });
      },
      generateReport(testId) {
        const reportId = crypto.randomUUID();
        setState((previous) => {
          const test = previous.tests.find((row) => row.id === testId);
          if (!test) return previous;
          const existing = previous.reports.find((row) => row.testId === testId);
          if (existing) return previous;
          const concrete = previous.concreteTests.find((row) => row.testId === testId);
          const concreteWater = previous.concreteWaterPenetrationTests.find((row) => row.testId === testId);
          const concreteFlexural = previous.concreteFlexuralTests.find((row) => row.testId === testId);
          const concreteDensity = previous.concreteDensityTests.find((row) => row.testId === testId);
          const concreteIndirectTensile = previous.concreteIndirectTensileTests.find((row) => row.testId === testId);
          const thermalInsulation = previous.thermalInsulationTests.find((row) => row.testId === testId);
          const cementConsistency = previous.cementConsistencyTests.find((row) => row.testId === testId);
          const cementStrength = previous.cementStrengthTests.find((row) => row.testId === testId);
          const cementBlaine = previous.cementBlaineTests.find((row) => row.testId === testId);
          const steel = previous.steelTests.find((row) => row.testId === testId);
          const aggregate = previous.aggregateTests.find((row) => row.testId === testId);
          const aggregateChemical = previous.aggregateChemicalTests.find((row) => row.testId === testId);
          const aggregateLosAngeles = previous.aggregateLosAngelesTests.find((row) => row.testId === testId);
          const aggregateFreezeThaw = previous.aggregateFreezeThawTests.find((row) => row.testId === testId);
          const aggregateAcv = previous.aggregateAcvTests.find((row) => row.testId === testId);
          const aggregateDensity = previous.aggregateDensityAbsorptionTests.find((row) => row.testId === testId);
          const aggregateFillerDensity = previous.aggregateFillerDensityTests.find((row) => row.testId === testId);
          const aggregateShapeIndex = previous.aggregateShapeIndexTests.find((row) => row.testId === testId);
          const aggregateFlakiness = previous.aggregateFlakinessIndexTests.find((row) => row.testId === testId);
          const aggregateElongation = previous.aggregateElongationIndexTests.find((row) => row.testId === testId);
          const aggregateBulkDensity = previous.aggregateBulkDensityTests.find((row) => row.testId === testId);
          const aggregateSandEquivalent = previous.aggregateSandEquivalentTests.find((row) => row.testId === testId);
          const aggregateSoundness = previous.aggregateSoundnessTests.find((row) => row.testId === testId);
          const reportGroups = steel?.specimens.length
            ? groupSteelSpecimensByDiameter(steel)
            : concreteWater || concreteFlexural || concreteDensity || concreteIndirectTensile || thermalInsulation || cementConsistency || cementStrength || cementBlaine || aggregate || aggregateChemical || aggregateLosAngeles || aggregateFreezeThaw || aggregateAcv || aggregateDensity || aggregateFillerDensity || aggregateShapeIndex || aggregateFlakiness || aggregateElongation || aggregateBulkDensity || aggregateSandEquivalent || aggregateSoundness
              ? [[previous.samples.find((sample) => sample.id === test.sampleId)?.sampleCode ?? test.testCode]]
              : concrete?.specimens?.length
                ? chunk(concrete.specimens.map((specimen) => specimen.specimenCode), 3)
                : [[previous.samples.find((sample) => sample.id === test.sampleId)?.sampleCode ?? test.testCode]];
          const specimenCount = reportGroups.reduce((sum, group) => sum + group.length, 0);
          const reports: Report[] = reportGroups.map((codes, index) => ({
            id: index === 0 ? reportId : crypto.randomUUID(),
            reportNumber: nextNumber("LAB-R", previous.reports.length + index),
            testId,
            sampleId: test.sampleId,
            clientId: test.clientId,
            projectId: test.projectId,
            specimenCodes: codes,
            reportSequence: index + 1,
            totalReports: reportGroups.length,
            reportStatus: "Report Drafted",
            draftedBy: currentUserId,
            createdAt: new Date().toISOString()
          }));
          const draft: LabState = {
            ...previous,
            reports: [...reports, ...previous.reports],
            tests: previous.tests.map((row) => (row.id === testId ? { ...row, status: "Report Drafted" } : row)),
            auditLog: [...previous.auditLog]
          };
          addAudit(
            draft,
            "report_generated",
            "test",
            testId,
            `${reports.length} draft report${reports.length === 1 ? "" : "s"} generated for ${specimenCount} specimen${specimenCount === 1 ? "" : "s"}.`
          );
          return draft;
        });
        return reportId;
      },
      submitReport(reportId) {
        setState((previous) => {
          const report = previous.reports.find((row) => row.id === reportId);
          if (!report) return previous;
          const draft: LabState = {
            ...previous,
            reports: previous.reports.map((row) =>
              row.id === reportId ? { ...row, reportStatus: "Pending Approval", checkedBy: currentUserId } : row
            ),
            tests: previous.tests.map((row) => (row.id === report.testId ? { ...row, status: "Pending Approval" } : row)),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addNotification(draft, "u-chief", "Report pending approval", `${report.reportNumber} is ready for review.`, report.testId, reportId);
          addAudit(draft, "report_submitted", "report", reportId, `${report.reportNumber} submitted for approval.`);
          return draft;
        });
      },
      approveReport(reportId) {
        setState((previous) => {
          const report = previous.reports.find((row) => row.id === reportId);
          if (!report) return previous;
          const draft: LabState = {
            ...previous,
            reports: previous.reports.map((row) =>
              row.id === reportId
                ? { ...row, reportStatus: "Approved", approvedBy: currentUserId, approvedAt: new Date().toISOString() }
                : row
            ),
            tests: previous.tests.map((row) => (row.id === report.testId ? { ...row, status: "Approved" } : row)),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addNotification(draft, "u-doc", "Report approved", `${report.reportNumber} is ready to issue.`, report.testId, reportId);
          addAudit(draft, "report_approved", "report", reportId, `${report.reportNumber} approved.`);
          return draft;
        });
      },
      rejectReport(reportId, comments) {
        setState((previous) => {
          const report = previous.reports.find((row) => row.id === reportId);
          if (!report) return previous;
          const draft: LabState = {
            ...previous,
            reports: previous.reports.map((row) =>
              row.id === reportId
                ? { ...row, reportStatus: "Rejected", rejectedBy: currentUserId, rejectionComments: comments }
                : row
            ),
            tests: previous.tests.map((row) => (row.id === report.testId ? { ...row, status: "Rejected" } : row)),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addNotification(draft, "u-doc", "Report rejected", comments || `${report.reportNumber} requires correction.`, report.testId, reportId);
          addAudit(draft, "report_rejected", "report", reportId, `${report.reportNumber} rejected.`);
          return draft;
        });
      },
      issueReport(reportId, clientEmail, notes) {
        setState((previous) => {
          const report = previous.reports.find((row) => row.id === reportId);
          if (!report) return previous;
          const draft: LabState = {
            ...previous,
            reports: previous.reports.map((row) =>
              row.id === reportId
                ? { ...row, reportStatus: "Issued", issuedBy: currentUserId, issuedAt: new Date().toISOString(), clientEmail }
                : row
            ),
            tests: previous.tests.map((row) => (row.id === report.testId ? { ...row, status: "Issued", notes } : row)),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addAudit(draft, "report_issued", "report", reportId, `${report.reportNumber} issued to ${clientEmail}.`);
          return draft;
        });
      },
      createProcedureRevision(input) {
        const revisionId = crypto.randomUUID();
        setState((previous) => {
          const procedure = previous.procedures.find((row) => row.id === input.procedureId);
          if (!procedure) return previous;
          const currentRevision = previous.procedureRevisions.find((row) => row.id === procedure.currentRevisionId);
          const fileUrl = input.fileUrl || currentRevision?.fileUrl || "";
          const revision = {
            id: revisionId,
            procedureId: input.procedureId,
            revision: nextProcedureRevision(input.procedureId, previous.procedureRevisions),
            status: "Draft" as const,
            fileName: input.fileName || `${procedure.code} revision ${nextProcedureRevision(input.procedureId, previous.procedureRevisions)}.doc`,
            fileUrl,
            pdfUrl: fileUrl.endsWith(".doc") ? fileUrl.replace(/\.doc$/, ".pdf") : currentRevision?.pdfUrl,
            assignedTo: input.assignedTo,
            preparedBy: currentUserId,
            changeSummary: input.changeSummary,
            createdAt: new Date().toISOString()
          };
          const draft: LabState = {
            ...previous,
            procedureRevisions: [revision, ...previous.procedureRevisions],
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addNotification(draft, input.assignedTo, "SOP revision assigned", `${procedure.code} ${procedure.title} has been assigned for revision.`, undefined);
          addAudit(draft, "procedure_revision_created", "procedure", procedure.id, `Revision ${revision.revision} created for ${procedure.code}.`);
          return draft;
        });
        return revisionId;
      },
      submitProcedureRevision(revisionId) {
        setState((previous) => {
          const revision = previous.procedureRevisions.find((row) => row.id === revisionId);
          const procedure = revision ? previous.procedures.find((row) => row.id === revision.procedureId) : undefined;
          if (!revision || !procedure) return previous;
          const draft: LabState = {
            ...previous,
            procedureRevisions: previous.procedureRevisions.map((row) =>
              row.id === revisionId ? { ...row, status: "In Review" as const, reviewedBy: "u-chief" } : row
            ),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          addNotification(draft, "u-chief", "SOP pending review", `${procedure.code} revision ${revision.revision} is ready for review.`, undefined);
          addAudit(draft, "procedure_revision_submitted", "procedure_revision", revisionId, `${procedure.code} revision ${revision.revision} submitted for review.`);
          return draft;
        });
      },
      approveProcedureRevision(revisionId) {
        setState((previous) => {
          const revision = previous.procedureRevisions.find((row) => row.id === revisionId);
          const procedure = revision ? previous.procedures.find((row) => row.id === revision.procedureId) : undefined;
          if (!revision || !procedure) return previous;
          const draft: LabState = {
            ...previous,
            procedures: previous.procedures.map((row) =>
              row.id === procedure.id ? { ...row, currentRevisionId: revisionId } : row
            ),
            procedureRevisions: previous.procedureRevisions.map((row) => {
              if (row.procedureId !== procedure.id) return row;
              if (row.id === revisionId) {
                return { ...row, status: "Current" as const, approvedBy: currentUserId, approvedAt: new Date().toISOString(), reviewedBy: currentUserId };
              }
              return row.status === "Current" ? { ...row, status: "Superseded" as const } : row;
            }),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          if (revision.assignedTo) addNotification(draft, revision.assignedTo, "SOP revision approved", `${procedure.code} revision ${revision.revision} is now current.`, undefined);
          addAudit(draft, "procedure_revision_approved", "procedure_revision", revisionId, `${procedure.code} revision ${revision.revision} approved and made current.`);
          return draft;
        });
      },
      rejectProcedureRevision(revisionId, comments) {
        setState((previous) => {
          const revision = previous.procedureRevisions.find((row) => row.id === revisionId);
          const procedure = revision ? previous.procedures.find((row) => row.id === revision.procedureId) : undefined;
          if (!revision || !procedure) return previous;
          const draft: LabState = {
            ...previous,
            procedureRevisions: previous.procedureRevisions.map((row) =>
              row.id === revisionId ? { ...row, status: "Rejected" as const, rejectedBy: currentUserId, rejectionComments: comments } : row
            ),
            notifications: [...previous.notifications],
            auditLog: [...previous.auditLog]
          };
          if (revision.assignedTo) addNotification(draft, revision.assignedTo, "SOP revision rejected", comments || `${procedure.code} revision ${revision.revision} requires correction.`, undefined);
          addAudit(draft, "procedure_revision_rejected", "procedure_revision", revisionId, `${procedure.code} revision ${revision.revision} rejected.`);
          return draft;
        });
      }
    };
  }, [state]);

  return <LabStoreContext.Provider value={value}>{children}</LabStoreContext.Provider>;
}

export function useLabStore() {
  const context = useContext(LabStoreContext);
  if (!context) throw new Error("useLabStore must be used inside LabStoreProvider");
  return context;
}
