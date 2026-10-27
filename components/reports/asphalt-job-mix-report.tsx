"use client";

import type { AsphaltJobMixTest, Client, LabTest, Project, Report, Sample } from "@/lib/types";
import { jobMixOptimumCandidates } from "@/lib/calculations";
import { EN_13108_GRADATION_LIMITS, formatLimit } from "@/lib/asphalt-gradation-limits";
import { formatEuropeanDate } from "@/lib/date-format";
import {
  CoreMetaRow,
  OfficialEnvironmental,
  OfficialNotesAndFooter,
  OfficialReportShell,
  samplingOperator
} from "./report-shared";

/**
 * The recipe formulation report, SL-FP-AS-7.5.1.2 as a certificate.
 *
 * The master runs to six pages because it repeats one page of determinations
 * per bitumen dosage. Here the dosages are columns of a single table, which is
 * the same information in the form a reader actually compares it in: the point
 * of a mix design is how the mixture changes across the dosages, and that is
 * invisible when each one sits on its own page.
 */
export function AsphaltJobMixReportPreview({
  report,
  test,
  sample,
  client,
  project,
  jobMix
}: {
  report: Report;
  test?: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  jobMix: AsphaltJobMixTest;
}) {
  const dosages = jobMix.dosages;
  const candidates = jobMixOptimumCandidates(dosages, jobMix.targetAirVoidsPercent);
  const envelope = EN_13108_GRADATION_LIMITS[jobMix.gradationTarget] ?? [];
  const issueDate = report.issuedAt || report.approvedAt || jobMix.formulationDate;

  const rows: Array<{ sq: string; en: string; unit: string; read: (dosage: AsphaltJobMixTest["dosages"][number]) => number | string }> = [
    { sq: "Bitumi", en: "Bitumen", unit: "%", read: (dosage) => dosage.bitumenPercent },
    { sq: "Masa e bitumit", en: "Bitumen mass", unit: "g", read: (dosage) => dosage.bitumenMassG },
    { sq: "Masa e agregatit", en: "Aggregate mass", unit: "g", read: (dosage) => dosage.aggregateMassG },
    { sq: "Densiteti Marshall", en: "Bulk density", unit: "g/cm³", read: (dosage) => dosage.averageBulkDensityGcm3 || "—" },
    { sq: "Densiteti maksimal", en: "Maximum density", unit: "g/cm³", read: (dosage) => dosage.averageMaximumDensityGcm3 || "—" },
    { sq: "Boshllëqet e ajrit", en: "Air voids", unit: "%", read: (dosage) => dosage.airVoidsPercent || "—" },
    { sq: "VMA", en: "VMA", unit: "%", read: (dosage) => dosage.vmaPercent || "—" },
    { sq: "Stabiliteti i korrektuar", en: "Corrected stability", unit: "kN", read: (dosage) => dosage.averageCorrectedStabilityKn || "—" },
    { sq: "Rrjedhshmëria", en: "Flow", unit: "mm", read: (dosage) => dosage.averageFlowMm || "—" },
    { sq: "Koeficienti Marshall", en: "Marshall quotient", unit: "kN/mm", read: (dosage) => dosage.averageMarshallQuotientKnMm || "—" }
  ];

  return (
    <OfficialReportShell
      report={report}
      code="SL-FP-AS-7.5.1.2"
      title="FORMULIMI I RECETËS SË PRODHIMIT TË PËRZIERJES SË ASFALTOBETONEVE / ASPHALT MIXTURE DESIGN"
    >
      <div className="mt-3">
        <CoreMetaRow sq="POROSITËSI" en="PURCHASER" value={client?.clientName} />
        <CoreMetaRow sq="OBJEKTI" en="OBJECT" value={project?.projectName} />
        <CoreMetaRow sq="KAMPIONI" en="SAMPLE" value={jobMix.sampleName || sample?.sampleType} />
        <CoreMetaRow sq="KODI I KAMPIONIT" en="SAMPLE CODE" value={sample?.sampleCode} />
        <CoreMetaRow sq="DATA E MARRJES SË KAMPIONIT" en="SAMPLING DATE" value={formatEuropeanDate(jobMix.samplingDate)} />
        <CoreMetaRow sq="DATA E PRANIMIT NË LABORATOR" en="DATE OF RECEIPT" value={formatEuropeanDate(jobMix.receiptDate)} />
        <CoreMetaRow sq="DATA E HARTIMIT TË RECETËS" en="FORMULATION DATE" value={formatEuropeanDate(jobMix.formulationDate)} />
        <CoreMetaRow sq="OPERATORI I MARRJES SË KAMPIONIT" en="SAMPLING OPERATOR" value={samplingOperator(sample)} />
        <CoreMetaRow sq="TESTI" en="TEST" value="FORMULIMI I RECETËS SË PRODHIMIT TË PËRZIERJES SË ASFALTOBETONEVE / ASPHALT MIXTURE DESIGN" />
        <CoreMetaRow sq="STANDARDI I TESTIMIT" en="TEST STANDARD" value={test?.standard || "BS EN 13108-1:2016; BS EN 13108-4:2016; BS EN 13108-20:2016"} />
        <CoreMetaRow sq="BREZI I SYNUAR" en="TARGET ENVELOPE" value={`${jobMix.gradationTarget} (BS EN 13108-1)`} />
        <CoreMetaRow sq="VENDI KU ËSHTË PERFORMUAR TESTI" en="TESTING PLACE" value={jobMix.testingLocation || "05/A"} />
        <OfficialEnvironmental temperature={jobMix.temperature} humidity={jobMix.humidity} />
      </div>

      <h3 className="mt-4 text-[9pt] font-bold uppercase">Përbërja e agregatit / Aggregate composition</h3>
      <table className="official-table mt-1 w-full border-collapse text-center text-[9pt]">
        <thead><tr><th className="text-left">Fraksioni / Fraction</th><th>Pjesa / Share [%]</th></tr></thead>
        <tbody>
          {jobMix.fractions.map((fraction) => (
            <tr key={fraction.name}><td className="text-left">{fraction.name}</td><td>{fraction.proportionPercent}</td></tr>
          ))}
          <tr>
            <td className="text-left font-bold">Totali / Total</td>
            <td className="font-bold">{jobMix.fractions.reduce((sum, fraction) => sum + (fraction.proportionPercent || 0), 0)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-1 text-[8pt]">
        Masa e kampionit provë / Trial batch mass: {jobMix.specimenMassG} g. Peshat e agregateve janë me peshim individual dhe jo kumulativ /
        aggregate masses are weighed individually, not cumulatively.
      </p>

      <h3 className="mt-4 text-[9pt] font-bold uppercase">Përcaktimet për çdo dozim / Determinations per dosage</h3>
      <table className="official-table mt-1 w-full border-collapse text-center text-[9pt]">
        <thead>
          <tr>
            <th className="text-left">Parametri / Parameter</th>
            <th>Njësia / Unit</th>
            {dosages.map((dosage, index) => <th key={index}>{dosage.bitumenPercent}%</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.sq}>
              <td className="text-left">{row.sq} / <span className="italic">{row.en}</span></td>
              <td>{row.unit}</td>
              {dosages.map((dosage, index) => <td key={index}>{row.read(dosage)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      {envelope.length ? (
        <>
          <h3 className="mt-4 text-[9pt] font-bold uppercase">Brezi granulometrik i synuar / Target grading envelope</h3>
          <table className="official-table mt-1 w-full border-collapse text-center text-[9pt]">
            <thead><tr><th>Sita / Sieve [mm]</th>{envelope.map((limit) => <th key={limit.sieveSizeMm}>{limit.sieveSizeMm}</th>)}</tr></thead>
            <tbody>
              <tr>
                <td className="text-left">Kalimi / Passing [%]</td>
                {envelope.map((limit) => <td key={limit.sieveSizeMm}>{formatLimit(limit)}</td>)}
              </tr>
            </tbody>
          </table>
        </>
      ) : null}

      <h3 className="mt-4 text-[9pt] font-bold uppercase">Dozimi i adoptuar / Adopted bitumen content</h3>
      {candidates.length ? (
        <p className="mt-1 text-[9pt]">
          {candidates.map((candidate) => {
            const label = candidate.basis === "max-stability"
              ? "stabiliteti maksimal / maximum stability"
              : candidate.basis === "max-density"
                ? "densiteti maksimal / maximum density"
                : `boshllëqet pranë ${jobMix.targetAirVoidsPercent}% / air voids near ${jobMix.targetAirVoidsPercent}%`;
            return `${label}: ${candidate.bitumenPercent}%`;
          }).join("  ·  ")}
        </p>
      ) : null}
      <p className="mt-1 text-[10pt] font-bold">
        {jobMix.optimumBitumenPercent != null
          ? `${jobMix.optimumBitumenPercent}% bitum${jobMix.optimumBasis ? ` — ${jobMix.optimumBasis}` : ""}`
          : "Dozimi nuk është adoptuar / No dosage adopted"}
      </p>

      <OfficialNotesAndFooter
        notes={jobMix.notes}
        testedBy={jobMix.technicianName || report.draftedBy}
        responsible={jobMix.checkedBy}
        issueDate={issueDate}
        disclaimers={
          <>
            <p>Rezultatet në këtë raport testimi i përkasin vetëm mostrës së testuar. / <span className="italic">The results relate only to the items tested.</span></p>
            <p>Ky raport testimi nuk mund të riprodhohet në mënyrë të pjesshme pa aprovimin me shkrim të laboratorit. / <span className="italic">The test report shall not be reproduced except in full without the written approval of the laboratory.</span></p>
          </>
        }
      />
    </OfficialReportShell>
  );
}
