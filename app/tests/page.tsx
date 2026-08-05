"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { formatEuropeanDate } from "@/lib/date-format";
import { isApproaching, isOverdue } from "@/lib/status";
import { canViewClientIdentity } from "@/lib/permissions";
import type { TestStatus } from "@/lib/types";

const DONE_STATUSES: TestStatus[] = ["Completed", "Report Drafted", "Pending Approval", "Approved", "Issued", "Sent to Client"];

export default function TestsPage() {
  const store = useLabStore();
  const router = useRouter();
  const { t } = useI18n();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);

  return (
    <>
      <PageHeader title="Testet" description="Lista e testeve me afate, status dhe teknik të caktuar." />

      {/* Legend explaining the row colours. */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-ink">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-red-300 bg-red-200" /> Vonuar / Late</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-5 rounded-sm border border-amber-300 bg-amber-200" /> Në rrezik / At risk</span>
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
                <th className="px-4 py-3">Kampioni</th>
                <th className="px-4 py-3">Klienti</th>
                <th className="px-4 py-3">Objekti / Projekti</th>
                <th className="px-4 py-3">Testi</th>
                <th className="px-4 py-3">{t("test.batch")}</th>
                <th className="px-4 py-3">{t("test.required")}</th>
                <th className="px-4 py-3">{t("test.technician")}</th>
                <th className="px-4 py-3">Statusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {store.tests.map((test) => {
                const sample = store.samples.find((item) => item.id === test.sampleId);
                const client = store.clients.find((item) => item.id === test.clientId);
                const project = store.projects.find((item) => item.id === test.projectId);
                const technician = store.users.find((user) => user.id === test.assignedTechnician);

                const late = isOverdue(test.requiredTestDate, test.status);
                const done = DONE_STATUSES.includes(test.status);
                const risk = !late && !done && isApproaching(test.requiredTestDate);
                const rowClass = late
                  ? "bg-red-200 hover:bg-red-300"
                  : risk
                    ? "bg-amber-200 hover:bg-amber-300"
                    : "bg-white hover:bg-slate-100";

                const unitLabel = sample?.sampleType.includes("Rebar") || sample?.sampleType.includes("Shufër Çeliku") ? "mostra" : t("test.cubes");
                const batchLabel = test.scheduledAgeDays ? `${test.cubeCount} ${unitLabel} / ${test.scheduledAgeDays}d` : `${test.cubeCount} ${unitLabel}`;

                return (
                  <tr
                    key={test.id}
                    onClick={() => router.push(`/tests/${test.id}`)}
                    className={`cursor-pointer transition-colors ${rowClass}`}
                  >
                    <td className="px-4 py-3 font-semibold text-ink">{sample?.sampleCode ?? test.testCode}</td>
                    <td className="px-4 py-3">{showClientIdentity ? client?.clientName ?? "-" : client?.clientCode ?? "Klient në pritje"}</td>
                    <td className="px-4 py-3">{showClientIdentity ? project?.projectName ?? "-" : "I kufizuar"}</td>
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
