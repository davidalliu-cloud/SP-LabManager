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
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#101010_0,#101010_18px,transparent_18px),linear-gradient(180deg,#fcf8f2_0%,#f4efe7_100%)] px-6">
        <div className="w-full max-w-sm border border-[#d5c8b7] bg-[rgba(255,251,246,0.96)] p-6 text-center shadow-card backdrop-blur-sm">
          <img src="/brand/sarp-logo.png" alt="SARP" className="mx-auto h-auto w-36" />
          <div className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-lab-burgundy">Duke hapur hapësirën e sigurt të laboratorit</div>
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
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-72 overflow-hidden border-r border-[#d5c8b7] bg-[rgba(255,251,246,0.96)] lg:block">
        <div className="absolute inset-x-0 top-0 h-4 bg-[#101010]" />
        <div className="relative border-b border-[#d5c8b7] px-6 py-8">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-40" />
          <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-lab-burgundy/80">SARP Laboratory</div>
          <div className="mt-2 text-xl font-semibold uppercase tracking-[-0.03em] leading-tight text-ink">{t("brand.lab")}</div>
          <div className="mt-2 max-w-[13rem] text-xs leading-5 text-muted">{t("brand.domain")}</div>
        </div>
        <nav className="relative px-4 py-5">
          {navItems.filter(([, href]) => showClientIdentityNav || !["/clients", "/projects"].includes(href)).map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mb-2 flex min-h-11 items-center border px-4 text-sm font-medium transition ${
                  active
                    ? "border-lab-burgundy bg-lab-burgundy text-white shadow-card"
                    : "border-transparent text-ink hover:border-[#d5c8b7] hover:bg-[rgba(255,250,243,0.84)] hover:text-lab-burgundy"
                }`}
              >
                {t(label)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-[#d5c8b7] bg-[rgba(252,248,242,0.9)] backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img src="/brand/sarp-logo.png" alt="SARP" className="h-8 w-auto lg:hidden" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lab-burgundy/80">Materials testing</div>
                <div className="text-sm font-semibold uppercase tracking-[-0.01em] text-ink">{t("app.title")}</div>
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
                  className="border border-[#cdbba3] bg-[rgba(255,253,249,0.96)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition hover:border-lab-burgundy hover:text-lab-burgundy"
                >
                  Dil
                </button>
              ) : null}
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
