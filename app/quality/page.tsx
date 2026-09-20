"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { buildReadiness, readinessVerdict, type ReadinessItem, type ReadinessLevel } from "@/lib/quality-readiness";

/**
 * Gatishmëria për akreditim — the Quality Manager's single screen.
 *
 * Every register in this section owns a deadline of its own. This page exists
 * so none of them has to be opened to find out whether it is behind: an
 * assessor arriving unannounced asks about the dates that have passed, and the
 * answer should be known before they ask, not looked up while they wait.
 */
export default function QualityOverviewPage() {
  const store = useLabStore();
  const today = useMemo(() => new Date(), []);
  const items = useMemo(() => buildReadiness(store, today), [store, today]);
  const verdict = readinessVerdict(items);

  const needsAction = items.filter((item) => item.level !== "ok");

  return (
    <>
      <PageHeader
        title="Menaxhimi i Cilësisë"
        description="Gatishmëria për vizitën e akreditimit — gjendja e regjistrave sipas ISO/IEC 17025."
      />

      <div
        className={`mb-6 rounded-lg border-l-4 p-5 ${
          verdict === "overdue"
            ? "border-red-500 bg-red-50"
            : verdict === "attention"
              ? "border-amber-400 bg-amber-50"
              : "border-green-500 bg-green-50"
        }`}
      >
        <div
          className={`text-lg font-bold ${
            verdict === "overdue" ? "text-red-900" : verdict === "attention" ? "text-amber-900" : "text-green-900"
          }`}
        >
          {verdict === "ok"
            ? "Të gjitha regjistrat në rregull."
            : `${needsAction.length} ${needsAction.length === 1 ? "çështje kërkon" : "çështje kërkojnë"} vëmendje.`}
        </div>
        <p
          className={`mt-1 text-sm ${
            verdict === "overdue" ? "text-red-800" : verdict === "attention" ? "text-amber-800" : "text-green-800"
          }`}
        >
          {verdict === "overdue"
            ? "Ka afate të kaluara. Këto janë pikat që një vlerësues do t'i kërkojë i pari."
            : verdict === "attention"
              ? "Asnjë afat i kaluar, por ka pika që duhen mbyllur së shpejti."
              : "Asnjë afat i kaluar dhe asnjë regjistër me mangësi."}
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <ReadinessRow key={item.key} item={item} />
        ))}
      </div>

      <p className="mt-6 text-xs leading-5 text-muted">
        Çdo rresht numëron regjistrimet që aplikacioni mban tashmë — asgjë këtu nuk plotësohet veçmas. Klikoni për të
        parë regjistrin përkatës.
      </p>
    </>
  );
}

function ReadinessRow({ item }: { item: ReadinessItem }) {
  const tone: Record<ReadinessLevel, string> = {
    overdue: "border-red-300 bg-red-50",
    attention: "border-amber-300 bg-amber-50",
    ok: "border-line bg-white"
  };
  const dot: Record<ReadinessLevel, string> = {
    overdue: "bg-red-600",
    attention: "bg-amber-500",
    ok: "bg-green-600"
  };

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-4 rounded-lg border p-4 transition hover:shadow-sm ${tone[item.level]}`}
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot[item.level]}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-semibold text-ink">{item.title}</span>
          <span className="rounded bg-black/5 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-muted">
            §{item.clause}
          </span>
        </div>
        <div className="mt-0.5 text-sm text-muted">{item.detail}</div>
      </div>
      {item.count > 0 ? (
        <span
          className={`shrink-0 rounded-md px-3 py-1.5 text-lg font-bold tabular-nums ${
            item.level === "overdue" ? "bg-red-600 text-white" : "bg-amber-200 text-amber-900"
          }`}
        >
          {item.count}
        </span>
      ) : (
        <span className="shrink-0 text-sm font-semibold text-green-700">në rregull</span>
      )}
    </Link>
  );
}
