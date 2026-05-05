import { getStatusTone } from "@/lib/status";
import { useI18n } from "@/lib/i18n";
import type { ReportStatus, SampleStatus, TestStatus } from "@/lib/types";

const toneClass = {
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  blue: "bg-lab-mist text-lab-navy ring-cyan-100",
  amber: "bg-amber-50 text-lab-amber ring-amber-100",
  green: "bg-green-50 text-lab-green ring-green-100",
  purple: "bg-fuchsia-50 text-lab-purple ring-fuchsia-100",
  red: "bg-red-50 text-lab-red ring-red-100",
  darkGreen: "bg-emerald-100 text-emerald-900 ring-emerald-200"
};

export function StatusBadge({ status }: { status: TestStatus | SampleStatus | ReportStatus }) {
  const tone = getStatusTone(status);
  const { t } = useI18n();
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${toneClass[tone]}`}>
      {t(`status.${status}` as never)}
    </span>
  );
}
