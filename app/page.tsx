"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatEuropeanDate } from "@/lib/date-format";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";
import { isApproaching, isOverdue } from "@/lib/status";
import type { LabTest, Sample } from "@/lib/types";

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
  const pendingPreparation = store.tests.filter((test) => test.status === "Approved" && !store.reports.some((report) => report.testId === test.id)).length;
  const pendingApproval = store.reports.filter((report) => report.reportStatus === "Pending Approval").length;
  const approvedNotIssued = store.reports.filter((report) => report.reportStatus === "Approved").length;
  const delayed = store.tests.filter((test) => test.status === "Delayed").length;
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
                  <th className="px-4 py-3">Raporti</th>
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
                    <td colSpan={11} className="px-4 py-6 text-center text-sm text-muted">{t("dashboard.noTests")}</td>
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
  const report = test ? store.reports.find((item) => item.testId === test.id) : undefined;
  const overdue = test ? isOverdue(test.requiredTestDate, test.status) : false;
  const approaching = test ? isApproaching(test.requiredTestDate) : false;
  const status = test ? (overdue ? "Delayed" : test.status) : sample?.status ?? "Registered";
  const unit = sample?.sampleType.includes("Rebar") || sample?.sampleType.includes("Shufër Çeliku") ? "mostra" : "mostra";
  const quantity = test ? `${test.cubeCount} ${unit}${test.scheduledAgeDays ? ` / ${test.scheduledAgeDays} ditë` : ""}` : `${sample?.quantity ?? "-"} ${unit}`;

  return (
    <tr className={`${overdue ? "bg-red-50/70" : approaching ? "bg-amber-50/60" : "hover:bg-[rgba(91,25,63,0.04)]"}`}>
      <td className="px-4 py-3"><StatusBadge status={status} /></td>
      <td className="px-4 py-3 font-semibold text-ink">{sample?.sampleCode ?? test?.testCode}</td>
      <td className="px-4 py-3 font-semibold text-ink">{client?.clientCode ?? "Në pritje"}</td>
      <td className="px-4 py-3">{showClientIdentity ? project?.projectName ?? "Në pritje" : "I kufizuar"}</td>
      <td className="px-4 py-3">{test?.testType ?? sample?.requestedTestType ?? "-"}</td>
      <td className="px-4 py-3">{quantity}</td>
      <td className="px-4 py-3">{formatEuropeanDate(test?.requiredTestDate ?? sample?.requiredTestDate)}</td>
      <td className="px-4 py-3">{formatEuropeanDate(test?.dueDate ?? sample?.reportDueDate)}</td>
      <td className="px-4 py-3">{technician?.fullName ?? "-"}</td>
      <td className="px-4 py-3">{report ? <StatusBadge status={report.reportStatus} /> : "-"}</td>
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
    <div className="border border-[#d5c8b7] bg-[rgba(255,252,247,0.76)] p-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">{label}</div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-[-0.02em] text-ink">{value}</div>
    </div>
  );
}
