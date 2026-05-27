"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";

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
  thermalInsulation,
  cementConsistency,
  cementStrength,
  cementBlaine,
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
  thermalInsulation?: ThermalInsulationTest;
  cementConsistency?: CementConsistencyTest;
  cementStrength?: CementStrengthTest;
  cementBlaine?: CementBlaineTest;
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

  const selectedSpecimenCodes = report.specimenCodes ?? [];
  const reportSpecimens = concrete?.specimens?.length
    ? selectedSpecimenCodes.length
      ? concrete.specimens.filter((specimen) => selectedSpecimenCodes.includes(specimen.specimenCode))
      : concrete.specimens
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

  const paddedSpecimens = [reportSpecimens[0], reportSpecimens[1], reportSpecimens[2]];
  const issueDate = report.issuedAt || report.approvedAt || concrete?.testEndDate || concrete?.testDate || sample?.reportDueDate;
  const otherData = sample?.notes
    ?.split("|")
    .find((note) => !note.includes("Intervali i akredituar") && !note.includes("Standardi i kampionimit") && !note.match(new RegExp("C\\d+/\\d+")))
    ?.trim();

  return (
    <section className="report-a4 concrete-cube-report print-surface relative rounded-md border border-line bg-white p-4 text-[11pt] leading-[1.16] text-black shadow-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <header className="border-b border-black pb-1">
        <div className="grid grid-cols-[120px_1fr_105px] items-start gap-3">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[100px]" />
          <div className="pt-2 text-center">
            <div className="font-bold uppercase">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-3 text-[10pt] font-bold">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="ml-auto h-auto w-[90px]" />
        </div>
        <div className="mt-1 text-[9pt] italic leading-tight">
          <div>Kodi / Code: SL-RA-B-7.8/1.3</div>
          <div>Faqe / Page: 1/1</div>
        </div>
      </header>

      <div className="mt-3 grid grid-cols-[335px_1fr] gap-x-5 gap-y-1 text-[11pt] leading-[1.18]">
        <ConcreteCubeMeta label="Nr. REGJISTRI / REGISTER No.:" value={sample?.sampleCode} />
        <ConcreteCubeMeta label="KLIENTI / PURCHASER:" value={client?.clientName} />
        <ConcreteCubeMeta label="ADRESA / ADDRESS:" value={client?.address} />
        <ConcreteCubeMeta label="KONTAKTET / CONTACT:" value={client?.phone || client?.email} />
        <ConcreteCubeMeta label="OBJEKTI / OBJECT:" value={project?.projectName} />
        <ConcreteCubeMeta label="ELEMENTI / ELEMENT:" value={sample?.sampleDescription} />
        <ConcreteCubeMeta label="TË DHËNA TË TJERA / OTHER DATA:" value={otherData} />
        <ConcreteCubeMeta label="KAMPIONI / SAMPLE:" value="KUBIKË BETONI / CONCRETE CUBE" />
        <ConcreteCubeMeta label="KLASA E REZISTENCËS / STRENGTH CLASS:" value={strengthClass || "-"} />
        <ConcreteCubeMeta label="DATA E PRANIMIT TË KAMPIONIT NË LABORATOR / SAMPLE'S RECEIVING DATE:" value={formatEuropeanDate(sample?.dateReceived)} />
        <div className="contents">
          <div className="font-bold">DATA E TESTIMIT / <span className="italic">TESTING DATE</span></div>
          <div className="grid grid-cols-[105px_1fr] gap-x-3">
            <span className="font-bold">FILLIMI / <span className="italic">STARTING</span>:</span>
            <span>{formatEuropeanDate(concrete?.testStartDate || concrete?.testDate)}</span>
            <span className="font-bold">MBARIMI / <span className="italic">ENDING</span>:</span>
            <span>{formatEuropeanDate(concrete?.testEndDate || concrete?.testDate)}</span>
          </div>
        </div>
        <ConcreteCubeMeta label="TESTIMI / TEST:" value="REZISTENCA NË SHTYPJE E BETONIT TË NGURTËSUAR * / COMPRESSIVE STRENGTH OF TEST SPECIMENS *" />
        <ConcreteCubeMeta label="STANDARDI I TESTIMIT / TEST STANDARD:" value={test?.standard || "BS EN 12390-3:2019"} />
        <ConcreteCubeMeta label="VENDI KU ËSHTË PERFORMUAR TESTI / LAB. LOCATION:" value={concrete?.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"} />
        <div className="contents">
          <div className="font-bold">KUSHTET AMBJENTALE NË TË CILAT ZHVILLOHET TESTI / <span className="italic">ENVIRONMENTAL CONDITIONS</span>:</div>
          <div className="grid grid-cols-[115px_120px] gap-x-3">
            <span>Temperatura / <span className="italic">Temperature</span>:</span><span className="border-b border-black text-center">{concrete?.temperature || "-"}</span>
            <span>Lagështia / <span className="italic">Humidity</span>:</span><span className="border-b border-black text-center">{concrete?.humidity || "-"}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 font-bold">Të dhëna të Kampionit / <span className="italic">Test specimen characteristics</span></div>
      <table className="mt-1 w-full border-collapse text-center text-[9.5pt] leading-[1.12]">
        <thead>
          <tr>
            <th className="border border-black p-0.5">Kampioni<br /><span className="font-normal italic">Test specimen</span></th>
            <th className="border border-black p-0.5">Gjatësia e kampionit<br /><span className="font-normal italic">Length of specimen</span></th>
            <th className="border border-black p-0.5">Gjerësia e kampionit<br /><span className="font-normal italic">Width of specimen</span></th>
            <th className="border border-black p-0.5">Lartësia e kampionit<br /><span className="font-normal italic">Height of specimen</span></th>
            <th className="border border-black p-0.5">Sipërfaqja e kampionit<br /><span className="font-normal italic">Compressive area</span></th>
            <th className="border border-black p-0.5">Pesha e kampionit<br /><span className="font-normal italic">Weight of specimen</span></th>
            <th className="border border-black p-0.5">Densiteti i betonit<br /><span className="font-normal italic">Apparent density</span></th>
          </tr>
          <tr>
            <th className="border border-black p-0.5">nº</th><th className="border border-black p-0.5">(mm)</th><th className="border border-black p-0.5">(mm)</th><th className="border border-black p-0.5">(mm)</th><th className="border border-black p-0.5">(mm²)</th><th className="border border-black p-0.5">(kg)</th><th className="border border-black p-0.5">(kg/m³)</th>
          </tr>
        </thead>
        <tbody>
          {paddedSpecimens.map((specimen, index) => (
            <tr key={`cube-characteristic-${index}`}>
              <td className="border border-black p-0.5">{specimen ? index + 1 : ""}</td>
              <td className="border border-black p-0.5">{specimen?.lengthMm ?? ""}</td>
              <td className="border border-black p-0.5">{specimen?.widthMm ?? ""}</td>
              <td className="border border-black p-0.5">{specimen?.heightMm ?? ""}</td>
              <td className="border border-black p-0.5">{specimen ? specimen.lengthMm * specimen.widthMm : ""}</td>
              <td className="border border-black p-0.5">{specimen?.weightKg ?? ""}</td>
              <td className="border border-black p-0.5">{specimen ? specimenDensity(specimen) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 font-bold">Rezultatet e testimit / <span className="italic">Test results</span></div>
      <table className="mt-1 w-full border-collapse text-center text-[9.5pt] leading-[1.12]">
        <thead>
          <tr>
            <th className="border border-black p-0.5">Kampioni<br /><span className="font-normal italic">Test specimen</span></th>
            <th className="border border-black p-0.5">Data e betonimit<br /><span className="font-normal italic">Casting date</span></th>
            <th className="border border-black p-0.5">Data e testimit<br /><span className="font-normal italic">Testing date</span></th>
            <th className="border border-black p-0.5">Maturimi<br /><span className="font-normal italic">Curing</span></th>
            <th className="border border-black p-0.5">Mënyra e shkatërrimit<br /><span className="font-normal italic">Type of failure</span></th>
            <th className="border border-black p-0.5">Ngarkesa maksimale në shkatërrim<br /><span className="font-normal italic">Maximum load at failure</span></th>
            <th className="border border-black p-0.5">Rezistenca në shtypje e kubit<br /><span className="font-normal italic">Cubes compressive strength</span></th>
          </tr>
          <tr>
            <th className="border border-black p-0.5">nº</th><th className="border border-black p-0.5">(dd/mm/vv)</th><th className="border border-black p-0.5">(dd/mm/vv)</th><th className="border border-black p-0.5">(ditë / days)</th><th className="border border-black p-0.5"></th><th className="border border-black p-0.5">(kN)</th><th className="border border-black p-0.5">(MPa)</th>
          </tr>
        </thead>
        <tbody>
          {paddedSpecimens.map((specimen, index) => (
            <tr key={`cube-result-${index}`}>
              <td className="border border-black p-0.5">{specimen ? index + 1 : ""}</td>
              <td className="border border-black p-0.5">{specimen ? formatEuropeanDate(concrete?.castingDate) : ""}</td>
              <td className="border border-black p-0.5">{specimen ? formatEuropeanDate(concrete?.testDate || concrete?.testEndDate) : ""}</td>
              <td className="border border-black p-0.5">{specimen?.ageDays ?? ""}</td>
              <td className="border border-black p-0.5">{specimen ? specimen.visualInspection || "Normale / Normal" : ""}</td>
              <td className="border border-black p-0.5">{specimen?.maximumLoadKn ?? ""}</td>
              <td className="border border-black p-0.5">{specimen?.compressiveStrengthMpa ?? ""}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black p-0.5 text-left" colSpan={6}>Vlera mesatare e qëndrueshmërisë në shtypje / <span className="italic">Average cubes compressive strength</span> : R<sub>mes</sub> = (R<sub>1</sub>+R<sub>2</sub>+...+R<sub>n</sub>) / n</td>
            <td className="border border-black p-0.5 font-bold">{averageStrength ?? ""}</td>
          </tr>
          <tr>
            <td className="border border-black p-0.5 text-left" colSpan={6}>Pasiguria në matje / <span className="italic">Measurement uncertainty</span></td>
            <td className="border border-black p-0.5 font-bold">1.5</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-1 text-[10pt]">Yll (*) tregon që testi është i akredituar / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>
      <div className="mt-4 grid grid-cols-[110px_1fr] items-end gap-2">
        <div className="font-bold">Shënime / <span className="italic font-normal">Notes</span>:</div>
        <div className="min-h-4 border-b border-black">{concrete?.notes}</div>
        <div />
        <div className="min-h-4 border-b border-black" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-16 text-center">
        <div><div className="font-bold">TESTUESI / <span className="italic">TESTED BY</span></div><div className="mt-1 font-bold">{concrete?.technicianName || report.draftedBy}</div></div>
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic">LABORATORY RESPONSIBLE</span></div><div className="mt-1 font-bold">{report.approvedBy || "Ing./ Eng. Besiana ALLIU"}</div></div>
      </div>

      <div className="report-disclaimers mt-6 space-y-0.5 text-[9pt] leading-tight">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
        <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
        <p>Deklaroj që testi është kryer në përputhje me standardin. / <span className="italic">I declare that the test was performed in accordance with the standard.</span></p>
      </div>
      <div className="report-issue-date mt-4 grid grid-cols-[300px_150px] items-end gap-4 text-[10pt]">
        <div>Data e lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
        <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
      </div>
      <footer className="mt-3 text-center text-[8pt] leading-tight">
        <div className="font-bold">SARP &amp; LAB</div>
        <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
      </footer>
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

function ConcreteCubeMeta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="contents">
      <div className="font-bold">{label}</div>
      <div className="font-semibold">{value || "-"}</div>
    </div>
  );
}

const commonInfoLabels: Record<string, { sq: string; en: string }> = {
  "Client / Purchaser": { sq: "Klienti", en: "Purchaser" },
  "Client / Klienti": { sq: "Klienti", en: "Client" },
  "Object / Project": { sq: "Objekti / Projekti", en: "Object / Project" },
  "Testing period": { sq: "Periudha e testimit", en: "Testing period" },
  "Testing start": { sq: "Fillimi i testimit", en: "Testing start" },
  "Testing end": { sq: "Përfundimi i testimit", en: "Testing end" },
  "Testing date": { sq: "Data e testimit", en: "Testing date" },
  "Testing place": { sq: "Vendi i testimit", en: "Testing place" }
};

function splitBilingualLabel(label: string) {
  if (commonInfoLabels[label]) return commonInfoLabels[label];
  const parts = label.split(" / ");
  return parts.length >= 2 ? { sq: parts[0], en: parts.slice(1).join(" / ") } : undefined;
}

function Info({ label, value }: { label: string; value?: string }) {
  const bilingual = splitBilingualLabel(label);
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">
        {bilingual ? <Bilingual sq={bilingual.sq} en={bilingual.en} /> : label}
      </div>
      <div className="mt-1 font-medium text-ink">{formatEuropeanDateRange(value)}</div>
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
      <div className="mt-1 font-medium text-ink">{formatEuropeanDateRange(value)}</div>
    </div>
  );
}

type OfficialMetaEntry = {
  sq: string;
  en: string;
  value?: string | number;
  valueClassName?: string;
};

function OfficialReportShell({
  report,
  code,
  title = "RAPORT TESTIM / TEST REPORT",
  children
}: {
  report: Report;
  code: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="report-a4 official-report print-surface relative rounded-md border border-line bg-white p-4 leading-tight text-black shadow-sm">
      <header className="border-b-2 border-black pb-1">
        <div className="grid grid-cols-[130px_1fr_115px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[112px]" />
          <div className="pt-3 text-center">
            <div className="text-[15pt] font-bold uppercase leading-tight">{title}</div>
            <div className="mt-5 text-[10pt] font-bold text-red-600">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="ml-auto mt-1 h-auto w-[88px]" />
        </div>
        <div className="mt-1 text-[9pt] italic leading-tight">
          <div>Kodi / Code: {code}</div>
          <div>Faqe / Page: 1/1</div>
        </div>
      </header>
      {children}
    </section>
  );
}

function OfficialMetaGrid({ entries, className = "mt-6" }: { entries: OfficialMetaEntry[]; className?: string }) {
  return (
    <div className={`${className} grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]`}>
      {entries.map((entry) => (
        <div className="contents" key={`${entry.sq}-${entry.en}`}>
          <div className="font-bold uppercase">{entry.sq} / <span className="italic font-normal normal-case">{entry.en}</span>:</div>
          <div className={`font-semibold ${entry.valueClassName ?? ""}`}>{formatEuropeanDateRange(entry.value?.toString()) || "-"}</div>
        </div>
      ))}
    </div>
  );
}

function OfficialTestingDates({ start, end }: { start?: string; end?: string }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">DATA E TESTIMIT / <span className="italic font-normal normal-case">DATE OF TESTING</span>:</div>
      <div className="grid grid-cols-[105px_1fr] gap-x-4 font-semibold">
        <span>FILLIMI / <span className="italic font-normal">STARTING</span>:</span>
        <span>{formatEuropeanDate(start)}</span>
        <span>MBARIMI / <span className="italic font-normal">ENDING</span>:</span>
        <span>{formatEuropeanDate(end)}</span>
      </div>
    </div>
  );
}

function OfficialEnvironmental({ temperature, humidity }: { temperature?: string; humidity?: string }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">KUSHTET AMBJENTALE NË TË CILAT ZHVILLOHET TESTI / <span className="italic font-normal normal-case">ENVIRONMENTAL CONDITIONS</span>:</div>
      <div className="grid grid-cols-[145px_135px] gap-x-3 font-normal">
        <span>Temperatura / <span className="italic">Temperature</span>:</span>
        <span className="border-b border-black text-center">{temperature || "-"}{temperature ? " °C" : ""}</span>
        <span>Lagështia / <span className="italic">Humidity</span>:</span>
        <span className="border-b border-black text-center">{humidity || "-"}{humidity ? "%" : ""}</span>
      </div>
    </div>
  );
}

function OfficialAsterisk() {
  return <div className="mt-1 text-[9pt]">Yll (*) tregon që testi është i akredituar / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>;
}

function OfficialNotesAndFooter({
  notes,
  testedBy,
  responsible,
  issueDate
}: {
  notes?: string;
  testedBy?: string;
  responsible?: string;
  issueDate?: string;
}) {
  return (
    <>
      <div className="mt-5 grid grid-cols-[120px_1fr] items-end gap-2 text-[9.5pt]">
        <div className="pl-14 italic">Shënime / Notes:</div>
        <div className="min-h-4 border-b border-black">{notes}</div>
        <div />
        <div className="min-h-4 border-b border-black" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-16 text-center text-[9.5pt]">
        <div><div className="font-bold">TESTUAR NGA / <span className="italic font-normal">TESTED BY</span></div><div className="mt-2 font-bold">{testedBy || "-"}</div></div>
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></div><div className="mt-2 font-bold">{responsible || "Ing./Eng. Besiana ALLIU"}</div></div>
      </div>
      <div className="official-disclaimers mt-7 space-y-0.5 text-[7.5pt] leading-tight">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
        <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
      </div>
      <div className="official-issue-date mt-5 grid grid-cols-[285px_150px] items-end gap-4 text-[9pt]">
        <div>Data e lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
        <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
      </div>
      <footer className="official-footer mt-4 text-center text-[6.7pt] leading-tight text-blue-700">
        <div className="font-bold">SARP &amp; LAB</div>
        <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
      </footer>
    </>
  );
}

function sampleDimensions(values: Array<{ lengthMm?: number; widthMm?: number; heightMm?: number }>) {
  return values.map((row) => [row.lengthMm, row.widthMm, row.heightMm].filter(Boolean).join("x")).filter(Boolean).join("; ");
}

function ReportInfoRow({ label, value }: { label: string; value?: string }) {
  const cleanLabel = label.replace(/:$/, "");
  const bilingual = splitBilingualLabel(cleanLabel);
  return (
    <div className="grid border-b border-line md:grid-cols-[280px_1fr]">
      <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">
        {bilingual ? <Bilingual sq={bilingual.sq} en={bilingual.en} /> : `${cleanLabel}:`}
      </div>
      <div className="px-3 py-2 font-medium text-ink">{formatEuropeanDateRange(value)}</div>
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

function MortarReportPreview({
  report,
  test,
  sample,
  client,
  project,
  mortar
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  mortar: MortarTest;
}) {
  const codeByKind: Record<MortarTest["testKind"], string> = {
    granulometry: "SL-RA-LL-7.8/1.1",
    adhesion: "SL-RA-EM-LL-7.8/1.3",
    "compression-flexural": "SL-RA-EM-LL-7.8/1.2a",
    compression: "SL-RA-EM-LL-7.8/1.2b",
    "dry-density": "SL-RA-EM-LL-7.8/1.2",
    "fresh-density": "SL-RA-EM-LL-7.8/1.2",
    chemical: "SL-RA-EM-LL-7.8/1.4a"
  };
  const resultRows =
    mortar.testKind === "granulometry"
      ? mortar.granulometry?.rows.map((row) => [String(row.sieveSizeMm), `${row.retainedMassG}`, `${row.retainedPercent}`, `${row.cumulativeRetainedPercent}`, `${row.passingPercent}`]) ?? []
      : mortar.testKind === "adhesion"
        ? mortar.adhesion?.map((row) => [row.specimenCode, `${row.diameterMm}`, `${row.areaMm2}`, `${row.failureForceN}`, `${row.adhesionStrengthMpa}`, row.failureMode ?? ""]) ?? []
        : mortar.testKind === "dry-density"
          ? mortar.dryDensity?.map((row) => [row.specimenCode, `${row.dryMassG}`, `${row.volumeM3}`, `${row.densityKgM3}`]) ?? []
          : mortar.testKind === "fresh-density"
            ? mortar.freshDensity?.map((row) => [row.specimenCode, `${row.emptyContainerMassG}`, `${row.filledContainerMassG}`, `${row.containerVolumeL}`, `${row.densityKgM3}`]) ?? []
            : mortar.testKind === "chemical"
              ? [
                  ["SiO2", "%", `${mortar.chemical?.silicaPercent ?? 0}`],
                  ["CaO", "%", `${mortar.chemical?.calciumOxidePercent ?? 0}`],
                  ["MgO", "%", `${mortar.chemical?.magnesiumOxidePercent ?? 0}`],
                  ["SO3", "%", `${mortar.chemical?.sulfateSo3Percent ?? 0}`],
                  ["Përmbajtja totale e gëlqeres / Total lime content", "%", `${mortar.chemical?.limeContentPercent ?? 0}`]
                ]
              : mortar.strength?.map((row) => [row.specimenCode, row.testType === "Flexural" ? "Përkulje / Flexural" : "Shtypje / Compressive", `${row.ageDays}`, row.testDate ?? "", `${row.surfaceAreaMm2}`, `${row.loadKn}`, `${row.strengthMpa}`]) ?? [];
  const headers =
    mortar.testKind === "granulometry"
      ? ["Sita [mm]", "Mbetur [g]", "% mbetur", "% kumulative", "% kalon"]
      : mortar.testKind === "adhesion"
        ? ["Mostra", "Diametri [mm]", "Sipërfaqja [mm2]", "Forca [N]", "Rezistenca [MPa]", "Thyerja"]
        : mortar.testKind === "dry-density"
          ? ["Mostra", "Masa [g]", "Vëllimi [m3]", "Densiteti [kg/m3]"]
          : mortar.testKind === "fresh-density"
            ? ["Prova", "Ena bosh [g]", "Ena me llaç [g]", "Vëllimi [L]", "Densiteti [kg/m3]"]
            : mortar.testKind === "chemical"
              ? ["Parametri", "Njësia", "Rezultati"]
              : ["Mostra", "Testi", "Ditë", "Data", "Sipërfaqja [mm2]", "Ngarkesa [kN]", "Rezistenca [MPa]"];

  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code={codeByKind[mortar.testKind]} title="RAPORT TESTIMI / TEST REPORT" subtitle="Llaç / Mortar" />
      <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <Info label="Nr. REGJISTRI / REGISTER No." value={sample?.sampleCode} />
        <Info label="KLIENTI / PURCHASER" value={client?.clientName} />
        <Info label="ADRESA / ADDRESS" value={client?.address} />
        <Info label="OBJEKTI / OBJECT" value={project?.projectName} />
        <Info label="KAMPIONI / SAMPLE" value={sample?.sampleType || "Llaç / Mortar"} />
        <Info label="DATA E PRANIMIT / DATE RECEIVED" value={sample?.dateReceived} />
        <Info label="DATA E TESTIMIT / TESTING DATE" value={`${mortar.testStartDate || "-"} / ${mortar.testEndDate || "-"}`} />
        <Info label="STANDARDI I TESTIMIT / TEST STANDARD" value={test?.standard} />
        <Info label="LLOJI I LLAÇIT / MORTAR TYPE" value={mortar.mortarType} />
        <Info label="KUSHTET E MATURIMIT / CURING CONDITIONS" value={mortar.curingConditions} />
        <Info label="RRJEDHSHMËRIA / FLOW VALUE" value={mortar.flowValue} />
        <Info label="VENDI I TESTIMIT / LAB LOCATION" value={mortar.testingLocation} />
      </div>
      <div className="mt-8 overflow-x-auto rounded-md border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="table-head"><tr>{headers.map((header) => <th key={header} className="px-3 py-2">{header}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">{resultRows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className={`px-3 py-2 ${cellIndex === row.length - 1 ? "font-semibold text-ink" : ""}`}>{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="mt-6 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Përmbledhje / Summary</div><p className="mt-1">{mortar.summary}</p></div>
      <div className="mt-6 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Shënime / Notes</div><p className="mt-1">{mortar.notes || "Rezultatet i përkasin vetëm kampionit të testuar. / Results relate only to the tested sample."}</p></div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={mortar.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={mortar.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
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
  const specimens = [concreteWater.specimens[0], concreteWater.specimens[1], concreteWater.specimens[2]];
  const issueDate = report.issuedAt || report.approvedAt || concreteWater.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.10">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleDescription || sample?.sampleType },
        { sq: "PËRSHKRIMI I KAMPIONËVE (FORMA DHE DIMENSIONET)", en: "DESCRIPTION OF THE SPECIMEN (SHAPE AND DIMENSIONS)", value: `${sampleDimensions(specimens)} mm` },
        { sq: "DATA E PËRGATITJES SË KAMPIONËVE", en: "DATE OF CASTING", value: concreteWater.castingDate },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={concreteWater.testStartDate} end={concreteWater.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "MATURIMI I KAMPIONËVE", en: "CURING PERIOD", value: concreteWater.curingMethod },
          { sq: "DREJTIMI I APLIKIMIT TË PRESIONIT TË UJIT", en: "DIRECTION OF APPLICATION OF WATER PRESSURE", value: concreteWater.pressureDirection },
          { sq: "TESTIMI", en: "TEST", value: "THELLËSIA E PENETRIMIT TË UJIT NËN PRESION NË BETONIN E NGURTËSUAR* / DEPTH OF THE PENETRATION OF WATER UNDER PRESSURE*" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 12390-8:2019" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LAB. LOCATION", value: concreteWater.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory" }
        ]} />
        <OfficialEnvironmental temperature={concreteWater.temperature} humidity={concreteWater.humidity} />
      </div>
      <table className="official-table mt-10 w-full border-collapse text-center text-[10pt]">
        <thead>
          <tr><th>Parametri i matur<br /><span>The measured parameter</span></th><th>Njësia matëse<br /><span>Unit</span></th><th>Mostra 1<br /><span>Sample 1</span></th><th>Mostra 2<br /><span>Sample 2</span></th><th>Mostra 3<br /><span>Sample 3</span></th><th>Mesatarja<br /><span>Average</span></th><th>Pasiguria në matje<br /><span>Measurement uncertainty</span></th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">Thellësia e penetrimit të ujit nën presion në betonin e ngurtësuar<br /><span className="italic">Depth of the penetration of water under pressure</span></td>
            <td>mm</td>
            {specimens.map((specimen, index) => <td key={index}>{specimen?.maxPenetrationMm ?? ""}</td>)}
            <td className="font-bold">{concreteWater.averagePenetrationMm}</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={concreteWater.notes} testedBy={concreteWater.technicianName || report.draftedBy} responsible={concreteWater.checkedBy || report.approvedBy} issueDate={issueDate} />
    </OfficialReportShell>
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
  const specimens = [concreteFlexural.specimens[0], concreteFlexural.specimens[1], concreteFlexural.specimens[2]];
  const issueDate = report.issuedAt || report.approvedAt || concreteFlexural.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.4">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "ELEMENTI", en: "ELEMENT", value: sample?.sampleDescription },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleType },
        { sq: "DATA E PËRGATITJES SË MOSTRËS", en: "DATE OF CASTING", value: concreteFlexural.castingDate },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={concreteFlexural.testStartDate} end={concreteFlexural.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I REZISTENCËS NË PËRKULJE* / FLEXURAL STRENGTH OF TEST SPECIMENS*" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 12390-5:2019" },
          { sq: "TIPI I APARATIT", en: "TYPE OF APPARATUS", value: concreteFlexural.apparatusType || "Aparat dy-pikësor / Two point apparatus" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: concreteFlexural.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory" }
        ]} />
        <OfficialEnvironmental temperature={concreteFlexural.temperature} humidity={concreteFlexural.humidity} />
      </div>
      <table className="official-table mt-5 w-full border-collapse text-center text-[10pt]">
        <thead>
          <tr><th>Parametrat<br /><span>Parameters</span></th><th>Njësia<br /><span>Unit</span></th><th colSpan={3}>Rezultatet e testimit / <span>Test results</span></th></tr>
          <tr><th /><th /><th>Mostra / <span>Sample 1</span></th><th>Mostra / <span>Sample 2</span></th><th>Mostra / <span>Sample 3</span></th></tr>
        </thead>
        <tbody>
          <OfficialThreeValueRow label="Gjerësia e mostrës" en="Specimen width" unit="mm" values={specimens.map((row) => row?.widthMm)} />
          <OfficialThreeValueRow label="Gjatësia e mostrës" en="Specimen length" unit="mm" values={specimens.map((row) => row?.lengthMm)} />
          <OfficialThreeValueRow label="Trashësia e mostrës" en="Specimen thickness" unit="mm" values={specimens.map((row) => row?.thicknessMm)} />
          <OfficialThreeValueRow label="Pesha e mostrës" en="Specimen weight" unit="kg" values={specimens.map((row) => row?.weightKg)} />
          <OfficialThreeValueRow label="Distanca midis pikave mbështetëse" en="Distance between the lower rollers" unit="mm" values={specimens.map((row) => row?.spanMm)} />
          <OfficialThreeValueRow label="Vëllimi i mostrës" en="Specimen volume" unit="m³" values={specimens.map((row) => row?.volumeM3)} />
          <OfficialThreeValueRow label="Densiteti aparent" en="Apparent density" unit="kg/m³" values={specimens.map((row) => row?.apparentDensityKgM3)} />
          <OfficialThreeValueRow label="Forca maksimale në shkatërrim" en="Maximum load failure" unit="kN" values={specimens.map((row) => row?.maximumLoadKn)} />
          <OfficialThreeValueRow label="Rezistenca në përkulje" en="Flexural strength" unit="MPa" values={specimens.map((row) => row?.flexuralStrengthMpa)} strong />
          <tr><td className="text-left font-bold">Pasiguria në matje / <span className="italic font-normal">Uncertainty of measurement</span></td><td className="font-bold">MPa</td><td colSpan={3} className="font-bold">0.5</td></tr>
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={concreteFlexural.notes} testedBy={concreteFlexural.technicianName || report.draftedBy} responsible={concreteFlexural.checkedBy || report.approvedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

function FlexReportRow({ label, unit, values, strong }: { label: string; unit: string; values: number[]; strong?: boolean }) {
  const padded = [values[0], values[1], values[2]];
  return <tr><td className="px-3 py-2 font-semibold text-ink">{label}</td><td className="px-3 py-2">{unit}</td>{padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}</tr>;
}

function OfficialThreeValueRow({ label, en, unit, values, strong }: { label: string; en: string; unit: string; values: Array<number | undefined>; strong?: boolean }) {
  const padded = [values[0], values[1], values[2]];
  return (
    <tr>
      <td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span className="italic font-normal">{en}</span></td>
      <td className={strong ? "font-bold" : ""}>{unit}</td>
      {padded.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{value || value === 0 ? value : ""}</td>)}
    </tr>
  );
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
  const specimens = [concreteDensity.specimens[0], concreteDensity.specimens[1], concreteDensity.specimens[2]];
  const issueDate = report.issuedAt || report.approvedAt || concreteDensity.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.8">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleDescription || sample?.sampleType },
        { sq: "PËRSHKRIMI I KAMPIONËVE (FORMA DHE DIMENSIONET)", en: "DESCRIPTION OF THE SPECIMEN (SHAPE AND DIMENSIONS)", value: sample?.sampleDescription || sample?.sampleType },
        { sq: "KUSHTET E KAMPIONIT NË KOHËN E TESTIMIT", en: "CONDITION OF SPECIMEN AT TIME OF TEST", value: concreteDensity.specimenCondition },
        { sq: "METODA E PËRCAKTIMIT TË VOLUMIT", en: "METHOD OF DETERMINATION OF VOLUME", value: concreteDensity.volumeMethod },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={concreteDensity.testStartDate} end={concreteDensity.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "TESTIMI", en: "TEST", value: "DENSITETI I BETONIT TË NGURTËSUAR * / DENSITY OF HARDENED CONCRETE *" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 12390-7:2019" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LAB. LOCATION", value: concreteDensity.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory" }
        ]} />
        <OfficialEnvironmental temperature={concreteDensity.temperature} humidity={concreteDensity.humidity} />
      </div>
      <table className="official-table mt-10 w-full border-collapse text-center text-[10pt]">
        <thead>
          <tr><th>Parametri i matur<br /><span>The measured parameter</span></th><th>Njësia matëse<br /><span>Unit</span></th><th>Mostra 1<br /><span>Sample 1</span></th><th>Mostra 2<br /><span>Sample 2</span></th><th>Mostra 3<br /><span>Sample 3</span></th><th>Mesatarja<br /><span>Average</span></th><th>Pasiguria në matje<br /><span>Measurement uncertainty</span></th></tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">Densiteti volumor i betonit të ngurtësuar<br /><span className="italic">Density of hardened concrete</span></td>
            <td>kg/m³</td>
            {specimens.map((specimen, index) => <td key={index}>{specimen?.densityKgM3 ?? ""}</td>)}
            <td className="font-bold">{concreteDensity.averageDensityKgM3}</td>
            <td>5</td>
          </tr>
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={concreteDensity.notes} testedBy={concreteDensity.technicianName || report.draftedBy} responsible={concreteDensity.checkedBy || report.approvedBy} issueDate={issueDate} />
    </OfficialReportShell>
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
  const issueDate = report.issuedAt || report.approvedAt || concreteIndirectTensile.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.5" title="RAPORT TESTIMI / TEST REPORT">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "ELEMENTI", en: "ELEMENT", value: sample?.sampleDescription },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleType },
        { sq: "DATA E BETONIMIT", en: "CASTING DATE", value: concreteIndirectTensile.castingDate },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={concreteIndirectTensile.testStartDate} end={concreteIndirectTensile.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "MATURIMI", en: "AGE OF CONCRETE", value: concreteIndirectTensile.curingMethod },
          { sq: "KUSHTET E SIPËRFAQES SË MOSTRËS NË MOMENTIN E TESTIMIT", en: "SURFACE MOISTURE CONDITION AT TIME OF TEST", value: concreteIndirectTensile.surfaceCondition },
          { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I REZISTENCËS NË TËRHEQJE INDIREKTE* / TENSILE SPLITTING STRENGTH OF TEST SPECIMENS*" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 12390-6:2009" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: concreteIndirectTensile.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory" }
        ]} />
        <OfficialEnvironmental temperature={concreteIndirectTensile.temperature} humidity={concreteIndirectTensile.humidity} />
      </div>
      <table className="official-table mt-5 w-full border-collapse text-center text-[10pt]">
        <thead>
          <tr><th>Parametrat<br /><span>Parameters</span></th><th>Njësia<br /><span>Unit</span></th><th colSpan={2}>Rezultatet e Testimit / <span>Test Results</span></th></tr>
          <tr><th /><th /><th>Mostra / <span>Sample 1</span></th><th>Mostra / <span>Sample 2</span></th></tr>
        </thead>
        <tbody>
          <OfficialTwoValueRow label="Gjatësia e vijës së kontaktit të mostrës" en="Length of the line of contact of the specimen" unit="mm" values={shown.map((row) => row?.contactLengthMm)} />
          <OfficialTwoValueRow label="Dimensioni i prerjes tërthore i mostrës" en="Designated cross-sectional dimension" unit="mm" values={shown.map((row) => row?.crossSectionMm)} />
          <OfficialTwoValueRow label="Forca maksimale" en="Maximum load" unit="N" values={shown.map((row) => row?.maximumLoadN)} />
          <OfficialTwoValueRow label="Rezistenca në tërheqje indirekte" en="Tensile splitting strength" unit="MPa" values={shown.map((row) => row?.tensileStrengthMpa)} strong />
          <tr><td className="text-left font-bold">Rezistenca në tërheqje indirekte mesatare<br /><span className="italic font-normal">Average tensile splitting strength</span></td><td className="font-bold">MPa</td><td colSpan={2} className="font-bold">{concreteIndirectTensile.averageTensileStrengthMpa}</td></tr>
          <tr><td className="text-left font-bold">Pasiguria në matje<br /><span className="italic font-normal">Uncertainty of measurement</span></td><td className="font-bold">MPa</td><td colSpan={2} className="font-bold">0.55</td></tr>
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={concreteIndirectTensile.notes} testedBy={concreteIndirectTensile.technicianName || report.draftedBy} responsible={concreteIndirectTensile.checkedBy || report.approvedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

function TwoSampleReportRow({ label, unit, values, strong }: { label: string; unit: string; values: number[]; strong?: boolean }) {
  const padded = [values[0], values[1]];
  return <tr><td className="px-3 py-2 font-semibold text-ink">{label}</td><td className="px-3 py-2">{unit}</td>{padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}</tr>;
}

function OfficialTwoValueRow({ label, en, unit, values, strong }: { label: string; en: string; unit: string; values: Array<number | undefined>; strong?: boolean }) {
  const padded = [values[0], values[1]];
  return (
    <tr>
      <td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span className="italic font-normal">{en}</span></td>
      <td className={strong ? "font-bold" : ""}>{unit}</td>
      {padded.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{value || value === 0 ? value : ""}</td>)}
    </tr>
  );
}

function ConcreteCoreReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concreteCore
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concreteCore: ConcreteCoreTest;
}) {
  const reportSpecimens = report.specimenCodes.length
    ? concreteCore.specimens.filter((specimen) => report.specimenCodes.includes(specimen.specimenCode))
    : concreteCore.specimens;
  const shown = [reportSpecimens[0], reportSpecimens[1]];
  const reportRatioType = shown.some((specimen) => (specimen?.heightDiameterRatio ?? 0) >= 1.5) ? "1:2" : "1:1";
  const averages = {
    diameterCm: averageReportValues(shown.map((row) => row?.diameterCm)),
    heightCm: averageReportValues(shown.map((row) => row?.heightCm)),
    weightKg: averageReportValues(shown.map((row) => row?.weightKg), 3),
    densityKgM3: averageReportValues(shown.map((row) => row?.densityKgM3), 0),
    contactAreaCm2: averageReportValues(shown.map((row) => row?.contactAreaCm2), 1),
    loadKn: averageReportValues(shown.map((row) => row?.loadKn), 1),
    cylindricalStrengthMpa: averageReportValues(shown.map((row) => row?.cylindricalStrengthMpa), 1),
    cubicStrengthMpa: averageReportValues(shown.map((row) => row?.cubicStrengthMpa), 1)
  };
  const reportCode = reportRatioType === "1:2" ? "SL-RA-B-7.8/1.9.2" : "SL-RA-B-7.8/1.9.1";
  const ratioLabel = reportRatioType === "1:2" ? "L/D 1:2" : "L/D 1:1";
  return (
    <section className="report-a4 print-surface rounded-md border border-line bg-white p-8 shadow-sm">
      <ReportHeader report={report} code={reportCode} title="RAPORT TESTIMI / TEST REPORT" subtitle={`Rezistenca në shtypje e karrotave të betonit (${ratioLabel})`} />
      <div className="mt-6 overflow-hidden rounded-md border border-line text-sm">
        <ReportInfoRow label="Nr. REGJISTRI / REGISTER No." value={sample?.sampleCode} />
        <ReportInfoRow label="KLIENTI / PURCHASER" value={client?.clientName} />
        <ReportInfoRow label="ADRESA / ADDRESS" value={client?.address} />
        <ReportInfoRow label="KONTAKTET / CONTACT" value={client?.phone || client?.email} />
        <ReportInfoRow label="OBJEKTI / OBJECT" value={project?.projectName} />
        <ReportInfoRow label="ELEMENTI / ELEMENT" value={concreteCore.element || sample?.sampleDescription} />
        <ReportInfoRow label="KAMPIONI / SAMPLE" value="CILINDËR BETONI / CONCRETE CORE DRILL" />
        <ReportInfoRow label="DATA E MARRJES SË KAMPIONIT / SAMPLING DATE" value={concreteCore.samplingDate || sample?.dateReceived} />
        <ReportInfoRow label="DATA E BETONIMIT / CASTING DATE" value={concreteCore.castingDate || sample?.concretingDate} />
        <div className="grid border-b border-line md:grid-cols-[280px_1fr]">
          <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">DATA E TESTIMIT / TESTING DATE</div>
          <div className="grid md:grid-cols-2">
            <div className="px-3 py-2">FILLIMI / STARTING: <span className="font-semibold text-ink">{formatEuropeanDate(concreteCore.testStartDate)}</span></div>
            <div className="border-t border-line px-3 py-2 md:border-t-0 md:border-l">MBARIMI / ENDING: <span className="font-semibold text-ink">{formatEuropeanDate(concreteCore.testEndDate)}</span></div>
          </div>
        </div>
        <ReportInfoRow label="MATURIMI / CONCRETE AGE" value={shown.map((row) => row?.ageDays).filter(Boolean).join(", ")} />
        <ReportInfoRow label="MADHËSIA MAX E GRIMCËS / ESTIMATED MAX SIZE OF AGGREGATE" value={concreteCore.maximumAggregateSize} />
        <ReportInfoRow label="INSPEKTIMI VIZUAL / VISUAL INSPECTION" value={concreteCore.visualInspection || "OK"} />
        <ReportInfoRow label="PRANI HEKURI / REINFORCEMENT" value={concreteCore.reinforcement} />
        <ReportInfoRow label="PËRGATITJA E KAMPIONIT / PREPARATION OF SPECIMEN METHOD" value={concreteCore.preparationMethod} />
        <ReportInfoRow label="KLASA E REZISTENCËS / RESISTANCE CLASS" value={concreteCore.resistanceClass} />
        <ReportInfoRow label="TESTI / TEST" value="MOSTRAT CILINDRIKE - MARRJA, EKZAMINIMI DHE TESTIMI NË SHTYPJE I TYRE / CORED SPECIMENS - TAKING, EXAMINING AND TESTING IN COMPRESSION" />
        <ReportInfoRow label="STANDARDI I TESTIMIT / TEST STANDARD" value={test?.standard || "BS EN 12504-1:2019"} />
        <ReportInfoRow label="VENDI KU ËSHTË PERFORMUAR TESTI / LAB. LOCATION" value={concreteCore.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical - Mechanical laboratory)"} />
        <div className="grid md:grid-cols-[280px_1fr]">
          <div className="bg-lab-porcelain px-3 py-2 font-semibold text-ink">KUSHTET AMBJENTALE / ENVIRONMENTAL CONDITIONS</div>
          <div className="grid md:grid-cols-2">
            <div className="px-3 py-2">Temperatura / Temperature: <span className="font-semibold text-ink">{concreteCore.temperature || "-"}</span></div>
            <div className="border-t border-line px-3 py-2 md:border-t-0 md:border-l">Lagështia / Humidity: <span className="font-semibold text-ink">{concreteCore.humidity || "-"}</span></div>
          </div>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-md border border-line">
        <table className="report-table w-full min-w-[820px] text-left text-xs">
          <thead className="table-head">
            <tr><th className="px-3 py-2">Nr.</th><th className="px-3 py-2">Parametri i matur<br /><span className="font-normal italic">Measured parameters</span></th><th className="px-3 py-2">Simboli</th><th className="px-3 py-2">Njësia</th><th className="px-3 py-2">Karrota 1</th><th className="px-3 py-2">Karrota 2</th><th className="px-3 py-2">Vlera mesatare</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            <CoreReportRow no="1" label="Diametri i karrotës / Core drill diameter" symbol="D" unit="cm" values={shown.map((row) => row?.diameterCm ?? 0)} average={averages.diameterCm} />
            <CoreReportRow no="2" label="Lartësia e karrotës / Core drill height" symbol="H" unit="cm" values={shown.map((row) => row?.heightCm ?? 0)} average={averages.heightCm} />
            <CoreReportRow no="3" label="Raporti Lartësi - Diameter / L - D Ratio" symbol="L/D" unit="-" values={shown.map((row) => row?.heightDiameterRatio ?? 0)} average={undefined} />
            <CoreReportRow no="4" label="Pesha e karrotës / Core drill weight" symbol="P" unit="kg" values={shown.map((row) => row?.weightKg ?? 0)} average={averages.weightKg} />
            <CoreReportRow no="5" label="Densiteti volumor i betonit të ngurtësuar / Volumetric density of hardened concrete" symbol="γ" unit="kg/m3" values={shown.map((row) => row?.densityKgM3 ?? 0)} average={averages.densityKgM3} />
            <CoreReportRow no="6" label="Sipërfaqja ku aplikohet forca / Contact Area" symbol="A" unit="cm2" values={shown.map((row) => row?.contactAreaCm2 ?? 0)} average={averages.contactAreaCm2} />
            <CoreReportRow no="7" label="Ngarkesa / Load" symbol="F" unit="kN" values={shown.map((row) => row?.loadKn ?? 0)} average={averages.loadKn} />
            <CoreReportRow no="8" label="Rezistenca në shtypje cilindrike / Cylindrical compressive strength" symbol="Rck" unit="MPa" values={shown.map((row) => row?.cylindricalStrengthMpa ?? 0)} average={averages.cylindricalStrengthMpa} strong />
            <CoreReportRow no="9" label="Rezistenca në shtypje kubike / Cubic compressive strength" symbol="Rck" unit="MPa" values={shown.map((row) => row?.cubicStrengthMpa ?? 0)} average={averages.cubicStrengthMpa} strong />
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-xs text-muted">Pasiguria në matje për përcaktimin e rezistencës në shtypje të karrotave të betonit është 0,9 MPa / Determination of compressive strength of concrete core drill measurement uncertainty is 0,9 MPa.</div>
      <div className="mt-1 text-xs text-muted">Yll (*) tregon që testi është i akredituar / Asterisk (*) means that the laboratory is accredited for this test.</div>
      <div className="mt-6 soft-panel p-4 text-sm text-ink"><div className="font-semibold">Shënime / Notes</div><p className="mt-1">{concreteCore.notes || "Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar."}</p></div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={concreteCore.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={concreteCore.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} /></div>
    </section>
  );
}

function CoreReportRow({ no, label, symbol, unit, values, average, strong }: { no: string; label: string; symbol: string; unit: string; values: number[]; average?: number; strong?: boolean }) {
  const padded = [values[0], values[1]];
  return (
    <tr>
      <td className="px-3 py-2 font-semibold text-ink">{no}</td>
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 font-semibold text-ink">{symbol}</td>
      <td className="px-3 py-2">{unit}</td>
      {padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}
      <td className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{average || average === 0 ? average : "-"}</td>
    </tr>
  );
}

function averageReportValues(values: Array<number | undefined>, digits = 1) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, digits) : undefined;
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
  const reportSpecimens = report.specimenCodes?.length ? steel.specimens.filter((specimen) => report.specimenCodes.includes(specimen.specimenCode)) : steel.specimens.slice(0, 3);
  const diameter = reportSpecimens[0]?.nominalDiameterMm || reportSpecimens[0]?.actualDiameterMm;
  const issueDate = report.issuedAt || report.approvedAt || steel.testEndDate || sample?.reportDueDate;

  return (
    <OfficialReportShell report={report} code="SL-RA-H-7.8/1.1" title="RAPORT TESTIMI / TEST REPORT">
      <OfficialMetaGrid entries={[
        { sq: "KLIENTI", en: "CLIENT", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: `${sample?.sampleDescription || sample?.sampleType || "Shufër çeliku / Steel rebar"}${diameter ? ` - Ø ${diameter} mm` : ""}` },
        { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: sample?.dateReceived },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={steel.testStartDate} end={steel.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE PËR MATERIALE METALIKE / METALLIC MATERIALS - TENSILE TESTING" },
          { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN ISO 15630-1:2019; BS EN ISO 6892-1:2020; BS 4449:2005+A3:2016" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LAB. LOCATION", value: steel.testingLocation || "02/A Sektori i testimit të materialeve metalike / Metallic materials testing sector" }
        ]} />
        <OfficialEnvironmental temperature={steel.temperature} humidity={steel.humidity} />
      </div>

      <table className="official-table official-classification mt-5 mx-auto w-[82%] border-collapse text-center text-[8.5pt]">
        <thead>
          <tr><th colSpan={6}>Klasifikimi / <span>Classification</span></th></tr>
          <tr><th>Grade / Grada</th><th>Forca maksimale e ushtruar / Upper yield strength Re<br />[MPa]</th><th>Forca e tërheqjes / Tensile strength Rm<br />[MPa]</th><th>Rm / Re<br />Ratio</th><th>Përqindja e zgjatimit pas këputjes / Percentage elongation after fracture A<br />[%]</th><th>Pesha njësi e kampionit / Unit weight of sample Pn<br />[kg/ml]</th></tr>
        </thead>
        <tbody>
          {["B500B", "B500C", "B450C", "B500S", "S500MC"].map((grade) => <tr key={grade}><td className="font-bold">{grade}</td><td>&gt; 500</td><td>{grade === "B450C" ? "> 540" : "-"}</td><td>{grade === "B500C" ? "1.15 - 1.35" : "> 1.06"}</td><td>{grade === "B500C" ? "> 14" : "-"}</td><td>{reportSpecimens.map((s) => s.unitWeightKgPerM).filter(Boolean).join("   ")}</td></tr>)}
        </tbody>
      </table>

      <table className="official-table mt-5 w-full border-collapse text-center text-[8.8pt]">
        <thead>
          <tr><th>Parametrat / <span>Parameters</span></th><th>Njësitë matëse<br /><span>Units</span></th><th colSpan={4}>Rezultatet e testimit / <span>Test Results</span></th><th>Pasiguria në matje<br /><span>Measurement uncertainty</span></th></tr>
          <tr><th /><th /><th>1</th><th>2</th><th>3</th><th>Mesatare / <span>Average</span></th><th /></tr>
        </thead>
        <tbody>
          <SteelResultRow label="Diametri faktik i kampionit * / Original external diameter *" symbol="Ø" unit="mm" values={reportSpecimens.map((s) => s.actualDiameterMm)} uncertainty="0.2" />
          <SteelResultRow label="Pesha njësi i kampionit * / Unit weight of sample *" symbol="Pn" unit="kg/ml" values={reportSpecimens.map((s) => s.unitWeightKgPerM)} uncertainty="0.019" />
          <SteelResultRow label="Seksioni i tërthortë / Original cross-sectional area" symbol="S0" unit="mm²" values={reportSpecimens.map((s) => s.crossSectionalAreaMm2)} />
          <SteelResultRow label="Seksioni minimal i tërthortë pas frakturës / Minimal cross-sectional area after fracture" symbol="Su" unit="mm²" values={reportSpecimens.map((s) => s.finalCrossSectionalAreaMm2)} />
          <SteelResultRow label="Gjatësia fillestare ndërmjet shenjave / Original gauge length" symbol="L0" unit="mm" values={reportSpecimens.map((s) => s.initialGaugeLengthMm)} />
          <SteelResultRow label="Gjatësia fundore ndërmjet shenjave / Final gauge length after fracture" symbol="Lu" unit="mm" values={reportSpecimens.map((s) => s.finalGaugeLengthMm)} />
          <SteelResultRow label="Ngarkesa maksimale e rrjedhshmërisë / Upper yield strength" symbol="Re" unit="MPa" values={reportSpecimens.map((s) => s.yieldStrengthMpa)} />
          <SteelResultRow label="Rezistenca në tërheqje * / Tensile strength *" symbol="Rm" unit="MPa" values={reportSpecimens.map((s) => s.tensileStrengthMpa)} uncertainty="15.6" />
          <SteelResultRow label="Raporti / Ratio" symbol="Rm / Re" unit="-" values={reportSpecimens.map((s) => s.yieldStrengthMpa ? round(s.tensileStrengthMpa / s.yieldStrengthMpa, 2) : 0)} />
          <SteelResultRow label="Ngushtimi i seksionit të tërthortë / Reduction area of cross-sectional" symbol="Z" unit="%" values={reportSpecimens.map((s) => s.reductionOfAreaPercent)} />
          <SteelResultRow label="Përqindja e zgjatimit pas këputjes * / Percentage elongation after fracture *" symbol="A" unit="%" values={reportSpecimens.map((s) => s.elongationPercent)} uncertainty="0.5" />
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={steel.notes} testedBy={steel.technicianName || report.draftedBy} responsible={steel.checkedBy || report.approvedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

function SteelResultRow({ label, symbol, unit, values, uncertainty }: { label: string; symbol: string; unit: string; values: number[]; uncertainty?: string }) {
  const padded = [values[0], values[1], values[2]];
  const valid = values.filter((value) => typeof value === "number" && !Number.isNaN(value));
  const average = valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, 2) : 0;
  return (
    <tr>
      <td className="text-left"><span>{label}</span><span className="float-right font-bold">{symbol}</span></td>
      <td>{unit}</td>
      {padded.map((entry, index) => <td key={index}>{entry || entry === 0 ? entry : ""}</td>)}
      <td className="font-bold">{average || ""}</td>
      <td>{uncertainty ?? ""}</td>
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
  const sortedChartRows = rows
    .filter((row) => row.sieveSizeMm > 0)
    .sort((a, b) => a.sieveSizeMm - b.sieveSizeMm);
  const chart = {
    left: 52,
    right: 548,
    top: 20,
    bottom: 246,
    min: 0.01,
    max: 125
  };
  const logMin = Math.log10(chart.min);
  const logMax = Math.log10(chart.max);
  const chartX = (sieveSizeMm: number) => {
    const clamped = Math.min(Math.max(sieveSizeMm, chart.min), chart.max);
    return chart.left + ((Math.log10(clamped) - logMin) / (logMax - logMin)) * (chart.right - chart.left);
  };
  const chartY = (passingPercent: number) => chart.bottom - (Math.min(Math.max(passingPercent, 0), 100) / 100) * (chart.bottom - chart.top);
  const passingPoints = sortedChartRows.map((row) => `${round(chartX(row.sieveSizeMm), 1)},${round(chartY(row.cumulativePassingPercent), 1)}`).join(" ");
  const retainedPoints = sortedChartRows.map((row) => `${round(chartX(row.sieveSizeMm), 1)},${round(chartY(100 - row.cumulativePassingPercent), 1)}`).join(" ");
  const issueDate = report.issuedAt || report.approvedAt || aggregate.testEndDate || sample?.reportDueDate;
  const sampleLabel = sample?.sampleDescription || sample?.sampleType;
  return (
    <section className="report-a4 aggregate-gradation-report print-surface relative rounded-md border border-line bg-white p-6 text-[#111] shadow-sm">
      <header className="border-b border-black pb-1">
        <div className="grid grid-cols-[145px_1fr_128px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[125px]" />
          <div className="pt-3 text-center">
            <div className="text-[13px] font-bold uppercase leading-tight">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-5 text-[8.5px] font-bold">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="ml-auto h-auto w-[104px]" />
        </div>
        <div className="mt-1 flex justify-between text-[7.5px] italic leading-tight">
          <div>
            <div>Kodi / Code: SL-RA-AG-7.8/1.1.a</div>
            <div>Faqe / Page: 1/1</div>
          </div>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-[210px_1fr] gap-x-10 text-[7.8px] leading-tight">
        <AggregateMeta label="Nr. REGJISTRI / REGISTER No.:" value={sample?.sampleCode} />
        <AggregateMeta label="KLIENTI / PURCHASER:" value={client?.clientName} />
        <AggregateMeta label="ADRESA / ADDRESS:" value={client?.address} />
        <AggregateMeta label="KONTAKTET / CONTACT:" value={client?.phone || client?.email} />
        <AggregateMeta label="OBJEKTI / OBJECT:" value={project?.projectName} />
        <AggregateMeta label="KAMPIONI / SAMPLE:" value={sampleLabel} />
        <AggregateMeta label="DATA E MARRJES SË KAMPIONIT / SAMPLING DATE:" value={sample?.dateReceived} />
        <AggregateMeta label="DATA E PRANIMIT TË KAMPIONIT NË LABORATOR / DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY:" value={sample?.dateReceived} />
        <div className="contents">
          <div className="font-bold uppercase">DATA E TESTIMIT / <span className="italic">TESTING DATE</span>:</div>
          <div className="grid grid-cols-[90px_1fr] gap-x-3">
            <span className="font-bold">FILLIMI / <span className="italic">STARTING</span>:</span>
            <span>{formatEuropeanDate(aggregate.testStartDate)}</span>
            <span className="font-bold">MBARIMI / <span className="italic">ENDING</span>:</span>
            <span>{formatEuropeanDate(aggregate.testEndDate)}</span>
          </div>
        </div>
        <AggregateMeta label="TESTI / TEST:" value="PËRCAKTIMI I SHPËRNDARJES SË MADHËSISË SË GRIMCAVE. METODA ME SITA* / DETERMINATION OF PARTICLE SIZE DISTRIBUTION. SIEVING METHOD*" />
        <AggregateMeta label="STANDARDI I TESTIMIT / TEST STANDARD:" value={test?.standard || "BS EN 933-1:2012"} />
        <AggregateMeta label="METODA E TESTIMIT / TEST METHOD:" value={aggregate.testMethod || "Larje dhe sitosje / Washing and sieving"} />
        <AggregateMeta label="VENDI KU ËSHTË PERFORMUAR TESTI / LAB. LOCATION:" value={aggregate.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-mechanical laboratory"} />
        <div className="contents">
          <div className="font-bold uppercase">KUSHTET AMBJENTALE / <span className="italic">ENVIRONMENTAL CONDITIONS</span>:</div>
          <div className="grid grid-cols-[170px_1fr] gap-x-3">
            <span>Temperaturë / <span className="italic">Temperature</span>:</span>
            <span className="border-b border-black text-center">{aggregate.temperature || "-"}</span>
            <span>Lagështia relative / <span className="italic">Relative Humidity</span>:</span>
            <span className="border-b border-black text-center">{aggregate.humidity || "-"}</span>
          </div>
        </div>
      </div>

      <table className="mt-3 w-full border-collapse text-center text-[7.8px] leading-tight">
        <thead>
          <tr>
            <th className="border border-black py-0.5 font-bold">Sitat<br /><span className="font-normal italic">Sieves</span></th>
            <th className="border border-black py-0.5 font-bold">Masa mbetëse progresive<br /><span className="font-normal italic">Progressive retaining mass</span></th>
            <th className="border border-black py-0.5 font-bold">Masa mbetëse progresive<br /><span className="font-normal italic">Progressive retaining mass</span></th>
            <th className="border border-black py-0.5 font-bold">Kalimi kumulativ<br /><span className="font-normal italic">Cumulative passing</span></th>
          </tr>
          <tr>
            <th className="border border-black py-0.5 font-bold">[mm]</th>
            <th className="border border-black py-0.5 font-bold">[g]</th>
            <th className="border border-black py-0.5 font-bold">[%]</th>
            <th className="border border-black py-0.5 font-bold">[%]</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sieveSizeMm}>
              <td className="border border-black py-[1px] font-bold">{formatSieveSize(row.sieveSizeMm)}</td>
              <td className="border border-black py-[1px]">{formatReportNumber(row.cumulativeRetainedMassG, 1)}</td>
              <td className="border border-black py-[1px]">{formatReportNumber(row.cumulativeRetainedPercent, 1)}</td>
              <td className="border border-black py-[1px]">{row.sieveSizeMm === 0 ? formatReportNumber(row.cumulativePassingPercent, 2) : formatReportNumber(row.cumulativePassingPercent, 1)}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black py-0.5 font-bold">Masa e mostrës para testimit / <span className="font-normal italic">Sample mass before testing</span></td>
            <td className="border border-black py-0.5 font-bold">{formatReportNumber(aggregate.sampleMassG, 1)}</td>
            <td className="border border-black py-0.5 font-bold">100.0</td>
            <td className="border border-black py-0.5" />
          </tr>
        </tbody>
      </table>

      <div className="mt-2 border border-dashed border-black px-2 pb-2 pt-1">
        <div className="text-center text-[7px] font-bold uppercase">GRAFIKU I SHPËRNDARJES SË MADHËSISË SË GRIMCËS / <span className="italic">GRAIN SIZE DISTRIBUTION GRAPH</span></div>
        <svg viewBox="0 0 600 280" className="mt-1 h-[64mm] w-full" role="img" aria-label="Grain size distribution graph">
          <rect x={chart.left} y={chart.top} width={chart.right - chart.left} height={chart.bottom - chart.top} fill="#fff" stroke="#777" strokeWidth="0.6" />
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
            const y = chartY(tick);
            return (
              <g key={`y-${tick}`}>
                <line x1={chart.left} y1={y} x2={chart.right} y2={y} stroke="#b8b8b8" strokeWidth="0.45" />
                <text x={chart.left - 14} y={y + 2.5} textAnchor="end" fontSize="6" fill="#111">{tick}</text>
                <text x={chart.right + 14} y={y + 2.5} fontSize="6" fill="#111">{100 - tick}</text>
              </g>
            );
          })}
          {[0.01, 0.1, 1, 10, 100].map((tick) => {
            const x = chartX(tick);
            return (
              <g key={`x-${tick}`}>
                <line x1={x} y1={chart.top} x2={x} y2={chart.bottom} stroke="#8f8f8f" strokeWidth="0.55" />
                <text x={x} y={chart.bottom + 13} textAnchor="middle" fontSize="6" fill="#111">{tick.toFixed(3)}</text>
              </g>
            );
          })}
          {Array.from({ length: 40 }, (_, index) => index).map((index) => {
            const decade = Math.floor(index / 10) - 2;
            const multiplier = (index % 10) + 1;
            const value = multiplier * 10 ** decade;
            if (value <= chart.min || value >= chart.max) return null;
            const x = chartX(value);
            return <line key={`minor-${value}`} x1={x} y1={chart.top} x2={x} y2={chart.bottom} stroke="#d5d5d5" strokeWidth="0.35" />;
          })}
          {retainedPoints ? <polyline points={retainedPoints} fill="none" stroke="#9aa0a6" strokeWidth="1.2" /> : null}
          {passingPoints ? <polyline points={passingPoints} fill="none" stroke="#ff2d20" strokeWidth="1.8" /> : null}
          {sortedChartRows.map((row) => (
            <circle key={`point-${row.sieveSizeMm}`} cx={chartX(row.sieveSizeMm)} cy={chartY(row.cumulativePassingPercent)} r="1.8" fill="#b7b7b7" stroke="#555" strokeWidth="0.3" />
          ))}
          <text x="15" y="132" fontSize="7" textAnchor="middle" fill="#111">P</text>
          <text x="15" y="142" fontSize="7" textAnchor="middle" fill="#111">A</text>
          <text x="15" y="152" fontSize="7" textAnchor="middle" fill="#111">S</text>
          <text x="15" y="162" fontSize="7" textAnchor="middle" fill="#111">S</text>
          <text x="15" y="172" fontSize="7" textAnchor="middle" fill="#111">I</text>
          <text x="15" y="182" fontSize="7" textAnchor="middle" fill="#111">N</text>
          <text x="15" y="192" fontSize="7" textAnchor="middle" fill="#111">G</text>
          <text x="15" y="210" fontSize="7" textAnchor="middle" fill="#111">%</text>
          <text x="584" y="140" fontSize="7" textAnchor="middle" fill="#111">R</text>
          <text x="584" y="150" fontSize="7" textAnchor="middle" fill="#111">E</text>
          <text x="584" y="160" fontSize="7" textAnchor="middle" fill="#111">T</text>
          <text x="584" y="170" fontSize="7" textAnchor="middle" fill="#111">A</text>
          <text x="584" y="180" fontSize="7" textAnchor="middle" fill="#111">I</text>
          <text x="584" y="190" fontSize="7" textAnchor="middle" fill="#111">N</text>
          <text x="584" y="200" fontSize="7" textAnchor="middle" fill="#111">E</text>
          <text x="584" y="210" fontSize="7" textAnchor="middle" fill="#111">D</text>
          <text x="584" y="228" fontSize="7" textAnchor="middle" fill="#111">%</text>
          <text x="300" y="272" fontSize="6.5" textAnchor="middle" fill="#111">SIEVES OPENING (mm)</text>
        </svg>
      </div>

      <div className="mt-1 text-[7.2px] leading-tight">Yll (*) tregon që testi është i akredituar / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>
      <div className="mt-1 grid grid-cols-[76px_1fr] items-end gap-2 text-[7.5px] leading-tight">
        <div>Shënime / <span className="italic">Notes</span> :</div>
        <div className="min-h-4 border-b border-black">{aggregate.notes}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-16 text-center text-[7.2px] leading-tight">
        <SignatureCompact label="TESTUAR NGA / TESTED BY" value={aggregate.technicianName} />
        <SignatureCompact label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={aggregate.checkedBy || report.approvedBy || "Ing./Eng. Besiana ALLIU"} />
      </div>

      <div className="mt-4 space-y-0.5 text-[6.4px] leading-tight">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
        <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
      </div>

      <div className="mt-2 grid grid-cols-[250px_160px] items-end gap-4 text-[7px]">
        <div>Data e Lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
        <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 text-center text-[6.2px] leading-tight text-blue-700">
        <div className="font-bold text-[#5b193f]">SARP &amp; LAB</div>
        <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
      </footer>
    </section>
  );
}

function AggregateMeta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">{label}</div>
      <div className="font-semibold">{formatEuropeanDateRange(value) || "-"}</div>
    </div>
  );
}

function formatReportNumber(value?: number, digits = 1) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "-";
}

function formatSieveSize(value: number) {
  if (value === 0) return "0.000";
  if (value < 1) return value.toFixed(3);
  return value.toFixed(1);
}

function SignatureCompact({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="font-bold">{label}</div>
      <div className="mt-2 font-bold">{value || "-"}</div>
    </div>
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
