"use client";

import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";

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
  thermalInsulation,
  cementConsistency,
  cementStrength,
  cementBlaine,
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
  thermalInsulation?: ThermalInsulationTest;
  cementConsistency?: CementConsistencyTest;
  cementStrength?: CementStrengthTest;
  cementBlaine?: CementBlaineTest;
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

  if (cementBlaine) {
    return <CementBlaineReportPreview report={report} test={test} sample={sample} client={client} project={project} cementBlaine={cementBlaine} />;
  }

  if (concreteIndirectTensile) {
    return <ConcreteIndirectTensileReportPreview report={report} test={test} sample={sample} client={client} project={project} concreteIndirectTensile={concreteIndirectTensile} />;
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

  const reportSpecimens = concrete?.specimens?.length
    ? concrete.specimens.filter((specimen) => report.specimenCodes.includes(specimen.specimenCode))
    : concrete
      ? [
          {
            specimenCode: sample?.sampleCode ?? "-",
            ageDays: concrete.ageDays,
            lengthMm: concrete.cubeLength,
            widthMm: concrete.cubeWidth,
            heightMm: concrete.cubeHeight,
            weightKg: concrete.weight,
            maximumLoadKn: concrete.maximumLoadKn,
            compressiveStrengthMpa: concrete.compressiveStrengthMpa,
            visualInspection: concrete.failureType,
            notes: concrete.notes
          }
        ]
      : [];
  const averageStrength = reportSpecimens.length
    ? Math.round((reportSpecimens.reduce((sum, specimen) => sum + specimen.compressiveStrengthMpa, 0) / reportSpecimens.length) * 100) / 100
    : undefined;
  const specimenDensity = (specimen: (typeof reportSpecimens)[number]) => {
    const volumeM3 = (specimen.lengthMm * specimen.widthMm * specimen.heightMm) / 1_000_000_000;
    return volumeM3 ? round(specimen.weightKg / volumeM3, 0) : 0;
  };
  const strengthClass = sample?.notes?.match(new RegExp("C\\d+/\\d+"))?.[0];

  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-B-7.8/1.3"
        title="RAPORT TESTIM / TEST REPORT"
        subtitle="Rezistenca në shtypje e betonit të ngurtësuar"
      />

      <div className="mt-6 overflow-hidden rounded-md border border-line text-sm">
        <ReportInfoRow label="Nr. REGJISTRI / REGISTER No." value={sample?.sampleCode} />
        <ReportInfoRow label="KLIENTI / PURCHASER" value={client?.clientName} />
        <ReportInfoRow label="ADRESA / ADDRESS" value={client?.address} />
        <ReportInfoRow label="KONTAKTET / CONTACT" value={client?.phone || client?.email} />
        <ReportInfoRow label="OBJEKTI / OBJECT" value={project?.projectName} />
        <ReportInfoRow label="ELEMENTI / ELEMENT" value={sample?.sampleDescription} />
        <ReportInfoRow label="KAMPIONI / SAMPLE" value={sample?.sampleType} />
        <ReportInfoRow label="KLASA E REZISTENCËS / STRENGTH CLASS" value={strengthClass} />
        <ReportInfoRow label="DATA E PRANIMIT TË KAMPIONIT NË LABORATOR / DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY" value={sample?.dateReceived} />
        <div className="grid border-b border-line md:grid-cols-[280px_1fr]">
          <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">DATA E TESTIMIT / TESTING DATE</div>
          <div className="grid md:grid-cols-2">
            <div className="px-3 py-2">FILLIMI / STARTING: <span className="font-semibold text-ink">{concrete?.testStartDate || concrete?.testDate || "-"}</span></div>
            <div className="border-t border-line px-3 py-2 md:border-t-0 md:border-l">MBARIMI / ENDING: <span className="font-semibold text-ink">{concrete?.testEndDate || concrete?.testDate || "-"}</span></div>
          </div>
        </div>
        <ReportInfoRow label="OPERATORI I MARRJES SË KAMPIONIT / SAMPLING OPERATOR" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <ReportInfoRow label="TESTIMI / TEST" value="REZISTENCA NË SHTYPJE E BETONIT TË NGURTËSUAR * / COMPRESSIVE STRENGTH OF TEST SPECIMENS *" />
        <ReportInfoRow label="STANDARDI I TESTIMIT / TEST STANDARD" value={test?.standard || "BS EN 12390-3:2019"} />
        <ReportInfoRow label="VENDI KU ËSHTË PERFORMUAR TESTI / LAB. LOCATION" value={concrete?.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"} />
        <div className="grid md:grid-cols-[280px_1fr]">
          <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">KUSHTET AMBJENTALE / ENVIRONMENTAL CONDITIONS</div>
          <div className="grid md:grid-cols-2">
            <div className="px-3 py-2">Temperatura / Temperature: <span className="font-semibold text-ink">{concrete?.temperature || "-"}</span></div>
            <div className="border-t border-line px-3 py-2 md:border-t-0 md:border-l">Lagështia relative / Relative Humidity: <span className="font-semibold text-ink">{concrete?.humidity || "-"}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="rounded-t-md border border-b-0 border-line bg-lab-porcelain px-3 py-2 text-sm font-semibold text-ink">Të dhëna të Kampionit / Test specimen characteristics</h3>
        <div className="overflow-x-auto rounded-b-md border border-line">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Kampioni<br /><span className="font-normal">Test specimen nº</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Gjatësia<br /><span className="font-normal">Length (mm)</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Gjerësia<br /><span className="font-normal">Width (mm)</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Lartësia<br /><span className="font-normal">Height (mm)</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Sipërfaqja<br /><span className="font-normal">Compressive area (mm2)</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Pesha<br /><span className="font-normal">Weight (kg)</span></th>
                <th className="border-b border-line bg-lab-porcelain px-3 py-2">Densiteti<br /><span className="font-normal">Apparent density (kg/m3)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reportSpecimens.map((specimen, index) => (
                <tr key={`${specimen.specimenCode}-${index}`}>
                  <td className="border-r border-line px-3 py-2 font-semibold text-ink">{index + 1}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.lengthMm}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.widthMm}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.heightMm}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.lengthMm * specimen.widthMm}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.weightKg}</td>
                  <td className="px-3 py-2">{specimenDensity(specimen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="rounded-t-md border border-b-0 border-line bg-lab-porcelain px-3 py-2 text-sm font-semibold text-ink">Rezultatet e testimit / Test results</h3>
        <div className="overflow-x-auto rounded-b-md border border-line">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Kampioni<br /><span className="font-normal">Test specimen nº</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Data e betonimit<br /><span className="font-normal">Casting date</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Data e testimit<br /><span className="font-normal">Testing date</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Maturimi<br /><span className="font-normal">Curing (days)</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Mënyra e shkatërrimit<br /><span className="font-normal">Type of failure</span></th>
                <th className="border-b border-r border-line bg-lab-porcelain px-3 py-2">Ngarkesa maksimale<br /><span className="font-normal">Maximum load (kN)</span></th>
                <th className="border-b border-line bg-lab-porcelain px-3 py-2">Rezistenca në shtypje<br /><span className="font-normal">Compressive strength (MPa)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reportSpecimens.map((specimen, index) => (
                <tr key={`${specimen.specimenCode}-result-${index}`}>
                  <td className="border-r border-line px-3 py-2 font-semibold text-ink">{index + 1}</td>
                  <td className="border-r border-line px-3 py-2">{concrete?.castingDate || "-"}</td>
                  <td className="border-r border-line px-3 py-2">{concrete?.testDate || concrete?.testEndDate || "-"}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.ageDays}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.visualInspection || "Normale / Normal"}</td>
                  <td className="border-r border-line px-3 py-2">{specimen.maximumLoadKn}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{specimen.compressiveStrengthMpa}</td>
                </tr>
              ))}
              {averageStrength !== undefined ? (
                <>
                  <tr className="bg-lab-porcelain">
                    <td className="px-3 py-2 font-semibold text-ink" colSpan={6}>Vlera mesatare e qëndrueshmërisë në shtypje / Average cubes compressive strength</td>
                    <td className="px-3 py-2 font-semibold text-ink">{averageStrength}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-ink" colSpan={6}>Pasiguria në matje / Measurement uncertainty</td>
                    <td className="px-3 py-2 font-semibold text-ink">1.5</td>
                  </tr>
                </>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Yll (*) tregon që testi është i akredituar / Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>

      <div className="mt-8 rounded-md border border-line p-4 text-sm text-ink">
        <div className="font-semibold">Shënime / Notes:</div>
        <p className="mt-2">{concrete?.notes || "Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / The results relate only to the items tested."}</p>
      </div>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <Signature label="TESTUESI / TESTED BY" value={concrete?.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={report.approvedBy || "Ing./ Eng. Besiana ALLIU"} />
      </div>

      <div className="mt-8 space-y-1 border-t border-line pt-4 text-xs text-muted">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / The results relate only to the items tested.</p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / The test report shall not be reproduced except in full without written approval of the laboratory.</p>
        <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / The laboratory is not responsible for the sampling phase.</p>
        <p>Deklaroj që testi është kryer në përputhje me standardin. / I declare that the test was performed in accordance with the standard.</p>
        <p className="pt-3 font-semibold text-ink">Data e lëshimit të Raportit të Testimit / Test Report Issue Date: {report.issuedAt ? new Date(report.issuedAt).toLocaleDateString() : "-"}</p>
      </div>
    </section>
  );
}

function ReportHeader({
  report,
  code,
  title,
  subtitle
}: {
  report: Report;
  code: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="border-b border-line pb-5">
      <div className="grid items-center gap-4 sm:grid-cols-[150px_1fr_132px]">
        <div className="flex items-center">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-36" />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold uppercase tracking-wide text-ink">{title}</div>
          <div className="mt-2 text-xs font-semibold text-muted">Kodi / Code: {code}</div>
          <div className="mt-1 text-sm font-semibold text-lab-burgundy">{subtitle}</div>
          <div className="mt-2 text-xs text-muted">Nr. / No. {report.reportNumber} · Faqe / Page: {report.reportSequence} / {report.totalReports}</div>
        </div>
        <div className="flex justify-end">
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="h-auto w-28" />
        </div>
      </div>
      <div className="mt-3 flex justify-end no-print">
        <StatusBadge status={report.reportStatus} />
      </div>
    </header>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-medium text-ink">{value ?? "-"}</div>
    </div>
  );
}

function Bilingual({ sq, en, className = "" }: { sq: string; en: string; className?: string }) {
  return (
    <span className={`block ${className}`}>
      <span className="block font-semibold text-ink">{sq}</span>
      <span className="mt-0.5 block text-[0.82em] font-normal italic leading-tight text-muted">{en}</span>
    </span>
  );
}

function BilingualInfo({ sq, en, value }: { sq: string; en: string; value?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted">
        <Bilingual sq={sq} en={en} />
      </div>
      <div className="mt-1 font-medium text-ink">{value ?? "-"}</div>
    </div>
  );
}

function ReportInfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid border-b border-line md:grid-cols-[280px_1fr]">
      <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">{label}:</div>
      <div className="px-3 py-2 font-medium text-ink">{value || "-"}</div>
    </div>
  );
}

function CementConsistencyReportPreview({
  report,
  test,
  sample,
  client,
  project,
  cementConsistency
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  cementConsistency: CementConsistencyTest;
}) {
  const rows = [
    ["1", "Water demand for standard consistency", "BS EN 196-3:2016", "%", cementConsistency.consistency.waterDemandPercent, "0.8"],
    ["2", "Initial setting time", "BS EN 196-3:2016", "min", cementConsistency.setting.initialSettingMinutes, "1"],
    ["3", "Final setting time", "BS EN 196-3:2016", "min", cementConsistency.setting.finalSettingMinutes, "1"],
    ["4", "Expansion after 24 hours", "BS EN 196-3:2016", "mm", cementConsistency.expansion.expansionMm, "0.9"]
  ] as const;
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-Ç-7.8/1.1" title="RAPORT TESTIMI / TEST REPORT" subtitle="Consistency, setting time and expansion of cement" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Testing period" value={`${cementConsistency.testStartDate || "-"} / ${cementConsistency.testEndDate || "-"}`} />
        <Info label="Standard" value={test?.standard} />
        <Info label="Lab location" value={cementConsistency.testingLocation} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">No.</th><th className="px-3 py-2">Test</th><th className="px-3 py-2">Standard</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Result</th><th className="px-3 py-2">Uncertainty</th></tr></thead>
          <tbody className="divide-y divide-line">{rows.map((row) => <tr key={row[0]}><td className="px-3 py-2 font-semibold text-ink">{row[0]}</td><td className="px-3 py-2">{row[1]}</td><td className="px-3 py-2">{row[2]}</td><td className="px-3 py-2">{row[3]}</td><td className="px-3 py-2 font-semibold text-ink">{row[4]}</td><td className="px-3 py-2">{row[5]}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{cementConsistency.notes || "Results relate only to the submitted sample."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={cementConsistency.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={cementConsistency.checkedBy || report.approvedBy} /></div>
    </section>
  );
}

function CementStrengthReportPreview({
  report,
  test,
  sample,
  client,
  project,
  cementStrength
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  cementStrength: CementStrengthTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-Ç-7.8/1.3" title="RAPORT TESTIMI / TEST REPORT" subtitle="Flexural and compressive strength of cement mortar" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Casting date" value={cementStrength.castingDate} />
        <Info label="Standard" value={test?.standard} />
        <Info label="Lab location" value={cementStrength.testingLocation} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">No.</th><th className="px-3 py-2">Age</th><th className="px-3 py-2">Test</th><th className="px-3 py-2">Area [mm2]</th><th className="px-3 py-2">Load [kN]</th><th className="px-3 py-2">Result [MPa]</th><th className="px-3 py-2">Average / Uncertainty</th></tr></thead>
          <tbody className="divide-y divide-line">
            {cementStrength.specimens.map((row) => {
              const average = row.testType === "Flexural"
                ? cementStrength.averages[`flexural${row.ageDays}DayMpa` as keyof typeof cementStrength.averages]
                : cementStrength.averages[`compressive${row.ageDays}DayMpa` as keyof typeof cementStrength.averages];
              return <tr key={row.rowNo}><td className="px-3 py-2 font-semibold text-ink">{row.rowNo}</td><td className="px-3 py-2">{row.ageDays} days</td><td className="px-3 py-2">{row.testType}</td><td className="px-3 py-2">{row.surfaceAreaMm2}</td><td className="px-3 py-2">{row.loadKn}</td><td className="px-3 py-2 font-semibold text-ink">{row.strengthMpa}</td><td className="px-3 py-2">{average} MPa / {row.testType === "Flexural" ? "0.5" : "2"} MPa</td></tr>;
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{cementStrength.notes || "Results relate only to the submitted sample."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={cementStrength.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={cementStrength.checkedBy || report.approvedBy} /></div>
    </section>
  );
}

function CementBlaineReportPreview({
  report,
  test,
  sample,
  client,
  project,
  cementBlaine
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  cementBlaine: CementBlaineTest;
}) {
  const code = cementBlaine.method === "ASTM" ? "SL-RA-Ç-7.8/1.4.2" : "SL-RA-Ç-7.8/1.4.1";
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code={code} title="RAPORT TESTIMI / TEST REPORT" subtitle={`Blaine specific surface of cement (${cementBlaine.method})`} />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Testing period" value={`${cementBlaine.testStartDate || "-"} / ${cementBlaine.testEndDate || "-"}`} />
        <Info label="Standard" value={test?.standard} />
        <Info label="Lab location" value={cementBlaine.testingLocation} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">No.</th><th className="px-3 py-2">Test</th><th className="px-3 py-2">Standard</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Result</th><th className="px-3 py-2">Uncertainty</th></tr></thead>
          <tbody><tr><td className="px-3 py-2 font-semibold text-ink">1</td><td className="px-3 py-2">Specific surface area by Blaine air permeability</td><td className="px-3 py-2">{test?.standard}</td><td className="px-3 py-2">cm2/g</td><td className="px-3 py-2 font-semibold text-ink">{cementBlaine.specificSurfaceCm2G}</td><td className="px-3 py-2">80</td></tr></tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        <Info label="Cement density" value={cementBlaine.density ? `${cementBlaine.density.cementDensityGcm3} g/cm3` : undefined} />
        <Info label="Bed volume" value={cementBlaine.method === "ASTM" ? `${cementBlaine.astm?.bedVolumeCm3 ?? "-"} cm3` : `${cementBlaine.bsEn?.bedVolumeCm3 ?? "-"} cm3`} />
        <Info label="Constant K" value={cementBlaine.method === "ASTM" ? String(cementBlaine.astm?.constantK ?? "-") : String(cementBlaine.bsEn?.constantK ?? "-")} />
      </div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{cementBlaine.notes || "Results relate only to the submitted sample."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={cementBlaine.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={cementBlaine.checkedBy || report.approvedBy} /></div>
    </section>
  );
}

function ConcreteWaterPenetrationReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concreteWater
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concreteWater: ConcreteWaterPenetrationTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-B-7.8/1.10" title="RAPORT TESTIM / TEST REPORT" subtitle="Depth of water penetration under pressure" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Description of specimens" value={concreteWater.specimens.map((row) => `${row.lengthMm}x${row.widthMm}x${row.heightMm} mm`).filter(Boolean).join("; ")} />
        <Info label="Date of casting" value={concreteWater.castingDate} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Testing start" value={concreteWater.testStartDate} />
        <Info label="Testing end" value={concreteWater.testEndDate} />
        <Info label="Curing period" value={concreteWater.curingMethod} />
        <Info label="Pressure direction" value={concreteWater.pressureDirection} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 12390-8:2019"} />
        <Info label="Lab location" value={concreteWater.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory)"} />
        <Info label="Temperature" value={concreteWater.temperature} />
        <Info label="Relative humidity" value={concreteWater.humidity} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">Measured parameter</th><th className="px-3 py-2">Unit</th>{[1, 2, 3].map((index) => <th key={index} className="px-3 py-2">Sample {index}</th>)}<th className="px-3 py-2">Average</th><th className="px-3 py-2">Measurement uncertainty</th></tr></thead>
          <tbody className="divide-y divide-line">
            <tr><td className="px-3 py-2 font-semibold text-ink">Thellësia e penetrimit të ujit nën presion në betonin e ngurtësuar / Depth of water penetration under pressure</td><td className="px-3 py-2">mm</td>{[0, 1, 2].map((index) => <td key={index} className="px-3 py-2">{concreteWater.specimens[index]?.maxPenetrationMm ?? "-"}</td>)}<td className="px-3 py-2 font-semibold text-ink">{concreteWater.averagePenetrationMm}</td><td className="px-3 py-2">1</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{concreteWater.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUESI / TESTED BY" value={concreteWater.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={concreteWater.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function ConcreteFlexuralReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concreteFlexural
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concreteFlexural: ConcreteFlexuralTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-B-7.8/1.4" title="RAPORT TESTIMI / TEST REPORT" subtitle="Flexural strength of test specimens" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Element" value={sample?.sampleDescription} />
        <Info label="Sample" value={sample?.sampleType} />
        <Info label="Date of casting" value={concreteFlexural.castingDate} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Testing start" value={concreteFlexural.testStartDate} />
        <Info label="Testing end" value={concreteFlexural.testEndDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 12390-5:2019"} />
        <Info label="Apparatus type" value={concreteFlexural.apparatusType} />
        <Info label="Lab location" value={concreteFlexural.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory)"} />
        <Info label="Temperature" value={concreteFlexural.temperature} />
        <Info label="Relative humidity" value={concreteFlexural.humidity} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[1160px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">Parameter</th><th className="px-3 py-2">Unit</th>{[1, 2, 3].map((index) => <th key={index} className="px-3 py-2">Sample {index}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            <FlexReportRow label="Specimen width" unit="mm" values={concreteFlexural.specimens.map((row) => row.widthMm)} />
            <FlexReportRow label="Specimen length" unit="mm" values={concreteFlexural.specimens.map((row) => row.lengthMm)} />
            <FlexReportRow label="Specimen thickness" unit="mm" values={concreteFlexural.specimens.map((row) => row.thicknessMm)} />
            <FlexReportRow label="Specimen weight" unit="kg" values={concreteFlexural.specimens.map((row) => row.weightKg)} />
            <FlexReportRow label="Distance between lower rollers" unit="mm" values={concreteFlexural.specimens.map((row) => row.spanMm)} />
            <FlexReportRow label="Specimen volume" unit="m3" values={concreteFlexural.specimens.map((row) => row.volumeM3)} />
            <FlexReportRow label="Apparent density" unit="kg/m3" values={concreteFlexural.specimens.map((row) => row.apparentDensityKgM3)} />
            <FlexReportRow label="Maximum load failure" unit="kN" values={concreteFlexural.specimens.map((row) => row.maximumLoadKn)} />
            <FlexReportRow label="Flexural strength" unit="MPa" values={concreteFlexural.specimens.map((row) => row.flexuralStrengthMpa)} strong />
            <tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink">Average flexural strength</td><td className="px-3 py-2">MPa</td><td className="px-3 py-2 font-semibold text-ink" colSpan={3}>{concreteFlexural.averageFlexuralStrengthMpa}</td></tr>
            <tr><td className="px-3 py-2 font-semibold text-ink">Uncertainty of measurement</td><td className="px-3 py-2">MPa</td><td className="px-3 py-2" colSpan={3}>0.54</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{concreteFlexural.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={concreteFlexural.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={concreteFlexural.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function FlexReportRow({ label, unit, values, strong }: { label: string; unit: string; values: number[]; strong?: boolean }) {
  const padded = [values[0], values[1], values[2]];
  return <tr><td className="px-3 py-2 font-semibold text-ink">{label}</td><td className="px-3 py-2">{unit}</td>{padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}</tr>;
}

function ConcreteDensityReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concreteDensity
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concreteDensity: ConcreteDensityTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-B-7.8/1.8" title="RAPORT TESTIM / TEST REPORT" subtitle="Density of hardened concrete" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Specimen condition" value={concreteDensity.specimenCondition} />
        <Info label="Volume method" value={concreteDensity.volumeMethod} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Testing start" value={concreteDensity.testStartDate} />
        <Info label="Testing end" value={concreteDensity.testEndDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 12390-7:2019"} />
        <Info label="Lab location" value={concreteDensity.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory)"} />
        <Info label="Temperature" value={concreteDensity.temperature} />
        <Info label="Relative humidity" value={concreteDensity.humidity} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">Measured parameter</th><th className="px-3 py-2">Unit</th>{[1, 2, 3].map((index) => <th key={index} className="px-3 py-2">Sample {index}</th>)}<th className="px-3 py-2">Average</th><th className="px-3 py-2">Uncertainty</th></tr></thead>
          <tbody className="divide-y divide-line">
            <tr><td className="px-3 py-2 font-semibold text-ink">Densiteti volumor i betonit të ngurtësuar / Density of hardened concrete</td><td className="px-3 py-2">kg/m3</td>{[0, 1, 2].map((index) => <td key={index} className="px-3 py-2">{concreteDensity.specimens[index]?.densityKgM3 ?? "-"}</td>)}<td className="px-3 py-2 font-semibold text-ink">{concreteDensity.averageDensityKgM3}</td><td className="px-3 py-2">5</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{concreteDensity.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUESI / TESTED BY" value={concreteDensity.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={concreteDensity.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function ConcreteIndirectTensileReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concreteIndirectTensile
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concreteIndirectTensile: ConcreteIndirectTensileTest;
}) {
  const shown = [concreteIndirectTensile.specimens[0], concreteIndirectTensile.specimens[1]];
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-B-7.8/1.5" title="RAPORT TESTIMI / TEST REPORT" subtitle="Tensile splitting strength of test specimens" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Address" value={client?.address} />
        <Info label="Contact" value={client?.phone || client?.email} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Casting date" value={concreteIndirectTensile.castingDate} />
        <Info label="Date received" value={sample?.dateReceived} />
        <Info label="Testing start" value={concreteIndirectTensile.testStartDate} />
        <Info label="Testing end" value={concreteIndirectTensile.testEndDate} />
        <Info label="Age / curing" value={concreteIndirectTensile.curingMethod} />
        <Info label="Surface moisture condition" value={concreteIndirectTensile.surfaceCondition} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 12390-6:2009"} />
        <Info label="Lab location" value={concreteIndirectTensile.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory)"} />
        <Info label="Temperature" value={concreteIndirectTensile.temperature} />
        <Info label="Relative humidity" value={concreteIndirectTensile.humidity} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="table-head"><tr><th className="px-3 py-2">Parameter</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Sample 1</th><th className="px-3 py-2">Sample 2</th></tr></thead>
          <tbody className="divide-y divide-line">
            <TwoSampleReportRow label="Length of contact line" unit="mm" values={shown.map((row) => row?.contactLengthMm ?? 0)} />
            <TwoSampleReportRow label="Designated cross-sectional dimension" unit="mm" values={shown.map((row) => row?.crossSectionMm ?? 0)} />
            <TwoSampleReportRow label="Maximum load" unit="N" values={shown.map((row) => row?.maximumLoadN ?? 0)} />
            <TwoSampleReportRow label="Tensile splitting strength" unit="MPa" values={shown.map((row) => row?.tensileStrengthMpa ?? 0)} strong />
            <tr className="bg-lab-porcelain"><td className="px-3 py-2 font-semibold text-ink">Average tensile splitting strength</td><td className="px-3 py-2">MPa</td><td className="px-3 py-2 font-semibold text-ink" colSpan={2}>{concreteIndirectTensile.averageTensileStrengthMpa}</td></tr>
            <tr><td className="px-3 py-2 font-semibold text-ink">Uncertainty of measurement</td><td className="px-3 py-2">MPa</td><td className="px-3 py-2" colSpan={2}>0.55</td></tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      <div className="mt-8 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{concreteIndirectTensile.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={concreteIndirectTensile.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={concreteIndirectTensile.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function TwoSampleReportRow({ label, unit, values, strong }: { label: string; unit: string; values: number[]; strong?: boolean }) {
  const padded = [values[0], values[1]];
  return <tr><td className="px-3 py-2 font-semibold text-ink">{label}</td><td className="px-3 py-2">{unit}</td>{padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}</tr>;
}

function ThermalInsulationReportPreview({
  report,
  test,
  sample,
  client,
  project,
  thermalInsulation
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  thermalInsulation: ThermalInsulationTest;
}) {
  const sampleValues = (selector: (index: number) => number) => [0, 1, 2, 3, 4].map(selector);
  return (
    <section className="report-a4 thermal-report print-surface rounded-md border border-line bg-white p-5 shadow-sm">
      <ReportHeader report={report} code="SL-RA-PT-7.8/1" title="RAPORT TESTIMI / TEST REPORT" subtitle="Physical-mechanical characteristics for thermal insulating products" />
      <div className="mt-4 grid gap-x-4 gap-y-2 text-[11px] leading-tight sm:grid-cols-2">
        <BilingualInfo sq="Nr. regjistri" en="Register No." value={sample?.sampleCode} />
        <BilingualInfo sq="Klienti" en="Purchaser" value={client?.clientName} />
        <BilingualInfo sq="Adresa" en="Address" value={client?.address} />
        <BilingualInfo sq="Kontakti" en="Contact" value={client?.phone || client?.email} />
        <BilingualInfo sq="Objekti" en="Project" value={project?.projectName} />
        <BilingualInfo sq="Mostra" en="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <BilingualInfo sq="Lloji i produktit" en="Type of product" value={thermalInsulation.productType || sample?.sampleType} />
        <BilingualInfo sq="Forma e dorëzimit" en="Delivered form" value={thermalInsulation.deliveredForm} />
        <BilingualInfo sq="Defekte" en="Defects" value={thermalInsulation.defects} />
        <BilingualInfo sq="Data e kampionimit" en="Sampling date" value={sample?.dateReceived} />
        <BilingualInfo sq="Data e pranimit" en="Receipt date" value={sample?.dateReceived} />
        <BilingualInfo sq="Fillimi i testimit" en="Testing start" value={thermalInsulation.testStartDate} />
        <BilingualInfo sq="Përfundimi i testimit" en="Testing end" value={thermalInsulation.testEndDate} />
        <BilingualInfo sq="Operatori i kampionimit" en="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <BilingualInfo sq="Vendndodhja e laboratorit" en="Lab location" value={thermalInsulation.testingLocation || "01/A (Lab. Fiziko-Mekanik / Physical-Mechanical laboratory)"} />
        <BilingualInfo sq="Temperatura" en="Temperature" value={thermalInsulation.temperature} />
        <BilingualInfo sq="Lagështia relative" en="Relative humidity" value={thermalInsulation.humidity} />
      </div>
      <div className="mt-5 rounded-md border border-line">
        <table className="report-table w-full text-left text-[10px] leading-tight">
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[25%]" />
            <col className="w-[13%]" />
            <col className="w-[6%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[7%]" />
            <col className="w-[5%]" />
          </colgroup>
          <thead className="table-head">
            <tr><th className="px-1.5 py-1.5"><Bilingual sq="Nr." en="No." /></th><th className="px-1.5 py-1.5"><Bilingual sq="Parametri i matur" en="Measured parameter" /></th><th className="px-1.5 py-1.5"><Bilingual sq="Standardi" en="Test standard" /></th><th className="px-1.5 py-1.5"><Bilingual sq="Njësia" en="Unit" /></th>{[1, 2, 3, 4, 5].map((index) => <th key={index} className="px-1.5 py-1.5"><Bilingual sq={`M${index}`} en={`S${index}`} /></th>)}<th className="px-1.5 py-1.5"><Bilingual sq="Mes." en="Avg." /></th><th className="px-1.5 py-1.5"><Bilingual sq="Pasig." en="Unc." /></th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            <ThermalReportRow no="1" labelSq="Përcaktimi i gjatësisë" labelEn="Determination of length" standard="BS EN 822:2013" unit="mm" values={sampleValues((i) => thermalInsulation.specimens[i]?.lengthMm ?? 0)} average={thermalInsulation.averages.lengthMm} uncertainty="1.4" />
            <ThermalReportRow no="2" labelSq="Përcaktimi i gjerësisë" labelEn="Determination of width" standard="BS EN 822:2013" unit="mm" values={sampleValues((i) => thermalInsulation.specimens[i]?.widthMm ?? 0)} average={thermalInsulation.averages.widthMm} uncertainty="1.7" />
            <ThermalReportRow no="3" labelSq="Përcaktimi i trashësisë" labelEn="Determination of thickness" standard="BS EN 823:2013" unit="mm" values={sampleValues((i) => thermalInsulation.specimens[i]?.thicknessMm ?? 0)} average={thermalInsulation.averages.thicknessMm} uncertainty="1.4" />
            <ThermalReportRow no="4" labelSq="Përcaktimi i densitetit aparent" labelEn="Determination of apparent density" standard="BS EN 1602:2013" unit="kg/m3" values={sampleValues((i) => thermalInsulation.specimens[i]?.apparentDensityKgM3 ?? 0)} average={thermalInsulation.averages.apparentDensityKgM3} uncertainty="1" />
            <ThermalReportRow no="5" labelSq="Absorbimi i ujit me zhytje të pjesshme" labelEn="Short-term water absorption" standard="BS EN ISO 29767:2019" unit="kg/m2" values={sampleValues((i) => thermalInsulation.specimens[i]?.waterAbsorptionKgM2 ?? 0)} average={thermalInsulation.averages.waterAbsorptionKgM2} uncertainty="0.36" />
            <ThermalReportRow no="6" labelSq="Përcaktimi i sjelljes ndaj shtypjes" labelEn="Determination of compression behaviour" standard="BS EN 826:2013" unit="kPa" values={sampleValues((i) => thermalInsulation.specimens[i]?.compressiveStressAtTenPercentKpa || thermalInsulation.specimens[i]?.compressiveStressKpa || 0)} average={thermalInsulation.averages.compressiveStressKpa} uncertainty="2.7" />
          </tbody>
        </table>
      </div>
      <div className="mt-4 soft-panel p-2 text-[10px] leading-tight text-ink"><div className="font-semibold">Notes / Shënime</div><p className="mt-1">{thermalInsulation.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p></div>
      <div className="mt-6 grid gap-4 text-xs sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={thermalInsulation.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={thermalInsulation.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function ThermalReportRow({ no, labelSq, labelEn, standard, unit, values, average, uncertainty }: { no: string; labelSq: string; labelEn: string; standard: string; unit: string; values: number[]; average: number; uncertainty: string }) {
  return <tr><td className="px-1.5 py-1.5 font-semibold text-ink">{no}</td><td className="px-1.5 py-1.5"><Bilingual sq={labelSq} en={labelEn} /></td><td className="px-1.5 py-1.5">{standard}</td><td className="px-1.5 py-1.5">{unit}</td>{values.map((value, index) => <td key={index} className="px-1.5 py-1.5">{value || value === 0 ? value : "-"}</td>)}<td className="px-1.5 py-1.5 font-semibold text-ink">{average}</td><td className="px-1.5 py-1.5">{uncertainty}</td></tr>;
}

function SteelReportPreview({
  report,
  test,
  sample,
  client,
  project,
  steel
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  steel: SteelTensileTest;
}) {
  const reportSpecimens = steel.specimens.filter((specimen) => report.specimenCodes.includes(specimen.specimenCode));
  const diameter = reportSpecimens[0]?.nominalDiameterMm || reportSpecimens[0]?.actualDiameterMm;

  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-H-7.8/1.1"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Steel Rebar Tensile Test"
      />

      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Client / Klienti" value={client?.clientName} />
        <Info label="Address / Adresa" value={client?.address} />
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || "Reinforcement steel rebars"} />
        <Info label="Diameter group" value={diameter ? `${diameter} mm` : "-"} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Receipt date" value={sample?.dateReceived} />
        <Info label="Testing start" value={steel.testStartDate} />
        <Info label="Testing end" value={steel.testEndDate} />
        <Info label="Test standard" value={test?.standard} />
        <Info label="Lab location" value={steel.testingLocation || "02/A Metallic materials testing sector"} />
        <Info label="Temperature" value={steel.temperature} />
        <Info label="Humidity" value={steel.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Classification / Klasifikimi</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Grade</th>
                <th className="px-3 py-2">Yield strength Re</th>
                <th className="px-3 py-2">Tensile strength Rm</th>
                <th className="px-3 py-2">Rm/Re Ratio</th>
                <th className="px-3 py-2">Elongation A</th>
                <th className="px-3 py-2">Unit weight Pn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr><td className="px-3 py-2 font-semibold">B500B</td><td className="px-3 py-2">&gt; 500 MPa</td><td className="px-3 py-2">-</td><td className="px-3 py-2">&gt; 1.06</td><td className="px-3 py-2">-</td><td className="px-3 py-2">By diameter</td></tr>
              <tr><td className="px-3 py-2 font-semibold">B500C</td><td className="px-3 py-2">&gt; 500 MPa</td><td className="px-3 py-2">-</td><td className="px-3 py-2">1.15 - 1.35</td><td className="px-3 py-2">&gt; 14%</td><td className="px-3 py-2">By diameter</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Test Results / Rezultatet e Testimit</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Parameters</th>
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Units</th>
                <th className="px-3 py-2">Sample 1</th>
                <th className="px-3 py-2">Sample 2</th>
                <th className="px-3 py-2">Sample 3</th>
                <th className="px-3 py-2">Average</th>
                <th className="px-3 py-2">Uncertainty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <SteelResultRow label="Original external diameter *" symbol="Ø" unit="mm" values={reportSpecimens.map((s) => s.actualDiameterMm)} uncertainty="0.2" />
              <SteelResultRow label="Unit weight of sample *" symbol="Pn" unit="kg/ml" values={reportSpecimens.map((s) => s.unitWeightKgPerM)} uncertainty="0.019" />
              <SteelResultRow label="Original cross-sectional area" symbol="S0" unit="mm2" values={reportSpecimens.map((s) => s.crossSectionalAreaMm2)} />
              <SteelResultRow label="Minimal cross-sectional area after fracture" symbol="Su" unit="mm2" values={reportSpecimens.map((s) => s.finalCrossSectionalAreaMm2)} />
              <SteelResultRow label="Original gauge length" symbol="L0" unit="mm" values={reportSpecimens.map((s) => s.initialGaugeLengthMm)} />
              <SteelResultRow label="Final gauge length after fracture" symbol="Lu" unit="mm" values={reportSpecimens.map((s) => s.finalGaugeLengthMm)} />
              <SteelResultRow label="Upper yield strength" symbol="Re" unit="MPa" values={reportSpecimens.map((s) => s.yieldStrengthMpa)} />
              <SteelResultRow label="Tensile strength *" symbol="Rm" unit="MPa" values={reportSpecimens.map((s) => s.tensileStrengthMpa)} uncertainty="15.6" />
              <SteelResultRow label="Ratio" symbol="Rm/Re" unit="-" values={reportSpecimens.map((s) => s.yieldStrengthMpa ? round(s.tensileStrengthMpa / s.yieldStrengthMpa, 2) : 0)} />
              <SteelResultRow label="Reduction area of cross-sectional" symbol="Z" unit="%" values={reportSpecimens.map((s) => s.reductionOfAreaPercent)} />
              <SteelResultRow label="Percentage elongation after fracture *" symbol="A" unit="%" values={reportSpecimens.map((s) => s.elongationPercent)} uncertainty="0.5" />
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{steel.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUESI / TESTED BY" value={steel.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={steel.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function SteelResultRow({ label, symbol, unit, values, uncertainty }: { label: string; symbol: string; unit: string; values: number[]; uncertainty?: string }) {
  const padded = [values[0], values[1], values[2]];
  const valid = values.filter((value) => typeof value === "number" && !Number.isNaN(value));
  const average = valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, 2) : 0;
  return (
    <tr>
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 font-semibold text-ink">{symbol}</td>
      <td className="px-3 py-2">{unit}</td>
      {padded.map((entry, index) => <td key={index} className="px-3 py-2">{entry || entry === 0 ? entry : "-"}</td>)}
      <td className="px-3 py-2 font-semibold text-ink">{average || "-"}</td>
      <td className="px-3 py-2">{uncertainty ?? "-"}</td>
    </tr>
  );
}

function AggregateReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregate
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregate: AggregateGradationTest;
}) {
  const rows = aggregate.rows;
  const chartPoints = rows
    .filter((row) => row.sieveSizeMm > 0)
    .map((row, index, visibleRows) => {
      const x = visibleRows.length <= 1 ? 40 : 40 + (index / (visibleRows.length - 1)) * 520;
      const y = 220 - (row.cumulativePassingPercent / 100) * 170;
      return `${round(x, 1)},${round(y, 1)}`;
    })
    .join(" ");

  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.1.a"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Granulometri sipas BS EN"
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
        <Info label="Testing start" value={aggregate.testStartDate} />
        <Info label="Testing end" value={aggregate.testEndDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard} />
        <Info label="Test method" value={aggregate.testMethod} />
        <Info label="Lab location" value={aggregate.testingLocation} />
        <Info label="Temperature" value={aggregate.temperature} />
        <Info label="Relative humidity" value={aggregate.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Test Results / Rezultatet e Testimit</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Sieves [mm]</th>
                <th className="px-3 py-2">Progressive retaining mass [g]</th>
                <th className="px-3 py-2">Progressive retaining mass [%]</th>
                <th className="px-3 py-2">Cumulative passing [%]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) => (
                <tr key={row.sieveSizeMm}>
                  <td className="px-3 py-2 font-semibold text-ink">{row.sieveSizeMm}</td>
                  <td className="px-3 py-2">{row.cumulativeRetainedMassG}</td>
                  <td className="px-3 py-2">{row.cumulativeRetainedPercent}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{row.cumulativePassingPercent}</td>
                </tr>
              ))}
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink">Sample mass before testing</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregate.sampleMassG} g</td>
                <td className="px-3 py-2">100</td>
                <td className="px-3 py-2" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Grain Size Distribution Graph</h3>
        <div className="mt-3 rounded-md border border-line bg-white p-4">
          <svg viewBox="0 0 600 250" className="h-64 w-full" role="img" aria-label="Particle size distribution chart">
            <line x1="40" y1="220" x2="560" y2="220" stroke="#DCE3E6" />
            <line x1="40" y1="50" x2="40" y2="220" stroke="#DCE3E6" />
            {[0, 25, 50, 75, 100].map((tick) => {
              const y = 220 - (tick / 100) * 170;
              return (
                <g key={tick}>
                  <line x1="36" y1={y} x2="560" y2={y} stroke="#F1F3F4" />
                  <text x="8" y={y + 4} fontSize="11" fill="#6F7186">{tick}</text>
                </g>
              );
            })}
            {chartPoints ? <polyline points={chartPoints} fill="none" stroke="#5B193F" strokeWidth="3" /> : null}
            <text x="250" y="244" fontSize="12" fill="#373455">Sieve size</text>
            <text x="0" y="36" fontSize="12" fill="#373455">Passing %</text>
          </svg>
        </div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregate.notes || "Asterisk (*) means that the laboratory is accredited for this test. Results relate only to the items tested."}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUAR NGA / TESTED BY" value={aggregate.technicianName} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregate.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateChemicalReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateChemical
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateChemical: AggregateChemicalTest;
}) {
  const results = aggregateChemical.results;

  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.10"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Sulfate dhe klorure në agregate"
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
        <Info label="Testing start" value={aggregateChemical.testStartDate} />
        <Info label="Testing end" value={aggregateChemical.testEndDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 1744-1:2009+A1:2012"} />
        <Info label="Lab location" value={aggregateChemical.testingLocation || "01/B Laboratori Kimik / Chemical laboratory"} />
        <Info label="Temperature" value={aggregateChemical.temperature} />
        <Info label="Relative humidity" value={aggregateChemical.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Tests for chemical properties of aggregates / Chemical analysis</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">No.</th>
                <th className="px-3 py-2">Testing parameter / Parametri i testimit</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2">Method / Metoda</th>
                <th className="px-3 py-2">Result / Rezultati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <ChemicalReportRow no="1" parameter="Acid soluble sulfate content in aggregate samples (SO3)" unit="%" method="Shpërbërja në acid / By acid digestion" result={results.acidSolubleSulfateSo3Percent} />
              <ChemicalReportRow no="1b" parameter="Acid soluble sulfate content in aggregate samples (SO4)" unit="%" method="Shpërbërja në acid / By acid digestion" result={results.acidSolubleSulfateSo4Percent} />
              <ChemicalReportRow no="2" parameter="Water soluble sulfates (SO3)" unit="%" method="Ekstraktimi në ujë / Water extraction" result={results.waterSolubleSulfateSo3Percent} />
              <ChemicalReportRow no="3" parameter="Water soluble chloride salts" unit="%" method="Metoda Volhard / Volhard method" result={results.chloridePercent} />
              <ChemicalReportRow no="4" parameter="Total sulfur content" unit="%" method="Shpërbërja në acid / By acid digestion" result={results.totalSulfurPercent} />
              <ChemicalReportRow no="5" parameter="Loss on ignition" unit="%" method="Gravimetri / Gravimetry" result={results.lossOnIgnitionPercent} />
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateChemical.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUAR NGA / TESTED BY" value={aggregateChemical.technicianName || "Ing./Eng. Anxhela KANTO"} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateChemical.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateLosAngelesReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateLosAngeles
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateLosAngeles: AggregateLosAngelesTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.12"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Los Angeles fragmentation test"
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
        <Info label="Testing start" value={aggregateLosAngeles.testStartDate} />
        <Info label="Testing end" value={aggregateLosAngeles.testEndDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 1097-2:2020"} />
        <Info label="Lab location" value={aggregateLosAngeles.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical Laboratory"} />
        <Info label="Temperature" value={aggregateLosAngeles.temperature} />
        <Info label="Relative humidity" value={aggregateLosAngeles.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Determination of resistance to fragmentation / Los Angeles test</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Passing mass sieve [mm]</th>
                <th className="px-3 py-2">Retaining mass sieve [mm]</th>
                <th className="px-3 py-2">Units</th>
                <th className="px-3 py-2">Test results</th>
                <th className="px-3 py-2">Measurement uncertainty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {aggregateLosAngeles.rows.map((row, index) => (
                <tr key={`${row.passingSieveMm}-${row.retainingSieveMm}-${index}`}>
                  <td className="px-3 py-2 font-semibold text-ink">{row.passingSieveMm}</td>
                  <td className="px-3 py-2 font-semibold text-ink">{row.retainingSieveMm}</td>
                  <td className="px-3 py-2">g</td>
                  <td className="px-3 py-2">{row.fractionMassG}</td>
                  <td className="px-3 py-2">{index === 0 ? "0.01" : "-"}</td>
                </tr>
              ))}
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink" colSpan={2}>Totali / Total</td>
                <td className="px-3 py-2">g</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateLosAngeles.totalMassG}</td>
                <td className="px-3 py-2" />
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>Masa mbetëse në sitën 1.6 mm / Mass retaining the sieve 1.6 mm</td>
                <td className="px-3 py-2">g</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateLosAngeles.retainedOnOnePointSixMmG}</td>
                <td className="px-3 py-2" />
              </tr>
              <tr>
                <td className="px-3 py-2" colSpan={2}>Masa kaluese në sitën 1.6 mm / Mass passing the sieve 1.6 mm</td>
                <td className="px-3 py-2">g</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateLosAngeles.passingOnePointSixMmG}</td>
                <td className="px-3 py-2" />
              </tr>
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink" colSpan={2}>Humbjet në fragmentim / Weight loss in fragmentation</td>
                <td className="px-3 py-2">%</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateLosAngeles.fragmentationLossPercent}</td>
                <td className="px-3 py-2" />
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateLosAngeles.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUAR NGA / TESTED BY" value={aggregateLosAngeles.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateLosAngeles.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateFreezeThawReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateFreezeThaw
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateFreezeThaw: AggregateFreezeThawTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.13"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Freeze-thaw resistance of aggregates"
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
        <Info label="Testing start" value={aggregateFreezeThaw.testStartDate} />
        <Info label="Testing end" value={aggregateFreezeThaw.testEndDate} />
        <Info label="Freeze-thaw cycles No." value={String(aggregateFreezeThaw.totalCycles || "-")} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 1367-1:2007"} />
        <Info label="Lab location" value={aggregateFreezeThaw.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-mechanical laboratory"} />
        <Info label="Temperature" value={aggregateFreezeThaw.temperature} />
        <Info label="Relative humidity" value={aggregateFreezeThaw.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Determination of resistance to freezing and thawing</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Measured parameter</th>
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Unit</th>
                {aggregateFreezeThaw.specimens.map((specimen, index) => (
                  <th key={specimen.specimenCode || index} className="px-3 py-2">Sample {index + 1}</th>
                ))}
                <th className="px-3 py-2">Average</th>
                <th className="px-3 py-2">Uncertainty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <FreezeThawResultRow label="Maximum aggregate size" symbol="Dmax" unit="mm" values={aggregateFreezeThaw.specimens.map((row) => row.maximumAggregateSizeMm)} />
              <FreezeThawResultRow label="Sample weight" symbol="M1" unit="g" values={aggregateFreezeThaw.specimens.map((row) => row.initialDryMassG)} />
              <FreezeThawResultRow label="Sieve size used after cycles" symbol="-" unit="mm" values={aggregateFreezeThaw.specimens.map((row) => row.washingSieveSizeMm)} />
              <FreezeThawResultRow label="Sample weight after freeze-thaw cycles and final dry" symbol="M2" unit="g" values={aggregateFreezeThaw.specimens.map((row) => row.finalDryMassG)} />
              <FreezeThawResultRow label="Percentage loss in mass after freeze-thaw cycling" symbol="F" unit="%" values={aggregateFreezeThaw.specimens.map((row) => row.massLossPercent)} average={aggregateFreezeThaw.averageMassLossPercent} uncertainty="0.6" />
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Qualitative Examination</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Sample</th>
                <th className="px-3 py-2">Particles before test</th>
                <th className="px-3 py-2">Split particles after test</th>
                <th className="px-3 py-2">Cracked particles after test</th>
                <th className="px-3 py-2">Flaked particles after test</th>
                <th className="px-3 py-2">Particles after test</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {aggregateFreezeThaw.specimens.map((specimen, index) => (
                <tr key={`${specimen.specimenCode}-${index}`}>
                  <td className="px-3 py-2 font-semibold text-ink">{specimen.specimenCode || `Sample ${index + 1}`}</td>
                  <td className="px-3 py-2">{specimen.particlesBefore || "-"}</td>
                  <td className="px-3 py-2">{specimen.splitParticles || "-"}</td>
                  <td className="px-3 py-2">{specimen.crackedParticles || "-"}</td>
                  <td className="px-3 py-2">{specimen.flakedParticles || "-"}</td>
                  <td className="px-3 py-2">{specimen.particlesAfter || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateFreezeThaw.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUAR NGA / TESTED BY" value={aggregateFreezeThaw.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateFreezeThaw.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateAcvReportPreview({
  report,
  test,
  sample,
  client,
  project,
  aggregateAcv
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  aggregateAcv: AggregateAcvTest;
}) {
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader
        report={report}
        code="SL-RA-AG-7.8/1.15"
        title="RAPORT TESTIMI / TEST REPORT"
        subtitle="Aggregate Crushing Value (ACV)"
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
        <Info label="Testing start" value={aggregateAcv.testStartDate} />
        <Info label="Testing end" value={aggregateAcv.testEndDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
        <Info label="Test standard" value={test?.standard || "BS EN 1097-2:2020"} />
        <Info label="Lab location" value={aggregateAcv.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory"} />
        <Info label="Temperature" value={aggregateAcv.temperature} />
        <Info label="Relative humidity" value={aggregateAcv.humidity} />
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">Aggregate Crushing Value / Rezistenca në thërrmim</h3>
        <div className="mt-3 overflow-x-auto rounded-md border border-line">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-3 py-2">Measured parameter</th>
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Units</th>
                <th className="px-3 py-2">Test Result 1</th>
                <th className="px-3 py-2">Test Result 2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <tr>
                <td className="px-3 py-2">Total weight of dry sample taken</td>
                <td className="px-3 py-2 font-semibold text-ink">W1</td>
                <td className="px-3 py-2">g</td>
                <td className="px-3 py-2">{aggregateAcv.test1.totalDrySampleMassG}</td>
                <td className="px-3 py-2">{aggregateAcv.test2.totalDrySampleMassG}</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Weight of portion passing 2.36 mm sieve</td>
                <td className="px-3 py-2 font-semibold text-ink">W2</td>
                <td className="px-3 py-2">g</td>
                <td className="px-3 py-2">{aggregateAcv.test1.passingTwoPointThirtySixMmMassG}</td>
                <td className="px-3 py-2">{aggregateAcv.test2.passingTwoPointThirtySixMmMassG}</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Aggregate Crushing Value</td>
                <td className="px-3 py-2 font-semibold text-ink">W2/W1 * 100</td>
                <td className="px-3 py-2">%</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateAcv.test1.acvPercent}</td>
                <td className="px-3 py-2 font-semibold text-ink">{aggregateAcv.test2.acvPercent}</td>
              </tr>
              <tr className="bg-lab-porcelain">
                <td className="px-3 py-2 font-semibold text-ink">Mean aggregate crushing value</td>
                <td className="px-3 py-2 font-semibold text-ink">ACV avg.</td>
                <td className="px-3 py-2">%</td>
                <td className="px-3 py-2 font-semibold text-ink" colSpan={2}>{aggregateAcv.averageAcvPercent}</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Uncertainty of measurement</td>
                <td className="px-3 py-2 font-semibold text-ink">U</td>
                <td className="px-3 py-2">%</td>
                <td className="px-3 py-2" colSpan={2}>1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-xs text-muted">Asterisk (*) means that the laboratory is accredited for this test.</div>
      </div>

      <div className="mt-8 soft-panel p-4 text-sm text-ink">
        <div className="font-semibold">Notes / Shënime</div>
        <p className="mt-1">{aggregateAcv.notes || "Results relate only to the items tested. The laboratory is not responsible for the sampling phase."}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUAR NGA / TESTED BY" value={aggregateAcv.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateAcv.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateDensityReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUESI / TESTED BY" value={aggregateDensity.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateDensity.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateFillerDensityReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUESI / TESTED BY" value={aggregateFillerDensity.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateFillerDensity.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateSoundnessReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateSoundness.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateSoundness.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function AggregateElongationReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code="SL-RA-AG-7.8/1.5" title="RAPORT TESTIMI / TEST REPORT" subtitle="Elongation Index of aggregates" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Client / Purchaser" value={client?.clientName} />
        <Info label="Object / Project" value={project?.projectName} />
        <Info label="Sample" value={sample?.sampleDescription || sample?.sampleType} />
        <Info label="Sampling date" value={sample?.dateReceived} />
        <Info label="Testing date" value={aggregateElongation.testStartDate} />
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateElongation.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={aggregateElongation.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function AggregateBulkDensityReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateBulkDensity.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={aggregateBulkDensity.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function AggregateSandEquivalentReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateSandEquivalent.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={aggregateSandEquivalent.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function AggregateShapeIndexReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUESI / TESTED BY" value={aggregateShapeIndex.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregateShapeIndex.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function AggregateFlakinessReportPreview({
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
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={sample?.collectionMethod === "Delivered by client" ? "KLIENTI / CLIENT" : sample?.collectedBy} />
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Signature label="TESTUAR NGA / TESTED BY" value={aggregateFlakiness.technicianName || report.draftedBy} />
        <Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={aggregateFlakiness.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>
    </section>
  );
}

function DensityReportRow({ no, label, unit, values }: { no: string; label: string; unit: string; values: number[] }) {
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

function FillerDensityReportRow({ label, symbol, unit, values }: { label: string; symbol: string; unit: string; values: number[] }) {
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

function FreezeThawResultRow({ label, symbol, unit, values, average, uncertainty }: { label: string; symbol: string; unit: string; values: number[]; average?: number; uncertainty?: string }) {
  const valid = values.filter((value) => Number.isFinite(value));
  const rowAverage = average ?? (valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, 2) : 0);
  return (
    <tr>
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 font-semibold text-ink">{symbol}</td>
      <td className="px-3 py-2">{unit}</td>
      {values.map((value, index) => <td key={index} className="px-3 py-2">{value || value === 0 ? value : "-"}</td>)}
      <td className="px-3 py-2 font-semibold text-ink">{rowAverage || rowAverage === 0 ? rowAverage : "-"}</td>
      <td className="px-3 py-2">{uncertainty ?? "-"}</td>
    </tr>
  );
}

function ChemicalReportRow({ no, parameter, unit, method, result }: { no: string; parameter: string; unit: string; method: string; result: number }) {
  return (
    <tr>
      <td className="px-3 py-2 font-semibold text-ink">{no}</td>
      <td className="px-3 py-2">{parameter}</td>
      <td className="px-3 py-2">{unit}</td>
      <td className="px-3 py-2">{method}</td>
      <td className="px-3 py-2 font-semibold text-ink">{result || result === 0 ? result : "-"}</td>
    </tr>
  );
}

function Signature({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-t border-slate-300 pt-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value ?? "Signature"}</div>
    </div>
  );
}
