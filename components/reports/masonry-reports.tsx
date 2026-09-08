"use client";

import type { Client, LabTest, MasonryUnitTest, Project, Report, Sample } from "@/lib/types";
import { formatEuropeanDate } from "@/lib/date-format";
import { masonryDimensionDeviation } from "@/lib/calculations";
import {
  OfficialReportShell,
  OfficialMetaGrid,
  OfficialTestingDates,
  OfficialEnvironmental,
  OfficialAsterisk,
  OfficialNotesAndFooter,
  BiText,
  headOfLabName,
  samplingOperator
} from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

/**
 * Masonry units — BS EN 772-16, -13, -21 and -1 reported together.
 *
 * The four determinations are accredited separately (AT-034 to AT-037) and are
 * given their own section here, each headed by its own standard, so a reader
 * can see which result came from which method.
 *
 * A unit that was not put through one of the four shows a blank in that
 * section rather than a zero, and every mean says how many units it covers.
 */

const cell = "border border-black py-0.5";
const headCell = "border border-black py-0.5 font-bold";

function show(value?: number, suffix = "") {
  return value === undefined ? "-" : `${value}${suffix}`;
}

/** Mean row shared by the three sections: the label carries the count so a
 *  partially completed section cannot be mistaken for a full one. */
function MeanRow({ label, span, count, children }: { label: string; span: number; count: number; children: React.ReactNode }) {
  return (
    <tr>
      <td className={`${cell} text-left font-bold`} colSpan={span}>
        <BiText>{label}</BiText>
        {count ? ` (${count})` : ""}
      </td>
      {children}
    </tr>
  );
}

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
  const weighedCount = units.filter((row) => row.grossDryDensityKgM3 !== undefined).length;
  const immersedCount = units.filter((row) => row.waterAbsorptionPercent !== undefined).length;
  const crushedCount = units.filter((row) => row.compressiveStrengthMpa !== undefined).length;

  const hasNetVolume = units.some((row) => row.netDryDensityKgM3 !== undefined);
  const declared = [masonry.declaredLengthMm, masonry.declaredWidthMm, masonry.declaredHeightMm];
  const hasDeclared = declared.some((value) => value !== undefined);

  const entries: OfficialMetaEntry[] = [
    { sq: "KLIENTI", en: "CLIENT", value: client?.clientName },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    {
      sq: "KAMPIONI",
      en: "SAMPLE",
      value: masonry.productDescription || sample?.sampleDescription || sample?.sampleType
    },
    { sq: "LLOJI I NJËSISË", en: "UNIT TYPE", value: masonry.unitCategory },
    { sq: "PRODHUESI", en: "MANUFACTURER", value: masonry.manufacturer },
    { sq: "NR. I REGJISTRIT", en: "REGISTER No", value: sample?.sampleCode },
    { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: formatEuropeanDate(sample?.dateReceived) },
    { sq: "KAMPIONIMI U KRYE NGA", en: "SAMPLING PERFORMED BY", value: samplingOperator(sample) },
    {
      sq: "TESTI",
      en: "TEST",
      value: "ELEMENT MURATURE — PËRMASAT, DENSITETI, UJËTHITHJA DHE REZISTENCA NË SHTYPJE / MASONRY UNITS — DIMENSIONS, DENSITY, WATER ABSORPTION AND COMPRESSIVE STRENGTH"
    },
    {
      sq: "STANDARDI",
      en: "STANDARD",
      value: test?.standard || "BS EN 772-16:2011; BS EN 772-13:2000; BS EN 772-21:2011; BS EN 772-1:2011+A1:2015"
    },
    {
      sq: "VENDI KU ËSHTË PERFORMUAR TESTI",
      en: "LAB. LOCATION",
      value: masonry.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory"
    }
  ];

  return (
    <OfficialReportShell report={report} code="SL-RA-EM-7.8/1" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
      <OfficialMetaGrid entries={entries} />
      <OfficialTestingDates start={masonry.testStartDate} end={masonry.testEndDate} />
      <OfficialEnvironmental temperature={masonry.temperature} humidity={masonry.humidity} />

      {hasDeclared ? (
        <div className="mt-2 text-[7px]">
          <BiText>Përmasat e deklaruara / Declared dimensions</BiText>: {show(masonry.declaredLengthMm)} × {show(masonry.declaredWidthMm)} ×{" "}
          {show(masonry.declaredHeightMm)} mm
        </div>
      ) : null}

      {/* --- BS EN 772-16 — dimensions ------------------------------------ */}
      <div className="mt-3 text-[7px] font-bold">
        1. <BiText>Përmasat / Dimensions</BiText> — BS EN 772-16:2011
      </div>
      <table className="mt-1 w-full border-collapse text-center text-[7px]">
        <thead>
          <tr>
            <th className={headCell}>Nr.</th>
            <th className={headCell}>
              Gjatësia<br />
              <span className="font-normal italic">Length</span>
              <br />[mm]
            </th>
            <th className={headCell}>
              Gjerësia<br />
              <span className="font-normal italic">Width</span>
              <br />[mm]
            </th>
            <th className={headCell}>
              Lartësia<br />
              <span className="font-normal italic">Height</span>
              <br />[mm]
            </th>
            {hasDeclared ? (
              <th className={headCell} colSpan={3}>
                Devijimi nga e deklaruara<br />
                <span className="font-normal italic">Deviation from declared</span>
                <br />[mm]
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {units.map((row, index) => (
            <tr key={`dim-${row.specimenCode}-${index}`}>
              <td className={cell}>{row.specimenCode}</td>
              <td className={cell}>{show(row.lengthMm)}</td>
              <td className={cell}>{show(row.widthMm)}</td>
              <td className={cell}>{show(row.heightMm)}</td>
              {hasDeclared ? (
                <>
                  <td className={cell}>{show(masonryDimensionDeviation(row.lengthMm, masonry.declaredLengthMm))}</td>
                  <td className={cell}>{show(masonryDimensionDeviation(row.widthMm, masonry.declaredWidthMm))}</td>
                  <td className={cell}>{show(masonryDimensionDeviation(row.heightMm, masonry.declaredHeightMm))}</td>
                </>
              ) : null}
            </tr>
          ))}
          <MeanRow label="Mesatarja / Mean" span={1} count={measuredCount}>
            <td className={`${cell} font-bold`}>{show(averages.lengthMm)}</td>
            <td className={`${cell} font-bold`}>{show(averages.widthMm)}</td>
            <td className={`${cell} font-bold`}>{show(averages.heightMm)}</td>
            {hasDeclared ? (
              <>
                <td className={`${cell} font-bold`}>{show(masonryDimensionDeviation(averages.lengthMm, masonry.declaredLengthMm))}</td>
                <td className={`${cell} font-bold`}>{show(masonryDimensionDeviation(averages.widthMm, masonry.declaredWidthMm))}</td>
                <td className={`${cell} font-bold`}>{show(masonryDimensionDeviation(averages.heightMm, masonry.declaredHeightMm))}</td>
              </>
            ) : null}
          </MeanRow>
        </tbody>
      </table>

      {/* --- BS EN 772-13 and 772-21 — density and absorption -------------- */}
      <div className="mt-3 text-[7px] font-bold">
        2. <BiText>Densiteti dhe ujëthithja / Density and water absorption</BiText> — BS EN 772-13:2000; BS EN 772-21:2011
      </div>
      <table className="mt-1 w-full border-collapse text-center text-[7px]">
        <thead>
          <tr>
            <th className={headCell}>Nr.</th>
            <th className={headCell}>
              Masa e thatë<br />
              <span className="font-normal italic">Dry mass</span>
              <br />[g]
            </th>
            <th className={headCell}>
              Vëllimi bruto<br />
              <span className="font-normal italic">Gross volume</span>
              <br />[mm³]
            </th>
            <th className={headCell}>
              Densiteti bruto<br />
              <span className="font-normal italic">Gross density</span>
              <br />[kg/m³]
            </th>
            {hasNetVolume ? (
              <th className={headCell}>
                Densiteti neto<br />
                <span className="font-normal italic">Net density</span>
                <br />[kg/m³]
              </th>
            ) : null}
            <th className={headCell}>
              Masa e ngopur<br />
              <span className="font-normal italic">Saturated mass</span>
              <br />[g]
            </th>
            <th className={headCell}>
              Ujëthithja<br />
              <span className="font-normal italic">Water absorption</span>
              <br />[%]
            </th>
          </tr>
        </thead>
        <tbody>
          {units.map((row, index) => (
            <tr key={`den-${row.specimenCode}-${index}`}>
              <td className={cell}>{row.specimenCode}</td>
              <td className={cell}>{show(row.dryMassG)}</td>
              <td className={cell}>{show(row.grossVolumeMm3)}</td>
              <td className={cell}>{show(row.grossDryDensityKgM3)}</td>
              {hasNetVolume ? <td className={cell}>{show(row.netDryDensityKgM3)}</td> : null}
              <td className={cell}>{show(row.saturatedMassG)}</td>
              <td className={cell}>{show(row.waterAbsorptionPercent)}</td>
            </tr>
          ))}
          <MeanRow label="Mesatarja / Mean" span={3} count={weighedCount}>
            <td className={`${cell} font-bold`}>{show(averages.grossDryDensityKgM3)}</td>
            {hasNetVolume ? <td className={`${cell} font-bold`}>{show(averages.netDryDensityKgM3)}</td> : null}
            <td className={cell}>-</td>
            <td className={`${cell} font-bold`}>
              {averages.waterAbsorptionPercent === undefined ? "-" : `${averages.waterAbsorptionPercent} (${immersedCount})`}
            </td>
          </MeanRow>
        </tbody>
      </table>

      {/* --- BS EN 772-1 — compressive strength ---------------------------- */}
      <div className="mt-3 text-[7px] font-bold">
        3. <BiText>Rezistenca në shtypje / Compressive strength</BiText> — BS EN 772-1:2011+A1:2015
      </div>
      <div className="mt-1 text-[7px]">
        <BiText>Faktori i formës δ / Shape factor</BiText>: {show(masonry.shapeFactorDelta)}
        {" · "}
        <BiText>Faktori i kondicionimit / Conditioning factor</BiText>: {show(masonry.conditioningFactor)}
        {masonry.conditioningMethod ? (
          <>
            {" · "}
            <BiText>Kondicionimi / Conditioning</BiText>: {masonry.conditioningMethod}
          </>
        ) : null}
      </div>
      <table className="mt-1 w-full border-collapse text-center text-[7px]">
        <thead>
          <tr>
            <th className={headCell}>Nr.</th>
            <th className={headCell}>
              Sipërfaqja e ngarkuar<br />
              <span className="font-normal italic">Loaded area</span>
              <br />[mm²]
            </th>
            <th className={headCell}>
              Forca maksimale<br />
              <span className="font-normal italic">Maximum load</span>
              <br />[kN]
            </th>
            <th className={headCell}>
              Rezistenca<br />
              <span className="font-normal italic">Compressive strength</span>
              <br />[MPa]
            </th>
            <th className={headCell}>
              Rezistenca e normalizuar<br />
              <span className="font-normal italic">Normalised strength</span>
              <br />[MPa]
            </th>
          </tr>
        </thead>
        <tbody>
          {units.map((row, index) => (
            <tr key={`str-${row.specimenCode}-${index}`}>
              <td className={cell}>{row.specimenCode}</td>
              <td className={cell}>{show(row.loadedAreaMm2)}</td>
              <td className={cell}>{show(row.maximumLoadKn)}</td>
              <td className={cell}>{show(row.compressiveStrengthMpa)}</td>
              <td className={`${cell} font-bold`}>{show(row.normalisedStrengthMpa)}</td>
            </tr>
          ))}
          <MeanRow label="Mesatarja / Mean" span={3} count={crushedCount}>
            <td className={`${cell} font-bold`}>{show(averages.compressiveStrengthMpa)}</td>
            <td className={`${cell} font-bold`}>{show(averages.normalisedStrengthMpa)}</td>
          </MeanRow>
        </tbody>
      </table>

      {averages.compressiveStrengthMpa !== undefined && averages.normalisedStrengthMpa === undefined ? (
        <div className="mt-1 text-[7px] italic">
          Rezistenca e normalizuar nuk raportohet: faktori i formës ose faktori i kondicionimit nuk është regjistruar.
        </div>
      ) : null}

      <OfficialAsterisk />
      <OfficialNotesAndFooter
        notes={masonry.notes}
        issueDate={issueDate}
        testedBy={masonry.technicianName}
        responsible={headOfLabName(masonry.checkedBy)}
      />
    </OfficialReportShell>
  );
}
