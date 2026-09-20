"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { canCloseNonconformity } from "@/lib/permissions";
import {
  NC_SECTORS,
  NC_SOURCES,
  daysBetween,
  dueState,
  formatDate,
  nonconformityStatus,
  parseDate
} from "@/lib/nonconformity";

/**
 * One nonconformity, worked through as SL-FP-7.10.1 lays it out: what was
 * found, why it happened, what was done, by when, and the check that it worked.
 *
 * The order of the page is the order of the form, which is also the order of
 * the thinking — a corrective action written before the root cause is a guess.
 */
export default function NonconformityDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const item = store.nonconformities.find((row) => row.id === params.id);
  const today = useMemo(() => new Date(), []);
  const [saved, setSaved] = useState(false);

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canClose = canCloseNonconformity(currentUser?.role);

  if (!store.isReady) return null;
  if (!item) {
    return (
      <>
        <PageHeader title="Jokonformiteti nuk u gjet" description="Ky regjistrim nuk ekziston." />
        <Link href="/quality/nonconformities" className="text-sm font-semibold text-lab-burgundy underline">
          Kthehu te regjistri
        </Link>
      </>
    );
  }

  const status = nonconformityStatus(item);
  const state = dueState(item, today);
  const due = parseDate(item.dueDate);
  const days = due ? daysBetween(today, due) : 0;

  const sample = store.samples.find((row) => row.id === item.sampleId);
  const report = store.reports.find((row) => row.id === item.reportId);
  const equipment = store.equipment.find((row) => row.id === item.equipmentId);
  const complaint = store.complaints.find((row) => row.id === item.complaintId);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    store.saveNonconformity(item!.id, {
      reportedDate: text("reportedDate"),
      sector: text("sector"),
      foundBy: text("foundBy"),
      code: text("code"),
      description: text("description"),
      rootCause: text("rootCause"),
      correctiveAction: text("correctiveAction"),
      responsiblePerson: text("responsiblePerson"),
      dueDate: text("dueDate"),
      completedDate: text("completedDate"),
      effectivenessCheck: text("effectivenessCheck"),
      monitoredBy: text("monitoredBy"),
      clientNotified: data.get("clientNotified") === "on",
      clientNotifiedDate: text("clientNotifiedDate")
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  }

  return (
    <>
      <PageHeader
        title={`Jokonformiteti nr. ${item.number}`}
        description={`${item.sector} · ${item.foundBy} · ${formatDate(item.reportedDate)}`}
        action={
          <Link href="/quality/nonconformities" className="text-sm font-semibold text-lab-burgundy underline">
            Kthehu te regjistri
          </Link>
        }
      />

      <div
        className={`mb-5 rounded-lg border p-4 text-sm ${
          state === "overdue"
            ? "border-red-300 bg-red-50 text-red-900"
            : status === "Mbyllur"
              ? "border-green-300 bg-green-50 text-green-900"
              : "border-line bg-white text-ink"
        }`}
      >
        <span className="font-semibold">{status}.</span>{" "}
        {status === "Mbyllur"
          ? `Veprimi u krye më ${formatDate(item.completedDate)} dhe efikasiteti u verifikua.`
          : state === "overdue"
            ? `Afati ishte ${formatDate(item.dueDate)} — ${Math.abs(days)} ditë vonesë.`
            : item.dueDate
              ? `Afati ${formatDate(item.dueDate)} — për ${days} ditë.`
              : "Pa afat të caktuar."}
      </div>

      {/* What this finding concerns. The reason the register lives here. */}
      {sample || report || equipment || complaint ? (
        <section className="surface-card mb-5 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink">Lidhur me</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            {sample ? <Link href={`/samples/${sample.id}`} className="text-lab-burgundy underline">Kampioni {sample.sampleCode}</Link> : null}
            {report ? <Link href={`/reports/${report.id}`} className="text-lab-burgundy underline">Raporti {report.reportNumber}</Link> : null}
            {equipment ? <Link href={`/quality/equipment/${equipment.id}`} className="text-lab-burgundy underline">Pajisja {equipment.uniqueCode || equipment.name}</Link> : null}
            {complaint ? <Link href="/quality/complaints" className="text-lab-burgundy underline">Ankesa nr. {complaint.number}</Link> : null}
          </div>
        </section>
      ) : null}

      <form onSubmit={submit} className="space-y-5">
        <section className="surface-card">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-lg font-semibold text-ink">Jokonformiteti</h2>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-4">
            <Field label="Data e raportimit të JK">
              <input type="date" name="reportedDate" defaultValue={item.reportedDate} className="input" />
            </Field>
            <Field label="Sektori">
              <select name="sector" defaultValue={item.sector} className="input">
                {NC_SECTORS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </Field>
            <Field label="U konstatua nga">
              <select name="foundBy" defaultValue={item.foundBy} className="input">
                {NC_SOURCES.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </Field>
            <Field label="Kodi i JK">
              <input name="code" defaultValue={item.code ?? ""} className="input" />
            </Field>
            <div className="md:col-span-4">
              <Field label="Përshkrimi i JK">
                <textarea name="description" rows={3} defaultValue={item.description} className="input w-full" />
              </Field>
            </div>
          </div>
        </section>

        <section className="surface-card">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-lg font-semibold text-ink">Veprimi korrigjues</h2>
            <p className="mt-1 text-sm text-muted">
              {canClose
                ? "Shkaku përpara veprimit: një veprim korrigjues i shkruar para analizës së shkakut është hamendje."
                : "Vetëm Menaxheri i Cilësisë, Përgjegjësi i Laboratorit dhe Administratori mund ta plotësojnë këtë pjesë."}
            </p>
          </div>
          <fieldset disabled={!canClose} className="m-0 min-w-0 border-0 p-0 disabled:opacity-70">
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Analiza e shkakut të JK">
                  <textarea name="rootCause" rows={3} defaultValue={item.rootCause ?? ""} className="input w-full" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Veprimi korrigjues që do të ndërmerret">
                  <textarea name="correctiveAction" rows={3} defaultValue={item.correctiveAction ?? ""} className="input w-full" />
                </Field>
              </div>
              <Field label="Personi përgjegjës">
                <input name="responsiblePerson" defaultValue={item.responsiblePerson ?? ""} className="input" />
              </Field>
              <Field label="Afati">
                <input type="date" name="dueDate" defaultValue={item.dueDate ?? ""} className="input" />
              </Field>
              <Field label="Data e kryerjes së veprimit">
                <input type="date" name="completedDate" defaultValue={item.completedDate ?? ""} className="input" />
              </Field>
              <Field label="Zgjidhja u monitorua nga">
                <input name="monitoredBy" defaultValue={item.monitoredBy ?? ""} className="input" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Verifikimi / Monitorimi i efikasitetit">
                  <textarea name="effectivenessCheck" rows={2} defaultValue={item.effectivenessCheck ?? ""} className="input w-full" />
                </Field>
              </div>
            </div>

            <div className="grid gap-4 border-t border-line p-5 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="clientNotified" defaultChecked={item.clientNotified} />
                Klienti u njoftua (SL-FP-7.10-1e)
              </label>
              <Field label="Data e njoftimit">
                <input type="date" name="clientNotifiedDate" defaultValue={item.clientNotifiedDate ?? ""} className="input" />
              </Field>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-line p-5">
              {saved ? <span className="text-sm font-semibold text-green-700">U ruajt.</span> : null}
              <button type="submit" className="btn-primary">Ruaj</button>
            </div>
          </fieldset>
        </section>
      </form>
    </>
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
