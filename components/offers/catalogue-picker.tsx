"use client";

import { useMemo, useState } from "react";
import { OFFER_CATALOGUE, type CatalogueTest } from "@/lib/offer-catalogue";
import { money } from "@/lib/offer-fields";
import { discountPercent, hasPriceOverride, unitPrice, withVat, type OfferValues, type QuantityMode } from "@/lib/offer-fill";

/**
 * Picking and pricing the tests a laboratory offer covers.
 *
 * The template's Section 9 is the whole catalogue — 108 tests across thirteen
 * groups — and an offer that quotes all of them tells the client nothing about
 * their own job. Ticking a test keeps its row; everything unticked is removed
 * from the document, and a group with nothing ticked loses its table and its
 * heading too.
 *
 * Every test is priced per unit, as the template prints it, and either lever
 * can change that: the offer's discount moves every price together, or a
 * figure typed against one row sets that row outright. A typed price is a
 * decision, so the discount does not take a further slice off it — the row
 * says so when it is carrying one.
 *
 * The quantity mode is the other half of the question. A client who has not
 * scoped the work yet wants the unit prices and will order test by test, so
 * the quantity column stays empty for them to fill. A client asking what a
 * known job costs wants quantities, line values and a total, which is what the
 * order form in Section 12 is for.
 */

export function CataloguePicker({
  values,
  selected,
  quantities,
  mode,
  onToggle,
  onToggleGroup,
  onQuantity,
  onPrice,
  onMode
}: {
  /** The whole draft, for the discount and any typed-in prices. */
  values: OfferValues;
  selected: Set<string>;
  quantities: Record<string, string>;
  mode: QuantityMode;
  onToggle: (code: string) => void;
  onToggleGroup: (codes: string[], on: boolean) => void;
  onQuantity: (code: string, value: string) => void;
  onPrice: (code: string, value: string) => void;
  onMode: (mode: QuantityMode) => void;
}) {
  const [search, setSearch] = useState("");
  const [onlyAccredited, setOnlyAccredited] = useState(false);
  const [onlySelected, setOnlySelected] = useState(false);

  const discount = discountPercent(values);
  const priced = mode === "quantity";

  /** "Falas" rows have no figure to discount: they ride along with another test. */
  const isFree = (test: CatalogueTest) => !/\d/.test(test.priceLabel);
  const quoted = (test: CatalogueTest) => (isFree(test) ? 0 : unitPrice(values, test.code, test.price));
  const quantityOf = (code: string) => Math.max(0, Number(quantities[code] ?? 0) || 0);

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
  const subtotal = chosen.reduce((sum, test) => sum + quoted(test) * quantityOf(test.code), 0);
  const atList = chosen.reduce((sum, test) => sum + test.price * quantityOf(test.code), 0);

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
            {discount > 0
              ? ` Zbritja prej ${money(discount)}% është zbatuar mbi çdo çmim; shkruaj një çmim mbi rreshtin për ta caktuar vetë.`
              : " Shkruaj një çmim mbi rreshtin për ta caktuar vetë, ose vendos një zbritje te «Çmimet»."}
          </p>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold text-ink">
            {chosen.length} nga {OFFER_CATALOGUE.length} testime
          </div>
          {priced ? (
            <>
              <div className="text-muted">
                Nëntotali: <span className="font-semibold tabular-nums text-ink">{money(subtotal)} ALL</span>
              </div>
              {atList > subtotal ? (
                <div className="text-xs text-emerald-700">
                  Kursimi i klientit: {money(atList - subtotal)} ALL nga {money(atList)} ALL
                </div>
              ) : null}
            </>
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

      {groups.length === 0 ? <p className="text-sm text-muted">Asnjë testim nuk i përgjigjet kërkimit.</p> : null}

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
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.1em] text-muted">
                    <th className="w-10 px-2 py-1"></th>
                    <th className="w-14 px-2 py-1">Kodi</th>
                    <th className="px-2 py-1">Testi</th>
                    <th className="w-16 px-2 py-1 text-center">Akr.</th>
                    <th className="w-24 px-2 py-1">Njësia</th>
                    <th className="w-24 px-2 py-1 text-right">Listë</th>
                    <th className="w-28 px-2 py-1 text-right">Çmimi /njësi</th>
                    <th className="w-20 px-2 py-1 text-right">Sasia</th>
                    <th className="w-28 px-2 py-1 text-right">Vlera</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => {
                    const on = selected.has(test.code);
                    const free = isFree(test);
                    const net = quoted(test);
                    const typed = hasPriceOverride(values, test.code);
                    const moved = !free && net !== test.price;
                    return (
                      <tr key={test.code} className={`border-b border-line ${on ? "bg-lab-porcelain" : ""}`}>
                        <td className="px-2 py-2">
                          <input type="checkbox" checked={on} onChange={() => onToggle(test.code)} />
                        </td>
                        <td className="px-2 py-2 font-semibold tabular-nums">{test.code}</td>
                        <td className="px-2 py-2">
                          <div className="text-ink">{test.name}</div>
                          <div className="text-xs leading-5 text-muted">{test.detail}</div>
                        </td>
                        <td className="px-2 py-2 text-center">
                          {test.accredited ? (
                            <span title="Brenda fushës së akreditimit ISO/IEC 17025" className="font-semibold text-emerald-700">
                              akred.
                            </span>
                          ) : (
                            <span className="text-muted">–</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-muted">{test.unit}</td>
                        <td className={`px-2 py-2 text-right tabular-nums ${moved ? "text-muted line-through" : "text-muted"}`}>
                          {test.priceLabel}
                        </td>
                        <td className="px-2 py-2 text-right">
                          {on && !free ? (
                            <>
                              <input
                                className={`input w-24 text-right${typed ? " font-semibold" : ""}`}
                                type="number"
                                min={0}
                                value={values[`price.${test.code}`] ?? String(net)}
                                onChange={(event) => onPrice(test.code, event.target.value)}
                                title="Shkruaj çmimin për këtë rresht, ose fshije për t'u kthyer te çmimi i listës"
                              />
                              <div className="mt-1 text-[11px] leading-4 text-muted">
                                {money(withVat(net))} me TVSH
                                {typed ? <span className="block text-amber-700">çmim i caktuar</span> : null}
                              </div>
                            </>
                          ) : on && free ? (
                            <span className="text-muted">{test.priceLabel}</span>
                          ) : null}
                        </td>
                        <td className="px-2 py-2 text-right">
                          {priced && on ? (
                            <input
                              className="input w-16 text-right"
                              type="number"
                              min={0}
                              value={quantities[test.code] ?? ""}
                              onChange={(event) => onQuantity(test.code, event.target.value)}
                            />
                          ) : null}
                        </td>
                        <td className="px-2 py-2 text-right font-semibold tabular-nums">
                          {priced && on ? money(net * quantityOf(test.code)) : ""}
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
