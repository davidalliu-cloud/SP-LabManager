"use client";

import { useMemo } from "react";
import { FilterChips, FilterField, useParamState } from "@/components/ui/filter-bar";
import type { FilterChip } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { buildHaystack, matchesHaystack, tokeniseQuery } from "@/lib/search";

/**
 * The header row pins to the top of the scroll area, as it does on the client
 * and sample registers. Nothing is pinned to the left here: project names run
 * to 268 characters, so a frozen first column would take the whole viewport.
 * With four columns the table fits across without scrolling sideways anyway.
 */
const STICKY_HEAD = "sticky top-0 z-20 bg-white";

function clientCodeNumber(code: string) {
  const match = /^K(\d+)$/i.exec(code.trim());
  return match ? Number(match[1]) : Number.NaN;
}

/** Client code order, numerically — K2 before K10 — with anything unrecognised
 *  sorted after the codes rather than interleaved with them. */
function compareClientCodes(left: string, right: string) {
  const leftNumber = clientCodeNumber(left);
  const rightNumber = clientCodeNumber(right);
  const leftHasNumber = Number.isFinite(leftNumber);
  const rightHasNumber = Number.isFinite(rightNumber);

  if (leftHasNumber && rightHasNumber && leftNumber !== rightNumber) return leftNumber - rightNumber;
  if (leftHasNumber !== rightHasNumber) return leftHasNumber ? -1 : 1;
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

export default function ProjectsPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const [query, setQuery] = useParamState("q", "");
  const [clientFilter, setClientFilter] = useParamState("client", "all");
  const [projectFilter, setProjectFilter] = useParamState("project", "all");

  // Resolved once per project: its client, the text to search, and the order it
  // sorts in. The register arrives in insertion order, which puts a client's
  // projects wherever they happened to be created; grouping them under their
  // client is what makes the client filter read as a list rather than a sieve.
  const rows = useMemo(() => {
    const byId = new Map(store.clients.map((client) => [client.id, client]));
    return store.projects
      .map((project) => {
        const client = byId.get(project.clientId);
        return {
          project,
          client,
          haystack: buildHaystack([
            project.projectName,
            project.location,
            project.description,
            client?.clientCode,
            client?.clientName
          ])
        };
      })
      .sort(
        (left, right) =>
          compareClientCodes(left.client?.clientCode ?? "", right.client?.clientCode ?? "") ||
          left.project.projectName.localeCompare(right.project.projectName, undefined, { sensitivity: "base" })
      );
  }, [store.projects, store.clients]);

  const clientOptions = useMemo(
    () =>
      [...store.clients].sort((left, right) => compareClientCodes(left.clientCode, right.clientCode)),
    [store.clients]
  );

  const queryTokens = useMemo(() => tokeniseQuery(query), [query]);
  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        if (clientFilter !== "all" && row.project.clientId !== clientFilter) return false;
        if (projectFilter !== "all" && row.project.id !== projectFilter) return false;
        return matchesHaystack(row.haystack, queryTokens);
      }),
    [rows, clientFilter, projectFilter, queryTokens]
  );

  const chips: FilterChip[] = [];
  if (query.trim()) {
    chips.push({ key: "q", label: `${t("filters.search")}: “${query.trim()}”`, onRemove: () => setQuery("") });
  }
  if (clientFilter !== "all") {
    const picked = store.clients.find((item) => item.id === clientFilter);
    chips.push({
      key: "client",
      label: `${t("filters.client")}: ${[picked?.clientCode, picked?.clientName].filter(Boolean).join(" — ")}`,
      onRemove: () => setClientFilter("all")
    });
  }
  if (projectFilter !== "all") {
    const picked = store.projects.find((item) => item.id === projectFilter);
    chips.push({
      key: "project",
      label: `Projekti: ${picked?.projectName ?? ""}`,
      onRemove: () => setProjectFilter("all")
    });
  }

  function clearFilters() {
    setQuery("");
    setClientFilter("all");
    setProjectFilter("all");
  }

  return (
    <>
      <PageHeader title="Projektet" description="Regjistrat e projekteve të lidhura me klientët dhe kampionët laboratorikë." />

      <div className="no-print mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FilterField label={t("filters.search")}>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Projekti, klienti, vendndodhja…"
            className="input mt-1"
          />
        </FilterField>
        <FilterField label={t("filters.client")}>
          <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} className="input mt-1">
            <option value="all">Të gjithë klientët ({clientOptions.length})</option>
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>
                {client.clientCode} — {client.clientName}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Zgjidh projektin">
          <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="input mt-1">
            <option value="all">Të gjitha projektet ({rows.length})</option>
            {rows.map(({ project, client }) => (
              <option key={project.id} value={project.id}>
                {[client?.clientCode, project.projectName].filter(Boolean).join(" — ")}
              </option>
            ))}
          </select>
        </FilterField>
      </div>

      <FilterChips
        chips={chips}
        resultCount={visibleRows.length}
        onClearAll={clearFilters}
        countLabel={t("filters.results.projects")}
      />

      <div className="surface-card overflow-hidden">
        {/* Scrolls inside itself so the header row stays put over 155 projects. */}
        <div className="register-scroll max-h-[70vh] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className={`${STICKY_HEAD} w-40 px-4 py-3`}>Klienti</th>
                <th className={`${STICKY_HEAD} px-4 py-3`}>Projekti</th>
                <th className={`${STICKY_HEAD} w-48 px-4 py-3`}>Vendndodhja</th>
                <th className={`${STICKY_HEAD} w-40 px-4 py-3`}>Përshkrimi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visibleRows.map(({ project, client }) => (
                <tr key={project.id} className="align-top transition-colors hover:bg-lab-mist/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{client?.clientCode ?? "-"}</div>
                    <div className="text-muted">{client?.clientName ?? "-"}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{project.projectName}</td>
                  <td className="px-4 py-3">{project.location || "-"}</td>
                  <td className="px-4 py-3">{project.description || "-"}</td>
                </tr>
              ))}
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                    Asnjë projekt nuk përputhet me filtrat.{" "}
                    <button type="button" onClick={clearFilters} className="font-semibold text-lab-burgundy underline">
                      Pastro filtrat
                    </button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
