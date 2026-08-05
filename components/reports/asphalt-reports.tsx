"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, Signature } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function AsphaltReportPreview({
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
    <OfficialReportShell report={report} code={codeMap[kind] ?? "SL-RA-AS-7.8/1"} className="compact-official-report">
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

export function asphaltStandardForReport(kind: string, fallback?: string) {
  if (kind === "bitumen-content") return "BS EN 12697-1:2020";
  if (kind === "granulometry") return "BS EN 12697-2:2015+A1:2019";
  if (kind === "marshall-density") return "BS EN 12697-6:2020; BS EN 12697-5:2018";
  if (kind === "marshall-stability") return "BS EN 12697-34:2020";
  if (kind === "compaction") return "AASHTO T 275(2022), ASTM D1188/D1188M-22";
  return fallback ?? "-";
}

export function AsphaltReportBody({ kind, asphalt }: { kind: string; asphalt: AsphaltTest }) {
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

export function OfficialSimpleResultTable({ rows }: { rows: Array<[string, string, string, number]> }) {
  return (
    <table className="official-table mt-5 w-full table-fixed border-collapse text-[10pt]">
      <thead><tr><th className="text-left">Përshkrimi<br /><span>Description</span></th><th className="w-[85px]">Njësia<br /><span>Unit</span></th><th className="w-[140px]">Rezultatet<br /><span>Results</span></th></tr></thead>
      <tbody>{rows.map((row) => <tr key={row[0]}><td>{row[0]} / <span>{row[1]}</span></td><td className="text-center">{row[2]}</td><td className="text-center font-bold">{row[3]}</td></tr>)}</tbody>
    </table>
  );
}

export function OfficialMultiValueRow({ label, en, unit, values, average, strong }: { label: string; en: string; unit: string; values: number[]; average?: number; strong?: boolean }) {
  return <tr><td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span>{en}</span></td><td>{unit}</td>{values.map((value, index) => <td key={index} className={strong ? "font-bold" : ""}>{value}</td>)}<td className="font-bold">{average ?? "-"}</td></tr>;
}

export function AsphaltCompactionRow({ label, en, unit, rows, field, strong }: { label: string; en: string; unit: string; rows: AsphaltTest["compaction"]; field: keyof AsphaltTest["compaction"][number]; strong?: boolean }) {
  const value = (layer: string) => rows.find((row) => row.layer === layer)?.[field];
  return <tr><td className={`text-left ${strong ? "font-bold" : ""}`}>{label}<br /><span>{en}</span></td><td>{unit}</td><td>{value("Bazë") ?? "-"}</td><td>{value("Binder") ?? "-"}</td><td>{value("Tapet") ?? "-"}</td></tr>;
}

