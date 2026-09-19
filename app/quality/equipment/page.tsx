"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SortableTh, sortRows, useSort } from "@/components/ui/sortable-header";
import { DEFAULT_PAGE_SIZE, Pagination, paginate, useTablePage } from "@/components/ui/pagination";
import { useParamState } from "@/components/ui/filter-bar";
import { useLabStore } from "@/lib/lab-store";
import {
  CALIBRATION_WARNING_DAYS,
  calibrationSortKey,
  calibrationState,
  daysUntil,
  parseLabDate,
  type CalibrationState,
  type Equipment
} from "@/lib/equipment";

/**
 * Regjistri i pajisjeve — SL-FB-6.4.1 and SL-FP-6.4.7 on one screen.
 *
 * The register's job is to answer one question before any other: what needs
 * calibrating. So it opens sorted by how close each instrument is to the end of
 * its validity, with the lapsed ones first, rather than in inventory order.
 */
export default function EquipmentPage() {
  const store = useLabStore();
  const [search, setSearch] = useParamState("q", "");
  const [state, setState] = useParamState("state");
  const [centre, setCentre] = useParamState("centre");
  const { sort, toggle } = useSort("calibration");

  const today = useMemo(() => new Date(), []);
  const centres = useMemo(
    () => Array.from(new Set(store.equipment.map((item) => item.calibrationBody).filter(Boolean))).sort() as string[],
    [store.equipment]
  );

  const counts = useMemo(() => {
    const tally = { overdue: 0, "due-soon": 0, valid: 0, "not-dated": 0, none: 0 } as Record<CalibrationState, number>;
    for (const item of store.equipment) tally[calibrationState(item, today)] += 1;
    return tally;
  }, [store.equipment, today]);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = store.equipment.filter((item) => {
      const haystack = [item.uniqueCode, item.name, item.description, item.manufacturer, item.model, item.serialNumber, item.field]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        (!query || haystack.includes(query)) &&
        (state === "all" || calibrationState(item, today) === state) &&
        (centre === "all" || item.calibrationBody === centre)
      );
    });

    const valueFor = (item: Equipment) => {
      switch (sort.key) {
        case "code": return item.uniqueCode;
        case "name": return item.name;
        case "body": return item.calibrationBody ?? "";
        case "type": return item.calibrationType ?? "";
        case "lastCalibration": return parseLabDate(item.lastCalibration)?.getTime() ?? 0;
        default: return calibrationSortKey(item, today);
      }
    };
    return sortRows(filtered, valueFor, sort);
  }, [store.equipment, search, state, centre, sort, today]);

  const urlParams = { q: search.trim(), state: state === "all" ? "" : state, centre: centre === "all" ? "" : centre };
  const { page, pageCount, pageSize, from, to, setPage } = useTablePage(rows.length, DEFAULT_PAGE_SIZE, urlParams);
  const pageRows = paginate(rows, page, pageSize);

  return (
    <>
      <PageHeader
        title="Pajisjet"
        description="Regjistri i pajisjeve laboratorike — SL-FB-6.4.7 Programi i kalibrimit të pajisjeve laboratorike, versioni 7 (viti 2026)."
      />

      {/* What needs attention, before the table. Overdue is separated from due
          soon because they call for different things: one is a booking to make,
          the other is an instrument whose traceability has lapsed. */}
      <section className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <CountTile
          label="Kalibrimi i skaduar"
          sub="Validity expired"
          value={counts.overdue}
          tone="danger"
          onClick={() => setState("overdue")}
        />
        <CountTile
          label={`Skadon brenda ${CALIBRATION_WARNING_DAYS} ditëve`}
          sub="Due within a month"
          value={counts["due-soon"]}
          tone="warning"
          onClick={() => setState("due-soon")}
        />
        <CountTile label="Në afat" sub="Valid" value={counts.valid} tone="ok" onClick={() => setState("valid")} />
        <CountTile
          label="Para çdo përdorimi"
          sub="Verified at next use"
          value={counts["not-dated"]}
          tone="muted"
          onClick={() => setState("not-dated")}
        />
        {/* The inventory: sieves, moulds and glassware with no calibration of
            their own. Most of the register, and never a deadline. */}
        <CountTile
          label="Pa kalibrim"
          sub="Inventory only"
          value={counts.none}
          tone="muted"
          onClick={() => setState("none")}
        />
      </section>

      <div className="surface-card">
        <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
          <label className="flex-1 min-w-48">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Kërko</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kodi unik, pajisja, prodhuesi, seria…"
              className="input w-full"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Gjendja e kalibrimit</span>
            <select value={state} onChange={(event) => setState(event.target.value)} className="input">
              <option value="all">Të gjitha</option>
              <option value="overdue">E skaduar</option>
              <option value="due-soon">Skadon së shpejti</option>
              <option value="valid">Në afat</option>
              <option value="not-dated">Para çdo përdorimi</option>
              <option value="none">Pa kalibrim</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Organizmi kalibrues</span>
            <select value={centre} onChange={(event) => setCentre(event.target.value)} className="input">
              <option value="all">Të gjitha</option>
              {centres.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-sm">
            <thead className="bg-lab-porcelain text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <SortableTh label="Kodi unik" sortKey="code" sort={sort} onToggle={toggle} className="px-4 py-3" />
                <SortableTh label="Pajisja" sortKey="name" sort={sort} onToggle={toggle} className="px-4 py-3" />
                <th className="px-4 py-3">Fusha</th>
                <SortableTh label="Organizmi kalibrues" sortKey="body" sort={sort} onToggle={toggle} className="px-4 py-3" />
                <SortableTh label="Lloji i kalibrimit" sortKey="type" sort={sort} onToggle={toggle} className="px-4 py-3" />
                <SortableTh label="Data e kalibrimit aktual" sortKey="lastCalibration" sort={sort} onToggle={toggle} className="px-4 py-3" />
                <SortableTh label="Data e ardhshme e kalibrimit" sortKey="calibration" sort={sort} onToggle={toggle} className="px-4 py-3" />
                <th className="px-4 py-3">Intervali</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3 font-semibold text-ink">
                    <Link href={`/quality/equipment/${item.id}`} className="hover:underline">
                      {item.uniqueCode || "(pa kod)"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{item.name}</div>
                    {item.manufacturer || item.model ? (
                      <div className="text-xs text-muted">{[item.manufacturer, item.model].filter(Boolean).join(" · ")}</div>
                    ) : null}
                  </td>
                  <td className="max-w-80 px-4 py-3 text-muted">{item.field ?? "—"}</td>
                  <td className="px-4 py-3">{item.calibrationBody ?? "—"}</td>
                  <td className="px-4 py-3">{item.calibrationType ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{item.lastCalibration || "—"}</td>
                  <td className="px-4 py-3"><ValidUntilCell item={item} today={today} /></td>
                  <td className="px-4 py-3 text-muted">{item.calibrationInterval ?? "—"}</td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted">Asnjë pajisje nuk përputhet me filtrat.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageCount={pageCount} from={from} to={to} total={rows.length} onPage={setPage} />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        I.J — I Jashtëm (kryer nga laboratorë metrologjikë të akredituar, të njohur nga CIPM / BIPM).<br />
        I.B — I Brendshëm (kryer nga Sarp &amp; Lab me etalone të kalibruara nga laboratorë metrologjikë të akredituar).<br />
        Frekuenca e kalibrimit është vendosur duke u bazuar në procedurën e gjurmueshmërisë metrologjike (
        <Link href="/procedures" className="underline">SL-PB-6.5</Link>).
      </p>
    </>
  );
}

/**
 * The due date, and what it means today. Overdue and due-soon are the only two
 * that colour: if everything shouted, nothing would.
 */
function ValidUntilCell({ item, today }: { item: Equipment; today: Date }) {
  const state = calibrationState(item, today);
  const due = parseLabDate(item.nextCalibrationDate);

  if (state === "none") return <span className="text-muted">—</span>;
  // "Në përdorimin tjetër" is a real entry, not a missing date.
  if (state === "not-dated") return <span className="text-muted">{item.nextCalibrationDate}</span>;

  const days = due ? daysUntil(due, today) : 0;
  const tone =
    state === "overdue"
      ? "bg-red-600 text-white"
      : state === "due-soon"
        ? "bg-red-100 text-red-800 ring-1 ring-red-300"
        : "text-ink";

  return (
    <span className={`inline-flex flex-col gap-0.5 rounded px-2 py-1 ${tone}`}>
      <span className="font-semibold tabular-nums">{item.nextCalibrationDate}</span>
      {state === "overdue" ? (
        <span className="text-[11px]">E skaduar {Math.abs(days)} ditë më parë</span>
      ) : state === "due-soon" ? (
        <span className="text-[11px]">Skadon për {days} ditë</span>
      ) : null}
    </span>
  );
}

function CountTile({
  label,
  sub,
  value,
  tone,
  onClick
}: {
  label: string;
  sub: string;
  value: number;
  tone: "danger" | "warning" | "ok" | "muted";
  onClick: () => void;
}) {
  const tones = {
    danger: "border-red-300 bg-red-50 text-red-900",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
    ok: "border-line bg-white text-ink",
    muted: "border-line bg-lab-porcelain text-muted"
  } as const;
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border p-4 text-left transition hover:shadow-sm ${tones[tone]}`}>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      <div className="text-xs opacity-70">{sub}</div>
    </button>
  );
}
