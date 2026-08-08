"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SortableTh, sortRows, useSort } from "@/components/ui/sortable-header";
import { formatEuropeanDate } from "@/lib/date-format";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { isApproaching, isOverdue } from "@/lib/status";
import { canDeleteSamples, canViewClientIdentity } from "@/lib/permissions";
import { deriveSampleStage, sampleStageIndex } from "@/lib/sample-stage";
import type { SampleStatus, TestStatus } from "@/lib/types";

const TESTING_COMPLETE_STAGES: SampleStatus[] = ["Tested", "Report Issued", "Delivered"];

const FINISHED_TEST_STATUSES: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Report Approved", "Issued", "Sent to Client"];

export default function SamplesPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const { sort, toggle } = useSort("number");
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
  const rows = useMemo(() => {
    const filtered = store.samples.filter((sample) => {
      const clientCode = store.clients.find((item) => item.id === sample.clientId)?.clientCode ?? "";
      const project = showClientIdentity ? store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "" : "";
      return `${sample.sampleCode} ${clientCode} ${project} ${sample.sampleType}`.toLowerCase().includes(query.toLowerCase());
    });
    const nextTestFor = (sampleId: string) => {
      const sampleTests = store.tests.filter((item) => item.sampleId === sampleId);
      return sampleTests.find((item) => ["Pending", "Scheduled", "In Progress"].includes(item.status)) ?? sampleTests[0];
    };
    const valueFor = (sample: (typeof filtered)[number]) => {
      const nextTest = nextTestFor(sample.id);
      const report = store.reports.find((item) => item.sampleId === sample.id);
      switch (sort.key) {
        case "date": return sample.dateReceived;
        case "client": return store.clients.find((item) => item.id === sample.clientId)?.clientCode ?? "";
        case "project": return store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "";
        case "type": return sample.sampleType;
        case "qty": return sample.quantity;
        case "requested": return sample.requestedTestType;
        case "required": return nextTest?.requiredTestDate ?? sample.requiredTestDate;
        case "reportDue": return nextTest?.dueDate ?? sample.reportDueDate;
        case "status": return sampleStageIndex(deriveSampleStage(sample, store.tests, store.reports));
        case "technician": return store.users.find((item) => item.id === (nextTest?.assignedTechnician ?? sample.assignedTechnician))?.fullName ?? "";
        case "reportStatus": return report?.reportStatus ?? "";
        default: return sample.sampleCode;
      }
    };
    return sortRows(filtered, valueFor, sort);
  }, [query, showClientIdentity, sort, store.clients, store.projects, store.reports, store.samples, store.tests, store.users]);

  return (
    <>
      <PageHeader
        title={t("samples.title")}
        description={t("samples.description")}
        action={<Link href="/samples/new" className="btn-primary">{t("samples.new")}</Link>}
      />
      <div className="surface-card mb-4 p-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("samples.search")}
          className="input"
        />
      </div>
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
              {rows.map((sample) => {
                const test = store.tests.find((item) => item.sampleId === sample.id);
                const sampleTests = store.tests.filter((item) => item.sampleId === sample.id);
                const nextTest = sampleTests.find((item) => ["Pending", "Scheduled", "In Progress"].includes(item.status)) ?? test;
                const report = store.reports.find((item) => item.sampleId === sample.id);
                const schedule = sampleTests
                  .map((item) => `${item.scheduledAgeDays}d: ${item.cubeCount} mostra (${formatEuropeanDate(item.requiredTestDate)})`)
                  .join("; ") || sample.testSchedules?.map((item) => `${item.ageDays || "-"}d: ${item.cubeCount} mostra (${formatEuropeanDate(item.requiredTestDate)})`).join("; ");
                // Overdue overlay (same rule as the Tests page): late = an unfinished
                // test past its deadline; at-risk = due within 3 days.
                const stage = deriveSampleStage(sample, store.tests, store.reports);
                const sampleDone = TESTING_COMPLETE_STAGES.includes(stage);
                const activeTests = sampleTests.filter((item) => !FINISHED_TEST_STATUSES.includes(item.status));
                const late = !sampleDone && (activeTests.length
                  ? activeTests.some((item) => isOverdue(item.requiredTestDate, item.status))
                  : isOverdue(sample.requiredTestDate, "Pending"));
                const risk = !sampleDone && !late && (activeTests.length
                  ? activeTests.some((item) => isApproaching(item.requiredTestDate))
                  : isApproaching(sample.requiredTestDate));
                const rowClass = late ? "bg-brand-late hover:bg-[#ff3d3d]" : risk ? "bg-brand-risk hover:bg-[#f5ad3d]" : "hover:bg-lab-mist/60";
                return (
                  <tr key={sample.id} className={`transition-colors ${rowClass}`}>
                    <td className="px-4 py-3 font-semibold text-ink">{sample.sampleCode}</td>
                    <td className="px-4 py-3">{formatEuropeanDate(sample.dateReceived)}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{store.clients.find((item) => item.id === sample.clientId)?.clientCode ?? "Në pritje"}</td>
                    <td className="px-4 py-3">{showClientIdentity ? store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "Në pritje caktimi" : "I kufizuar"}</td>
                    <td className="px-4 py-3">{sample.sampleType}</td>
                    <td className="px-4 py-3" title={schedule}>{sample.quantity}</td>
                    <td className="px-4 py-3">{sample.requestedTestType}</td>
                    <td className="px-4 py-3">{formatEuropeanDate(nextTest?.requiredTestDate ?? sample.requiredTestDate)}</td>
                    <td className="px-4 py-3">{formatEuropeanDate(nextTest?.dueDate ?? sample.reportDueDate)}</td>
                    <td className="px-4 py-3"><StatusBadge status={stage} /></td>
                    <td className="px-4 py-3">{store.users.find((item) => item.id === (nextTest?.assignedTechnician ?? sample.assignedTechnician))?.fullName ?? "-"}</td>
                    <td className="px-4 py-3">{report ? <StatusBadge status={report.reportStatus} /> : "-"}</td>
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
      </div>
    </>
  );
}
