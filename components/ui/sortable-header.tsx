"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export type SortDir = "asc" | "desc";
export type SortState = { key: string; dir: SortDir };

/** Sort state hook. Defaults to sorting by the given key ascending. */
export function useSort(defaultKey: string, defaultDir: SortDir = "asc") {
  const [sort, setSort] = useState<SortState>({ key: defaultKey, dir: defaultDir });
  const toggle = (key: string) =>
    setSort((current) => (current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  return { sort, toggle };
}

/** Numeric-aware comparison. Numbers compare numerically; strings use a
 *  numeric-aware locale compare (so "K2" < "K10", "0-9/07" < "0-10/07"). Empty
 *  values always sort to the end. */
export function compareBy(a: unknown, b: unknown): number {
  const aEmpty = a === undefined || a === null || a === "";
  const bEmpty = b === undefined || b === null || b === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/** Returns a new, sorted copy of `rows` using `getValue` for the active column. */
export function sortRows<T>(rows: T[], getValue: (row: T) => unknown, sort: SortState): T[] {
  const copy = [...rows].sort((left, right) => compareBy(getValue(left), getValue(right)));
  return sort.dir === "asc" ? copy : copy.reverse();
}

/** A clickable table header that sorts by `sortKey` and shows the active
 *  direction. Click again to reverse. */
export function SortableTh({
  label,
  sortKey,
  sort,
  onToggle,
  className = "px-4 py-3"
}: {
  label: ReactNode;
  sortKey: string;
  sort: SortState;
  onToggle: (key: string) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  return (
    <th className={className}>
      <button
        type="button"
        onClick={() => onToggle(sortKey)}
        className="inline-flex items-center gap-1 font-semibold hover:text-lab-burgundy"
      >
        <span>{label}</span>
        <span className={active ? "text-lab-burgundy" : "text-slate-300"}>{active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}</span>
      </button>
    </th>
  );
}
