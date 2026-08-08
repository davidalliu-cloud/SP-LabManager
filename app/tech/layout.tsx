"use client";

import { InstallPrompt } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { useAuth } from "@/lib/auth";
import { useLabStore } from "@/lib/lab-store";

export default function TechLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);

  return (
    <div className="min-h-screen bg-lab-porcelain">
      <ServiceWorkerRegistration />
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/brand/sarp-logo.png" alt="SARP" className="h-8 w-auto" />
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lab-burgundy">SARP LAB</div>
              <div className="text-sm font-semibold text-ink">{currentUser?.fullName ?? "Technician"}</div>
            </div>
          </div>
          {auth.isConfigured ? (
            <button
              type="button"
              onClick={() => auth.signOut()}
              className="rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-ink"
            >
              Dil / Sign out
            </button>
          ) : null}
        </div>
        <InstallPrompt />
      </header>
      <main className="px-4 py-5 pb-24">{children}</main>
    </div>
  );
}
