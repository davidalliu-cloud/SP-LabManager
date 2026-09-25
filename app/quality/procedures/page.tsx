"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { procedureSeed } from "@/lib/procedure-seed";
import { currentRevisionOf, displayCategory, groupProcedures, normaliseCode } from "@/lib/procedures";

/**
 * Regjistri i procedurave teknike të provës (SOP) — ISO/IEC 17025 §7.2, and
 * §7.3 for the sampling set.
 *
 * What an assessor asks of this register is narrow and awkward: for every test
 * you are accredited for, show me the method, its version, and that the person
 * doing it is working to that version. The lab had the documents — 87 of them,
 * in SharePoint — and no way to see them as a list. Counting them meant opening
 * seventeen folders.
 *
 * So the page is a list first and a workflow second. Version and effective date
 * are shown as missing where they are missing, rather than defaulted to
 * something plausible: a register that quietly claims every procedure is at
 * version 1.0 is worse than one that admits it does not know.
 */
export default function ProcedureRegisterPage() {
  const store = useLabStore();
  const [query, setQuery] = useState("");

  const groups = useMemo(() => groupProcedures(store.procedures), [store.procedures]);
  const seedFiles = useMemo(
    () => new Map(procedureSeed.map((entry) => [normaliseCode(entry.code), entry])),
    []
  );

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? groups
        .map((group) => ({
          ...group,
          procedures: group.procedures.filter(
            (procedure) =>
              procedure.code.toLowerCase().includes(needle) ||
              procedure.title.toLowerCase().includes(needle) ||
              group.category.toLowerCase().includes(needle)
          )
        }))
        .filter((group) => group.procedures.length)
    : groups;

  const total = store.procedures.length;
  const withRevision = store.procedures.filter((procedure) => procedure.currentRevisionId).length;
  const shown = visible.reduce((sum, group) => sum + group.procedures.length, 0);

  return (
    <>
      <PageHeader
        title="Procedurat teknike (SOP)"
        description="Regjistri i procedurave teknike të provës — §7.2, dhe §7.3 për marrjen e mostrave."
        action={
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kërko kod, titull ose matricë…"
            className="field w-72"
          />
        }
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <Tile label="Procedura në regjistër" value={total} tone="plain" />
        <Tile label="Me version të regjistruar" value={`${withRevision} / ${total}`} tone={withRevision === total ? "ok" : "warning"} />
        <Tile label="Matrica" value={groups.length} tone="plain" />
      </section>

      {withRevision < total ? (
        <div className="mb-6 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">
            {total - withRevision} procedura pa version dhe datë efektive në aplikacion.
          </div>
          <p className="mt-1 text-xs">
            Versioni dhe data efektive ndodhen brenda dokumentit në SharePoint. Ato plotësohen këtu nga Menaxherja e
            Cilësisë ndërsa rishikohen; asgjë nuk është supozuar.
          </p>
        </div>
      ) : null}

      {needle ? <p className="mb-3 text-xs text-muted">{shown} rezultate për “{query.trim()}”.</p> : null}

      <div className="space-y-6">
        {visible.map((group) => (
          <section key={group.category} className="surface-card overflow-hidden">
            <header className="flex items-baseline justify-between gap-3 border-b border-line bg-lab-porcelain px-4 py-2.5">
              <h2 className="text-sm font-semibold text-ink">{group.category}</h2>
              <span className="text-xs text-muted">{group.procedures.length}</span>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] text-sm">
                <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2">Kodi</th>
                    <th className="px-4 py-2">Titulli</th>
                    <th className="px-4 py-2">Versioni</th>
                    <th className="px-4 py-2">Data efektive</th>
                    <th className="px-4 py-2">Dokumenti</th>
                  </tr>
                </thead>
                <tbody>
                  {group.procedures.map((procedure) => {
                    const revision = currentRevisionOf(procedure, store.procedureRevisions);
                    const seeded = seedFiles.get(normaliseCode(procedure.code));
                    const fileUrl = revision?.pdfUrl || revision?.fileUrl || seeded?.fileUrl;
                    return (
                      <tr key={procedure.id} className="border-b border-line/70 last:border-0">
                        <td className="whitespace-nowrap px-4 py-2.5 font-semibold tabular-nums text-ink">{procedure.code}</td>
                        <td className="px-4 py-2.5 text-ink">{procedure.title}</td>
                        <td className="whitespace-nowrap px-4 py-2.5">
                          {revision ? (
                            <span className="tabular-nums text-ink">{revision.revision}</span>
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2.5">
                          {revision?.effectiveDate ? (
                            <span className="tabular-nums text-ink">{revision.effectiveDate}</span>
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-lab-burgundy hover:underline"
                            >
                              Hap dokumentin
                            </a>
                          ) : (
                            <span className="text-xs text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs leading-5 text-muted">
        Kodet janë riprodhuar tamam si në dokumentat e kontrolluara, përfshirë mospërputhjet e vogla në emërtim.
        Dokumentet hapen në SharePoint dhe kërkojnë llogarinë e laboratorit. Për rishikimin e një procedure
        (draft, miratim) përdorni{" "}
        <Link href="/procedures" className="font-semibold text-lab-burgundy hover:underline">
          rrjedhën e rishikimit
        </Link>
        .
      </p>
    </>
  );
}

function Tile({ label, value, tone }: { label: string; value: number | string; tone: "warning" | "ok" | "plain" }) {
  const tones = {
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
