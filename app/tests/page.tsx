"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { StageCell } from "@/components/ui/stage-cell";
import { SortableTh, sortRows, useSort } from "@/components/ui/sortable-header";
import { DEFAULT_PAGE_SIZE, Pagination, paginate, useTablePage } from "@/components/ui/pagination";
import { DateRangeField, FilterChips, FilterField, useParamState } from "@/components/ui/filter-bar";
import type { FilterChip } from "@/components/ui/filter-bar";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { buildLabIndex, NO_REPORTS } from "@/lib/lab-index";
import { formatEuropeanDate } from "@/lib/date-format";
import { isApproaching, isOverdue } from "@/lib/status";
import { canViewClientIdentity } from "@/lib/permissions";
import { sampleStageIndex, testLifecycleFrom } from "@/lib/sample-stage";
import type { Lifecycle } from "@/lib/sample-stage";
import type { LabTest, Sample, TestStatus } from "@/lib/types";

const DONE_STATUSES: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Report Approved", "Issued", "Sent to Client"];

/** Statuses offered in the filter. "Delayed" is deliberately absent: no code
 *  path ever assigns it, so offering it would be a filter that always returns
 *  nothing. Lateness is derived from the due date - use the overdue toggle. */
const FILTERABLE_STATUSES: TestStatus[] = [
  "Pending",
  "Scheduled",
  "In Progress",
  "Completed",
  "Pending Technical Review",
  "Report Drafted",
  "Pending Approval",
  "Approved",
  "Report Approved",
  "Rejected",
  "Issued",
  "Sent to Client"
];

/** How far back the register looks by default. Anything still open is always
 *  shown, however old; only delivered work ages out. */
const RECENT_WINDOW_DAYS = 90;

const UNASSIGNED = "none";

type TestRow = {
  test: LabTest;
  sample: Sample | undefined;
  technicianName: string;
  technicianId: string;
  late: boolean;
  risk: boolean;
  number: string;
  clientLabel: string;
  projectLabel: string;
  sampleType: string;
  lifecycle: Lifecycle;
  haystack: string;
};

export default function TestsPage() {
  const store = useLabStore();
  const router = useRouter();
  const { t } = useI18n();
  const { sort, toggle } = useSort("number");
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);

  const [query, setQuery] = useParamState("q", "");
  const [windowMode, setWindowMode] = useParamState("window", "recent");
  const [status, setStatus] = useParamState("status");
  const [testType, setTestType] = useParamState("test");
  const [sampleType, setSampleType] = useParamState("type");
  const [technician, setTechnician] = useParamState("tech");
  const [clientId, setClientId] = useParamState("client");
  const [requiredFrom, setRequiredFrom] = useParamState("from", "");
  const [requiredTo, setRequiredTo] = useParamState("to", "");
  const [dueFrom, setDueFrom] = useParamState("dueFrom", "");
  const [dueTo, setDueTo] = useParamState("dueTo", "");
  const [overdue, setOverdue] = useParamState("overdue", "");
  const overdueOnly = overdue === "1";

  function clearAllFilters() {
    setQuery("");
    setWindowMode("recent");
    setStatus("all");
    setTestType("all");
    setSampleType("all");
    setTechnician("all");
    setClientId("all");
    setRequiredFrom("");
    setRequiredTo("");
    setDueFrom("");
    setDueTo("");
    setOverdue("");
  }

  const index = useMemo(
    () => buildLabIndex(store),
    [store.samples, store.tests, store.reports, store.clients, store.projects, store.users]
  );

  const allRows = useMemo<TestRow[]>(
    () =>
      store.tests.map((test) => {
        const sample = index.sampleById.get(test.sampleId);
        const client = index.clientById.get(test.clientId);
        const project = index.projectById.get(test.projectId);
        const technicianName = index.userById.get(test.assignedTechnician ?? "")?.fullName ?? "";
        const late = isOverdue(test.requiredTestDate, test.status);
        const done = DONE_STATUSES.includes(test.status);
        const risk = !late && !done && isApproaching(test.requiredTestDate);
        const number = sample?.sampleCode ?? test.testCode;
        const clientLabel = showClientIdentity ? client?.clientName ?? "-" : client?.clientCode ?? "Klient në pritje";
        const projectLabel = showClientIdentity ? project?.projectName ?? "-" : "I kufizuar";
        const lifecycle = testLifecycleFrom(test, index.reportsByTest.get(test.id) ?? NO_REPORTS);
        return {
          test,
          sample,
          technicianName,
          technicianId: test.assignedTechnician ?? "",
          late,
          risk,
          number,
          clientLabel,
          projectLabel,
          sampleType: sample?.sampleType ?? "",
          lifecycle,
          haystack: `${number} ${test.testCode ?? ""} ${test.testType} ${clientLabel} ${projectLabel} ${technicianName}`.toLowerCase()
        };
      }),
    [index, store.tests, showClientIdentity]
  );

  const windowStart = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - RECENT_WINDOW_DAYS);
    return start.toISOString().slice(0, 10);
  }, []);

  const testTypeOptions = useMemo(
    () => Array.from(new Set(store.tests.map((test) => test.testType))).filter(Boolean).sort(),
    [store.tests]
  );
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
    const windowed = windowMode === "all"
      ? allRows
      : allRows.filter((row) => row.lifecycle.stage !== "Delivered" || row.test.requiredTestDate >= windowStart);

    const needle = query.trim().toLowerCase();
    const filtered = windowed.filter((row) =>
      (!needle || row.haystack.includes(needle)) &&
      (status === "all" || row.test.status === status) &&
      (testType === "all" || row.test.testType === testType) &&
      (sampleType === "all" || row.sampleType === sampleType) &&
      (technician === "all" || (technician === UNASSIGNED ? !row.technicianId : row.technicianId === technician)) &&
      (clientId === "all" || row.test.clientId === clientId) &&
      (!requiredFrom || row.test.requiredTestDate >= requiredFrom) &&
      (!requiredTo || row.test.requiredTestDate <= requiredTo) &&
      (!dueFrom || (!!row.test.dueDate && row.test.dueDate >= dueFrom)) &&
      (!dueTo || (!!row.test.dueDate && row.test.dueDate <= dueTo)) &&
      (!overdueOnly || row.late)
    );

    const valueFor = (row: TestRow) => {
      switch (sort.key) {
        case "client": return row.clientLabel;
        case "project": return row.projectLabel;
        case "test": return row.test.testType;
        case "required": return row.test.requiredTestDate;
        case "technician": return row.technicianName;
        case "status": return sampleStageIndex(row.lifecycle.stage);
        default: return row.number;
      }
    };

    // Sort the whole filtered set, never the visible page.
    return sortRows(filtered, valueFor, sort);
  }, [allRows, query, windowMode, windowStart, status, testType, sampleType, technician, clientId, requiredFrom, requiredTo, dueFrom, dueTo, overdueOnly, sort]);

  const chips: FilterChip[] = [];
  if (windowMode !== "all") chips.push({ key: "window", label: t("table.recentWindow"), onRemove: () => setWindowMode("all") });
  if (query.trim()) chips.push({ key: "q", label: `${t("filters.search")}: “${query.trim()}”`, onRemove: () => setQuery("") });
  if (status !== "all") chips.push({ key: "status", label: `${t("filters.status")}: ${t(`status.${status}` as "status.Pending")}`, onRemove: () => setStatus("all") });
  if (testType !== "all") chips.push({ key: "test", label: `${t("filters.testType")}: ${testType}`, onRemove: () => setTestType("all") });
  if (sampleType !== "all") chips.push({ key: "type", label: `${t("filters.sampleType")}: ${sampleType}`, onRemove: () => setSampleType("all") });
  if (technician !== "all") {
    const name = technician === UNASSIGNED ? t("filters.unassigned") : store.users.find((user) => user.id === technician)?.fullName ?? technician;
    chips.push({ key: "tech", label: `${t("filters.technician")}: ${name}`, onRemove: () => setTechnician("all") });
  }
  if (clientId !== "all") {
    const client = store.clients.find((item) => item.id === clientId);
    chips.push({ key: "client", label: `${t("filters.client")}: ${client?.clientCode ?? clientId}`, onRemove: () => setClientId("all") });
  }
  if (requiredFrom || requiredTo) {
    const range = `${requiredFrom ? formatEuropeanDate(requiredFrom) : "…"} – ${requiredTo ? formatEuropeanDate(requiredTo) : "…"}`;
    chips.push({ key: "required", label: `${t("filters.requiredDate")}: ${range}`, onRemove: () => { setRequiredFrom(""); setRequiredTo(""); } });
  }
  if (dueFrom || dueTo) {
    const range = `${dueFrom ? formatEuropeanDate(dueFrom) : "…"} – ${dueTo ? formatEuropeanDate(dueTo) : "…"}`;
    chips.push({ key: "due", label: `${t("filters.reportDue")}: ${range}`, onRemove: () => { setDueFrom(""); setDueTo(""); } });
  }
  if (overdueOnly) chips.push({ key: "overdue", label: t("filters.overdue"), onRemove: () => setOverdue("") });

  const urlParams = {
    q: query.trim(),
    window: windowMode === "recent" ? "" : "all",
    status: status === "all" ? "" : status,
    test: testType === "all" ? "" : testType,
    type: sampleType === "all" ? "" : sampleType,
    tech: technician === "all" ? "" : technician,
    client: clientId === "all" ? "" : clientId,
    from: requiredFrom,
    to: requiredTo,
    dueFrom,
    dueTo,
    overdue: overdueOnly ? "1" : ""
  };

  const { page, pageCount, pageSize, from, to, setPage } = useTablePage(rows.length, DEFAULT_PAGE_SIZE, urlParams);
  const pageRows = paginate(rows, page, pageSize);

  return (
    <>
      <PageHeader title="Testet" description="Lista e testeve me afate, status dhe teknik të caktuar." />

      {!store.tests.length ? (
        <div className="rounded-md border border-line bg-white p-6 text-sm text-muted shadow-sm">
          Nuk ka ende teste. Regjistroni një kampion dhe pranoni testin për ta parë këtu.
        </div>
      ) : (
        <>
          <section className="surface-card no-print mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <FilterField label={t("filters.search")}>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Kampioni, testi, klienti, projekti ose tekniku"
                  className="input mt-1"
                />
              </FilterField>
            </div>

            <FilterField label={t("filters.status")}>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="input mt-1">
                <option value="all">{t("filters.all")}</option>
                {FILTERABLE_STATUSES.map((value) => (
                  <option key={value} value={value}>{t(`status.${value}` as "status.Pending")}</option>
                ))}
              </select>
            </FilterField>

            <FilterField label={t("filters.testType")}>
              <select value={testType} onChange={(event) => setTestType(event.target.value)} className="input mt-1">
                <option value="all">{t("filters.all")}</option>
                {testTypeOptions.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </FilterField>

            <FilterField label={t("filters.sampleType")}>
              <select value={sampleType} onChange={(event) => setSampleType(event.target.value)} className="input mt-1">
                <option value="all">{t("filters.all")}</option>
                {sampleTypeOptions.map((value) => <option key={value} value={value}>{value}</option>)}
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
                label={t("filters.requiredDate")}
                from={requiredFrom}
                to={requiredTo}
                onFrom={setRequiredFrom}
                onTo={setRequiredTo}
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

          <FilterChips
            chips={chips}
            resultCount={rows.length}
            onClearAll={clearAllFilters}
            countLabel={t("filters.results.tests")}
          />

          {/* Legend explaining the row colours. */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-ink">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-[#ff3d3d] bg-brand-late" /> Vonuar / Late</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-[#f0a93a] bg-brand-risk" /> Në rrezik / At risk</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-line bg-white" /> Në kohë / On time</span>
          </div>

          <SimpleTable>
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="table-head">
                <tr>
                  <SortableTh label="Kampioni" sortKey="number" sort={sort} onToggle={toggle} />
                  <SortableTh label="Klienti" sortKey="client" sort={sort} onToggle={toggle} />
                  <SortableTh label="Objekti / Projekti" sortKey="project" sort={sort} onToggle={toggle} />
                  <SortableTh label="Testi" sortKey="test" sort={sort} onToggle={toggle} />
                  <th className="px-4 py-3">{t("test.batch")}</th>
                  <SortableTh label={t("test.required")} sortKey="required" sort={sort} onToggle={toggle} />
                  <SortableTh label={t("test.technician")} sortKey="technician" sort={sort} onToggle={toggle} />
                  <SortableTh label="Statusi" sortKey="status" sort={sort} onToggle={toggle} />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted">
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
                {pageRows.map(({ test, sample, technicianName, late, risk, number, clientLabel, projectLabel, lifecycle }) => {
                  const rowClass = late
                    ? "bg-brand-late hover:bg-[#ff3d3d]"
                    : risk
                      ? "bg-brand-risk hover:bg-[#f5ad3d]"
                      : "bg-white hover:bg-slate-100";
                  const unitLabel = sample?.sampleType.includes("Rebar") || sample?.sampleType.includes("Shufër Çeliku") ? "mostra" : t("test.cubes");
                  const batchLabel = test.scheduledAgeDays ? `${test.cubeCount} ${unitLabel} / ${test.scheduledAgeDays}d` : `${test.cubeCount} ${unitLabel}`;
                  return (
                    <tr
                      key={test.id}
                      onClick={() => router.push(`/tests/${test.id}`)}
                      className={`cursor-pointer transition-colors ${rowClass}`}
                    >
                      <td className="px-4 py-3 font-semibold text-ink">{number}</td>
                      <td className="px-4 py-3">{clientLabel}</td>
                      <td className="px-4 py-3">{projectLabel}</td>
                      <td className="px-4 py-3">{test.testType}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{batchLabel}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatEuropeanDate(test.requiredTestDate)}</td>
                      <td className="px-4 py-3">{technicianName || t("test.unassigned")}</td>
                      <td className="px-4 py-3">
                        <StageCell lifecycle={lifecycle} late={late} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              page={page}
              pageCount={pageCount}
              from={from}
              to={to}
              total={rows.length}
              unfilteredTotal={store.tests.length}
              onPage={setPage}
            />
          </SimpleTable>
        </>
      )}
    </>
  );
}
