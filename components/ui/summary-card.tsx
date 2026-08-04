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
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full shadow-sm ${dot}`} />
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</div>
      </div>
      <div className="mt-4 text-3xl font-semibold text-ink">{value}</div>
      {detail ? <div className="mt-2 text-xs uppercase tracking-[0.14em] text-muted">{detail}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-[1.5rem] border border-[#ddcdb7] bg-[linear-gradient(160deg,rgba(255,252,247,0.95),rgba(247,239,226,0.86))] p-5 shadow-card transition hover:-translate-y-1 hover:border-lab-burgundy/35 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-[#ead7c7]"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[#ddcdb7] bg-[linear-gradient(160deg,rgba(255,252,247,0.95),rgba(247,239,226,0.86))] p-5 shadow-card">
      {content}
    </div>
  );
}
