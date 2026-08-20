"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, SignaturePair } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function MortarReportPreview({
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
        <div className="grid grid-cols-[120px_1fr_62px] items-start gap-4">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[104px]" />
          <div className="pt-2 text-center">
            <div className="text-[12pt] font-bold uppercase leading-tight">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-3 text-[8.5pt] font-bold">Nr. / No. <span className="text-red-600">{report.reportNumber}</span></div>
          </div>
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="ml-auto mt-0.5 h-auto w-[48px]" />
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

export function MortarMeta({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">{label}:</div>
      <div className="font-semibold">{formatEuropeanDateRange(value?.toString()) || "-"}</div>
    </div>
  );
}

export function mortarStandardFallback(kind: MortarTest["testKind"]) {
  if (kind === "granulometry") return "BS EN 1015-1:1999";
  if (kind === "adhesion") return "BS EN 1015-12:2016";
  if (kind === "chemical") return "BS 4551:2005 + A2:2013";
  return "BS EN 1015-11:2019";
}

export function MortarGranulometryReport({ mortar }: { mortar: MortarTest }) {
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

export function MortarGranulometryChart({ rows }: { rows: NonNullable<MortarTest["granulometry"]>["rows"] }) {
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

export function MortarStrengthReport({ mortar }: { mortar: MortarTest }) {
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

export function MortarAdhesionReport({ mortar }: { mortar: MortarTest }) {
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

export function MortarPhysicalReport({ mortar }: { mortar: MortarTest }) {
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

export function MortarChemicalReport({ mortar }: { mortar: MortarTest }) {
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

export function averageReportValue(values: number[], digits = 1) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? formatReportNumber(round(valid.reduce((sum, value) => sum + value, 0) / valid.length, digits), digits) : "-";
}

export function MortarNotesAndFooter({
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
      <div className="mortar-footer-cluster">
        <SignaturePair
          wrapperClassName="mortar-signatures mt-4"
          columnClassName="grid grid-cols-2 gap-16 text-center text-[7.3pt]"
          testedByLabel={<>TESTUESI / <span className="italic font-normal">TESTED BY</span></>}
          testedByName={testedBy || "Ing./Eng."}
          responsibleLabel={<>PËRGJEGJËSI I LABORATORIT / <span className="italic font-normal">LABORATORY RESPONSIBLE</span></>}
          responsibleName={headOfLabName(responsible)}
          heightMm={28}
        />
        <div className="mt-3 space-y-0.5 text-[5.7pt] leading-tight">
          <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
          <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
          <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
        </div>
        <div className="mt-2 grid grid-cols-[285px_150px] items-end gap-4 text-[7pt]">
          <div>Data e Lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
          <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
        </div>
        <footer className="mt-2 text-center text-[5.8pt] leading-tight text-blue-700">
          <div className="font-bold text-[#5b193f]">SARP &amp; LAB</div>
          <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 74 511; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
        </footer>
      </div>
    </>
  );
}

