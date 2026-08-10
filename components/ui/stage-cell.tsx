"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { useI18n } from "@/lib/i18n";
import type { Lifecycle } from "@/lib/sample-stage";

// The unified lifecycle stage (badge) with a small muted sub-detail beneath it,
// used across the Test / Report registers and the dashboard. When `late` is set,
// the detail is shown in the late colour and prefixed as the reason.
export function StageCell({ lifecycle, late = false }: { lifecycle: Lifecycle; late?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-start gap-0.5">
      <StatusBadge status={lifecycle.stage} />
      <span className={`text-[11px] leading-tight ${late ? "font-semibold text-brand-late" : "text-muted"}`}>
        {t(`lifecycleDetail.${lifecycle.detail}` as never)}
      </span>
    </div>
  );
}
