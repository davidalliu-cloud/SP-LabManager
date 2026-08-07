"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";

const HEAD_OF_LAB_NAME = "Adela Duzha";

export function headOfLabName(preferred?: string) {
  return preferred?.trim() || HEAD_OF_LAB_NAME;
}

export function ReportHeader({
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
      <div className="grid items-center gap-4 sm:grid-cols-[170px_1fr_92px]">
        <div className="flex items-center">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-[158px]" />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold uppercase tracking-wide text-ink">{title}</div>
          <div className="mt-2 text-xs font-semibold text-muted">Kodi / Code: {code}</div>
          <div className="mt-1 text-sm font-semibold text-lab-burgundy">{subtitle}</div>
          <div className="mt-2 text-xs text-muted">Nr. / No. {report.reportNumber} · Faqe / Page: {report.reportSequence} / {report.totalReports}</div>
        </div>
        <div className="flex justify-end">
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="h-auto w-[82px]" />
        </div>
      </div>
      <div className="mt-3 flex justify-end no-print">
        <StatusBadge status={report.reportStatus} />
      </div>
    </header>
  );
}

export function ConcreteCubeMeta({ label, value }: { label: string; value?: string }) {
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

export function splitBilingualLabel(label: string) {
  if (commonInfoLabels[label]) return commonInfoLabels[label];
  const parts = label.split(" / ");
  return parts.length >= 2 ? { sq: parts[0], en: parts.slice(1).join(" / ") } : undefined;
}

export function Info({ label, value }: { label: string; value?: string }) {
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

export function Bilingual({ sq, en, className = "" }: { sq: string; en: string; className?: string }) {
  return (
    <span className={`block ${className}`}>
      <span className="block font-semibold text-ink">{sq}</span>
      <span className="mt-0.5 block text-[0.82em] font-normal italic leading-tight text-muted">{en}</span>
    </span>
  );
}

export function BilingualInfo({ sq, en, value }: { sq: string; en: string; value?: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted">
        <Bilingual sq={sq} en={en} />
      </div>
      <div className="mt-1 font-medium text-ink">{formatEuropeanDateRange(value)}</div>
    </div>
  );
}

export type OfficialMetaEntry = {
  sq: string;
  en: string;
  value?: string | number;
  valueClassName?: string;
};

export function OfficialReportShell({
  report,
  code,
  title = "RAPORT TESTIM / TEST REPORT",
  className = "",
  children
}: {
  report: Report;
  code: string;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`report-a4 official-report print-surface relative rounded-md border border-line bg-white p-4 leading-tight text-black shadow-sm ${className}`}>
      <header className="border-b-2 border-black pb-1">
        <div className="grid grid-cols-[140px_1fr_78px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[130px]" />
          <div className="pt-3 text-center">
            <div className="text-[15pt] font-bold uppercase leading-tight">{title}</div>
            <div className="mt-2 text-[10pt] font-bold text-red-600">Nr. / No. {report.reportNumber}</div>
          </div>
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="ml-auto mt-1 h-auto w-[68px]" />
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

export function OfficialMetaGrid({ entries, className = "mt-6" }: { entries: OfficialMetaEntry[]; className?: string }) {
  return (
    <div className={`${className} grid grid-cols-[315px_1fr] gap-x-8 gap-y-0.5 text-[10pt] leading-[1.15]`}>
      {entries.map((entry) => (
        <div className="contents" key={`${entry.sq}-${entry.en}`}>
          <div className="font-bold uppercase">{entry.sq} / <span className="italic font-normal normal-case">{entry.en}</span>:</div>
          <div className={`font-semibold ${entry.valueClassName ?? ""}`}>{formatEuropeanDateRange(entry.value?.toString()) || "-"}</div>
        </div>
      ))}
    </div>
  );
}

export function OfficialTestingDates({ start, end }: { start?: string; end?: string }) {
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

export function OfficialEnvironmental({ temperature, humidity }: { temperature?: string; humidity?: string }) {
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

export function OfficialAsterisk() {
  return <div className="mt-1 text-[9pt]">Yll (*) tregon që testi është i akredituar / <span className="italic">Asterisk (*) means that the laboratory is accredited for this test</span></div>;
}

export function OfficialNotesAndFooter({
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
      <div className="mt-4 grid grid-cols-[120px_1fr] items-end gap-2 text-[9.5pt]">
        <div className="pl-14 italic">Shënime / Notes:</div>
        <div className="min-h-4 border-b border-black">{notes}</div>
      </div>
      <div className="official-footer-cluster">
        <div className="official-signatures grid grid-cols-2 gap-16 text-center text-[9.5pt]">
          <div><div className="font-bold">TESTUAR NGA / <span className="italic font-normal">TESTED BY</span></div><div className="mt-[7mm] font-bold">{testedBy || "-"}</div></div>
          <div><div className="font-bold">PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></div><div className="mt-[7mm] font-bold">{headOfLabName(responsible)}</div></div>
        </div>
        <div className="official-disclaimers mt-2 space-y-0.5 text-[7.5pt] leading-tight">
          <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
          <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
          <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
        </div>
        <div className="official-issue-date mt-2 grid grid-cols-[285px_150px] items-end gap-4 text-[9pt]">
          <div>Data e lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
          <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
        </div>
        <footer className="official-footer mt-2 text-center text-[6.7pt] leading-tight text-blue-700">
          <div className="font-bold">SARP &amp; LAB</div>
          <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
        </footer>
      </div>
    </>
  );
}

export function sampleDimensions(values: Array<{ lengthMm?: number; widthMm?: number; heightMm?: number }>) {
  return values.map((row) => [row.lengthMm, row.widthMm, row.heightMm].filter(Boolean).join("x")).filter(Boolean).join("; ");
}

export function ReportInfoRow({ label, value }: { label: string; value?: string }) {
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


export function CoreMetaRow({ sq, en, value }: { sq: string; en: string; value?: string | number }) {
  return (
    <>
      <div className="font-bold uppercase">{sq} / <span className="italic font-normal normal-case">{en}</span>:</div>
      <div className="font-semibold">{formatEuropeanDateRange(value?.toString()) || "-"}</div>
    </>
  );
}

export function averageReportValues(values: Array<number | undefined>, digits = 1) {
  const valid = values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  return valid.length ? round(valid.reduce((sum, value) => sum + value, 0) / valid.length, digits) : undefined;
}

export function formatReportNumber(value?: number, digits = 1) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "-";
}

export function formatSieveSize(value: number) {
  if (value === 0) return "0.000";
  if (value < 1) return value.toFixed(3);
  return value.toFixed(1);
}

export function FreezeThawResultRow({ label, symbol, unit, values, average, uncertainty }: { label: string; symbol: string; unit: string; values: number[]; average?: number; uncertainty?: string }) {
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

export function ChemicalReportRow({ no, parameter, unit, method, result }: { no: string; parameter: string; unit: string; method: string; result: number }) {
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

export function Signature({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-t border-slate-300 pt-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value ?? "Signature"}</div>
    </div>
  );
}
