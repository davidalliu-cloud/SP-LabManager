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
    blue: "bg-lab-blue",
    green: "bg-lab-green",
    amber: "bg-lab-amber",
    red: "bg-lab-red",
    purple: "bg-lab-purple",
    gray: "bg-slate-500"
  }[tone];
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <div className="text-sm font-medium text-muted">{label}</div>
      </div>
      <div className="mt-3 text-3xl font-semibold text-ink">{value}</div>
      {detail ? <div className="mt-1 text-xs text-muted">{detail}</div> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-md border border-line bg-[#FDFEFD] p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-lab-steel hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-lab-mist"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-md border border-line bg-[#FDFEFD] p-4 shadow-sm">
      {content}
    </div>
  );
}
