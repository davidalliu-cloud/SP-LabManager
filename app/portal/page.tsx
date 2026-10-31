import { redirect } from "next/navigation";
import { SummaryCard } from "@/components/ui/summary-card";
import { buildClientAnalysis, formatPeriod, monthPeriod } from "@/lib/client-analysis";
import { formatEuropeanDate } from "@/lib/date-format";
import { currentPortalUser, readClientSlice } from "@/lib/portal/session";
import {
  COMPLETED_TEST_STATUSES,
  DETAIL_LABELS,
  REPORT_STATUS_LABELS,
  STAGE_LABELS,
  TONE_CLASS,
  WAITING_TEST_STATUSES,
  clientVisibleReports
} from "@/lib/portal/view";
import { testLifecycle, type Lifecycle } from "@/lib/sample-stage";
import { getStatusTone } from "@/lib/status";
import { getTestResultSummary } from "@/lib/test-result-summary";
import type { ReportStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Portali i klientit — SARP & LAB" };

const REPORT_STATUS_FILTERS: Array<ReportStatus | "No Report"> = [
  "Report Drafted",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Issued",
  "Sent to Client",
  "No Report"
];

function dateInRange(value: string | undefined, from: string, to: string) {
  if (!value) return false;
  const date = value.slice(0, 10);
  return (!from || date >= from) && (!to || date <= to);
}

/**
 * What a client's own people see: their client page, as the laboratory sees it.
 *
 * Deliberately the same page — the same four tiles, the same client card, the
 * same share-of-reports bars, the same filters, and the same wide register with
 * the measured result and the lifecycle stage on every row. A client who rings
 * about a sample and a technician who looks it up then read one page, in one
 * vocabulary, off one register; that is the only way this saves the phone call
 * it was built to save.
 *
 * Two things are left off, and only these two. There is no column of links into
 * the test and the sample, because a client has no business inside the
 * laboratory's working records; and a report's file opens only once it has been
 * approved, though its number and stage are listed from the moment it exists.
 *
 * Rendered on the server from one client's slice of the register. Nothing of
 * anyone else's is fetched, so there is no fuller copy sitting in the page for
 * someone to open the console and read — which is the whole reason this is not
 * the laboratory's own client page with the menus taken off.
 */
export default async function PortalPage({
  searchParams
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    project?: string;
    testType?: string;
    reportStatus?: string;
    fromDate?: string;
    toDate?: string;
    q?: string;
  }>;
}) {
  const user = await currentPortalUser();
  if (!user) redirect("/portal/login");

  const slice = await readClientSlice(user.clientId);
  if (!slice) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-muted">Llogaria juaj nuk është e lidhur me asnjë klient. Ju lutemi kontaktoni laboratorin.</p>
      </main>
    );
  }

  const params = await searchParams;
  const fallback = monthPeriod();
  const rawFrom = params.from || fallback.from;
  const rawTo = params.to || fallback.to;
  const period = rawFrom <= rawTo ? { from: rawFrom, to: rawTo } : { from: rawTo, to: rawFrom };

  // The table filters, which narrow what is on screen. Separate from the period
  // above, which sets what the downloaded summary covers.
  const projectFilter = params.project || "all";
  const testTypeFilter = params.testType || "all";
  const reportStatusFilter = params.reportStatus || "all";
  const fromDate = params.fromDate || "";
  const toDate = params.toDate || "";
  const search = params.q || "";

  const client = slice.clients[0];
  const analysisPeriodLabel = formatPeriod(period);
  const openable = new Set(clientVisibleReports(slice).map((report) => report.id));

  const rows = slice.tests
    .map((test) => {
      const sample = slice.samples.find((row) => row.id === test.sampleId);
      const project = slice.projects.find((row) => row.id === test.projectId);
      const reports = slice.reports.filter((row) => row.testId === test.id);
      const result = getTestResultSummary(slice, test);
      const conductedDate = result.testEndDate || test.completedAt?.slice(0, 10) || test.requiredTestDate;
      return { test, sample, project, reports, result, conductedDate };
    })
    .sort((a, b) => a.conductedDate.localeCompare(b.conductedDate) || a.test.testCode.localeCompare(b.test.testCode));

  const testTypes = Array.from(new Set(rows.map(({ test }) => test.testType))).sort();

  const filteredRows = rows.filter(({ test, sample, project, reports, result, conductedDate }) => {
    const reportStatusMatch =
      reportStatusFilter === "all" ||
      (reportStatusFilter === "No Report"
        ? reports.length === 0
        : reports.some((report) => report.reportStatus === reportStatusFilter));
    const haystack = [
      project?.projectName,
      sample?.sampleCode,
      sample?.sampleType,
      test.testCode,
      test.testType,
      reports.map((report) => report.reportNumber).join(" "),
      result.result
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      (projectFilter === "all" || test.projectId === projectFilter) &&
      (testTypeFilter === "all" || test.testType === testTypeFilter) &&
      reportStatusMatch &&
      dateInRange(conductedDate, fromDate, toDate) &&
      (!search || haystack.includes(search.toLowerCase()))
    );
  });

  const waitingTests = rows.filter(({ test }) => WAITING_TEST_STATUSES.includes(test.status)).length;
  const completedTests = rows.filter(({ test }) => COMPLETED_TEST_STATUSES.includes(test.status)).length;
  const totalReports = slice.reports.length;
  const sentReports = slice.reports.filter((report) => ["Sent to Client", "Issued"].includes(report.reportStatus)).length;

  const reportTypeBreakdown = Array.from(
    slice.reports.reduce((map, report) => {
      const test = slice.tests.find((row) => row.id === report.testId);
      const label = test?.testType ?? "Pa test";
      map.set(label, (map.get(label) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([label, count]) => ({ label, count, percent: totalReports ? Math.round((count / totalReports) * 100) : 0 }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const summaryHref = `/api/portal/summary?from=${period.from}&to=${period.to}`;
  const clearHref = `/portal?from=${period.from}&to=${period.to}`;

  return (
    <main className="min-h-screen bg-lab-mist pb-16">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-32" />
            <div>
              <div className="text-sm font-semibold text-ink">{client.clientName}</div>
              <div className="text-xs text-muted">
                {client.clientCode} · {user.fullName ?? user.email}
              </div>
            </div>
          </div>
          <form method="post" action="/api/portal/logout">
            <button type="submit" className="btn-secondary">Dil / Sign out</button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 border-b border-line pb-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">Portali i klientit</div>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.02em] text-ink">
            {client.clientCode} - {client.clientName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Pasqyra e testeve, kampionëve dhe raporteve për këtë klient — e njëjta gjendje që shikon laboratori, në
            çastin që hapet faqja.
          </p>
        </div>

        {/*
          The period the downloaded summary covers. Defaulted to the current
          month because that is what is asked for nine times in ten, but any
          range can be set. The table's own filters ride along as hidden fields,
          so changing the period does not quietly clear them.
        */}
        <section className="mb-5 rounded-lg border border-line bg-lab-porcelain p-4">
          <form method="get" className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="project" value={projectFilter} />
            <input type="hidden" name="testType" value={testTypeFilter} />
            <input type="hidden" name="reportStatus" value={reportStatusFilter} />
            <input type="hidden" name="fromDate" value={fromDate} />
            <input type="hidden" name="toDate" value={toDate} />
            <input type="hidden" name="q" value={search} />
            <div>
              <label htmlFor="from" className="text-xs font-semibold uppercase tracking-wide text-muted">Nga</label>
              <input id="from" name="from" type="date" defaultValue={period.from} className="field mt-1 w-44" />
            </div>
            <div>
              <label htmlFor="to" className="text-xs font-semibold uppercase tracking-wide text-muted">Deri</label>
              <input id="to" name="to" type="date" defaultValue={period.to} className="field mt-1 w-44" />
            </div>
            <button type="submit" className="btn-secondary">Ndrysho periudhën</button>
            <a href={summaryHref} className="btn-primary">Shkarko përmbledhjen</a>
            <p className="basis-full text-xs leading-5 text-muted">
              Përmbledhja për {analysisPeriodLabel} gjenerohet në çastin që e shkarkoni, nga gjendja e tanishme e
              regjistrit.
            </p>
          </form>
        </section>

        <section className="mb-5 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Teste të kryera" value={completedTests} tone="green" />
          <SummaryCard label="Teste në pritje/proces" value={waitingTests} tone="amber" />
          <SummaryCard label="Raporte të gjeneruara" value={totalReports} tone="purple" />
          <SummaryCard label="Raporte dërguar klientit" value={sentReports} tone="green" />
        </section>

        <section className="mb-5 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Informacioni i klientit</h2>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
              <Info label="Kodi" value={client.clientCode} />
              <Info label="Email" value={client.email || "-"} />
              <Info label="Kontakt" value={client.contactPerson || "-"} />
              <Info label="Telefon" value={client.phone || "-"} />
              <Info label="Adresë" value={client.address || "-"} />
              <Info label="Projekte" value={slice.projects.length || "-"} />
            </div>
          </div>
          <div className="surface-card p-4">
            <h2 className="text-base font-semibold text-ink">Përqindja e raporteve sipas tipit të testit</h2>
            <div className="mt-4 space-y-3">
              {reportTypeBreakdown.length ? (
                reportTypeBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-ink">{item.label}</span>
                      <span className="text-muted">
                        {item.count} raporte · {item.percent}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-lab-mist">
                      <div className="h-2 rounded-full bg-lab-burgundy" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted">Nuk ka ende raporte të gjeneruara për këtë klient.</div>
              )}
            </div>
          </div>
        </section>

        <section className="surface-card mb-5 p-4">
          <form method="get">
            <input type="hidden" name="from" value={period.from} />
            <input type="hidden" name="to" value={period.to} />
            <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <label className="text-sm font-medium text-ink">
                Projekti
                <select name="project" defaultValue={projectFilter} className="input mt-1">
                  <option value="all">Të gjitha projektet</option>
                  {slice.projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.projectName}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                Tipi i testit
                <select name="testType" defaultValue={testTypeFilter} className="input mt-1">
                  <option value="all">Të gjitha testet</option>
                  {testTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                Statusi i raportit
                <select name="reportStatus" defaultValue={reportStatusFilter} className="input mt-1">
                  <option value="all">Të gjitha</option>
                  {REPORT_STATUS_FILTERS.map((status) => (
                    <option key={status} value={status}>{REPORT_STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-ink">
                Nga data
                <input name="fromDate" defaultValue={fromDate} type="date" className="input mt-1" />
              </label>
              <label className="text-sm font-medium text-ink">
                Deri më
                <input name="toDate" defaultValue={toDate} type="date" className="input mt-1" />
              </label>
              <label className="text-sm font-medium text-ink">
                Kërko
                <input name="q" defaultValue={search} className="input mt-1" placeholder="Kod, raport, rezultat..." />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
              <span>
                <span className="font-semibold text-ink">{filteredRows.length}</span> rreshta nga{" "}
                <span className="font-semibold text-ink">{rows.length}</span> teste.
              </span>
              <span className="flex gap-2">
                <button type="submit" className="btn-primary px-3 py-2">Filtro</button>
                <a href={clearHref} className="btn-secondary px-3 py-2">Pastro filtrat</a>
              </span>
            </div>
          </form>
        </section>

        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Projekti</th>
                  <th className="px-4 py-3">Kampioni</th>
                  <th className="px-4 py-3">Testi</th>
                  <th className="px-4 py-3">Rezultati</th>
                  <th className="px-4 py-3">Raportet</th>
                  <th className="px-4 py-3">Statusi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRows.map(({ test, sample, project, reports, result, conductedDate }) => (
                  <tr key={test.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{formatEuropeanDate(conductedDate)}</div>
                      <div className="text-xs text-muted">Pranuar: {formatEuropeanDate(sample?.dateReceived)}</div>
                      <div className="text-xs text-muted">Afati: {formatEuropeanDate(test.dueDate)}</div>
                    </td>
                    <td className="px-4 py-3">{project?.projectName ?? "-"}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{sample?.sampleCode ?? "-"}</div>
                      <div className="text-xs text-muted">{sample?.sampleType ?? "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{test.testType}</div>
                      <div className="text-xs text-muted">{test.testCode}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-md font-medium text-ink">{result.result}</div>
                      {result.technicianName ? (
                        <div className="mt-1 text-xs text-muted">Tekniku: {result.technicianName}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {reports.length ? (
                        <div className="flex flex-col gap-1.5">
                          {reports.map((report) =>
                            openable.has(report.id) ? (
                              <a
                                key={report.id}
                                href={`/api/portal/report/${report.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-lab-burgundy hover:text-lab-purple"
                              >
                                {report.reportNumber} ({report.reportSequence}/{report.totalReports})
                              </a>
                            ) : (
                              <div key={report.id}>
                                <div className="font-semibold text-ink">
                                  {report.reportNumber} ({report.reportSequence}/{report.totalReports})
                                </div>
                                <div className="text-xs text-muted">
                                  {REPORT_STATUS_LABELS[report.reportStatus] ?? report.reportStatus} — hapet pas
                                  miratimit
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">Pa raport</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Stage lifecycle={testLifecycle(test, slice.reports)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredRows.length ? (
            <div className="p-6 text-sm text-muted">Nuk u gjetën teste ose raporte për filtrat e zgjedhur.</div>
          ) : null}
        </div>

        <p className="mt-5 text-xs leading-5 text-muted">
          Raportet hapen pasi të jenë aprovuar nga përgjegjësi i laboratorit; deri atëherë shfaqet numri dhe faza e
          tyre. Kampionët numërohen sipas datës së pranimit, testet sipas datës së përfundimit dhe raportet sipas datës
          së lëshimit.
        </p>
        <p className="mt-4 text-center text-[11px] leading-5 text-muted">
          SARP &amp; LAB sh.p.k. · Autostrada Tiranë-Durrës, km 29, Durrës · ISO/IEC 17025
        </p>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 font-medium text-ink">{value}</div>
    </div>
  );
}

/** The register's own stage badge, rendered without the client-side i18n provider. */
function Stage({ lifecycle }: { lifecycle: Lifecycle }) {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${TONE_CLASS[getStatusTone(lifecycle.stage)]}`}
      >
        {STAGE_LABELS[lifecycle.stage]}
      </span>
      <span className="text-[11px] leading-tight text-muted">{DETAIL_LABELS[lifecycle.detail]}</span>
    </div>
  );
}
