"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, Signature, SignatureStamp, LabResponsibleSignature } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function ConcreteCubeReportPreview({
  report,
  test,
  sample,
  client,
  project,
  concrete
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  concrete?: ConcreteCompressiveTest;
}) {
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
        <div className="grid grid-cols-[142px_1fr_74px] items-start gap-3">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[134px]" />
          <div className="pt-2 text-center">
            <div className="font-bold uppercase">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-3 text-[10pt] font-bold">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="ml-auto h-auto w-[68px]" />
        </div>
        <div className="mt-1 text-[9pt] italic leading-tight">
          <div>Kodi / Code: SL-RA-B-7.8/1.3</div>
          <div>Faqe / Page: 1/1</div>
        </div>
      </header>

      <div className="cube-meta mt-3 grid grid-cols-[335px_1fr] gap-x-5 gap-y-1 text-[11pt] leading-[1.18]">
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
      <table className="cube-table mt-1 w-full border-collapse text-center text-[9.5pt] leading-[1.12]">
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
            <tr key={`cube-characteristic-${index}`} className="cube-specimen-row">
              <td className="border border-black p-0.5">{specimen ? index + 1 : " "}</td>
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
      <table className="cube-table mt-1 w-full border-collapse text-center text-[9.5pt] leading-[1.12]">
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
            <tr key={`cube-result-${index}`} className="cube-specimen-row">
              <td className="border border-black p-0.5">{specimen ? index + 1 : " "}</td>
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

      <div className="report-signatures mt-5 grid grid-cols-2 gap-16 text-center">
        <div className="relative"><div className="font-bold">TESTUESI / <span className="italic">TESTED BY</span></div><SignatureStamp name={concrete?.technicianName || report.draftedBy} heightMm={19} /><div className="signature-name mt-[9mm] font-bold">{concrete?.technicianName || report.draftedBy}</div></div>
        <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic">LABORATORY RESPONSIBLE</span></div><LabResponsibleSignature name={headOfLabName()} heightMm={38} /></div>
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
