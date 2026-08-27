"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StageCell } from "@/components/ui/stage-cell";
import { SortableTh, sortRows, useSort } from "@/components/ui/sortable-header";
import { DEFAULT_PAGE_SIZE, Pagination, paginate, useTablePage } from "@/components/ui/pagination";
import { useParamState } from "@/components/ui/filter-bar";
import { SavedViews } from "@/components/ui/saved-views";
import { useLabStore } from "@/lib/lab-store";
import { canSendReportsToClient } from "@/lib/permissions";
import { reportLifecycle, sampleStageIndex } from "@/lib/sample-stage";
import type { ReportStatus } from "@/lib/types";

const reportStatusLabels: Record<Exclude<ReportStatus, "Draft">, string> = {
  "Report Drafted": "Raport i përgatitur",
  "Pending Approval": "Në pritje miratimi",
  Approved: "Miratuar",
  Rejected: "Refuzuar",
  Issued: "Raporti i lëshuar",
  "Sent to Client": "Dërguar klientit"
};

/**
 * Frozen panes. This register pins two columns rather than one - the selection
 * checkbox and the report number - so the second needs an explicit left offset,
 * which means the first needs a fixed width to offset against. w-12 (48px)
 * matches its natural width: px-4 either side plus the checkbox.
 */
const STICKY_HEAD = "sticky top-0 z-20 bg-white";
const STICKY_CHECKBOX_HEAD = "sticky left-0 top-0 z-30 w-12 min-w-[48px] bg-white";
const STICKY_NUMBER_HEAD = "sticky left-12 top-0 z-30 bg-white";
const STICKY_CHECKBOX_CELL = "sticky left-0 z-10 w-12 min-w-[48px] bg-white";
const STICKY_NUMBER_CELL = "sticky left-12 z-10 bg-white";

export default function ReportsPage() {
  const store = useLabStore();
  // Seeded from the query string, like the other registers, so a filtered view
  // can be linked and so the page resets when the filters change.
  const [search, setSearch] = useParamState("q", "");
  const [clientId, setClientId] = useParamState("client");
  const [projectId, setProjectId] = useParamState("project");
  const [status, setStatus] = useParamState("status");
  const [sampleType, setSampleType] = useParamState("type");
  const [testType, setTestType] = useParamState("test");
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const { sort, toggle } = useSort("number");
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
    const haystack = [report.reportNumber, sample?.sampleCode, sample?.sampleDescription, test?.testCode, test?.testType, client?.clientName, project?.projectName, (report.specimenCodes ?? []).join(" ")]
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
  const sortedRows = sortRows(filteredRows, ({ report, sample, test, client, project }) => {
    switch (sort.key) {
      case "sequence": return report.reportSequence;
      case "sample": return sample?.sampleCode;
      case "test": return test?.testType;
      case "specimens": return (report.specimenCodes ?? []).join(", ");
      case "client": return client?.clientName;
      case "project": return project?.projectName;
      case "status": return sampleStageIndex(reportLifecycle(report).stage);
      default: return report.reportNumber;
    }
  }, sort);
  const selectedRows = filteredRows.filter(({ report }) => selectedReportIds.includes(report.id));
  const selectedClientIds = Array.from(new Set(selectedRows.map(({ report }) => report.clientId)));
  const selectedClient = selectedClientIds.length === 1 ? store.clients.find((client) => client.id === selectedClientIds[0]) : undefined;
  const selectedApprovedRows = selectedRows.filter(({ report }) => report.reportStatus === "Approved");
  const selectedHasOnlyApproved = selectedRows.length > 0 && selectedRows.every(({ report }) => report.reportStatus === "Approved");
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canSend = canSendReportsToClient(currentUser?.email);
  // The client record is the source of truth for where reports go. A typed
  // one-off address cannot stand in for a missing one, or the gap never closes.
  const selectedClientHasEmail = Boolean(selectedClient?.email);
  const selectedEmail = selectedClientHasEmail ? batchEmail.trim() || selectedClient?.email || "" : "";
  // A report with no stored PDF has nothing to give the client, so flag it
  // rather than sending a link to a file that was never generated.
  const selectedWithoutPdf = selectedApprovedRows.filter(({ report }) => !report.pdfUrl);
  const clientHasNoEmailOnRecord = selectedClientIds.length === 1 && !selectedClient?.email;
  const canSendSelected =
    canSend &&
    selectedRows.length > 0 &&
    selectedHasOnlyApproved &&
    selectedClientIds.length === 1 &&
    Boolean(selectedEmail) &&
    selectedWithoutPdf.length === 0;

  // Only non-default values reach the URL, and any change here sends the table
  // back to page 1.
  const urlParams = {
    q: search.trim(),
    client: clientId === "all" ? "" : clientId,
    project: projectId === "all" ? "" : projectId,
    status: status === "all" ? "" : status,
    type: sampleType === "all" ? "" : sampleType,
    test: testType === "all" ? "" : testType
  };
  const { page, pageCount, pageSize, from, to, setPage } = useTablePage(sortedRows.length, DEFAULT_PAGE_SIZE, urlParams);
  const pageRows = paginate(sortedRows, page, pageSize);

  function toggleReport(reportId: string) {
    setSelectedReportIds((selected) => selected.includes(reportId) ? selected.filter((id) => id !== reportId) : [...selected, reportId]);
  }

  /**
   * Selects every row matching the current filters, not just the page on
   * screen. Batch send acts on the selection, so "all" has to mean all of what
   * the filters describe - otherwise paging would silently change what a client
   * receives.
   */
  function toggleAllFilteredReports() {
    const filteredIds = filteredRows.map(({ report }) => report.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedReportIds.includes(id));
    setSelectedReportIds((selected) =>
      allSelected ? selected.filter((id) => !filteredIds.includes(id)) : Array.from(new Set([...selected, ...filteredIds]))
    );
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
    // The stored PDF's signed URL, not `${origin}/reports/${id}`. The latter is
    // a page inside this app behind a login, so every client who ever received
    // one got a link they could not open. The signed URL downloads the actual
    // PDF. Attachments proper need Microsoft Graph - mailto: cannot carry files.
    const reportLinks = selectedApprovedRows.map(({ report }) => report.pdfUrl ?? "");
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
    setSendMessage(`${reportNumbers.length} raport${reportNumbers.length === 1 ? "" : "e"} u shënuan si Dërguar klientit për ${selectedEmail}.`);
    setSelectedReportIds([]);
  }

  return (
    <>
      <PageHeader title="Raportet" description="Filtro, zgjidh, mirato, shkarko dhe përgatit raporte në grup për dërgim te klienti." />
      <SavedViews
        basePath="/reports"
        views={[
          { key: "all", label: "Të gjitha", params: {} },
          { key: "approval", label: "Pret miratim", params: { status: "Pending Approval" } },
          { key: "rejected", label: "Refuzuar", params: { status: "Rejected" } },
          { key: "ready", label: "Miratuar, pa dërguar", params: { status: "Approved" } },
          { key: "sent", label: "Dërguar klientit", params: { status: "Sent to Client" } }
        ]}
      />
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
            <button type="button" onClick={toggleAllFilteredReports} className="btn-secondary px-3 py-2">Zgjidh të gjitha të filtruarat</button>
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
            {clientHasNoEmailOnRecord ? (
              <div className="mt-2 rounded-md border border-[#ff3d3d] bg-brand-late p-3 text-xs text-ink">
                <div className="font-semibold">Klienti nuk ka email të regjistruar</div>
                <p className="mt-1">Raportet dërgohen te adresa e ruajtur në kartelën e klientit. Shtojeni një herë dhe përdoret çdo herë tjetër.</p>
                {selectedClient ? (
                  <Link href={`/clients/${selectedClient.id}`} className="mt-2 inline-block font-semibold text-lab-burgundy hover:underline">
                    Shto email për {selectedClient.clientCode}
                  </Link>
                ) : null}
              </div>
            ) : null}
            {selectedWithoutPdf.length ? (
              <div className="mt-2 text-xs font-medium text-lab-red">
                {selectedWithoutPdf.length} raport{selectedWithoutPdf.length === 1 ? "" : "e"} pa PDF të ruajtur
                ({selectedWithoutPdf.map(({ report }) => report.reportNumber).join(", ")}).
                Gjeneroni PDF-në përpara dërgimit.
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedRows.map(({ report }) => <Link key={report.id} href={`/reports/${report.id}`} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-lab-burgundy ring-1 ring-line">{report.reportNumber}</Link>)}
            </div>
          </div>
        ) : null}
        {sendMessage ? <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">{sendMessage}</div> : null}
      </section>
      <div className="surface-card overflow-hidden">
        {/* Scrolls inside itself so the header row, the selection checkbox and
            the report number stay put while the rest scrolls under them. */}
        <div className="register-scroll max-h-[70vh] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className={`${STICKY_CHECKBOX_HEAD} px-4 py-3`}>
                <input type="checkbox" disabled={!canSend} checked={filteredRows.length > 0 && filteredRows.every(({ report }) => selectedReportIds.includes(report.id))} onChange={toggleAllFilteredReports} aria-label="Zgjidh të gjitha raportet e filtruara" />
              </th>
              <SortableTh label="Numri i raportit" sortKey="number" sort={sort} onToggle={toggle} className={`${STICKY_NUMBER_HEAD} px-4 py-3`} />
              <SortableTh label="Pjesa" sortKey="sequence" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <SortableTh label="Kampioni" sortKey="sample" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <SortableTh label="Testi" sortKey="test" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <SortableTh label="Mostrat" sortKey="specimens" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <SortableTh label="Klienti" sortKey="client" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <SortableTh label="Projekti" sortKey="project" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <SortableTh label="Statusi" sortKey="status" sort={sort} onToggle={toggle} className={`${STICKY_HEAD} px-4 py-3`} />
              <th className={`${STICKY_HEAD} px-4 py-3`}>Veprime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pageRows.map(({ report, sample, test, client, project }) => (
              <tr key={report.id} className="bg-white hover:bg-lab-mist/60">
                <td className={`${STICKY_CHECKBOX_CELL} px-4 py-3`}>
                  <input type="checkbox" disabled={!canSend} checked={selectedReportIds.includes(report.id)} onChange={() => toggleReport(report.id)} aria-label={`Zgjidh ${report.reportNumber}`} />
                </td>
                <td className={`${STICKY_NUMBER_CELL} px-4 py-3 font-semibold text-ink`}>{report.reportNumber}</td>
                <td className="px-4 py-3">{report.reportSequence} / {report.totalReports}</td>
                <td className="px-4 py-3">{sample?.sampleCode}</td>
                <td className="px-4 py-3">{test?.testType}</td>
                {/* Guarded: specimenCodes arrives from the app_state JSON with
                    no schema behind it, and one report missing the field used
                    to throw and white-screen the entire register. */}
                <td className="px-4 py-3">{(report.specimenCodes ?? []).join(", ")}</td>
                <td className="px-4 py-3">{client?.clientName}</td>
                <td className="px-4 py-3">{project?.projectName}</td>
                <td className="px-4 py-3"><StageCell lifecycle={reportLifecycle(report)} /></td>
                <td className="px-4 py-3"><Link href={`/reports/${report.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">Hap</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <Pagination
          page={page}
          pageCount={pageCount}
          from={from}
          to={to}
          total={sortedRows.length}
          unfilteredTotal={store.reports.length}
          onPage={setPage}
        />
        {!store.reports.length ? <div className="p-6 text-sm text-muted">Nuk ka ende raporte të përgatitura. Përfundoni një test dhe më pas gjeneroni raportin.</div> : null}
        {store.reports.length > 0 && !filteredRows.length ? <div className="p-6 text-sm text-muted">Asnjë raport nuk përputhet me filtrat e zgjedhur.</div> : null}
      </div>
    </>
  );
}
