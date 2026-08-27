"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export const DEFAULT_PAGE_SIZE = 50;

/**
 * Page state for a register table, and the single owner of the register's
 * query string.
 *
 * - Reads the initial page from `?page=` so a view can be linked and the back
 *   button behaves.
 * - Clamps to the available range, because a shared link goes stale as rows
 *   are added and removed.
 * - Resets to page 1 whenever `params` changes. Without this you filter down
 *   to three rows while sitting on page 7 and get an empty table.
 * - Publishes `params` (the active filters) plus `page` together. Filters and
 *   pagination must not each write the URL, or one overwrites the other's keys.
 *
 * `params` should contain only filters that are actually set - anything empty
 * is left out of the URL so a default view has a clean address.
 */
export function useTablePage(
  total: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
  params: Record<string, string> = {}
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [requested, setRequested] = useState(() => {
    const raw = Number(searchParams?.get("page"));
    return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1;
  });

  // Serialised so the value, not the object identity, drives resets and effects.
  const paramKey = JSON.stringify(params);

  // Adjusted during render rather than in an effect, so we never paint one
  // frame of the wrong page after a filter change.
  const lastParamKey = useRef(paramKey);
  if (lastParamKey.current !== paramKey) {
    lastParamKey.current = paramKey;
    if (requested !== 1) setRequested(1);
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requested), pageCount);

  useEffect(() => {
    // `params` is read through paramKey, which changes exactly when its
    // contents do.
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(JSON.parse(paramKey) as Record<string, string>)) {
      if (value) next.set(key, value);
    }
    if (page > 1) next.set("page", String(page));
    const desired = next.toString();
    if ((searchParams?.toString() ?? "") === desired) return; // in sync - stops the replace loop
    router.replace(desired ? `${pathname}?${desired}` : pathname, { scroll: false });
  }, [paramKey, page, pathname, router, searchParams]);

  return {
    page,
    pageCount,
    pageSize,
    setPage: setRequested,
    /** 1-based index of the first row shown, or 0 when there are none. */
    from: total === 0 ? 0 : (page - 1) * pageSize + 1,
    to: Math.min(page * pageSize, total)
  };
}

/** Returns just the rows for the current page. Sort the full set first. */
export function paginate<T>(rows: T[], page: number, pageSize: number): T[] {
  return rows.slice((page - 1) * pageSize, page * pageSize);
}

function PagerButton({
  onClick,
  disabled,
  label,
  children
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="rounded-md border border-line bg-white px-2.5 py-1 font-semibold text-ink transition hover:border-lab-burgundy hover:text-lab-burgundy focus:outline-none focus:ring-2 focus:ring-lab-burgundy/20 disabled:cursor-not-allowed disabled:border-line disabled:bg-lab-mist disabled:text-slate-400 disabled:hover:border-line"
    >
      {children}
    </button>
  );
}

/**
 * Row counter plus page controls. Sits inside the table card, below the table.
 * Hidden when printing - the print view shows every row.
 */
export function Pagination({
  page,
  pageCount,
  from,
  to,
  total,
  unfilteredTotal,
  onPage
}: {
  page: number;
  pageCount: number;
  from: number;
  to: number;
  total: number;
  /** Total before filtering, so the user can see what is being hidden. */
  unfilteredTotal?: number;
  onPage: (page: number) => void;
}) {
  const { t } = useI18n();
  const hidden = unfilteredTotal !== undefined && unfilteredTotal > total;

  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-muted">
      <span aria-live="polite">
        {total === 0
          ? t("table.noRows")
          : `${t("table.showing")} ${from}–${to} ${t("table.of")} ${total}`}
        {hidden ? <span className="text-slate-400"> {`· ${t("table.filteredFrom")} ${unfilteredTotal}`}</span> : null}
      </span>

      {pageCount > 1 ? (
        <div className="flex items-center gap-1">
          <PagerButton onClick={() => onPage(1)} disabled={page === 1} label={t("table.first")}>
            {"«"}
          </PagerButton>
          <PagerButton onClick={() => onPage(page - 1)} disabled={page === 1} label={t("table.previous")}>
            {"‹"}
          </PagerButton>
          <span className="px-2 font-semibold text-ink">
            {`${t("table.page")} ${page} ${t("table.of")} ${pageCount}`}
          </span>
          <PagerButton onClick={() => onPage(page + 1)} disabled={page === pageCount} label={t("table.next")}>
            {"›"}
          </PagerButton>
          <PagerButton onClick={() => onPage(pageCount)} disabled={page === pageCount} label={t("table.last")}>
            {"»"}
          </PagerButton>
        </div>
      ) : null}
    </div>
  );
}
