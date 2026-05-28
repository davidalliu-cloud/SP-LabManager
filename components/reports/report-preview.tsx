"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";

const HEAD_OF_LAB_NAME = "Adela Duzha";

function headOfLabName(preferred?: string) {
  return preferred?.trim() || HEAD_OF_LAB_NAME;
}

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
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic">LABORATORY RESPONSIBLE</span></div><div className="mt-1 font-bold">{headOfLabName()}</div></div>
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
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></div><div className="mt-2 font-bold">{headOfLabName(responsible)}</div></div>
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={cementConsistency.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(cementConsistency.checkedBy)} /></div>
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={cementStrength.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(cementStrength.checkedBy)} /></div>
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={cementBlaine.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(cementBlaine.checkedBy)} /></div>
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
  const titleByKind: Record<MortarTest["testKind"], string> = {
    granulometry: "PËRCAKTIMI I SHPËRNDARJES SË MADHËSISË SË GRIMCËS (METODA E SITAVE)*",
    adhesion: "PËRCAKTIMI I FORTËSISË NGJITËSE TË LLAÇEVE TË NGURTËSUARA*",
    "compression-flexural": "PËRCAKTIMI I REZISTENCËS NË SHTYPJE DHE PËRKULJE TË LLAÇIT TË NGURTËSUAR*",
    compression: "PËRCAKTIMI I REZISTENCËS NË SHTYPJE TË LLAÇIT TË NGURTËSUAR*",
    "dry-density": "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE TË LLAÇIT",
    "fresh-density": "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE TË LLAÇIT",
    chemical: "LLAÇE. METODAT E TESTIMIT TË LLAÇEVE. ANALIZA KIMIKE"
  };
  const englishTitleByKind: Record<MortarTest["testKind"], string> = {
    granulometry: "DETERMINATION OF PARTICLE SIZE DISTRIBUTION (BY SIEVE ANALYSIS)*",
    adhesion: "DETERMINATION OF ADHESIVE STRENGTH OF HARDENED RENDERING AND PLASTERING MORTARS ON SUBSTRATES",
    "compression-flexural": "DETERMINATION OF FLEXURAL AND COMPRESSIVE STRENGTH OF HARDENED MORTAR*",
    compression: "DETERMINATION OF COMPRESSIVE STRENGTH OF HARDENED MORTAR*",
    "dry-density": "DETERMINATION OF PHYSICAL-MECHANICAL CHARACTERISTICS OF MORTARS",
    "fresh-density": "DETERMINATION OF PHYSICAL-MECHANICAL CHARACTERISTICS OF MORTARS",
    chemical: "MORTAR. METHODS OF TEST FOR MORTAR AND SCREED. CHEMICAL ANALYSIS"
  };
  const sampleLabel = mortar.testKind === "granulometry"
    ? "LLAÇ MURATURE / MASONRY MORTAR"
    : mortar.testKind === "adhesion"
      ? sample?.sampleDescription || sample?.sampleType || "LLAÇ / MORTAR"
      : "LLAÇ I NGURTËSUAR / HARDENED MORTAR";
  const issueDate = report.issuedAt || report.approvedAt || mortar.testEndDate || sample?.reportDueDate;

  return (
    <section className="report-a4 mortar-report print-surface relative rounded-md border border-line bg-white p-6 text-black shadow-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <header className="border-b-2 border-black pb-1">
        <div className="grid grid-cols-[110px_1fr_88px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[96px]" />
          <div className="pt-2 text-center">
            <div className="text-[12pt] font-bold uppercase leading-tight">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-3 text-[8.5pt] font-bold">Nr. / No. <span className="text-red-600">{report.reportNumber}</span></div>
          </div>
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="ml-auto mt-0.5 h-auto w-[72px]" />
        </div>
        <div className="mt-0.5 text-[7.4pt] italic leading-tight">
          <div>Kodi / Code: {codeByKind[mortar.testKind]}</div>
          <div>Faqe / Page: 1/1</div>
        </div>
      </header>

      <div className="mt-4 grid grid-cols-[255px_1fr] gap-x-8 gap-y-0.5 text-[7.5pt] leading-tight">
        <MortarMeta label="Nr. REGJISTRI / REGISTER No." value={sample?.sampleCode} />
        <MortarMeta label="KLIENTI / PURCHASER" value={client?.clientName} />
        <MortarMeta label="ADRESA / ADDRESS" value={client?.address} />
        <MortarMeta label="KONTAKTI / CONTACT" value={client?.phone || client?.email} />
        <MortarMeta label="OBJEKTI / OBJECT" value={project?.projectName} />
        <MortarMeta label="KAMPIONI / SAMPLE" value={sampleLabel} />
        {mortar.mortarType ? <MortarMeta label="TIPI I LLAÇIT / TYPE OF THE MORTAR" value={mortar.mortarType} /> : null}
        {mortar.curingConditions ? <MortarMeta label="KUSHTET E MATURIMIT / CURING CONDITIONS" value={mortar.curingConditions} /> : null}
        {mortar.flowValue ? <MortarMeta label="VLERA E RRJEDHSHMËRISË SË LLAÇIT TË TESTIMIT / FLOW VALUE OF THE TEST MORTAR" value={mortar.flowValue} /> : null}
        <MortarMeta label="DATA E MARRJES SË KAMPIONIT / SAMPLING DATE" value={sample?.dateReceived} />
        <MortarMeta label="DATA E PRANIMIT TË KAMPIONIT NË LABORATOR / DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY" value={sample?.dateReceived} />
        <div className="contents">
          <div className="font-bold uppercase">DATA E TESTIMIT / <span className="italic font-normal normal-case">TESTING DATE</span>:</div>
          <div className="grid grid-cols-[92px_1fr] gap-x-3 font-semibold">
            <span>FILLIMI / <span className="italic font-normal">STARTING</span>:</span>
            <span>{formatEuropeanDate(mortar.testStartDate)}</span>
            <span>MBARIMI / <span className="italic font-normal">ENDING</span>:</span>
            <span>{formatEuropeanDate(mortar.testEndDate)}</span>
          </div>
        </div>
        <div className="contents">
          <div className="font-bold uppercase">TESTI / <span className="italic font-normal normal-case">TEST</span>:</div>
          <div className="font-semibold">{titleByKind[mortar.testKind]}<br /><span className="italic font-normal">{englishTitleByKind[mortar.testKind]}</span></div>
        </div>
        <MortarMeta label={mortar.testKind === "chemical" ? "STANDARDI I TESTIMIT / TEST STANDARD" : "STANDARDET E TESTIMIT / TEST STANDARDS"} value={test?.standard || mortarStandardFallback(mortar.testKind)} />
        <MortarMeta label="VENDI KU ËSHTË PERFORMUAR TESTI / LABORATORY LOCATION" value={mortar.testingLocation || (mortar.testKind === "chemical" ? "01/B Laboratori kimik / Chemical laboratory" : "01/A Laboratori Fiziko-Mekanik / Physical-mechanical laboratory")} />
        <div className="contents">
          <div className="font-bold uppercase">KUSHTET AMBJENTALE / <span className="italic font-normal normal-case">ENVIRONMENTAL CONDITIONS</span>:</div>
          <div className="grid grid-cols-[132px_135px] gap-x-3 font-normal">
            <span>Temperatura / <span className="italic">Temperature</span>:</span>
            <span className="border-b border-black text-center">{mortar.temperature || "-"}{mortar.temperature ? " °C" : ""}</span>
            <span>Lagështia / <span className="italic">Humidity</span>:</span>
            <span className="border-b border-black text-center">{mortar.humidity || "-"}{mortar.humidity ? "%" : ""}</span>
          </div>
        </div>
      </div>

      {mortar.testKind === "granulometry" ? <MortarGranulometryReport mortar={mortar} /> : null}
      {mortar.testKind === "adhesion" ? <MortarAdhesionReport mortar={mortar} /> : null}
      {mortar.testKind === "compression" || mortar.testKind === "compression-flexural" ? <MortarStrengthReport mortar={mortar} /> : null}
      {mortar.testKind === "dry-density" || mortar.testKind === "fresh-density" ? <MortarPhysicalReport mortar={mortar} /> : null}
      {mortar.testKind === "chemical" ? <MortarChemicalReport mortar={mortar} /> : null}

      <MortarNotesAndFooter notes={mortar.notes} testedBy={mortar.technicianName || report.draftedBy} responsible={mortar.checkedBy} issueDate={issueDate} />
    </section>
  );
}

function MortarMeta({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">{label}:</div>
      <div className="font-semibold">{formatEuropeanDateRange(value?.toString()) || "-"}</div>
    </div>
  );
}

function mortarStandardFallback(kind: MortarTest["testKind"]) {
  if (kind === "granulometry") return "BS EN 1015-1:1999";
  if (kind === "adhesion") return "BS EN 1015-12:2016";
  if (kind === "chemical") return "BS 4551:2005 + A2:2013";
  return "BS EN 1015-11:2019";
}

function MortarGranulometryReport({ mortar }: { mortar: MortarTest }) {
  const rows = mortar.granulometry?.rows ?? [];
  const sampleMass = mortar.granulometry?.sampleMassG ?? 0;
  let cumulativeMass = 0;
  const tableRows = rows.map((row) => {
    cumulativeMass += row.retainedMassG;
    return { ...row, cumulativeMass };
  });
  return (
    <>
      <table className="mt-4 w-full border-collapse text-center text-[8pt] leading-tight">
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
          {tableRows.map((row) => (
            <tr key={row.sieveSizeMm}>
              <td className="border border-black py-[1px] font-bold">{formatSieveSize(row.sieveSizeMm)}</td>
              <td className="border border-black py-[1px]">{formatReportNumber(row.cumulativeMass, 1)}</td>
              <td className="border border-black py-[1px]">{formatReportNumber(row.cumulativeRetainedPercent, 1)}</td>
              <td className="border border-black py-[1px]">{formatReportNumber(row.passingPercent, row.sieveSizeMm === 0.0001 ? 2 : 1)}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black py-0.5 font-bold">Masa e mostrës para testimit / <span className="font-normal italic">Sample mass before testing</span></td>
            <td className="border border-black py-0.5 font-bold">{formatReportNumber(sampleMass, 1)}</td>
            <td className="border border-black py-0.5 font-bold">100</td>
            <td className="border border-black py-0.5" />
          </tr>
        </tbody>
      </table>
      <MortarGranulometryChart rows={rows} />
    </>
  );
}

function MortarGranulometryChart({ rows }: { rows: NonNullable<MortarTest["granulometry"]>["rows"] }) {
  const chartRows = rows.filter((row) => row.sieveSizeMm > 0).sort((a, b) => a.sieveSizeMm - b.sieveSizeMm);
  const chart = { left: 52, right: 548, top: 20, bottom: 218, min: 0.01, max: 100 };
  const logMin = Math.log10(chart.min);
  const logMax = Math.log10(chart.max);
  const chartX = (sieveSizeMm: number) => chart.left + ((Math.log10(Math.min(Math.max(sieveSizeMm, chart.min), chart.max)) - logMin) / (logMax - logMin)) * (chart.right - chart.left);
  const chartY = (passingPercent: number) => chart.bottom - (Math.min(Math.max(passingPercent, 0), 100) / 100) * (chart.bottom - chart.top);
  const passingPoints = chartRows.map((row) => `${round(chartX(row.sieveSizeMm), 1)},${round(chartY(row.passingPercent), 1)}`).join(" ");
  return (
    <div className="mt-2 border border-dashed border-black px-2 pb-1 pt-1">
      <div className="text-center text-[7pt] font-bold uppercase">GRAFIKU I SHPËRNDARJES SË MADHËSISË SË GRIMCËS / <span className="italic">GRAIN SIZE DISTRIBUTION GRAPH</span></div>
      <svg viewBox="0 0 600 246" className="mt-1 h-[53mm] w-full" role="img" aria-label="Mortar grain size distribution graph">
        <rect x={chart.left} y={chart.top} width={chart.right - chart.left} height={chart.bottom - chart.top} fill="#fff" stroke="#777" strokeWidth="0.6" />
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => {
          const y = chartY(tick);
          return <g key={tick}><line x1={chart.left} y1={y} x2={chart.right} y2={y} stroke="#b8b8b8" strokeWidth="0.45" /><text x={chart.left - 13} y={y + 2.5} textAnchor="end" fontSize="6">{tick}</text><text x={chart.right + 13} y={y + 2.5} fontSize="6">{100 - tick}</text></g>;
        })}
        {[0.01, 0.1, 1, 10, 100].map((tick) => {
          const x = chartX(tick);
          return <g key={tick}><line x1={x} y1={chart.top} x2={x} y2={chart.bottom} stroke="#8f8f8f" strokeWidth="0.55" /><text x={x} y={chart.bottom + 13} textAnchor="middle" fontSize="6">{tick.toFixed(3)}</text></g>;
        })}
        {Array.from({ length: 40 }, (_, index) => index).map((index) => {
          const decade = Math.floor(index / 10) - 2;
          const value = ((index % 10) + 1) * 10 ** decade;
          if (value <= chart.min || value >= chart.max) return null;
          const x = chartX(value);
          return <line key={value} x1={x} y1={chart.top} x2={x} y2={chart.bottom} stroke="#d5d5d5" strokeWidth="0.35" />;
        })}
        {passingPoints ? <polyline points={passingPoints} fill="none" stroke="#ff2d20" strokeWidth="1.7" /> : null}
        {chartRows.map((row) => <circle key={row.sieveSizeMm} cx={chartX(row.sieveSizeMm)} cy={chartY(row.passingPercent)} r="1.7" fill="#b7b7b7" stroke="#555" strokeWidth="0.3" />)}
        <text x="18" y="128" fontSize="7" textAnchor="middle">P A S S I N G %</text>
        <text x="582" y="128" fontSize="7" textAnchor="middle">R E T A I N E D %</text>
        <text x="300" y="240" fontSize="6.5" textAnchor="middle">SIEVES OPENING (mm)</text>
      </svg>
    </div>
  );
}

function MortarStrengthReport({ mortar }: { mortar: MortarTest }) {
  const rows = mortar.strength ?? [];
  const averageByGroup = new Map<string, number>();
  rows.forEach((row) => {
    const key = `${row.testType}-${row.ageDays}`;
    const group = rows.filter((item) => `${item.testType}-${item.ageDays}` === key);
    averageByGroup.set(key, round(group.reduce((sum, item) => sum + item.strengthMpa, 0) / Math.max(group.length, 1), 2));
  });
  const firstInGroup = new Set<string>();
  return (
    <table className="mt-3 w-full border-collapse text-center text-[7.1pt] leading-tight">
      <thead>
        <tr>
          {["Nr.", "Testi", "Maturimi", "Sipërfaqja", "Data e përgatitjes së mostrës", "Data e testimit", "Ngarkesa", "Rezultatet", "Mesatarja"].map((head) => <th key={head} className="border border-black px-1 py-0.5 font-bold">{head}</th>)}
        </tr>
        <tr className="italic">
          {["No.", "Test type", "Age of prism", "Surface Area", "Date of Casting", "Date of Testing", "Crushing Load", "Test results", "Average"].map((head) => <th key={head} className="border border-black px-1 py-0.5 font-normal">{head}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => {
          const key = `${row.testType}-${row.ageDays}`;
          const showAverage = !firstInGroup.has(key);
          firstInGroup.add(key);
          return (
            <tr key={`${row.specimenCode}-${index}`}>
              <td className="border border-black px-1 py-1 font-bold">{index + 1}</td>
              <td className="border border-black px-1 py-1">{row.testType === "Flexural" ? "Rez. në përkulje / Flexural strength" : "Rez. në shtypje / Comp. strength"}</td>
              <td className="border border-black px-1 py-1 font-bold">{row.ageDays}</td>
              <td className="border border-black px-1 py-1">{formatReportNumber(row.surfaceAreaMm2, 1)}</td>
              <td className="border border-black px-1 py-1">{formatEuropeanDate(row.preparationDate || mortar.preparationDate)}</td>
              <td className="border border-black px-1 py-1">{formatEuropeanDate(row.testDate || mortar.testEndDate)}</td>
              <td className="border border-black px-1 py-1">{formatReportNumber(row.loadKn, 3)}</td>
              <td className="border border-black px-1 py-1">{formatReportNumber(row.strengthMpa, 2)}</td>
              <td className="border border-black px-1 py-1 font-bold">{showAverage ? formatReportNumber(averageByGroup.get(key), 2) : ""}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function MortarAdhesionReport({ mortar }: { mortar: MortarTest }) {
  return (
    <table className="mt-5 w-full border-collapse text-center text-[8pt] leading-tight">
      <thead>
        <tr><th colSpan={6} className="border border-black py-1 font-bold">REZULTATET / <span className="italic font-normal">TEST RESULTS</span></th></tr>
        <tr>
          {["Ngarkesa e shkëputjes [N]", "Ditët pas aplikimit", "Lloji i shkëputjes", "Diametri i sipërfaqes [mm]", "Sipërfaqja e kampionit [mm²]", "Forca në ngjitje [N/mm²]"].map((head) => <th key={head} className="border border-black px-1 py-1 font-bold">{head}</th>)}
        </tr>
      </thead>
      <tbody>
        {(mortar.adhesion ?? []).map((row, index) => (
          <tr key={`${row.specimenCode}-${index}`}>
            <td className="border border-black px-1 py-2">{formatReportNumber(row.failureForceN, 0)}</td>
            <td className="border border-black px-1 py-2">{row.ageDays} ditë / days</td>
            <td className="border border-black px-1 py-2">{row.failureMode || "-"}</td>
            <td className="border border-black px-1 py-2">{formatReportNumber(row.diameterMm, 0)}</td>
            <td className="border border-black px-1 py-2">{formatReportNumber(row.areaMm2, 0)}</td>
            <td className="border border-black px-1 py-2">{formatReportNumber(row.adhesionStrengthMpa, 2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MortarPhysicalReport({ mortar }: { mortar: MortarTest }) {
  const dryAverage = averageReportValue((mortar.dryDensity ?? []).map((row) => row.densityKgM3), 0);
  const freshAverage = averageReportValue((mortar.freshDensity ?? []).map((row) => row.densityKgM3), 0);
  const physicalRows = [
    ["Gjendja / Appearance", "BS EN 998-2:2016", "-", "-", "-"],
    ["Ngjyra / Colour", "BS EN 998-2:2016", "-", "-", "-"],
    ["Diametri maksimal i agregatit / Max. diameter of aggregate", "BS EN 1015-1:1999", "mm", "-", "-"],
    ["Densiteti specifik i llaçit të freskët / Bulk density of fresh mortar", "BS EN 1015-6:1999", "kg/m³", freshAverage, "15.0"],
    ["Përcaktimi i densitetit të llaçit të ngurtësuar* / Bulk density of dry mortar*", "BS EN 1015-10:1999", "kg/m³", dryAverage, "15.0"],
    ["Përmbajtja e ajrit / Porosity", "BS EN 1015-11:1999", "%", "-", "0.2"],
    ["Konsistenca e përzierjes / Consistency", "BS EN 1015-3:1999", "%", mortar.flowValue || "-", "0.8"],
    ["Diametri i hapjes / Mean diameter", "BS EN 1015-9:1999", "mm", "-", "0.9"]
  ];
  return (
    <>
      <div className="mt-5 text-center text-[9pt] font-bold uppercase">KARAKTERISTIKAT FIZIKE TË KAMPIONIT / <span className="italic font-normal">PHYSICAL PROPERTIES OF SAMPLE</span></div>
      <table className="mt-2 w-full border-collapse text-[8pt] leading-tight">
        <thead>
          <tr>{["Nr.", "Parametri i matur", "Standardi i testimit", "Njësia", "Rezultati i testimit", "Pasiguria në matje"].map((head) => <th key={head} className="border border-black px-1 py-1 text-center font-bold">{head}</th>)}</tr>
        </thead>
        <tbody>
          {physicalRows.map((row, index) => <tr key={row[0]}><td className="border border-black px-1 py-1 text-center font-bold">{index + 1}</td>{row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="border border-black px-1 py-1">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </>
  );
}

function MortarChemicalReport({ mortar }: { mortar: MortarTest }) {
  const rows = [
    { sq: "Përcaktimi i përmbajtjes së SiO₂", en: "Determination of SiO₂ content", unit: "%", value: mortar.chemical?.silicaPercent },
    { sq: "Përcaktimi i përmbajtjes së CaO", en: "Determination of CaO content", unit: "%", value: mortar.chemical?.calciumOxidePercent },
    { sq: "Përcaktimi i përmbajtjes së çimentos", en: "Determination of cement content", unit: "%", value: mortar.chemical?.limeContentPercent }
  ];
  return (
    <table className="mt-8 w-full border-collapse text-[8.5pt] leading-tight">
      <thead>
        <tr><th className="border border-black px-1 py-1">Nr.<br /><span className="italic font-normal">No.</span></th><th className="border border-black px-1 py-1">Përbërja kimike<br /><span className="italic font-normal">Chemical composition</span></th><th className="border border-black px-1 py-1">Njësia<br /><span className="italic font-normal">Unit</span></th><th className="border border-black px-1 py-1">Rezultatet e testimit<br /><span className="italic font-normal">Test Results</span></th></tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.sq}>
            <td className="border border-black px-1 py-3 text-center font-bold">{index + 1}</td>
            <td className="border border-black px-1 py-2">{row.sq}<br /><span className="italic">{row.en}</span></td>
            <td className="border border-black px-1 py-2 text-center">{row.unit}</td>
            <td className="border border-black px-1 py-2 text-center font-bold">{formatReportNumber(typeof row.value === "number" ? row.value : undefined, 2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function averageReportValue(values: number[], digits = 1) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? formatReportNumber(round(valid.reduce((sum, value) => sum + value, 0) / valid.length, digits), digits) : "-";
}

function MortarNotesAndFooter({
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
      <div className="mt-1 text-[7pt]">Yll (*) tregon që testi është i akredituar. / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>
      <div className="mt-2 grid grid-cols-[95px_1fr] items-end gap-2 text-[7.3pt]">
        <div className="text-right italic">Shënime / Notes:</div>
        <div className="min-h-3 border-b border-black">{notes}</div>
        <div />
        <div className="min-h-3 border-b border-black" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-16 text-center text-[7.3pt]">
        <div><div className="font-bold">TESTUESI / <span className="italic font-normal">TESTED BY</span></div><div className="mt-1 font-bold">{testedBy || "Ing./Eng."}</div></div>
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></div><div className="mt-1 font-bold">{headOfLabName(responsible)}</div></div>
      </div>
      <div className="mt-5 space-y-0.5 text-[5.7pt] leading-tight">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
        <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
      </div>
      <div className="mt-3 grid grid-cols-[285px_150px] items-end gap-4 text-[7pt]">
        <div>Data e Lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
        <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
      </div>
      <footer className="absolute bottom-[2mm] left-0 right-0 text-center text-[5.8pt] leading-tight text-blue-700">
        <div className="font-bold text-[#5b193f]">SARP &amp; LAB</div>
        <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 74 511; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
      </footer>
    </>
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
      <OfficialNotesAndFooter notes={concreteWater.notes} testedBy={concreteWater.technicianName || report.draftedBy} responsible={concreteWater.checkedBy} issueDate={issueDate} />
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
      <OfficialNotesAndFooter notes={concreteFlexural.notes} testedBy={concreteFlexural.technicianName || report.draftedBy} responsible={concreteFlexural.checkedBy} issueDate={issueDate} />
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
      <OfficialNotesAndFooter notes={concreteDensity.notes} testedBy={concreteDensity.technicianName || report.draftedBy} responsible={concreteDensity.checkedBy} issueDate={issueDate} />
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
      <OfficialNotesAndFooter notes={concreteIndirectTensile.notes} testedBy={concreteIndirectTensile.technicianName || report.draftedBy} responsible={concreteIndirectTensile.checkedBy} issueDate={issueDate} />
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
  const selectedSpecimenCodes = report.specimenCodes ?? [];
  const reportSpecimens = selectedSpecimenCodes.length
    ? concreteCore.specimens.filter((specimen) => selectedSpecimenCodes.includes(specimen.specimenCode))
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
  const issueDate = report.issuedAt || report.approvedAt || concreteCore.testEndDate || sample?.reportDueDate;
  const specimenColumns = shown.map((specimen, index) => specimen ? `Karrota ${index + 1}` : `Karrota ${index + 1}`);
  const firstRows = reportRatioType === "1:2"
    ? [
        { no: "1", label: "Lartësia e karrotës", en: "Core drill height", symbol: "H", unit: "cm", values: shown.map((row) => row?.heightCm), average: averages.heightCm },
        { no: "2", label: "Diametri i karrotës", en: "Core drill diameter", symbol: "D", unit: "cm", values: shown.map((row) => row?.diameterCm), average: averages.diameterCm }
      ]
    : [
        { no: "1", label: "Diametri i karrotës", en: "Core drill diameter", symbol: "D", unit: "cm", values: shown.map((row) => row?.diameterCm), average: averages.diameterCm },
        { no: "2", label: "Lartësia e karrotës", en: "Core drill height", symbol: "H", unit: "cm", values: shown.map((row) => row?.heightCm), average: averages.heightCm }
      ];
  const coreRows = [
    ...firstRows,
    { no: "3", label: "Raporti Lartësi - Diametër", en: "L - D Ratio", symbol: "L/D", unit: "-", values: shown.map((row) => row?.heightDiameterRatio), average: undefined },
    { no: "4", label: "Pesha e karrotës", en: "Core drill weight", symbol: "P", unit: "kg", values: shown.map((row) => row?.weightKg), average: averages.weightKg },
    { no: "5", label: "Densiteti volumor i betonit të ngurtësuar", en: "Volumetric density of hardened concrete", symbol: "γ", unit: "kg/m³", values: shown.map((row) => row?.densityKgM3), average: averages.densityKgM3 },
    { no: "6", label: "Sipërfaqja ku aplikohet forca", en: "Contact Area", symbol: "A", unit: "cm²", values: shown.map((row) => row?.contactAreaCm2), average: averages.contactAreaCm2 },
    { no: "7", label: "Ngarkesa", en: "Load", symbol: "F", unit: "kN", values: shown.map((row) => row?.loadKn), average: averages.loadKn },
    { no: "8", label: "Rezistenca në shtypje cilindrike", en: "Cylindrical compressive strength", symbol: "Rck", unit: "MPa", values: shown.map((row) => row?.cylindricalStrengthMpa), average: averages.cylindricalStrengthMpa, strong: true },
    { no: "9", label: "Rezistenca në shtypje kubike", en: "Cubic compressive strength", symbol: "Rck", unit: "MPa", values: shown.map((row) => row?.cubicStrengthMpa), average: averages.cubicStrengthMpa, strong: true }
  ];
  return (
    <section className="report-a4 concrete-core-report print-surface relative rounded-md border border-line bg-white p-4 text-[12pt] leading-[1.12] text-black shadow-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <header className="border-b-2 border-black pb-1">
        <div className="grid grid-cols-[125px_1fr_102px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[110px]" />
          <div className="pt-2 text-center">
            <div className="text-[14pt] font-bold uppercase">RAPORT TESTIMI / TEST REPORT</div>
            <div className="mt-5 text-[9.5pt] font-bold">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="ml-auto h-auto w-[86px]" />
        </div>
        <div className="mt-1 text-[8.5pt] italic leading-tight">
          <div>Kodi / Code: {reportCode}</div>
          <div>Faqe / Page: 1/1</div>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-[295px_1fr] gap-x-7 gap-y-[3px] text-[9.7pt] leading-[1.08]">
        <CoreMetaRow sq="Nr. REGJISTRI" en="REGISTER No." value={sample?.sampleCode} />
        <CoreMetaRow sq="KLIENTI" en="PURCHASER" value={client?.clientName} />
        <CoreMetaRow sq="ADRESA" en="ADDRESS" value={client?.address} />
        <CoreMetaRow sq="KONTAKTET" en="CONTACT" value={client?.phone || client?.email} />
        <CoreMetaRow sq="OBJEKTI" en="OBJECT" value={project?.projectName} />
        <CoreMetaRow sq="ELEMENTI" en="ELEMENT" value={concreteCore.element || sample?.sampleDescription} />
        <CoreMetaRow sq="KAMPIONI" en="SAMPLE" value="CILINDËR BETONI / CONCRETE CORE DRILL" />
        <CoreMetaRow sq="DATA E MARRJES SË KAMPIONIT" en="SAMPLING DATE" value={concreteCore.samplingDate || sample?.dateReceived} />
        <CoreMetaRow sq="DATA E BETONIMIT" en="CASTING DATE" value={concreteCore.castingDate || sample?.concretingDate} />
        <div className="font-bold uppercase">DATA E TESTIMIT / <span className="italic font-normal normal-case">TESTING DATE</span></div>
        <div className="grid grid-cols-[88px_1fr] gap-x-5 font-semibold">
          <span>FILLIMI / <span className="italic font-normal">STARTING</span>:</span>
          <span>{formatEuropeanDate(concreteCore.testStartDate)}</span>
          <span>MBARIMI / <span className="italic font-normal">ENDING</span>:</span>
          <span>{formatEuropeanDate(concreteCore.testEndDate)}</span>
        </div>
        <CoreMetaRow sq="MATURIMI" en="CONCRETE AGE" value={shown.map((row) => row?.ageDays).filter(Boolean).join(", ")} />
        <CoreMetaRow sq="MADHËSIA MAX E GRIMCËS" en="ESTIMATED MAX SIZE OF AGGREGATE" value={concreteCore.maximumAggregateSize} />
        <CoreMetaRow sq="INSPEKTIMI VIZUAL" en="VISUAL INSPECTION" value={concreteCore.visualInspection || "OK"} />
        <CoreMetaRow sq="PRANI HEKURI" en="REINFORCEMENT" value={concreteCore.reinforcement} />
        <CoreMetaRow sq="PËRGATITJA E KAMPIONIT" en="PREPARATION OF SPECIMEN METHOD" value={concreteCore.preparationMethod || "ME PRERJE / CUTTING"} />
        <CoreMetaRow sq="KLASA E REZISTENCËS" en="RESISTANCE CLASS" value={concreteCore.resistanceClass} />
        <CoreMetaRow sq="TESTI" en="TEST" value="MOSTRAT CILINDRIKE - MARRJA, EKZAMINIMI DHE TESTIMI NË SHTYPJE I TYRE / CORED SPECIMENS - TAKING, EXAMINING AND TESTING IN COMPRESSION" />
        <CoreMetaRow sq="STANDARDI I TESTIMIT" en="TEST STANDARD" value={test?.standard || "BS EN 12504-1:2019"} />
        <CoreMetaRow sq="VENDI KU ËSHTË PERFORMUAR TESTI" en="LAB. LOCATION" value={concreteCore.testingLocation || "01/A (Laboratori Fiziko-Mekanik / Physical - Mechanical laboratory)"} />
        <div className="font-bold uppercase">KUSHTET AMBJENTALE / <span className="italic font-normal normal-case">ENVIRONMENTAL CONDITIONS</span>:</div>
        <div className="grid grid-cols-[128px_96px] gap-x-4 font-normal">
          <span>Temperatura / <span className="italic">Temperature</span>:</span>
          <span className="border-b border-black text-center">{concreteCore.temperature || "-"}{concreteCore.temperature ? "°C" : ""}</span>
          <span>Lagështia / <span className="italic">Humidity</span>:</span>
          <span className="border-b border-black text-center">{concreteCore.humidity || "-"}{concreteCore.humidity ? "%" : ""}</span>
        </div>
      </div>

      <table className="official-table core-report-table mt-4 w-full table-fixed border-collapse text-center text-[9.2pt]">
        <thead>
          <tr>
            <th className="w-[32px]">Nr.<br /><span>No.</span></th>
            <th>Parametri i matur<br /><span>Measured parameters</span></th>
            <th className="w-[70px]">Simboli<br /><span>Symbol</span></th>
            <th className="w-[56px]">Njësia<br /><span>Unit</span></th>
            <th className="w-[90px]">{specimenColumns[0]}<br /><span>Core drill 1</span></th>
            <th className="w-[90px]">{specimenColumns[1]}<br /><span>Core drill 2</span></th>
            <th className="w-[98px]">Vlera mesatare<br /><span>Average Value</span></th>
          </tr>
        </thead>
        <tbody>
          {coreRows.map((row) => <CoreReportRow key={row.no} {...row} />)}
        </tbody>
      </table>

      <div className="mt-1 text-[8.2pt] leading-tight">
        Pasiguria në matje për përcaktimin e rezistencës në shtypje të karrotave të betonit është 0,9 MPa / <span className="italic">Determination of compressive strength of concrete core drill measurement uncertainty is 0,9 MPa</span>
      </div>
      <div className="mt-1 text-[8.2pt] leading-tight">Yll (*) tregon që testi është i akredituar / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>

      <div className="mt-4 grid grid-cols-[105px_1fr] items-end gap-2 text-[9pt]">
        <div className="pl-5 italic">Shënime / Notes:</div>
        <div className="min-h-4 border-b border-dotted border-black">{concreteCore.notes}</div>
        <div />
        <div className="min-h-4 border-b border-dotted border-black" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-16 text-center text-[8.8pt]">
        <div><div className="font-bold">TESTUAR NGA / <span className="italic font-normal">TESTED BY</span></div><div className="mt-2 font-bold">{concreteCore.technicianName || report.draftedBy || "-"}</div></div>
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></div><div className="mt-2 font-bold">{headOfLabName(concreteCore.checkedBy)}</div></div>
      </div>

      <div className="report-disclaimers mt-7 space-y-0.5 text-[7.4pt] leading-tight">
        <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
        <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
      </div>
      <div className="report-issue-date mt-5 grid grid-cols-[300px_150px] items-end gap-4 text-[8.8pt]">
        <div>Data e Lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
        <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
      </div>
      <footer className="mt-4 text-center text-[6.5pt] leading-tight text-blue-700">
        <div className="font-bold">SARP&amp;LAB</div>
        <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 74 571; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
      </footer>
    </section>
  );
}

function CoreMetaRow({ sq, en, value }: { sq: string; en: string; value?: string | number }) {
  return (
    <>
      <div className="font-bold uppercase">{sq} / <span className="italic font-normal normal-case">{en}</span>:</div>
      <div className="font-semibold">{formatEuropeanDateRange(value?.toString()) || "-"}</div>
    </>
  );
}

function CoreReportRow({
  no,
  label,
  en,
  symbol,
  unit,
  values,
  average,
  strong
}: {
  no: string;
  label: string;
  en: string;
  symbol: string;
  unit: string;
  values: Array<number | undefined>;
  average?: number;
  strong?: boolean;
}) {
  const padded = [values[0], values[1]];
  return (
    <tr>
      <td>{no}</td>
      <td className={`text-left ${strong ? "font-bold" : ""}`}>{label} / <span>{en}</span></td>
      <td className={strong ? "font-bold" : ""}>{symbol}</td>
      <td className={strong ? "font-bold" : ""}>{unit}</td>
      {padded.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{formatCoreValue(value)}</td>)}
      <td className={strong ? "font-bold" : "font-bold"}>{formatCoreValue(average)}</td>
    </tr>
  );
}

function formatCoreValue(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value.toString() : "-";
}

function averageReportValues(values: Array<number | undefined>, digits = 1) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, digits) : undefined;
}

function AsphaltReportPreview({
  report,
  test,
  sample,
  client,
  project,
  asphalt
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  asphalt: AsphaltTest;
}) {
  const kind = report.reportKind ?? "bitumen-content";
  const codeMap: Record<string, string> = {
    "bitumen-content": "SL-RA-AS-7.8/1.1",
    granulometry: "SL-RA-AS-7.8/1.2",
    "marshall-density": "SL-RA-AS-7.8/1.3",
    "marshall-stability": "SL-RA-AS-7.8/1.4",
    compaction: "SL-RA-AS-7.8/1.7"
  };
  const titleMap: Record<string, string> = {
    "bitumen-content": "PËRCAKTIMI I PËRMBAJTJES SË BITUMIT / DETERMINATION OF BITUMEN CONTENT",
    granulometry: "ANALIZA GRANULOMETRIKE / DETERMINATION OF PARTICLE SIZE DISTRIBUTION",
    "marshall-density": "DENSITETI VOLUMOR DHE MAKSIMAL I PËRZIERJEVE ASFALTIKE / BULK AND MAXIMUM DENSITY OF BITUMINOUS MIXTURES",
    "marshall-stability": "STABILITETI MARSHALL DHE RRJEDHSHMËRIA / MARSHALL STABILITY AND FLOW",
    compaction: "PËRCAKTIMI I DENSITETIT SPECIFIK TË KARROTAVE TË ASFALTIT / BULK SPECIFIC GRAVITY OF COMPACTED ASPHALT"
  };
  const issueDate = report.issuedAt || report.approvedAt || asphalt.testEndDate || sample?.reportDueDate;
  const metaEntries: OfficialMetaEntry[] = [
    { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
    { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
    { sq: "ADRESA", en: "ADDRESS", value: client?.address },
    { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "KAMPIONI", en: "SAMPLE", value: `${asphalt.mixtureKind} / Bituminous mixture` },
    { sq: "VENDI I MARRJES SË KAMPIONIT", en: "SAMPLING LOCATION", value: asphalt.samplingLocation },
    { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
  ];
  return (
    <OfficialReportShell report={report} code={codeMap[kind] ?? "SL-RA-AS-7.8/1"}>
      <OfficialMetaGrid entries={metaEntries} className="mt-5" />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.12]">
        <OfficialTestingDates start={asphalt.testStartDate} end={asphalt.testEndDate} />
        <CoreMetaRow sq="TESTI" en="TEST" value={titleMap[kind]} />
        <CoreMetaRow sq="METODA E TESTIMIT" en="TEST METHOD" value={kind === "bitumen-content" ? "B" : kind === "granulometry" ? "ME EKSTRAKTIM / EXTRACTION" : kind === "marshall-stability" ? "ME KOMPAKTOR / IMPACT COMPACTOR" : "-"} />
        <CoreMetaRow sq="STANDARDI I TESTIMIT" en="TEST STANDARD" value={asphaltStandardForReport(kind, test?.standard)} />
        <CoreMetaRow sq="VENDI KU ËSHTË PERFORMUAR TESTI" en="LAB. LOCATION" value={asphalt.testingLocation || "05/A Lab. i testimit të asfaltobetoneve / Asphalt testing laboratory"} />
        <OfficialEnvironmental temperature={asphalt.temperature} humidity={asphalt.humidity} />
      </div>
      <AsphaltReportBody kind={kind} asphalt={asphalt} />
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={asphalt.notes} testedBy={asphalt.technicianName || report.draftedBy} responsible={asphalt.checkedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

function asphaltStandardForReport(kind: string, fallback?: string) {
  if (kind === "bitumen-content") return "BS EN 12697-1:2020";
  if (kind === "granulometry") return "BS EN 12697-2:2015+A1:2019";
  if (kind === "marshall-density") return "BS EN 12697-6:2020; BS EN 12697-5:2018";
  if (kind === "marshall-stability") return "BS EN 12697-34:2020";
  if (kind === "compaction") return "AASHTO T 275(2022), ASTM D1188/D1188M-22";
  return fallback ?? "-";
}

function AsphaltReportBody({ kind, asphalt }: { kind: string; asphalt: AsphaltTest }) {
  if (kind === "bitumen-content") {
    const rows: Array<[string, string, string, number]> = [
      ["Pesha e koshit + filter", "Wire basket weight + filter", "g", asphalt.bitumen.basketFilterMassG],
      ["Pesha e konglomeratit bituminoz + ena para ekstraktimit", "Bituminous conglomerate weight before extraction", "g", asphalt.bitumen.beforeExtractionMassG],
      ["Pesha e konglomeratit bituminoz + ena pas ekstraktimit", "Bituminous conglomerate weight after extraction", "g", asphalt.bitumen.afterExtractionMassG],
      ["Pesha e filer", "Filler weight", "g", asphalt.bitumen.fillerMassG],
      ["Pesha e bitumit të ekstraktuar", "Extracted bitumen weight", "g", asphalt.bitumen.bitumenMassG],
      ["Përmbajtja e bitumit në konglomerat", "Content of bitumen in conglomerate", "%", asphalt.bitumen.bitumenContentPercent],
      ["Përmbajtja e bitumit në agregat", "Content of bitumen in aggregate", "%", asphalt.bitumen.bitumenOnAggregatePercent]
    ];
    return <OfficialSimpleResultTable rows={rows} />;
  }
  if (kind === "granulometry") {
    return (
      <table className="official-table mt-4 w-full table-fixed border-collapse text-center text-[9pt]">
        <thead><tr><th>Sitat<br /><span>Sieves [mm]</span></th><th>Mbetja progresive<br /><span>Progressive retaining [g]</span></th><th>Mbetja progresive<br /><span>Progressive retaining [%]</span></th><th>Kalimi progresiv<br /><span>Progressive passing [%]</span></th></tr></thead>
        <tbody>{asphalt.granulometry.map((row) => <tr key={row.sieveSizeMm}><td className="font-bold">{row.sieveSizeMm}</td><td>{row.cumulativeRetainedMassG}</td><td>{row.cumulativeRetainedPercent}</td><td className="font-bold">{row.cumulativePassingPercent}</td></tr>)}</tbody>
      </table>
    );
  }
  if (kind === "marshall-density") {
    return (
      <table className="official-table mt-4 w-full table-fixed border-collapse text-center text-[9pt]">
        <thead><tr><th>Mostra<br /><span>Sample</span></th><th>Pesha në ajër<br /><span>Weight in air [g]</span></th><th>Pesha në ujë<br /><span>Weight in water [g]</span></th><th>Pesha SSD<br /><span>SSD [g]</span></th><th>Densiteti Marshall<br /><span>Bulk Density [g/cm³]</span></th><th>Densiteti maksimal<br /><span>Max Density [g/cm³]</span></th><th>Boshllëqe ajri<br /><span>Air voids [%]</span></th></tr></thead>
        <tbody>{asphalt.marshallDensity.map((row, index) => <tr key={row.specimenNo}><td>{row.specimenNo}</td><td>{row.airMassG}</td><td>{row.waterMassG}</td><td>{row.ssdMassG}</td><td className="font-bold">{row.bulkDensityGcm3}</td><td>{asphalt.maximumDensity[index]?.maximumDensityGcm3 ?? asphalt.summaries.averageMaximumDensityGcm3}</td><td>{index === 0 ? asphalt.summaries.airVoidsPercent : ""}</td></tr>)}</tbody>
      </table>
    );
  }
  if (kind === "marshall-stability") {
    return (
      <table className="official-table mt-4 w-full table-fixed border-collapse text-center text-[9pt]">
        <thead><tr><th>Përshkrimi<br /><span>Description</span></th><th>Njësia<br /><span>Unit</span></th>{asphalt.marshallStability.map((row) => <th key={row.specimenNo}>Mostra {row.specimenNo}<br /><span>Sample</span></th>)}<th>Vlera mesatare<br /><span>Average</span></th></tr></thead>
        <tbody>
          <OfficialMultiValueRow label="Lartësia e mostrës" en="Sample height" unit="mm" values={asphalt.marshallStability.map((row) => row.heightMm)} average={averageReportValues(asphalt.marshallStability.map((row) => row.heightMm), 1)} />
          <OfficialMultiValueRow label="Stabiliteti i matur" en="Stability" unit="kN" values={asphalt.marshallStability.map((row) => row.measuredStabilityKn)} average={averageReportValues(asphalt.marshallStability.map((row) => row.measuredStabilityKn), 2)} />
          <OfficialMultiValueRow label="Stabiliteti i korrigjuar" en="Corrected stability" unit="kN" values={asphalt.marshallStability.map((row) => row.correctedStabilityKn)} average={asphalt.summaries.averageCorrectedStabilityKn} strong />
          <OfficialMultiValueRow label="Rrjedhshmëria" en="Flow" unit="mm" values={asphalt.marshallStability.map((row) => row.flowMm)} average={asphalt.summaries.averageFlowMm} />
          <OfficialMultiValueRow label="Koeficienti Marshall" en="Marshall quotient" unit="kN/mm" values={asphalt.marshallStability.map((row) => row.marshallQuotientKnMm)} average={asphalt.summaries.averageMarshallQuotientKnMm} strong />
        </tbody>
      </table>
    );
  }
  return (
    <table className="official-table mt-4 w-full table-fixed border-collapse text-center text-[9pt]">
      <thead><tr><th>Përshkrimi<br /><span>Description</span></th><th>Njësia<br /><span>Unit</span></th><th>Bazë<br /><span>Base Course</span></th><th>Binder<br /><span>Binder Course</span></th><th>Tapet<br /><span>Wearing Course</span></th></tr></thead>
      <tbody>
        <AsphaltCompactionRow label="Lartësia e mostrës" en="Specimen height" unit="cm" rows={asphalt.compaction} field="heightCm" />
        <AsphaltCompactionRow label="Pesha e mostrës në ajër" en="Specimen weight in air" unit="g" rows={asphalt.compaction} field="specimenAirMassG" />
        <AsphaltCompactionRow label="Pesha specifike e mostrës" en="Specimen specific gravity" unit="g/cm³" rows={asphalt.compaction} field="bulkSpecificGravityGcm3" strong />
        <AsphaltCompactionRow label="Përqindja e kompaktesimit" en="Compaction percentage" unit="%" rows={asphalt.compaction} field="compactionPercent" strong />
      </tbody>
    </table>
  );
}

function OfficialSimpleResultTable({ rows }: { rows: Array<[string, string, string, number]> }) {
  return (
    <table className="official-table mt-5 w-full table-fixed border-collapse text-[10pt]">
      <thead><tr><th className="text-left">Përshkrimi<br /><span>Description</span></th><th className="w-[85px]">Njësia<br /><span>Unit</span></th><th className="w-[140px]">Rezultatet<br /><span>Results</span></th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row[0]}><td>{row[0]} / <span>{row[1]}</span></td><td className="text-center">{row[2]}</td><td className="text-center font-bold">{row[3]}</td></tr>)}</tbody>
    </table>
  );
}

function OfficialMultiValueRow({ label, en, unit, values, average, strong }: { label: string; en: string; unit: string; values: number[]; average?: number; strong?: boolean }) {
  return <tr><td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span>{en}</span></td><td>{unit}</td>{values.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{value}</td>)}<td className="font-bold">{average ?? "-"}</td></tr>;
}

function AsphaltCompactionRow({ label, en, unit, rows, field, strong }: { label: string; en: string; unit: string; rows: AsphaltTest["compaction"]; field: keyof AsphaltTest["compaction"][number]; strong?: boolean }) {
  const value = (layer: string) => rows.find((row) => row.layer === layer)?.[field];
  return <tr><td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span>{en}</span></td><td>{unit}</td><td>{value("Bazë") ?? "-"}</td><td>{value("Binder") ?? "-"}</td><td>{value("Tapet") ?? "-"}</td></tr>;
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
  const issueDate = report.issuedAt || report.approvedAt || thermalInsulation.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-PT-7.8/1" title="RAPORT TESTIMI / TEST REPORT">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: sample?.sampleDescription || sample?.sampleType },
        { sq: "LLOJI I PRODUKTIT", en: "TYPE OF PRODUCT", value: thermalInsulation.productType || sample?.sampleType },
        { sq: "FORMA E PRODUKTIT TË DORËZUAR NË LABORATOR", en: "THE FORM IN WHICH THE PRODUCT ARRIVED AT THE LABORATORY", value: thermalInsulation.deliveredForm },
        { sq: "PRANIA E DEFEKTEVE NË PRODUKT", en: "PRESENCE OF DEFECTS ON THE TEST SPECIMENS", value: thermalInsulation.defects },
        { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: sample?.dateReceived },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={thermalInsulation.testStartDate} end={thermalInsulation.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE TË PRODUKTEVE TERMOIZOLUESE / DETERMINATION OF PHYSICAL - MECHANICAL CHARACTERISTICS FOR THERMAL INSULATING PRODUCTS" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: thermalInsulation.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory" }
        ]} />
        <OfficialEnvironmental temperature={thermalInsulation.temperature} humidity={thermalInsulation.humidity} />
      </div>
      <table className="official-table thermal-official-table mt-5 w-full border-collapse text-center text-[9pt]">
        <thead>
          <tr><th>Nr.</th><th>Parametri i matur</th><th>Standardi i testimit</th><th>Njësia</th><th colSpan={6}>Rezultatet e testimit / <span>Test Results</span></th><th>Pasiguria në matje</th></tr>
          <tr><th><span>No.</span></th><th><span>Measured parameter</span></th><th><span>Test standard</span></th><th><span>Units</span></th><th>Mostra 1<br /><span>Sample 1</span></th><th>Mostra 2<br /><span>Sample 2</span></th><th>Mostra 3<br /><span>Sample 3</span></th><th>Mostra 4<br /><span>Sample 4</span></th><th>Mostra 5<br /><span>Sample 5</span></th><th>Mesatarja<br /><span>Average</span></th><th><span>Measurement uncertainty</span></th></tr>
        </thead>
        <tbody>
          <ThermalReportRow no="1" labelSq="Përcaktimi i gjatësisë" labelEn="Determination of length" standard="BS EN 822:2013" unit="mm" values={sampleValues((i) => thermalInsulation.specimens[i]?.lengthMm ?? 0)} average={thermalInsulation.averages.lengthMm} uncertainty="1.40" />
          <ThermalReportRow no="2" labelSq="Përcaktimi i gjerësisë" labelEn="Determination of width" standard="BS EN 822:2013" unit="mm" values={sampleValues((i) => thermalInsulation.specimens[i]?.widthMm ?? 0)} average={thermalInsulation.averages.widthMm} uncertainty="1.70" />
          <ThermalReportRow no="3" labelSq="Përcaktimi i trashësisë" labelEn="Determination of thickness" standard="BS EN 823:2013" unit="mm" values={sampleValues((i) => thermalInsulation.specimens[i]?.thicknessMm ?? 0)} average={thermalInsulation.averages.thicknessMm} uncertainty="1.40" />
          <ThermalReportRow no="4" labelSq="Përcaktimi i densitetit aparent" labelEn="Determination of the apparent density" standard="BS EN 1602:2013" unit="kg/m³" values={sampleValues((i) => thermalInsulation.specimens[i]?.apparentDensityKgM3 ?? 0)} average={thermalInsulation.averages.apparentDensityKgM3} uncertainty="1.00" />
          <ThermalReportRow no="5" labelSq="Përcaktimi i absorbimit të ujit me zhytje të pjesshme (me kohë të shkurtër)" labelEn="Determination of short-term water absorption by partial immersion" standard="BS EN ISO 29767:2019" unit="kg/m²" values={sampleValues((i) => thermalInsulation.specimens[i]?.waterAbsorptionKgM2 ?? 0)} average={thermalInsulation.averages.waterAbsorptionKgM2} uncertainty="0.36" />
          <ThermalReportRow no="6" labelSq="Përcaktimi i sjelljes ndaj shtypjes" labelEn="Determination of compression behaviour" standard="BS EN 826:2013" unit="kPa" values={sampleValues((i) => thermalInsulation.specimens[i]?.compressiveStressAtTenPercentKpa || thermalInsulation.specimens[i]?.compressiveStressKpa || 0)} average={thermalInsulation.averages.compressiveStressKpa} uncertainty="2.70" />
        </tbody>
      </table>
      <OfficialNotesAndFooter notes={thermalInsulation.notes} testedBy={thermalInsulation.technicianName || report.draftedBy} responsible={thermalInsulation.checkedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

function ThermalReportRow({ no, labelSq, labelEn, standard, unit, values, average, uncertainty }: { no: string; labelSq: string; labelEn: string; standard: string; unit: string; values: number[]; average: number; uncertainty: string }) {
  const valueText = (value: number) => Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(/\.?0+$/, "");
  return (
    <tr>
      <td>{no}</td>
      <td className="text-left">{labelSq}<br /><span>{labelEn}</span></td>
      <td>{standard}</td>
      <td>{unit}</td>
      {values.map((value, index) => <td key={index}>{value || value === 0 ? valueText(value) : ""}</td>)}
      <td className="font-bold">{valueText(average)}</td>
      <td>{uncertainty}</td>
    </tr>
  );
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
      <OfficialNotesAndFooter notes={steel.notes} testedBy={steel.technicianName || report.draftedBy} responsible={steel.checkedBy} issueDate={issueDate} />
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
    <section className="report-a4 aggregate-gradation-report print-surface relative rounded-md border border-line bg-white p-6 text-[#111] shadow-sm" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
      <header className="border-b-2 border-black pb-1">
        <div className="grid grid-cols-[132px_1fr_112px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[112px]" />
          <div className="pt-3 text-center">
            <div className="text-[13px] font-bold uppercase leading-tight">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-5 text-[8.5px] font-bold">Nr. / No. <span className="text-red-600">{report.reportNumber}</span></div>
          </div>
          <img src="/brand/da-accreditation.svg" alt="DA accreditation LT 069 09 06 21" className="ml-auto mt-0.5 h-auto w-[90px]" />
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
        <SignatureCompact label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregate.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateChemical.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateLosAngeles.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateFreezeThaw.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateAcv.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateDensity.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateFillerDensity.checkedBy)} />
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateSoundness.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateSoundness.checkedBy)} /></div>
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateElongation.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(aggregateElongation.checkedBy)} /></div>
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateBulkDensity.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(aggregateBulkDensity.checkedBy)} /></div>
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
      <div className="mt-10 grid gap-6 sm:grid-cols-2"><Signature label="TESTUAR NGA / TESTED BY" value={aggregateSandEquivalent.technicianName || report.draftedBy} /><Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(aggregateSandEquivalent.checkedBy)} /></div>
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE" value={headOfLabName(aggregateShapeIndex.checkedBy)} />
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
        <Signature label="PËRGJEGJËSI I LABORATORIT / HEAD OF LABORATORY" value={headOfLabName(aggregateFlakiness.checkedBy)} />
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
