"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useLabStore } from "@/lib/lab-store";
import type { ReportStatus } from "@/lib/types";

const reportStatusLabels: Record<Exclude<ReportStatus, "Draft">, string> = {
  "Report Drafted": "Raport i përgatitur",
  "Pending Approval": "Në pritje miratimi",
  Approved: "Miratuar",
  Rejected: "Refuzuar",
  Issued: "Lëshuar",
  "Sent to Client": "Dërguar Klientit"
};

export default function ReportsPage() {
  const store = useLabStore();
  const [search, setSearch] = useState("");
  const [clientId, setClientId] = useState("all");
  const [projectId, setProjectId] = useState("all");
  const [status, setStatus] = useState<ReportStatus | "all">("all");
  const [sampleType, setSampleType] = useState("all");
  const [testType, setTestType] = useState("all");
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [batchEmail, setBatchEmail] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const completedWithoutReport = store.tests.filter((test) => test.status === "Completed" && !store.reports.some((report) => report.testId === test.id));
  const reportRows = useMemo(() => store.reports.map((report) => {
    const sample = store.samples.find((item) => item.id === report.sampleId);
    const test = store.tests.find((item) => item.id === report.testId);
    const client = store.clients.find((item) => item.id === report.clientId);
    const project = store.projects.find((item) => item.id === report.projectId);
    return { report, sample, test, client, project };
  }), [store.reports, store.samples, store.tests, store.clients, store.projects]);
  const projectsForClient = clientId === "all" ? store.projects : store.projects.filter((project) => project.clientId === clientId);
  const sampleTypes = Array.from(new Set(store.samples.map((sample) => sample.sampleType))).sort();
  const testTypes = Array.from(new Set(store.tests.map((test) => test.testType))).sort();
  const filteredRows = reportRows.filter(({ report, sample, test, client, project }) => {
    const haystack = [report.reportNumber, sample?.sampleCode, sample?.sampleDescription, test?.testCode, test?.testType, client?.clientName, project?.projectName, report.specimenCodes.join(" ")]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return (
      (!search || haystack.includes(search.toLowerCase())) &&
      (clientId === "all" || report.clientId === clientId) &&
      (projectId === "all" || report.projectId === projectId) &&
      (status === "all" || report.reportStatus === status) &&
      (sampleType === "all" || sample?.sampleType === sampleType) &&
      (testType === "all" || test?.testType === testType)
    );
  });
  const selectedRows = filteredRows.filter(({ report }) => selectedReportIds.includes(report.id));
  const selectedClientIds = Array.from(new Set(selectedRows.map(({ report }) => report.clientId)));
  const selectedClient = selectedClientIds.length === 1 ? store.clients.find((client) => client.id === selectedClientIds[0]) : undefined;
  const selectedApprovedRows = selectedRows.filter(({ report }) => report.reportStatus === "Approved");
  const selectedHasOnlyApproved = selectedRows.length > 0 && selectedRows.every(({ report }) => report.reportStatus === "Approved");
  const selectedEmail = batchEmail.trim() || selectedClient?.email || "";
  const canSendSelected = selectedRows.length > 0 && selectedHasOnlyApproved && selectedClientIds.length === 1 && Boolean(selectedEmail);

  function toggleReport(reportId: string) {
    setSelectedReportIds((selected) => selected.includes(reportId) ? selected.filter((id) => id !== reportId) : [...selected, reportId]);
  }

  function toggleVisibleReports() {
    const visibleIds = filteredRows.map(({ report }) => report.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedReportIds.includes(id));
    setSelectedReportIds((selected) => allVisibleSelected ? selected.filter((id) => !visibleIds.includes(id)) : Array.from(new Set([...selected, ...visibleIds])));
  }

  function clearFilters() {
    setSearch("");
    setClientId("all");
    setProjectId("all");
    setStatus("all");
    setSampleType("all");
    setTestType("all");
  }

  function sendSelectedReports() {
    if (!canSendSelected) return;
    const reportIds = selectedApprovedRows.map(({ report }) => report.id);
    const reportNumbers = selectedApprovedRows.map(({ report }) => report.reportNumber);
    const reportLinks = selectedApprovedRows.map(({ report }) => `${window.location.origin}/reports/${report.id}`);
    const subject = `Raportet laboratorike SARP LAB - ${selectedClient?.clientCode ?? ""}`;
    const body = [
      "Pershendetje,",
      "",
      "Ju lutemi gjeni raportet laboratorike te miratuara:",
      ...reportNumbers.map((number, index) => `- ${number}: ${reportLinks[index]}`),
      "",
      "Me respekt,",
      "SARP LAB"
    ].join("\n");
    window.location.href = `mailto:${encodeURIComponent(selectedEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    store.sendReportsToClient(reportIds, selectedEmail, `Dërguar me email: ${reportNumbers.join(", ")}`);
    setSendMessage(`${reportNumbers.length} raport${reportNumbers.length === 1 ? "" : "e"} u shënuan si Dërguar Klientit për ${selectedEmail}.`);
    setSelectedReportIds([]);
  }

  return (
    <>
      <PageHeader title="Raportet" description="Filtro, zgjidh, mirato, shkarko dhe përgatit raporte në grup për dërgim te klienti." />
      {completedWithoutReport.length ? (
        <section className="mb-5 rounded-md border border-fuchsia-100 bg-fuchsia-50 p-4">
          <h2 className="text-sm font-semibold text-lab-purple">Raporte për përgatitje</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {completedWithoutReport.map((test) => (
              <Link key={test.id} href={`/tests/${test.id}`} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-lab-purple ring-1 ring-fuchsia-100 hover:bg-lab-mist">
                {test.testCode}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="surface-card mb-5 p-4">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label className="text-sm font-medium text-ink">
            Kërko
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input mt-1" placeholder="Raport, kampion, klient..." />
          </label>
          <label className="text-sm font-medium text-ink">
            Klienti
            <select value={clientId} onChange={(event) => { setClientId(event.target.value); setProjectId("all"); }} className="input mt-1">
              <option value="all">Të gjithë klientët</option>
              {store.clients.map((client) => <option key={client.id} value={client.id}>{client.clientName}</option>)}
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
            Statusi
            <select value={status} onChange={(event) => setStatus(event.target.value as ReportStatus | "all")} className="input mt-1">
              <option value="all">Të gjitha statuset</option>
              {Object.entries(reportStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Tipi i kampionit
            <select value={sampleType} onChange={(event) => setSampleType(event.target.value)} className="input mt-1">
              <option value="all">Të gjithë tipat e kampionëve</option>
              {sampleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Tipi i testit
            <select value={testType} onChange={(event) => setTestType(event.target.value)} className="input mt-1">
              <option value="all">Të gjithë tipat e testeve</option>
              {testTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm text-muted">
            Shfaqen <span className="font-semibold text-ink">{filteredRows.length}</span> nga <span className="font-semibold text-ink">{store.reports.length}</span> raporte. Të zgjedhura <span className="font-semibold text-ink">{selectedRows.length}</span>.
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={toggleVisibleReports} className="btn-secondary px-3 py-2">Zgjidh të dukshmet</button>
            <button type="button" onClick={() => setSelectedReportIds([])} className="btn-secondary px-3 py-2">Pastro zgjedhjen</button>
            <button type="button" onClick={clearFilters} className="btn-secondary px-3 py-2">Pastro filtrat</button>
          </div>
        </div>
        {selectedRows.length ? (
          <div className="mt-4 rounded-md border border-lab-steel bg-lab-mist p-3 text-sm text-ink">
            <div className="font-semibold">Zgjedhje për dërgim në grup</div>
            <div className="mt-1 text-muted">
              {selectedClient ? `Zgjidhni vetëm raporte me status Miratuar për t'i dërguar klientit ${selectedClient.clientName}.` : "Zgjidh raporte nga i njëjti klient për të përgatitur një grup të rregullt dërgimi."}
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto]">
              <input
                value={batchEmail}
                onChange={(event) => setBatchEmail(event.target.value)}
                placeholder={selectedClient?.email || "Email i klientit"}
                className="input bg-white"
              />
              <button
                type="button"
                onClick={sendSelectedReports}
                disabled={!canSendSelected}
                className="btn-primary px-4 py-2 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Dërgo te klienti
              </button>
            </div>
            {!selectedHasOnlyApproved ? <div className="mt-2 text-xs font-medium text-lab-red">Dërgimi lejohet vetëm pasi raportet të jenë Miratuar.</div> : null}
            {selectedClientIds.length > 1 ? <div className="mt-2 text-xs font-medium text-lab-red">Zgjidhni raporte nga një klient i vetëm për dërgim në grup.</div> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedRows.map(({ report }) => <Link key={report.id} href={`/reports/${report.id}`} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-lab-burgundy ring-1 ring-line">{report.reportNumber}</Link>)}
            </div>
          </div>
        ) : null}
        {sendMessage ? <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">{sendMessage}</div> : null}
      </section>
      <div className="surface-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={filteredRows.length > 0 && filteredRows.every(({ report }) => selectedReportIds.includes(report.id))} onChange={toggleVisibleReports} aria-label="Zgjidh raportet e dukshme" />
              </th>
              <th className="px-4 py-3">Numri i raportit</th>
              <th className="px-4 py-3">Pjesa</th>
              <th className="px-4 py-3">Kampioni</th>
              <th className="px-4 py-3">Testi</th>
              <th className="px-4 py-3">Mostrat</th>
              <th className="px-4 py-3">Klienti</th>
              <th className="px-4 py-3">Projekti</th>
              <th className="px-4 py-3">Statusi</th>
              <th className="px-4 py-3">Veprime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredRows.map(({ report, sample, test, client, project }) => (
              <tr key={report.id} className="hover:bg-lab-mist/60">
                <td className="px-4 py-3">
                  <input type="checkbox" checked={selectedReportIds.includes(report.id)} onChange={() => toggleReport(report.id)} aria-label={`Zgjidh ${report.reportNumber}`} />
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{report.reportNumber}</td>
                <td className="px-4 py-3">{report.reportSequence} / {report.totalReports}</td>
                <td className="px-4 py-3">{sample?.sampleCode}</td>
                <td className="px-4 py-3">{test?.testType}</td>
                <td className="px-4 py-3">{report.specimenCodes.join(", ")}</td>
                <td className="px-4 py-3">{client?.clientName}</td>
                <td className="px-4 py-3">{project?.projectName}</td>
                <td className="px-4 py-3"><StatusBadge status={report.reportStatus} /></td>
                <td className="px-4 py-3"><Link href={`/reports/${report.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">Hap</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!store.reports.length ? <div className="p-6 text-sm text-muted">Nuk ka ende raporte të përgatitura. Përfundoni një test dhe më pas gjeneroni raportin.</div> : null}
        {store.reports.length > 0 && !filteredRows.length ? <div className="p-6 text-sm text-muted">Asnjë raport nuk përputhet me filtrat e zgjedhur.</div> : null}
      </div>
    </>
  );
}
