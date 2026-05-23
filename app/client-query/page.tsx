"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";
import { getTestResultSummary } from "@/lib/test-result-summary";
import type { ReportStatus, TestStatus } from "@/lib/types";

const completedStatuses: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Rejected", "Issued"];
const reportStatuses: Array<ReportStatus | "No Report"> = ["Report Drafted", "Pending Approval", "Approved", "Rejected", "Issued", "No Report"];

function csvCell(value: string | number | undefined | null) {
  const text = value === undefined || value === null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function dateInRange(value: string | undefined, from: string, to: string) {
  if (!value) return false;
  const date = value.slice(0, 10);
  return (!from || date >= from) && (!to || date <= to);
}

export default function ClientQueryPage() {
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canSeeClients = canViewClientIdentity(currentUser?.role);
  const [clientId, setClientId] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [testType, setTestType] = useState("all");
  const [reportStatus, setReportStatus] = useState<ReportStatus | "No Report" | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => store.tests.map((test) => {
    const sample = store.samples.find((item) => item.id === test.sampleId);
    const client = store.clients.find((item) => item.id === test.clientId);
    const project = store.projects.find((item) => item.id === test.projectId);
    const reports = store.reports.filter((item) => item.testId === test.id);
    const result = getTestResultSummary(store, test);
    const conductedDate = result.testEndDate || test.completedAt?.slice(0, 10) || test.requiredTestDate;
    return { test, sample, client, project, reports, result, conductedDate };
  }), [store]);

  const projectsForClient = clientId === "all" ? store.projects : store.projects.filter((project) => project.clientId === clientId);
  const testTypes = Array.from(new Set(store.tests.map((test) => test.testType))).sort();
  const filteredRows = rows.filter(({ test, sample, client, project, reports, result, conductedDate }) => {
    const reportStatusMatch = reportStatus === "all"
      || (reportStatus === "No Report" ? reports.length === 0 : reports.some((report) => report.reportStatus === reportStatus));
    const haystack = [
      client?.clientCode,
      client?.clientName,
      project?.projectName,
      sample?.sampleCode,
      sample?.sampleType,
      test.testCode,
      test.testType,
      reports.map((report) => report.reportNumber).join(" "),
      result.result
    ].filter(Boolean).join(" ").toLowerCase();

    return (
      completedStatuses.includes(test.status) &&
      (clientId === "all" || test.clientId === clientId) &&
      (projectId === "all" || test.projectId === projectId) &&
      (testType === "all" || test.testType === testType) &&
      reportStatusMatch &&
      dateInRange(conductedDate, fromDate, toDate) &&
      (!search || haystack.includes(search.toLowerCase()))
    );
  });

  const selectedClient = clientId !== "all" ? store.clients.find((client) => client.id === clientId) : undefined;
  const reportCount = filteredRows.reduce((sum, row) => sum + row.reports.length, 0);
  const issuedCount = filteredRows.reduce((sum, row) => sum + row.reports.filter((report) => report.reportStatus === "Issued").length, 0);

  function clearFilters() {
    setClientId("all");
    setProjectId("all");
    setTestType("all");
    setReportStatus("all");
    setFromDate("");
    setToDate("");
    setSearch("");
  }

  function exportCsv() {
    const header = [
      "Kodi i klientit",
      "Klienti",
      "Projekti",
      "Kodi i kampionit",
      "Tipi i kampionit",
      "Kodi i testit",
      "Testi",
      "Data e pranimit",
      "Data e testimit",
      "Afati i raportit",
      "Statusi i testit",
      "Raportet",
      "Statusi i raportit",
      "Data e leshimit",
      "Rezultati",
      "Tekniku",
      "Kontrolluar nga"
    ];
    const body = filteredRows.map(({ test, sample, client, project, reports, result, conductedDate }) => [
      client?.clientCode,
      client?.clientName,
      project?.projectName,
      sample?.sampleCode,
      sample?.sampleType,
      test.testCode,
      test.testType,
      formatEuropeanDate(sample?.dateReceived),
      formatEuropeanDate(conductedDate),
      formatEuropeanDate(test.dueDate),
      test.status,
      reports.map((report) => report.reportNumber).join("; "),
      reports.length ? reports.map((report) => report.reportStatus).join("; ") : "No Report",
      reports.map((report) => formatEuropeanDate(report.issuedAt)).join("; "),
      result.result,
      result.technicianName || store.users.find((user) => user.id === test.assignedTechnician)?.fullName,
      result.checkedBy
    ]);
    const csv = [header, ...body].map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const clientPart = selectedClient?.clientCode ?? "te-gjithe-klientet";
    anchor.href = url;
    anchor.download = `raport-klienti-${clientPart}-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!canSeeClients) {
    return (
      <PageHeader
        title="Kërkimi i klientit"
        description="Kjo faqe është e kufizuar për role që kanë të drejtë të shohin identitetin e klientëve."
      />
    );
  }

  return (
    <>
      <PageHeader title="Kërkimi i klientit" description="Nxirrni testet e kryera, datat, rezultatet dhe raportet për një klient të caktuar." />

      <section className="surface-card mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          <label className="text-sm font-medium text-ink">
            Klienti
            <select value={clientId} onChange={(event) => { setClientId(event.target.value); setProjectId("all"); }} className="input mt-1">
              <option value="all">Të gjithë klientët</option>
              {store.clients.map((client) => <option key={client.id} value={client.id}>{client.clientCode} - {client.clientName}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Projekti
            <select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="input mt-1">
              <option value="all">Të gjitha projektet</option>
              {projectsForClient.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Testi
            <select value={testType} onChange={(event) => setTestType(event.target.value)} className="input mt-1">
              <option value="all">Të gjitha testet</option>
              {testTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Statusi i raportit
            <select value={reportStatus} onChange={(event) => setReportStatus(event.target.value as ReportStatus | "No Report" | "all")} className="input mt-1">
              <option value="all">Të gjitha</option>
              {reportStatuses.map((status) => <option key={status} value={status}>{status === "No Report" ? "Pa raport" : status}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Nga data
            <input value={fromDate} onChange={(event) => setFromDate(event.target.value)} type="date" className="input mt-1" />
          </label>
          <label className="text-sm font-medium text-ink">
            Deri më
            <input value={toDate} onChange={(event) => setToDate(event.target.value)} type="date" className="input mt-1" />
          </label>
          <label className="text-sm font-medium text-ink">
            Kërko
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input mt-1" placeholder="Kod, raport, rezultat..." />
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-muted">
            <span className="font-semibold text-ink">{filteredRows.length}</span> teste të kryera, <span className="font-semibold text-ink">{reportCount}</span> raporte, <span className="font-semibold text-ink">{issuedCount}</span> të lëshuara.
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} disabled={!filteredRows.length} className="btn-primary px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-300">Eksporto CSV</button>
            <button type="button" onClick={clearFilters} className="btn-secondary px-3 py-2">Pastro filtrat</button>
          </div>
        </div>
      </section>

      {selectedClient ? (
        <section className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="surface-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Klienti</div>
            <div className="mt-1 text-lg font-semibold text-ink">{selectedClient.clientCode} - {selectedClient.clientName}</div>
            <div className="mt-1 text-sm text-muted">{selectedClient.email || "Pa email"} · {selectedClient.phone || "Pa telefon"}</div>
          </div>
          <div className="surface-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Adresa</div>
            <div className="mt-1 text-sm font-medium text-ink">{selectedClient.address || "-"}</div>
          </div>
          <div className="surface-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Kontakt</div>
            <div className="mt-1 text-sm font-medium text-ink">{selectedClient.contactPerson || "-"}</div>
          </div>
        </section>
      ) : null}

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Klienti</th>
                <th className="px-4 py-3">Projekti</th>
                <th className="px-4 py-3">Kampioni</th>
                <th className="px-4 py-3">Testi</th>
                <th className="px-4 py-3">Data e pranimit</th>
                <th className="px-4 py-3">Data e testimit</th>
                <th className="px-4 py-3">Rezultati</th>
                <th className="px-4 py-3">Raportet</th>
                <th className="px-4 py-3">Statusi</th>
                <th className="px-4 py-3">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredRows.map(({ test, sample, client, project, reports, result, conductedDate }) => (
                <tr key={test.id} className="align-top hover:bg-lab-mist/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{client?.clientCode ?? "-"}</div>
                    <div className="text-xs text-muted">{client?.clientName ?? "-"}</div>
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
                  <td className="px-4 py-3">{formatEuropeanDate(sample?.dateReceived)}</td>
                  <td className="px-4 py-3">
                    <div>{formatEuropeanDate(conductedDate)}</div>
                    <div className="text-xs text-muted">Afati: {formatEuropeanDate(test.dueDate)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-md font-medium text-ink">{result.result}</div>
                    <div className="mt-1 text-xs text-muted">Tekniku: {result.technicianName || store.users.find((user) => user.id === test.assignedTechnician)?.fullName || "-"}</div>
                  </td>
                  <td className="px-4 py-3">
                    {reports.length ? (
                      <div className="flex flex-col gap-1">
                        {reports.map((report) => (
                          <Link key={report.id} href={`/reports/${report.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">
                            {report.reportNumber} ({report.reportSequence}/{report.totalReports})
                          </Link>
                        ))}
                      </div>
                    ) : <span className="text-muted">Pa raport</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <StatusBadge status={test.status} />
                      {reports.map((report) => <StatusBadge key={report.id} status={report.reportStatus} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Link href={`/tests/${test.id}`} className="rounded-md border border-line px-2 py-1 text-center text-xs font-semibold text-ink hover:border-lab-burgundy hover:text-lab-burgundy">Hap testin</Link>
                      {sample ? <Link href={`/samples/${sample.id}`} className="rounded-md border border-line px-2 py-1 text-center text-xs font-semibold text-ink hover:border-lab-burgundy hover:text-lab-burgundy">Hap kampionin</Link> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filteredRows.length ? <div className="p-6 text-sm text-muted">Nuk u gjetën teste të kryera për filtrat e zgjedhur.</div> : null}
      </div>
    </>
  );
}
