import { getStatusTone } from "@/lib/status";
import { useI18n } from "@/lib/i18n";
import type { ReportStatus, SampleStatus, TestStatus } from "@/lib/types";

const toneClass = {
  gray: "bg-slate-100 text-slate-700 ring-slate-200",
  blue: "bg-lab-mist text-lab-navy ring-cyan-100",
  amber: "bg-[#fff3de] text-[#a9761b] ring-[#ffe0a6]",
  green: "bg-[#e7f8f1] text-brand-green ring-[#bfeeda]",
  purple: "bg-fuchsia-50 text-lab-purple ring-fuchsia-100",
  red: "bg-[#ffeaea] text-brand-late ring-[#ffcccc]",
  darkGreen: "bg-brand-green text-white ring-[#0e9d6e]"
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
