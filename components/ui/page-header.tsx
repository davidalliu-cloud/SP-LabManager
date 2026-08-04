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
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">SARP workflow</div>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.02em] text-ink">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
