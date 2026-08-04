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
      <div className={`h-1 w-14 ${dot}`} />
      <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</div>
      <div className="mt-4 text-3xl font-semibold uppercase tracking-[-0.04em] text-ink">{value}</div>
      {detail ? <div className="mt-2 text-xs uppercase tracking-[0.16em] text-muted">{detail}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block border border-[#d5c8b7] bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(245,238,229,0.94))] p-5 shadow-card transition hover:-translate-y-1 hover:border-lab-burgundy/35 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-[#ead7c7]"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="border border-[#d5c8b7] bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(245,238,229,0.94))] p-5 shadow-card">
      {content}
    </div>
  );
}
