"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[#D9DEE2] bg-[#FDFEFD] lg:block">
        <div className="border-b border-line px-6 py-5">
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-40" />
          <div className="mt-4 text-sm font-semibold text-ink">{t("brand.lab")}</div>
          <div className="mt-1 text-xs text-muted">{t("brand.domain")}</div>
        </div>
        <nav className="px-3 py-4">
          {navItems.map(([label, href]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`mb-1 flex min-h-10 items-center rounded-md px-3 text-sm font-medium transition ${
                  active ? "bg-lab-burgundy text-white shadow-sm" : "text-ink hover:bg-lab-mist hover:text-lab-burgundy"
                }`}
              >
                {t(label)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-line bg-[#FDFEFD]/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img src="/brand/sarp-logo.png" alt="SARP" className="h-8 w-auto lg:hidden" />
              <div>
                <div className="text-sm font-semibold text-ink">{t("app.title")}</div>
                <div className="text-xs text-muted">{t("app.subtitle")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <NotificationDropdown />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
