import { calibrationState, type Equipment } from "./equipment";
import { LAB_AREAS, isWorkingDay, missingDays, readingState, toIsoDate, type EnvironmentReading } from "./environment";
import { previousWorkingDay } from "./environment-reminder";
import { dueState, nonconformityStatus, type Complaint, type Nonconformity } from "./nonconformity";
import { isOverdue } from "./status";
import type { LabState } from "./types";

/**
 * Gatishmëria për akreditim — what the Quality Manager is answerable for,
 * gathered from the records the app already keeps.
 *
 * The point is not to add another thing to fill in. It is that every one of
 * these has a date, and an assessor arriving unannounced will ask about the
 * ones that have passed. A register each is where the work is done; this is
 * where it is seen all at once, so nothing is discovered on the day.
 *
 * Nothing here is invented: each item counts records the lab already holds,
 * and every count links back to the register that owns it.
 */
export type ReadinessLevel = "overdue" | "attention" | "ok";

export type ReadinessItem = {
  key: string;
  /** The clause this satisfies, because that is how it will be asked about. */
  clause: string;
  title: string;
  /** What the count means, said plainly. */
  detail: string;
  count: number;
  level: ReadinessLevel;
  href: string;
};

type Source = Pick<LabState, "equipment" | "environmentReadings" | "nonconformities" | "complaints" | "tests" | "reports">;

export function buildReadiness(state: Source, today = new Date()): ReadinessItem[] {
  const items: ReadinessItem[] = [];

  // --- §6.4 Pajisjet ------------------------------------------------------
  const calibration = (state.equipment ?? []).reduce(
    (tally, item: Equipment) => {
      const status = calibrationState(item, today);
      if (status === "overdue") tally.overdue += 1;
      if (status === "due-soon") tally.soon += 1;
      return tally;
    },
    { overdue: 0, soon: 0 }
  );
  items.push({
    key: "calibration",
    clause: "6.4",
    title: "Kalibrimi i pajisjeve",
    detail: calibration.overdue
      ? `${calibration.overdue} pajisje me kalibrim të skaduar${calibration.soon ? `, ${calibration.soon} skadojnë brenda muajit` : ""}`
      : calibration.soon
        ? `${calibration.soon} pajisje skadojnë brenda muajit`
        : "Të gjitha pajisjet në afat",
    count: calibration.overdue || calibration.soon,
    level: calibration.overdue ? "overdue" : calibration.soon ? "attention" : "ok",
    href: "/quality/equipment"
  });

  // --- §6.3 Kushtet ambjentale -------------------------------------------
  const readings: EnvironmentReading[] = state.environmentReadings ?? [];
  const todayIso = toIsoDate(today);
  const previous = previousWorkingDay(todayIso);
  const everRecorded = new Set(readings.map((reading) => reading.areaCode));
  const previousCodes = new Set(readings.filter((reading) => reading.date === previous).map((r) => r.areaCode));
  // Only areas already in use can be missing — the same rule the reminder uses.
  const missedYesterday = LAB_AREAS.filter(
    (area) => everRecorded.has(area.code) && !previousCodes.has(area.code)
  ).length;
  const monthGaps = LAB_AREAS.reduce(
    (total, area) =>
      total +
      missingDays({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        areaCode: area.code,
        readings,
        today
      }).length,
    0
  );
  const outOfTolerance = readings.filter(
    (reading) => reading.date.startsWith(todayIso.slice(0, 7)) && readingState(reading) === "out-of-tolerance"
  ).length;
  const notStarted = readings.length === 0;
  items.push({
    key: "environment",
    clause: "6.3",
    title: "Kushtet ambjentale",
    detail: notStarted
      ? "Regjistri ende pa asnjë matje"
      : monthGaps
        ? `${monthGaps} ditë pune pa matje këtë muaj${outOfTolerance ? `, ${outOfTolerance} matje jashtë tolerancës` : ""}`
        : outOfTolerance
          ? `${outOfTolerance} matje jashtë tolerancës këtë muaj`
          : "Matjet e muajit të plota",
    count: monthGaps + outOfTolerance,
    level: notStarted || missedYesterday || outOfTolerance ? "overdue" : monthGaps ? "attention" : "ok",
    href: "/quality/environment"
  });

  // --- §7.10 / §8.7 Punët jokonforme --------------------------------------
  const ncs: Nonconformity[] = state.nonconformities ?? [];
  const ncOverdue = ncs.filter((item) => dueState(item, today) === "overdue").length;
  const ncOpen = ncs.filter((item) => nonconformityStatus(item) !== "Mbyllur").length;
  items.push({
    key: "nonconformities",
    clause: "7.10 / 8.7",
    title: "Punët jokonforme",
    detail: ncOverdue
      ? `${ncOverdue} veprime korrigjuese përtej afatit`
      : ncOpen
        ? `${ncOpen} të hapura, të gjitha brenda afatit`
        : "Asnjë e hapur",
    count: ncOverdue || ncOpen,
    level: ncOverdue ? "overdue" : ncOpen ? "attention" : "ok",
    href: "/quality/nonconformities"
  });

  // --- §7.9 Ankesat -------------------------------------------------------
  const complaints: Complaint[] = state.complaints ?? [];
  const openComplaints = complaints.filter((item) => item.status !== "E mbyllur").length;
  items.push({
    key: "complaints",
    clause: "7.9",
    title: "Ankesat",
    detail: openComplaints ? `${openComplaints} pa përgjigje përfundimtare` : "Asnjë e hapur",
    count: openComplaints,
    level: openComplaints ? "attention" : "ok",
    href: "/quality/complaints"
  });

  // --- §7.1 Afatet e testimeve -------------------------------------------
  const lateTests = (state.tests ?? []).filter(
    (test) => test.requiredTestDate && isOverdue(test.requiredTestDate, test.status)
  ).length;
  items.push({
    key: "tests",
    clause: "7.1",
    title: "Testet përtej datës së kërkuar",
    detail: lateTests ? `${lateTests} teste pa përfunduar pas datës së kërkuar` : "Asnjë test i vonuar",
    count: lateTests,
    level: lateTests ? "attention" : "ok",
    href: "/delayed"
  });

  // --- §7.8 Raportimi -----------------------------------------------------
  // A finished test with no report is work done and not issued — the gap an
  // assessor reads as a process failure rather than a delay.
  //
  // Deliberately not "approved but not sent": every report in the register sits
  // at Approved because the lifecycle beyond it is not used here, so counting
  // those would report the lab's normal way of working as a fault, and a page
  // that is wrong on the first day is never trusted on the hundredth.
  const reportedTestIds = new Set((state.reports ?? []).map((report) => report.testId));
  const completedWithoutReport = (state.tests ?? []).filter(
    (test) => test.status === "Completed" && !reportedTestIds.has(test.id)
  ).length;
  items.push({
    key: "reports",
    clause: "7.8",
    title: "Teste të përfunduara pa raport",
    detail: completedWithoutReport
      ? `${completedWithoutReport} teste të përfunduara pa raport të gjeneruar`
      : "Çdo test i përfunduar ka raportin e vet",
    count: completedWithoutReport,
    level: completedWithoutReport ? "attention" : "ok",
    href: "/tests"
  });

  return items;
}

/** The worst level present, for the banner at the top. */
export function readinessVerdict(items: ReadinessItem[]): ReadinessLevel {
  if (items.some((item) => item.level === "overdue")) return "overdue";
  if (items.some((item) => item.level === "attention")) return "attention";
  return "ok";
}

/** Whether today is a day the lab is expected to be recording at all. */
export function isLabWorkingDay(today = new Date()) {
  return isWorkingDay(today);
}
