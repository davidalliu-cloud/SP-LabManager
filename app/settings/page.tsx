"use client";

import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/lib/auth";
import { useLabStore } from "@/lib/lab-store";

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-5">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-muted">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const auth = useAuth();
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);

  return (
    <>
      <PageHeader title="Cilësimet" description="Statusi i sistemit, rregullat e numërtimit dhe profili juaj." />
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Statusi i sistemit">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${auth.isConfigured ? "bg-lab-green" : "bg-lab-amber"}`} />
            <span className="font-medium text-ink">{auth.isConfigured ? "Lidhur me Supabase" : "Supabase nuk është konfiguruar"}</span>
          </div>
          <p className="mt-2">
            {auth.isConfigured
              ? "Të dhënat ruhen në kohë reale dhe ndahen mes gjithë përdoruesve të loguar."
              : "Aplikacioni po përdor të dhëna lokale demo derisa të vendosen çelësat e Supabase."}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Kampionë</dt>
              <dd className="text-lg font-bold text-ink">{store.samples.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Teste</dt>
              <dd className="text-lg font-bold text-ink">{store.tests.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Klientë</dt>
              <dd className="text-lg font-bold text-ink">{store.clients.length}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Punonjës</dt>
              <dd className="text-lg font-bold text-ink">{store.users.length}</dd>
            </div>
          </dl>
        </InfoCard>

        <InfoCard title="Profili im">
          {currentUser ? (
            <dl className="space-y-2">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Emri</dt>
                <dd className="font-medium text-ink">{currentUser.fullName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Email</dt>
                <dd className="font-medium text-ink">{currentUser.email}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Roli</dt>
                <dd className="font-medium text-ink">{currentUser.role}</dd>
              </div>
            </dl>
          ) : (
            <p>Asnjë përdorues i identifikuar.</p>
          )}
          <p className="mt-3 border-t border-line pt-3 text-xs">
            Për të ndryshuar emrin, rolin ose fushat e punës, shkoni te <span className="font-medium text-ink">Punonjësit</span>.
          </p>
        </InfoCard>

        <InfoCard title="Rregullat e numërtimit">
          <ul className="space-y-2">
            <li>
              <span className="font-medium text-ink">Kodi i kampionit</span> — VVVV-MM-### sipas muajit të pranimit (p.sh. 2026-08-001).
            </li>
            <li>
              <span className="font-medium text-ink">Kodi i klientit</span> — K## në rend ngjitës (p.sh. K01, K02).
            </li>
            <li>
              <span className="font-medium text-ink">Kodi i testit</span> — TEST-2026-#### në rend ngjitës.
            </li>
            <li>
              <span className="font-medium text-ink">Numri i raportit</span> — LAB-R-2026-#### në rend ngjitës.
            </li>
          </ul>
        </InfoCard>

        <InfoCard title="Gjuha e ndërfaqes">
          <p>
            Gjuha e ndërfaqes ndryshohet nga menyja <span className="font-medium text-ink">Gjuha</span> në krye të faqes dhe zbatohet menjëherë për sesionin aktual.
          </p>
        </InfoCard>
      </div>
    </>
  );
}
