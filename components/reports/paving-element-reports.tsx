"use client";

import type { Client, LabTest, PavingElementTest, Project, Report, Sample } from "@/lib/types";
import { formatEuropeanDate } from "@/lib/date-format";
import {
  OfficialReportShell,
  OfficialMetaGrid,
  OfficialTestingDates,
  OfficialEnvironmental,
  OfficialAsterisk,
  OfficialNotesAndFooter,
  BiText,
  samplingOperator
} from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

/**
 * Bordura betoni (SL-RA-ET-7.8/1.2, BS EN 1340) and pllaka betoni
 * (SL-RA-ET-7.8/1.3, BS EN 1339).
 *
 * Both templates are the same sheet with different column headings: eight
 * numbered element rows, the three visual judgements, the reported dimensions,
 * water absorption, breaking load and bending strength, then a row of means
 * and a row of the laboratory's stated measurement uncertainties.
 *
 * Dimensions and absorption are measured on the first three elements only, so
 * rows 4 to 8 carry a dash in those columns — as the paper form does. A mean
 * covers whatever rows were filled; a column nobody measured stays blank.
 */

const cell = "border border-black px-1 py-0.5";
const headCell = "border border-black px-1 py-0.5 font-bold";

function show(value?: number | string) {
  if (value === undefined || value === "") return "-";
  return String(value);
}

/** One reported column: its two headings, symbol, unit and uncertainty. */
type Column = {
  sq: string;
  en: string;
  symbol: string;
  unit: string;
  /** The laboratory's stated uncertainty, or undefined where the form leaves it blank. */
  uncertainty?: string;
  accredited: boolean;
  value: (index: number) => number | string | undefined;
  mean?: number;
};

export function PavingElementReportPreview({
  report,
  test,
  sample,
  client,
  project,
  paving
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  paving: PavingElementTest;
}) {
  const isKerb = paving.kind === "kerb";
  const issueDate = report.issuedAt || report.approvedAt || paving.testEndDate || sample?.reportDueDate;
  const averages = paving.averages;

  // The report always shows the template's eight numbered rows, whether or not
  // every element was put through every determination.
  const rows = [0, 1, 2, 3, 4, 5, 6, 7];
  const bendingAt = (index: number) => paving.bending[index];
  const dimensionAt = (index: number) => paving.dimensions[index];
  const appearanceAt = (index: number) => paving.appearance[index];

  const rowLabel = (index: number) =>
    isKerb
      ? `Bordura e betonit nr. ${index + 1} / Concrete kerb unit no. ${index + 1}`
      : `Pllaka (fleta) e betonit nr. ${index + 1} / Concrete paving flag no. ${index + 1}`;

  const visualColumns: Column[] = [
    { sq: "Aparenca", en: "Aparence", symbol: "-", unit: "-", accredited: false, value: (i) => appearanceAt(i)?.appearance },
    { sq: "Uniformiteti i sipërfaqes", en: "Texture", symbol: "-", unit: "-", accredited: false, value: (i) => appearanceAt(i)?.texture },
    { sq: "Ngjyra", en: "Colour", symbol: "-", unit: "-", accredited: false, value: (i) => appearanceAt(i)?.colour }
  ];

  // Kerbs report length, width and height; flags report the diagonals and the
  // thickness instead, which is the only real difference between the sheets.
  const measuredColumns: Column[] = isKerb
    ? [
        { sq: "Gjatësia e kampionit", en: "Specimen length", symbol: "L", unit: "mm", uncertainty: "2", accredited: true, value: (i) => dimensionAt(i)?.lengthMm, mean: averages.lengthMm },
        { sq: "Gjerësia e kampionit", en: "Specimen width", symbol: "W", unit: "mm", uncertainty: "1.5", accredited: true, value: (i) => dimensionAt(i)?.widthMm, mean: averages.widthMm },
        { sq: "Lartësia e kampionit", en: "Specimen height", symbol: "H", unit: "mm", uncertainty: "1.5", accredited: true, value: (i) => dimensionAt(i)?.heightMm, mean: averages.heightMm },
        { sq: "Absorbimi i ujit", en: "Total water absorption", symbol: "Wa", unit: "%", uncertainty: "0.5", accredited: true, value: (i) => dimensionAt(i)?.waterAbsorptionPercent, mean: averages.waterAbsorptionPercent },
        { sq: "Ngarkesa në shkatërrim", en: "Failure load", symbol: "F", unit: "N", accredited: false, value: (i) => bendingAt(i)?.breakingLoadN, mean: averages.breakingLoadN },
        { sq: "Rezistenca në përkulje", en: "Bending strength", symbol: "T", unit: "MPa", uncertainty: "0.7", accredited: true, value: (i) => bendingAt(i)?.bendingStrengthMpa, mean: averages.bendingStrengthMpa }
      ]
    : [
        { sq: "Gjatësia e diagonaleve", en: "Diagonals length", symbol: "d", unit: "mm", uncertainty: "2", accredited: true, value: (i) => dimensionAt(i)?.diagonalMm, mean: averages.diagonalMm },
        { sq: "Trashësia", en: "Thickness", symbol: "t", unit: "mm", uncertainty: "1.5", accredited: true, value: (i) => dimensionAt(i)?.heightMm, mean: averages.heightMm },
        { sq: "Absorbimi i ujit", en: "Total water absorption", symbol: "Wa", unit: "%", uncertainty: "0.5", accredited: true, value: (i) => dimensionAt(i)?.waterAbsorptionPercent, mean: averages.waterAbsorptionPercent },
        { sq: "Ngarkesa në thyerje", en: "Breaking load", symbol: "P", unit: "N", accredited: false, value: (i) => bendingAt(i)?.breakingLoadN, mean: averages.breakingLoadN },
        { sq: "Rezistenca në përkulje", en: "Bending strength", symbol: "T", unit: "MPa", uncertainty: "0.6", accredited: true, value: (i) => bendingAt(i)?.bendingStrengthMpa, mean: averages.bendingStrengthMpa }
      ];

  const columns = [...visualColumns, ...measuredColumns];

  const entries: OfficialMetaEntry[] = [
    { sq: "NR. REGJISTRI", en: "REGISTER No", value: sample?.sampleCode },
    { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
    { sq: "ADRESA", en: "ADDRESS", value: client?.address },
    { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    {
      sq: "KAMPIONI",
      en: "SAMPLE",
      value: paving.productDescription || (isKerb ? "BORDURA BETONI / CONCRETE KERB UNITS" : "PLLAKË BETONI / CONCRETE PAVING FLAG")
    },
    { sq: "PRODHUESI", en: "MANUFACTURER", value: paving.manufacturer },
    { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: formatEuropeanDate(sample?.dateReceived) },
    { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: samplingOperator(sample) },
    {
      sq: "TESTI",
      en: "TEST",
      value: isKerb
        ? "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE TË BORDURAVE TË BETONIT / CONCRETE KERB UNITS — REQUIREMENTS AND TEST METHODS"
        : "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE TË PLLAKAVE (FLETËVE) TË BETONIT / CONCRETE PAVING FLAGS — REQUIREMENTS AND TEST METHODS"
    },
    { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || (isKerb ? "BS EN 1340:2003" : "BS EN 1339:2003") },
    {
      sq: "VENDI KU ËSHTË PERFORMUAR TESTI",
      en: "LAB. LOCATION",
      value: paving.testingLocation || "01/A (Lab. Fiziko-Mekanik / Physical-Mechanical laboratory)"
    }
  ];

  return (
    <OfficialReportShell
      report={report}
      code={isKerb ? "SL-RA-ET-7.8/1.2" : "SL-RA-ET-7.8/1.3"}
      title="RAPORT TESTIMI / TEST REPORT"
      className="compact-official-report"
    >
      <OfficialMetaGrid entries={entries} />
      <OfficialTestingDates start={paving.testStartDate} end={paving.testEndDate} />
      <OfficialEnvironmental temperature={paving.temperature} humidity={paving.humidity} />

      <table className="mt-1 w-full border-collapse text-center text-[6.5px]">
        <thead>
          <tr>
            <th className={`${headCell} text-left`}>
              <BiText>Parametrat e testimit / Test parameters</BiText>
            </th>
            {columns.map((column) => (
              <th key={column.en} className={headCell}>
                {column.sq}
                {column.accredited ? "*" : ""}
                <br />
                <span className="font-normal italic">
                  {column.en}
                  {column.accredited ? "*" : ""}
                </span>
              </th>
            ))}
          </tr>
          <tr>
            <th className={`${headCell} text-left font-normal`}>
              <BiText>Simbole / Symbols</BiText>
            </th>
            {columns.map((column) => (
              <th key={`sym-${column.en}`} className={headCell}>{column.symbol}</th>
            ))}
          </tr>
          <tr>
            <th className={`${headCell} text-left font-normal`}>
              <BiText>Njësitë matëse / Units</BiText>
            </th>
            {columns.map((column) => (
              <th key={`unit-${column.en}`} className={headCell}>{column.unit}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((index) => (
            <tr key={index}>
              <td className={`${cell} text-left`}>
                <BiText>{rowLabel(index)}</BiText>
              </td>
              {columns.map((column) => (
                <td key={`${column.en}-${index}`} className={cell}>{show(column.value(index))}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td className={`${headCell} text-left`}>
              <BiText>Vlerat mesatare / Average values</BiText>
            </td>
            {columns.map((column) => (
              <td key={`mean-${column.en}`} className={`${cell} font-bold`}>{show(column.mean)}</td>
            ))}
          </tr>
          <tr>
            <td className={`${cell} text-left`}>
              <BiText>Pasiguria në matje / Measurement uncertainty</BiText>
            </td>
            {columns.map((column) => (
              <td key={`unc-${column.en}`} className={cell}>{column.uncertainty ? `± ${column.uncertainty}` : "-"}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={paving.notes} issueDate={issueDate} testedBy={paving.technicianName} responsible={paving.checkedBy} />
    </OfficialReportShell>
  );
}
