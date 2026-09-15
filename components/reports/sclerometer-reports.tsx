"use client";

import type { Client, LabTest, Project, Report, Sample, SclerometerTest } from "@/lib/types";
import { formatEuropeanDate } from "@/lib/date-format";
import {
  OfficialReportShell,
  OfficialMetaGrid,
  OfficialEnvironmental,
  OfficialAsterisk,
  OfficialNotesAndFooter
} from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

/**
 * Rebound hammer — SL-RA-PJ-7.8/1.3.
 *
 * A replica of the laboratory's own template: one test location, and a table of
 * ten numbered parameters. The individual hammer blows are not printed — the
 * template keeps them in a working column and reports only how many were struck
 * and their average, so that is what appears here.
 */

const cell = "border border-black px-1 py-0.5";
const headCell = "border border-black px-1 py-0.5 font-bold";

function show(value?: number | string, digits?: number) {
  if (value === undefined || value === null || value === "") return "-";
  return typeof value === "number" && digits !== undefined ? value.toFixed(digits) : String(value);
}

type Row = {
  no: string;
  sq: string;
  en: string;
  unit: string;
  value?: string;
  /** Row 2 carries a start and an end date on two lines, as the template does. */
  split?: { sq: string; en: string; value?: string }[];
  bold?: boolean;
};

export function SclerometerReportPreview({
  report,
  test,
  sample,
  client,
  project,
  sclerometer
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  sclerometer: SclerometerTest;
}) {
  const s = sclerometer;
  const issueDate = report.issuedAt || report.approvedAt || s.testEndDate || sample?.reportDueDate;

  const entries: OfficialMetaEntry[] = [
    { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
    { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
    { sq: "ADRESA", en: "ADRESS", value: client?.address },
    { sq: "KONTAKTET", en: "CONTACT", value: [client?.phone, client?.email].filter(Boolean).join(" ; ") },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "ELEMENTI", en: "ELEMENT", value: s.element },
    { sq: "KUOTA", en: "QUOTE", value: s.quote },
    { sq: "DATA E MARRJES SË POROSISË", en: "ORDER DATE", value: formatEuropeanDate(s.orderDate) },
    {
      sq: "TESTI",
      en: "TEST",
      value:
        "PROVA JO-DESTRUKTIVE. PËRCAKTIMI I REZISTENCËS MEKANIKE TË BETONIT ME SKLEROMETER* / NON-DESTRUCTIVE TESTING. DETERMINATION OF REBOUND NUMBER*"
    },
    { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 12504-2:2021" },
    {
      sq: "VENDI KU ËSHTË PERFORMUAR TESTI",
      en: "LABORATORY LOCATION",
      value: s.testingLocation || "Në terren / In-situ"
    }
  ];

  const rows: Row[] = [
    { no: "1", sq: "Data e betonimit", en: "Casting date", unit: "(dd/mm/vv)", value: formatEuropeanDate(s.castingDate) },
    {
      no: "2",
      sq: "Data e testimit",
      en: "Testing date",
      unit: "(dd/mm/vv)",
      split: [
        { sq: "Fillimi", en: "Starting", value: formatEuropeanDate(s.testStartDate) },
        { sq: "Mbarimi", en: "Ending", value: formatEuropeanDate(s.testEndDate) }
      ]
    },
    { no: "3", sq: "Koha e maturimit të betonit", en: "Concrete age", unit: "ditë / days", value: s.concreteAge },
    { no: "4", sq: "Kendi i goditjes së sklerometrit", en: "Angle", unit: "α", value: s.impactAngle },
    { no: "5", sq: "Goditjet e sklerometrit", en: "Hammer rebound", unit: "nr. / no.", value: show(s.reboundCount) },
    {
      no: "6",
      sq: "Leximi mesatar i sklerometrit *",
      en: "Average of rebound number*",
      unit: "R",
      value: show(s.averageRebound, s.averageRebound === undefined ? undefined : 1),
      bold: true
    },
    {
      no: "7",
      sq: "Rezistenca në shtypje kubike",
      en: "Cube compressive strength Rck",
      unit: "MPa",
      value: show(s.cubeStrengthRck, s.cubeStrengthRck === undefined ? undefined : 1),
      bold: true
    },
    { no: "8", sq: "Gabimi mesatar", en: "Mean error", unit: "∆MPa", value: show(s.meanError, s.meanError === undefined ? undefined : 2) },
    {
      no: "9",
      sq: "Rezistenca në shtypje kubike maksimale",
      en: "Maximal cube compressive strength  Rmax = Rck + ∆",
      unit: "MPa",
      value: show(s.strengthMax, s.strengthMax === undefined ? undefined : 2)
    },
    {
      no: "10",
      sq: "Rezistenca në shtypje kubike minimale",
      en: "Minimal cube compressive strength  Rmin = Rck − ∆",
      unit: "MPa",
      value: show(s.strengthMin, s.strengthMin === undefined ? undefined : 2)
    }
  ];

  return (
    <OfficialReportShell report={report} code="SL-RA-PJ-7.8/1.3" title="RAPORT TESTIM / TEST REPORT" className="compact-official-report">
      <OfficialMetaGrid entries={entries} />
      <OfficialEnvironmental temperature={s.temperature} humidity={s.humidity} />

      <table className="official-table mt-2 w-full border-collapse text-[7px]">
        <thead>
          <tr>
            <th className={`${headCell} text-center`}>
              Nr.
              <br />
              <span className="font-normal italic">No.</span>
            </th>
            <th className={headCell}>
              Përshkrimi
              <br />
              <span className="font-normal italic">Description</span>
            </th>
            <th className={`${headCell} text-center`}>
              Njësia matëse
              <br />
              <span className="font-normal italic">Units</span>
            </th>
            <th className={`${headCell} text-center`}>
              Rezultatet e testimit
              <br />
              <span className="font-normal italic">Test results</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              <td className={`${cell} text-center`}>{row.no}</td>
              <td className={cell}>
                {row.sq} / <span className="italic">{row.en}</span>
                {row.split ? (
                  <div className="mt-0.5">
                    {row.split.map((part) => (
                      <div key={part.en}>
                        {part.sq} / <span className="italic">{part.en}</span>:
                      </div>
                    ))}
                  </div>
                ) : null}
              </td>
              <td className={`${cell} text-center`}>{row.unit}</td>
              <td className={`${cell} text-center${row.bold ? " font-bold" : ""}`}>
                {row.split ? (
                  row.split.map((part) => <div key={part.en}>{part.value || "-"}</div>)
                ) : (
                  row.value ?? "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {s.instrumentModel || s.instrumentSerial ? (
        <div className="mt-1 text-[7px]">
          Pajisja / <span className="italic">Instrument</span>:{" "}
          {[s.instrumentModel, s.instrumentSerial && `S/N ${s.instrumentSerial}`].filter(Boolean).join(", ")}
        </div>
      ) : null}

      <OfficialAsterisk />
      <OfficialNotesAndFooter
        layout="flow"
        notes={s.notes}
        issueDate={issueDate}
        testedBy={s.technicianName}
        responsible={s.checkedBy}
      />
    </OfficialReportShell>
  );
}
