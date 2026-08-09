"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";

const navItems = [
  ["nav.dashboard", "/"],
  ["nav.sampleRegister", "/samples"],
  ["nav.tests", "/tests"],
  ["nav.reports", "/reports"],
  ["nav.procedures", "/procedures"],
  ["nav.clients", "/clients"],
  ["nav.projects", "/projects"],
  ["nav.employees", "/employees"],
  ["nav.delayedItems", "/delayed"],
  ["nav.monthlySummary", "/monthly-summary"],
  ["nav.settings", "/settings"]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const store = useLabStore();
  const { t } = useI18n();
  const isLoginPage = pathname === "/login";
  const isTechRoute = pathname === "/tech" || pathname.startsWith("/tech/");
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const showClientIdentityNav = canViewClientIdentity(currentUser?.role);
  const isTechnician = currentUser?.role === "Technician";

  // Technicians land in the simplified mobile experience by default (only
  // when they hit the bare dashboard root, e.g. right after login) — but
  // from there they're free to open any desktop page too, same as everyone
  // else. Mobile and desktop are both always available to every employee;
  // this only picks a sensible starting point, it never locks anyone out of
  // either mode. Every employee can open /tech directly regardless of role
  // (any active employee can be assigned a test) — the /tech page itself
  // only ever shows tests assigned to the current user, so it's a harmless
  // empty list for someone with nothing assigned yet.
  useEffect(() => {
    if (isLoginPage) return;
    if (!currentUser) return;
    if (isTechnician && pathname === "/") router.replace("/tech");
  }, [isLoginPage, isTechnician, pathname, currentUser, router]);

  if (isLoginPage) return <>{children}</>;

  if (auth.isConfigured && auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-sm rounded-lg border border-line bg-white p-6 text-center">
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

  if (isTechRoute) return <>{children}</>;

  return (
    <div className="min-h-screen">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-72 overflow-hidden border-r border-line bg-white lg:block">
        <div className="border-b border-line px-6 py-8">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-40" />
          <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">SARP Laboratory</div>
          <div className="mt-2 text-xl font-bold tracking-[-0.01em] leading-tight text-ink">{t("brand.lab")}</div>
          <div className="mt-2 max-w-[13rem] text-xs leading-5 text-muted">{t("brand.domain")}</div>
        </div>
        <nav className="px-3 py-5">
          {navItems.filter(([, href]) => showClientIdentityNav || !["/clients", "/projects"].includes(href)).map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mb-1 flex min-h-11 items-center border-l-2 px-4 text-sm font-medium transition ${
                  active
                    ? "border-lab-burgundy bg-lab-burgundy/5 text-lab-burgundy font-semibold hover:bg-lab-burgundy hover:text-white"
                    : "border-transparent text-ink hover:bg-lab-burgundy hover:text-white"
                }`}
              >
                {t(label)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img src="/brand/sarp-logo.png" alt="SARP" className="h-8 w-auto lg:hidden" />
              <div className="hidden sm:block">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">Materials testing</div>
                <div className="text-sm font-semibold tracking-[-0.01em] text-ink">{t("app.title")}</div>
                <div className="text-xs text-muted">{t("app.subtitle")}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/tech"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-line bg-white px-2.5 py-2 text-xs font-semibold text-ink transition hover:border-lab-burgundy hover:bg-lab-burgundy hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
                  <rect x="7" y="2" width="10" height="20" rx="2" />
                  <line x1="11" y1="18" x2="13" y2="18" />
                </svg>
                <span className="hidden sm:inline">Versioni Mobil / Mobile view</span>
              </Link>
              <LanguageSwitcher />
              <NotificationDropdown />
              {auth.isConfigured ? (
                <button
                  type="button"
                  onClick={() => auth.signOut()}
                  className="rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-ink transition hover:border-lab-burgundy hover:bg-lab-burgundy hover:text-white"
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
