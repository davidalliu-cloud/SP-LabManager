"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useParamState } from "@/components/ui/filter-bar";
import { useLabStore } from "@/lib/lab-store";
import { canCloseNonconformity, canRaiseNonconformity } from "@/lib/permissions";
import { NC_SECTORS, formatDate, type Complaint, type ComplaintStatus } from "@/lib/nonconformity";

const STATUSES: ComplaintStatus[] = ["E hapur", "Në shqyrtim", "E mbyllur"];

/**
 * Regjistër ankesash — SL-RP-7.9.
 *
 * A short register, and the one an assessor reads first after the
 * nonconformities. Its columns are the form's; what the app adds is the client
 * behind the complainant, the report being complained about, and a single step
 * from a complaint to the nonconformity it raises.
 */
export default function ComplaintsPage() {
  const store = useLabStore();
  const router = useRouter();
  const [status, setStatus] = useParamState("status");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canLog = canRaiseNonconformity(currentUser?.role);
  const canResolve = canCloseNonconformity(currentUser?.role);

  const rows = useMemo(
    () =>
      store.complaints
        .filter((item) => status === "all" || item.status === status)
        .sort((a, b) => b.number - a.number),
    [store.complaints, status]
  );

  const openCount = store.complaints.filter((item) => item.status !== "E mbyllur").length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    store.logComplaint({
      receivedDate: text("receivedDate"),
      complainant: text("complainant"),
      clientId: text("clientId") || undefined,
      sector: text("sector"),
      description: text("description"),
      status: "E hapur",
      reportId: text("reportId") || undefined
    });
    form.reset();
    setShowForm(false);
  }

  /**
   * Raises a nonconformity from a complaint, carrying the description across
   * and recording which complaint it came from — §7.9 expects a complaint to be
   * handled, and where the work was at fault that handling is a §7.10 record.
   */
  function raiseFrom(complaint: Complaint) {
    const id = store.raiseNonconformity({
      reportedDate: new Date().toISOString().slice(0, 10),
      sector: complaint.sector,
      foundBy: "Ankesë e klientit",
      description: `Ankesa nr. ${complaint.number} (${complaint.complainant}): ${complaint.description}`,
      complaintId: complaint.id,
      reportId: complaint.reportId
    });
    if (id) router.push(`/quality/nonconformities/${id}`);
  }

  return (
    <>
      <PageHeader
        title="Ankesat"
        description="SL-RP-7.9 Regjistër ankesash."
        action={
          canLog ? (
            <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-primary">
              {showForm ? "Anulo" : "Ankesë e re"}
            </button>
          ) : null
        }
      />

      {openCount > 0 ? (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="font-semibold">{openCount} ankesa pa përgjigje përfundimtare.</span>
        </div>
      ) : null}

      {showForm ? (
        <form onSubmit={submit} className="surface-card mb-5">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Ankesë e re</h2>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-3">
            <Field label="Data e regjistrimit">
              <input type="date" name="receivedDate" required defaultValue={new Date().toISOString().slice(0, 10)} className="input" />
            </Field>
            <Field label="Ankimuesi">
              <input name="complainant" required className="input" />
            </Field>
            <Field label="Klienti (nëse është në regjistër)">
              <select name="clientId" className="input">
                <option value="">—</option>
                {store.clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.clientName}</option>
                ))}
              </select>
            </Field>
            <Field label="Sektori të cilit i drejtohet">
              <select name="sector" required className="input">
                {NC_SECTORS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </Field>
            <Field label="Raporti (nëse ankesa është për një raport)">
              <input name="reportId" list="report-ids" className="input" placeholder="id e raportit" />
            </Field>
            <div className="md:col-span-3">
              <Field label="Përshkrimi i ankesës">
                <textarea name="description" required rows={3} className="input w-full" />
              </Field>
            </div>
          </div>
          <div className="flex justify-end border-t border-line p-5">
            <button type="submit" className="btn-primary">Regjistro</button>
          </div>
        </form>
      ) : null}

      <div className="surface-card">
        <div className="flex flex-wrap items-end gap-3 border-b border-line p-4">
          <label>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Statusi i ankesës</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input">
              <option value="all">Të gjitha</option>
              {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[58rem] text-sm">
            <thead className="bg-lab-porcelain text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Nr. i ankesës</th>
                <th className="px-4 py-3">Data e regjistrimit</th>
                <th className="px-4 py-3">Ankimuesi</th>
                <th className="px-4 py-3">Sektori</th>
                <th className="px-4 py-3">Përshkrimi i ankesës</th>
                <th className="px-4 py-3">Statusi</th>
                <th className="px-4 py-3">Data e përgjigjes</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((item) => {
                const nc = store.nonconformities.find((row) => row.complaintId === item.id);
                return (
                  <tr key={item.id} className="align-top">
                    <td className="px-4 py-3 font-semibold text-ink">{item.number}</td>
                    <td className="px-4 py-3 tabular-nums">{formatDate(item.receivedDate)}</td>
                    <td className="px-4 py-3">{item.complainant}</td>
                    <td className="px-4 py-3 text-muted">{item.sector}</td>
                    <td className="max-w-md px-4 py-3">
                      {item.description}
                      {item.resolution ? (
                        <div className="mt-1 text-xs text-muted">Trajtimi: {item.resolution}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {canResolve && editing === item.id ? (
                        <ResolveForm
                          item={item}
                          onDone={() => setEditing(null)}
                          onSave={(input) => store.saveComplaint(item.id, input)}
                        />
                      ) : (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                          item.status === "E mbyllur"
                            ? "bg-green-100 text-green-900 ring-green-300"
                            : item.status === "Në shqyrtim"
                              ? "bg-amber-100 text-amber-900 ring-amber-300"
                              : "bg-lab-porcelain text-ink ring-line"
                        }`}>{item.status}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{item.respondedDate ? formatDate(item.respondedDate) : "—"}</td>
                    <td className="px-4 py-3 text-right text-xs">
                      <div className="flex flex-col items-end gap-1">
                        {canResolve && editing !== item.id ? (
                          <button type="button" onClick={() => setEditing(item.id)} className="font-semibold text-lab-burgundy underline">
                            Trajto
                          </button>
                        ) : null}
                        {nc ? (
                          <Link href={`/quality/nonconformities/${nc.id}`} className="font-semibold text-lab-burgundy underline">
                            JK nr. {nc.number}
                          </Link>
                        ) : canLog ? (
                          <button type="button" onClick={() => raiseFrom(item)} className="font-semibold text-lab-burgundy underline">
                            Ngri JK
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted">Asnjë ankesë e regjistruar.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Formularët përkatës: SL-FP-7.9.1 Formular ankese, SL-FP-7.9.2 Formulari i trajtimit, SL-FP-7.9.3 Njoftim për
        ankimuesin.
      </p>
    </>
  );
}

/** Inline handling: the status, the response date and how it was dealt with. */
function ResolveForm({
  item,
  onDone,
  onSave
}: {
  item: Complaint;
  onDone: () => void;
  onSave: (input: { status: ComplaintStatus; respondedDate?: string; resolution?: string }) => void;
}) {
  const [status, setStatus] = useState<ComplaintStatus>(item.status);
  const [respondedDate, setRespondedDate] = useState(item.respondedDate ?? "");
  const [resolution, setResolution] = useState(item.resolution ?? "");
  return (
    <div className="flex min-w-56 flex-col gap-2">
      <select value={status} onChange={(event) => setStatus(event.target.value as ComplaintStatus)} className="input">
        {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <input type="date" value={respondedDate} onChange={(event) => setRespondedDate(event.target.value)} className="input" />
      <input
        value={resolution}
        onChange={(event) => setResolution(event.target.value)}
        placeholder="Trajtimi"
        className="input"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onSave({ status, respondedDate: respondedDate || undefined, resolution: resolution || undefined });
            onDone();
          }}
          className="btn-primary px-3 py-1 text-xs"
        >
          Ruaj
        </button>
        <button type="button" onClick={onDone} className="text-xs text-muted underline">Anulo</button>
      </div>
    </div>
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
