"use client";

import { FormEvent, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { futureErpClients } from "@/lib/client-directory";
import { useLabStore } from "@/lib/lab-store";
import { canViewClientIdentity } from "@/lib/permissions";

const emptyClientDraft = {
  clientCode: "",
  clientName: "",
  projectName: "",
  projectLocation: "",
  projectDescription: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  nipt: "",
  notes: ""
};

type ClientDraft = typeof emptyClientDraft;

function nextClientCode(codes: string[]) {
  const numbers = codes
    .map((code) => /^K(\d+)$/i.exec(code)?.[1])
    .filter(Boolean)
    .map((value) => Number(value));
  const next = numbers.length ? Math.max(...numbers) + 1 : codes.length + 1;
  return `K${String(next).padStart(2, "0")}`;
}

function niptFromNotes(notes?: string) {
  return /NIPT:\s*([^|]+)/i.exec(notes ?? "")?.[1]?.trim() ?? "";
}

function notesWithoutNipt(notes?: string) {
  return (notes ?? "").replace(/(^|\s*\|\s*)NIPT:\s*[^|]+/i, "").trim();
}

export default function ClientsPage() {
  const store = useLabStore();
  const [showForm, setShowForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState("");
  const [selectedErpId, setSelectedErpId] = useState("");
  const [clientDraft, setClientDraft] = useState<ClientDraft>(emptyClientDraft);
  const [deleteMessage, setDeleteMessage] = useState("");

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canEditClients = canViewClientIdentity(currentUser?.role);
  const suggestedCode = useMemo(() => nextClientCode(store.clients.map((client) => client.clientCode)), [store.clients]);

  function openNewForm() {
    setEditingClientId("");
    setSelectedErpId("");
    setClientDraft({ ...emptyClientDraft, clientCode: suggestedCode });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingClientId("");
    setSelectedErpId("");
    setClientDraft(emptyClientDraft);
  }

  function selectDirectoryClient(erpId: string) {
    setSelectedErpId(erpId);
    const selected = futureErpClients.find((client) => client.erpId === erpId);
    if (!selected) return;

    setClientDraft((draft) => ({
      ...draft,
      clientCode: selected.clientCode,
      clientName: selected.clientName,
      projectName: selected.projectName,
      projectLocation: selected.address,
      projectDescription: selected.nipt ? `NIPT: ${selected.nipt}` : "",
      contactPerson: selected.contactPerson,
      email: selected.email,
      phone: selected.phone,
      address: selected.address,
      nipt: selected.nipt
    }));
  }

  function editClient(clientId: string) {
    const client = store.clients.find((item) => item.id === clientId);
    if (!client) return;
    const project = store.projects.find((item) => item.clientId === client.id);

    setEditingClientId(client.id);
    setSelectedErpId("");
    setClientDraft({
      clientCode: client.clientCode,
      clientName: client.clientName,
      projectName: project?.projectName ?? "",
      projectLocation: project?.location ?? "",
      projectDescription: project?.description ?? "",
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      nipt: niptFromNotes(client.notes),
      notes: notesWithoutNipt(client.notes)
    });
    setShowForm(true);
  }

  function deleteClient(clientId: string) {
    const client = store.clients.find((item) => item.id === clientId);
    if (!client) return;

    const confirmed = window.confirm(`Të fshihet klienti ${client.clientCode} - ${client.clientName}? Do të hiqet edhe projekti përkatës nëse nuk ka kampionë, teste ose raporte të lidhura.`);
    if (!confirmed) return;

    const result = store.removeClient(clientId);
    if (!result.ok) {
      setDeleteMessage(result.message ?? "Ky klient nuk mund të fshihet.");
      return;
    }

    setDeleteMessage(`Klienti ${client.clientCode} u fshi.`);
    if (editingClientId === clientId) closeForm();
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const notes = [clientDraft.notes.trim(), clientDraft.nipt.trim() ? `NIPT: ${clientDraft.nipt.trim()}` : ""].filter(Boolean).join(" | ");
    const project = editingClientId ? store.projects.find((item) => item.clientId === editingClientId) : undefined;
    const input = {
      clientCode: clientDraft.clientCode.trim(),
      clientName: clientDraft.clientName.trim(),
      contactPerson: clientDraft.contactPerson.trim(),
      email: clientDraft.email.trim(),
      phone: clientDraft.phone.trim(),
      address: clientDraft.address.trim(),
      notes,
      projectId: project?.id,
      projectName: clientDraft.projectName.trim() || "Të përgjithshme / Pa përcaktuar",
      projectLocation: clientDraft.projectLocation.trim(),
      projectDescription: clientDraft.projectDescription.trim()
    };

    if (editingClientId) {
      store.updateClient(editingClientId, input);
    } else {
      store.createClient(input);
    }

    closeForm();
  }

  function updateDraft(field: keyof ClientDraft, value: string) {
    setClientDraft((draft) => ({ ...draft, [field]: value }));
  }

  return (
    <>
      <PageHeader
        title="Klientët"
        description="Kodet zyrtare të klientëve për vitin 2026. Identitetet e klientëve shfaqen vetëm për personat e autorizuar."
        action={
          canEditClients ? (
            <button type="button" onClick={showForm ? closeForm : openNewForm} className="btn-primary">
              {showForm ? "Mbyll formularin" : "Shto klient"}
            </button>
          ) : null
        }
      />

      {!canEditClients ? (
        <div className="surface-card p-6 text-sm text-muted">
          Identitetet e klientëve janë të kufizuara vetëm për Kryelaborantin, Kontrolluesin e Dokumenteve dhe Administratorin.
        </div>
      ) : null}

      {canEditClients && showForm ? (
        <form onSubmit={submit} className="surface-card mb-5 grid gap-4 p-5 lg:grid-cols-2">
          <Field label="Kodi i klientit">
            <input
              className="input bg-lab-porcelain font-semibold"
              value={clientDraft.clientCode}
              onChange={(event) => updateDraft("clientCode", event.target.value)}
              required
            />
          </Field>
          <Field label="Zgjidh nga regjistri i kodeve 2026">
            <select value={selectedErpId} onChange={(event) => selectDirectoryClient(event.target.value)} className="input">
              <option value="">Zgjidh një nga {futureErpClients.length} klientët e regjistruar</option>
              {futureErpClients.map((client) => (
                <option key={client.erpId} value={client.erpId}>
                  {client.clientCode} - {client.clientName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Emri i klientit">
            <input value={clientDraft.clientName} onChange={(event) => updateDraft("clientName", event.target.value)} required className="input" />
          </Field>
          <Field label="Projekti / objekti">
            <input value={clientDraft.projectName} onChange={(event) => updateDraft("projectName", event.target.value)} required className="input" />
          </Field>
          <Field label="Vendndodhja e projektit">
            <input value={clientDraft.projectLocation} onChange={(event) => updateDraft("projectLocation", event.target.value)} className="input" />
          </Field>
          <Field label="Adresa e klientit">
            <input value={clientDraft.address} onChange={(event) => updateDraft("address", event.target.value)} className="input" />
          </Field>
          <Field label="Personi i kontaktit">
            <input value={clientDraft.contactPerson} onChange={(event) => updateDraft("contactPerson", event.target.value)} className="input" />
          </Field>
          <Field label="Email">
            <input value={clientDraft.email} onChange={(event) => updateDraft("email", event.target.value)} type="email" className="input" />
          </Field>
          <Field label="Telefoni">
            <input value={clientDraft.phone} onChange={(event) => updateDraft("phone", event.target.value)} className="input" />
          </Field>
          <Field label="NIPT / ID tatimor">
            <input value={clientDraft.nipt} onChange={(event) => updateDraft("nipt", event.target.value)} className="input" />
          </Field>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-ink">Përshkrimi i projektit</label>
            <textarea value={clientDraft.projectDescription} onChange={(event) => updateDraft("projectDescription", event.target.value)} rows={3} className="input mt-1" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-ink">Informacione të tjera kontakti / shënime</label>
            <textarea value={clientDraft.notes} onChange={(event) => updateDraft("notes", event.target.value)} rows={3} className="input mt-1" />
          </div>
          <div className="lg:col-span-2">
            <button className="btn-success">{editingClientId ? "Ruaj ndryshimet" : "Ruaj klientin"}</button>
          </div>
        </form>
      ) : null}

      {deleteMessage ? (
        <div className="mb-4 rounded-md border border-lab-mist bg-lab-porcelain px-4 py-3 text-sm text-ink">
          {deleteMessage}
        </div>
      ) : null}

      {canEditClients ? (
      <SimpleTable>
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">Kodi i klientit</th>
              <th className="px-4 py-3">Klienti</th>
              <th className="px-4 py-3">Projekti / objekti</th>
              <th className="px-4 py-3">Adresa</th>
              <th className="px-4 py-3">Kontakti</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefoni</th>
              <th className="px-4 py-3">Shënime</th>
              {canEditClients ? <th className="px-4 py-3">Veprime</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {store.clients.map((client) => {
              const project = store.projects.find((item) => item.clientId === client.id);
              return (
                <tr key={client.id}>
                  <td className="px-4 py-3 font-semibold">{client.clientCode}</td>
                  <td className="px-4 py-3">{client.clientName}</td>
                  <td className="px-4 py-3">{project?.projectName ?? "-"}</td>
                  <td className="px-4 py-3">{client.address || project?.location || "-"}</td>
                  <td className="px-4 py-3">{client.contactPerson || "-"}</td>
                  <td className="px-4 py-3">{client.email || "-"}</td>
                  <td className="px-4 py-3">{client.phone || "-"}</td>
                  <td className="px-4 py-3">{client.notes ?? "-"}</td>
                  {canEditClients ? (
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => editClient(client.id)}
                          className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                        >
                          Ndrysho
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteClient(client.id)}
                          className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-100"
                        >
                          Fshi
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </SimpleTable>
      ) : null}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
