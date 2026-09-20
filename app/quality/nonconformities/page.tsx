"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useParamState } from "@/components/ui/filter-bar";
import { DEFAULT_PAGE_SIZE, Pagination, paginate, useTablePage } from "@/components/ui/pagination";
import { useLabStore } from "@/lib/lab-store";
import { canRaiseNonconformity } from "@/lib/permissions";
import {
  NC_SECTORS,
  NC_SOURCES,
  NC_WARNING_DAYS,
  daysBetween,
  dueState,
  formatDate,
  nonconformityStatus,
  parseDate,
  type Nonconformity
} from "@/lib/nonconformity";

/**
 * Regjistri i punëve jokonforme — SL-RP-7.10.2, and the form behind it,
 * SL-FP-7.10.1.
 *
 * Opens on what is still open, and on any action past its afat, because that is
 * the question the register exists to answer. Closed findings are still here,
 * one filter away, since the history is the evidence.
 */
export default function NonconformitiesPage() {
  const store = useLabStore();
  const today = useMemo(() => new Date(), []);
  const [status, setStatus] = useParamState("status", "open");
  const [sector, setSector] = useParamState("sector");
  const [search, setSearch] = useParamState("q", "");
  const [showForm, setShowForm] = useState(false);

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canRaise = canRaiseNonconformity(currentUser?.role);

  const overdue = store.nonconformities.filter((item) => dueState(item, today) === "overdue");
  const dueSoon = store.nonconformities.filter((item) => dueState(item, today) === "due-soon");
  const open = store.nonconformities.filter((item) => nonconformityStatus(item) !== "Mbyllur");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return store.nonconformities
      .filter((item) => {
        const state = nonconformityStatus(item);
        const matchesStatus =
          status === "all" ||
          (status === "open" && state !== "Mbyllur") ||
          (status === "overdue" && dueState(item, today) === "overdue") ||
          (status === "closed" && state === "Mbyllur");
        const haystack = [item.description, item.rootCause, item.correctiveAction, item.responsiblePerson, item.foundBy, item.code]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return matchesStatus && (sector === "all" || item.sector === sector) && (!query || haystack.includes(query));
      })
      // Newest first, which for a numbered register means highest number first.
      .sort((a, b) => b.number - a.number);
  }, [store.nonconformities, status, sector, search, today]);

  const { page, pageCount, pageSize, from, to, setPage } = useTablePage(rows.length, DEFAULT_PAGE_SIZE, {
    status: status === "open" ? "" : status,
    sector: sector === "all" ? "" : sector,
    q: search.trim()
  });
  const pageRows = paginate(rows, page, pageSize);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    store.raiseNonconformity({
      reportedDate: text("reportedDate"),
      sector: text("sector"),
      foundBy: text("foundBy"),
      code: text("code"),
      description: text("description"),
      dueDate: text("dueDate") || undefined,
      responsiblePerson: text("responsiblePerson") || undefined
    });
    form.reset();
    setShowForm(false);
  }

  return (
    <>
      <PageHeader
        title="Punët jokonforme"
        description="SL-RP-7.10.2 Regjistri i punëve jokonforme — formulari SL-FP-7.10.1."
        action={
          canRaise ? (
            <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary">
              {showForm ? "Anulo" : "Jokonformitet i ri"}
            </button>
          ) : null
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <Tile label="Veprime të vonuara" sub="Past the afat" value={overdue.length} tone="danger" onClick={() => setStatus("overdue")} />
        <Tile label={`Afati brenda ${NC_WARNING_DAYS} ditëve`} sub="Due soon" value={dueSoon.length} tone="warning" onClick={() => setStatus("open")} />
        <Tile label="Të hapura" sub="Open" value={open.length} tone="ok" onClick={() => setStatus("open")} />
      </section>

      {showForm ? (
        <form onSubmit={submit} className="surface-card mb-5">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Jokonformitet i ri</h2>
            <p className="mt-1 text-xs text-muted">
              Shkaku, veprimi korrigjues dhe verifikimi i efikasitetit plotësohen më pas, te faqja e jokonformitetit.
            </p>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-4">
            <Field label="Data e raportimit">
              <input type="date" name="reportedDate" required defaultValue={new Date().toISOString().slice(0, 10)} className="input" />
            </Field>
            <Field label="Sektori">
              <select name="sector" required className="input">
                {NC_SECTORS.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="U konstatua nga">
              <select name="foundBy" required className="input">
                {NC_SOURCES.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Kodi i JK">
              <input name="code" className="input" />
            </Field>
            <div className="md:col-span-4">
              <Field label="Përshkrimi i jokonformitetit">
                <textarea name="description" required rows={3} className="input w-full" />
              </Field>
            </div>
            <Field label="Personi përgjegjës">
              <input name="responsiblePerson" className="input" />
            </Field>
            <Field label="Afati">
              <input type="date" name="dueDate" className="input" />
            </Field>
          </div>
          <div className="flex justify-end border-t border-line p-5">
            <button type="submit" className="btn-primary">Regjistro</button>
          </div>
        </form>
      ) : null}

      <div className="surface-card">
        <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
          <label className="flex-1 min-w-48">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Kërko</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="input w-full" placeholder="Përshkrimi, shkaku, veprimi…" />
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Statusi</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input">
              <option value="open">Të hapura</option>
              <option value="overdue">Të vonuara</option>
              <option value="closed">Të mbyllura</option>
              <option value="all">Të gjitha</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Sektori</span>
            <select value={sector} onChange={(event) => setSector(event.target.value)} className="input">
              <option value="all">Të gjithë</option>
              {NC_SECTORS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[60rem] text-sm">
            <thead className="bg-lab-porcelain text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Nr.</th>
                <th className="px-4 py-3">Data e konstatimit</th>
                <th className="px-4 py-3">U konstatua nga</th>
                <th className="px-4 py-3">Sektori</th>
                <th className="px-4 py-3">Moskonformiteti i gjetur</th>
                <th className="px-4 py-3">Afati</th>
                <th className="px-4 py-3">Statusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3 font-semibold text-ink">
                    <Link href={`/quality/nonconformities/${item.id}`} className="hover:underline">{item.number}</Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{formatDate(item.reportedDate)}</td>
                  <td className="px-4 py-3 text-muted">{item.foundBy}</td>
                  <td className="px-4 py-3 text-muted">{item.sector}</td>
                  <td className="max-w-lg px-4 py-3">{item.description}</td>
                  <td className="px-4 py-3"><DueCell item={item} today={today} /></td>
                  <td className="px-4 py-3"><StatusBadge item={item} /></td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">Asnjë jokonformitet nuk përputhet me filtrat.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} from={from} to={to} total={rows.length} onPage={setPage} />
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Numri vazhdon regjistrin në letër, i cili ishte te nr. 115 në mars 2025. Statusi nuk shkruhet me dorë: një
        jokonformitet mbyllet kur ka datë kryerjeje dhe verifikim të efikasitetit.
      </p>
    </>
  );
}

function DueCell({ item, today }: { item: Nonconformity; today: Date }) {
  const state = dueState(item, today);
  if (!item.dueDate) return <span className="text-muted">—</span>;
  const due = parseDate(item.dueDate);
  const days = due ? daysBetween(today, due) : 0;
  const tone =
    state === "overdue"
      ? "bg-red-600 text-white"
      : state === "due-soon"
        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
        : "";
  return (
    <span className={`inline-flex flex-col rounded px-2 py-1 ${tone}`}>
      <span className="tabular-nums">{formatDate(item.dueDate)}</span>
      {state === "overdue" ? <span className="text-[11px]">{Math.abs(days)} ditë vonesë</span> : null}
      {state === "due-soon" ? <span className="text-[11px]">për {days} ditë</span> : null}
    </span>
  );
}

function StatusBadge({ item }: { item: Nonconformity }) {
  const status = nonconformityStatus(item);
  const tone =
    status === "Mbyllur"
      ? "bg-green-100 text-green-900 ring-green-300"
      : status === "Në proces"
        ? "bg-amber-100 text-amber-900 ring-amber-300"
        : "bg-lab-porcelain text-ink ring-line";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone}`}>{status}</span>;
}

function Tile({
  label,
  sub,
  value,
  tone,
  onClick
}: {
  label: string;
  sub: string;
  value: number;
  tone: "danger" | "warning" | "ok";
  onClick: () => void;
}) {
  const tones = {
    danger: "border-red-300 bg-red-50 text-red-900",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
    ok: "border-line bg-white text-ink"
  } as const;
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border p-4 text-left transition hover:shadow-sm ${tones[tone]}`}>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      <div className="text-xs opacity-70">{sub}</div>
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}
