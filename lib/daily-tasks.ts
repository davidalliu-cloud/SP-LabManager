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

export type DailyDigest = {
  date: string;
  taskCount: number;
  groups: TechnicianTasks[];
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

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] ?? char));
}

// Build the whole digest: recipients (active employees) + subject + HTML/text.
export function buildDailyDigest(state: Partial<LabState>, today: string): DailyDigest {
  const groups = computeDueTasks(state, today);
  const taskCount = groups.reduce((sum, group) => sum + group.tests.length, 0);
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

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:0 auto;padding:20px;">
    <div style="border-bottom:3px solid #5b193f;padding-bottom:10px;margin-bottom:6px;">
      <div style="font-size:18px;font-weight:700;color:#5b193f;">SARP Laboratory</div>
      <div style="font-size:14px;color:#373455;">Detyrat për ${prettyDate} / Tasks for ${prettyDate}</div>
    </div>
    <p style="font-size:13px;color:#444;">Testet e papërfunduara me afat sot ose të kaluar, sipas teknikut. / Unfinished tests due today or overdue, grouped by technician.</p>
    ${taskCount ? groupsHtml : '<p style="font-size:14px;color:#10BB82;font-weight:600;">Nuk ka detyra për sot. / No tasks due today.</p>'}
    <p style="margin-top:24px;font-size:11px;color:#999;">Ky email u dërgua automatikisht nga sistemi i laboratorit. / Sent automatically by the lab system.</p>
  </div>`;

  const textLines = [`SARP Laboratory — Detyrat për ${prettyDate}`, ""];
  if (!taskCount) {
    textLines.push("Nuk ka detyra për sot. / No tasks due today.");
  } else {
    for (const group of groups) {
      textLines.push(`${group.technicianName} (${group.tests.length}):`);
      for (const task of group.tests) {
        textLines.push(
          `  - ${task.sampleCode} · ${task.testType} · ${task.clientLabel} · ${task.batch} · afati ${formatEuropeanDate(task.requiredTestDate)}${task.overdue ? " (VONUAR)" : ""}`
        );
      }
      textLines.push("");
    }
  }

  return { date: today, taskCount, groups, recipients, subject, html, text: textLines.join("\n") };
}
