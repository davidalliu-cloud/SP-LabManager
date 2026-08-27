"use client";

import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";

/**
 * Whether the last change is actually on the server, stated plainly.
 *
 * Every failure path used to end in console.warn. This is the difference
 * between an app that can quietly lose a morning's results and one that tells
 * you it has.
 */
export function SaveStatus() {
  const store = useLabStore();
  const { t } = useI18n();
  const state = store.saveState;

  if (state.kind === "saved") {
    return (
      <span className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-muted" aria-live="polite">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green" aria-hidden="true" />
        {t("save.saved")}
      </span>
    );
  }

  if (state.kind === "saving") {
    return (
      <span className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-muted" aria-live="polite">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lab-gold" aria-hidden="true" />
        {t("save.saving")}
      </span>
    );
  }

  if (state.kind === "offline") {
    return (
      <span
        className="no-print inline-flex items-center gap-1.5 rounded-md border border-[#f0a93a] bg-brand-risk px-2 py-1 text-xs font-semibold text-ink"
        aria-live="assertive"
        title={t("save.offlineHint")}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#b8791f]" aria-hidden="true" />
        {t("save.offline")}
      </span>
    );
  }

  // error / conflict - both mean the change is NOT on the server.
  const isConflict = state.kind === "conflict";
  return (
    <span
      className="no-print inline-flex items-center gap-2 rounded-md border border-[#ff3d3d] bg-brand-late px-2 py-1 text-xs font-semibold text-ink"
      aria-live="assertive"
      title={state.kind === "error" ? state.message : undefined}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-lab-red" aria-hidden="true" />
      {isConflict ? t("save.conflict") : t("save.error")}
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded border border-ink/20 bg-white/70 px-1.5 py-0.5 font-semibold text-ink hover:bg-white"
      >
        {t("save.reload")}
      </button>
    </span>
  );
}
