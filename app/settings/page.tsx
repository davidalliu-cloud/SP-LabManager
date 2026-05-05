import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Production configuration placeholders for Supabase, numbering, report wording, storage, and digital signatures." />
      <div className="grid gap-4 md:grid-cols-2">
        {["Numbering rules", "Report template", "Supabase storage", "Future modules"].map((title) => (
          <div key={title} className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-muted">Ready to connect to production settings after the first workflow is validated.</p>
          </div>
        ))}
      </div>
    </>
  );
}
