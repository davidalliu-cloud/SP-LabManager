"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { SummaryCard } from "@/components/ui/summary-card";
import { TestCard } from "@/components/workflow/test-card";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import type { TestStatus } from "@/lib/types";

const workflow: Array<{ label: string; statuses: TestStatus[] }> = [
  { label: "Pending Testing", statuses: ["Pending", "Scheduled"] },
  { label: "In Progress", statuses: ["In Progress"] },
  { label: "Completed", statuses: ["Completed"] },
  { label: "Report Drafted", statuses: ["Report Drafted"] },
  { label: "Pending Approval", statuses: ["Pending Approval"] },
  { label: "Approved", statuses: ["Approved"] },
  { label: "Issued", statuses: ["Issued"] },
  { label: "Delayed", statuses: ["Delayed"] }
];

export default function DashboardPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const month = "2026-04";
  const samplesThisMonth = store.samples.filter((sample) => sample.dateReceived.startsWith(month)).length;
  const completedThisMonth = store.tests.filter((test) => test.completedAt?.startsWith(month)).length;
  const pendingPreparation = store.tests.filter((test) => test.status === "Completed").length;
  const pendingApproval = store.reports.filter((report) => report.reportStatus === "Pending Approval").length;
  const approvedNotIssued = store.reports.filter((report) => report.reportStatus === "Approved").length;
  const delayed = store.tests.filter((test) => test.status === "Delayed").length;
  const procedureDrafts = store.procedureRevisions.filter((revision) => revision.status === "Draft" || revision.status === "In Review").length;

  return (
    <>
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        action={
          <Link href="/samples/new" className="btn-primary">
            {t("dashboard.registerSample")}
          </Link>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard label={t("dashboard.samplesThisMonth")} value={samplesThisMonth} detail="April 2026" href="/samples" />
        <SummaryCard label={t("dashboard.testsCompleted")} value={completedThisMonth} tone="green" detail="April 2026" href="/tests" />
        <SummaryCard label={t("dashboard.reportsToPrepare")} value={pendingPreparation} tone="purple" href="/reports" />
        <SummaryCard label={t("dashboard.pendingApproval")} value={pendingApproval} tone="purple" href="/reports" />
        <SummaryCard label={t("dashboard.approvedNotIssued")} value={approvedNotIssued} tone="green" href="/reports" />
        <SummaryCard label={t("dashboard.delayedTests")} value={delayed} tone="red" href="/delayed" />
      </section>

      <section className="mt-6 surface-card p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-ink">Procedures Directory</h2>
            <p className="mt-1 text-sm text-muted">Approved SOPs, revision history, and Lab Chief review for controlled documents.</p>
          </div>
          <Link href="/procedures" className="btn-secondary">Open procedures</Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Metric label="Aggregate SOPs" value={String(store.procedures.filter((procedure) => procedure.category === "Aggregate").length)} />
          <Metric label="Current revisions" value={String(store.procedureRevisions.filter((revision) => revision.status === "Current").length)} />
          <Metric label="Draft / review" value={String(procedureDrafts)} />
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface-card p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink">{t("dashboard.workflowColumns")}</h2>
            <Link href="/tests" className="text-sm font-semibold text-lab-burgundy hover:text-lab-purple">{t("dashboard.openAllTests")}</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map((column) => {
              const tests = store.tests.filter((test) => column.statuses.includes(test.status));
              return (
                <div key={column.label} className="soft-panel min-h-40 p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-ink">{t(`status.${column.label}` as never)}</div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-lab-burgundy ring-1 ring-line">{tests.length}</span>
                  </div>
                  <div className="space-y-3">
                    {tests.length ? (
                      tests.map((test) => (
                        <TestCard
                          key={test.id}
                          test={test}
                          sample={store.samples.find((sample) => sample.id === test.sampleId)}
                          client={store.clients.find((client) => client.id === test.clientId)}
                          project={store.projects.find((project) => project.id === test.projectId)}
                          technician={store.users.find((user) => user.id === test.assignedTechnician)}
                        />
                      ))
                    ) : (
                      <div className="rounded-md border border-dashed border-line bg-white p-3 text-sm text-muted">{t("dashboard.noTests")}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="surface-card p-4">
          <h2 className="text-base font-semibold text-ink">{t("dashboard.managementSnapshot")}</h2>
          <div className="mt-4 space-y-4">
            <Metric label={t("dashboard.topClient")} value="Atlas Contractors" />
            <Metric label={t("dashboard.commonSample")} value="Kubike Betoni / Concrete Cubes" />
            <Metric label={t("dashboard.reportsToPrepare")} value={String(pendingPreparation)} />
            <Metric label={t("dashboard.nextApproval")} value={`${pendingApproval} reports`} />
          </div>
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
