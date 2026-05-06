"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/ui/page-header";
import { SummaryCard } from "@/components/ui/summary-card";
import { averageDays } from "@/lib/calculations";
import { useLabStore } from "@/lib/lab-store";

export default function MonthlySummaryPage() {
  const store = useLabStore();
  const samplesReceived = store.samples.length;
  const completed = store.tests.filter((test) => test.completedAt).length;
  const issued = store.reports.filter((report) => report.reportStatus === "Issued").length;
  const delayed = store.tests.filter((test) => test.status === "Delayed").length;
  const avgRegistrationToComplete = averageDays(
    store.tests.map((test) => ({
      start: store.samples.find((sample) => sample.id === test.sampleId)?.createdAt,
      end: test.completedAt
    }))
  );
  const byClient = store.clients.map((client) => ({
    name: client.clientName,
    tests: store.tests.filter((test) => test.clientId === client.id).length
  }));
  const byStatus = [
    { value: "Completed", label: "Përfunduar" },
    { value: "Report Drafted", label: "Raport i përgatitur" },
    { value: "Pending Approval", label: "Në pritje miratimi" },
    { value: "Approved", label: "Miratuar" },
    { value: "Issued", label: "Lëshuar" }
  ].map((status) => ({
    name: status.label,
    reports: store.reports.filter((report) => report.reportStatus === status.value).length
  }));
  const filters = ["Muaji", "Klienti", "Projekti", "Tipi i kampionit", "Tipi i testit", "Tekniku"];

  return (
    <>
      <PageHeader title="Përmbledhje mujore" description="Filtra menaxherialë dhe analiza të ngarkesës së punës për muajin aktiv." />
      <section className="surface-card mb-5 grid gap-3 p-4 md:grid-cols-6">
        {filters.map((label) => (
          <label key={label} className="text-sm font-medium text-ink">
            {label}
            <select className="input mt-1">
              <option>Të gjitha</option>
              <option>Prill 2026</option>
            </select>
          </label>
        ))}
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Kampionë të pranuar" value={samplesReceived} />
        <SummaryCard label="Teste të përfunduara" value={completed} tone="green" />
        <SummaryCard label="Raporte të lëshuara" value={issued} tone="green" />
        <SummaryCard label="Teste me vonesë" value={delayed} tone="red" />
        <SummaryCard label="Vend për të ardhurat" value="$0" tone="gray" detail="Gati për modulin e faturimit" />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Testet sipas klientit" data={byClient} dataKey="tests" />
        <ChartPanel title="Raportet sipas statusit" data={byStatus} dataKey="reports" />
      </section>
      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Klientët më aktivë" value="Atlas Contractors" detail="Bazuar në të dhënat aktuale" />
        <SummaryCard label="Testi më i shpeshtë" value="Kubike Betoni / Concrete Cubes" />
        <SummaryCard label="Mesatarja nga regjistrimi në përfundim" value={`${avgRegistrationToComplete} ditë`} tone="amber" />
      </section>
    </>
  );
}

function ChartPanel({ title, data, dataKey }: { title: string; data: Array<Record<string, string | number>>; dataKey: string }) {
  return (
    <div className="surface-card h-80 p-4">
      <h2 className="mb-4 text-base font-semibold text-ink">{title}</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid stroke="#DCE3E6" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#5B193F" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
