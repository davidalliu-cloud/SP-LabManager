"use client";

import { useMemo, useState } from "react";
import { OFFER_CATALOGUE, type CatalogueTest } from "@/lib/offer-catalogue";
import { money } from "@/lib/offer-fields";
import type { QuantityMode } from "@/lib/offer-fill";

/**
 * Picking the tests a laboratory offer covers.
 *
 * The template's Section 9 is the whole catalogue — 108 tests across thirteen
 * groups — and an offer that quotes all of them tells the client nothing about
 * their own job. Ticking a test keeps its row; everything unticked is removed
 * from the document, and a group with nothing ticked loses its table and its
 * heading too.
 *
 * The quantity mode is the other half of the question. A client who has not
 * scoped the work yet wants the unit prices and will order test by test, so
 * the quantity column stays empty for them to fill. A client asking what a
 * known job costs wants quantities, line values and a total, which is what the
 * order form in Section 12 is for.
 */

export function CataloguePicker({
  selected,
  quantities,
  mode,
  onToggle,
  onToggleGroup,
  onQuantity,
  onMode
}: {
  selected: Set<string>;
  quantities: Record<string, string>;
  mode: QuantityMode;
  onToggle: (code: string) => void;
  onToggleGroup: (codes: string[], on: boolean) => void;
  onQuantity: (code: string, value: string) => void;
  onMode: (mode: QuantityMode) => void;
}) {
  const [search, setSearch] = useState("");
  const [onlyAccredited, setOnlyAccredited] = useState(false);
  const [onlySelected, setOnlySelected] = useState(false);

  const groups = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase("sq-AL");
    const matches = (test: CatalogueTest) => {
      if (onlyAccredited && !test.accredited) return false;
      if (onlySelected && !selected.has(test.code)) return false;
      if (!needle) return true;
      return `${test.code} ${test.name} ${test.detail}`.toLocaleLowerCase("sq-AL").includes(needle);
    };

    const byGroup = new Map<string, CatalogueTest[]>();
    for (const test of OFFER_CATALOGUE) {
      if (!matches(test)) continue;
      const list = byGroup.get(test.group) ?? [];
      list.push(test);
      byGroup.set(test.group, list);
    }
    return [...byGroup.entries()];
  }, [search, onlyAccredited, onlySelected, selected]);

  const chosen = OFFER_CATALOGUE.filter((test) => selected.has(test.code));
  const priced = mode === "quantity";
  const subtotal = chosen.reduce(
    (sum, test) => sum + test.price * Math.max(0, Number(quantities[test.code] ?? 0) || 0),
    0
  );

  return (
    <section className="surface-card mb-5 p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">
            Testimet në ofertë (Seksioni 9)
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Zgjidh testimet që do të përfshihen. Të pazgjedhurat hiqen nga oferta; grupi pa asnjë testim të
            zgjedhur hiqet i gjithi. Pa zgjedhur asgjë, dërgohet katalogu i plotë.
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold text-ink">
            {chosen.length} nga {OFFER_CATALOGUE.length} testime
          </div>
          {priced ? (
            <div className="text-muted">
              Nëntotali: <span className="font-semibold tabular-nums text-ink">{money(subtotal)} ALL</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <label className="block text-sm font-medium text-ink">
          Mënyra e çmimit
          <select
            className="input mt-1"
            value={mode}
            onChange={(event) => onMode(event.target.value as QuantityMode)}
          >
            <option value="unit">Vetëm çmimet njësi – klienti shënon sasinë më pas</option>
            <option value="quantity">Me sasi – oferta jep sasitë, vlerat dhe totalin</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-ink">
          Kërko testim
          <input
            className="input mt-1"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="kod, emër ose standard"
          />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2 text-ink">
          <input type="checkbox" checked={onlyAccredited} onChange={(event) => setOnlyAccredited(event.target.checked)} />
          Vetëm të akredituara
        </label>
        <label className="flex items-center gap-2 text-ink">
          <input type="checkbox" checked={onlySelected} onChange={(event) => setOnlySelected(event.target.checked)} />
          Vetëm të zgjedhurat
        </label>
        <button type="button" className="text-lab-burgundy underline" onClick={() => onToggleGroup([...selected], false)}>
          Hiq të gjitha
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-muted">Asnjë testim nuk i përgjigjet kërkimit.</p>
      ) : null}

      {groups.map(([group, tests]) => {
        const codes = tests.map((test) => test.code);
        const allOn = codes.every((code) => selected.has(code));
        return (
          <div key={group} className="mb-5 last:mb-0">
            <div className="mb-2 flex items-center justify-between gap-4 border-b border-line pb-1">
              <h3 className="text-sm font-semibold text-ink">{group}</h3>
              <button
                type="button"
                className="text-xs font-semibold text-lab-burgundy underline"
                onClick={() => onToggleGroup(codes, !allOn)}
              >
                {allOn ? "Hiq grupin" : "Zgjidh grupin"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <tbody>
                  {tests.map((test) => {
                    const on = selected.has(test.code);
                    return (
                      <tr key={test.code} className={`border-b border-line ${on ? "bg-lab-porcelain" : ""}`}>
                        <td className="w-10 px-2 py-2">
                          <input type="checkbox" checked={on} onChange={() => onToggle(test.code)} />
                        </td>
                        <td className="w-14 px-2 py-2 font-semibold tabular-nums">{test.code}</td>
                        <td className="px-2 py-2">
                          <div className="text-ink">{test.name}</div>
                          <div className="text-xs leading-5 text-muted">{test.detail}</div>
                        </td>
                        <td className="w-20 px-2 py-2 text-center">
                          {test.accredited ? (
                            <span title="Brenda fushës së akreditimit ISO/IEC 17025" className="font-semibold text-emerald-700">
                              akred.
                            </span>
                          ) : (
                            <span className="text-muted">–</span>
                          )}
                        </td>
                        <td className="w-24 px-2 py-2 text-muted">{test.unit}</td>
                        <td className="w-24 px-2 py-2 text-right tabular-nums">{test.priceLabel}</td>
                        <td className="w-24 px-2 py-2 text-right">
                          {priced && on ? (
                            <input
                              className="input w-20 text-right"
                              type="number"
                              min={0}
                              value={quantities[test.code] ?? ""}
                              onChange={(event) => onQuantity(test.code, event.target.value)}
                            />
                          ) : null}
                        </td>
                        <td className="w-28 px-2 py-2 text-right font-semibold tabular-nums">
                          {priced && on
                            ? money(test.price * Math.max(0, Number(quantities[test.code] ?? 0) || 0))
                            : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );
}
