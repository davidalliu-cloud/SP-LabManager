"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";

export default function SamplesPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);
  const rows = useMemo(() => {
    return store.samples.filter((sample) => {
      const clientCode = store.clients.find((item) => item.id === sample.clientId)?.clientCode ?? "";
      const project = showClientIdentity ? store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "" : "";
      return `${sample.sampleCode} ${clientCode} ${project} ${sample.sampleType}`.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, showClientIdentity, store.clients, store.projects, store.samples]);

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
      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="table-head">
              <tr>
                {[
                  t("samples.sampleCode"),
                  t("samples.dateReceived"),
                  t("samples.clientCode"),
                  t("samples.project"),
                  t("samples.sampleType"),
                  t("samples.qty"),
                  t("samples.requestedTest"),
                  t("samples.requiredDate"),
                  t("samples.reportDue"),
                  t("samples.status"),
                  t("samples.assignedTechnician"),
                  t("samples.reportStatus"),
                  t("samples.actions")
                ].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((sample) => {
                const test = store.tests.find((item) => item.sampleId === sample.id);
                const sampleTests = store.tests.filter((item) => item.sampleId === sample.id);
                const nextTest = sampleTests.find((item) => ["Pending", "Scheduled", "In Progress"].includes(item.status)) ?? test;
                const report = store.reports.find((item) => item.sampleId === sample.id);
                const schedule = sampleTests
                  .map((item) => `${item.scheduledAgeDays}d: ${item.cubeCount} cubes (${item.requiredTestDate})`)
                  .join("; ") || sample.testSchedules?.map((item) => `${item.ageDays || "-"}d: ${item.cubeCount} mostra (${item.requiredTestDate})`).join("; ");
                return (
                  <tr key={sample.id} className="hover:bg-lab-mist/60">
                    <td className="px-4 py-3 font-semibold text-ink">{sample.sampleCode}</td>
                    <td className="px-4 py-3">{sample.dateReceived}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{store.clients.find((item) => item.id === sample.clientId)?.clientCode ?? "Në pritje"}</td>
                    <td className="px-4 py-3">{showClientIdentity ? store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "Në pritje caktimi" : "I kufizuar"}</td>
                    <td className="px-4 py-3">{sample.sampleType}</td>
                    <td className="px-4 py-3" title={schedule}>{sample.quantity}</td>
                    <td className="px-4 py-3">{sample.requestedTestType}</td>
                    <td className="px-4 py-3">{nextTest?.requiredTestDate ?? sample.requiredTestDate}</td>
                    <td className="px-4 py-3">{nextTest?.dueDate ?? sample.reportDueDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={sample.status} /></td>
                    <td className="px-4 py-3">{store.users.find((item) => item.id === nextTest?.assignedTechnician)?.fullName ?? "-"}</td>
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
