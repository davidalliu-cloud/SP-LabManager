"use client";

import type { AdmixtureTest, Client, LabTest, Project, Report, Sample } from "@/lib/types";
import { round } from "@/lib/calculations";
import {
  OfficialReportShell,
  OfficialMetaGrid,
  OfficialTestingDates,
  OfficialEnvironmental,
  OfficialAsterisk,
  OfficialNotesAndFooter
} from "./report-shared";

function fmt(value?: number, digits = 1) {
  return typeof value === "number" && Number.isFinite(value) ? String(round(value, digits)) : "";
}

// SL-RA-AD-7.8/1.1 — Physical-chemical characteristics of concrete admixtures.
// One report fed by the combined admixture worksheet; any characteristic that
// wasn't measured simply shows blank.
export function AdmixtureReportPreview({
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
  admixture: AdmixtureTest;
}) {
  const r = admixture.results;
  const issueDate = report.issuedAt || report.approvedAt || admixture.testEndDate || sample?.reportDueDate;

  return (
    <OfficialReportShell report={report} code="SL-RA-AD-7.8/1.1" className="compact-official-report">
      <OfficialMetaGrid entries={[
        { sq: "Nr. REGJISTRI", en: "REGISTER No.", value: sample?.sampleCode },
        { sq: "KLIENTI", en: "PURCHASER", value: client?.clientName },
        { sq: "ADRESA", en: "ADRESS", value: client?.address },
        { sq: "KONTAKTET", en: "CONTACT", value: client?.phone || client?.email },
        { sq: "OBJEKTI", en: "OBJECT", value: project?.projectName },
        { sq: "KAMPIONI", en: "SAMPLE", value: "ADITIVË PËR BETON / CONCRETE ADDITIVE ADMIXTURES" },
        { sq: "EMËRTIMI I PRODUKTIT", en: "PRODUCT IDENTITY", value: admixture.productIdentity },
        { sq: "DATA E MARRJES SË KAMPIONIT", en: "SAMPLING DATE", value: admixture.samplingDate || sample?.dateReceived },
        { sq: "DATA E PRANIMIT TË KAMPIONIT NË LABORATOR", en: "DATE OF RECEIPT OF THE SPECIMENS IN LABORATORY", value: sample?.dateReceived }
      ]} />
      <div className="mt-1 grid grid-cols-[315px_1fr] gap-x-8 gap-y-1 text-[10pt] leading-[1.15]">
        <OfficialTestingDates start={admixture.testStartDate} end={admixture.testEndDate} />
        <OfficialMetaGrid className="contents" entries={[
          { sq: "OPERATORI I MARRJES SË KAMPIONIT", en: "SAMPLING OPERATOR", value: "KLIENTI / CLIENT" },
          { sq: "TESTI", en: "TEST", value: "PËRCAKTIMI I KARAKTERISTIKAVE FIZIKO-KIMIKE TË ADITIVËVE PËR BETON / DETERMINATION OF PHYSICAL-CHEMICAL CHARACTERISTICS OF CONCRETE ADMIXTURES" },
          { sq: "VENDI KU ËSHTË PERFORMUAR TESTI", en: "LAB. LOCATION", value: admixture.testingLocation || "01/B Laboratori kimik / Chemical laboratory" }
        ]} />
        <OfficialEnvironmental temperature={admixture.temperature} humidity={admixture.humidity} />
      </div>
      <table className="official-table mt-5 w-full border-collapse text-center text-[10pt]">
        <thead>
          <tr>
            <th>Nr.<br /><span className="italic font-normal">No.</span></th>
            <th>Karakteristikat<br /><span className="italic font-normal">Characteristics</span></th>
            <th>Njësia<br /><span className="italic font-normal">Unit</span></th>
            <th>Standardi<br /><span className="italic font-normal">Standard</span></th>
            <th>Rezultatet e testimit<br /><span className="italic font-normal">Test Results</span></th>
            <th>Pasiguria në matje<br /><span className="italic font-normal">Uncertainty of measurement</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td className="text-left">Lënda e thatë / <span className="italic">Dry Mass</span>*</td>
            <td>%</td>
            <td>BS EN 480-8:2012</td>
            <td className="font-bold">{fmt(r.dryMass, 1)}</td>
            <td>±&nbsp;0,5</td>
          </tr>
          <tr>
            <td>2</td>
            <td className="text-left">Reduktimi i ujit / <span className="italic">Water reduction</span>*</td>
            <td>%</td>
            <td>BS EN 480-1:2023</td>
            <td className="font-bold">{fmt(r.waterReduction, 1)}</td>
            <td>±&nbsp;0,82</td>
          </tr>
          <tr>
            <td>3</td>
            <td className="text-left">Densiteti në 20ºC / <span className="italic">Density at 20ºC</span></td>
            <td>g/cm³</td>
            <td>ISO 758:2011</td>
            <td className="font-bold">{fmt(r.density, 3)}</td>
            <td>±&nbsp;0,03</td>
          </tr>
          <tr>
            <td>4</td>
            <td className="text-left">Vlera e pH / <span className="italic">pH value</span></td>
            <td>_</td>
            <td>ISO 4316:2018</td>
            <td className="font-bold">{fmt(r.ph, 2)}</td>
            <td>±&nbsp;0,31</td>
          </tr>
        </tbody>
      </table>
      <OfficialAsterisk />
      <OfficialNotesAndFooter notes={admixture.notes} testedBy={admixture.technicianName} responsible={admixture.checkedBy || "Ing./Eng. Besiana ALLIU"} issueDate={issueDate} />
    </OfficialReportShell>
  );
}
