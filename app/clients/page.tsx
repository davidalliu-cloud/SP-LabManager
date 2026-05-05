"use client";

import { FormEvent, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SimpleTable } from "@/components/ui/simple-table";
import { futureErpClients } from "@/lib/client-directory";
import { useLabStore } from "@/lib/lab-store";

const emptyClientDraft = {
  clientName: "",
  contactPerson: "",
  email: "",
  phone: "",
  nipt: "",
  erpId: ""
};

export default function ClientsPage() {
  const store = useLabStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedErpId, setSelectedErpId] = useState("");
  const [clientDraft, setClientDraft] = useState(emptyClientDraft);

  function selectDirectoryClient(erpId: string) {
    setSelectedErpId(erpId);
    const selected = futureErpClients.find((client) => client.erpId === erpId);
    if (!selected) {
      setClientDraft(emptyClientDraft);
      return;
    }
    setClientDraft({
      clientName: selected.clientName,
      contactPerson: selected.contactPerson,
      email: selected.email,
      phone: selected.phone,
      nipt: selected.nipt,
      erpId: selected.erpId
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const notes = [
      String(form.get("notes") ?? "").trim(),
      clientDraft.erpId ? `FutureERP ID: ${clientDraft.erpId}` : "",
      clientDraft.nipt ? `NIPT: ${clientDraft.nipt}` : ""
    ]
      .filter(Boolean)
      .join(" | ");
    store.createClient({
      clientName: clientDraft.clientName,
      contactPerson: clientDraft.contactPerson,
      email: clientDraft.email,
      phone: clientDraft.phone,
      address: String(form.get("address")),
      notes,
      projectName: String(form.get("projectName")),
      projectLocation: String(form.get("projectLocation")),
      projectDescription: String(form.get("projectDescription"))
    });
    event.currentTarget.reset();
    setSelectedErpId("");
    setClientDraft(emptyClientDraft);
    setShowForm(false);
  }

  const nextCode = `CL-${String(store.clients.length + 1).padStart(3, "0")}`;

  return (
    <>
      <PageHeader
        title="Clients"
        description="Head of lab view for client identities and the codes used during sample registration."
        action={
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="btn-primary"
          >
            {showForm ? "Close form" : "Add client"}
          </button>
        }
      />

      {showForm ? (
        <form onSubmit={submit} className="surface-card mb-5 grid gap-4 p-5 lg:grid-cols-2">
          <Field label="Assigned client code">
            <input className="input bg-lab-porcelain font-semibold" value={nextCode} readOnly />
          </Field>
          <Field label="Select client from FutureERP list">
            <select
              value={selectedErpId}
              onChange={(event) => selectDirectoryClient(event.target.value)}
              required
              className="input"
            >
              <option value="">Choose one of {futureErpClients.length} clients</option>
              {futureErpClients.map((client) => (
                <option key={client.erpId} value={client.erpId}>
                  {client.clientName} {client.nipt ? `- ${client.nipt}` : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Client name">
            <input
              value={clientDraft.clientName}
              onChange={(event) => setClientDraft((draft) => ({ ...draft, clientName: event.target.value }))}
              required
              className="input"
              placeholder="Company or client name"
            />
          </Field>
          <Field label="Project name">
            <input name="projectName" required className="input" placeholder="Project linked to this client" />
          </Field>
          <Field label="Project location">
            <input name="projectLocation" className="input" placeholder="City, site, or area" />
          </Field>
          <Field label="Address">
            <input name="address" className="input" placeholder="Client address" />
          </Field>
          <Field label="Contact person">
            <input
              value={clientDraft.contactPerson}
              onChange={(event) => setClientDraft((draft) => ({ ...draft, contactPerson: event.target.value }))}
              className="input"
              placeholder="Main contact name"
            />
          </Field>
          <Field label="Email">
            <input
              value={clientDraft.email}
              onChange={(event) => setClientDraft((draft) => ({ ...draft, email: event.target.value }))}
              type="email"
              className="input"
              placeholder="contact@example.com"
            />
          </Field>
          <Field label="Phone">
            <input
              value={clientDraft.phone}
              onChange={(event) => setClientDraft((draft) => ({ ...draft, phone: event.target.value }))}
              className="input"
              placeholder="Phone or mobile number"
            />
          </Field>
          <Field label="NIPT / tax ID">
            <input
              value={clientDraft.nipt}
              onChange={(event) => setClientDraft((draft) => ({ ...draft, nipt: event.target.value }))}
              className="input"
              placeholder="NIPT"
            />
          </Field>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-ink">Project description</label>
            <textarea name="projectDescription" rows={3} className="input mt-1" placeholder="Scope, package, site notes, or contract reference" />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-ink">Other contact information / notes</label>
            <textarea name="notes" rows={3} className="input mt-1" placeholder="Secondary contacts, billing contact, WhatsApp, special instructions" />
          </div>
          <div className="lg:col-span-2">
            <button className="btn-success">
              Save client
            </button>
          </div>
        </form>
      ) : null}

      <SimpleTable>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="table-head">
            <tr><th className="px-4 py-3">Client code</th><th className="px-4 py-3">Client</th><th className="px-4 py-3">Project</th><th className="px-4 py-3">Address</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Notes</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {store.clients.map((client) => {
              const project = store.projects.find((item) => item.clientId === client.id);
              return (
                <tr key={client.id}>
                  <td className="px-4 py-3 font-semibold">{client.clientCode}</td>
                  <td className="px-4 py-3">{client.clientName}</td>
                  <td className="px-4 py-3">{project?.projectName ?? "-"}</td>
                  <td className="px-4 py-3">{client.address}</td>
                  <td className="px-4 py-3">{client.contactPerson}</td>
                  <td className="px-4 py-3">{client.email}</td>
                  <td className="px-4 py-3">{client.phone}</td>
                  <td className="px-4 py-3">{client.notes ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SimpleTable>
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
