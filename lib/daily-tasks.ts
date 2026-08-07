import type { LabState, LabTest } from "./types";

// A test still counts as "to be completed" until its testing is finished. These
// statuses mean the lab work is done, so they are excluded from the daily list.
const FINISHED_TEST_STATUSES = new Set([
  "Completed",
  "Report Drafted",
  "Pending Approval",
  "Approved",
  "Issued",
  "Sent to Client"
]);

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

export type ReportTask = {
  label: string; // report number, or the sample code when no report exists yet
  sampleCode: string;
  testType: string;
  person: string; // drafted-by / submitted-by, for context
  note: string;
};

export type ReportTasks = {
  toPrepare: ReportTask[]; // needs a report drafted / finalised
  toApprove: ReportTask[]; // waiting for the Chief of Lab to approve
  toSend: ReportTask[]; // approved, ready to send to the client
};

export type DailyDigest = {
  date: string;
  taskCount: number;
  testCount: number;
  reportCount: number;
  groups: TechnicianTasks[];
  reports: ReportTasks;
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

// Every unfinished test due on/before `today`, grouped by assigned technician.
export function computeDueTasks(state: Partial<LabState>, today: string): TechnicianTasks[] {
  const tests = state.tests ?? [];
  const samples = state.samples ?? [];
  const clients = state.clients ?? [];
  const projects = state.projects ?? [];
  const users = state.users ?? [];

  const due = tests.filter((test: LabTest) => {
    if (FINISHED_TEST_STATUSES.has(test.status)) return false;
    return (test.requiredTestDate ?? "") <= today;
  });

  const groups = new Map<string, TechnicianTasks>();
  for (const test of due) {
    const technicianId = test.assignedTechnician ?? null;
    const key = technicianId ?? "__unassigned__";
    if (!groups.has(key)) {
      const technician = users.find((user) => user.id === technicianId);
      groups.set(key, {
        technicianId,
        technicianName: technician?.fullName ?? "Pa teknik / Unassigned",
        tests: []
      });
    }
    const sample = samples.find((row) => row.id === test.sampleId);
    const client = clients.find((row) => row.id === test.clientId);
    const project = projects.find((row) => row.id === test.projectId);
    const unit = sample?.sampleType?.includes("Çeliku") || sample?.sampleType?.includes("Rebar") ? "mostra" : "mostra";
    groups.get(key)!.tests.push({
      testCode: test.testCode,
      sampleCode: sample?.sampleCode ?? test.testCode,
      testType: test.testType,
      clientLabel: client?.clientCode ?? client?.clientName ?? "-",
      projectLabel: project?.projectName ?? "-",
      requiredTestDate: test.requiredTestDate ?? "",
      batch: test.scheduledAgeDays ? `${test.cubeCount} ${unit} / ${test.scheduledAgeDays}d` : `${test.cubeCount} ${unit}`,
      overdue: (test.requiredTestDate ?? "") < today
    });
  }

  // Sort each technician's tests by required date, and technicians by name
  // (unassigned last).
  const result = Array.from(groups.values());
  for (const group of result) {
    group.tests.sort((left, right) => left.requiredTestDate.localeCompare(right.requiredTestDate));
  }
  result.sort((left, right) => {
    if (!left.technicianId) return 1;
    if (!right.technicianId) return -1;
    return left.technicianName.localeCompare(right.technicianName);
  });
  return result;
}

// Report-side work: reports to draft/finalise, reports awaiting approval, and
// approved reports still to be sent to the client. Not date-filtered — these are
// pending states that should be cleared regardless of when they arose.
export function computeReportTasks(state: Partial<LabState>): ReportTasks {
  const tests = state.tests ?? [];
  const samples = state.samples ?? [];
  const reports = state.reports ?? [];
  const users = state.users ?? [];
  const nameOf = (id?: string) => users.find((user) => user.id === id)?.fullName ?? "-";

  const toPrepare: ReportTask[] = [];
  const toApprove: ReportTask[] = [];
  const toSend: ReportTask[] = [];

  // 1) Technically-approved tests that have no report drafted yet.
  for (const test of tests) {
    if (test.status !== "Approved") continue;
    if (reports.some((report) => report.testId === test.id)) continue;
    const sample = samples.find((row) => row.id === test.sampleId);
    toPrepare.push({
      label: "—",
      sampleCode: sample?.sampleCode ?? test.testCode,
      testType: test.testType,
      person: nameOf(test.assignedTechnician),
      note: "Raport i ri / New report"
    });
  }

  // 2) Reports already open in the workflow.
  for (const report of reports) {
    const sample = samples.find((row) => row.id === report.sampleId);
    const test = tests.find((row) => row.id === report.testId);
    const base = {
      label: report.reportNumber || "—",
      sampleCode: sample?.sampleCode ?? "-",
      testType: test?.testType ?? "-"
    };
    if (report.reportStatus === "Draft" || report.reportStatus === "Report Drafted") {
      toPrepare.push({ ...base, person: nameOf(report.draftedBy), note: "Për t'u finalizuar / To finalise" });
    } else if (report.reportStatus === "Rejected") {
      toPrepare.push({ ...base, person: nameOf(report.draftedBy), note: "Refuzuar – për korrigjim / Rejected – fix" });
    } else if (report.reportStatus === "Pending Approval") {
      toApprove.push({ ...base, person: nameOf(report.checkedBy || report.draftedBy), note: "Në pritje miratimi / Awaiting approval" });
    } else if (report.reportStatus === "Approved") {
      toSend.push({ ...base, person: nameOf(report.approvedBy), note: "Miratuar – gati për dërgim / Approved – ready to send" });
    }
  }

  return { toPrepare, toApprove, toSend };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char));
}

// Render a flat list of report tasks (report number, sample, test, person).
function reportSectionHtml(title: string, tasks: ReportTask[], accent: string) {
  if (!tasks.length) return "";
  const rows = tasks
    .map(
      (task) => `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(task.label)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.sampleCode)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.testType)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.person)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.note)}</td>
      </tr>`
    )
    .join("");
  return `<h3 style="margin:22px 0 6px;color:${accent};font-size:15px;">${escapeHtml(title)} <span style="color:#888;font-weight:400;">(${tasks.length})</span></h3>
    <table style="border-collapse:collapse;width:100%;font-size:13px;color:#222;">
      <thead>
        <tr style="text-align:left;color:${accent};">
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Raporti</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Kampioni</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Testi</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Personi</th>
          <th style="padding:6px 10px;border-bottom:2px solid ${accent};">Statusi</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// Build the whole digest: recipients (active employees) + subject + HTML/text.
export function buildDailyDigest(state: Partial<LabState>, today: string): DailyDigest {
  const groups = computeDueTasks(state, today);
  const reports = computeReportTasks(state);
  const testCount = groups.reduce((sum, group) => sum + group.tests.length, 0);
  const reportCount = reports.toPrepare.length + reports.toApprove.length + reports.toSend.length;
  const taskCount = testCount + reportCount;
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

  const groupsHtml = groups
    .map((group) => {
      const rows = group.tests
        .map((task) => {
          const flag = task.overdue
            ? '<span style="color:#ffffff;background:#FF5757;border-radius:4px;padding:1px 6px;font-size:11px;">Vonuar</span>'
            : "";
          return `<tr>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:600;">${escapeHtml(task.sampleCode)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.testType)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(task.clientLabel)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;white-space:nowrap;">${escapeHtml(task.batch)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #eee;white-space:nowrap;">${formatEuropeanDate(task.requiredTestDate)} ${flag}</td>
          </tr>`;
        })
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

  const testsSectionHtml = testCount
    ? `<h2 style="margin:20px 0 4px;color:#5b193f;font-size:16px;">Teste / Tests <span style="color:#888;font-weight:400;">(${testCount})</span></h2>
       <p style="font-size:12px;color:#666;margin:0 0 4px;">Teste të papërfunduara me afat sot ose të kaluar, sipas teknikut. / Unfinished tests due today or overdue, by technician.</p>
       ${groupsHtml}`
    : "";

  const reportsSectionHtml =
    reportCount
      ? `<h2 style="margin:26px 0 4px;color:#5b193f;font-size:16px;">Raporte / Reports <span style="color:#888;font-weight:400;">(${reportCount})</span></h2>
         ${reportSectionHtml("Për t'u përgatitur / To prepare", reports.toPrepare, "#7c7d4e")}
         ${reportSectionHtml("Për miratim / To approve", reports.toApprove, "#d8a13b")}
         ${reportSectionHtml("Gati për dërgim / Ready to send", reports.toSend, "#10BB82")}`
      : "";

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:0 auto;padding:20px;">
    <div style="border-bottom:3px solid #5b193f;padding-bottom:10px;margin-bottom:6px;">
      <div style="font-size:18px;font-weight:700;color:#5b193f;">SARP Laboratory</div>
      <div style="font-size:14px;color:#373455;">Detyrat për ${prettyDate} / Tasks for ${prettyDate}</div>
    </div>
    ${taskCount ? `${testsSectionHtml}${reportsSectionHtml}` : '<p style="font-size:14px;color:#10BB82;font-weight:600;">Nuk ka detyra për sot. / No tasks due today.</p>'}
    <p style="margin-top:24px;font-size:11px;color:#999;">Ky email u dërgua automatikisht nga sistemi i laboratorit. / Sent automatically by the lab system.</p>
  </div>`;

  const textLines = [`SARP Laboratory — Detyrat për ${prettyDate}`, ""];
  if (!taskCount) {
    textLines.push("Nuk ka detyra për sot. / No tasks due today.");
  } else {
    if (testCount) {
      textLines.push(`TESTE / TESTS (${testCount})`);
      for (const group of groups) {
        textLines.push(`${group.technicianName} (${group.tests.length}):`);
        for (const task of group.tests) {
          textLines.push(
            `  - ${task.sampleCode} · ${task.testType} · ${task.clientLabel} · ${task.batch} · afati ${formatEuropeanDate(task.requiredTestDate)}${task.overdue ? " (VONUAR)" : ""}`
          );
        }
      }
      textLines.push("");
    }
    if (reportCount) {
      textLines.push(`RAPORTE / REPORTS (${reportCount})`);
      const addReportBlock = (title: string, tasks: ReportTask[]) => {
        if (!tasks.length) return;
        textLines.push(`${title} (${tasks.length}):`);
        for (const task of tasks) {
          textLines.push(`  - ${task.label} · ${task.sampleCode} · ${task.testType} · ${task.person} · ${task.note}`);
        }
      };
      addReportBlock("Për t'u përgatitur / To prepare", reports.toPrepare);
      addReportBlock("Për miratim / To approve", reports.toApprove);
      addReportBlock("Gati për dërgim / Ready to send", reports.toSend);
      textLines.push("");
    }
  }

  return { date: today, taskCount, testCount, reportCount, groups, reports, recipients, subject, html, text: textLines.join("\n") };
}
