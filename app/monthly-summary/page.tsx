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
  const byStatus = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued"].map((status) => ({
    name: status,
    reports: store.reports.filter((report) => report.reportStatus === status).length
  }));

  return (
    <>
      <PageHeader title="Monthly Summary" description="Management filters and workload analytics for the active month." />
      <section className="surface-card mb-5 grid gap-3 p-4 md:grid-cols-6">
        {["Month", "Client", "Project", "Sample type", "Test type", "Technician"].map((label) => (
          <label key={label} className="text-sm font-medium text-ink">
            {label}
            <select className="input mt-1">
              <option>All</option>
              <option>April 2026</option>
            </select>
          </label>
        ))}
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Samples received" value={samplesReceived} />
        <SummaryCard label="Tests completed" value={completed} tone="green" />
        <SummaryCard label="Reports issued" value={issued} tone="green" />
        <SummaryCard label="Delayed tests" value={delayed} tone="red" />
        <SummaryCard label="Revenue placeholder" value="$0" tone="gray" detail="Ready for invoicing module" />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartPanel title="Tests by Client" data={byClient} dataKey="tests" />
        <ChartPanel title="Reports by Status" data={byStatus} dataKey="reports" />
      </section>
      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Most active clients" value="Atlas Contractors" detail="Based on current demo data" />
        <SummaryCard label="Most common test type" value="Kubike Betoni / Concrete Cubes" />
        <SummaryCard label="Avg registration to completion" value={`${avgRegistrationToComplete} days`} tone="amber" />
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
