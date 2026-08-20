"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, SignaturePair } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function AggregateDensityReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateDensity
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateDensity: AggregateDensityAbsorptionTest;
}) {
  const sampleValues = (selector: (index: number) => number) => [selector(0), selector(1)];
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.2"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Particle density and water absorption"
      />

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing start" value={aggregateDensity.testStartDate} />
        <Info label="Testing end" value={aggregateDensity.testEndDate} />
        <Info label="Test method" value={aggregateDensity.testMethod || "Metoda me piknometer / Pycnometer method"} />
        <Info label="Test standard" value={test?.standard || "BS EN 1097-6:2022"} />
        <Info label="Lab location" value={aggregateDensity.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} />
        <Info label="Temperature" value={aggregateDensity.temperature} />
        <Info label="Relative humidity" value={aggregateDensity.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Test results / Rezultatet e testimit</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">No.</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2">Sample 1</th>
                <th className="px-3 py-2">Sample 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <DensityReportRow no="1" label="Temperature" unit="C" values={sampleValues((index) => aggregateDensity.specimens[index]?.waterTemperatureC ?? 0)} />
              <DensityReportRow no="2" label="Water density" unit="g/Lt" values={sampleValues((index) => aggregateDensity.specimens[index]?.waterDensity ?? 0)} />
              <DensityReportRow no="3" label="Mass of oven dry test portion in air [A]" unit="g" values={sampleValues((index) => aggregateDensity.specimens[index]?.ovenDryMassG ?? 0)} />
              <DensityReportRow no="4" label="Mass of saturated and surface dry aggregate in air [S]" unit="g" values={sampleValues((index) => aggregateDensity.specimens[index]?.ssdMassG ?? 0)} />
              <DensityReportRow no="5" label="Mass of pycnometer with water [B]" unit="g" values={sampleValues((index) => aggregateDensity.specimens[index]?.pycnometerWaterMassG ?? 0)} />
              <DensityReportRow no="6" label="Mass of pycnometer with water + aggregate [C]" unit="g" values={sampleValues((index) => aggregateDensity.specimens[index]?.pycnometerWaterSampleMassG ?? 0)} />
              <DensityReportRow no="7" label="Each sample absorption value" unit="%" values={sampleValues((index) => aggregateDensity.specimens[index]?.absorptionPercent ?? 0)} />
              <DensityReportRow no="8" label="Absorption average value" unit="%" values={[aggregateDensity.averageAbsorptionPercent]} />
              <DensityReportRow no="9" label="Oven dry bulk specific gravity for each sample" unit="Mg/m3" values={sampleValues((index) => aggregateDensity.specimens[index]?.ovenDryBulkDensity ?? 0)} />
              <DensityReportRow no="10" label="Oven dry bulk specific gravity average (Gsb)" unit="Mg/m3" values={[aggregateDensity.averageOvenDryBulkDensity]} />
              <DensityReportRow no="11" label="SSD bulk specific density for each sample" unit="Mg/m3" values={sampleValues((index) => aggregateDensity.specimens[index]?.ssdBulkDensity ?? 0)} />
              <DensityReportRow no="12" label="SSD bulk specific density average (Gsb SSD)" unit="Mg/m3" values={[aggregateDensity.averageSsdBulkDensity]} />
              <DensityReportRow no="13" label="Apparent particle density for each sample" unit="Mg/m3" values={sampleValues((index) => aggregateDensity.specimens[index]?.apparentDensity ?? 0)} />
              <DensityReportRow no="14" label="Apparent particle density average (Gsa)" unit="Mg/m3" values={[aggregateDensity.averageApparentDensity]} />
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-1 text-xs text-muted">
          <div>Measurement uncertainty of apparent particle density: 0.010 Mg/m3.</div>
          <div>Measurement uncertainty of water absorption: 0.08%.</div>
          <div>Asterisk (*) means that the laboratory is accredited for this test.</div>
        </div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateDensity.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUESI / TESTED BY"
        testedByName={aggregateDensity.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateDensity.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateFillerDensityReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateFillerDensity
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateFillerDensity: AggregateFillerDensityTest;
}) {
  const values = (selector: (index: number) => number) => [selector(0), selector(1)];
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.2f"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Specific density of filler"
      />

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing start" value={aggregateFillerDensity.testStartDate} />
        <Info label="Testing end" value={aggregateFillerDensity.testEndDate} />
        <Info label="Test method" value={aggregateFillerDensity.testMethod || "METODA ME PIKNOMETER / PYCNOMETER METHOD"} />
        <Info label="Test standard" value={test?.standard || "BS EN 1097-7:2022"} />
        <Info label="Lab location" value={aggregateFillerDensity.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} />
        <Info label="Temperature" value={aggregateFillerDensity.temperature} />
        <Info label="Relative humidity" value={aggregateFillerDensity.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Determination of the particle density of filler</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Measured parameter</th>
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2">Test Result 1</th>
                <th className="px-3 py-2">Test Result 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <FillerDensityReportRow label="Temperature" symbol="T" unit="C" values={values((index) => aggregateFillerDensity.runs[index]?.temperatureC ?? 0)} />
              <FillerDensityReportRow label="Liquid density" symbol="rho l" unit="Mg/m3" values={values((index) => aggregateFillerDensity.runs[index]?.liquidDensity ?? 0)} />
              <FillerDensityReportRow label="Mass of empty pycnometer with stopper" symbol="m0" unit="g" values={values((index) => aggregateFillerDensity.runs[index]?.emptyPycnometerMassG ?? 0)} />
              <FillerDensityReportRow label="Mass of pycnometer with filler test portion" symbol="m1" unit="g" values={values((index) => aggregateFillerDensity.runs[index]?.pycnometerSampleMassG ?? 0)} />
              <FillerDensityReportRow label="Mass of pycnometer with filler and liquid" symbol="m2" unit="g" values={values((index) => aggregateFillerDensity.runs[index]?.pycnometerSampleLiquidMassG ?? 0)} />
              <FillerDensityReportRow label="Volume of pycnometer" symbol="V" unit="ml" values={values((index) => aggregateFillerDensity.runs[index]?.pycnometerVolumeMl ?? 0)} />
              <FillerDensityReportRow label="Particle density of filler at 25 C" symbol="rho f" unit="Mg/m3" values={values((index) => aggregateFillerDensity.runs[index]?.particleDensity ?? 0)} />
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink">Average particle density of filler at 25 C</td>
                <td className="px-3 py-2 font-semibold text-ink">rho f avg.</td>
                <td className="px-3 py-2">Mg/m3</td>
                <td className="px-3 py-2 font-semibold text-ink" colSpan={2}>{aggregateFillerDensity.averageParticleDensity}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-1 text-xs text-muted">
          <div>Measurement uncertainty of apparent particle density: 0.010 Mg/m3.</div>
          <div>Asterisk (*) means that the laboratory is accredited for this test.</div>
        </div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateFillerDensity.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUESI / TESTED BY"
        testedByName={aggregateFillerDensity.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateFillerDensity.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateSoundnessReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateSoundness
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateSoundness: AggregateSoundnessTest;
}) {
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.11" title="RAPORT TESTIMI / TEST REPORT" subtitle="Magnesium Sulfate Soundness Test" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing start" value={aggregateSoundness.testStartDate} />
        <Info label="Testing end" value={aggregateSoundness.testEndDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 1367-2:2009"} />
        <Info label="Testing place" value={aggregateSoundness.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory"} />
        <Info label="Temperature" value={aggregateSoundness.temperature} />
        <Info label="Relative humidity" value={aggregateSoundness.humidity} />
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Humbja në peshë me sulfat magnezi* / Magnesium sulfate test*</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="table-head">
              <tr><th className="px-3 py-2">Sample no.</th><th className="px-3 py-2">Sieve size</th><th className="px-3 py-2">M1 before [g]</th><th className="px-3 py-2">M2 after retained 10 mm [g]</th><th className="px-3 py-2">Cycle number</th><th className="px-3 py-2">MS [%]</th><th className="px-3 py-2">Average [%]</th><th className="px-3 py-2">Uncertainty [%]</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {aggregateSoundness.runs.map((row, index) => (
                <tr key={`${row.sampleNo}-${index}`}><td className="px-3 py-2 font-semibold text-ink">{row.sampleNo}</td><td className="px-3 py-2">{row.sieveSizeMm}</td><td className="px-3 py-2">{row.initialMassG}</td><td className="px-3 py-2">{row.finalRetainedMassG}</td><td className="px-3 py-2">{row.cycles}</td><td className="px-3 py-2 font-semibold text-ink">{row.soundnessLossPercent}</td><td className="px-3 py-2 font-semibold text-ink">{index === 0 ? aggregateSoundness.averageSoundnessLossPercent : ""}</td><td className="px-3 py-2">{index === 0 ? "0.15" : ""}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>
      <div className="mt-6 grid gap-3 text-sm md:grid-cols-5">
        <Info label="Particles before" value={String(aggregateSoundness.totalParticlesBefore || "-")} />
        <Info label="Cracked after" value={String(aggregateSoundness.crackedParticles || "-")} />
        <Info label="Broken after" value={String(aggregateSoundness.brokenParticles || "-")} />
        <Info label="Flaked after" value={String(aggregateSoundness.flakedParticles || "-")} />
        <Info label="Particles after" value={String(aggregateSoundness.totalParticlesAfter || "-")} />
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{aggregateSoundness.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p></div>
      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateSoundness.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateSoundness.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateElongationReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateElongation
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateElongation: AggregateElongationIndexTest;
}) {
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.5" title="RAPORT TESTIMI / TEST REPORT" subtitle="Elongation Index of aggregates" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Testing date" value={aggregateElongation.testStartDate} />
        <Info label="Test standard" value={test?.standard || "BS 812-105.2:1980"} />
        <Info label="Testing place" value={aggregateElongation.testingLocation || "Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} />
        <Info label="Temperature" value={aggregateElongation.temperature} />
        <Info label="Humidity" value={aggregateElongation.humidity} />
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Elongation analysis / Analiza e indeksit të zgjatimit</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="table-head"><tr><th className="px-3 py-2">Fraction</th><th className="px-3 py-2">Retained mass [g]</th><th className="px-3 py-2">Elongated mass [g]</th><th className="px-3 py-2">EI [%]</th></tr></thead>
            <tbody className="divide-y divide-line">
              {aggregateElongation.rows.map((row, index) => <tr key={`${row.fractionLabel}-${index}`}><td className="px-3 py-2 font-semibold text-ink">{row.fractionLabel}</td><td className="px-3 py-2">{row.retainedMassG}</td><td className="px-3 py-2">{row.elongatedMassG}</td><td className="px-3 py-2 font-semibold text-ink">{row.elongationPercent}</td></tr>)}
              <tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink">Total / Indeksi i zgjatimit</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation.totalRetainedMassG}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation.totalElongatedMassG}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation.elongationIndexPercent}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{aggregateElongation.notes || "This test report belongs only to the tested sample."}</p></div>
      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateElongation.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY"
        responsibleName={headOfLabName(aggregateElongation.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateBulkDensityReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateBulkDensity
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateBulkDensity: AggregateBulkDensityTest;
}) {
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.7" title="RAPORT TESTIMI / TEST REPORT" subtitle="Loose bulk density and voids of aggregate" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing date" value={aggregateBulkDensity.testStartDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 1097-3:1998"} />
        <Info label="Specific density" value={`${aggregateBulkDensity.specificDensityMgM3 || "-"} Mg/m3`} />
        <Info label="Temperature" value={aggregateBulkDensity.temperature} />
        <Info label="Humidity" value={aggregateBulkDensity.humidity} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">Parameter</th><th className="px-3 py-2">Unit</th>{aggregateBulkDensity.runs.map((_, index) => <th key={index} className="px-3 py-2">Test {index + 1}</th>)}<th className="px-3 py-2">Average</th><th className="px-3 py-2">Uncertainty</th></tr></thead>
          <tbody className="divide-y divide-line">
            <tr><td className="px-3 py-2 font-semibold text-ink">Loose bulk density</td><td className="px-3 py-2">Mg/m3</td>{aggregateBulkDensity.runs.map((row, index) => <td key={index} className="px-3 py-2">{row.bulkDensityMgM3}</td>)}<td className="px-3 py-2 font-semibold text-ink">{aggregateBulkDensity.averageBulkDensityMgM3}</td><td className="px-3 py-2">0.02</td></tr>
            <tr><td className="px-3 py-2 font-semibold text-ink">Voids</td><td className="px-3 py-2">%</td>{aggregateBulkDensity.runs.map((row, index) => <td key={index} className="px-3 py-2">{row.voidsPercent}</td>)}<td className="px-3 py-2 font-semibold text-ink">{aggregateBulkDensity.averageVoidsPercent}</td><td className="px-3 py-2">1.2</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{aggregateBulkDensity.notes || "Results relate only to the items tested."}</p></div>
      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateBulkDensity.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY"
        responsibleName={headOfLabName(aggregateBulkDensity.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateSandEquivalentReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateSandEquivalent
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateSandEquivalent: AggregateSandEquivalentTest;
}) {
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.8" title="RAPORT TESTIMI / TEST REPORT" subtitle="Sand Equivalent test" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing date" value={aggregateSandEquivalent.testStartDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 933-8:2012+A1:2015"} />
        <Info label="Testing place" value={aggregateSandEquivalent.testingLocation} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">Result</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Value</th><th className="px-3 py-2">Uncertainty</th></tr></thead>
          <tbody className="divide-y divide-line">
            <tr><td className="px-3 py-2 font-semibold text-ink">Water content</td><td className="px-3 py-2">%</td><td className="px-3 py-2">{aggregateSandEquivalent.averageMoisturePercent}</td><td className="px-3 py-2">-</td></tr>
            <tr><td className="px-3 py-2 font-semibold text-ink">Fines content</td><td className="px-3 py-2">%</td><td className="px-3 py-2">{aggregateSandEquivalent.averageFinesPercent}</td><td className="px-3 py-2">-</td></tr>
            <tr><td className="px-3 py-2 font-semibold text-ink">Sand equivalent SE10</td><td className="px-3 py-2">%</td><td className="px-3 py-2 font-semibold text-ink">{aggregateSandEquivalent.sandEquivalentValue}</td><td className="px-3 py-2">1</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{aggregateSandEquivalent.notes || "This test report belongs only to the tested sample."}</p></div>
      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateSandEquivalent.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY"
        responsibleName={headOfLabName(aggregateSandEquivalent.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateShapeIndexReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateShapeIndex
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateShapeIndex: AggregateShapeIndexTest;
}) {
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.3"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Shape Index of aggregates"
      />

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing start" value={aggregateShapeIndex.testStartDate} />
        <Info label="Testing end" value={aggregateShapeIndex.testEndDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 933-4:2008"} />
        <Info label="Lab location" value={aggregateShapeIndex.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} />
        <Info label="Temperature" value={aggregateShapeIndex.temperature} />
        <Info label="Relative humidity" value={aggregateShapeIndex.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Determination of shape index / Përcaktimi i indeksit të formës</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Fraction</th>
                <th className="px-3 py-2">Test portion mass M1 [g]</th>
                <th className="px-3 py-2">Non-cubical mass M2 [g]</th>
                <th className="px-3 py-2">Shape index [%]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {aggregateShapeIndex.rows.map((row, index) => (
                <tr key={`${row.fractionLabel}-${index}`}>
                  <td className="px-3 py-2 font-semibold text-ink">{row.fractionLabel}</td>
                  <td className="px-3 py-2">{row.testPortionMassG}</td>
                  <td className="px-3 py-2">{row.nonCubicalMassG}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{row.shapeIndexPercent}</td>
                </tr>
              ))}
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink">Total / Indeksi i formës</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateShapeIndex.totalTestPortionMassG}</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateShapeIndex.totalNonCubicalMassG}</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateShapeIndex.shapeIndexPercent}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateShapeIndex.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUESI / TESTED BY"
        testedByName={aggregateShapeIndex.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateShapeIndex.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function AggregateFlakinessReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateFlakiness
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateFlakiness: AggregateFlakinessIndexTest;
}) {
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.4"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Aggregates Flakiness Index"
      />

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Testing date" value={aggregateFlakiness.testStartDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 933-3:2012"} />
        <Info label="Testing place" value={aggregateFlakiness.testingLocation || "Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} />
        <Info label="Temperature" value={aggregateFlakiness.temperature} />
        <Info label="Humidity" value={aggregateFlakiness.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Flakiness analysis / Analiza e indeksit të petëzimit</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Sieve fraction</th>
                <th className="px-3 py-2">Bar sieve [mm]</th>
                <th className="px-3 py-2">Ri S1</th>
                <th className="px-3 py-2">Ri S2</th>
                <th className="px-3 py-2">Ri S3</th>
                <th className="px-3 py-2">mi S1</th>
                <th className="px-3 py-2">mi S2</th>
                <th className="px-3 py-2">mi S3</th>
                <th className="px-3 py-2">FIi S1</th>
                <th className="px-3 py-2">FIi S2</th>
                <th className="px-3 py-2">FIi S3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {aggregateFlakiness.rows.map((row, index) => (
                <tr key={`${row.fractionLabel}-${index}`}>
                  <td className="px-3 py-2 font-semibold text-ink">{row.fractionLabel}</td>
                  <td className="px-3 py-2">{row.barSieveMm}</td>
                  {[0, 1, 2].map((sampleIndex) => <td key={`r${sampleIndex}`} className="px-3 py-2">{row.retainedMassesG[sampleIndex] ?? "-"}</td>)}
                  {[0, 1, 2].map((sampleIndex) => <td key={`m${sampleIndex}`} className="px-3 py-2">{row.passingBarSieveMassesG[sampleIndex] ?? "-"}</td>)}
                  {[0, 1, 2].map((sampleIndex) => <td key={`fi${sampleIndex}`} className="px-3 py-2 font-semibold text-ink">{row.flakinessPercentages[sampleIndex] ?? "-"}</td>)}
                </tr>
              ))}
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink" colSpan={2}>Totals</td>
                {[0, 1, 2].map((sampleIndex) => <td key={`tr${sampleIndex}`} className="px-3 py-2 font-semibold text-ink">{aggregateFlakiness.totals.totalRetainedMassesG[sampleIndex]}</td>)}
                {[0, 1, 2].map((sampleIndex) => <td key={`tm${sampleIndex}`} className="px-3 py-2 font-semibold text-ink">{aggregateFlakiness.totals.totalPassingMassesG[sampleIndex]}</td>)}
                {[0, 1, 2].map((sampleIndex) => <td key={`tf${sampleIndex}`} className="px-3 py-2 font-semibold text-ink">{aggregateFlakiness.totals.sampleFlakinessPercentages[sampleIndex]}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <Info label="M1 average retained mass" value={`${aggregateFlakiness.totals.averageRetainedMassG} g`} />
          <Info label="M2 average passing mass" value={`${aggregateFlakiness.totals.averagePassingMassG} g`} />
          <Info label="FI = M2 / M1 x 100" value={`${aggregateFlakiness.totals.finalFlakinessIndexPercent}%`} />
        </div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateFlakiness.notes || "This test report belongs only to the tested sample."}</p>
      </div>

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateFlakiness.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY"
        responsibleName={headOfLabName(aggregateFlakiness.checkedBy)}
        align="start"
        bordered
      />
    </section>
  );
}

export function DensityReportRow({ no, label, unit, values }: { no: string; label: string; unit: string; values: number[] }) {
  const padded = [values[0], values[1]];
  return (
    <tr>
      <td className="px-3 py-2 font-semibold text-ink">{no}</td>
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2">{unit}</td>
      {padded.map((value, index) => <td key={index} className="px-3 py-2 font-semibold text-ink">{value || value === 0 ? value : "-"}</td>)}
    </tr>
  );
}

export function FillerDensityReportRow({ label, symbol, unit, values }: { label: string; symbol: string; unit: string; values: number[] }) {
  const padded = [values[0], values[1]];
  return (
    <tr>
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 font-semibold text-ink">{symbol}</td>
      <td className="px-3 py-2">{unit}</td>
      {padded.map((value, index) => <td key={index} className="px-3 py-2 font-semibold text-ink">{value || value === 0 ? value : "-"}</td>)}
    </tr>
  );
}

// FreezeThawResultRow, ChemicalReportRow, and Signature moved to report-shared.tsx (used across multiple report types).
