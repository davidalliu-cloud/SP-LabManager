"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatEuropeanDate } from "@/lib/date-format";
import { isFieldSample } from "@/lib/field-register";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";

/**
 * Rregjistri i Terrenit — the register for work carried out on site.
 *
 * The four field determinations are registered here and nowhere else; the
 * sample register no longer offers them. They are ordinary samples underneath,
 * so once registered they appear in the test register and the report register
 * alongside lab work — only the point of entry is separate.
 */
export default function FieldRegisterPage() {
  const store = useLabStore();
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fieldSamples = store.samples.filter(isFieldSample);
    const sorted = [...fieldSamples].sort((a, b) => (b.dateReceived ?? "").localeCompare(a.dateReceived ?? ""));
    if (!q) return sorted;
    return sorted.filter((sample) => {
      const client = store.clients.find((item) => item.id === sample.clientId)?.clientName ?? "";
      const project = store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "";
      return `${sample.sampleCode} ${sample.sampleType} ${sample.sampleDescription} ${sample.collectedBy ?? ""} ${client} ${project}`
        .toLowerCase()
        .includes(q);
    });
  }, [query, store.samples, store.clients, store.projects]);

  return (
    <>
      <PageHeader
        title={t("nav.fieldRegister")}
        description="Regjistri i kampionëve të marrë ose testuar në terren / Register of samples taken or tested on site."
        action={<Link href="/field/new" className="btn-primary">{t("field.new")}</Link>}
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
              <th className="px-4 py-3">Testi / Test</th>
              <th className="px-4 py-3">Sasia / Qty</th>
              <th className="px-4 py-3">Marrë nga / Sampled by</th>
              <th className="px-4 py-3">Statusi / Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((sample) => (
              <tr key={sample.id} className="hover:bg-lab-mist/60">
                <td className="px-4 py-3 font-semibold text-ink">
                  <Link href={`/samples/${sample.id}`} className="hover:underline">{sample.sampleCode}</Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{formatEuropeanDate(sample.dateReceived)}</td>
                <td className="px-4 py-3">{store.clients.find((item) => item.id === sample.clientId)?.clientName ?? "-"}</td>
                <td className="px-4 py-3">{store.projects.find((item) => item.id === sample.projectId)?.projectName ?? "-"}</td>
                <td className="px-4 py-3">{sample.sampleDescription || "-"}</td>
                <td className="px-4 py-3">{sample.sampleType || "-"}</td>
                <td className="px-4 py-3">{sample.quantity ?? "-"}</td>
                <td className="px-4 py-3">{sample.collectedBy || "-"}</td>
                <td className="px-4 py-3"><StatusBadge status={sample.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <div className="p-6 text-sm text-muted">
            {store.samples.some(isFieldSample)
              ? "Asnjë regjistrim nuk përputhet me kërkimin. / No records match your search."
              : "Ende asnjë regjistrim terreni. / No field records yet."}
          </div>
        ) : null}
      </SimpleTable>
    </>
  );
}
