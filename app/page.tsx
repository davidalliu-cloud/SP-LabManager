"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StageCell } from "@/components/ui/stage-cell";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatEuropeanDate } from "@/lib/date-format";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";
import { sampleLifecycle, testLifecycle } from "@/lib/sample-stage";
import { isApproaching, isOverdue } from "@/lib/status";
import type { LabTest, Sample, TestStatus } from "@/lib/types";

const albanianMonths = [
  "Janar",
  "Shkurt",
  "Mars",
  "Prill",
  "Maj",
  "Qershor",
  "Korrik",
  "Gusht",
  "Shtator",
  "Tetor",
  "Nëntor",
  "Dhjetor"
];

function currentMonthContext() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return {
    key: `${year}-${String(month + 1).padStart(2, "0")}`,
    label: `${albanianMonths[month]} ${year}`
  };
}

export default function DashboardPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const month = currentMonthContext();
  const samplesThisMonth = store.samples.filter((sample) => sample.dateReceived.startsWith(month.key)).length;
  const completedThisMonth = store.tests.filter((test) => test.completedAt?.startsWith(month.key)).length;
  // Tests whose result is approved but which still have no report — exactly the
  // "finished but stuck before a report" instance that is otherwise invisible in
  // the registers. Listed in the Needs-attention panel below; the count also
  // feeds the "Reports to prepare" tile.
  const needsReport = store.tests
    .filter((test) => test.status === "Approved" && !store.reports.some((report) => report.testId === test.id))
    .map((test) => ({ test, sample: store.samples.find((sample) => sample.id === test.sampleId) }))
    .sort((left, right) => (left.test.requiredTestDate ?? "").localeCompare(right.test.requiredTestDate ?? ""));
  const pendingPreparation = needsReport.length;
  // Tests whose actual testing work is not finished yet — the technicians' queue.
  const incompleteStatuses: TestStatus[] = ["Pending", "Scheduled", "In Progress", "Delayed", "Rejected"];
  const needsCompletion = store.tests
    .filter((test) => incompleteStatuses.includes(test.status))
    .map((test) => ({ test, sample: store.samples.find((sample) => sample.id === test.sampleId) }))
    .sort((left, right) => (left.test.requiredTestDate ?? "").localeCompare(right.test.requiredTestDate ?? ""));
  const pendingApproval = store.reports.filter((report) => report.reportStatus === "Pending Approval").length;
  const approvedNotIssued = store.reports.filter((report) => report.reportStatus === "Approved").length;
  // Derived from the due date, the same rule the Delayed Items page and the row
  // colouring use. This counted status === "Delayed" until 2026-08-27 - a status
  // no code path ever assigns, so the tile could only ever read zero.
  const delayed = store.tests.filter((test) => isOverdue(test.requiredTestDate, test.status)).length;
  const procedureDrafts = store.procedureRevisions.filter((revision) => revision.status === "Draft" || revision.status === "In Review").length;
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);
  const workflowRows = [
    ...store.samples
      .filter((sample) => !store.tests.some((test) => test.sampleId === sample.id))
      .map((sample) => ({ kind: "sample" as const, sample, test: undefined })),
    ...store.tests.map((test) => ({
      kind: "test" as const,
      test,
      sample: store.samples.find((sample) => sample.id === test.sampleId)
    }))
  ].sort((left, right) => {
    const leftDate = left.test?.requiredTestDate ?? left.sample?.requiredTestDate ?? "";
    const rightDate = right.test?.requiredTestDate ?? right.sample?.requiredTestDate ?? "";
    return leftDate.localeCompare(rightDate);
  });

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
        <SummaryCard label={t("dashboard.samplesThisMonth")} value={samplesThisMonth} detail={month.label} href="/samples" />
        <SummaryCard label={t("dashboard.testsCompleted")} value={completedThisMonth} tone="green" detail={month.label} href="/tests" />
        <SummaryCard label={t("dashboard.reportsToPrepare")} value={pendingPreparation} tone="purple" href="/reports" />
        <SummaryCard label={t("dashboard.pendingApproval")} value={pendingApproval} tone="purple" href="/reports" />
        <SummaryCard label={t("dashboard.approvedNotIssued")} value={approvedNotIssued} tone="green" href="/reports" />
        <SummaryCard label={t("dashboard.delayedTests")} value={delayed} tone="red" href="/delayed" />
      </section>

      <AttentionPanel
        title={t("dashboard.completionTitle")}
        description={t("dashboard.completionDescription")}
        empty={t("dashboard.completionEmpty")}
        actionLabel={t("dashboard.completionOpen")}
        items={needsCompletion}
        accentClass="border-l-lab-red"
        badgeClass="bg-brand-late text-lab-red"
      />

      <AttentionPanel
        title={t("dashboard.attentionTitle")}
        description={t("dashboard.attentionDescription")}
        empty={t("dashboard.attentionEmpty")}
        actionLabel={t("dashboard.attentionGenerate")}
        items={needsReport}
        accentClass="border-l-lab-gold"
        badgeClass="bg-lab-gold/20 text-[#8a5a12]"
      />

      <section className="mt-6 surface-card p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-semibold text-ink">Dosja e procedurave</h2>
            <p className="mt-1 text-sm text-muted">Procedurat e miratuara, historiku i rishikimeve dhe kontrolli nga Kryelaboranti për dokumentet e kontrolluara.</p>
          </div>
          <Link href="/procedures" className="btn-secondary">Hap procedurat</Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Metric label="SOP agregatesh" value={String(store.procedures.filter((procedure) => procedure.category === "Aggregate").length)} />
          <Metric label="Rishikime aktuale" value={String(store.procedureRevisions.filter((revision) => revision.status === "Current").length)} />
          <Metric label="Draft / në rishikim" value={String(procedureDrafts)} />
        </div>
      </section>

      <section className="mt-6 surface-card p-4">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">Procesi i kampionëve dhe testeve</h2>
              <p className="mt-1 text-sm text-muted">Pamje në rreshta për çdo kampion ose test, nga regjistrimi deri te lëshimi i raportit.</p>
            </div>
            <Link href="/tests" className="text-sm font-semibold text-lab-burgundy hover:text-lab-purple">{t("dashboard.openAllTests")}</Link>
          </div>
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[1180px] text-left text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Faza</th>
                  <th className="px-4 py-3">Kampioni</th>
                  <th className="px-4 py-3">Kodi i klientit</th>
                  <th className="px-4 py-3">Projekti</th>
                  <th className="px-4 py-3">Testi</th>
                  <th className="px-4 py-3">Sasia / grupi</th>
                  <th className="px-4 py-3">Data e testimit</th>
                  <th className="px-4 py-3">Afati i raportit</th>
                  <th className="px-4 py-3">Tekniku</th>
                  <th className="px-4 py-3">Veprim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {workflowRows.length ? (
                  workflowRows.map((row) => (
                    <WorkflowRow
                      key={row.test?.id ?? row.sample?.id}
                      row={row}
                      showClientIdentity={showClientIdentity}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-6 text-center text-sm text-muted">{t("dashboard.noTests")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-6 surface-card p-4">
        <h2 className="text-base font-semibold text-ink">{t("dashboard.managementSnapshot")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <Metric label={t("dashboard.topClient")} value="-" />
          <Metric label={t("dashboard.commonSample")} value="Kubike Betoni / Concrete Cubes" />
          <Metric label={t("dashboard.reportsToPrepare")} value={String(pendingPreparation)} />
          <Metric label={t("dashboard.nextApproval")} value={`${pendingApproval} raporte`} />
        </div>
      </section>
    </>
  );
}

// Collapsed by default (native <details>) so a caught-up lab sees only compact
// headers with a count badge, and expands a panel only when it wants the list.
function AttentionPanel({
  title,
  description,
  empty,
  actionLabel,
  items,
  accentClass,
  badgeClass
}: {
  title: string;
  description: string;
  empty: string;
  actionLabel: string;
  items: Array<{ test: LabTest; sample?: Sample }>;
  accentClass: string;
  badgeClass: string;
}) {
  const store = useLabStore();
  const count = items.length;
  return (
    <details className={`group mt-6 surface-card p-0 ${count ? `border-l-4 ${accentClass}` : ""}`}>
      <summary className={`flex list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden ${count ? "cursor-pointer" : "cursor-default"}`}>
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            {title}
            {count ? (
              <span className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${badgeClass}`}>
                {count}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-green">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
                {empty}
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        {count ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : null}
      </summary>
      {count ? (
        <div className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Kampioni</th>
                <th className="px-4 py-3">Testi</th>
                <th className="px-4 py-3">Lloji</th>
                <th className="px-4 py-3">Data e testimit</th>
                <th className="px-4 py-3">Tekniku</th>
                <th className="px-4 py-3">Veprim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map(({ test, sample }) => {
                const overdue = isOverdue(test.requiredTestDate, test.status);
                const technician = store.users.find((user) => user.id === test.assignedTechnician);
                return (
                  <tr key={test.id} className={overdue ? "bg-red-50/70" : "hover:bg-[rgba(91,25,63,0.04)]"}>
                    <td className="px-4 py-3 font-semibold text-ink">{sample?.sampleCode ?? "-"}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{test.testCode}</td>
                    <td className="px-4 py-3">{test.testType}</td>
                    <td className={`px-4 py-3 ${overdue ? "font-semibold text-brand-late" : ""}`}>{formatEuropeanDate(test.requiredTestDate)}</td>
                    <td className="px-4 py-3">{technician?.fullName ?? "-"}</td>
                    <td className="px-4 py-3">
                      <Link href={`/tests/${test.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">
                        {actionLabel}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </details>
  );
}

function WorkflowRow({
  row,
  showClientIdentity
}: {
  row: { kind: "sample"; sample?: Sample; test?: undefined } | { kind: "test"; sample?: Sample; test: LabTest };
  showClientIdentity: boolean;
}) {
  const store = useLabStore();
  const sample = row.sample;
  const test = row.test;
  const client = store.clients.find((item) => item.id === (test?.clientId ?? sample?.clientId));
  const project = store.projects.find((item) => item.id === (test?.projectId ?? sample?.projectId));
  const technician = store.users.find((item) => item.id === (test?.assignedTechnician ?? sample?.assignedTechnician));
  const overdue = test ? isOverdue(test.requiredTestDate, test.status) : false;
  const approaching = test ? isApproaching(test.requiredTestDate) : false;
  // One lifecycle status per row: the test's own stage for a test row, the
  // sample's aggregate stage for a sample row. The muted sub-detail is the
  // "what's pending" reason, shown in red when the row is late.
  const lifecycle = test
    ? testLifecycle(test, store.reports)
    : sample
      ? sampleLifecycle(sample, store.tests, store.reports)
      : { stage: "Registered" as const, detail: "registered" as const };
  const dueDate = test?.requiredTestDate;
  const daysLate = overdue && dueDate ? Math.floor((Date.now() - new Date(`${dueDate}T23:59:59`).getTime()) / 86_400_000) : 0;
  const unit = sample?.sampleType.includes("Rebar") || sample?.sampleType.includes("Shufër Çeliku") ? "mostra" : "mostra";
  const quantity = test ? `${test.cubeCount} ${unit}${test.scheduledAgeDays ? ` / ${test.scheduledAgeDays} ditë` : ""}` : `${sample?.quantity ?? "-"} ${unit}`;

  return (
    <tr className={`${overdue ? "bg-red-50/70" : approaching ? "bg-amber-50/60" : "hover:bg-[rgba(91,25,63,0.04)]"}`}>
      <td className="px-4 py-3">
        <StageCell lifecycle={lifecycle} late={overdue} />
        {overdue ? <div className="mt-0.5 text-[11px] font-semibold text-brand-late">{daysLate} ditë vonesë</div> : null}
      </td>
      <td className="px-4 py-3 font-semibold text-ink">{sample?.sampleCode ?? test?.testCode}</td>
      <td className="px-4 py-3 font-semibold text-ink">{client?.clientCode ?? "Në pritje"}</td>
      <td className="px-4 py-3">{showClientIdentity ? project?.projectName ?? "Në pritje" : "I kufizuar"}</td>
      <td className="px-4 py-3">{test?.testType ?? sample?.requestedTestType ?? "-"}</td>
      <td className="px-4 py-3">{quantity}</td>
      <td className="px-4 py-3">{formatEuropeanDate(test?.requiredTestDate ?? sample?.requiredTestDate)}</td>
      <td className="px-4 py-3">{formatEuropeanDate(test?.dueDate ?? sample?.reportDueDate)}</td>
      <td className="px-4 py-3">{technician?.fullName ?? "-"}</td>
      <td className="px-4 py-3">
        <Link href={test ? `/tests/${test.id}` : `/samples/${sample?.id}`} className="font-semibold text-lab-burgundy hover:text-lab-purple">
          {test ? "Hap testin" : "Hap kampionin"}
        </Link>
      </td>
    </tr>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className="mt-2 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
