"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StageCell } from "@/components/ui/stage-cell";
import { testLifecycle } from "@/lib/sample-stage";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatEuropeanDate } from "@/lib/date-format";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";
import { getTestResultSummary } from "@/lib/test-result-summary";
import type { ReportStatus, TestStatus } from "@/lib/types";

const waitingStatuses: TestStatus[] = ["Pending", "Scheduled", "In Progress"];
const reportStatuses: Array<ReportStatus | "No Report"> = ["Report Drafted", "Pending Approval", "Approved", "Rejected", "Issued", "Sent to Client", "No Report"];
const reportStatusLabels: Record<ReportStatus | "No Report", string> = {
  Draft: "Draft",
  "Report Drafted": "Raport i përgatitur",
  "Pending Approval": "Në pritje miratimi",
  Approved: "Miratuar",
  Rejected: "Refuzuar",
  Issued: "Raporti i lëshuar",
  "Sent to Client": "Dërguar klientit",
  "No Report": "Pa raport"
};

function dateInRange(value: string | undefined, from: string, to: string) {
  if (!value) return false;
  const date = value.slice(0, 10);
  return (!from || date >= from) && (!to || date <= to);
}

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canSeeClients = canViewClientIdentity(currentUser?.role);
  const [projectId, setProjectId] = useState("all");
  const [testType, setTestType] = useState("all");
  const [reportStatus, setReportStatus] = useState<ReportStatus | "No Report" | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const client = store.clients.find((item) => item.id === params.id);
  const projects = store.projects.filter((project) => project.clientId === params.id);

  const rows = useMemo(() => store.tests
    .filter((test) => test.clientId === params.id)
    .map((test) => {
      const sample = store.samples.find((item) => item.id === test.sampleId);
      const project = store.projects.find((item) => item.id === test.projectId);
      const reports = store.reports.filter((item) => item.testId === test.id);
      const result = getTestResultSummary(store, test);
      const conductedDate = result.testEndDate || test.completedAt?.slice(0, 10) || test.requiredTestDate;
      return { test, sample, project, reports, result, conductedDate };
    })
    .sort((a, b) => a.conductedDate.localeCompare(b.conductedDate) || a.test.testCode.localeCompare(b.test.testCode)), [store, params.id]);

  const clientReports = store.reports.filter((report) => report.clientId === params.id);
  const testTypes = Array.from(new Set(rows.map(({ test }) => test.testType))).sort();
  const totalReports = clientReports.length;
  const reportTypeBreakdown = Array.from(
    clientReports.reduce((map, report) => {
      const test = store.tests.find((item) => item.id === report.testId);
      const label = test?.testType ?? "Pa test";
      map.set(label, (map.get(label) ?? 0) + 1);
      return map;
    }, new Map<string, number>())
  )
    .map(([label, count]) => ({ label, count, percent: totalReports ? Math.round((count / totalReports) * 100) : 0 }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const filteredRows = rows.filter(({ test, sample, project, reports, result, conductedDate }) => {
    const reportStatusMatch = reportStatus === "all"
      || (reportStatus === "No Report" ? reports.length === 0 : reports.some((report) => report.reportStatus === reportStatus));
    const haystack = [
      project?.projectName,
      sample?.sampleCode,
      sample?.sampleType,
      test.testCode,
      test.testType,
      reports.map((report) => report.reportNumber).join(" "),
      result.result
    ].filter(Boolean).join(" ").toLowerCase();

    return (
      (projectId === "all" || test.projectId === projectId) &&
      (testType === "all" || test.testType === testType) &&
      reportStatusMatch &&
      dateInRange(conductedDate, fromDate, toDate) &&
      (!search || haystack.includes(search.toLowerCase()))
    );
  });

  const waitingTests = rows.filter(({ test }) => waitingStatuses.includes(test.status)).length;
  const completedTests = rows.filter(({ test }) => ["Completed", "Report Drafted", "Pending Approval", "Approved", "Report Approved", "Rejected", "Issued", "Sent to Client"].includes(test.status)).length;
  const sentReports = clientReports.filter((report) => ["Sent to Client", "Issued"].includes(report.reportStatus)).length;

  function clearFilters() {
    setProjectId("all");
    setTestType("all");
    setReportStatus("all");
    setFromDate("");
    setToDate("");
    setSearch("");
  }

  if (!canSeeClients) {
    return <PageHeader title="Klienti" description="Kjo faqe është e kufizuar për role që kanë të drejtë të shohin identitetin e klientëve." />;
  }

  if (!client) {
    return <PageHeader title="Klienti nuk u gjet" description="Kodi i klientit nuk ekziston në regjistër." />;
  }

  return (
    <>
      <PageHeader
        title={`${client.clientCode} - ${client.clientName}`}
        description="Pasqyra e testeve, kampionëve dhe raporteve për këtë klient."
        action={<Link href="/clients" className="btn-secondary">Kthehu te klientët</Link>}
      />

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
            <Info label="Projekte" value={projects.length || "-"} />
          </div>
        </div>
        <div className="surface-card p-4">
          <h2 className="text-base font-semibold text-ink">Përqindja e raporteve sipas tipit të testit</h2>
          <div className="mt-4 space-y-3">
            {reportTypeBreakdown.length ? reportTypeBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-ink">{item.label}</span>
                  <span className="text-muted">{item.count} raporte · {item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-lab-mist">
                  <div className="h-2 rounded-full bg-lab-burgundy" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            )) : <div className="text-sm text-muted">Nuk ka ende raporte të gjeneruara për këtë klient.</div>}
          </div>
        </div>
      </section>

      <section className="surface-card mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label className="text-sm font-medium text-ink">
            Projekti
            <select value={projectId} onChange={(event) => setProjectId(event.target.value)} className="input mt-1">
              <option value="all">Të gjitha projektet</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Tipi i testit
            <select value={testType} onChange={(event) => setTestType(event.target.value)} className="input mt-1">
              <option value="all">Të gjitha testet</option>
              {testTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Statusi i raportit
            <select value={reportStatus} onChange={(event) => setReportStatus(event.target.value as ReportStatus | "No Report" | "all")} className="input mt-1">
              <option value="all">Të gjitha</option>
              {reportStatuses.map((status) => <option key={status} value={status}>{reportStatusLabels[status]}</option>)}
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
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
          <span><span className="font-semibold text-ink">{filteredRows.length}</span> rreshta nga <span className="font-semibold text-ink">{rows.length}</span> teste.</span>
          <button type="button" onClick={clearFilters} className="btn-secondary px-3 py-2">Pastro filtrat</button>
        </div>
      </section>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Projekti</th>
                <th className="px-4 py-3">Kampioni</th>
                <th className="px-4 py-3">Testi</th>
                <th className="px-4 py-3">Rezultati</th>
                <th className="px-4 py-3">Raportet</th>
                <th className="px-4 py-3">Statusi</th>
                <th className="px-4 py-3">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredRows.map(({ test, sample, project, reports, result, conductedDate }) => (
                <tr key={test.id} className="align-top hover:bg-lab-mist/60">
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
                      <StageCell lifecycle={testLifecycle(test, store.reports)} />
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
        {!filteredRows.length ? <div className="p-6 text-sm text-muted">Nuk u gjetën teste ose raporte për filtrat e zgjedhur.</div> : null}
      </div>
    </>
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
