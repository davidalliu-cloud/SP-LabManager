"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, Signature } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function ThermalInsulationReportPreview({
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
    <OfficialReportShell report={report} code="SL-RA-PT-7.8/1" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
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

export function ThermalReportRow({ no, labelSq, labelEn, standard, unit, values, average, uncertainty }: { no: string; labelSq: string; labelEn: string; standard: string; unit: string; values: number[]; average: number; uncertainty: string }) {
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

export function SteelReportPreview({
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
    <OfficialReportShell report={report} code="SL-RA-H-7.8/1.1" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
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

export function SteelResultRow({ label, symbol, unit, values, uncertainty }: { label: string; symbol: string; unit: string; values: number[]; uncertainty?: string }) {
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

