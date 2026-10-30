import { redirect } from "next/navigation";
import { buildClientAnalysis, formatPeriod, monthPeriod } from "@/lib/client-analysis";
import { formatEuropeanDate } from "@/lib/date-format";
import { currentPortalUser, readClientSlice } from "@/lib/portal/session";
import { clientVisibleReports, workStatus } from "@/lib/portal/view";

export const dynamic = "force-dynamic";

export const metadata = { title: "Portali i klientit — SARP & LAB" };

/**
 * What a client's own people see: their work, as it stands now.
 *
 * Rendered on the server from one client's slice of the register. Nothing of
 * anyone else's is fetched, so there is no fuller copy sitting in the page for
 * someone to open the console and read — which is the whole reason this is not
 * the laboratory's own client page with the menus taken off.
 *
 * It is a reading room. There is no edit anywhere, no link into a test or a
 * sample, and the only documents reachable are this client's own finished
 * reports and the summary of their own period.
 */
export default async function PortalPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
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

  const { from: rawFrom, to: rawTo } = await searchParams;
  const fallback = monthPeriod();
  const from = rawFrom || fallback.from;
  const to = rawTo || fallback.to;
  const period = from <= to ? { from, to } : { from: to, to: from };

  const client = slice.clients[0];
  const analysis = buildClientAnalysis(slice, user.clientId, period);
  const reports = clientVisibleReports(slice);
  const projectName = (id?: string) => slice.projects.find((row) => row.id === id)?.projectName ?? "—";

  const rows = slice.tests
    .map((test) => {
      const sample = slice.samples.find((row) => row.id === test.sampleId);
      const report = reports.find((row) => row.testId === test.id);
      return { test, sample, report };
    })
    .sort((a, b) => (b.sample?.dateReceived ?? "").localeCompare(a.sample?.dateReceived ?? ""));

  const summaryHref = `/api/portal/summary?from=${period.from}&to=${period.to}`;

  return (
    <main className="min-h-screen bg-lab-mist pb-16">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
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

      <div className="mx-auto max-w-6xl space-y-5 px-6 py-6">
        <section className="rounded-lg border border-line bg-white p-4">
          <form method="get" className="flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="from" className="text-xs font-semibold uppercase tracking-wide text-muted">Nga / From</label>
              <input id="from" name="from" type="date" defaultValue={period.from} className="field mt-1 w-44" />
            </div>
            <div>
              <label htmlFor="to" className="text-xs font-semibold uppercase tracking-wide text-muted">Deri / To</label>
              <input id="to" name="to" type="date" defaultValue={period.to} className="field mt-1 w-44" />
            </div>
            <button type="submit" className="btn-secondary">Ndrysho periudhën</button>
            <a href={summaryHref} className="btn-primary">Shkarko përmbledhjen / Download summary</a>
          </form>
          <p className="mt-2 text-xs leading-5 text-muted">
            Përmbledhja gjenerohet në çastin që e shkarkoni, nga gjendja e tanishme e regjistrit — {formatPeriod(period)}.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Mostra të pranuara" value={analysis.samplesReceived} />
          <Stat label="Teste të përfunduara" value={analysis.testsCompleted} />
          <Stat label="Raporte të lëshuara" value={analysis.reportsIssued} />
          <Stat
            label="Kohë mesatare"
            value={analysis.averageTurnaroundDays !== undefined ? `${analysis.averageTurnaroundDays} ditë` : "—"}
          />
        </section>

        <section className="overflow-hidden rounded-lg border border-line bg-white">
          <header className="flex items-baseline justify-between gap-3 border-b border-line bg-lab-porcelain px-4 py-2.5">
            <h2 className="text-sm font-semibold text-ink">Puna juaj / Your work</h2>
            <span className="text-xs text-muted">{rows.length}</span>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2">Kampioni</th>
                  <th className="px-4 py-2">Objekti</th>
                  <th className="px-4 py-2">Testi</th>
                  <th className="px-4 py-2">Pranuar</th>
                  <th className="px-4 py-2">Statusi</th>
                  <th className="px-4 py-2">Raporti</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ test, sample, report }) => (
                  <tr key={test.id} className="border-b border-line/70 last:border-0">
                    <td className="whitespace-nowrap px-4 py-2.5 font-semibold tabular-nums text-ink">{sample?.sampleCode ?? "—"}</td>
                    <td className="px-4 py-2.5">{projectName(test.projectId)}</td>
                    <td className="px-4 py-2.5">{test.testType}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{formatEuropeanDate(sample?.dateReceived)}</td>
                    <td className="px-4 py-2.5">{workStatus(test, report)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      {report ? (
                        <a
                          href={`/api/portal/report/${report.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-lab-burgundy hover:text-lab-purple"
                        >
                          {report.reportNumber}
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rows.length ? <p className="px-4 py-6 text-sm text-muted">Asnjë mostër e regjistruar ende.</p> : null}
        </section>

        <p className="text-xs leading-5 text-muted">
          Raportet shfaqen këtu pasi të jenë aprovuar nga përgjegjësi i laboratorit. Mostrat numërohen sipas datës së
          pranimit, testet sipas datës së përfundimit dhe raportet sipas datës së lëshimit.
        </p>
        <p className="text-center text-[11px] leading-5 text-muted">
          SARP &amp; LAB sh.p.k. · Autostrada Tiranë-Durrës, km 29, Durrës · ISO/IEC 17025
        </p>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</div>
    </div>
  );
}
