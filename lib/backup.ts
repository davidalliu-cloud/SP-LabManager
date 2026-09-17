import type { LabState } from "./types";

/**
 * What a backup has to survive.
 *
 * Every register the lab keeps — samples, tests, results, reports, clients,
 * projects, users — lives in one row of app_state. Losing that row loses the
 * lab's whole working record, so the backup's job is to put a copy of it
 * somewhere that does not depend on the database still being there.
 *
 * The report PDFs in storage are deliberately not included: there are hundreds
 * of them, they are far too large to send, and every one can be regenerated
 * from the data here. The data is what cannot be rebuilt.
 */
export type BackupSummary = {
  samples: number;
  tests: number;
  reports: number;
  clients: number;
  projects: number;
  users: number;
  results: number;
};

/** Every worksheet array, whatever the family, so new test types count too. */
function countResults(state: Partial<LabState>) {
  return Object.entries(state as Record<string, unknown>)
    .filter(([key, value]) => key.endsWith("Tests") && Array.isArray(value))
    .reduce((total, [, value]) => total + (value as unknown[]).length, 0);
}

export function summariseBackup(state: Partial<LabState>): BackupSummary {
  const count = (rows?: unknown[]) => (Array.isArray(rows) ? rows.length : 0);
  return {
    samples: count(state.samples),
    tests: count(state.tests),
    reports: count(state.reports),
    clients: count(state.clients),
    projects: count(state.projects),
    users: count(state.users),
    results: countResults(state)
  };
}

/**
 * The backup is only worth having if it can be put back. These are the exact
 * steps, carried in the email itself rather than in a document nobody can find
 * when the database is down.
 */
export function restoreInstructions(backupId: string) {
  return [
    `Për ta rikthyer / To restore this snapshot, run in the Supabase SQL editor:`,
    `update app_state set state = (select state from app_state_backups where id = '${backupId}') where id = 'shared-lab-state';`,
    `Close every open tab of the app first — an open tab saves its own copy of the data every 800 ms and would overwrite the restore.`
  ];
}

export function backupEmailHtml(params: {
  backupId: string;
  date: string;
  summary: BackupSummary;
  attachmentName: string;
  keptSnapshots: number;
}) {
  const { backupId, date, summary, attachmentName, keptSnapshots } = params;
  const row = (sq: string, en: string, value: number) =>
    `<tr><td style="padding:4px 12px 4px 0;">${sq} <span style="color:#6b7280;">/ ${en}</span></td>` +
    `<td style="padding:4px 0;text-align:right;font-weight:600;">${value}</td></tr>`;

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#111827;">
      <p>Kopja rezervë javore e të dhënave të laboratorit, ${date}.<br />
         <span style="color:#6b7280;">Weekly backup of the laboratory data.</span></p>
      <table style="border-collapse:collapse;margin:16px 0;">
        ${row("Kampionë", "Samples", summary.samples)}
        ${row("Teste", "Tests", summary.tests)}
        ${row("Rezultate", "Worksheet results", summary.results)}
        ${row("Raporte", "Reports", summary.reports)}
        ${row("Klientë", "Clients", summary.clients)}
        ${row("Objekte", "Projects", summary.projects)}
        ${row("Përdorues", "Users", summary.users)}
      </table>
      <p>Bashkëngjitur: <strong>${attachmentName}</strong> — të gjitha të dhënat në një skedar.<br />
         <span style="color:#6b7280;">Attached: the complete data in one file. Keep the email and you keep the lab's record.</span></p>
      <p style="color:#6b7280;">Një kopje ruhet gjithashtu në bazën e të dhënave si <code>${backupId}</code>
         (ruhen ${keptSnapshots} javët e fundit).<br />
         A copy is also kept in the database as <code>${backupId}</code>; the last ${keptSnapshots} weeks are retained.</p>
      <p style="color:#6b7280;font-size:12px;">${restoreInstructions(backupId).join("<br />")}</p>
      <p style="color:#6b7280;font-size:12px;">Raportet PDF nuk përfshihen — ato rigjenerohen nga këto të dhëna.<br />
         Report PDFs are not included; they regenerate from this data.</p>
    </div>
  `;
}
