"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, DensityAbsorptionSpecimen, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, SignaturePair, samplingOperator, SimpleReportLegalFooter, BiText, samplingDisclaimerApplies, defaultReportNotes } from "./report-shared";
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateDensity.testEndDate || sample?.reportDueDate;
  const specimens = [aggregateDensity.specimens[0], aggregateDensity.specimens[1]];
  const each = (read: (specimen: DensityAbsorptionSpecimen) => number | undefined) =>
    specimens.map((specimen) => (specimen ? read(specimen) : undefined));
  return (
    <OfficialReportShell report={report} code="SL-RA-AG-7.8/1.2" className="aggregate-density-report compact-official-report">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleDescription || sample?.sampleType },
        { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: samplingDate(sample) },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={aggregateDensity.testStartDate} end={aggregateDensity.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: samplingOperator(sample) },
          { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I DENSITETIT SPECIFIK DHE ABSORBIMIT* / DETERMINATION OF PARTICLE DENSITY AND WATER ABSORPTION*" },
          { sq: "METODA E TESTIMIT", en: "TEST METHOD", value: aggregateDensity.testMethod || "Metoda me piknometer / Pycnometer method" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 1097-6:2022" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: aggregateDensity.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory)" }
        ]} />
        <OfficialEnvironmental
          temperature={aggregateDensity.temperature}
          humidity={aggregateDensity.humidity}
          humidityLabel={<>Lagështia / <span className="italic">Relative Humidity</span></>}
        />
      </div>
      <div className="mt-3 text-center text-[10pt] font-bold">Rezultatet e testimit / <span className="italic font-normal">Test results</span></div>
      <table className="official-table mt-1 w-full border-collapse text-center text-[9pt]">
        <thead>
          <tr>
            <th rowSpan={2} className="w-[7%]">Nr.<br /><span>No.</span></th>
            <th rowSpan={2}>Përshkrimi<br /><span>Description</span></th>
            <th rowSpan={2} className="w-[9%]">Njësia<br /><span>Unit</span></th>
            <th colSpan={2} className="w-[26%]">Mostra / <span>Sample</span></th>
          </tr>
          <tr><th className="w-[13%]">1</th><th className="w-[13%]">2</th></tr>
        </thead>
        <tbody>
          <DensityReportRow no="1" sq="Temperatura" en="Temperature" unit="ºC" decimals={0} values={each((specimen) => specimen.waterTemperatureC)} />
          <DensityReportRow no="2" sq="Densiteti i ujit" en="Water density" unit="g/Lt" decimals={4} values={each((specimen) => specimen.waterDensity)} />
          <DensityReportRow no="3" sq="Pesha e agregatit në gjendje të thatë" en="Mass of oven dry test portion in air [A]" unit="g" decimals={2} values={each((specimen) => specimen.ovenDryMassG)} />
          <DensityReportRow no="4" sq="Pesha e agregatit SSD" en="Mass of saturated and surface dry of aggregate in the air [S]" unit="g" decimals={2} values={each((specimen) => specimen.ssdMassG)} />
          <DensityReportRow no="5" sq="Masa e piknometrit me ujë" en="Mass of the pyknometer with water [B]" unit="g" decimals={2} values={each((specimen) => specimen.pycnometerWaterMassG)} />
          <DensityReportRow no="6" sq="Masa e piknometrit me ujë + agregat" en="Mass of the pyknometer with water + aggregate [C]" unit="g" decimals={2} values={each((specimen) => specimen.pycnometerWaterSampleMassG)} />
          {/* The unit spans each per-sample row and the average under it, as the
              template merges them: one unit for the pair of lines. */}
          <DensityReportRow no="7" sq="Vlera e absorbimit të çdo mostre" en="Each sample absorption value" unit="%" unitRowSpan={2} decimals={2} values={each((specimen) => specimen.absorptionPercent)} />
          <DensityReportRow no="8" sq="Vlera mesatare e absorbimit" en="Absorption average value" decimals={2} average={aggregateDensity.averageAbsorptionPercent} />
          <DensityReportRow no="9" sq="Pesha specifike në gjendje të thatë (për çdo mostër)" en="Bulk specifik gravity OD (for each sample)" unit="Mg/m³" unitRowSpan={2} decimals={3} values={each((specimen) => specimen.ovenDryBulkDensity)} />
          <DensityReportRow no="10" sq="Pesha specifike në të thatë (mesatarja)" en="Oven dry bulk specific gravity (Gsb)" decimals={3} average={aggregateDensity.averageOvenDryBulkDensity} />
          <DensityReportRow no="11" sq="Pesha specifike SSD (për çdo mostër)" en="Bulk specific gravity SSD (for each sample)" unit="Mg/m³" unitRowSpan={2} decimals={3} values={each((specimen) => specimen.ssdBulkDensity)} />
          <DensityReportRow no="12" sq="Peshë specifike SSD (mesatarja)" en="SSD bulk specific density (Gsb SSD)" decimals={3} average={aggregateDensity.averageSsdBulkDensity} />
          <DensityReportRow no="13" sq="Pesha specifike (për çdo mostër)" en="Apparent particle density (for each sample)" unit="Mg/m³" unitRowSpan={2} decimals={3} values={each((specimen) => specimen.apparentDensity)} />
          <DensityReportRow no="14" sq="Pesha specifike" en="Apparent particle density (Gsa)" decimals={3} average={aggregateDensity.averageApparentDensity} />
        </tbody>
      </table>
      <div className="mt-1 text-[8pt] leading-tight">
        <div>Pasiguria në matje për peshën specifike aparente / <span className="italic">Measurement uncertainty of apparent particle density</span> 0.010 Mg/m³</div>
        <div>Pasiguria në matje për absorbimin / <span className="italic">Measurement uncertainty of water absorption</span> 0.08%</div>
      </div>
      <OfficialAsterisk />
      <OfficialNotesAndFooter
        notes={aggregateDensity.notes}
        testedBy={aggregateDensity.technicianName || report.draftedBy}
        testedByLabel={<>TESTUESI / <span className="italic font-normal">TESTED BY</span></>}
        responsible={aggregateDensity.checkedBy}
        issueDate={issueDate}
        sampledBy={samplingOperator(sample)}
      />
    </OfficialReportShell>
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateFillerDensity.testEndDate || sample?.reportDueDate;
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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
        <div className="font-semibold"><BiText>Notes / Shënime</BiText></div>
        <p className="mt-1">{aggregateFillerDensity.notes || defaultReportNotes(samplingOperator(sample))}</p>
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
      <SimpleReportLegalFooter issueDate={issueDate} sampledBy={samplingOperator(sample)} />
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateSoundness.testEndDate || sample?.reportDueDate;
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold"><BiText>Notes / Shënime</BiText></div><p className="mt-1">{aggregateSoundness.notes || defaultReportNotes(samplingOperator(sample))}</p></div>
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
      <SimpleReportLegalFooter issueDate={issueDate} sampledBy={samplingOperator(sample)} />
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateElongation.testEndDate || sample?.reportDueDate;
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.5" title="RAPORT TESTIMI / TEST REPORT" subtitle="Elongation Index of aggregates" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Sampling operator" value={samplingOperator(sample)} />
        <Info label="Testing date" value={aggregateElongation.testStartDate} />
        <Info label="Test standard" value={test?.standard || "BS 812-105.2:1980"} />
        <Info label="Testing place" value={aggregateElongation.testingLocation || "Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} />
        <Info label="Temperature" value={aggregateElongation.temperature} />
        <Info label="Humidity" value={aggregateElongation.humidity} />
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink"><BiText>Elongation analysis / Analiza e indeksit të zgjatimit</BiText></h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="table-head"><tr><th className="px-3 py-2">Fraction</th><th className="px-3 py-2">Retained mass [g]</th><th className="px-3 py-2">Elongated mass [g]</th><th className="px-3 py-2">EI [%]</th></tr></thead>
            <tbody className="divide-y divide-line">
              {aggregateElongation.rows.map((row, index) => <tr key={`${row.fractionLabel}-${index}`}><td className="px-3 py-2 font-semibold text-ink">{row.fractionLabel}</td><td className="px-3 py-2">{row.retainedMassG}</td><td className="px-3 py-2">{row.elongatedMassG}</td><td className="px-3 py-2 font-semibold text-ink">{row.elongationPercent}</td></tr>)}
              <tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink"><BiText>Total / Indeksi i zgjatimit</BiText></td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation.totalRetainedMassG}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation.totalElongatedMassG}</td><td className="px-3 py-2 font-semibold text-ink">{aggregateElongation.elongationIndexPercent}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold"><BiText>Notes / Shënime</BiText></div><p className="mt-1">{aggregateElongation.notes || "This test report belongs only to the tested sample."}</p></div>
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
      <SimpleReportLegalFooter issueDate={issueDate} sampledBy={samplingOperator(sample)} />
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateBulkDensity.testEndDate || sample?.reportDueDate;
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.7" title="RAPORT TESTIMI / TEST REPORT" subtitle="Loose bulk density and voids of aggregate" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold"><BiText>Notes / Shënime</BiText></div><p className="mt-1">{aggregateBulkDensity.notes || "Results relate only to the items tested."}</p></div>
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
      <SimpleReportLegalFooter issueDate={issueDate} sampledBy={samplingOperator(sample)} />
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateSandEquivalent.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-AG-7.8/1.8" className="compact-official-report">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleDescription || sample?.sampleType },
        { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: samplingDate(sample) },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={aggregateSandEquivalent.testStartDate} end={aggregateSandEquivalent.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: samplingOperator(sample) },
          { sq: "TESTI", en: "TEST", value: "VLERËSIMI I IMTËSISË. PËRCAKTIMI I EKUIVALENTIT TË RËRËS* / ASSESSMENT OF FINES. SAND EQUIVALENT TEST*" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 933-8:2012+A1:2015" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LAB. LOCATION", value: aggregateSandEquivalent.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory)" }
        ]} />
        <OfficialEnvironmental
          temperature={aggregateSandEquivalent.temperature}
          humidity={aggregateSandEquivalent.humidity}
          humidityLabel={<>Lagështia relative / <span className="italic">Relative Humidity</span></>}
        />
      </div>
      <table className="official-table mt-6 w-full border-collapse text-center text-[10pt]">
        <thead>
          <tr>
            <th className="w-[45%]">Parametri i matur<br /><span>Measured parameter</span></th>
            <th>Njësitë<br /><span>Units</span></th>
            <th>Rezultati i testimit<br /><span>Test Result</span></th>
            <th>Pasiguria në matje<br /><span>Measurement uncertainty</span></th>
          </tr>
        </thead>
        <tbody>
          {/* The uncertainty is stated for the sand equivalent only. The
              template hatches the other two cells to say so; this suite prints
              no fills, so they are left empty rather than carrying a figure
              that was never declared for them. */}
          <tr>
            <td className="text-left">Përmbajtja e lagështisë / <span className="italic">Water content</span></td>
            <td>%</td>
            <td>{reportFigure(aggregateSandEquivalent.averageMoisturePercent, 2)}</td>
            <td />
          </tr>
          <tr>
            <td className="text-left">Përmbajtja e finesës / <span className="italic">Fines content</span></td>
            <td>%</td>
            <td>{reportFigure(aggregateSandEquivalent.averageFinesPercent, 2)}</td>
            <td />
          </tr>
          <tr>
            <td className="text-left font-bold">Ekuivalenti i rërës / <span className="italic">Sand equivalent value</span> (SE<sub>10</sub>)</td>
            <td>_</td>
            <td className="font-bold">{reportFigure(aggregateSandEquivalent.sandEquivalentValue, 0)}</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter
        notes={aggregateSandEquivalent.notes}
        testedBy={aggregateSandEquivalent.technicianName || report.draftedBy}
        responsible={aggregateSandEquivalent.checkedBy}
        issueDate={issueDate}
        sampledBy={samplingOperator(sample)}
      />
    </OfficialReportShell>
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateShapeIndex.testEndDate || sample?.reportDueDate;
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
        <Info label="Testing start" value={aggregateShapeIndex.testStartDate} />
        <Info label="Testing end" value={aggregateShapeIndex.testEndDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 933-4:2008"} />
        <Info label="Lab location" value={aggregateShapeIndex.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} />
        <Info label="Temperature" value={aggregateShapeIndex.temperature} />
        <Info label="Relative humidity" value={aggregateShapeIndex.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink"><BiText>Determination of shape index / Përcaktimi i indeksit të formës</BiText></h3>
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
                <td className="px-3 py-2 font-semibold text-ink"><BiText>Total / Indeksi i formës</BiText></td>
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
        <div className="font-semibold"><BiText>Notes / Shënime</BiText></div>
        <p className="mt-1">{aggregateShapeIndex.notes || defaultReportNotes(samplingOperator(sample))}</p>
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
      <SimpleReportLegalFooter issueDate={issueDate} sampledBy={samplingOperator(sample)} />
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateFlakiness.testEndDate || sample?.reportDueDate;
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
        <Info label="Testing date" value={aggregateFlakiness.testStartDate} />
        <Info label="Test standard" value={test?.standard || "BS EN 933-3:2012"} />
        <Info label="Testing place" value={aggregateFlakiness.testingLocation || "Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} />
        <Info label="Temperature" value={aggregateFlakiness.temperature} />
        <Info label="Humidity" value={aggregateFlakiness.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink"><BiText>Flakiness analysis / Analiza e indeksit të petëzimit</BiText></h3>
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
        <div className="font-semibold"><BiText>Notes / Shënime</BiText></div>
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
      <SimpleReportLegalFooter issueDate={issueDate} sampledBy={samplingOperator(sample)} />
    </section>
  );
}

export function DensityReportRow({
  no,
  sq,
  en,
  unit,
  unitRowSpan,
  decimals,
  values,
  average
}: {
  no: string;
  sq: string;
  en: string;
  unit?: string;
  /** How many rows this unit cell covers, where the template merges it. */
  unitRowSpan?: number;
  decimals: number;
  values?: Array<number | undefined>;
  /**
   * An average line. It runs across both sample columns, because an average of
   * the two is not a result belonging to either one.
   */
  average?: number;
}) {
  return (
    <tr>
      <td className="font-bold">{no}</td>
      <td className="text-left">{sq} / <span className="italic">{en}</span></td>
      {unit === undefined ? null : <td rowSpan={unitRowSpan}>{unit}</td>}
      {average === undefined ? (
        (values ?? []).map((value, index) => <td key={index}>{reportFigure(value, decimals)}</td>)
      ) : (
        <td colSpan={2} className="font-bold">{reportFigure(average, decimals)}</td>
      )}
    </tr>
  );
}

/**
 * A measured figure as a certificate prints it: fixed decimals, or a dash
 * where nothing was recorded.
 *
 * Fixed rather than as stored, because a column of 2.612, 0.88 and 2.6653 is
 * harder to read down than one of 2.612, 0.880 and 2.665, and the number of
 * decimals is what states the precision the method actually claims.
 */
export function reportFigure(value: number | undefined, decimals: number) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(decimals) : "-";
}

/**
 * The date the sample was taken, where the laboratory can state it.
 *
 * The register has no sampling date of its own: for a sample the client
 * delivered, nobody here saw it taken and the date is not ours to assert on an
 * accredited certificate, so the line prints a dash. Where the laboratory
 * collected the sample itself, the collection and the receipt are the same
 * visit, so the receipt date is the sampling date.
 */
export function samplingDate(sample?: Sample) {
  if (!sample) return undefined;
  return sample.collectionMethod === "Collected by lab technician" ? sample.dateReceived : undefined;
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
