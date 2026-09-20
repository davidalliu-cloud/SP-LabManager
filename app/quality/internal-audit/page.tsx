"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useParamState } from "@/components/ui/filter-bar";
import { useLabStore } from "@/lib/lab-store";
import { canCloseNonconformity } from "@/lib/permissions";
import {
  AUDIT_AREAS,
  AUDIT_MONTHS,
  auditStatus,
  entryFor,
  summariseAuditYear,
  type AuditStatus
} from "@/lib/internal-audit";

/**
 * Plani vjetor i auditimeve të brendshme — SL-FM-8.8.3.
 *
 * The paper plan is a matrix of clauses against months, and its weakness is
 * that an empty row looks exactly like a row you have not reached yet. In
 * February 2017 that cost the lab a finding: the plan did not address every
 * clause, and the clauses it missed were never audited. So the unplanned rows
 * are counted at the top, in their own colour, all year.
 */
export default function InternalAuditPage() {
  const store = useLabStore();
  const today = useMemo(() => new Date(), []);
  const [year, setYear] = useParamState("year", String(today.getFullYear()));
  const yearNumber = Number(year) || today.getFullYear();

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canEdit = canCloseNonconformity(currentUser?.role);

  const summary = useMemo(
    () => summariseAuditYear(store.auditEntries, yearNumber, today),
    [store.auditEntries, yearNumber, today]
  );

  const years = useMemo(() => {
    const set = new Set(store.auditEntries.map((entry) => entry.year));
    set.add(today.getFullYear());
    set.add(today.getFullYear() + 1);
    return [...set].sort((a, b) => b - a);
  }, [store.auditEntries, today]);

  return (
    <>
      <PageHeader
        title="Auditimet e brendshme"
        description="SL-FM-8.8.3 Plani vjetor i auditimeve të brendshme — çdo pikë e standardit, muaji i planifikuar dhe kryerja."
        action={
          <label className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Viti</span>
            <select value={year} onChange={(event) => setYear(event.target.value)} className="field w-28">
              {years.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        }
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Të kryera" value={`${summary.completed} / ${summary.total}`} tone={summary.completed === summary.total ? "ok" : "plain"} />
        <Tile label="Përtej muajit" value={summary.overdue} tone={summary.overdue ? "danger" : "ok"} />
        <Tile label="Pa planifikuar" value={summary.unplanned} tone={summary.unplanned ? "warning" : "ok"} />
        <Tile label="Jokonformitete të gjetura" value={summary.findings} tone="plain" />
      </section>

      {summary.unplanned > 0 ? (
        <div className="mb-6 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">
            {summary.unplanned} nga {summary.total} pika nuk kanë muaj të planifikuar për {yearNumber}.
          </div>
          <p className="mt-1 text-xs">
            Jokonformiteti nr. 7, shkurt 2017: plani vjetor nuk i adresohej të gjitha pikave të standardit dhe pikat e
            munguara nuk u audituan.
          </p>
        </div>
      ) : null}

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="border-b border-line bg-lab-porcelain text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Pika</th>
                <th className="px-4 py-3">Fusha që do të auditohet</th>
                <th className="px-4 py-3">Muaji i planifikuar</th>
                <th className="px-4 py-3">Data e kryerjes</th>
                <th className="px-4 py-3">Audituesi</th>
                <th className="px-4 py-3">JK</th>
                <th className="px-4 py-3">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_AREAS.map((area) => {
                const entry = entryFor(store.auditEntries, yearNumber, area.clause);
                const status = auditStatus(entry, today);
                const save = (patch: Record<string, unknown>) =>
                  store.saveAuditEntry({
                    year: yearNumber,
                    clause: area.clause,
                    plannedMonth: entry?.plannedMonth,
                    completedDate: entry?.completedDate,
                    auditor: entry?.auditor,
                    findings: entry?.findings,
                    notes: entry?.notes,
                    ...patch
                  });

                return (
                  <tr
                    key={area.clause}
                    className={`border-b border-line/70 ${area.isHeading ? "bg-lab-porcelain/60 font-semibold" : ""} ${
                      status === "I vonuar" ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 font-semibold tabular-nums text-ink">{area.clause}</td>
                    <td className="px-4 py-2.5 text-ink">{area.title}</td>
                    <td className="px-4 py-2.5">
                      <select
                        value={entry?.plannedMonth ?? ""}
                        disabled={!canEdit}
                        onChange={(event) =>
                          save({ plannedMonth: event.target.value ? Number(event.target.value) : undefined })
                        }
                        className="field w-32 disabled:opacity-60"
                      >
                        <option value="">—</option>
                        {AUDIT_MONTHS.map((name, index) => (
                          <option key={name} value={index + 1}>{name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="date"
                        value={entry?.completedDate ?? ""}
                        disabled={!canEdit}
                        onChange={(event) => save({ completedDate: event.target.value || undefined })}
                        className="field w-40 disabled:opacity-60"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        defaultValue={entry?.auditor ?? ""}
                        disabled={!canEdit}
                        onBlur={(event) => {
                          if (event.target.value !== (entry?.auditor ?? "")) save({ auditor: event.target.value || undefined });
                        }}
                        className="field w-36 disabled:opacity-60"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        defaultValue={entry?.findings ?? ""}
                        disabled={!canEdit}
                        onBlur={(event) => {
                          const value = event.target.value === "" ? undefined : Number(event.target.value);
                          if (value !== entry?.findings) save({ findings: value });
                        }}
                        className="field no-spinner w-20 disabled:opacity-60"
                      />
                    </td>
                    <td className="px-4 py-2.5"><StatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Statusi llogaritet nga plani dhe kalendari: i vonuar do të thotë se muaji i planifikuar ka kaluar pa datë
        kryerjeje. Audituesit zgjidhen nga SL-FM-8.8.5 Lista e audituesve, një muaj para periudhës së planifikuar.
      </p>
    </>
  );
}

function StatusBadge({ status }: { status: AuditStatus }) {
  const tone: Record<AuditStatus, string> = {
    "I kryer": "bg-green-100 text-green-900 ring-green-300",
    "I vonuar": "bg-red-600 text-white ring-red-700",
    "I planifikuar": "bg-lab-porcelain text-ink ring-line",
    "Pa planifikuar": "bg-amber-100 text-amber-900 ring-amber-300"
  };
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone[status]}`}>{status}</span>;
}

function Tile({ label, value, tone }: { label: string; value: number | string; tone: "danger" | "warning" | "ok" | "plain" }) {
  const tones = {
    danger: "border-red-300 bg-red-50 text-red-900",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
    ok: "border-green-300 bg-green-50 text-green-900",
    plain: "border-line bg-white text-ink"
  } as const;
  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
    </div>
  );
}
