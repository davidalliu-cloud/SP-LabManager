"use client";

import type { AdmixtureDryMaterialTest, AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { CementConsistencyReportPreview, CementStrengthReportPreview, CementBlaineReportPreview } from "./cement-reports";
import { AdmixtureDryMaterialReportPreview } from "./admixture-reports";
import { MortarReportPreview } from "./mortar-reports";
import { ConcreteCubeReportPreview } from "./concrete-cube-report";
import {
  ConcreteWaterPenetrationReportPreview,
  ConcreteFlexuralReportPreview,
  ConcreteDensityReportPreview,
  ConcreteIndirectTensileReportPreview,
  ConcreteCoreReportPreview
} from "./concrete-reports";
import { AsphaltReportPreview } from "./asphalt-reports";
import { ThermalInsulationReportPreview, SteelReportPreview } from "./thermal-steel-reports";
import {
  AggregateReportPreview,
  AggregateChemicalReportPreview,
  AggregateLosAngelesReportPreview,
  AggregateFreezeThawReportPreview,
  AggregateAcvReportPreview
} from "./aggregate-reports";
import {
  AggregateDensityReportPreview,
  AggregateFillerDensityReportPreview,
  AggregateSoundnessReportPreview,
  AggregateElongationReportPreview,
  AggregateBulkDensityReportPreview,
  AggregateSandEquivalentReportPreview,
  AggregateShapeIndexReportPreview,
  AggregateFlakinessReportPreview
} from "./aggregate-reports-2";

export function ReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concrete,
  concreteWater,
  concreteFlexural,
  concreteDensity,
  concreteIndirectTensile,
  concreteCore,
  asphalt,
  thermalInsulation,
  cementConsistency,
  cementStrength,
  cementBlaine,
  admixtureDryMaterial,
  mortar,
  steel,
  aggregate,
  aggregateChemical,
  aggregateLosAngeles,
  aggregateFreezeThaw,
  aggregateAcv,
  aggregateDensity,
  aggregateFillerDensity,
  aggregateShapeIndex,
  aggregateFlakiness,
  aggregateElongation,
  aggregateBulkDensity,
  aggregateSandEquivalent,
  aggregateSoundness
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concrete?: ConcreteCompressiveTest;
  concreteWater?: ConcreteWaterPenetrationTest;
  concreteFlexural?: ConcreteFlexuralTest;
  concreteDensity?: ConcreteDensityTest;
  concreteIndirectTensile?: ConcreteIndirectTensileTest;
  concreteCore?: ConcreteCoreTest;
  asphalt?: AsphaltTest;
  thermalInsulation?: ThermalInsulationTest;
  cementConsistency?: CementConsistencyTest;
  cementStrength?: CementStrengthTest;
  cementBlaine?: CementBlaineTest;
  admixtureDryMaterial?: AdmixtureDryMaterialTest;
  mortar?: MortarTest;
  steel?: SteelTensileTest;
  aggregate?: AggregateGradationTest;
  aggregateChemical?: AggregateChemicalTest;
  aggregateLosAngeles?: AggregateLosAngelesTest;
  aggregateFreezeThaw?: AggregateFreezeThawTest;
  aggregateAcv?: AggregateAcvTest;
  aggregateDensity?: AggregateDensityAbsorptionTest;
  aggregateFillerDensity?: AggregateFillerDensityTest;
  aggregateShapeIndex?: AggregateShapeIndexTest;
  aggregateFlakiness?: AggregateFlakinessIndexTest;
  aggregateElongation?: AggregateElongationIndexTest;
  aggregateBulkDensity?: AggregateBulkDensityTest;
  aggregateSandEquivalent?: AggregateSandEquivalentTest;
  aggregateSoundness?: AggregateSoundnessTest;
}) {
  if (thermalInsulation) {
    return <ThermalInsulationReportPreview report={report} test={test} sample={sample} client={client} project={project} thermalInsulation={thermalInsulation} />;
  }

  if (cementConsistency) {
    return <CementConsistencyReportPreview report={report} test={test} sample={sample} client={client} project={project} cementConsistency={cementConsistency} />;
  }

  if (cementStrength) {
    return <CementStrengthReportPreview report={report} test={test} sample={sample} client={client} project={project} cementStrength={cementStrength} />;
  }

  if (admixtureDryMaterial) {
    return <AdmixtureDryMaterialReportPreview report={report} test={test} sample={sample} client={client} project={project} admixture={admixtureDryMaterial} />;
  }

  if (cementBlaine) {
    return <CementBlaineReportPreview report={report} test={test} sample={sample} client={client} project={project} cementBlaine={cementBlaine} />;
  }

  if (mortar) {
    return <MortarReportPreview report={report} test={test} sample={sample} client={client} project={project} mortar={mortar} />;
  }

  if (concreteIndirectTensile) {
    return <ConcreteIndirectTensileReportPreview report={report} test={test} sample={sample} client={client} project={project} concreteIndirectTensile={concreteIndirectTensile} />;
  }

  if (concreteCore) {
    return <ConcreteCoreReportPreview report={report} test={test} sample={sample} client={client} project={project} concreteCore={concreteCore} />;
  }

  if (asphalt) {
    return <AsphaltReportPreview report={report} test={test} sample={sample} client={client} project={project} asphalt={asphalt} />;
  }

  if (concreteDensity) {
    return <ConcreteDensityReportPreview report={report} test={test} sample={sample} client={client} project={project} concreteDensity={concreteDensity} />;
  }

  if (concreteFlexural) {
    return <ConcreteFlexuralReportPreview report={report} test={test} sample={sample} client={client} project={project} concreteFlexural={concreteFlexural} />;
  }

  if (concreteWater) {
    return <ConcreteWaterPenetrationReportPreview report={report} test={test} sample={sample} client={client} project={project} concreteWater={concreteWater} />;
  }

  if (aggregateSoundness) {
    return <AggregateSoundnessReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateSoundness={aggregateSoundness} />;
  }

  if (aggregateSandEquivalent) {
    return <AggregateSandEquivalentReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateSandEquivalent={aggregateSandEquivalent} />;
  }

  if (aggregateBulkDensity) {
    return <AggregateBulkDensityReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateBulkDensity={aggregateBulkDensity} />;
  }

  if (aggregateElongation) {
    return <AggregateElongationReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateElongation={aggregateElongation} />;
  }

  if (aggregateFlakiness) {
    return <AggregateFlakinessReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateFlakiness={aggregateFlakiness} />;
  }

  if (aggregateShapeIndex) {
    return <AggregateShapeIndexReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateShapeIndex={aggregateShapeIndex} />;
  }

  if (aggregateFillerDensity) {
    return <AggregateFillerDensityReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateFillerDensity={aggregateFillerDensity} />;
  }

  if (aggregateDensity) {
    return <AggregateDensityReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateDensity={aggregateDensity} />;
  }

  if (aggregateAcv) {
    return <AggregateAcvReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateAcv={aggregateAcv} />;
  }

  if (aggregateFreezeThaw) {
    return <AggregateFreezeThawReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateFreezeThaw={aggregateFreezeThaw} />;
  }

  if (aggregateLosAngeles) {
    return <AggregateLosAngelesReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateLosAngeles={aggregateLosAngeles} />;
  }

  if (aggregateChemical) {
    return <AggregateChemicalReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregateChemical={aggregateChemical} />;
  }

  if (aggregate) {
    return <AggregateReportPreview report={report} test={test} sample={sample} client={client} project={project} aggregate={aggregate} />;
  }

  if (steel) {
    return <SteelReportPreview report={report} test={test} sample={sample} client={client} project={project} steel={steel} />;
  }

  return <ConcreteCubeReportPreview report={report} test={test} sample={sample} client={client} project={project} concrete={concrete} />;
}
