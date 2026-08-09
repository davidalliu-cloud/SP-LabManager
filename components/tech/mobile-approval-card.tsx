import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ReportStatus, TestStatus } from "@/lib/types";

export function MobileApprovalCard({
  href,
  eyebrow,
  title,
  subtitle,
  status
}: {
  href: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  status: TestStatus | ReportStatus;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-line bg-white p-4 shadow-sm active:bg-lab-porcelain"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.1em] text-lab-burgundy">{eyebrow}</div>
          <div className="mt-1 text-sm font-semibold text-ink">{title}</div>
          <div className="mt-1 text-xs text-muted">{subtitle}</div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-3 text-right text-xs font-semibold text-lab-burgundy">Shqyrto &rarr;</div>
    </Link>
  );
}
