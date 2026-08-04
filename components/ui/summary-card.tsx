import Link from "next/link";

export function SummaryCard({
  label,
  value,
  detail,
  tone = "blue",
  href
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "blue" | "green" | "amber" | "red" | "purple" | "gray";
  href?: string;
}) {
  const dot = {
    blue: "bg-lab-cyan",
    green: "bg-lab-green",
    amber: "bg-lab-gold",
    red: "bg-lab-terracotta",
    purple: "bg-lab-burgundy",
    gray: "bg-lab-olive"
  }[tone];
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</span>
      </div>
      <div className="mt-4 text-3xl font-bold tracking-[-0.02em] text-ink">{value}</div>
      {detail ? <div className="mt-2 text-xs uppercase tracking-[0.1em] text-muted">{detail}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-line bg-white p-5 transition hover:border-lab-burgundy focus:outline-none focus:ring-2 focus:ring-lab-burgundy/15"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      {content}
    </div>
  );
}
