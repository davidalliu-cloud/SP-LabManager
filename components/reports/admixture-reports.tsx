"use client";

import type { AdmixtureDryMaterialTest, Client, LabTest, Project, Report, Sample } from "@/lib/types";
import { formatEuropeanDate } from "@/lib/date-format";
import {
  OfficialReportShell,
  OfficialMetaGrid,
  OfficialTestingDates,
  OfficialEnvironmental,
  OfficialAsterisk,
  OfficialNotesAndFooter,
  headOfLabName,
  samplingOperator
} from "./report-shared";
import type { OfficialMetaEntry } from "./report-shared";

/**
 * BS EN 480-8 — conventional dry material content of a concrete admixture.
 *
 * Reports the three weighings per determination alongside what was derived from
 * them, so a reader can check the arithmetic. Determinations that were not run
 * are shown as blank rather than as zero, and the mean states how many
 * determinations it covers.
 */
export function AdmixtureDryMaterialReportPreview({
  report,
  test,
  sample,
  client,
  project,
  admixture
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  admixture: AdmixtureDryMaterialTest;
}) {
  const issueDate = report.issuedAt || report.approvedAt || admixture.testEndDate || sample?.reportDueDate;
  const completed = admixture.determinations.filter((row) => typeof row.dryMaterialPercent === "number");

  const entries: OfficialMetaEntry[] = [
    { sq: "KLIENTI", en: "CLIENT", value: client?.clientName },
    { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
    { sq: "KAMPIONI", en: "SAMPLE", value: admixture.productDescription || sample?.sampleDescription || sample?.sampleType },
    { sq: "NR. I REGJISTRIT", en: "REGISTER No", value: sample?.sampleCode },
    { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: formatEuropeanDate(sample?.dateReceived) },
    { sq: "KAMPIONIMI U KRYE NGA", en: "SAMPLING PERFORMED BY", value: samplingOperator(sample) },
    { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I LËNDËS SË THATË / DETERMINATION OF CONVENTIONAL DRY MATERIAL CONTENT" },
    { sq: "STANDARDI", en: "STANDARD", value: test?.standard || "BS EN 480-8:2012" },
    { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LAB. LOCATION", value: admixture.testingLocation || "01/A Lab. Fiziko-Mekanik / Physical-Mechanical laboratory" }
  ];

  return (
    <OfficialReportShell report={report} code="SL-RA-AD-7.8/1" title="RAPORT TESTIMI / TEST REPORT" className="compact-official-report">
      <OfficialMetaGrid entries={entries} />
      <OfficialTestingDates start={admixture.testStartDate} end={admixture.testEndDate} />
      <OfficialEnvironmental temperature={admixture.temperature} humidity={admixture.humidity} />

      <div className="mt-2 text-[7px]">
        Temperatura e tharjes / <span className="italic">Drying temperature</span>: {admixture.dryingTemperatureC ?? 105} °C
        {admixture.declaredDryMaterialPercent !== undefined ? (
          <>
            {" · "}Vlera e deklaruar / <span className="italic">Declared value</span>: {admixture.declaredDryMaterialPercent} %
          </>
        ) : null}
      </div>

      <table className="mt-2 w-full border-collapse text-center text-[7px]">
        <thead>
          <tr>
            <th className="border border-black py-0.5 font-bold">Nr.</th>
            <th className="border border-black py-0.5 font-bold">Masa e enës<br /><span className="font-normal italic">Dish mass</span><br />[g]</th>
            <th className="border border-black py-0.5 font-bold">Ena + kampioni<br /><span className="font-normal italic">Dish + sample</span><br />[g]</th>
            <th className="border border-black py-0.5 font-bold">Ena + e thatë<br /><span className="font-normal italic">Dish + dried</span><br />[g]</th>
            <th className="border border-black py-0.5 font-bold">Masa e kampionit<br /><span className="font-normal italic">Sample mass</span><br />[g]</th>
            <th className="border border-black py-0.5 font-bold">Mbetja e thatë<br /><span className="font-normal italic">Dried residue</span><br />[g]</th>
            <th className="border border-black py-0.5 font-bold">Lënda e thatë<br /><span className="font-normal italic">Dry material</span><br />[%]</th>
          </tr>
        </thead>
        <tbody>
          {admixture.determinations.map((row, index) => (
            <tr key={`${row.label}-${index}`}>
              <td className="border border-black py-0.5">{row.label}</td>
              <td className="border border-black py-0.5">{row.dishMassG ?? "-"}</td>
              <td className="border border-black py-0.5">{row.dishPlusSampleMassG ?? "-"}</td>
              <td className="border border-black py-0.5">{row.dishPlusDriedMassG ?? "-"}</td>
              <td className="border border-black py-0.5">{row.sampleMassG ?? "-"}</td>
              <td className="border border-black py-0.5">{row.driedMassG ?? "-"}</td>
              <td className="border border-black py-0.5 font-bold">{row.dryMaterialPercent ?? "-"}</td>
            </tr>
          ))}
          <tr>
            <td className="border border-black py-0.5 text-left font-bold" colSpan={6}>
              Lënda e thatë mesatare / <span className="font-normal italic">Mean dry material content</span>
              {completed.length ? ` (${completed.length})` : ""}
            </td>
            <td className="border border-black py-0.5 font-bold">
              {admixture.averageDryMaterialPercent !== undefined ? `${admixture.averageDryMaterialPercent} %` : "-"}
            </td>
          </tr>
        </tbody>
      </table>

      <OfficialAsterisk />
      <OfficialNotesAndFooter
        notes={admixture.notes}
        issueDate={issueDate}
        testedBy={admixture.technicianName}
        responsible={headOfLabName(admixture.checkedBy)}
      />
    </OfficialReportShell>
  );
}
