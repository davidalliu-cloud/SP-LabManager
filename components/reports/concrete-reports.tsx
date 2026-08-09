"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, Signature, SignatureStamp } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function ConcreteWaterPenetrationReportPreview({
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
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.10" className="compact-official-report">
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

export function ConcreteFlexuralReportPreview({
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
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.4" className="compact-official-report">
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

export function FlexReportRow({ label, unit, values, strong }: { label: string; unit: string; values: number[]; strong?: boolean }) {
  const padded = [values[0], values[1], values[2]];
  return <tr><td className="px-3 py-2 font-semibold text-ink">{label}</td><td className="px-3 py-2">{unit}</td>{padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}</tr>;
}

export function OfficialThreeValueRow({ label, en, unit, values, strong }: { label: string; en: string; unit: string; values: Array<number | undefined>; strong?: boolean }) {
  const padded = [values[0], values[1], values[2]];
  return (
    <tr>
      <td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span className="italic font-normal">{en}</span></td>
      <td className={strong ? "font-bold" : ""}>{unit}</td>
      {padded.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{value || value === 0 ? value : ""}</td>)}
    </tr>
  );
}

export function ConcreteDensityReportPreview({
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
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.8" className="compact-official-report">
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

export function ConcreteIndirectTensileReportPreview({
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
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.5" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
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

export function TwoSampleReportRow({ label, unit, values, strong }: { label: string; unit: string; values: number[]; strong?: boolean }) {
  const padded = [values[0], values[1]];
  return <tr><td className="px-3 py-2 font-semibold text-ink">{label}</td><td className="px-3 py-2">{unit}</td>{padded.map((value, index) => <td key={index} className={`px-3 py-2 ${strong ? "font-semibold text-ink" : ""}`}>{value || value === 0 ? value : "-"}</td>)}</tr>;
}

export function OfficialTwoValueRow({ label, en, unit, values, strong }: { label: string; en: string; unit: string; values: Array<number | undefined>; strong?: boolean }) {
  const padded = [values[0], values[1]];
  return (
    <tr>
      <td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span className="italic font-normal">{en}</span></td>
      <td className={strong ? "font-bold" : ""}>{unit}</td>
      {padded.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{value || value === 0 ? value : ""}</td>)}
    </tr>
  );
}

export function ConcreteCoreReportPreview({
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
        <div className="grid grid-cols-[140px_1fr_72px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[128px]" />
          <div className="pt-2 text-center">
            <div className="text-[14pt] font-bold uppercase">RAPORT TESTIMI / TEST REPORT</div>
            <div className="mt-5 text-[9.5pt] font-bold">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="ml-auto h-auto w-[65px]" />
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

      <div className="report-signatures mt-5 grid grid-cols-2 gap-16 text-center text-[8.8pt]">
        <div className="relative"><div className="font-bold">TESTUAR NGA / <span className="italic font-normal">TESTED BY</span></div><SignatureStamp name={concreteCore.technicianName || report.draftedBy} heightMm={15} /><div className="signature-name mt-[9mm] font-bold">{concreteCore.technicianName || report.draftedBy || "-"}</div></div>
        <div className="relative"><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></div><SignatureStamp name={headOfLabName(concreteCore.checkedBy)} heightMm={15} /><div className="signature-name mt-[9mm] font-bold">{headOfLabName(concreteCore.checkedBy)}</div></div>
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

// CoreMetaRow moved to report-shared.tsx (reused by the asphalt report too).

export function CoreReportRow({
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

export function formatCoreValue(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value.toString() : "-";
}

// averageReportValues moved to report-shared.tsx (reused by the asphalt report too).

