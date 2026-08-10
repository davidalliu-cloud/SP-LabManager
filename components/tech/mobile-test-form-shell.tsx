import { StageCell } from "@/components/ui/stage-cell";
import { formatEuropeanDate } from "@/lib/date-format";
import { testLifecycle } from "@/lib/sample-stage";
import type { LabTest, Sample } from "@/lib/types";

export function MobileTestFormShell({
  test,
  sample,
  title,
  description,
  hasWorksheetData,
  canEdit,
  onComplete,
  children
}: {
  test: LabTest;
  sample?: Sample;
  title: string;
  description?: string;
  hasWorksheetData: boolean;
  canEdit: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.1em] text-lab-burgundy">{test.testCode}</div>
          <h1 className="mt-1 text-lg font-bold text-ink">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </div>
        <StageCell lifecycle={testLifecycle(test, [])} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg border border-line bg-white p-4 text-sm">
        <Info label="Register No." value={sample?.sampleCode} />
        <Info label="Sample type" value={sample?.sampleType} />
        <Info label="Standard" value={test.standard} />
        <Info label="Due" value={formatEuropeanDate(test.requiredTestDate)} />
      </div>

      {!canEdit ? (
        <div className="mt-4 rounded-lg border border-lab-burgundy/20 bg-lab-porcelain p-3 text-sm text-ink">
          This test can no longer be edited from here (status: {test.status}).
        </div>
      ) : null}

      <div className="mt-4">{children}</div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <button
          type="button"
          onClick={onComplete}
          disabled={!hasWorksheetData || !canEdit}
          className="btn-success w-full disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Dërgo për verifikim / Submit for verification
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 font-medium text-ink">{value || "-"}</div>
    </div>
  );
}
