"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { SortableTh, sortRows, useSort } from "@/components/ui/sortable-header";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { formatEuropeanDate } from "@/lib/date-format";
import { isApproaching, isOverdue } from "@/lib/status";
import { canViewClientIdentity } from "@/lib/permissions";
import type { TestStatus } from "@/lib/types";

const DONE_STATUSES: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Report Approved", "Issued", "Sent to Client"];

export default function TestsPage() {
  const store = useLabStore();
  const router = useRouter();
  const { t } = useI18n();
  const { sort, toggle } = useSort("number");
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);

  const rows = useMemo(() => {
    const enriched = store.tests.map((test) => {
      const sample = store.samples.find((item) => item.id === test.sampleId);
      const client = store.clients.find((item) => item.id === test.clientId);
      const project = store.projects.find((item) => item.id === test.projectId);
      const technician = store.users.find((user) => user.id === test.assignedTechnician);
      const late = isOverdue(test.requiredTestDate, test.status);
      const done = DONE_STATUSES.includes(test.status);
      const risk = !late && !done && isApproaching(test.requiredTestDate);
      const number = sample?.sampleCode ?? test.testCode;
      const clientLabel = showClientIdentity ? client?.clientName ?? "-" : client?.clientCode ?? "Klient në pritje";
      const projectLabel = showClientIdentity ? project?.projectName ?? "-" : "I kufizuar";
      return { test, sample, technician, late, risk, number, clientLabel, projectLabel };
    });
    const valueFor = (row: (typeof enriched)[number]) => {
      switch (sort.key) {
        case "client": return row.clientLabel;
        case "project": return row.projectLabel;
        case "test": return row.test.testType;
        case "required": return row.test.requiredTestDate;
        case "technician": return row.technician?.fullName ?? "";
        case "status": return row.late ? "Delayed" : row.test.status;
        default: return row.number;
      }
    };
    return sortRows(enriched, valueFor, sort);
  }, [store.tests, store.samples, store.clients, store.projects, store.users, showClientIdentity, sort]);

  return (
    <>
      <PageHeader title="Testet" description="Lista e testeve me afate, status dhe teknik të caktuar." />

      {/* Legend explaining the row colours. */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-ink">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-[#ff3d3d] bg-brand-late" /> Vonuar / Late</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-[#f0a93a] bg-brand-risk" /> Në rrezik / At risk</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-line bg-white" /> Në kohë / On time</span>
      </div>

      {!store.tests.length ? (
        <div className="rounded-md border border-line bg-white p-6 text-sm text-muted shadow-sm">
          Nuk ka ende teste. Regjistroni një kampion dhe pranoni testin për ta parë këtu.
        </div>
      ) : (
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
              {rows.map(({ test, sample, technician, late, risk, number, clientLabel, projectLabel }) => {
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
                    <td className="px-4 py-3">{technician?.fullName ?? t("test.unassigned")}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={late ? "Delayed" : test.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SimpleTable>
      )}
    </>
  );
}
