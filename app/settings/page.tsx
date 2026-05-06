import { PageHeader } from "@/components/ui/page-header";

export default function SettingsPage() {
  const settings = ["Rregullat e numërtimit", "Formati i raportit", "Ruajtja në Supabase", "Modulet e ardhshme"];

  return (
    <>
      <PageHeader title="Cilësimet" description="Konfigurime për Supabase, numërtimin, tekstet e raporteve, ruajtjen dhe nënshkrimet digjitale." />
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((title) => (
          <div key={title} className="surface-card p-5">
            <h2 className="text-base font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-muted">Gati për t’u lidhur me konfigurimet e prodhimit pasi të verifikohet procesi i parë.</p>
          </div>
        ))}
      </div>
    </>
  );
}
