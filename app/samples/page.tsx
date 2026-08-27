"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SortableTh, sortRows, useSort } from "@/components/ui/sortable-header";
import { DEFAULT_PAGE_SIZE, Pagination, paginate, useTablePage } from "@/components/ui/pagination";
import { DateRangeField, FilterChips, FilterField, useParamState } from "@/components/ui/filter-bar";
import type { FilterChip } from "@/components/ui/filter-bar";
import { formatEuropeanDate } from "@/lib/date-format";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { buildLabIndex, NO_REPORTS, NO_TESTS } from "@/lib/lab-index";
import { isApproaching, isOverdue } from "@/lib/status";
import { canDeleteSamples, canViewClientIdentity } from "@/lib/permissions";
import { deriveSampleStageFrom, reportLifecycle, SAMPLE_STAGES, sampleStageIndex } from "@/lib/sample-stage";
import type { LabTest, Report, Sample, SampleStatus, TestStatus } from "@/lib/types";

const TESTING_COMPLETE_STAGES: SampleStatus[] = ["Tested", "In Reporting", "Report Issued", "Delivered"];

const FINISHED_TEST_STATUSES: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Report Approved", "Issued", "Sent to Client"];

const ACTIVE_TEST_STATUSES: TestStatus[] = ["Pending", "Scheduled", "In Progress"];

/** How far back the register looks by default. Anything still open is always
 *  shown, however old; only finished-and-delivered work ages out. */
const RECENT_WINDOW_DAYS = 90;

/** Sentinel for "assigned to nobody" in the technician filter. */
const UNASSIGNED = "none";

/** Everything a single register row needs, resolved once. Building this up
 *  front - instead of re-deriving inside the sort comparator and again inside
 *  the row - is what keeps the register flat as the sample count grows. */
type SampleRow = {
  sample: Sample;
  tests: LabTest[];
  nextTest: LabTest | undefined;
  report: Report | undefined;
  stage: SampleStatus;
  clientCode: string;
  projectName: string;
  technicianId: string;
  technicianName: string;
  requiredDate: string;
  reportDue: string;
  late: boolean;
  risk: boolean;
  /** Pre-lowercased search target, so typing does not rebuild it per row. */
  haystack: string;
};

export default function SamplesPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const { sort, toggle } = useSort("number");

  // Every filter is seeded from the query string, so a filtered register can be
  // linked, bookmarked and reloaded. `useTablePage` writes them all back.
  const [query, setQuery] = useParamState("q", "");
  const [windowMode, setWindowMode] = useParamState("window", "recent");
  const [status, setStatus] = useParamState("status");
  const [sampleType, setSampleType] = useParamState("type");
  const [technician, setTechnician] = useParamState("tech");
  const [clientId, setClientId] = useParamState("client");
  const [receivedFrom, setReceivedFrom] = useParamState("from", "");
  const [receivedTo, setReceivedTo] = useParamState("to", "");
  const [dueFrom, setDueFrom] = useParamState("dueFrom", "");
  const [dueTo, setDueTo] = useParamState("dueTo", "");
  const [overdue, setOverdue] = useParamState("overdue", "");
  const overdueOnly = overdue === "1";

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);
  const canDelete = canDeleteSamples(currentUser?.role);

  function deleteSample(sampleId: string) {
    const sample = store.samples.find((item) => item.id === sampleId);
    if (!sample) return;
    const linkedTests = store.tests.filter((test) => test.sampleId === sampleId).length;
    const linkedReports = store.reports.filter((report) => report.sampleId === sampleId).length;
    const confirmed = window.confirm(
      `Të fshihet kampioni ${sample.sampleCode}? Do të fshihen edhe ${linkedTests} teste dhe ${linkedReports} raporte të lidhura. Ky veprim përdoret vetëm për provat/testimet fillestare.`
    );
    if (!confirmed) return;
    store.removeSample(sampleId);
  }

  function clearAllFilters() {
    setQuery("");
    setWindowMode("recent");
    setStatus("all");
    setSampleType("all");
    setTechnician("all");
    setClientId("all");
    setReceivedFrom("");
    setReceivedTo("");
    setDueFrom("");
    setDueTo("");
    setOverdue("");
  }

  const index = useMemo(
    () => buildLabIndex(store),
    [store.samples, store.tests, store.reports, store.clients, store.projects, store.users]
  );

  const allRows = useMemo<SampleRow[]>(
    () =>
      store.samples.map((sample) => {
        const tests = index.testsBySample.get(sample.id) ?? NO_TESTS;
        const nextTest = tests.find((item) => ACTIVE_TEST_STATUSES.includes(item.status)) ?? tests[0];
        const report = (index.reportsBySample.get(sample.id) ?? NO_REPORTS)[0];
        const stage = deriveSampleStageFrom(tests, index.reportsByTest);
        const clientCode = index.clientById.get(sample.clientId)?.clientCode ?? "";
        // Restricted users neither see nor search nor sort by project name.
        const projectName = showClientIdentity ? index.projectById.get(sample.projectId)?.projectName ?? "" : "";
        const technicianId = nextTest?.assignedTechnician ?? sample.assignedTechnician ?? "";
        const technicianName = index.userById.get(technicianId)?.fullName ?? "";

        // Overdue overlay (same rule as the Tests page): late = an unfinished
        // test past its deadline; at-risk = due within 3 days.
        const sampleDone = TESTING_COMPLETE_STAGES.includes(stage);
        const activeTests = tests.filter((item) => !FINISHED_TEST_STATUSES.includes(item.status));
        const late =
          !sampleDone &&
          (activeTests.length
            ? activeTests.some((item) => isOverdue(item.requiredTestDate, item.status))
            : isOverdue(sample.requiredTestDate, "Pending"));
        const risk =
          !sampleDone &&
          !late &&
          (activeTests.length
            ? activeTests.some((item) => isApproaching(item.requiredTestDate))
            : isApproaching(sample.requiredTestDate));

        return {
          sample,
          tests,
          nextTest,
          report,
          stage,
          clientCode,
          projectName,
          technicianId,
          technicianName,
          requiredDate: nextTest?.requiredTestDate ?? sample.requiredTestDate,
          reportDue: nextTest?.dueDate ?? sample.reportDueDate,
          late,
          risk,
          haystack: `${sample.sampleCode} ${clientCode} ${projectName} ${sample.sampleType}`.toLowerCase()
        };
      }),
    [index, store.samples, showClientIdentity]
  );

  const windowStart = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - RECENT_WINDOW_DAYS);
    return start.toISOString().slice(0, 10);
  }, []);

  const sampleTypeOptions = useMemo(
    () => Array.from(new Set(store.samples.map((sample) => sample.sampleType))).filter(Boolean).sort(),
    [store.samples]
  );
  const technicianOptions = useMemo(
    () => store.users.filter((user) => user.isActive).slice().sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [store.users]
  );
  const clientOptions = useMemo(
    () => store.clients.slice().sort((a, b) => a.clientCode.localeCompare(b.clientCode, undefined, { numeric: true })),
    [store.clients]
  );

  const rows = useMemo(() => {
    // Nobody opens the register wanting all history. Open work stays visible
    // whatever its age; delivered work drops out once it is past the window.
    const windowed = windowMode === "all"
      ? allRows
      : allRows.filter((row) => row.stage !== "Delivered" || row.sample.dateReceived >= windowStart);

    const needle = query.trim().toLowerCase();
    const filtered = windowed.filter((row) =>
      (!needle || row.haystack.includes(needle)) &&
      (status === "all" || row.stage === status) &&
      (sampleType === "all" || row.sample.sampleType === sampleType) &&
      (technician === "all" || (technician === UNASSIGNED ? !row.technicianId : row.technicianId === technician)) &&
      (clientId === "all" || row.sample.clientId === clientId) &&
      (!receivedFrom || row.sample.dateReceived >= receivedFrom) &&
      (!receivedTo || row.sample.dateReceived <= receivedTo) &&
      (!dueFrom || (!!row.reportDue && row.reportDue >= dueFrom)) &&
      (!dueTo || (!!row.reportDue && row.reportDue <= dueTo)) &&
      (!overdueOnly || row.late)
    );

    const valueFor = (row: SampleRow) => {
      switch (sort.key) {
        case "date": return row.sample.dateReceived;
        case "client": return row.clientCode;
        case "project": return row.projectName;
        case "type": return row.sample.sampleType;
        case "qty": return row.sample.quantity;
        case "requested": return row.sample.requestedTestType;
        case "required": return row.requiredDate;
        case "reportDue": return row.reportDue;
        case "status": return sampleStageIndex(row.stage);
        case "technician": return row.technicianName;
        case "reportStatus": return row.report?.reportStatus ?? "";
        default: return row.sample.sampleCode;
      }
    };

    // Sort the whole filtered set, never the visible page.
    return sortRows(filtered, valueFor, sort);
  }, [allRows, query, windowMode, windowStart, status, sampleType, technician, clientId, receivedFrom, receivedTo, dueFrom, dueTo, overdueOnly, sort]);

  // What the user is looking at, as one removable list.
  const chips: FilterChip[] = [];
  if (windowMode !== "all") chips.push({ key: "window", label: t("table.recentWindow"), onRemove: () => setWindowMode("all") });
  if (query.trim()) chips.push({ key: "q", label: `${t("filters.search")}: “${query.trim()}”`, onRemove: () => setQuery("") });
  if (status !== "all") chips.push({ key: "status", label: `${t("filters.status")}: ${t(`status.${status}` as "status.Registered")}`, onRemove: () => setStatus("all") });
  if (sampleType !== "all") chips.push({ key: "type", label: `${t("filters.sampleType")}: ${sampleType}`, onRemove: () => setSampleType("all") });
  if (technician !== "all") {
    const name = technician === UNASSIGNED ? t("filters.unassigned") : store.users.find((user) => user.id === technician)?.fullName ?? technician;
    chips.push({ key: "tech", label: `${t("filters.technician")}: ${name}`, onRemove: () => setTechnician("all") });
  }
  if (clientId !== "all") {
    const client = store.clients.find((item) => item.id === clientId);
    chips.push({ key: "client", label: `${t("filters.client")}: ${client?.clientCode ?? clientId}`, onRemove: () => setClientId("all") });
  }
  if (receivedFrom || receivedTo) {
    const range = `${receivedFrom ? formatEuropeanDate(receivedFrom) : "…"} – ${receivedTo ? formatEuropeanDate(receivedTo) : "…"}`;
    chips.push({ key: "received", label: `${t("filters.dateReceived")}: ${range}`, onRemove: () => { setReceivedFrom(""); setReceivedTo(""); } });
  }
  if (dueFrom || dueTo) {
    const range = `${dueFrom ? formatEuropeanDate(dueFrom) : "…"} – ${dueTo ? formatEuropeanDate(dueTo) : "…"}`;
    chips.push({ key: "due", label: `${t("filters.reportDue")}: ${range}`, onRemove: () => { setDueFrom(""); setDueTo(""); } });
  }
  if (overdueOnly) chips.push({ key: "overdue", label: t("filters.overdue"), onRemove: () => setOverdue("") });

  // Only non-default values reach the URL, so a clean view has a clean address.
  const urlParams = {
    q: query.trim(),
    window: windowMode === "recent" ? "" : "all",
    status: status === "all" ? "" : status,
    type: sampleType === "all" ? "" : sampleType,
    tech: technician === "all" ? "" : technician,
    client: clientId === "all" ? "" : clientId,
    from: receivedFrom,
    to: receivedTo,
    dueFrom,
    dueTo,
    overdue: overdueOnly ? "1" : ""
  };

  const { page, pageCount, pageSize, from, to, setPage } = useTablePage(rows.length, DEFAULT_PAGE_SIZE, urlParams);
  const pageRows = paginate(rows, page, pageSize);

  return (
    <>
      <PageHeader
        title={t("samples.title")}
        description={t("samples.description")}
        action={<Link href="/samples/new" className="btn-primary">{t("samples.new")}</Link>}
      />

      <section className="surface-card no-print mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <FilterField label={t("filters.search")}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("samples.search")}
              className="input mt-1"
            />
          </FilterField>
        </div>

        <FilterField label={t("filters.status")}>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input mt-1">
            <option value="all">{t("filters.all")}</option>
            {SAMPLE_STAGES.map((stage) => (
              <option key={stage} value={stage}>{t(`status.${stage}` as "status.Registered")}</option>
            ))}
          </select>
        </FilterField>

        <FilterField label={t("filters.sampleType")}>
          <select value={sampleType} onChange={(event) => setSampleType(event.target.value)} className="input mt-1">
            <option value="all">{t("filters.all")}</option>
            {sampleTypeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </FilterField>

        <FilterField label={t("filters.technician")}>
          <select value={technician} onChange={(event) => setTechnician(event.target.value)} className="input mt-1">
            <option value="all">{t("filters.all")}</option>
            <option value={UNASSIGNED}>{t("filters.unassigned")}</option>
            {technicianOptions.map((user) => <option key={user.id} value={user.id}>{user.fullName}</option>)}
          </select>
        </FilterField>

        <FilterField label={t("filters.client")}>
          <select value={clientId} onChange={(event) => setClientId(event.target.value)} className="input mt-1">
            <option value="all">{t("filters.all")}</option>
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>
                {showClientIdentity ? `${client.clientCode} — ${client.clientName}` : client.clientCode}
              </option>
            ))}
          </select>
        </FilterField>

        <div className="sm:col-span-2">
          <DateRangeField
            label={t("filters.dateReceived")}
            from={receivedFrom}
            to={receivedTo}
            onFrom={setReceivedFrom}
            onTo={setReceivedTo}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <DateRangeField
            label={t("filters.reportDue")}
            from={dueFrom}
            to={dueTo}
            onFrom={setDueFrom}
            onTo={setDueTo}
          />
        </div>

        <label className="flex items-end text-sm font-medium text-ink">
          <span className="mt-1 inline-flex w-full items-center gap-2 rounded-md border border-line bg-white px-3 py-2 transition hover:border-lab-burgundy">
            <input
              type="checkbox"
              checked={overdueOnly}
              onChange={(event) => setOverdue(event.target.checked ? "1" : "")}
              className="h-4 w-4 accent-lab-burgundy"
            />
            {t("filters.overdueOnly")}
          </span>
        </label>
      </section>

      <FilterChips chips={chips} resultCount={rows.length} onClearAll={clearAllFilters} />

      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-ink">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-[#ff3d3d] bg-brand-late" /> Vonuar / Late</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-[#f0a93a] bg-brand-risk" /> Në rrezik / At risk</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-line bg-white" /> Në kohë / On time</span>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <SortableTh label={t("samples.sampleCode")} sortKey="number" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.dateReceived")} sortKey="date" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.clientCode")} sortKey="client" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.project")} sortKey="project" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.sampleType")} sortKey="type" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.qty")} sortKey="qty" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.requestedTest")} sortKey="requested" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.requiredDate")} sortKey="required" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.reportDue")} sortKey="reportDue" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.status")} sortKey="status" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.assignedTechnician")} sortKey="technician" sort={sort} onToggle={toggle} />
                <SortableTh label={t("samples.reportStatus")} sortKey="reportStatus" sort={sort} onToggle={toggle} />
                <th className="px-4 py-3 font-semibold">{t("samples.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-center text-sm text-muted">
                    <div>{t("table.noRows")}</div>
                    {chips.length > 0 ? (
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        className="mt-2 font-semibold text-lab-burgundy hover:underline"
                      >
                        {t("filters.clearAll")}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ) : null}
              {pageRows.map((row) => {
                const { sample, tests, nextTest, report, stage } = row;
                const schedule = tests
                  .map((item) => `${item.scheduledAgeDays}d: ${item.cubeCount} mostra (${formatEuropeanDate(item.requiredTestDate)})`)
                  .join("; ") || sample.testSchedules?.map((item) => `${item.ageDays || "-"}d: ${item.cubeCount} mostra (${formatEuropeanDate(item.requiredTestDate)})`).join("; ");
                const rowClass = row.late ? "bg-brand-late hover:bg-[#ff3d3d]" : row.risk ? "bg-brand-risk hover:bg-[#f5ad3d]" : "hover:bg-lab-mist/60";
                return (
                  <tr key={sample.id} className={`transition-colors ${rowClass}`}>
                    <td className="px-4 py-3 font-semibold text-ink">{sample.sampleCode}</td>
                    <td className="px-4 py-3">{formatEuropeanDate(sample.dateReceived)}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{row.clientCode || "Në pritje"}</td>
                    <td className="px-4 py-3">{showClientIdentity ? row.projectName || "Në pritje caktimi" : "I kufizuar"}</td>
                    <td className="px-4 py-3">
                      {sample.sampleType}
                      {sample.sampleGroupId ? (
                        <span title="Pjesë e një dorëzimi me disa materiale" className="ml-1.5 inline-flex items-center rounded-full border border-line bg-lab-mist px-1.5 py-0.5 text-[10px] font-semibold text-muted">
                          grup
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3" title={schedule}>{sample.quantity}</td>
                    <td className="px-4 py-3">{sample.requestedTestType}</td>
                    <td className="px-4 py-3">{formatEuropeanDate(row.requiredDate)}</td>
                    <td className="px-4 py-3">{formatEuropeanDate(row.reportDue)}</td>
                    <td className="px-4 py-3"><StatusBadge status={stage} /></td>
                    <td className="px-4 py-3">{row.technicianName || "-"}</td>
                    <td className="px-4 py-3">{report ? <StatusBadge status={reportLifecycle(report).stage} /> : "-"}</td>
                    <td className="px-3 py-2">
                      <div className="flex w-28 flex-col gap-1.5">
                        <Link href={`/samples/${sample.id}`} className="rounded-md border border-line bg-lab-mist px-2 py-1 text-center text-[11px] font-semibold leading-tight text-lab-navy hover:border-lab-steel">
                          {t("samples.viewSample")}
                        </Link>
                        {nextTest ? (
                          <Link href={`/tests/${nextTest.id}`} className="rounded-md border border-fuchsia-100 bg-fuchsia-50 px-2 py-1 text-center text-[11px] font-semibold leading-tight text-lab-purple hover:bg-fuchsia-100">
                            Nis testin
                          </Link>
                        ) : null}
                        {report ? (
                          <Link href={`/reports/${report.id}`} className="rounded-md border border-green-100 bg-green-50 px-2 py-1 text-center text-[11px] font-semibold leading-tight text-lab-green hover:bg-green-100">
                            {t("samples.report")}
                          </Link>
                        ) : null}
                        {canDelete ? (
                          <button
                            type="button"
                            onClick={() => deleteSample(sample.id)}
                            className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-center text-[11px] font-semibold leading-tight text-lab-red hover:bg-red-100"
                          >
                            Fshi
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          pageCount={pageCount}
          from={from}
          to={to}
          total={rows.length}
          unfilteredTotal={store.samples.length}
          onPage={setPage}
        />
      </div>
    </>
  );
}
