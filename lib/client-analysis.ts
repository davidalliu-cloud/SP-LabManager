import type { Client, ConcreteCompressiveTest, LabTest, Project, Report, Sample } from "./types";

/**
 * Përmbledhje e punës për një klient — the monthly analysis a client is sent,
 * and the sheet that goes in front of an invoice.
 *
 * Two dates could anchor a period like this and they disagree, so both are
 * reported rather than one chosen: a sample received on 28 September is tested
 * in October and reported in November, and a month scoped on any single one of
 * those omits work the client will recognise as theirs. So:
 *
 *   - samples are counted by the date they were received,
 *   - tests by the date they were completed,
 *   - reports by the date they were issued.
 *
 * The invoice line is the reports: that is what the client is billed for and
 * what they can check against their own records.
 */
export type AnalysisPeriod = { from: string; to: string };

export type ClientAnalysis = {
  client: Client | undefined;
  period: AnalysisPeriod;
  samplesReceived: number;
  testsCompleted: number;
  reportsIssued: number;
  /** Working days from sample received to report issued, averaged. */
  averageTurnaroundDays: number | undefined;
  projects: Array<{ id: string; name: string; samples: number; tests: number; reports: number }>;
  byTestType: Array<{ label: string; tests: number; reports: number }>;
  byMonth: Array<{ key: string; label: string; samples: number; tests: number; reports: number }>;
  concrete: ConcreteSummary | undefined;
  concreteRows: ConcreteCubeRow[];
  reportRows: Array<{
    reportNumber: string;
    sampleCode: string;
    projectName: string;
    testType: string;
    issuedAt: string | undefined;
    status: string;
  }>;
};

/**
 * One line per pour and age — the table this summary exists for.
 *
 * A client wants to read down a month of concrete and see, for each set of
 * cubes: which register number, which element, when it was cast, when it was
 * broken, at what age, what each cube gave and what the set averaged. That is
 * the sheet they can put beside their own pour records, and it is the reason
 * the whole page is landscape.
 */
export type ConcreteCubeRow = {
  sampleCode: string;
  projectName: string;
  element: string;
  strengthClass: string;
  castingDate: string;
  testDate: string;
  ageDays: number | undefined;
  /** One entry per cube, each its own line on the sheet. */
  cubes: ConcreteCubeLine[];
  averageMpa: number | undefined;
  reportNumber: string;
};

export type ConcreteCubeLine = {
  specimenCode: string;
  ageDays: number | undefined;
  weightKg: number | undefined;
  loadKn: number | undefined;
  strengthMpa: number | undefined;
  truckPlate: string | undefined;
};

export type ConcreteSummary = {
  specimens: number;
  averageStrengthMpa: number;
  minStrengthMpa: number;
  maxStrengthMpa: number;
  byClass: Array<{ strengthClass: string; specimens: number; averageStrengthMpa: number }>;
};

const MONTHS_SQ = [
  "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
  "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"
];

/** A stored date or timestamp falls inside the period, compared as calendar days. */
function inPeriod(value: string | undefined, period: AnalysisPeriod) {
  if (!value) return false;
  const day = value.slice(0, 10);
  return day >= period.from && day <= period.to;
}

/** The date a report actually went out; falls back through the lifecycle. */
export function reportIssuedOn(report: Report) {
  return report.issuedAt ?? report.approvedAt ?? report.createdAt;
}

function monthKey(value: string) {
  return value.slice(0, 7);
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${MONTHS_SQ[Number(month) - 1] ?? month} ${year}`;
}

function round(value: number, places = 1) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function buildClientAnalysis(
  source: {
    clients: Client[];
    projects: Project[];
    samples: Sample[];
    tests: LabTest[];
    reports: Report[];
    concreteTests: ConcreteCompressiveTest[];
  },
  clientId: string,
  period: AnalysisPeriod
): ClientAnalysis {
  const client = source.clients.find((row) => row.id === clientId);
  const projectName = (id: string) => source.projects.find((row) => row.id === id)?.projectName ?? "—";

  const samples = source.samples.filter((row) => row.clientId === clientId);
  const sampleById = new Map(samples.map((row) => [row.id, row]));

  const periodSamples = samples.filter((row) => inPeriod(row.dateReceived, period));
  // A completed test is one carrying a completion date, not one whose status
  // still reads "Completed". The status moves on the moment a report is drafted
  // and approved, so filtering on it counted nothing: BREGU had sixteen tests
  // finished in September, every one of them sitting at "Report Approved" or
  // "Sent to Client", and the summary would have reported zero work done
  // alongside twenty-one issued reports.
  //
  // completedAt is the honest field: it is set when the technician finishes and
  // cleared again if the results are rejected, so rework does not count twice.
  const periodTests = source.tests.filter(
    (row) => row.clientId === clientId && inPeriod(row.completedAt, period)
  );
  // A rejected report was never issued, so it is not work the client is billed
  // for and does not belong on a summary that accompanies an invoice.
  const periodReports = source.reports.filter(
    (row) =>
      row.clientId === clientId &&
      row.reportStatus !== "Rejected" &&
      inPeriod(reportIssuedOn(row), period)
  );

  // --- turnaround ---------------------------------------------------------
  // Measured from the sample arriving to its report going out, which is the
  // span the client experiences. Concrete waits 28 days by design, so this is
  // reported as-is rather than judged against a target.
  const spans: number[] = [];
  for (const report of periodReports) {
    const sample = sampleById.get(report.sampleId);
    const issued = reportIssuedOn(report);
    if (!sample?.dateReceived || !issued) continue;
    const days = Math.round(
      (new Date(issued.slice(0, 10)).getTime() - new Date(sample.dateReceived.slice(0, 10)).getTime()) / 86_400_000
    );
    if (Number.isFinite(days) && days >= 0) spans.push(days);
  }
  const averageTurnaroundDays = spans.length
    ? round(spans.reduce((sum, value) => sum + value, 0) / spans.length)
    : undefined;

  // --- by project ---------------------------------------------------------
  const projectIds = new Set<string>([
    ...periodSamples.map((row) => row.projectId),
    ...periodTests.map((row) => row.projectId),
    ...periodReports.map((row) => row.projectId)
  ]);
  const projects = [...projectIds]
    .map((id) => ({
      id,
      name: projectName(id),
      samples: periodSamples.filter((row) => row.projectId === id).length,
      tests: periodTests.filter((row) => row.projectId === id).length,
      reports: periodReports.filter((row) => row.projectId === id).length
    }))
    .sort((a, b) => b.reports - a.reports || b.tests - a.tests || a.name.localeCompare(b.name, "sq"));

  // --- by test type -------------------------------------------------------
  const testTypes = new Map<string, { tests: number; reports: number }>();
  const bump = (label: string, field: "tests" | "reports") => {
    const row = testTypes.get(label) ?? { tests: 0, reports: 0 };
    row[field] += 1;
    testTypes.set(label, row);
  };
  for (const test of periodTests) bump(test.testType, "tests");
  const testById = new Map(source.tests.map((row) => [row.id, row]));
  for (const report of periodReports) {
    const test = testById.get(report.testId);
    bump(test?.testType ?? "—", "reports");
  }
  const byTestType = [...testTypes.entries()]
    .map(([label, counts]) => ({ label, ...counts }))
    .sort((a, b) => b.tests - a.tests || b.reports - a.reports);

  // --- by month -----------------------------------------------------------
  const monthKeys = new Set<string>([
    ...periodSamples.map((row) => monthKey(row.dateReceived)),
    ...periodTests.map((row) => monthKey(row.completedAt ?? "")),
    ...periodReports.map((row) => monthKey(reportIssuedOn(row) ?? ""))
  ]);
  monthKeys.delete("");
  const byMonth = [...monthKeys]
    .sort()
    .map((key) => ({
      key,
      label: monthLabel(key),
      samples: periodSamples.filter((row) => monthKey(row.dateReceived) === key).length,
      tests: periodTests.filter((row) => monthKey(row.completedAt ?? "") === key).length,
      reports: periodReports.filter((row) => monthKey(reportIssuedOn(row) ?? "") === key).length
    }));

  // --- concrete strengths -------------------------------------------------
  const concrete = summariseConcrete(source.concreteTests, periodTests, sampleById);

  const reportByTest = new Map(periodReports.map((report) => [report.testId, report]));
  const concreteRows: ConcreteCubeRow[] = periodTests
    .map((test): ConcreteCubeRow | undefined => {
      const result = source.concreteTests.find((row) => row.testId === test.id);
      if (!result) return undefined;
      const sample = sampleById.get(test.sampleId);
      const specimens = result.specimens?.length ? result.specimens : undefined;
      // One line per cube. Older tests hold a single result rather than a
      // specimen list, so they become a set of one rather than disappearing.
      const cubes: ConcreteCubeLine[] = specimens
        ? specimens.map((specimen) => ({
            specimenCode: specimen.specimenCode,
            ageDays: specimen.ageDays,
            weightKg: specimen.weightKg,
            loadKn: specimen.maximumLoadKn,
            strengthMpa: specimen.compressiveStrengthMpa,
            truckPlate: specimen.truckPlate?.trim() || undefined
          }))
        : [
            {
              specimenCode: sample?.sampleCode ?? "—",
              ageDays: result.ageDays,
              weightKg: result.weight,
              loadKn: result.maximumLoadKn,
              strengthMpa: result.compressiveStrengthMpa,
              truckPlate: result.truckPlates?.[0]?.trim() || undefined
            }
          ];
      const strengths = cubes
        .map((cube) => cube.strengthMpa)
        .filter((value): value is number => typeof value === "number" && Number.isFinite(value) && value > 0);
      return {
        sampleCode: sample?.sampleCode ?? "—",
        projectName: projectName(test.projectId),
        // Element as the worksheet recorded it, falling back to how the sample
        // was described at reception — which is what it is called on site.
        element: result.element || sample?.sampleDescription || "—",
        strengthClass: result.strengthClass || sample?.notes?.match(/C\d+\/\d+/)?.[0] || "—",
        castingDate: result.castingDate || sample?.concretingDate || "—",
        testDate: result.testEndDate || result.testDate || test.completedAt?.slice(0, 10) || "—",
        ageDays: specimens?.[0]?.ageDays ?? result.ageDays ?? test.scheduledAgeDays,
        cubes,
        averageMpa: strengths.length
          ? round(strengths.reduce((sum, value) => sum + value, 0) / strengths.length, 2)
          : undefined,
        reportNumber: reportByTest.get(test.id)?.reportNumber ?? "—"
      };
    })
    .filter((row): row is ConcreteCubeRow => Boolean(row));

  // Reading order is the pour: when it was cast, then which register number,
  // then 7-day before 28-day — the sequence the client's own site diary runs in.
  concreteRows.sort(
    (a: ConcreteCubeRow, b: ConcreteCubeRow) =>
      a.castingDate.localeCompare(b.castingDate) ||
      a.sampleCode.localeCompare(b.sampleCode) ||
      (a.ageDays ?? 0) - (b.ageDays ?? 0)
  );

  // --- the invoice line ---------------------------------------------------
  const reportRows = periodReports
    .map((report) => {
      const test = testById.get(report.testId);
      return {
        reportNumber: report.reportNumber,
        sampleCode: sampleById.get(report.sampleId)?.sampleCode ?? "—",
        projectName: projectName(report.projectId),
        testType: test?.testType ?? "—",
        issuedAt: reportIssuedOn(report),
        status: report.reportStatus
      };
    })
    .sort((a, b) => (a.issuedAt ?? "").localeCompare(b.issuedAt ?? "") || a.reportNumber.localeCompare(b.reportNumber));

  return {
    client,
    period,
    samplesReceived: periodSamples.length,
    testsCompleted: periodTests.length,
    reportsIssued: periodReports.length,
    averageTurnaroundDays,
    projects,
    byTestType,
    byMonth,
    concrete,
    concreteRows,
    reportRows
  };
}

/**
 * Compressive strength across the period, by class.
 *
 * Deliberately no pass/fail column. Conformity is judged against the class by
 * rules in EN 206 that need the whole pour, not the cubes one lab happened to
 * receive, and a summary that printed "failed" next to a cube would be making a
 * declaration the lab has not made on any report.
 */
function summariseConcrete(
  concreteTests: ConcreteCompressiveTest[],
  periodTests: LabTest[],
  sampleById: Map<string, Sample>
): ConcreteSummary | undefined {
  const periodTestIds = new Set(periodTests.map((row) => row.id));
  const strengths: Array<{ value: number; strengthClass: string }> = [];

  for (const concrete of concreteTests) {
    if (!periodTestIds.has(concrete.testId)) continue;
    const test = periodTests.find((row) => row.id === concrete.testId);
    const sample = test ? sampleById.get(test.sampleId) : undefined;
    const strengthClass =
      concrete.strengthClass || sample?.notes?.match(/C\d+\/\d+/)?.[0] || "Pa klasë";
    const specimens = concrete.specimens?.length
      ? concrete.specimens.map((specimen) => specimen.compressiveStrengthMpa)
      : [concrete.compressiveStrengthMpa];
    for (const value of specimens) {
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        strengths.push({ value, strengthClass });
      }
    }
  }

  if (!strengths.length) return undefined;

  const values = strengths.map((row) => row.value);
  const classes = new Map<string, number[]>();
  for (const row of strengths) {
    const list = classes.get(row.strengthClass) ?? [];
    list.push(row.value);
    classes.set(row.strengthClass, list);
  }

  return {
    specimens: values.length,
    averageStrengthMpa: round(values.reduce((sum, value) => sum + value, 0) / values.length, 2),
    minStrengthMpa: round(Math.min(...values), 2),
    maxStrengthMpa: round(Math.max(...values), 2),
    byClass: [...classes.entries()]
      .map(([strengthClass, list]) => ({
        strengthClass,
        specimens: list.length,
        averageStrengthMpa: round(list.reduce((sum, value) => sum + value, 0) / list.length, 2)
      }))
      .sort((a, b) => b.specimens - a.specimens || a.strengthClass.localeCompare(b.strengthClass))
  };
}

/** First and last day of a month, for the default period. */
export function monthPeriod(today = new Date()): AnalysisPeriod {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return { from: `${year}-${pad(month + 1)}-01`, to: `${year}-${pad(month + 1)}-${pad(lastDay)}` };
}

/** "1 shtator 2026 – 30 shtator 2026", for the heading. */
export function formatPeriod(period: AnalysisPeriod) {
  const pretty = (value: string) => {
    const [year, month, day] = value.split("-");
    return `${Number(day)} ${(MONTHS_SQ[Number(month) - 1] ?? month).toLowerCase()} ${year}`;
  };
  return `${pretty(period.from)} – ${pretty(period.to)}`;
}
