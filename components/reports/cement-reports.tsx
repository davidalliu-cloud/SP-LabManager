"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, Signature } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

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
  const rows = [
    ["1", "Water demand for standard consistency", "BS EN 196-3:2016", "%", cementConsistency.consistency.waterDemandPercent, "0.8"],
    ["2", "Initial setting time", "BS EN 196-3:2016", "min", cementConsistency.setting.initialSettingMinutes, "1"],
    ["3", "Final setting time", "BS EN 196-3:2016", "min", cementConsistency.setting.finalSettingMinutes, "1"],
    ["4", "Expansion after 24 hours", "BS EN 196-3:2016", "mm", cementConsistency.expansion.expansionMm, "0.9"]
  ] as const;
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: "KLIENTI / CLIENT" },
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
            <th>(Ditë / Days)</th>
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
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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

