"use client";

import type { Client, LabTest, MasonryUnitSpecimen, MasonryUnitTest, Project, Report, Sample } from "@/lib/types";
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
 * Masonry units — one combined report (SL-RA-EM-7.8/1.1).
 *
 * The four determinations (BS EN 772-16 dimensions, 772-13 density & moisture,
 * 772-1 compressive strength) are run on one set of units and reported together
 * in the template's single-table layout: one row per measured parameter, one
 * column per specimen, plus the mean and the laboratory's measurement
 * uncertainty. A parameter nobody measured shows a blank rather than a zero.
 */

const cell = "border border-black px-1 py-0.5";
const headCell = "border border-black px-1 py-0.5 font-bold";

function show(value?: number | string, suffix = "") {
  if (value === undefined || value === "") return "-";
  return `${value}${suffix}`;
}

// One measured parameter: its bilingual label, unit, standard clause, a reader
// to pull the value from a specimen, the mean, and the fixed measurement
// uncertainty the lab states for that parameter (from the SL-RA-EM template).
type ParamRow = {
  sq: string;
  en: string;
  unit: string;
  standard: string;
  value: (row: MasonryUnitSpecimen) => number | undefined;
  mean?: number;
  uncertainty: string;
};

export function MasonryUnitReportPreview({
  report,
  test,
  sample,
  client,
  project,
  masonry
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  masonry: MasonryUnitTest;
}) {
  const issueDate = report.issuedAt || report.approvedAt || masonry.testEndDate || sample?.reportDueDate;
  const units = masonry.specimens;
  const averages = masonry.averages;
  const measuredCount = units.filter((row) => row.lengthMm !== undefined).length;
  const crushedCount = units.filter((row) => row.compressiveStrengthMpa !== undefined).length;
  const orientationLabel =
    masonry.loadingOrientation === "parallel" ? "∥ me vrimat / ∥ to holes" : "Ʇ me vrimat / ⊥ to holes";

  const declared = [masonry.declaredLengthMm, masonry.declaredWidthMm, masonry.declaredHeightMm];
  const hasDeclared = declared.some((value) => value !== undefined);

  const entries: OfficialMetaEntry[] = [
    { sq: "KLIENTI", en: "CLIENT", value: client?.clientName },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "KAMPIONI", en: "SAMPLE", value: masonry.productDescription || sample?.sampleDescription || sample?.sampleType },
    { sq: "LLOJI I NJËSISË", en: "UNIT TYPE", value: masonry.unitCategory },
    { sq: "PRODHUESI", en: "MANUFACTURER", value: masonry.manufacturer },
    { sq: "NR. I REGJISTRIT", en: "REGISTER No", value: sample?.sampleCode },
    { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: formatEuropeanDate(sample?.dateReceived) },
    { sq: "KAMPIONIMI U KRYE NGA", en: "SAMPLING PERFORMED BY", value: samplingOperator(sample) },
    {
      sq: "TESTI",
      en: "TEST",
      value:
        "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-MEKANIKE TË ELEMENTEVE TË MURATURËS / DETERMINATION OF PHYSICAL-MECHANICAL CHARACTERISTICS OF MASONRY UNITS"
    },
    {
      sq: "STANDARDI",
      en: "STANDARD",
      value: test?.standard || "BS EN 772-16:2011; BS EN 772-13:2000; BS EN 772-1:2011+A1:2015; BS EN 771-1:2011+A1:2015"
    },
    {
      sq: "VENDI KU ËSHTË PERFORMUAR TESTI",
      en: "LAB. LOCATION",
      value: masonry.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"
    }
  ];

  // Dimensions + density + moisture, one row per parameter (BS EN 772-16 / -13).
  const paramRows: ParamRow[] = [
    { sq: "Gjatësia e mostrës (lu)", en: "Length of specimen", unit: "mm", standard: "BS EN 772-16:2011, Clause 8", value: (r) => r.lengthMm, mean: averages.lengthMm, uncertainty: "1.2" },
    { sq: "Gjerësia e mostrës (wu)", en: "Width of specimen", unit: "mm", standard: "BS EN 772-16:2011, Clause 7.1", value: (r) => r.widthMm, mean: averages.widthMm, uncertainty: "1.2" },
    { sq: "Lartësia e mostrës (hu)", en: "Height of specimen", unit: "mm", standard: "BS EN 772-16:2011, Clause 7.1", value: (r) => r.heightMm, mean: averages.heightMm, uncertainty: "1" },
    { sq: "Trashësia e mureve/faqeve anësore në mënyrë gjatësore", en: "Thickness of longitudinal shells and webs", unit: "mm", standard: "BS EN 772-16:2011, Clause 7.1", value: (r) => r.shellWebLongitudinalMm, mean: averages.shellWebLongitudinalMm, uncertainty: "0.5" },
    { sq: "Trashësia e mureve/faqeve anësore në mënyrë tërthore", en: "Thickness of transverse shells and webs", unit: "mm", standard: "BS EN 772-16:2011, Clause 7.1", value: (r) => r.shellWebTransverseMm, mean: averages.shellWebTransverseMm, uncertainty: "0.5" },
    { sq: "Thellësia mesatare e çdo vrime", en: "Mean depth of each hole", unit: "mm", standard: "BS EN 772-16:2011, Clause 7.3", value: (r) => r.meanHoleDepthMm, mean: averages.meanHoleDepthMm, uncertainty: "0.5" },
    { sq: "Trashësia e kombinuar në mënyrë gjatësore", en: "Combined thickness of longitudinal webs and shells", unit: "%", standard: "BS EN 772-16:2011, Clause 7.5", value: (r) => r.combinedThicknessLongitudinalPercent, mean: averages.combinedThicknessLongitudinalPercent, uncertainty: "0.5" },
    { sq: "Trashësia e kombinuar në mënyrë tërthore", en: "Combined thickness of transverse webs and shells", unit: "%", standard: "BS EN 772-16:2011, Clause 7.5", value: (r) => r.combinedThicknessTransversePercent, mean: averages.combinedThicknessTransversePercent, uncertainty: "0.5" },
    { sq: "Densiteti neto në të thatë", en: "Net dry density", unit: "kg/m³", standard: "BS EN 772-13:2000, Clause 7.2", value: (r) => r.netDryDensityKgM3, mean: averages.netDryDensityKgM3, uncertainty: "10" },
    { sq: "Densiteti bruto në të thatë", en: "Gross dry density", unit: "kg/m³", standard: "BS EN 772-13:2000, Clause 7.3", value: (r) => r.grossDryDensityKgM3, mean: averages.grossDryDensityKgM3, uncertainty: "10" },
    { sq: "Ujëthithja", en: "Moisture content", unit: "%", standard: "BS EN 772-13:2000, Clause 7.1.2", value: (r) => r.waterAbsorptionPercent, mean: averages.waterAbsorptionPercent, uncertainty: "0.5" }
  ];

  // Compressive strength block (BS EN 772-1), in the orientation tested.
  const strengthRows: ParamRow[] = [
    { sq: "Sipërfaqja e ngarkesës", en: "Area loaded", unit: "mm²", standard: "-", value: (r) => r.loadedAreaMm2, mean: undefined, uncertainty: "-" },
    { sq: "Ngarkesa në thyerje", en: "Failure load", unit: "N", standard: "BS EN 772-1:2011+A1:2015, Clause 8", value: (r) => (r.maximumLoadKn === undefined ? undefined : Math.round(r.maximumLoadKn * 1000)), mean: undefined, uncertainty: "-" },
    { sq: "Rezistenca në shtypje e mostrës", en: "Compressive strength of the sample", unit: "N/mm²", standard: "BS EN 772-1:2011+A1:2015, Clause 8", value: (r) => r.compressiveStrengthMpa, mean: averages.compressiveStrengthMpa, uncertainty: "0.1" },
    { sq: "Vlera e kërkuar e rezistencës së normalizuar", en: "Required value of the normalised compressive strength", unit: "N/mm²", standard: "BS EN 772-1:2011+A1:2015, Annex A", value: (r) => r.normalisedStrengthMpa, mean: averages.normalisedStrengthMpa, uncertainty: "-" }
  ];

  function renderParamTable(rows: ParamRow[]) {
    return (
      <table className="mt-1 w-full border-collapse text-center text-[6.5px]">
        <thead>
          <tr>
            <th className={`${headCell} text-left`}>
              <BiText>Parametri i matur / Measured parameter</BiText>
            </th>
            <th className={headCell}>
              Njësia<br />
              <span className="font-normal italic">Units</span>
            </th>
            <th className={headCell}>
              Standardi<br />
              <span className="font-normal italic">Standard</span>
            </th>
            {units.map((row, index) => (
              <th key={`h-${row.specimenCode}-${index}`} className={headCell}>
                Mostra {index + 1}<br />
                <span className="font-normal italic">Sample {index + 1}</span>
              </th>
            ))}
            <th className={headCell}>
              Mesatarja<br />
              <span className="font-normal italic">Average</span>
            </th>
            <th className={headCell}>
              Pasiguria<br />
              <span className="font-normal italic">Uncertainty</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((param) => (
            <tr key={param.en}>
              <td className={`${cell} text-left`}>
                <BiText>{`${param.sq} / ${param.en}`}</BiText>
              </td>
              <td className={cell}>{param.unit}</td>
              <td className={cell}>{param.standard}</td>
              {units.map((row, index) => (
                <td key={`v-${param.en}-${index}`} className={cell}>{show(param.value(row))}</td>
              ))}
              <td className={`${cell} font-bold`}>{show(param.mean)}</td>
              <td className={cell}>{param.uncertainty === "-" ? "-" : `± ${param.uncertainty}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <OfficialReportShell report={report} code="SL-RA-EM-7.8/1.1" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
      <OfficialMetaGrid entries={entries} />
      <OfficialTestingDates start={masonry.testStartDate} end={masonry.testEndDate} />
      <OfficialEnvironmental temperature={masonry.temperature} humidity={masonry.humidity} />

      {hasDeclared ? (
        <div className="mt-2 text-[7px]">
          <BiText>Përmasat e deklaruara / Declared dimensions</BiText>: {show(masonry.declaredLengthMm)} × {show(masonry.declaredWidthMm)} ×{" "}
          {show(masonry.declaredHeightMm)} mm
        </div>
      ) : null}

      {renderParamTable(paramRows)}

      <div className="mt-2 text-[7px]">
        {masonry.surfacePreparation ? (
          <div>
            <BiText>Metoda për përgatitjen e sipërfaqes / Method of surface preparation</BiText>: {masonry.surfacePreparation}
          </div>
        ) : null}
        {masonry.conditioningMethod ? (
          <div>
            <BiText>Metoda e trajtimit të mostrës / Method of conditioning</BiText>: {masonry.conditioningMethod}
          </div>
        ) : null}
      </div>

      {/* --- BS EN 772-1 — compressive strength, in the tested orientation --- */}
      <div className="mt-3 text-[7px] font-bold">
        <BiText>Rezistenca në shtypje / Compressive strength</BiText> — BS EN 772-1:2011+A1:2015
        {" · "}
        <span className="font-normal">
          <BiText>Orientimi / Orientation</BiText>: {orientationLabel}
          {" · δ: "}
          {show(masonry.shapeFactorDelta)}
          {" · "}
          <BiText>Faktori i kondicionimit / Conditioning factor</BiText>: {show(masonry.conditioningFactor)}
        </span>
      </div>
      {renderParamTable(strengthRows)}

      {averages.compressiveStrengthMpa !== undefined && averages.normalisedStrengthMpa === undefined ? (
        <div className="mt-1 text-[7px] italic">
          Rezistenca e normalizuar nuk raportohet: faktori i formës ose faktori i kondicionimit nuk është regjistruar. / Normalised strength not
          reported: shape or conditioning factor not recorded.
        </div>
      ) : null}

      <div className="mt-1 text-[7px]">
        <BiText>Numri i mostrave të testuara / Number of specimens tested</BiText>: {measuredCount || units.length}
        {crushedCount ? ` · ${crushedCount} në shtypje / in compression` : ""}
      </div>

      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={masonry.notes} issueDate={issueDate} testedBy={masonry.technicianName} responsible={masonry.checkedBy} />
    </OfficialReportShell>
  );
}
