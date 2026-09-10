"use client";

import type { Client, LabTest, Project, Report, Sample, WaterAnalysisTest } from "@/lib/types";
import { formatEuropeanDate } from "@/lib/date-format";
import {
  OfficialReportShell,
  OfficialMetaGrid,
  OfficialTestingDates,
  OfficialEnvironmental,
  OfficialAsterisk,
  OfficialNotesAndFooter,
  BiText
} from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

/**
 * Water for concrete — BS EN 1008:2002, report SL-RA-U-7.8/1.
 *
 * Six characteristics on one table, each with the standard's own limit and the
 * laboratory's stated measurement uncertainty. A characteristic that was not
 * determined prints a dash rather than a zero, so a partly-run analysis cannot
 * be mistaken for a complete one.
 *
 * Chlorides and sulfates are measured as percentages on SL-FP-U-7.5.1.2 and
 * reported here in mg/l, taking one litre of water as 1000 g. The sulfate
 * figure additionally converts the worksheet's SO3 result to SO4, because the
 * worksheet's 34.3 gravimetric factor is SO3/BaSO4 while this column, and the
 * standard's 2000 mg/l limit, are sulfate.
 */

const cell = "border border-black px-1 py-0.5";
const headCell = "border border-black px-1 py-0.5 font-bold";

function show(value?: number | string, digits?: number) {
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "number") return digits === undefined ? String(value) : value.toFixed(digits);
  return value;
}

type Characteristic = {
  no: string;
  sq: string;
  en: string;
  unit: string;
  result?: number | string;
  digits?: number;
  limit: string;
  uncertainty?: string;
};

export function WaterAnalysisReportPreview({
  report,
  test,
  sample,
  client,
  project,
  water
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  water: WaterAnalysisTest;
}) {
  const issueDate = report.issuedAt || report.approvedAt || water.testEndDate || sample?.reportDueDate;
  const r = water.results;

  const entries: OfficialMetaEntry[] = [
    { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
    { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
    { sq: "ADRESA", en: "ADDRESS", value: client?.address },
    { sq: "KONTAKTET", en: "CONTACT", value: client?.contactPerson },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "KAMPIONI", en: "SAMPLE", value: "UJË PËR BETON / WATER FOR CONCRETE" },
    { sq: "TIPI DHE BURIMI I UJIT", en: "TYPE AND SOURCE OF THE WATER", value: water.waterTypeAndSource },
    { sq: "VENDI I MARRJES SË KAMPIONIT", en: "PLACE OF SAMPLING", value: water.samplingPlace },
    { sq: "TIPI I AMBALAZHIT", en: "TYPE OF PACKAGING", value: water.packagingType || "SHISHE PLASTIKE / PLASTIC BOTTLE" },
    { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: formatEuropeanDate(sample?.dateReceived) },
    {
      sq: "OPERATORI I MARRJES SË KAMPIONIT",
      en: "SAMPLING OPERATOR",
      value: water.samplingOperator || "KLIENTI / CLIENT"
    },
    {
      sq: "TESTIMI",
      en: "TEST",
      value:
        "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-KIMIKE TË UJIT PËR BETON / DETERMINATION OF PHYSICAL-CHEMICAL CHARACTERISTICS OF CONCRETE WATER"
    },
    {
      sq: "METODAT E TESTIMIT",
      en: "TEST METHODS",
      value:
        "VIZUALE, TITRIMETRI, GRAVIMETRI, INSTRUMENTALE / VISUAL, GRAVIMETRIC, TITRIMETRIC AND INSTRUMENTAL METHODS"
    },
    {
      sq: "STANDARDI I TESTIMIT",
      en: "TEST STANDARD",
      value: test?.standard || "BS EN 1008:2002; BS EN 196-2:2013; BS EN ISO 10523:2012"
    },
    {
      sq: "VENDI KU ËSHTË PERFORMUAR TESTI",
      en: "LAB. LOCATION",
      value: water.testingLocation || "01/B Laboratori Kimik / Chemical laboratory"
    }
  ];

  const characteristics: Characteristic[] = [
    {
      no: "1",
      sq: "Ngjyra e ujit",
      en: "Colour",
      unit: "_",
      result: r.colour,
      limit: "E verdhë e zbehtë ose më e zbehtë / Pale yellow or paler"
    },
    {
      no: "2",
      sq: "Aroma e ujit",
      en: "Odour",
      unit: "_",
      result: r.odour,
      limit: "Aromë e lehtë e H2S / Slight smell of hydrogen sulphide"
    },
    {
      no: "3",
      sq: "Densiteti i ujit",
      en: "Water density at 20 ºC",
      unit: "kg/m³",
      result: r.densityKgM3,
      digits: 1,
      limit: "_",
      uncertainty: "± 0.1"
    },
    { no: "4", sq: "Vlera e pH", en: "pH Value", unit: "_", result: r.ph, digits: 2, limit: "≥ 4", uncertainty: "± 0.42" },
    {
      no: "5",
      sq: "Përmbajtja e klorureve",
      en: "Chlorides content (Clˉ)",
      unit: "mg/l",
      result: r.chlorideMgL,
      digits: 1,
      limit: "≤ 1000",
      uncertainty: "± 0.22"
    },
    {
      no: "6",
      sq: "Përmbajtja e sulfateve",
      en: "Sulphate content (SO4ˉ²)",
      unit: "mg/l",
      result: r.sulfateMgL,
      digits: 1,
      limit: "≤ 2000",
      uncertainty: "± 0.13"
    }
  ];

  return (
    <OfficialReportShell report={report} code="SL-RA-U-7.8/1" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
      <OfficialMetaGrid entries={entries} />
      <OfficialTestingDates start={water.testStartDate} end={water.testEndDate} />
      <OfficialEnvironmental temperature={water.temperature} humidity={water.humidity} />

      <table className="official-table mt-2 w-full border-collapse text-[7px]">
        <thead>
          <tr>
            <th className={headCell}>
              Nr.
              <br />
              <span className="font-normal italic">No.</span>
            </th>
            <th className={headCell}>
              Karakteristikat
              <br />
              <span className="font-normal italic">Characteristics</span>
            </th>
            <th className={headCell}>
              Njësia
              <br />
              <span className="font-normal italic">Units</span>
            </th>
            <th className={headCell}>
              Rezultatet e testimit
              <br />
              <span className="font-normal italic">Test results</span>
            </th>
            <th className={headCell}>
              Kërkesat specifike sipas BS EN 1008:2002
              <br />
              <span className="font-normal italic">BS EN 1008:2002 Standard limits</span>
            </th>
            <th className={headCell}>
              Pasiguria në matje
              <br />
              <span className="font-normal italic">Measurement uncertainty</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {characteristics.map((row) => (
            <tr key={row.no}>
              <td className={`${cell} text-center`}>{row.no}</td>
              <td className={cell}>
                {row.sq} / <span className="italic">{row.en}</span>
              </td>
              <td className={`${cell} text-center`}>{row.unit}</td>
              <td className={`${cell} text-center font-bold`}>{show(row.result, row.digits)}</td>
              <td className={`${cell} text-center`}>
                <BiText>{row.limit}</BiText>
              </td>
              <td className={`${cell} text-center`}>{row.uncertainty ?? "_"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <OfficialAsterisk />
      <OfficialNotesAndFooter
        notes={water.notes}
        issueDate={issueDate}
        testedBy={water.technicianName}
        responsibleOverride={water.checkedBy || "Ing./Eng. Besiana ALLIU"}
      />
    </OfficialReportShell>
  );
}
