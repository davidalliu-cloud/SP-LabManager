"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { SummaryCard } from "@/components/ui/summary-card";
import { averageDays } from "@/lib/calculations";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";
import { buildLabIndex } from "@/lib/lab-index";
import { isOverdue } from "@/lib/status";
import type { ReportStatus } from "@/lib/types";

const albanianMonths = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];

/** Every report state, in workflow order. The chart used to cover five of them
 *  and silently omit Rejected - the rework queue, which is the number a lab
 *  manager most needs to see. Its first bucket was "Completed", which is not a
 *  report status at all, so that bar could only ever read zero. */
const REPORT_STATUSES: Array<{ value: ReportStatus; label: string }> = [
  { value: "Draft", label: "Draft" },
  { value: "Report Drafted", label: "Raport i përgatitur" },
  { value: "Pending Approval", label: "Në pritje miratimi" },
  { value: "Rejected", label: "Refuzuar" },
  { value: "Approved", label: "Miratuar" },
  { value: "Issued", label: "Lëshuar" },
  { value: "Sent to Client", label: "Dërguar klientit" }
];

const TOP_CLIENTS = 10;

/** First and last day of the month containing `today`, as YYYY-MM-DD. */
function currentMonthRange(today: Date) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const pad = (value: number) => String(value).padStart(2, "0");
  const first = `${year}-${pad(month + 1)}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const last = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
  return { first, last, label: `${albanianMonths[month]} ${year}` };
}

/** A timestamp or date string falls inside the month. */
function inMonth(value: string | undefined, first: string, last: string) {
  if (!value) return false;
  const day = value.slice(0, 10);
  return day >= first && day <= last;
}

export default function MonthlySummaryPage() {
  const store = useLabStore();
  const { first, last, label: monthLabel } = useMemo(() => currentMonthRange(new Date()), []);
  const index = useMemo(
    () => buildLabIndex(store),
    [store.samples, store.tests, store.reports, store.clients, store.projects, store.users]
  );

  const metrics = useMemo(() => {
    // Everything below is scoped to the month on the heading. It used to be
    // lifetime totals under a monthly title, which read roughly right while the
    // lab was young and drifts further from the truth every month.
    const samplesReceived = store.samples.filter((sample) => inMonth(sample.dateReceived, first, last));
    const testsCompleted = store.tests.filter((test) => inMonth(test.completedAt, first, last));
    const reportsSent = store.reports.filter(
      (report) => report.reportStatus === "Sent to Client" && inMonth(report.issuedAt ?? report.approvedAt ?? report.createdAt, first, last)
    );

    // Overdue is a question about right now, not about the month, and it is
    // derived from the due date. The old tile counted status === "Delayed",
    // a status nothing in the app ever assigns, so it could only read zero.
    const overdueNow = store.tests.filter((test) => isOverdue(test.requiredTestDate, test.status));

    // Turnaround measured from when the material arrived, not when the record
    // was typed in, and only over work finished this month.
    const turnaround = averageDays(
      testsCompleted.map((test) => ({
        start: index.sampleById.get(test.sampleId)?.dateReceived,
        end: test.completedAt
      }))
    );

    const testsThisMonth = store.tests.filter((test) => inMonth(test.completedAt ?? test.createdAt, first, last));

    const perClient = new Map<string, number>();
    for (const test of testsThisMonth) perClient.set(test.clientId, (perClient.get(test.clientId) ?? 0) + 1);
    const byClient = [...perClient.entries()]
      .map(([clientId, tests]) => ({ name: index.clientById.get(clientId)?.clientName ?? "—", tests }))
      .sort((a, b) => b.tests - a.tests)
      .slice(0, TOP_CLIENTS);

    const perType = new Map<string, number>();
    for (const sample of samplesReceived) perType.set(sample.sampleType, (perType.get(sample.sampleType) ?? 0) + 1);
    const commonType = [...perType.entries()].sort((a, b) => b[1] - a[1])[0];

    const byStatus = REPORT_STATUSES.map((status) => ({
      name: status.label,
      reports: store.reports.filter((report) => report.reportStatus === status.value).length
    }));

    return {
      samplesReceived: samplesReceived.length,
      completed: testsCompleted.length,
      sent: reportsSent.length,
      overdueNow: overdueNow.length,
      turnaround,
      byClient,
      byStatus,
      topClient: byClient[0],
      commonType
    };
  }, [store.samples, store.tests, store.reports, index, first, last]);

  return (
    <>
      <PageHeader
        title={`Përmbledhje mujore — ${monthLabel}`}
        description={`Të dhënat për periudhën ${formatEuropeanDate(first)} – ${formatEuropeanDate(last)}.`}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Kampionë të pranuar" value={metrics.samplesReceived} detail="Në këtë muaj" />
        <SummaryCard label="Teste të përfunduara" value={metrics.completed} tone="green" detail="Në këtë muaj" />
        <SummaryCard label="Raporte të dërguara klientit" value={metrics.sent} tone="green" detail="Në këtë muaj" />
        <SummaryCard label="Teste me vonesë" value={metrics.overdueNow} tone="red" detail="Aktualisht, sipas afatit" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title={`Testet sipas klientit — 10 më aktivët (${monthLabel})`} data={metrics.byClient} dataKey="tests" />
        <ChartPanel title="Raportet sipas statusit (të gjitha)" data={metrics.byStatus} dataKey="reports" />
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <SummaryCard
          label="Klienti më aktiv"
          value={metrics.topClient?.name ?? "—"}
          detail={metrics.topClient ? `${metrics.topClient.tests} teste këtë muaj` : "Asnjë test këtë muaj"}
        />
        <SummaryCard
          label="Tipi më i shpeshtë i kampionit"
          value={metrics.commonType?.[0] ?? "—"}
          detail={metrics.commonType ? `${metrics.commonType[1]} kampionë këtë muaj` : "Asnjë kampion këtë muaj"}
        />
        <SummaryCard
          label="Mesatarja nga pranimi në përfundim"
          value={`${metrics.turnaround} ditë`}
          tone="amber"
          detail="Teste të përfunduara këtë muaj"
        />
      </section>
    </>
  );
}

function ChartPanel({ title, data, dataKey }: { title: string; data: Array<Record<string, string | number>>; dataKey: string }) {
  return (
    <div className="surface-card h-80 p-4">
      <h2 className="mb-4 text-base font-semibold text-ink">{title}</h2>
      {data.length === 0 ? (
        <div className="flex h-[85%] items-center justify-center text-sm text-muted">Asnjë të dhënë për këtë periudhë</div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={data}>
            <CartesianGrid stroke="#DCE3E6" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey={dataKey} fill="#5B193F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
