"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  FIELD_WORK_OPTIONS,
  accreditedTestForFieldOption
} from "@/lib/field-register";
import { useLabStore, type NewSampleInput } from "@/lib/lab-store";

function formatDateInput(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(iso: string, days: number) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  date.setDate(date.getDate() + days);
  return formatDateInput(date);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

/**
 * Registration for work carried out on site, reached from the Field Register
 * the same way /samples/new is reached from the Sample Register.
 *
 * Only the four field determinations are offered here, and only here — the
 * sample register no longer lists them. What it creates is an ordinary sample,
 * so once the Chief of Lab accepts it the test appears in the test register and
 * its report in the report register, alongside laboratory work.
 */
export default function NewFieldRecordPage() {
  const store = useLabStore();
  const router = useRouter();
  const today = useMemo(() => formatDateInput(new Date()), []);
  const [optionIndex, setOptionIndex] = useState(0);
  const [samplingDate, setSamplingDate] = useState(today);

  const option = FIELD_WORK_OPTIONS[optionIndex] ?? FIELD_WORK_OPTIONS[0];
  const accreditedTest = accreditedTestForFieldOption(option);
  const activeUsers = useMemo(
    () => store.users.filter((user) => user.isActive).slice().sort((a, b) => a.fullName.localeCompare(b.fullName)),
    [store.users]
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateReceived = String(form.get("samplingDate") || today);
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
    const sampleId = store.createSample(input);
    router.push(`/samples/${sampleId}`);
  }

  return (
    <>
      <PageHeader
        title="Kampion i ri terreni / New field record"
        description="Testet e terrenit regjistrohen vetëm këtu. Pas pranimit shfaqen te Testet dhe te Raportet si çdo kampion tjetër."
        action={<Link href="/field" className="btn-secondary">Kthehu te regjistri</Link>}
      />

      <form onSubmit={submit} className="surface-card">
        <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
          <Field label="Testi / Test">
            <select
              name="fieldTest"
              className="input"
              value={optionIndex}
              onChange={(event) => setOptionIndex(Number(event.target.value))}
            >
              {FIELD_WORK_OPTIONS.map((item, index) => (
                <option key={item.accreditedTestId} value={index}>{item.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Standardi / Standard">
            <input className="input bg-lab-porcelain" value={accreditedTest?.standard ?? "-"} readOnly />
          </Field>
          <Field label="Kodi i akreditimit / Scope code">
            <input className="input bg-lab-porcelain" value={option.accreditedTestId} readOnly />
          </Field>

          <div className="md:col-span-2">
            <Field label="Vendndodhja / Location">
              <input name="location" required className="input" placeholder="p.sh. Segmenti Rrashbull, pk 2+300" />
            </Field>
          </div>
          <Field label="Sasia / Quantity">
            <input name="quantity" type="number" min="1" step="1" defaultValue={1} className="input" />
          </Field>
        </div>

        <div className="grid gap-4 border-b border-line p-5 md:grid-cols-3">
          <Field label="Data e marrjes / Sampling date">
            <input
              name="samplingDate"
              type="date"
              value={samplingDate}
              onChange={(event) => setSamplingDate(event.target.value)}
              className="input"
            />
          </Field>
          <Field label="Ora / Time">
            <input name="timeReceived" type="time" className="input" />
          </Field>
          <Field label="Marrë nga / Sampled by">
            <select name="collectedBy" className="input" defaultValue="">
              <option value="">Zgjidh punonjësin</option>
              {activeUsers.map((user) => (
                <option key={user.id} value={user.fullName}>{user.fullName}</option>
              ))}
            </select>
          </Field>

          <Field label="Data e testimit / Test date">
            <input name="requiredTestDate" type="date" defaultValue={samplingDate} key={`test-${samplingDate}`} className="input" />
          </Field>
          <Field label="Afati i raportit / Report due">
            <input name="reportDueDate" type="date" defaultValue={addDays(samplingDate, 3)} key={`due-${samplingDate}`} className="input" />
          </Field>
          <Field label="Tekniku / Technician">
            <select name="assignedTechnician" className="input" defaultValue="">
              <option value="">Cakto më vonë</option>
              {activeUsers.map((user) => (
                <option key={user.id} value={user.id}>{user.fullName}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="p-5">
          <Field label="Shënime / Notes">
            <input name="notes" className="input" />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-line p-5">
          <Link href="/field" className="btn-secondary">Anulo</Link>
          <button type="submit" className="btn-primary">Regjistro kampionin</button>
        </div>
      </form>
    </>
  );
}
