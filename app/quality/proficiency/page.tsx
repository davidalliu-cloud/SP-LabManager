"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useParamState } from "@/components/ui/filter-bar";
import { useLabStore } from "@/lib/lab-store";
import { canCloseNonconformity } from "@/lib/permissions";
import {
  PT_MATRICES,
  PT_TYPES,
  coverageByMatrix,
  cycleFor,
  cycleLabel,
  inCycle,
  needsAction,
  proficiencyResult,
  type ProficiencyResult,
  type ProficiencyTest
} from "@/lib/proficiency";

/**
 * Regjistri i pjesëmarrjes në testime ndërlaboratorike — SL-RP-7.7.1k.
 *
 * The coverage panel comes first. The register itself was never the problem —
 * thirteen pages of it exist. What could not be seen was which matrices had
 * nothing in the current four-year cycle, and that is what the 2025 audit
 * found for nineteen tests.
 */
export default function ProficiencyPage() {
  const store = useLabStore();
  const today = useMemo(() => new Date(), []);
  const year = today.getFullYear();
  const cycle = cycleFor(year);

  const [matrix, setMatrix] = useParamState("matrix");
  const [scope, setScope] = useParamState("scope", "cycle");
  const [showForm, setShowForm] = useState(false);

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canEdit = canCloseNonconformity(currentUser?.role);

  const coverage = useMemo(() => coverageByMatrix(store.proficiencyTests, year), [store.proficiencyTests, year]);
  const uncovered = coverage.filter((item) => item.rounds === 0);
  const flagged = store.proficiencyTests.filter((item) => inCycle(item, year) && needsAction(item));

  const rows = useMemo(
    () =>
      store.proficiencyTests
        .filter((item) => (matrix === "all" || item.matrix === matrix) && (scope === "all" || inCycle(item, year)))
        .sort((a, b) => b.year - a.year || a.matrix.localeCompare(b.matrix) || a.testName.localeCompare(b.testName)),
    [store.proficiencyTests, matrix, scope, year]
  );

  const matrices = Array.from(new Set([...PT_MATRICES, ...store.proficiencyTests.map((item) => item.matrix)])).sort();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const rawZ = text("zScore");
    store.saveProficiencyTest(undefined, {
      testName: text("testName"),
      matrix: text("matrix"),
      method: text("method"),
      comparisonType: text("comparisonType"),
      organiser: text("organiser"),
      labCode: text("labCode") || undefined,
      period: text("period"),
      year: Number(text("year")),
      zScore: rawZ === "" ? undefined : Number(rawZ),
      notes: text("notes") || undefined
    });
    form.reset();
    setShowForm(false);
  }

  return (
    <>
      <PageHeader
        title="Testet e zotësisë (PT / ILC)"
        description="SL-RP-7.7.1k Regjistri i pjesëmarrjes në testime ndërlaboratorike dhe testime zotësie."
        action={
          canEdit ? (
            <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary">
              {showForm ? "Anulo" : "Pjesëmarrje e re"}
            </button>
          ) : null
        }
      />

      {/* Cycle coverage — the question the register could not answer. */}
      <section className="mb-6 overflow-hidden rounded-lg border border-line bg-white">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line bg-lab-porcelain px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-lab-burgundy">
            Mbulimi i ciklit {cycleLabel(year)}
          </h2>
          <span className="text-xs text-muted">
            Cikli katërvjeçar sipas pikës 7.7.2 — viti {year}, viti {year - cycle.start + 1} nga 4
          </span>
        </div>

        {uncovered.length > 0 ? (
          <div className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
            <div className="font-semibold">
              {uncovered.length} {uncovered.length === 1 ? "matricë" : "matrica"} pa asnjë pjesëmarrje në këtë cikël.
            </div>
            <div className="mt-1 text-xs">
              {uncovered.map((item) => `${item.matrix}${item.lastYear ? ` (e fundit ${item.lastYear})` : ""}`).join(" · ")}
            </div>
            <p className="mt-2 text-xs opacity-90">
              Jokonformiteti nr. 115 i marsit 2025 u ngrit pikërisht për mungesë pjesëmarrjeje në ciklin e mëparshëm.
            </p>
          </div>
        ) : null}

        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {coverage.map((item) => (
            <div key={item.matrix} className="bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-ink">{item.matrix}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    item.rounds === 0 ? "bg-red-600 text-white" : "bg-green-100 text-green-900 ring-1 ring-green-300"
                  }`}
                >
                  {item.rounds === 0 ? "pa mbulim" : `${item.rounds} raunde`}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted">
                {item.rounds === 0
                  ? item.lastYear
                    ? `Pjesëmarrja e fundit në ${item.lastYear}.`
                    : "Asnjë pjesëmarrje e regjistruar."
                  : `${item.tests} teste në cikël${item.unsatisfactory ? `, ${item.unsatisfactory} jo të kënaqshme` : ""}`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {flagged.length > 0 ? (
        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-900">
          <div className="font-semibold">{flagged.length} rezultate jo të kënaqshme në këtë cikël.</div>
          <div className="mt-1 text-xs">
            {flagged.map((item) => `${item.testName} (Z = ${item.zScore})`).join(" · ")}
          </div>
          <p className="mt-2 text-xs opacity-90">
            Pika 7.7.3 kërkon analizë dhe veprim korrigjues për rezultatet jashtë kritereve.
          </p>
        </div>
      ) : null}

      {showForm ? (
        <form onSubmit={submit} className="mb-6 overflow-hidden rounded-lg border-2 border-lab-burgundy/25 bg-lab-porcelain">
          <div className="bg-lab-burgundy px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">Pjesëmarrje e re</h2>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            <div className="md:col-span-3">
              <Field label="Testi i performuar">
                <input name="testName" required className="field" />
              </Field>
            </div>
            <Field label="Matrica e testimit">
              <input name="matrix" required list="pt-matrices" className="field" />
              <datalist id="pt-matrices">
                {matrices.map((value) => <option key={value} value={value} />)}
              </datalist>
            </Field>
            <Field label="Metoda e testimit">
              <input name="method" required className="field" placeholder="BS EN 933-1:2012" />
            </Field>
            <Field label="Tipi i krahasimit">
              <select name="comparisonType" required className="field">
                {PT_TYPES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </Field>
            <Field label="Organizuesi">
              <input name="organiser" required className="field" />
            </Field>
            <Field label="Kodi i laboratorit">
              <input name="labCode" className="field" />
            </Field>
            <Field label="Muaji / Viti">
              <input name="period" required className="field" placeholder="Janar - Korrik 2026" />
            </Field>
            <Field label="Viti i ciklit" hint="viti kur nisi raundi">
              <input type="number" name="year" required defaultValue={year} min="2010" max="2100" className="field no-spinner" />
            </Field>
            <Field label="Zeta Score (Z)" hint="|Z| ≤ 2 i kënaqshëm">
              <input type="number" name="zScore" step="0.01" className="field no-spinner" placeholder="0.84" />
            </Field>
            <div className="md:col-span-3">
              <Field label="Shënime">
                <input name="notes" className="field" />
              </Field>
            </div>
          </div>
          <div className="flex justify-end border-t border-lab-burgundy/15 bg-white/60 px-5 py-4">
            <button type="submit" className="btn-primary">Regjistro</button>
          </div>
        </form>
      ) : null}

      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Matrica</span>
            <select value={matrix} onChange={(event) => setMatrix(event.target.value)} className="field">
              <option value="all">Të gjitha</option>
              {matrices.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Periudha</span>
            <select value={scope} onChange={(event) => setScope(event.target.value)} className="field">
              <option value="cycle">Cikli {cycleLabel(year)}</option>
              <option value="all">I gjithë regjistri</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-sm">
            <thead className="border-b border-line bg-lab-porcelain text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Testi i performuar</th>
                <th className="px-4 py-3">Matrica</th>
                <th className="px-4 py-3">Metoda</th>
                <th className="px-4 py-3">Tipi</th>
                <th className="px-4 py-3">Organizuesi</th>
                <th className="px-4 py-3">Muaji / Viti</th>
                <th className="px-4 py-3">Z</th>
                <th className="px-4 py-3">Rezultati</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className={`border-b border-line/70 ${index % 2 === 1 ? "bg-lab-porcelain/40" : ""}`}>
                  <td className="max-w-sm px-4 py-3 font-medium text-ink">{item.testName}</td>
                  <td className="px-4 py-3 text-muted">{item.matrix}</td>
                  <td className="px-4 py-3 text-muted">{item.method}</td>
                  <td className="px-4 py-3 text-muted">{item.comparisonType}</td>
                  <td className="px-4 py-3 text-muted">
                    {item.organiser}
                    {item.labCode ? <span className="block text-xs opacity-70">{item.labCode}</span> : null}
                  </td>
                  <td className="px-4 py-3 text-muted">{item.period}</td>
                  <td className="px-4 py-3 tabular-nums">{item.zScore ?? "—"}</td>
                  <td className="px-4 py-3"><ResultBadge item={item} /></td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted">Asnjë pjesëmarrje për këto filtra.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Rezultati llogaritet nga Z sipas ISO 13528: |Z| ≤ 2 i kënaqshëm, 2 &lt; |Z| ≤ 3 i dyshimtë, |Z| &gt; 3 i
        pakënaqshëm. Regjistri i plotë para qershorit 2024 ndodhet në SL-RP-7.7.1k.
      </p>
    </>
  );
}

function ResultBadge({ item }: { item: ProficiencyTest }) {
  const result = proficiencyResult(item.zScore);
  const tone: Record<ProficiencyResult, string> = {
    "I kënaqshëm": "bg-green-100 text-green-900 ring-green-300",
    "I dyshimtë": "bg-amber-100 text-amber-900 ring-amber-300",
    "I pakënaqshëm": "bg-red-600 text-white ring-red-700",
    "Pa vlerësim": "bg-lab-porcelain text-muted ring-line"
  };
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tone[result]}`}>{result}</span>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink">{label}</span>
        {hint ? <span className="text-[11px] font-medium text-muted">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}
