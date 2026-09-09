"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { formatEuropeanDate } from "@/lib/date-format";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";

// Rregjistri i Terrenit — the register of samples taken / tested on site.
// Initial build: a store-backed list with search and an empty state; the exact
// columns and the "new record" form follow the site register template.
export default function FieldRegisterPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const records = [...store.fieldRecords].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    if (!q) return records;
    return records.filter((record) => {
      const client = store.clients.find((item) => item.id === record.clientId)?.clientName ?? "";
      const project = store.projects.find((item) => item.id === record.projectId)?.projectName ?? "";
      return `${record.recordCode} ${record.location} ${record.sampleType} ${record.sampledBy ?? ""} ${client} ${project}`
        .toLowerCase()
        .includes(q);
    });
  }, [query, store.fieldRecords, store.clients, store.projects]);

  return (
    <>
      <PageHeader
        title={t("nav.fieldRegister")}
        description="Regjistri i kampionëve të marrë ose testuar në terren / Register of samples taken or tested on site."
      />

      <div className="surface-card mb-4 p-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Kërko kod, vendndodhje, kampion, klient... / Search code, location, sample, client…"
          className="input"
        />
      </div>

      <SimpleTable>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">Kodi / Code</th>
              <th className="px-4 py-3">Data / Date</th>
              <th className="px-4 py-3">Klienti / Client</th>
              <th className="px-4 py-3">Objekti / Project</th>
              <th className="px-4 py-3">Vendndodhja / Location</th>
              <th className="px-4 py-3">Kampioni / Sample</th>
              <th className="px-4 py-3">Sasia / Qty</th>
              <th className="px-4 py-3">Marrë nga / Sampled by</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((record) => (
              <tr key={record.id} className="hover:bg-lab-mist/60">
                <td className="px-4 py-3 font-semibold text-ink">{record.recordCode}</td>
                <td className="px-4 py-3 whitespace-nowrap">{formatEuropeanDate(record.date)}</td>
                <td className="px-4 py-3">{store.clients.find((item) => item.id === record.clientId)?.clientName ?? "-"}</td>
                <td className="px-4 py-3">{store.projects.find((item) => item.id === record.projectId)?.projectName ?? "-"}</td>
                <td className="px-4 py-3">{record.location || "-"}</td>
                <td className="px-4 py-3">{record.sampleType || "-"}</td>
                <td className="px-4 py-3">{record.quantity ?? "-"}</td>
                <td className="px-4 py-3">{record.sampledBy || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <div className="p-6 text-sm text-muted">
            {store.fieldRecords.length
              ? "Asnjë regjistrim nuk përputhet me kërkimin. / No records match your search."
              : "Ende asnjë regjistrim terreni. / No field records yet."}
          </div>
        ) : null}
      </SimpleTable>
    </>
  );
}
