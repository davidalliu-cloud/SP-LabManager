import type { LabState, LabTest } from "./types";
import { testLifecycle } from "./sample-stage";

export type TechnicianTasks = {
  technicianId: string | null;
  technicianName: string;
  tests: Array<{
    testCode: string;
    sampleCode: string;
    testType: string;
    clientLabel: string;
    projectLabel: string;
    requiredTestDate: string;
    batch: string;
    overdue: boolean;
  }>;
};

// A flat action item for the non-technician-grouped sections (approvals, report
// preparation). `label` is the report number, or the test code when no report
// exists yet.
export type ActionItem = {
  label: string;
  sampleCode: string;
  testType: string;
  person: string;
  note: string;
  dueDate: string;
  overdue: boolean;
};

// Everything that needs doing, grouped by the action required. Reports that are
// already approved and only waiting to be sent to the client are intentionally
// excluded — that follows the client's own schedule, not the daily to-do list.
export type ActionBuckets = {
  testsToDo: TechnicianTasks[]; // undertake / finish testing (due today or overdue), by technician
  techApprovals: ActionItem[]; // tested, awaiting the Chief of Lab's technical approval
  reportsToPrepare: ActionItem[]; // report to be produced / finalised (incl. rejected)
  reportsToApprove: ActionItem[]; // report awaiting approval
};

export type DailyDigest = {
  date: string;
  taskCount: number;
  buckets: ActionBuckets;
  recipients: string[];
  subject: string;
  html: string;
  text: string;
};

// The current date + time in the lab's timezone (Albania), independent of the
// server's clock. Returned as { date: "YYYY-MM-DD", hour, minute }.
export function tiranaNow(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Tirane",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute"))
  };
}

function formatEuropeanDate(value?: string) {
  if (!value) return "-";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

// Sort every test into the action it needs, using the shared lifecycle. Tests
// still needing testing work are grouped by technician and limited to those due
// today or overdue; approvals and report preparation are listed in full (they
// should be cleared as soon as they arise, not on a due date). Report-approved
// (ready to send) and delivered tests are excluded.
export function computeActionBuckets(state: Partial<LabState>, today: string): ActionBuckets {
  const tests = state.tests ?? [];
  const samples = state.samples ?? [];
  const clients = state.clients ?? [];
  const projects = state.projects ?? [];
  const users = state.users ?? [];
  const reports = state.reports ?? [];
  const nameOf = (id?: string) => users.find((user) => user.id === id)?.fullName ?? "-";

  const testGroups = new Map<string, TechnicianTasks>();
  const techApprovals: ActionItem[] = [];
  const reportsToPrepare: ActionItem[] = [];
  const reportsToApprove: ActionItem[] = [];

  for (const test of tests) {
    const { detail } = testLifecycle(test, reports);
    const sample = samples.find((row) => row.id === test.sampleId);
    const client = clients.find((row) => row.id === test.clientId);
    const project = projects.find((row) => row.id === test.projectId);
    const testReport = reports.find((row) => row.testId === test.id);
    const reportDueDate = sample?.reportDueDate ?? "";
    const reportOverdue = Boolean(reportDueDate) && reportDueDate < today;

    const addTestToDo = () => {
      const technicianId = test.assignedTechnician ?? null;
      const key = technicianId ?? "__unassigned__";
      if ((test.requiredTestDate ?? "") > today) return; // not due yet
      if (!testGroups.has(key)) {
        testGroups.set(key, {
          technicianId,
          technicianName: nameOf(technicianId) === "-" ? "Pa teknik / Unassigned" : nameOf(technicianId),
          tests: []
        });
      }
      const unit = "mostra";
      testGroups.get(key)!.tests.push({
        testCode: test.testCode,
        sampleCode: sample?.sampleCode ?? test.testCode,
        testType: test.testType,
        clientLabel: client?.clientCode ?? client?.clientName ?? "-",
        projectLabel: project?.projectName ?? "-",
        requiredTestDate: test.requiredTestDate ?? "",
        batch: test.scheduledAgeDays ? `${test.cubeCount} ${unit} / ${test.scheduledAgeDays}d` : `${test.cubeCount} ${unit}`,
        overdue: (test.requiredTestDate ?? "") < today
      });
    };

    const reportItem = (person: string, note: string): ActionItem => ({
      label: testReport?.reportNumber || "—",
      sampleCode: sample?.sampleCode ?? test.testCode,
      testType: test.testType,
      person,
      note,
      dueDate: reportDueDate,
      overdue: reportOverdue
    });

    switch (detail) {
      case "awaitTesting":
      case "testing":
        addTestToDo();
        break;
      case "rejected":
        // A rejected report is report work; a rejected test-result is redone.
        if (testReport) reportsToPrepare.push(reportItem(nameOf(testReport.draftedBy), "Refuzuar – për korrigjim / Rejected – fix"));
        else addTestToDo();
        break;
      case "awaitTechApproval":
        techApprovals.push({
          label: test.testCode,
          sampleCode: sample?.sampleCode ?? test.testCode,
          testType: test.testType,
          person: nameOf(test.assignedTechnician),
          note: "Pret aprovim teknik / Awaiting technical approval",
          dueDate: test.requiredTestDate ?? "",
          overdue: (test.requiredTestDate ?? "") < today
        });
        break;
      case "awaitReport":
        reportsToPrepare.push(reportItem(nameOf(test.assignedTechnician), "Raport i ri / New report"));
        break;
      case "reportPreparing":
        reportsToPrepare.push(reportItem(nameOf(testReport?.draftedBy), "Për t'u finalizuar / To finalise"));
        break;
      case "reportAwaitApproval":
        reportsToApprove.push(reportItem(nameOf(testReport?.checkedBy || testReport?.draftedBy), "Pret aprovim / Awaiting approval"));
        break;
      default:
        break; // reportApproved (ready to send) / delivered → excluded
    }
  }

  const testsToDo = Array.from(testGroups.values());
  for (const group of testsToDo) {
    group.tests.sort((left, right) => left.requiredTestDate.localeCompare(right.requiredTestDate));
  }
  testsToDo.sort((left, right) => {
    if (!left.technicianId) return 1;
    if (!right.technicianId) return -1;
    return left.technicianName.localeCompare(right.technicianName);
  });

  return { testsToDo, techApprovals, reportsToPrepare, reportsToApprove };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char));
}

const lateFlag = '<span style="color:#ffffff;background:#FF5757;border-radius:4px;padding:1px 6px;font-size:11px;">Vonuar</span>';

// A flat action table (approvals / report preparation).
function actionSectionHtml(title: string, items: ActionItem[], accent: string) {
  if (!items.length) return "";
  const rows = items
    .map(
      (item) => `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(item.label)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(item.sampleCode)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(item.testType)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(item.person)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(item.note)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;white-space:nowrap;">${formatEuropeanDate(item.dueDate)} ${item.overdue ? lateFlag : ""}</td>
      </tr>`
    )
    .join("");
  return `<h3 style="margin:22px 0 6px;color:${accent};font-size:15px;">${escapeHtml(title)} <span style="color:#888;font-weight:400;">(${items.length})</span></h3>
    <table style="border-collapse:collapse;width:100%;font-size:13px;color:#222;">
      <thead>
        <tr style="text-align:left;color:${accent};">
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Raporti / Testi</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Kampioni</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Testi</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Personi</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Veprimi</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Afati</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// Build the whole digest: recipients (active employees) + subject + HTML/text.
export function buildDailyDigest(state: Partial<LabState>, today: string): DailyDigest {
  const buckets = computeActionBuckets(state, today);
  const testCount = buckets.testsToDo.reduce((sum, group) => sum + group.tests.length, 0);
  const taskCount = testCount + buckets.techApprovals.length + buckets.reportsToPrepare.length + buckets.reportsToApprove.length;
  const recipients = Array.from(
    new Set(
      (state.users ?? [])
        .filter((user) => user.isActive !== false && user.email)
        .map((user) => user.email.trim())
        .filter(Boolean)
    )
  );

  const prettyDate = formatEuropeanDate(today);
  const subject = `Detyrat e ditës / Daily tasks – ${prettyDate} (${taskCount})`;

  const testsToDoHtml = buckets.testsToDo
    .map((group) => {
      const rows = group.tests
        .map(
          (task) => `<tr>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(task.sampleCode)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.testType)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.clientLabel)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;white-space:nowrap;">${escapeHtml(task.batch)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;white-space:nowrap;">${formatEuropeanDate(task.requiredTestDate)} ${task.overdue ? lateFlag : ""}</td>
          </tr>`
        )
        .join("");
      return `<h3 style="margin:22px 0 6px;color:#373455;font-size:15px;">${escapeHtml(group.technicianName)} <span style="color:#888;font-weight:400;">(${group.tests.length})</span></h3>
        <table style="border-collapse:collapse;width:100%;font-size:13px;color:#222;">
          <thead>
            <tr style="text-align:left;color:#5b193f;">
              <th style="padding:6px 10px;border-bottom:2px solid #5b193f;">Kampioni</th>
              <th style="padding:6px 10px;border-bottom:2px solid #5b193f;">Testi</th>
              <th style="padding:6px 10px;border-bottom:2px solid #5b193f;">Klienti</th>
              <th style="padding:6px 10px;border-bottom:2px solid #5b193f;">Sasia</th>
              <th style="padding:6px 10px;border-bottom:2px solid #5b193f;">Afati</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>`;
    })
    .join("");

  const sections = [
    testCount
      ? `<h2 style="margin:20px 0 4px;color:#5b193f;font-size:16px;">Teste për të kryer / Tests to carry out <span style="color:#888;font-weight:400;">(${testCount})</span></h2>
         <p style="font-size:12px;color:#666;margin:0 0 4px;">Për të nisur ose përfunduar, me afat sot ose të kaluar, sipas teknikut. / To start or finish, due today or overdue, by technician.</p>
         ${testsToDoHtml}`
      : "",
    actionSectionHtml("Për aprovim teknik / Technical approval", buckets.techApprovals, "#d8a13b"),
    actionSectionHtml("Raporte për të përgatitur / Reports to prepare", buckets.reportsToPrepare, "#7c7d4e"),
    actionSectionHtml("Raporte për aprovim / Reports to approve", buckets.reportsToApprove, "#6baead")
  ].join("");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:0 auto;padding:20px;">
    <div style="border-bottom:3px solid #5b193f;padding-bottom:10px;margin-bottom:6px;">
      <div style="font-size:18px;font-weight:700;color:#5b193f;">SARP Laboratory</div>
      <div style="font-size:14px;color:#373455;">Detyrat për ${prettyDate} / Tasks for ${prettyDate}</div>
    </div>
    ${taskCount ? sections : '<p style="font-size:14px;color:#10BB82;font-weight:600;">Nuk ka detyra për sot. / No tasks due today.</p>'}
    <p style="margin-top:24px;font-size:11px;color:#999;">Ky email u dërgua automatikisht nga sistemi i laboratorit. / Sent automatically by the lab system.</p>
  </div>`;

  const textLines = [`SARP Laboratory — Detyrat për ${prettyDate}`, ""];
  if (!taskCount) {
    textLines.push("Nuk ka detyra për sot. / No tasks due today.");
  } else {
    if (testCount) {
      textLines.push(`TESTE PËR TË KRYER / TESTS TO CARRY OUT (${testCount})`);
      for (const group of buckets.testsToDo) {
        textLines.push(`${group.technicianName} (${group.tests.length}):`);
        for (const task of group.tests) {
          textLines.push(`  - ${task.sampleCode} · ${task.testType} · ${task.clientLabel} · ${task.batch} · afati ${formatEuropeanDate(task.requiredTestDate)}${task.overdue ? " (VONUAR)" : ""}`);
        }
      }
      textLines.push("");
    }
    const addFlat = (title: string, items: ActionItem[]) => {
      if (!items.length) return;
      textLines.push(`${title} (${items.length})`);
      for (const item of items) {
        textLines.push(`  - ${item.label} · ${item.sampleCode} · ${item.testType} · ${item.person} · ${item.note} · afati ${formatEuropeanDate(item.dueDate)}${item.overdue ? " (VONUAR)" : ""}`);
      }
      textLines.push("");
    };
    addFlat("PËR APROVIM TEKNIK / TECHNICAL APPROVAL", buckets.techApprovals);
    addFlat("RAPORTE PËR TË PËRGATITUR / REPORTS TO PREPARE", buckets.reportsToPrepare);
    addFlat("RAPORTE PËR APROVIM / REPORTS TO APPROVE", buckets.reportsToApprove);
  }

  return { date: today, taskCount, buckets, recipients, subject, html, text: textLines.join("\n") };
}
