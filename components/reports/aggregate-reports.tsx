"use client";

import type { ReactNode } from "react";
import type { AggregateAcvTest, AggregateBulkDensityTest, AggregateChemicalTest, AggregateDensityAbsorptionTest, AggregateElongationIndexTest, AggregateFillerDensityTest, AggregateFlakinessIndexTest, AggregateFreezeThawTest, AggregateGradationTest, AggregateLosAngelesTest, AggregateSandEquivalentTest, AggregateShapeIndexTest, AggregateSoundnessTest, AsphaltTest, CementBlaineTest, CementConsistencyTest, CementStrengthTest, Client, ConcreteCompressiveTest, ConcreteCoreTest, ConcreteDensityTest, ConcreteFlexuralTest, ConcreteIndirectTensileTest, ConcreteWaterPenetrationTest, LabTest, MortarTest, Project, Report, Sample, SteelTensileTest, ThermalInsulationTest } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { round } from "@/lib/calculations";
import { formatEuropeanDate, formatEuropeanDateRange } from "@/lib/date-format";
import { ReportHeader, ConcreteCubeMeta, Info, Bilingual, BilingualInfo, OfficialReportShell, OfficialMetaGrid, OfficialTestingDates, OfficialEnvironmental, OfficialAsterisk, OfficialNotesAndFooter, sampleDimensions, ReportInfoRow, headOfLabName, splitBilingualLabel, CoreMetaRow, averageReportValues, formatReportNumber, formatSieveSize, FreezeThawResultRow, ChemicalReportRow, SignaturePair, samplingOperator, SimpleReportLegalFooter } from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

export function AggregateReportPreview({
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
      <header>
        <div className="grid grid-cols-[140px_1fr_72px] items-start gap-4 border-b-2 border-black pb-1">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mt-1 h-auto w-[128px]" />
          <div className="pt-3 text-center">
            <div className="text-[13px] font-bold uppercase leading-tight">RAPORT TESTIM / TEST REPORT</div>
            <div className="mt-5 text-[8.5px] font-bold">Nr. / No. <span className="text-red-600">{report.reportNumber}</span></div>
          </div>
          <img src="/brand/da-accreditation.png" alt="DA accreditation Testim S SH ISO/IEC 17025 LT 069" className="ml-auto mt-0.5 h-auto w-[56px]" />
        </div>
        <div className="mt-1 flex justify-between text-[6.4px] italic leading-tight">
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
        <AggregateMeta label="OPERATORI I MARRJES SË KAMPIONIT / SAMPLING OPERATOR:" value={samplingOperator(sample)} />
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
      <div className="gradation-footer-cluster">
        <SignaturePair
          columnClassName="grid grid-cols-2 gap-16 text-center text-[7.2px] leading-tight"
          testedByLabel="TESTUAR NGA / TESTED BY"
          testedByName={aggregate.technicianName}
          responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
          responsibleName={headOfLabName(aggregate.checkedBy)}
          heightMm={24}
        />

        <div className="mt-3 space-y-0.5 text-[6.4px] leading-tight">
          <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
          <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
          <p>Laboratori nuk është përgjegjës për fazën e kampionmarrjes. / <span className="italic">The laboratory is not responsible for the sampling phase.</span></p>
        </div>

        <div className="mt-2 grid grid-cols-[250px_160px] items-end gap-4 text-[6.4px]">
          <div>Data e Lëshimit të Raportit të Testimit / <span className="italic">Test Report Issue Date:</span></div>
          <div className="border-b border-black text-center">{formatEuropeanDate(issueDate)}</div>
        </div>

        <footer className="mt-2 text-center text-[6.4px] leading-tight text-blue-700">
          <div className="font-bold text-[#5b193f]">SARP &amp; LAB</div>
          <div>Adresa: Autostrada Tiranë-Durrës, km 29, Fshati Vrrin-Komuna Rrashbull, Durrës Shqipëri. Mob: +355 67 20 22 609; Web: www.sarpandlab.al; Email: d.alliu@sarpandlab.al; NIPT: L 41526502 B</div>
        </footer>
      </div>
    </section>
  );
}

export function AggregateMeta({ label, value }: { label: string; value?: string }) {
  return (
    <div className="contents">
      <div className="font-bold uppercase">{label}</div>
      <div className="font-semibold">{formatEuropeanDateRange(value) || "-"}</div>
    </div>
  );
}

// formatReportNumber and formatSieveSize moved to report-shared.tsx (reused by the mortar report too).

export function AggregateChemicalReportPreview({
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateChemical.testEndDate || sample?.reportDueDate;

  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateChemical.technicianName || "Ing./Eng. Anxhela KANTO"}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateChemical.checkedBy)}
        align="start"
        bordered
      />
      <SimpleReportLegalFooter issueDate={issueDate} />
    </section>
  );
}

export function AggregateLosAngelesReportPreview({
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateLosAngeles.testEndDate || sample?.reportDueDate;
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateLosAngeles.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateLosAngeles.checkedBy)}
        align="start"
        bordered
      />
      <SimpleReportLegalFooter issueDate={issueDate} />
    </section>
  );
}

export function AggregateFreezeThawReportPreview({
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateFreezeThaw.testEndDate || sample?.reportDueDate;
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateFreezeThaw.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateFreezeThaw.checkedBy)}
        align="start"
        bordered
      />
      <SimpleReportLegalFooter issueDate={issueDate} />
    </section>
  );
}

export function AggregateAcvReportPreview({
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
  const issueDate = report.issuedAt || report.approvedAt || aggregateAcv.testEndDate || sample?.reportDueDate;
  return (
    <section className="report-a4 simple-report print-surface rounded-md border border-line bg-white p-8 shadow-sm">
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
        <Info label="Sampling operator" value={samplingOperator(sample)} />
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

      <SignaturePair
        wrapperClassName="mt-10"
        columnClassName="grid gap-6 sm:grid-cols-2"
        testedByLabel="TESTUAR NGA / TESTED BY"
        testedByName={aggregateAcv.technicianName || report.draftedBy}
        responsibleLabel="PËRGJEGJËSI I LABORATORIT / LABORATORY RESPONSIBLE"
        responsibleName={headOfLabName(aggregateAcv.checkedBy)}
        align="start"
        bordered
      />
      <SimpleReportLegalFooter issueDate={issueDate} />
    </section>
  );
}

