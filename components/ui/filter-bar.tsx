"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";

/** Filter state seeded from the query string, so a filtered view can be linked
 *  and restored. Writing back to the URL is owned by `useTablePage`, which
 *  publishes the whole set in one place. */
export function useParamState(key: string, fallback = "all") {
  const searchParams = useSearchParams();
  return useState<string>(() => searchParams?.get(key) ?? fallback);
}

/** One labelled control in the filter bar. */
export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}

/** A pair of date inputs bounding one date column. */
export function DateRangeField({
  label,
  from,
  to,
  onFrom,
  onTo
}: {
  label: string;
  from: string;
  to: string;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
}) {
  const { t } = useI18n();
  return (
    <fieldset className="min-w-0">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <div className="mt-1 flex items-center gap-1.5">
        <input
          type="date"
          value={from}
          onChange={(event) => onFrom(event.target.value)}
          aria-label={`${label} — ${t("filters.from")}`}
          className="input min-w-0 flex-1"
        />
        <span className="shrink-0 text-xs text-muted">–</span>
        <input
          type="date"
          value={to}
          onChange={(event) => onTo(event.target.value)}
          aria-label={`${label} — ${t("filters.to")}`}
          className="input min-w-0 flex-1"
        />
      </div>
    </fieldset>
  );
}

export type FilterChip = {
  /** Stable identity for React and for the remove handler. */
  key: string;
  /** What is switched on, phrased as the user would say it. */
  label: string;
  onRemove: () => void;
};

/**
 * The active-filter row: how many rows survived, what is narrowing them, and a
 * one-click way out of each. Every chip is a button - clicking removes that
 * filter. Nothing here is ever the only place a filter is visible; the controls
 * above stay in sync.
 */
export function FilterChips({
  chips,
  resultCount,
  onClearAll,
  countLabel
}: {
  chips: FilterChip[];
  resultCount: number;
  onClearAll: () => void;
  /** What is being counted. Defaults to samples. */
  countLabel?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="no-print mb-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-ink" aria-live="polite">
        {resultCount} {countLabel ?? t("filters.results")}
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-lab-mist px-2.5 py-1 text-xs font-semibold text-lab-navy transition hover:border-lab-burgundy hover:text-lab-burgundy focus:outline-none focus:ring-2 focus:ring-lab-burgundy/20"
        >
          <span>{chip.label}</span>
          <span aria-hidden="true" className="text-sm leading-none">×</span>
          <span className="sr-only">{t("filters.remove")}</span>
        </button>
      ))}
      {chips.length > 0 ? (
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-full px-2 py-1 text-xs font-semibold text-muted underline-offset-2 transition hover:text-lab-burgundy hover:underline focus:outline-none focus:ring-2 focus:ring-lab-burgundy/20"
        >
          {t("filters.clearAll")}
        </button>
      ) : null}
    </div>
  );
}
