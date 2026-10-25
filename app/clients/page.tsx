"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FilterChips, FilterField, useParamState } from "@/components/ui/filter-bar";
import type { FilterChip } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { futureErpClients } from "@/lib/client-directory";
import { useI18n } from "@/lib/i18n";
import { useLabStore } from "@/lib/lab-store";
import { canManageClients, canViewClientIdentity } from "@/lib/permissions";
import { buildHaystack, matchesHaystack, tokeniseQuery } from "@/lib/search";

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

/** Frozen panes, as the sample and report registers do it: the header row pins
 *  to the top of the scroll area and the client code pins to the left, so nine
 *  columns can be read without losing track of whose row it is. The pinned cell
 *  carries its own background, or the columns it overlaps show through it as
 *  they scroll past — and it follows the row's hover colour for the same
 *  reason. */
const STICKY_HEAD = "sticky top-0 z-20 bg-lab-steelwash";
const STICKY_CORNER = "sticky left-0 top-0 z-30 border-r border-lab-steel bg-lab-steelwash";
const STICKY_CELL =
  "sticky left-0 z-10 border-r border-lab-steel bg-white transition-colors group-hover:bg-lab-burgundy";

function clientCodeNumber(code: string) {
  const match = /^K(\d+)$/i.exec(code.trim());
  return match ? Number(match[1]) : Number.NaN;
}

function compareClientCodes(left: string, right: string) {
  const leftNumber = clientCodeNumber(left);
  const rightNumber = clientCodeNumber(right);
  const leftHasNumber = Number.isFinite(leftNumber);
  const rightHasNumber = Number.isFinite(rightNumber);

  if (leftHasNumber && rightHasNumber && leftNumber !== rightNumber) {
    return leftNumber - rightNumber;
  }

  if (leftHasNumber !== rightHasNumber) {
    return leftHasNumber ? -1 : 1;
  }

  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canViewClients = canViewClientIdentity(currentUser?.role);
  const canEditClients = canManageClients(currentUser?.role);
  const suggestedCode = useMemo(() => nextClientCode(store.clients.map((client) => client.clientCode)), [store.clients]);
  const sortedClients = useMemo(
    () => [...store.clients].sort((left, right) => compareClientCodes(left.clientCode, right.clientCode)),
    [store.clients]
  );

  const { t } = useI18n();
  const [query, setQuery] = useParamState("q", "");
  const [clientFilter, setClientFilter] = useParamState("client", "all");

  // One searchable string per client, built once rather than per keystroke.
  // Everything on the row is indexed — code, name, project, address, contact,
  // email, phone, NIPT and notes — so whichever of them the person happens to
  // have in front of them finds the client.
  const rows = useMemo(
    () =>
      sortedClients.map((client) => {
        const project = store.projects.find((item) => item.clientId === client.id);
        return {
          client,
          project,
          haystack: buildHaystack([
            client.clientCode,
            client.clientName,
            project?.projectName,
            project?.location,
            project?.description,
            client.address,
            client.contactPerson,
            client.email,
            client.phone,
            niptFromNotes(client.notes),
            client.notes
          ])
        };
      }),
    [sortedClients, store.projects]
  );

  const queryTokens = useMemo(() => tokeniseQuery(query), [query]);
  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        if (clientFilter !== "all" && row.client.id !== clientFilter) return false;
        return matchesHaystack(row.haystack, queryTokens);
      }),
    [rows, clientFilter, queryTokens]
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

  function clearFilters() {
    setQuery("");
    setClientFilter("all");
  }

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
    // Drop ?edit=<id> so closing (including after a save) doesn't just
    // reopen the form again via the effect below watching searchParams.
    if (searchParams.get("edit")) router.replace("/clients");
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
    // Edit what is stored, not the tidied display copy, so opening a client and
    // saving it does not quietly rewrite its name.
    const client = store.rawClients.find((item) => item.id === clientId);
    if (!client) return;
    const project = store.rawProjects.find((item) => item.clientId === client.id);

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

  // Lets the read-only client detail page (/clients/[id]) link straight into
  // this list's edit form via ?edit=<clientId> — that page has no editing UI
  // of its own, so without this a link there could only ever open the form
  // empty. Re-runs once store.clients is hydrated, in case this fires before
  // client data has loaded.
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && canEditClients) editClient(editId);
  }, [searchParams, store.clients, canEditClients]);

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
          Vetëm Kryelaboranti dhe Administratori mund të shtojnë ose ruajnë klientë.
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

      {canViewClients ? (
        <div className="no-print mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr]">
          <FilterField label={t("filters.search")}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kodi, emri, projekti, NIPT, email, telefoni…"
              className="input mt-1"
            />
          </FilterField>
          <FilterField label="Zgjidh klientin">
            <select value={clientFilter} onChange={(event) => setClientFilter(event.target.value)} className="input mt-1">
              <option value="all">Të gjithë klientët ({sortedClients.length})</option>
              {sortedClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.clientCode} — {client.clientName}
                </option>
              ))}
            </select>
          </FilterField>
        </div>
      ) : null}

      {canViewClients ? (
        <FilterChips
          chips={chips}
          resultCount={visibleRows.length}
          onClearAll={clearFilters}
          countLabel={t("filters.results.clients")}
        />
      ) : null}

      {canViewClients ? (
      <div className="surface-card overflow-hidden">
        {/* Scrolls inside itself so the header row and the client code stay put
            while the other seven columns move. */}
        <div className="register-scroll max-h-[70vh] overflow-auto">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="table-head">
            <tr>
              <th className={`${STICKY_CORNER} px-4 py-3`}>Kodi i klientit</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Klienti</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Projekti / objekti</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Vendndodhja</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Adresa</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Kontakti</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Email</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Telefoni</th>
              <th className={`${STICKY_HEAD} px-4 py-3`}>Shënime</th>
              {canEditClients ? <th className={`${STICKY_HEAD} px-4 py-3`}>Veprime</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visibleRows.map(({ client, project }) => {
              return (
                <tr
                  key={client.id}
                  onClick={() => router.push(`/clients/${client.id}`)}
                  className="group cursor-pointer transition-colors hover:bg-lab-burgundy hover:text-white"
                >
                  <td className={`${STICKY_CELL} px-4 py-3 font-semibold`}>
                    <span className="text-lab-burgundy underline group-hover:text-white">{client.clientCode}</span>
                  </td>
                  <td className="px-4 py-3">{client.clientName}</td>
                  <td className="px-4 py-3">
                    {project?.projectName ?? "-"}
                    {/* Filled on five records of 155, so it rides under the
                        object rather than taking a column that is blank 150
                        times over. */}
                    {project?.description ? (
                      <span className="block text-xs text-muted group-hover:text-white/80">{project.description}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{project?.location || "-"}</td>
                  <td className="px-4 py-3">{client.address || "-"}</td>
                  <td className="px-4 py-3">{client.contactPerson || "-"}</td>
                  <td className="px-4 py-3">{client.email || "-"}</td>
                  <td className="px-4 py-3">{client.phone || "-"}</td>
                  <td className="px-4 py-3">{client.notes ?? "-"}</td>
                  {canEditClients ? (
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            editClient(client.id);
                          }}
                          className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                        >
                          Ndrysho
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteClient(client.id);
                          }}
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
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={canEditClients ? 9 : 8} className="px-4 py-10 text-center text-sm text-muted">
                  Asnjë klient nuk përputhet me filtrat.{" "}
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
