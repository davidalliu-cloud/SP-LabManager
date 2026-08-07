"use client";

import { useI18n } from "@/lib/i18n";
import { SAMPLE_STAGES, sampleStageIndex } from "@/lib/sample-stage";
import type { SampleStatus } from "@/lib/types";

// Horizontal progress of the agreed sample lifecycle. The current stage is
// highlighted; earlier stages read as done, later stages as upcoming.
export function SampleStageStepper({ status }: { status: SampleStatus }) {
  const { t } = useI18n();
  const currentIndex = sampleStageIndex(status);

  return (
    <div className="surface-card p-4">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Faza e kampionit / Sample stage</div>
      <ol className="flex flex-wrap items-center gap-y-3">
        {SAMPLE_STAGES.map((stage, index) => {
          const done = index < currentIndex;
          const current = index === currentIndex;
          const circleClass = current
            ? "border-lab-burgundy bg-lab-burgundy text-white"
            : done
              ? "border-brand-green bg-brand-green text-white"
              : "border-line bg-white text-muted";
          const labelClass = current ? "font-semibold text-lab-burgundy" : done ? "text-ink" : "text-muted";
          return (
            <li key={stage} className="flex items-center">
              <div className="flex items-center gap-2">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${circleClass}`}>
                  {done ? "✓" : index + 1}
                </span>
                <span className={`whitespace-nowrap text-xs ${labelClass}`}>{t(`status.${stage}` as never)}</span>
              </div>
              {index < SAMPLE_STAGES.length - 1 ? (
                <span className={`mx-2 h-px w-6 ${index < currentIndex ? "bg-brand-green" : "bg-line"}`} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
