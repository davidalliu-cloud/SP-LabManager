export type Role =
  | "Admin / Managing Director"
  | "Chief of Lab"
  | "Quality Manager"
  | "Operations Manager"
  | "Document Controller"
  | "Technician";

export type SampleType = string;

export type SampleStatus = "Registered" | "Pending Acceptance" | "Pending Testing" | "In Progress" | "Partially Tested" | "Completed" | "Delayed";

export type TestStatus =
  | "Pending"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Delayed"
  | "Report Drafted"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Issued";

export type ReportStatus = "Draft" | "Report Drafted" | "Pending Approval" | "Approved" | "Rejected" | "Issued";

export type Priority = "Normal" | "High" | "Urgent";

export type ProcedureRevisionStatus = "Current" | "Draft" | "In Review" | "Approved" | "Superseded" | "Rejected";

export interface LabUser {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  position?: string;
  phone?: string;
  workAreas?: string[];
  isActive?: boolean;
}

export interface Client {
  id: string;
  clientCode: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface Project {
  id: string;
  clientId: string;
  projectName: string;
  location: string;
  description?: string;
}

export interface Sample {
  id: string;
  sampleCode: string;
  clientId: string;
  projectId: string;
  sampleType: SampleType;
  sampleDescription: string;
  quantity: number;
  dateReceived: string;
  timeReceived: string;
  collectionMethod: "Delivered by client" | "Collected by lab technician";
  deliveredBy?: string;
  collectedBy?: string;
  requestedTestType: string;
  standard: string;
  requiredTestDate: string;
  reportDueDate: string;
  status: SampleStatus;
  testSchedules?: Array<{
    cubeCount: number;
    ageDays: number;
    requiredTestDate: string;
    reportDueDate: string;
  }>;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface LabTest {
  id: string;
  testCode: string;
  sampleId: string;
  clientId: string;
  projectId: string;
  testType: string;
  standard: string;
  assignedTechnician: string;
  cubeCount: number;
  scheduledAgeDays: number;
  requiredTestDate: string;
  dueDate: string;
  status: TestStatus;
  priority: Priority;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt: string;
}

export interface ConcreteCompressiveTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  castingDate: string;
  testDate: string;
  ageDays: number;
  cubeLength: number;
  cubeWidth: number;
  cubeHeight: number;
  weight: number;
  maximumLoadKn: number;
  loadedAreaMm2: number;
  compressiveStrengthMpa: number;
  failureType: string;
  machineUsed: string;
  technicianName: string;
  notes?: string;
  specimens?: ConcreteCubeSpecimen[];
  createdAt: string;
}

export interface ConcreteCubeSpecimen {
  specimenCode: string;
  ageDays: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  weightKg: number;
  maximumLoadKn: number;
  loadedAreaMm2: number;
  compressiveStrengthMpa: number;
  visualInspection: string;
  notes?: string;
}

export interface ConcreteWaterPenetrationTest {
  id: string;
  testId: string;
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
  specimens: WaterPenetrationSpecimen[];
  averagePenetrationMm: number;
  createdAt: string;
}

export interface WaterPenetrationSpecimen {
  specimenCode: string;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  maxPenetrationMm: number;
}

export interface ConcreteFlexuralTest {
  id: string;
  testId: string;
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
  specimens: FlexuralSpecimen[];
  averageFlexuralStrengthMpa: number;
  createdAt: string;
}

export interface ConcreteDensityTest {
  id: string;
  testId: string;
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
  specimens: ConcreteDensitySpecimen[];
  averageDensityKgM3: number;
  createdAt: string;
}

export interface ConcreteDensitySpecimen {
  specimenCode: string;
  massKg: number;
  volumeM3: number;
  waterMassKg?: number;
  airMassKg?: number;
  dryMassKg?: number;
  waterDensityKgM3?: number;
  densityKgM3: number;
}

export interface ConcreteIndirectTensileTest {
  id: string;
  testId: string;
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
  specimens: IndirectTensileSpecimen[];
  averageTensileStrengthMpa: number;
  createdAt: string;
}

export interface IndirectTensileSpecimen {
  specimenCode: string;
  contactLengthMm: number;
  crossSectionMm: number;
  maximumLoadN: number;
  tensileStrengthMpa: number;
  failureType: string;
}

export interface ThermalInsulationTest {
  id: string;
  testId: string;
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
  specimens: ThermalInsulationSpecimen[];
  averages: ThermalInsulationAverages;
  createdAt: string;
}

export interface ThermalInsulationSpecimen {
  specimenCode: string;
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  massKg: number;
  volumeM3: number;
  apparentDensityKgM3: number;
  absorptionLengthMm: number;
  absorptionWidthMm: number;
  massBeforeImmersionKg: number;
  massAfterImmersionKg: number;
  waterAbsorptionKgM2: number;
  compressionLengthMm: number;
  compressionWidthMm: number;
  initialThicknessMm: number;
  displacementMm: number;
  deformationPercent: number;
  maximumForceN: number;
  forceAtTenPercentN: number;
  compressiveStressKpa: number;
  compressiveStressAtTenPercentKpa: number;
}

export interface ThermalInsulationAverages {
  lengthMm: number;
  widthMm: number;
  thicknessMm: number;
  apparentDensityKgM3: number;
  waterAbsorptionKgM2: number;
  compressiveStressKpa: number;
}

export interface CementConsistencyTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  consistency: CementConsistencyValues;
  setting: CementSettingValues;
  expansion: CementExpansionValues;
  createdAt: string;
}

export interface CementConsistencyValues {
  cementMassG: number;
  waterMassG: number;
  waterDemandPercent: number;
  pasteStartTime: string;
  probePenetrationMm: number;
}

export interface CementSettingValues {
  startTime: string;
  initialSettingTime: string;
  initialSettingMinutes: number;
  initialVicatReadingMm: number;
  finalSettingTime: string;
  finalSettingMinutes: number;
  finalVicatReadingMm: number;
}

export interface CementExpansionValues {
  readingAfter24hMm: number;
  readingAfterBoilingMm: number;
  readingAtAmbientMm: number;
  expansionMm: number;
}

export interface CementStrengthTest {
  id: string;
  testId: string;
  castingDate?: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: CementStrengthSpecimen[];
  averages: CementStrengthAverages;
  createdAt: string;
}

export interface CementStrengthSpecimen {
  rowNo: number;
  ageDays: number;
  testType: "Flexural" | "Compressive";
  surfaceAreaMm2: number;
  testDate?: string;
  loadKn: number;
  strengthMpa: number;
}

export interface CementStrengthAverages {
  flexural2DayMpa: number;
  flexural7DayMpa: number;
  flexural28DayMpa: number;
  compressive2DayMpa: number;
  compressive7DayMpa: number;
  compressive28DayMpa: number;
}

export interface CementBlaineTest {
  id: string;
  testId: string;
  method: "BS EN" | "ASTM";
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  density?: CementBlaineDensityValues;
  bsEn?: CementBlaineBsEnValues;
  astm?: CementBlaineAstmValues;
  specificSurfaceCm2G: number;
  createdAt: string;
}

export interface CementBlaineDensityValues {
  sampleMassG: number;
  initialReadingMl: number;
  finalReadingMl: number;
  displacedMassG: number;
  waterEquivalentMassG: number;
  waterTemperatureC: number;
  waterDensityGcm3: number;
  cementDensityGcm3: number;
}

export interface CementBlaineBsEnValues {
  internalCellHeightMm: number;
  plungerLengthMm: number;
  cellRadiusMm: number;
  bedVolumeCm3: number;
  porosity: number;
  sampleMassG: number;
  referenceSurfaceCm2G: number;
  referenceDensityGcm3: number;
  referenceTimeS: number;
  referenceAirViscosity: number;
  constantK: number;
  measuredTimeS: number;
  airViscosity: number;
}

export interface CementBlaineAstmValues {
  emptyCellMercuryMassG: number;
  fullCellMercuryMassG: number;
  mercuryDensityGcm3: number;
  bedVolumeCm3: number;
  referenceDensityGcm3: number;
  porosity: number;
  sampleMassG: number;
  referenceSurfaceCm2G: number;
  referenceTimeS: number;
  constantK: number;
  measuredTimeS: number;
}

export interface FlexuralSpecimen {
  specimenCode: string;
  widthMm: number;
  lengthMm: number;
  thicknessMm: number;
  weightKg: number;
  spanMm: number;
  maximumLoadKn: number;
  volumeM3: number;
  apparentDensityKgM3: number;
  flexuralStrengthMpa: number;
}

export interface SteelTensileTest {
  id: string;
  testId: string;
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
  specimens: SteelTensileSpecimen[];
  createdAt: string;
}

export interface SteelTensileSpecimen {
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
  crossSectionalAreaMm2: number;
  yieldStrengthMpa: number;
  tensileStrengthMpa: number;
  elongationPercent: number;
  unitWeightKgPerM: number;
  finalCrossSectionalAreaMm2: number;
  reductionOfAreaPercent: number;
  notes?: string;
}

export interface AggregateGradationTest {
  id: string;
  testId: string;
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
  rows: AggregateGradationRow[];
  createdAt: string;
}

export interface AggregateGradationRow {
  sieveSizeMm: number;
  retainedMassG: number;
  cumulativeRetainedMassG: number;
  cumulativeRetainedPercent: number;
  cumulativePassingPercent: number;
}

export interface AggregateChemicalTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  chlorideTest1: ChemicalChlorideRun;
  chlorideTest2: ChemicalChlorideRun;
  waterSulfateTest1: WaterSulfateRun;
  waterSulfateTest2: WaterSulfateRun;
  acidSulfateTest1: AcidSulfateRun;
  acidSulfateTest2: AcidSulfateRun;
  results: AggregateChemicalResults;
  createdAt: string;
}

export interface ChemicalChlorideRun {
  silverNitrateVolumeMl: number;
  waterAggregateRatio: number;
  chloridePercent: number;
}

export interface WaterSulfateRun {
  emptyCrucibleMassG: number;
  waterAggregateRatio: number;
  cruciblePlusCalcinedMassG: number;
  calcinedMaterialMassG: number;
  sulfateSo3Percent: number;
}

export interface AcidSulfateRun {
  sampleMassG: number;
  emptyCrucibleMassG: number;
  cruciblePlusCalcinedMassG: number;
  calcinedMaterialMassG: number;
  sulfateSo3Percent: number;
  sulfateSo4Percent: number;
}

export interface AggregateChemicalResults {
  chloridePercent: number;
  waterSolubleSulfateSo3Percent: number;
  acidSolubleSulfateSo3Percent: number;
  acidSolubleSulfateSo4Percent: number;
  totalSulfurPercent: number;
  lossOnIgnitionPercent: number;
}

export interface AggregateLosAngelesTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  rows: LosAngelesFractionRow[];
  retainedOnOnePointSixMmG: number;
  passingOnePointSixMmG: number;
  totalMassG: number;
  fragmentationLossPercent: number;
  createdAt: string;
}

export interface LosAngelesFractionRow {
  passingSieveMm: number;
  retainingSieveMm: number;
  sphereCount: number;
  fractionMassG: number;
}

export interface AggregateFreezeThawTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  totalCycles: number;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specimens: FreezeThawSpecimen[];
  averageMassLossPercent: number;
  createdAt: string;
}

export interface AggregateAcvTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  test1: AcvRun;
  test2: AcvRun;
  averageAcvPercent: number;
  createdAt: string;
}

export interface AggregateDensityAbsorptionTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  testMethod: string;
  specimens: DensityAbsorptionSpecimen[];
  averageAbsorptionPercent: number;
  averageOvenDryBulkDensity: number;
  averageSsdBulkDensity: number;
  averageApparentDensity: number;
  createdAt: string;
}

export interface AggregateFillerDensityTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  testMethod: string;
  runs: FillerDensityRun[];
  averageParticleDensity: number;
  createdAt: string;
}

export interface AggregateShapeIndexTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  rows: ShapeIndexRow[];
  totalTestPortionMassG: number;
  totalNonCubicalMassG: number;
  shapeIndexPercent: number;
  createdAt: string;
}

export interface AggregateFlakinessIndexTest {
  id: string;
  testId: string;
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
  rows: FlakinessIndexRow[];
  totals: FlakinessIndexTotals;
  createdAt: string;
}

export interface AggregateElongationIndexTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  rows: ElongationIndexRow[];
  totalRetainedMassG: number;
  totalElongatedMassG: number;
  elongationIndexPercent: number;
  createdAt: string;
}

export interface ElongationIndexRow {
  fractionLabel: string;
  retainedMassG: number;
  elongatedMassG: number;
  elongationPercent: number;
}

export interface AggregateBulkDensityTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  specificDensityMgM3: number;
  runs: BulkDensityRun[];
  averageBulkDensityMgM3: number;
  averageVoidsPercent: number;
  createdAt: string;
}

export interface BulkDensityRun {
  containerCapacityM3: number;
  emptyContainerMassKg: number;
  containerSampleMassKg: number;
  bulkDensityMgM3: number;
  voidsPercent: number;
}

export interface AggregateSandEquivalentTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  moistureRuns: SandEquivalentMoistureRun[];
  finesRuns: SandEquivalentFinesRun[];
  sandRuns: SandEquivalentRun[];
  averageMoisturePercent: number;
  averageFinesPercent: number;
  materialForTestG: number;
  sandEquivalentValue: number;
  createdAt: string;
}

export interface AggregateSoundnessTest {
  id: string;
  testId: string;
  testStartDate?: string;
  testEndDate?: string;
  temperature?: string;
  humidity?: string;
  testingLocation?: string;
  technicianName: string;
  checkedBy?: string;
  notes?: string;
  cycles: number;
  runs: SoundnessRun[];
  averageSoundnessLossPercent: number;
  totalParticlesBefore: number;
  crackedParticles: number;
  brokenParticles: number;
  flakedParticles: number;
  totalParticlesAfter: number;
  createdAt: string;
}

export interface SoundnessRun {
  sampleNo: string;
  sieveSizeMm: string;
  initialMassG: number;
  finalRetainedMassG: number;
  cycles: number;
  soundnessLossPercent: number;
}

export interface SandEquivalentMoistureRun {
  emptyDishMassG: number;
  dishWetSampleMassG: number;
  dishDrySampleMassG: number;
  moisturePercent: number;
}

export interface SandEquivalentFinesRun {
  sampleMassG: number;
  retained0063MassG: number;
  finesPercent: number;
}

export interface SandEquivalentRun {
  materialMassG: number;
  clayReadingMm: number;
  sandReadingMm: number;
  sandEquivalent: number;
}

export interface FlakinessIndexRow {
  fractionLabel: string;
  sieveOpeningMm: number;
  barSieveMm: number;
  retainedMassesG: number[];
  passingBarSieveMassesG: number[];
  flakinessPercentages: number[];
}

export interface FlakinessIndexTotals {
  sampleMassBeforeBarSieveG: number[];
  totalRetainedMassesG: number[];
  totalPassingMassesG: number[];
  sampleFlakinessPercentages: number[];
  averageRetainedMassG: number;
  averagePassingMassG: number;
  averageFlakinessPercent: number;
  finalFlakinessIndexPercent: number;
}

export interface ShapeIndexRow {
  fractionLabel: string;
  testPortionMassG: number;
  nonCubicalMassG: number;
  shapeIndexPercent: number;
}

export interface FillerDensityRun {
  runLabel: string;
  temperatureC: number;
  liquidDensity: number;
  emptyPycnometerMassG: number;
  pycnometerSampleMassG: number;
  pycnometerSampleLiquidMassG: number;
  pycnometerVolumeMl: number;
  particleDensity: number;
}

export interface DensityAbsorptionSpecimen {
  specimenCode: string;
  waterTemperatureC: number;
  waterDensity: number;
  ovenDryMassG: number;
  ssdMassG: number;
  pycnometerWaterMassG: number;
  pycnometerWaterSampleMassG: number;
  absorptionPercent: number;
  ovenDryBulkDensity: number;
  ssdBulkDensity: number;
  apparentDensity: number;
}

export interface AcvRun {
  totalDrySampleMassG: number;
  passingTwoPointThirtySixMmMassG: number;
  acvPercent: number;
}

export interface FreezeThawSpecimen {
  specimenCode: string;
  maximumAggregateSizeMm: number;
  initialDryMassG: number;
  washingSieveSizeMm: number;
  finalDryMassG: number;
  massLossPercent: number;
  particlesBefore: number;
  splitParticles: number;
  crackedParticles: number;
  flakedParticles: number;
  particlesAfter: number;
}

export interface Report {
  id: string;
  reportNumber: string;
  testId: string;
  sampleId: string;
  clientId: string;
  projectId: string;
  specimenCodes: string[];
  reportSequence: number;
  totalReports: number;
  reportStatus: ReportStatus;
  draftedBy: string;
  checkedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectionComments?: string;
  issuedBy?: string;
  issuedAt?: string;
  clientEmail?: string;
  pdfUrl?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  relatedTestId?: string;
  relatedReportId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  createdAt: string;
}

export interface ProcedureDocument {
  id: string;
  category: string;
  code: string;
  title: string;
  testName: string;
  currentRevisionId: string;
  ownerRole: Role;
  createdAt: string;
}

export interface ProcedureRevision {
  id: string;
  procedureId: string;
  revision: string;
  status: ProcedureRevisionStatus;
  fileName: string;
  fileUrl: string;
  pdfUrl?: string;
  effectiveDate?: string;
  assignedTo?: string;
  preparedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectionComments?: string;
  changeSummary?: string;
  createdAt: string;
}

export interface LabState {
  users: LabUser[];
  clients: Client[];
  projects: Project[];
  samples: Sample[];
  tests: LabTest[];
  concreteTests: ConcreteCompressiveTest[];
  concreteWaterPenetrationTests: ConcreteWaterPenetrationTest[];
  concreteFlexuralTests: ConcreteFlexuralTest[];
  concreteDensityTests: ConcreteDensityTest[];
  concreteIndirectTensileTests: ConcreteIndirectTensileTest[];
  thermalInsulationTests: ThermalInsulationTest[];
  cementConsistencyTests: CementConsistencyTest[];
  cementStrengthTests: CementStrengthTest[];
  cementBlaineTests: CementBlaineTest[];
  steelTests: SteelTensileTest[];
  aggregateTests: AggregateGradationTest[];
  aggregateChemicalTests: AggregateChemicalTest[];
  aggregateLosAngelesTests: AggregateLosAngelesTest[];
  aggregateFreezeThawTests: AggregateFreezeThawTest[];
  aggregateAcvTests: AggregateAcvTest[];
  aggregateDensityAbsorptionTests: AggregateDensityAbsorptionTest[];
  aggregateFillerDensityTests: AggregateFillerDensityTest[];
  aggregateShapeIndexTests: AggregateShapeIndexTest[];
  aggregateFlakinessIndexTests: AggregateFlakinessIndexTest[];
  aggregateElongationIndexTests: AggregateElongationIndexTest[];
  aggregateBulkDensityTests: AggregateBulkDensityTest[];
  aggregateSandEquivalentTests: AggregateSandEquivalentTest[];
  aggregateSoundnessTests: AggregateSoundnessTest[];
  reports: Report[];
  procedures: ProcedureDocument[];
  procedureRevisions: ProcedureRevision[];
  notifications: Notification[];
  auditLog: AuditLog[];
}
