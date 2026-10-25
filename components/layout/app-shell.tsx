"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { SaveStatus } from "@/components/layout/save-status";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canGenerateOffers, canViewClientIdentity, isTechnicianRole } from "@/lib/permissions";

/**
 * The sidebar. A plain entry is [label, href]; a group carries its own entries
 * and renders as a collapsible section, which is what keeps Quality Management
 * from flattening the rest of the navigation as it grows.
 */
type TranslationKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];
type Translate = (key: TranslationKey) => string;
type NavEntry = readonly [TranslationKey, string];
type NavGroup = { label: TranslationKey; prefix: string; items: readonly NavEntry[] };
type NavNode = NavEntry | NavGroup;

const isGroup = (node: NavNode): node is NavGroup => !Array.isArray(node);

const navItems: readonly NavNode[] = [
  ["nav.dashboard", "/"],
  ["nav.sampleRegister", "/samples"],
  ["nav.fieldRegister", "/field"],
  ["nav.tests", "/tests"],
  ["nav.reports", "/reports"],
  // No top-level Procedurat entry: the SOP register lives under Quality
  // Management, and two sidebar entries leading to one page is how somebody
  // ends up asking which of them is the real register.
  // No Projektet entry: a client code is a company on one site, so the project
  // register was the same 154 rows with fewer columns and no way to edit them.
  // Vendndodhja and Përshkrimi moved onto the client register, which is where
  // they were always edited from.
  ["nav.clients", "/clients"],
  ["nav.employees", "/employees"],
  ["nav.delayedItems", "/delayed"],
  ["nav.monthlySummary", "/monthly-summary"],
  ["nav.offers", "/offers"],
  {
    label: "nav.quality",
    prefix: "/quality",
    items: [
      ["nav.qualityOverview", "/quality"],
      ["nav.equipment", "/quality/equipment"],
      ["nav.environment", "/quality/environment"],
      ["nav.nonconformities", "/quality/nonconformities"],
      ["nav.complaints", "/quality/complaints"],
      ["nav.proficiency", "/quality/proficiency"],
      ["nav.internalAudit", "/quality/internal-audit"],
      ["nav.sopRegister", "/quality/procedures"]
    ]
  },
  ["nav.settings", "/settings"]
];

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
  const showOffersNav = canGenerateOffers(currentUser?.email);
  const isTechnician = isTechnicianRole(currentUser?.role);

  // Technician-role employees are mobile-only: their entire job is completing the
  // tests assigned to them, which they do in the simplified /tech experience.
  // They are locked out of the desktop app — any non-/tech route sends them back
  // to /tech. (The /tech page only ever shows the current user's assigned tests.)
  // Everyone else keeps full desktop + optional mobile access.
  //
  // Must wait for store.isReady: until then, currentUser is resolved against
  // the hardcoded seed data (real accounts haven't loaded from Supabase yet),
  // which can misidentify anyone as the seed's default Technician and redirect
  // them to /tech — and since /tech routes never re-check once there, that
  // wrong redirect sticks for the rest of the session even after the real
  // (correct) role loads a moment later.
  useEffect(() => {
    if (isLoginPage || !currentUser || !store.isReady) return;
    if (isTechnician && !isTechRoute) router.replace("/tech");
  }, [isLoginPage, isTechnician, isTechRoute, currentUser, router, store.isReady]);

  if (isLoginPage) return <>{children}</>;

  const opening = (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-6 text-center">
        <img src="/brand/sarp-logo.png" alt="SARP" className="mx-auto h-auto w-36" />
        <div className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-lab-burgundy">Duke hapur hapësirën e sigurt të laboratorit</div>
        <div className="mt-1 text-xs text-muted">Ju lutemi prisni...</div>
      </div>
    </div>
  );

  // Settle who the visitor is before waiting on the data, not after.
  //
  // The register refuses anonymous reads, so a signed-out visitor's load never
  // completes. Waiting for the data first would leave them watching this
  // spinner for as long as they cared to look, with the login page one check
  // further on and unreachable. Ask for the session, send them to sign in if
  // there isn't one, and only then wait for the lab's records to arrive.
  if (auth.isConfigured && auth.isLoading) return opening;

  if (auth.isConfigured && !auth.user) {
    router.replace("/login");
    return null;
  }

  if (!store.isReady) return opening;

  if (isTechRoute) return <>{children}</>;

  // Mobile-only technicians never see the desktop shell; the effect above
  // redirects them to /tech, so render nothing in the meantime.
  if (isTechnician) return null;

  return (
    <div className="min-h-screen">
      <Link
        href="/tech"
        className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-lab-burgundy px-4 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-[#4F1535] lg:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Versioni Mobil
      </Link>
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-72 flex-col overflow-hidden bg-sidebar lg:flex">
        <div className="shrink-0 border-b border-sidebar-line px-6 py-8">
          {/* The logo is dark ink on transparent, so it needs lifting off a dark
              ground the way it does on the login panel. */}
          <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-40 brightness-0 invert" />
          <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-sidebar-active">SARP Laboratory</div>
          <div className="mt-2 text-xl font-bold tracking-[-0.01em] leading-tight text-white">{t("brand.lab")}</div>
          <div className="mt-2 max-w-[13rem] text-xs leading-5 text-sidebar-ink/70">{t("brand.domain")}</div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
          {navItems
            .filter((node) => isGroup(node) || showOffersNav || node[1] !== "/offers")
            .filter((node) => isGroup(node) || showClientIdentityNav || node[1] !== "/clients")
            .map((node) =>
              isGroup(node) ? (
                <NavGroupSection key={node.prefix} group={node} pathname={pathname} t={t} />
              ) : (
                <NavLink key={node[1]} label={node[0]} href={node[1]} pathname={pathname} t={t} />
              )
            )}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="no-print sticky top-0 z-20 border-b border-lab-steel bg-white/95 backdrop-blur">
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
              <SaveStatus />
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

/**
 * Sidebar links, in the HR app's palette: a dark plum rail with light text,
 * the open page lifted on a lighter plum rather than outlined.
 *
 * The brand colours were already identical between the two apps — #5B193F,
 * #373455, #E3E3E3. What differed was the rail: white there, dark here. The
 * dark rail is what makes the two read as one product, and it pushes the
 * content forward, which suits a screen that is mostly tables.
 */
const linkClass = (active: boolean, indented = false) =>
  `mb-1 flex min-h-11 items-center rounded-[0.7rem] text-sm font-medium transition ${indented ? "pl-7 pr-4" : "px-4"} ${
    active
      ? "bg-sidebar-accent text-sidebar-active font-semibold"
      : "text-sidebar-ink hover:bg-sidebar-accent/60 hover:text-sidebar-active"
  }`;

function NavLink({
  label,
  href,
  pathname,
  t,
  indented
}: {
  label: TranslationKey;
  href: string;
  pathname: string;
  t: Translate;
  indented?: boolean;
}) {
  // The dashboard lives at "/", which prefixes everything, so it alone matches
  // exactly.
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link href={href} className={linkClass(active, indented)}>
      {t(label)}
    </Link>
  );
}

function NavGroupSection({
  group,
  pathname,
  t
}: {
  group: NavGroup;
  pathname: string;
  t: Translate;
}) {
  const holdsCurrentPage = pathname.startsWith(group.prefix);
  // Open when one of its pages is showing, so following a link never lands the
  // user inside a section that appears closed. After that it is theirs to set.
  const [open, setOpen] = useState(holdsCurrentPage);
  useEffect(() => {
    if (holdsCurrentPage) setOpen(true);
  }, [holdsCurrentPage]);

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex min-h-11 w-full items-center justify-between rounded-[0.7rem] px-4 text-sm font-medium transition ${
          holdsCurrentPage
            ? "text-sidebar-active font-semibold"
            : "text-sidebar-ink hover:bg-sidebar-accent/60 hover:text-sidebar-active"
        }`}
      >
        <span>{t(group.label)}</span>
        <span aria-hidden className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}>
          ›
        </span>
      </button>
      {open ? (
        <div className="mt-1">
          {group.items.map(([label, href]) => (
            <NavLink key={href} label={label} href={href} pathname={pathname} t={t} indented />
          ))}
        </div>
      ) : null}
    </div>
  );
}
