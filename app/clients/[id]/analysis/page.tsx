"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { buildClientAnalysis, formatPeriod, monthPeriod } from "@/lib/client-analysis";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";

/**
 * Përmbledhje e punës për klientin — the analysis that goes to a client each
 * month, and the sheet that goes in front of an invoice.
 *
 * It answers, for a period the operator chooses: what did you send us, what did
 * we test, what did we issue, how long did it take, and what were the concrete
 * strengths. The report table at the bottom is the part that faces the invoice —
 * it is the list the client can tick off against their own records.
 *
 * Rejected reports are absent by design. They were never issued, so they are
 * not work to bill for, and a voided number on a client's summary invites a
 * question with no good answer.
 */
export default function ClientAnalysisPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const store = useLabStore();

  const period = useMemo(() => {
    const fallback = monthPeriod();
    const from = search.get("from") || fallback.from;
    const to = search.get("to") || fallback.to;
    return from <= to ? { from, to } : { from: to, to: from };
  }, [search]);

  const analysis = useMemo(
    () => buildClientAnalysis(store, params.id, period),
    [store.clients, store.projects, store.samples, store.tests, store.reports, store.concreteTests, params.id, period]
  );

  if (!analysis.client) return <PageHeader title="Klienti nuk u gjet" />;

  const { client } = analysis;
  const nothing = analysis.samplesReceived === 0 && analysis.testsCompleted === 0 && analysis.reportsIssued === 0;
  const strengthChart = analysis.concrete?.byClass.map((row) => ({
    name: row.strengthClass,
    mpa: row.averageStrengthMpa,
    specimens: row.specimens
  }));

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={`Përmbledhje — ${client.clientName}`}
          description={`${client.clientCode} · ${formatPeriod(period)}`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/clients/${client.id}`} className="btn-secondary">
                Kthehu te klienti
              </Link>
              <button onClick={() => window.print()} className="btn-primary">
                Printo / PDF
              </button>
            </div>
          }
        />
      </div>

      {/* The printed sheet. Everything inside carries its own heading, because a
          page that leaves the screen has to say what it is without the app
          around it. */}
      <div className="print-surface space-y-6 rounded-md bg-white">
        <header className="hidden items-start justify-between gap-4 border-b border-black pb-3 print:flex">
          <div>
            <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-[150px]" />
          </div>
          <div className="text-right text-[10pt]">
            <div className="font-bold uppercase">Përmbledhje e punës laboratorike</div>
            <div>{client.clientName} · {client.clientCode}</div>
            <div>{formatPeriod(period)}</div>
          </div>
        </header>

        {nothing ? (
          <div className="rounded-lg border border-line bg-lab-porcelain p-6 text-sm text-ink">
            <div className="font-semibold">Asnjë aktivitet për këtë periudhë.</div>
            <p className="mt-1 text-xs text-muted">
              Nuk ka mostra të pranuara, teste të përfunduara apo raporte të lëshuara për {client.clientName} midis{" "}
              {formatPeriod(period)}.
            </p>
          </div>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile label="Mostra të pranuara" value={analysis.samplesReceived} />
          <Tile label="Teste të përfunduara" value={analysis.testsCompleted} />
          <Tile label="Raporte të lëshuara" value={analysis.reportsIssued} />
          <Tile
            label="Kohë mesatare (ditë)"
            value={analysis.averageTurnaroundDays ?? "—"}
            hint="Nga pranimi i mostrës deri në lëshimin e raportit"
          />
        </section>

        {analysis.byTestType.length ? (
          <section className="surface-card p-4">
            <h2 className="text-sm font-semibold text-ink">Testet sipas tipit</h2>
            <p className="mt-0.5 text-xs text-muted">Teste të përfunduara dhe raporte të lëshuara në periudhë.</p>
            <div className="mt-4" style={{ height: Math.max(220, analysis.byTestType.length * 34) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.byTestType} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="label" width={230} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="tests" name="Teste" fill="#6B1D3F" radius={[0, 3, 3, 0]} />
                  <Bar dataKey="reports" name="Raporte" fill="#C9A227" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        {analysis.byMonth.length > 1 ? (
          <section className="surface-card p-4">
            <h2 className="text-sm font-semibold text-ink">Rrjedha sipas mujore</h2>
            <p className="mt-0.5 text-xs text-muted">Vetëm kur periudha përfshin më shumë se një muaj.</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.byMonth} margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="samples" name="Mostra" stroke="#1F4E79" strokeWidth={2} />
                  <Line type="monotone" dataKey="tests" name="Teste" stroke="#6B1D3F" strokeWidth={2} />
                  <Line type="monotone" dataKey="reports" name="Raporte" stroke="#C9A227" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        ) : null}

        {analysis.concrete && strengthChart ? (
          <section className="surface-card p-4">
            <h2 className="text-sm font-semibold text-ink">Rezistenca në shtypje</h2>
            <p className="mt-0.5 text-xs text-muted">
              {analysis.concrete.specimens} kampione · mesatarja {analysis.concrete.averageStrengthMpa} MPa · minimumi{" "}
              {analysis.concrete.minStrengthMpa} MPa · maksimumi {analysis.concrete.maxStrengthMpa} MPa
            </p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strengthChart} margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis unit=" MPa" tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number, name) => (name === "mpa" ? `${value} MPa` : value)} />
                  <Bar dataKey="mpa" name="Mesatarja" radius={[3, 3, 0, 0]}>
                    {strengthChart.map((row) => (
                      <Cell key={row.name} fill="#6B1D3F" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Mesataret janë të kampionëve të testuar në këtë periudhë, grupuar sipas klasës së deklaruar. Konformiteti
              me klasën vlerësohet sipas EN 206 mbi të gjithë derdhjen dhe nuk deklarohet në këtë përmbledhje.
            </p>
          </section>
        ) : null}

        {analysis.projects.length ? (
          <section className="surface-card overflow-hidden">
            <header className="border-b border-line bg-lab-porcelain px-4 py-2.5">
              <h2 className="text-sm font-semibold text-ink">Objektet</h2>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2">Objekti</th>
                    <th className="px-4 py-2 text-right">Mostra</th>
                    <th className="px-4 py-2 text-right">Teste</th>
                    <th className="px-4 py-2 text-right">Raporte</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.projects.map((project) => (
                    <tr key={project.id} className="border-b border-line/70 last:border-0">
                      <td className="px-4 py-2.5 text-ink">{project.name}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{project.samples}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{project.tests}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{project.reports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {analysis.reportRows.length ? (
          <section className="surface-card overflow-hidden">
            <header className="flex items-baseline justify-between gap-3 border-b border-line bg-lab-porcelain px-4 py-2.5">
              <h2 className="text-sm font-semibold text-ink">Raportet e lëshuara</h2>
              <span className="text-xs text-muted">{analysis.reportRows.length}</span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2">Nr. raporti</th>
                    <th className="px-4 py-2">Nr. regjistri</th>
                    <th className="px-4 py-2">Objekti</th>
                    <th className="px-4 py-2">Testi</th>
                    <th className="px-4 py-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.reportRows.map((row) => (
                    <tr key={row.reportNumber} className="border-b border-line/70 last:border-0">
                      <td className="whitespace-nowrap px-4 py-2.5 font-semibold tabular-nums text-ink">{row.reportNumber}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{row.sampleCode}</td>
                      <td className="px-4 py-2.5">{row.projectName}</td>
                      <td className="px-4 py-2.5">{row.testType}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{formatEuropeanDate(row.issuedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <p className="text-xs leading-5 text-muted">
          Mostrat numërohen sipas datës së pranimit, testet sipas datës së përfundimit dhe raportet sipas datës së
          lëshimit — një mostër e pranuar në fund të muajit testohet dhe raportohet në muajin pasardhës. Raportet e
          refuzuara nuk përfshihen.
        </p>
      </div>
    </>
  );
}

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="text-2xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-sm font-medium text-ink">{label}</div>
      {hint ? <div className="mt-1 text-xs leading-4 text-muted">{hint}</div> : null}
    </div>
  );
}
