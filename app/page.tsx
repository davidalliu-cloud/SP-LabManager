"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StageCell } from "@/components/ui/stage-cell";
import { SummaryCard } from "@/components/ui/summary-card";
import { formatEuropeanDate } from "@/lib/date-format";
import { useI18n } from "@/lib/i18n";
import { reportIssuedOn } from "@/lib/client-analysis";
import { buildReadiness } from "@/lib/quality-readiness";
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

/** Today as YYYY-MM-DD, to compare against the stored due dates. */
function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const month = currentMonthContext();
  const today = todayIso();

  const samplesThisMonth = store.samples.filter((sample) => sample.dateReceived.startsWith(month.key)).length;
  const completedThisMonth = store.tests.filter((test) => test.completedAt?.startsWith(month.key)).length;

  // A rejected report was never issued, so it counts for nothing here.
  const liveReports = store.reports.filter((report) => report.reportStatus !== "Rejected");
  const reportsIssuedThisMonth = liveReports.filter((report) => reportIssuedOn(report)?.startsWith(month.key)).length;

  // Awaiting a signature. The lifecycle this lab actually uses is
  // Report Drafted -> Approved -> Sent to Client; "Pending Approval" is counted
  // too because the app can still set it, not because anything does.
  const awaitingApproval = store.reports.filter(
    (report) => report.reportStatus === "Report Drafted" || report.reportStatus === "Pending Approval"
  ).length;

  // Work finished and not yet reported.
  //
  // This asked for tests at status "Approved" until today. No test has ever held
  // that status — the register runs Pending -> Report Approved — so the tile read
  // zero every day of its life and the panel beneath it was always empty. A
  // completion date is the honest signal: it is set when the technician finishes
  // and cleared again if the results are rejected.
  const reportedTestIds = new Set(liveReports.map((report) => report.testId));
  const needsReport = store.tests
    .filter((test) => test.completedAt && !reportedTestIds.has(test.id))
    .map((test) => ({ test, sample: store.samples.find((sample) => sample.id === test.sampleId) }))
    .sort((left, right) => (left.test.completedAt ?? "").localeCompare(right.test.completedAt ?? ""));

  // Unfinished by the same rule, rather than by a list of statuses that has
  // drifted twice already.
  const unfinished = store.tests
    .filter((test) => !test.completedAt)
    .map((test) => ({ test, sample: store.samples.find((sample) => sample.id === test.sampleId) }))
    .sort((left, right) => (left.test.requiredTestDate ?? "").localeCompare(right.test.requiredTestDate ?? ""));

  // Split, because 125 of the 128 in this queue are cubes waiting out their 7 or
  // 28 days. A panel that shows 128 when three need you today is one people stop
  // reading.
  const dueNow = unfinished.filter(({ test }) => (test.requiredTestDate ?? "") <= today);
  const scheduledAhead = unfinished.filter(({ test }) => (test.requiredTestDate ?? "") > today);
  const overdue = store.tests.filter((test) => isOverdue(test.requiredTestDate, test.status)).length;

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentity = canViewClientIdentity(currentUser?.role);

  // --- what the quality manager is answerable for -------------------------
  // The same computation the readiness page runs, shown here as a strip so a
  // calibration that has lapsed is visible from the front page rather than only
  // to whoever opens Quality Management.
  const readiness = useMemo(
    () => buildReadiness(store).filter((item) => item.level !== "ok"),
    [
      store.equipment,
      store.environmentReadings,
      store.nonconformities,
      store.complaints,
      store.tests,
      store.reports,
      store.proficiencyTests,
      store.auditEntries
    ]
  );

  // --- management snapshot, computed ---------------------------------------
  // Both of these were hardcoded: the top client was the literal "-" and the
  // commonest sample was the string "Kubike Betoni / Concrete Cubes". A figure
  // nobody calculated is worse on this page than no figure at all.
  const topClient = useMemo(() => {
    const counts = new Map<string, number>();
    for (const report of liveReports) {
      if (!reportIssuedOn(report)?.startsWith(month.key)) continue;
      counts.set(report.clientId, (counts.get(report.clientId) ?? 0) + 1);
    }
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (!best) return "—";
    const client = store.clients.find((row) => row.id === best[0]);
    const name = showClientIdentity ? client?.clientName : undefined;
    return `${client?.clientCode ?? "—"}${name ? ` · ${name}` : ""} (${best[1]})`;
  }, [liveReports, month.key, store.clients, showClientIdentity]);

  const commonestSample = useMemo(() => {
    const counts = new Map<string, number>();
    for (const sample of store.samples) {
      if (!sample.dateReceived.startsWith(month.key)) continue;
      counts.set(sample.sampleType, (counts.get(sample.sampleType) ?? 0) + 1);
    }
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return best ? `${best[0]} (${best[1]})` : "—";
  }, [store.samples, month.key]);

  /**
   * Days from a sample arriving to its report going out, for reports issued
   * this month. The span the client experiences, and the one they ask about.
   * Concrete waits 28 days by design, so it is stated rather than judged.
   */
  const averageTurnaround = useMemo(() => {
    const spans: number[] = [];
    for (const report of liveReports) {
      const issued = reportIssuedOn(report);
      if (!issued?.startsWith(month.key)) continue;
      const sample = store.samples.find((row) => row.id === report.sampleId);
      if (!sample?.dateReceived) continue;
      const days = Math.round(
        (new Date(issued.slice(0, 10)).getTime() - new Date(sample.dateReceived.slice(0, 10)).getTime()) / 86_400_000
      );
      if (Number.isFinite(days) && days >= 0) spans.push(days);
    }
    if (!spans.length) return "—";
    return `${Math.round((spans.reduce((sum, value) => sum + value, 0) / spans.length) * 10) / 10} ditë`;
  }, [liveReports, month.key, store.samples]);

  // --- what is next ---------------------------------------------------------
  // Was every sample and every test in the register — 771 rows of it, which is
  // the tests page with a different heading. The dashboard's job is the next
  // dozen things, with a link to the rest.
  const upcomingRows = [
    ...store.samples
      .filter((sample) => !store.tests.some((test) => test.sampleId === sample.id))
      .map((sample) => ({ kind: "sample" as const, sample, test: undefined })),
    ...unfinished.map(({ test, sample }) => ({ kind: "test" as const, test, sample }))
  ]
    .sort((left, right) => {
      const leftDate = left.test?.requiredTestDate ?? left.sample?.requiredTestDate ?? "";
      const rightDate = right.test?.requiredTestDate ?? right.sample?.requiredTestDate ?? "";
      return leftDate.localeCompare(rightDate);
    })
    .slice(0, 12);

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
        <SummaryCard label={t("dashboard.reportsIssued")} value={reportsIssuedThisMonth} tone="green" detail={month.label} href="/reports" />
        <SummaryCard label={t("dashboard.reportsToPrepare")} value={needsReport.length} tone="purple" href="/reports" />
        <SummaryCard label={t("dashboard.pendingApproval")} value={awaitingApproval} tone="purple" href="/reports" />
        <SummaryCard label={t("dashboard.delayedTests")} value={overdue} tone="red" href="/delayed" />
      </section>

      {/* The quality manager's obligations, from the same computation the
          readiness page runs. Only what is not in order appears: a calibration
          that has lapsed should be visible from the front page, and a lab in
          good order should not have to read a wall of green to learn it. */}
      <section className="mt-6 surface-card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold text-ink">{t("dashboard.quality")}</h2>
          <Link href="/quality" className="text-sm font-semibold text-lab-burgundy hover:text-lab-purple">
            {t("dashboard.qualityOpen")}
          </Link>
        </div>
        {readiness.length ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {readiness.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`block rounded-md border-l-4 p-3 transition hover:brightness-95 ${
                  item.level === "overdue"
                    ? "border-l-lab-red bg-red-50"
                    : "border-l-amber-400 bg-amber-50"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{item.title}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">§{item.clause}</span>
                </div>
                <div className="mt-0.5 text-xs leading-5 text-ink/80">{item.detail}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-green">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
            {t("dashboard.qualityClear")}
          </p>
        )}
      </section>

      <AttentionPanel
        title={t("dashboard.dueTitle")}
        description={t("dashboard.dueDescription")}
        empty={t("dashboard.dueEmpty")}
        actionLabel={t("dashboard.completionOpen")}
        items={dueNow}
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

      <AttentionPanel
        title={t("dashboard.aheadTitle")}
        description={t("dashboard.aheadDescription")}
        empty={t("dashboard.aheadEmpty")}
        actionLabel={t("dashboard.completionOpen")}
        items={scheduledAhead}
        accentClass="border-l-line"
        badgeClass="bg-lab-porcelain text-muted"
      />

      <section className="mt-6 surface-card p-4">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">{t("dashboard.upcomingTitle")}</h2>
              <p className="mt-1 text-sm text-muted">{t("dashboard.upcomingDescription")}</p>
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
                {upcomingRows.length ? (
                  upcomingRows.map((row) => (
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
          <Metric label={t("dashboard.topClient")} value={topClient} />
          <Metric label={t("dashboard.commonSample")} value={commonestSample} />
          <Metric label={t("dashboard.averageTurnaround")} value={averageTurnaround} />
          <Metric label={t("dashboard.sopRegister")} value={`${store.procedures.length}`} />
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
