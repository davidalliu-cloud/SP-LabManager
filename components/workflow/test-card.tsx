import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { formatEuropeanDate } from "@/lib/date-format";
import { isApproaching, isOverdue } from "@/lib/status";
import { useLabStore } from "@/lib/lab-store";
import { testLifecycle } from "@/lib/sample-stage";
import type { Client, LabTest, Project, Sample, LabUser } from "@/lib/types";
import { StageCell } from "@/components/ui/stage-cell";

export function TestCard({
  test,
  sample,
  client,
  project,
  technician,
  showClientIdentity = false
}: {
  test: LabTest;
  sample?: Sample;
  client?: Client;
  project?: Project;
  technician?: LabUser;
  showClientIdentity?: boolean;
}) {
  const { t } = useI18n();
  const store = useLabStore();
  const overdue = isOverdue(test.requiredTestDate, test.status);
  const soon = isApproaching(test.requiredTestDate);
  const unitLabel = sample?.sampleType.includes("Rebar") || sample?.sampleType.includes("Shufër Çeliku") ? "mostra" : t("test.cubes");
  const batchLabel = test.scheduledAgeDays ? `${test.cubeCount} ${unitLabel} / ${test.scheduledAgeDays}d` : `${test.cubeCount} ${unitLabel}`;
  return (
    <Link
      href={`/tests/${test.id}`}
      className={`block rounded-md border bg-white p-3 transition hover:border-lab-burgundy ${
        overdue ? "border-red-300" : soon ? "border-amber-300" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-ink">{sample?.sampleCode ?? test.testCode}</div>
          <div className="mt-1 text-xs text-muted">{showClientIdentity ? client?.clientName : client?.clientCode ?? "Klient në pritje"}</div>
        </div>
        <StageCell lifecycle={testLifecycle(test, store.reports)} late={overdue} />
      </div>
      <div className="mt-3 text-sm text-ink">{test.testType}</div>
      <div className="mt-1 text-xs text-muted">{showClientIdentity ? project?.projectName : "Identiteti i klientit është i kufizuar"}</div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted">{t("test.batch")}</span>
          <div className="font-medium text-ink">{batchLabel}</div>
        </div>
        <div>
          <span className="text-muted">{t("test.required")}</span>
          <div className="font-medium text-ink">{formatEuropeanDate(test.requiredTestDate)}</div>
        </div>
        <div className="col-span-2">
          <span className="text-muted">{t("test.technician")}</span>
          <div className="font-medium text-ink">{technician?.fullName ?? t("test.unassigned")}</div>
        </div>
      </div>
    </Link>
  );
}
