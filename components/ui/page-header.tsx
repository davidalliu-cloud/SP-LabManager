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
      <div className="relative overflow-hidden rounded-[1.8rem] border border-[#ddcdb7] bg-[linear-gradient(135deg,rgba(255,250,242,0.92),rgba(242,231,214,0.82))] px-6 py-5 shadow-card">
        <div className="pointer-events-none absolute right-5 top-4 h-10 w-10 rounded-full border-[3px] border-lab-burgundy/10" />
        <div className="pointer-events-none absolute bottom-[-1.25rem] right-14 h-14 w-14 rounded-[35%_65%_70%_30%/42%_35%_65%_58%] bg-[rgba(216,161,59,0.16)]" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-lab-burgundy/75">SARP workflow</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-[0.01em] text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
