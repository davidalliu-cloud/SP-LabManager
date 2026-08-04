"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";

const navItems = [
  ["nav.dashboard", "/"],
  ["nav.sampleRegister", "/samples"],
  ["nav.newSample", "/samples/new"],
  ["nav.tests", "/tests"],
  ["nav.reports", "/reports"],
  ["nav.procedures", "/procedures"],
  ["nav.clients", "/clients"],
  ["nav.projects", "/projects"],
  ["nav.employees", "/employees"],
  ["nav.delayedItems", "/delayed"],
  ["nav.monthlySummary", "/monthly-summary"],
  ["nav.users", "/users"],
  ["nav.settings", "/settings"]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const store = useLabStore();
  const { t } = useI18n();
  const isLoginPage = pathname === "/login";
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentityNav = canViewClientIdentity(currentUser?.role);

  if (isLoginPage) return <>{children}</>;

  if (auth.isConfigured && auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(216,161,59,0.14),transparent_220px),linear-gradient(180deg,#fbf4e8_0%,#f6efe4_100%)] px-6">
        <div className="w-full max-w-sm rounded-[2rem] border border-[#dccab1] bg-[rgba(255,252,247,0.9)] p-6 text-center shadow-card backdrop-blur-sm">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mx-auto h-auto w-36" />
          <div className="mt-5 text-sm font-semibold text-ink">Duke hapur hapësirën e sigurt të laboratorit</div>
          <div className="mt-1 text-xs text-muted">Ju lutemi prisni...</div>
        </div>
      </div>
    );
  }

  if (auth.isConfigured && !auth.user) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-72 overflow-hidden border-r border-[#d7c8b4] bg-[linear-gradient(180deg,rgba(255,251,244,0.96),rgba(242,232,216,0.96))] lg:block">
        <div className="absolute -left-12 top-10 h-32 w-32 rounded-full bg-[rgba(216,161,59,0.18)]" />
        <div className="absolute bottom-20 right-[-2.5rem] h-24 w-24 rounded-[35%_65%_70%_30%/42%_35%_65%_58%] bg-[rgba(107,174,173,0.18)]" />
        <div className="relative border-b border-[#dccab1] px-6 py-7">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-40" />
          <div className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-lab-burgundy/80">SARP Laboratory</div>
          <div className="mt-2 text-lg font-semibold leading-tight text-ink">{t("brand.lab")}</div>
          <div className="mt-1 max-w-[13rem] text-xs leading-5 text-muted">{t("brand.domain")}</div>
        </div>
        <nav className="relative px-4 py-5">
          {navItems.filter(([, href]) => showClientIdentityNav || !["/clients", "/projects"].includes(href)).map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mb-2 flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition ${
                  active
                    ? "bg-lab-burgundy text-white shadow-card"
                    : "border border-transparent text-ink hover:border-[#dccab1] hover:bg-[rgba(255,250,243,0.84)] hover:text-lab-burgundy"
                }`}
              >
                {t(label)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-[#dccab1] bg-[rgba(251,244,232,0.88)] backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img src="/brand/sarp-logo.png" alt="SARP" className="h-8 w-auto lg:hidden" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lab-burgundy/80">Materials testing</div>
                <div className="text-sm font-semibold text-ink">{t("app.title")}</div>
                <div className="text-xs text-muted">{t("app.subtitle")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <NotificationDropdown />
              {auth.isConfigured ? (
                <button
                  type="button"
                  onClick={() => auth.signOut()}
                  className="rounded-full border border-[#d7c9b4] bg-[rgba(255,252,247,0.92)] px-3 py-2 text-xs font-semibold text-ink transition hover:border-lab-burgundy hover:text-lab-burgundy"
                >
                  Dil
                </button>
              ) : null}
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="pointer-events-none absolute right-6 top-1 hidden h-16 w-16 rounded-[42%_58%_55%_45%/44%_36%_64%_56%] bg-[rgba(107,174,173,0.12)] lg:block" />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
