"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, samplingOperator, BiText } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

// Metadata rows shared by every cement report (register, client, sample, dates).
function cementBaseMeta(sample?: Sample, client?: Client, project?: Project): OfficialMetaEntry[] {
  const receiptDate = formatEuropeanDate(sample?.dateReceived);
  return [
    { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
    { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
    { sq: "ADRESA", en: "ADRESS", value: client?.address },
    { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "KAMPIONI", en: "SAMPLE", value: "ÇIMENTO / CEMENT" },
    { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: receiptDate },
    { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: receiptDate },
    { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: samplingOperator(sample) }
  ];
}

export function CementConsistencyReportPreview({
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
  const standard = test?.standard || "BS EN 196-3:2016";
  const rows: Array<{ sq: string; en: string; unit: string; result?: number; unc: string }> = [
    { sq: "Kërkesa për ujë për konsistencë standarde", en: "Water demand for standard consistency", unit: "%", result: cementConsistency.consistency.waterDemandPercent, unc: "0.8" },
    { sq: "Koha e fillimit të lidhjes", en: "Initial setting time", unit: "min", result: cementConsistency.setting.initialSettingMinutes, unc: "1" },
    { sq: "Koha e përfundimit të lidhjes", en: "Final setting time", unit: "min", result: cementConsistency.setting.finalSettingMinutes, unc: "1" },
    { sq: "Zgjerimi pas 24 orësh", en: "Expansion after 24 hours", unit: "mm", result: cementConsistency.expansion.expansionMm, unc: "0.9" }
  ];
  const issueDate = report.issuedAt || report.approvedAt || cementConsistency.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code="SL-RA-Ç-7.8/1.1" className="compact-official-report">
      <OfficialMetaGrid entries={[
        ...cementBaseMeta(sample, client, project),
        { sq: "TESTIMI", en: "TEST", value: "PËRCAKTIMI I KONSISTENCËS, KOHËS SË LIDHJES DHE QËNDRUESHMËRISË* / DETERMINATION OF CONSISTENCY, SETTING TIME AND SOUNDNESS*" },
        { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: standard },
        { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: cementConsistency.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory" }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialEnvironmental temperature={cementConsistency.temperature} humidity={cementConsistency.humidity} />
      </div>

      <table className="official-table cement-table mt-3 w-full border-collapse text-center text-[9pt]">
        <thead>
          <tr>
            <th>Nr.<br /><span>No.</span></th>
            <th>Testi<br /><span>Test</span></th>
            <th>Standardi<br /><span>Standard</span></th>
            <th>Njësia<br /><span>Unit</span></th>
            <th>Rezultati<br /><span>Result</span></th>
            <th>Pasiguria<br /><span>Uncertainty</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.en}>
              <td>{index + 1}</td>
              <td className="text-left">{row.sq} / <span>{row.en}</span></td>
              <td>{standard}</td>
              <td>{row.unit}</td>
              <td>{row.result ?? ""}</td>
              <td>{row.unc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={cementConsistency.notes} testedBy={cementConsistency.technicianName || report.draftedBy} responsible={cementConsistency.checkedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

export function CementStrengthReportPreview({
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
  const fmt = (value?: number, digits = 2) =>
    typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "";
  const avg = (type: "compressive" | "flexural", age: number) =>
    cementStrength.averages[`${type}${age}DayMpa` as keyof typeof cementStrength.averages];

  const ages = Array.from(new Set(cementStrength.specimens.map((row) => row.ageDays))).sort((a, b) => a - b);
  const groups = ages.map((age) => {
    const rows = cementStrength.specimens.filter((row) => row.ageDays === age).sort((a, b) => a.rowNo - b.rowNo);
    const compressive = rows.filter((row) => row.testType === "Compressive");
    const flexural = rows.filter((row) => row.testType === "Flexural");
    return {
      age,
      compressive,
      flexural,
      ordered: [...compressive, ...flexural],
      testDate: rows.find((row) => row.testDate)?.testDate
    };
  });

  const issueDate = report.issuedAt || report.approvedAt || cementStrength.testEndDate || sample?.reportDueDate;
  const receiptDate = formatEuropeanDate(sample?.dateReceived);

  return (
    <OfficialReportShell report={report} code="SL-RA-Ç-7.8/1.3" className="compact-official-report">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: "ÇIMENTO / CEMENT" },
        { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: receiptDate },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: receiptDate },
        { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: samplingOperator(sample) },
        { sq: "TESTIMI", en: "TEST", value: "PËRCAKTIMI I REZISTENCËS NË SHTYPJE DHE PËRKULJE TË ÇIMENTOS* / DETERMINATION OF STRENGTH*" },
        { sq: "STANDARDET E TESTIMIT", en: "TEST STANDARDS", value: test?.standard || "BS EN 196-1:2016" },
        { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: cementStrength.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory" }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialEnvironmental temperature={cementStrength.temperature} humidity={cementStrength.humidity} />
      </div>

      <table className="official-table cement-table mt-3 w-full border-collapse text-center text-[9pt]">
        <thead>
          <tr>
            <th>Nr.<br /><span>No.</span></th>
            <th>Testi<br /><span>Test type</span></th>
            <th>Maturimi<br /><span>Age of prism</span></th>
            <th>Sipërfaqja<br /><span>Surface Area</span></th>
            <th>Data e përgatitjes së mostrës<br /><span>Date of Casting</span></th>
            <th>Data e testimit<br /><span>Date of Testing</span></th>
            <th>Ngarkesa<br /><span>Crushing Load</span></th>
            <th>Rezultatet<br /><span>Test results</span></th>
            <th>Mesatarja<br /><span>Avg. Strength</span></th>
          </tr>
          <tr>
            <th />
            <th />
            <th><BiText>(Ditë / Days)</BiText></th>
            <th>(mm²)</th>
            <th>(dd/mm/vv)</th>
            <th>(dd/mm/vv)</th>
            <th>(kN)</th>
            <th>(N/mm²)</th>
            <th>(N/mm²)</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) =>
            group.ordered.map((row, indexInGroup) => {
              const isFirstOfGroup = indexInGroup === 0;
              const isFirstCompressive = row.testType === "Compressive" && group.compressive[0]?.rowNo === row.rowNo;
              return (
                <tr key={`cement-${row.rowNo}`}>
                  <td>{row.rowNo}</td>
                  <td>
                    {row.testType === "Flexural" ? "Rez. në përkulje / " : "Rez. në shtypje / "}
                    <span>{row.testType === "Flexural" ? "Flexural strength" : "Comp. strength"}</span>
                  </td>
                  {isFirstOfGroup ? <td rowSpan={group.ordered.length}>{group.age}</td> : null}
                  <td>{row.surfaceAreaMm2}</td>
                  {isFirstOfGroup ? <td rowSpan={group.ordered.length}>{formatEuropeanDate(cementStrength.castingDate)}</td> : null}
                  {isFirstOfGroup ? <td rowSpan={group.ordered.length}>{formatEuropeanDate(group.testDate)}</td> : null}
                  <td>{row.loadKn}</td>
                  <td>{fmt(row.strengthMpa)}</td>
                  {row.testType === "Flexural" ? (
                    <td>{fmt(avg("flexural", group.age))}</td>
                  ) : isFirstCompressive ? (
                    <td rowSpan={group.compressive.length}>{fmt(avg("compressive", group.age))}</td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <OfficialAsterisk />
      <div className="mt-1 text-[8pt] leading-tight">Pasiguria në matje për rezistencën në shtypje 2 MPa / <span className="italic">Measurement uncertainty of Comp. strength 2 MPa</span></div>
      <div className="text-[8pt] leading-tight">Pasiguria në matje për rezistencën në përkulje 0.5 MPa / <span className="italic">Measurement uncertainty of Flexural strength 0.5 MPa</span></div>

      <OfficialNotesAndFooter notes={cementStrength.notes} testedBy={cementStrength.technicianName || report.draftedBy} responsible={cementStrength.checkedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

export function CementBlaineReportPreview({
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
  const standard = test?.standard || (cementBlaine.method === "ASTM" ? "ASTM C204" : "BS EN 196-6:2018");
  const density = cementBlaine.density?.cementDensityGcm3;
  const bedVolume = cementBlaine.method === "ASTM" ? cementBlaine.astm?.bedVolumeCm3 : cementBlaine.bsEn?.bedVolumeCm3;
  const constantK = cementBlaine.method === "ASTM" ? cementBlaine.astm?.constantK : cementBlaine.bsEn?.constantK;
  const issueDate = report.issuedAt || report.approvedAt || cementBlaine.testEndDate || sample?.reportDueDate;
  return (
    <OfficialReportShell report={report} code={code} className="compact-official-report">
      <OfficialMetaGrid entries={[
        ...cementBaseMeta(sample, client, project),
        { sq: "TESTIMI", en: "TEST", value: `PËRCAKTIMI I IMTËSISË (BLAINE) - ${cementBlaine.method}* / DETERMINATION OF FINENESS (BLAINE) - ${cementBlaine.method}*` },
        { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: standard },
        { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LABORATORY LOCATION", value: cementBlaine.testingLocation || "01/A Laboratori Fiziko-Mekanik / Physical-Mechanical laboratory" }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialEnvironmental temperature={cementBlaine.temperature} humidity={cementBlaine.humidity} />
      </div>

      <table className="official-table cement-table mt-3 w-full border-collapse text-center text-[9pt]">
        <thead>
          <tr>
            <th>Nr.<br /><span>No.</span></th>
            <th>Parametri<br /><span>Parameter</span></th>
            <th>Njësia<br /><span>Unit</span></th>
            <th>Rezultati<br /><span>Result</span></th>
            <th>Pasiguria<br /><span>Uncertainty</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td className="text-left">Sipërfaqja specifike (Blaine) / <span>Specific surface area (Blaine)</span></td>
            <td>cm²/g</td>
            <td>{cementBlaine.specificSurfaceCm2G}</td>
            <td>80</td>
          </tr>
          <tr>
            <td>2</td>
            <td className="text-left">Densiteti i çimentos / <span>Cement density</span></td>
            <td>g/cm³</td>
            <td>{density ?? ""}</td>
            <td>-</td>
          </tr>
          <tr>
            <td>3</td>
            <td className="text-left">Vëllimi i shtratit / <span>Bed volume</span></td>
            <td>cm³</td>
            <td>{bedVolume ?? ""}</td>
            <td>-</td>
          </tr>
          <tr>
            <td>4</td>
            <td className="text-left">Konstantja K / <span>Constant K</span></td>
            <td>-</td>
            <td>{constantK ?? ""}</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>

      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={cementBlaine.notes} testedBy={cementBlaine.technicianName || report.draftedBy} responsible={cementBlaine.checkedBy} issueDate={issueDate} />
    </OfficialReportShell>
  );
}

