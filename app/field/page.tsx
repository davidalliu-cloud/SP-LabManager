"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatEuropeanDate } from "@/lib/date-format";
import {
  FIELD_WORK_OPTIONS,
  accreditedTestForFieldOption,
  isFieldSample
} from "@/lib/field-register";
import { useI18n } from "@/lib/i18n";
import { useLabStore, type NewSampleInput } from "@/lib/lab-store";

function todayInput() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addDays(iso: string, days: number) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

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
  const [showForm, setShowForm] = useState(false);
  const [optionIndex, setOptionIndex] = useState(0);
  const [samplingDate, setSamplingDate] = useState(todayInput);

  const option = FIELD_WORK_OPTIONS[optionIndex] ?? FIELD_WORK_OPTIONS[0];
  const accreditedTest = accreditedTestForFieldOption(option);
  const activeUsers = useMemo(() => store.users.filter((user) => user.isActive), [store.users]);

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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateReceived = String(form.get("samplingDate") || todayInput());
    const input: NewSampleInput = {
      // Client and project are assigned by the Chief of Lab on acceptance, the
      // same as a sample registered in the laboratory.
      clientId: "",
      projectId: "",
      sampleType: option.sampleType,
      sampleDescription: String(form.get("location") || ""),
      quantity: Number(form.get("quantity") || 1),
      dateReceived,
      timeReceived: String(form.get("timeReceived") || ""),
      // Field work is by definition carried out by the laboratory on site.
      collectionMethod: "Collected by lab technician",
      deliveredBy: "",
      collectedBy: String(form.get("collectedBy") || ""),
      requestedTestType: accreditedTest?.testName ?? option.label,
      standard: accreditedTest?.standard || "Standardi nuk është përcaktuar në listën e akreditimit",
      requiredTestDate: String(form.get("requiredTestDate") || dateReceived),
      reportDueDate: String(form.get("reportDueDate") || addDays(dateReceived, 3)),
      assignedTechnician: String(form.get("assignedTechnician") || ""),
      schedules: [],
      notes: String(form.get("notes") || "")
    };
    store.createSample(input);
    setShowForm(false);
  }

  return (
    <>
      <PageHeader
        title={t("nav.fieldRegister")}
        description="Regjistri i kampionëve të marrë ose testuar në terren / Register of samples taken or tested on site."
        action={
          <button type="button" className="btn-primary" onClick={() => setShowForm((open) => !open)}>
            {showForm ? "Mbyll" : "Regjistrim i ri terreni"}
          </button>
        }
      />

      {showForm ? (
        <form onSubmit={submit} className="surface-card mb-4">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-lg font-semibold text-ink">Regjistrim i ri / <span className="italic font-normal">New field record</span></h2>
            <p className="mt-1 text-sm text-muted">
              Këto katër teste regjistrohen vetëm këtu. Pas pranimit nga Kryelaboranti ato shfaqen te Testet dhe te Raportet si çdo kampion tjetër.
            </p>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Testi / Test</span>
              <select
                className="input"
                value={optionIndex}
                onChange={(event) => setOptionIndex(Number(event.target.value))}
              >
                {FIELD_WORK_OPTIONS.map((item, index) => (
                  <option key={item.accreditedTestId} value={index}>{item.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Standardi / Standard</span>
              <input className="input bg-lab-porcelain" value={accreditedTest?.standard ?? "-"} readOnly />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Kodi i akreditimit</span>
              <input className="input bg-lab-porcelain" value={option.accreditedTestId} readOnly />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Vendndodhja / Location</span>
              <input name="location" required className="input" placeholder="p.sh. Segmenti Rrashbull, pk 2+300" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Sasia / Qty</span>
              <input name="quantity" type="number" min="1" step="1" defaultValue={1} className="input" />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Data e marrjes / Sampling date</span>
              <input
                name="samplingDate"
                type="date"
                value={samplingDate}
                onChange={(event) => setSamplingDate(event.target.value)}
                className="input"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Ora / Time</span>
              <input name="timeReceived" type="time" className="input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Marrë nga / Sampled by</span>
              <select name="collectedBy" className="input" defaultValue="">
                <option value="">Zgjidh punonjësin</option>
                {activeUsers.map((user) => (
                  <option key={user.id} value={user.fullName}>{user.fullName}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Data e testimit / Test date</span>
              <input name="requiredTestDate" type="date" defaultValue={samplingDate} key={`test-${samplingDate}`} className="input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Afati i raportit / Report due</span>
              <input name="reportDueDate" type="date" defaultValue={addDays(samplingDate, 3)} key={`due-${samplingDate}`} className="input" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Tekniku / Technician</span>
              <select name="assignedTechnician" className="input" defaultValue="">
                <option value="">Cakto më vonë</option>
                {activeUsers.map((user) => (
                  <option key={user.id} value={user.id}>{user.fullName}</option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-3">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Shënime / Notes</span>
              <input name="notes" className="input" />
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-line p-5">
            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Anulo</button>
            <button type="submit" className="btn-primary">Regjistro</button>
          </div>
        </form>
      ) : null}

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
