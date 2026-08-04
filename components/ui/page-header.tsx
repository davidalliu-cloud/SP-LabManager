export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="relative overflow-hidden border border-[#d5c8b7] bg-[linear-gradient(180deg,#111111_0,#111111_1rem,transparent_1rem),linear-gradient(180deg,rgba(255,252,248,0.98),rgba(245,238,229,0.94))] px-6 py-5 shadow-card">
        <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-lab-burgundy/75">SARP workflow</div>
        <div className="mt-3 h-px w-full bg-[#d5c8b7]" />
        <h1 className="mt-5 text-3xl font-semibold uppercase tracking-[-0.04em] text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
