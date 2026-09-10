"use client";

import type { Client, LabTest, Project, Report, Sample, SclerometerTest } from "@/lib/types";
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
 * Rebound hammer — BS EN 12504-2, scope entry AT-069.
 *
 * One row per test location, showing how many readings were taken, how many the
 * standard's median rule discarded, and the resulting rebound index. A location
 * where more than a fifth of the readings were discarded is printed as rejected
 * rather than given an index, so the reader can see it was excluded instead of
 * wondering why the count does not add up.
 *
 * The strength column exists only when the technician supplied the correlation
 * from the instrument's certificate; that correlation is printed underneath, so
 * the reported MPa can always be traced back to the curve that produced it.
 */

const cell = "border border-black px-1 py-0.5";
const headCell = "border border-black px-1 py-0.5 font-bold";

function show(value?: number | string) {
  return value === undefined || value === null || value === "" ? "-" : String(value);
}

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
  const issueDate = report.issuedAt || report.approvedAt || sclerometer.testEndDate || sample?.reportDueDate;
  // Only locations that were actually surveyed appear. An untouched row would
  // otherwise print as "0 readings, -", which reads like a failed test rather
  // than one that was never carried out.
  const surveyed = sclerometer.locations.filter((row) => (row.readingCount ?? 0) > 0);
  const reported = surveyed.filter((row) => row.reboundIndex !== undefined);
  const hasStrength = sclerometer.locations.some((row) => row.compressiveStrengthMpa !== undefined);

  const correlationText =
    sclerometer.correlationA !== undefined && sclerometer.correlationB !== undefined
      ? sclerometer.correlationKind === "power"
        ? `fc = ${sclerometer.correlationA} × R^${sclerometer.correlationB}`
        : `fc = ${sclerometer.correlationA} × R ${sclerometer.correlationB < 0 ? "−" : "+"} ${Math.abs(sclerometer.correlationB)}`
      : undefined;

  const entries: OfficialMetaEntry[] = [
    { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
    { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
    { sq: "ADRESA", en: "ADDRESS", value: client?.address },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "STRUKTURA", en: "STRUCTURE", value: sclerometer.structureDescription },
    { sq: "VENDNDODHJA E PROVËS", en: "SURVEY LOCATION", value: sclerometer.surveyLocation || sample?.sampleDescription },
    { sq: "MOSHA E BETONIT", en: "CONCRETE AGE", value: sclerometer.concreteAge },
    { sq: "GJENDJA E SIPËRFAQES", en: "SURFACE CONDITION", value: sclerometer.surfaceCondition },
    { sq: "DATA E PROVËS", en: "SURVEY DATE", value: formatEuropeanDate(sample?.dateReceived) },
    {
      sq: "TESTIMI",
      en: "TEST",
      value:
        "PËRCAKTIMI I REZISTENCËS MEKANIKE NË SHTYPJE ME SKLEROMETËR / DETERMINATION OF REBOUND NUMBER OF HARDENED CONCRETE"
    },
    { sq: "STANDARDI I TESTIMIT", en: "TEST STANDARD", value: test?.standard || "BS EN 12504-2:2021" },
    {
      sq: "PAJISJA",
      en: "INSTRUMENT",
      value: [sclerometer.instrumentModel, sclerometer.instrumentSerial && `S/N ${sclerometer.instrumentSerial}`]
        .filter(Boolean)
        .join(", ")
    },
    {
      sq: "VENDI KU ËSHTË PERFORMUAR TESTI",
      en: "LAB. LOCATION",
      value: sclerometer.testingLocation || "Në terren / On site"
    }
  ];

  return (
    <OfficialReportShell report={report} code="SL-RA-B-7.8/1.11" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
      <OfficialMetaGrid entries={entries} />
      <OfficialTestingDates start={sclerometer.testStartDate} end={sclerometer.testEndDate} />
      <OfficialEnvironmental temperature={sclerometer.temperature} humidity={sclerometer.humidity} />

      <table className="official-table mt-2 w-full border-collapse text-center text-[7px]">
        <thead>
          <tr>
            <th className={headCell}>
              Zona
              <br />
              <span className="font-normal italic">Location</span>
            </th>
            <th className={headCell}>
              Elementi
              <br />
              <span className="font-normal italic">Element</span>
            </th>
            <th className={headCell}>
              Drejtimi
              <br />
              <span className="font-normal italic">Direction</span>
            </th>
            <th className={headCell}>
              Lexime
              <br />
              <span className="font-normal italic">Readings</span>
            </th>
            <th className={headCell}>
              Të hedhura poshtë
              <br />
              <span className="font-normal italic">Discarded</span>
            </th>
            <th className={headCell}>
              Indeksi i rikthimit
              <br />
              <span className="font-normal italic">Rebound index R</span>
            </th>
            {hasStrength ? (
              <th className={headCell}>
                Rezistenca
                <br />
                <span className="font-normal italic">Compressive strength</span>
                <br />
                [MPa]
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {surveyed.map((row, index) => (
            <tr key={`${row.locationCode}-${index}`}>
              <td className={cell}>{show(row.locationCode)}</td>
              <td className={cell}>{show(row.element)}</td>
              <td className={cell}>
                <BiText>{row.direction ?? ""}</BiText>
              </td>
              <td className={cell}>{show(row.readingCount)}</td>
              <td className={cell}>
                {row.discardedCount === undefined ? "-" : `${row.discardedCount}${row.discardedPercent !== undefined ? ` (${row.discardedPercent} %)` : ""}`}
              </td>
              <td className={`${cell} font-bold`}>
                {row.setRejected ? <span className="italic">E papranuar / Rejected</span> : show(row.reboundIndex)}
              </td>
              {hasStrength ? <td className={`${cell} font-bold`}>{show(row.compressiveStrengthMpa)}</td> : null}
            </tr>
          ))}
          <tr>
            <td className={`${cell} text-left font-bold`} colSpan={5}>
              <BiText>Mesatarja / Mean</BiText>
              {reported.length ? ` (${reported.length})` : ""}
            </td>
            <td className={`${cell} font-bold`}>{show(sclerometer.averages.reboundIndex)}</td>
            {hasStrength ? <td className={`${cell} font-bold`}>{show(sclerometer.averages.compressiveStrengthMpa)}</td> : null}
          </tr>
        </tbody>
      </table>

      <div className="mt-2 text-[7px]">
        <BiText>
          Indeksi është mesorja e leximeve sipas BS EN 12504-2; leximet që ndryshojnë nga mesorja me më shumë se 6 njësi hidhen poshtë /
          The index is the median of the readings per BS EN 12504-2; readings differing from the median by more than 6 units are discarded
        </BiText>
        {correlationText ? (
          <div className="mt-1">
            <BiText>Korrelacioni i aplikuar / Correlation applied</BiText>: {correlationText}
            {sclerometer.correlationReference ? ` — ${sclerometer.correlationReference}` : ""}
            {sclerometer.instrumentCalibrationDate
              ? ` (kalibrimi / calibration ${formatEuropeanDate(sclerometer.instrumentCalibrationDate)})`
              : ""}
          </div>
        ) : (
          <div className="mt-1 italic">
            Rezistenca në MPa nuk raportohet: korrelacioni i pajisjes nuk është regjistruar. / Compressive strength is not reported: no
            instrument correlation was recorded.
          </div>
        )}
      </div>

      <OfficialAsterisk />
      <OfficialNotesAndFooter
        layout="flow"
        notes={sclerometer.notes}
        issueDate={issueDate}
        testedBy={sclerometer.technicianName}
        responsible={sclerometer.checkedBy}
      />
    </OfficialReportShell>
  );
}
