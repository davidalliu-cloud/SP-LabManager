import Link from "next/link";
import { StageCell } from "@/components/ui/stage-cell";
import { formatEuropeanDate } from "@/lib/date-format";
import { testLifecycle } from "@/lib/sample-stage";
import type { LabTest, Sample } from "@/lib/types";

export function MobileTestCard({ test, sample }: { test: LabTest; sample?: Sample }) {
  return (
    <Link
      href={`/tech/tests/${test.id}`}
      className="block rounded-lg border border-line bg-white p-4 shadow-sm active:bg-lab-porcelain"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.1em] text-lab-burgundy">{test.testCode}</div>
          <div className="mt-1 text-sm font-semibold text-ink">{test.testType}</div>
          <div className="mt-1 text-xs text-muted">{sample?.sampleCode ?? "-"} &middot; {sample?.sampleType ?? "-"}</div>
        </div>
        <StageCell lifecycle={testLifecycle(test, [])} />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>Due {formatEuropeanDate(test.requiredTestDate)}</span>
        <span className="font-semibold text-lab-burgundy">Open &rarr;</span>
      </div>
    </Link>
  );
}
