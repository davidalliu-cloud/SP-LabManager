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

