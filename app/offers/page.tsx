"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { canGenerateOffers } from "@/lib/permissions";
import {
  GEOTECH_FIXED_TOTAL,
  OFFER_TEMPLATES,
  money,
  type OfferField,
  type OfferKind
} from "@/lib/offer-fields";
import { geotechBoq, geotechLabProgramme, geotechTotals, type OfferValues } from "@/lib/offer-fill";

/**
 * Offer generator.
 *
 * The two Word templates stay the source of the document: this page only
 * collects what is variable in them and posts it to `/api/offers/generate`,
 * which hands back the filled .docx. Nothing about the layout, the branding or
 * the price catalogue is rebuilt here, so an offer cannot drift from the
 * template that was approved.
 *
 * The client and project dropdowns read the register rather than asking for
 * the same names a third time — picking a client fills its address and
 * contact, and picking one of its projects fills the object and location.
 */

type Draft = OfferValues;

function initialDraft(kind: OfferKind): Draft {
  const draft: Draft = {};
  for (const field of OFFER_TEMPLATES[kind].fields) draft[field.key] = field.value ?? "";
  return draft;
}

export default function OffersPage() {
  const store = useLabStore();
  const [kind, setKind] = useState<OfferKind>("lab");
  const [draft, setDraft] = useState<Draft>(() => initialDraft("lab"));
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string[]>([]);
  const [done, setDone] = useState("");

  const template = OFFER_TEMPLATES[kind];
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const allowed = canGenerateOffers(currentUser?.role);

  // Switching the offer type starts a clean draft, but the client and project
  // already picked are carried over: they are the same client either way.
  useEffect(() => {
    setDraft((previous) => {
      const next = initialDraft(kind);
      for (const key of ["clientName", "clientAddress", "contactPerson", "clientContact", "projectName", "offerNumber"]) {
        if (previous[key]) next[key] = previous[key];
      }
      if (previous.location && next.location !== undefined) next.location = previous.location;
      return next;
    });
    setProblem([]);
    setDone("");
  }, [kind]);

  const set = (key: string, value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setDone("");
  };

  const clients = useMemo(
    () => [...store.clients].sort((left, right) => left.clientName.localeCompare(right.clientName, "sq-AL")),
    [store.clients]
  );
  const clientProjects = useMemo(
    () => store.projects.filter((project) => project.clientId === clientId),
    [store.projects, clientId]
  );
  const staff = useMemo(
    () => store.users.filter((user) => user.isActive !== false).map((user) => user.fullName),
    [store.users]
  );

  function pickClient(id: string) {
    setClientId(id);
    setProjectId("");
    const client = store.clients.find((row) => row.id === id);
    if (!client) return;
    const contact = [client.contactPerson, client.phone, client.email].map((part) => part?.trim()).filter(Boolean);
    setDraft((previous) => ({
      ...previous,
      clientName: client.clientName,
      clientAddress: client.address ?? "",
      contactPerson: client.contactPerson ?? "",
      clientContact: contact.join(", ")
    }));
    setDone("");
  }

  function pickProject(id: string) {
    setProjectId(id);
    const project = store.projects.find((row) => row.id === id);
    if (!project) return;
    setDraft((previous) => ({
      ...previous,
      projectName: project.projectName,
      ...(kind === "geotech" ? { location: project.location ?? "" } : {})
    }));
    setDone("");
  }

  const boq = kind === "geotech" ? geotechBoq(draft) : [];
  const totals = kind === "geotech" ? geotechTotals(draft) : null;
  const programme = kind === "geotech" ? geotechLabProgramme(draft) : [];

  async function generate() {
    setBusy(true);
    setProblem([]);
    setDone("");
    try {
      // The bill of quantities and the laboratory programme are sent as the
      // numbers on screen, so what is downloaded is what was reviewed here.
      const values: OfferValues = { ...draft };
      for (const row of boq) values[`qty.${row.code}`] = String(row.quantity);
      for (const row of programme) values[row.key] = String(row.quantity);

      const response = await fetch("/api/offers/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, values })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProblem([payload?.error ?? `Gjenerimi dështoi (HTTP ${response.status}).`, ...(payload?.markers ?? [])]);
        return;
      }

      const blob = await response.blob();
      const header = response.headers.get("Content-Disposition") ?? "";
      const encoded = /filename\*=UTF-8''([^;]+)/.exec(header);
      const name = encoded ? decodeURIComponent(encoded[1]) : "oferta.docx";

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      URL.revokeObjectURL(url);
      setDone(name);
    } catch (error) {
      setProblem([error instanceof Error ? error.message : "Gjenerimi dështoi."]);
    } finally {
      setBusy(false);
    }
  }

  const staffKeys = new Set(["qualityManager", "clientCoordinator", "projectCoordinator", "geologist", "surveyor"]);

  if (!allowed) {
    return (
      <>
        <PageHeader title="Gjenerimi i ofertave" />
        <div className="rounded-md border border-lab-mist bg-lab-porcelain px-4 py-3 text-sm text-ink">
          Ofertat përgatiten nga Drejtori i Përgjithshëm ose Shefi i Laboratorit. Kërkoji një prej tyre ofertën për
          klientin.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Gjenerimi i ofertave"
        description="Plotëso formularin dhe oferta shkarkohet si dokument Word, në të njëjtin format si shabllonet e miratuara. Çmimet, tabelat dhe teksti standard vijnë nga shablloni; vetëm fushat e mëposhtme ndryshojnë."
        action={
          <button className="btn-success" onClick={generate} disabled={busy}>
            {busy ? "Po gjenerohet…" : "Gjenero ofertën (.docx)"}
          </button>
        }
      />

      <div className="surface-card mb-5 grid gap-4 p-5 lg:grid-cols-3">
        <Field label="Lloji i ofertës">
          <select className="input font-semibold" value={kind} onChange={(event) => setKind(event.target.value as OfferKind)}>
            <option value="lab">Ofertë laboratorike – testimi i materialeve</option>
            <option value="geotech">Ofertë investigim gjeoteknik dhe sizmik</option>
          </select>
        </Field>
        <Field label="Klienti nga regjistri">
          <select className="input" value={clientId} onChange={(event) => pickClient(event.target.value)}>
            <option value="">Zgjidh nga {clients.length} klientët e regjistruar</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.clientCode} – {client.clientName}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Projekti i klientit">
          <select
            className="input"
            value={projectId}
            onChange={(event) => pickProject(event.target.value)}
            disabled={!clientId}
          >
            <option value="">{clientId ? `Zgjidh nga ${clientProjects.length} projekte` : "Zgjidh klientin më parë"}</option>
            {clientProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
                {project.location ? ` – ${project.location}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <p className="text-xs leading-5 text-muted lg:col-span-3">{template.subtitle}</p>
      </div>

      {template.groups.map((group) => {
        const fields = template.fields.filter((field) => field.group === group);
        if (!fields.length) return null;
        return (
          <section key={group} className="surface-card mb-5 p-5">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">{group}</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={draft[field.key] ?? ""}
                  staff={staffKeys.has(field.key) ? staff : undefined}
                  onChange={(value) => set(field.key, value)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {kind === "geotech" && totals ? (
        <>
          <section className="surface-card mb-5 p-5">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">
              Preventivi (Tabela 10.1)
            </h2>
            <p className="mb-4 text-xs leading-5 text-muted">
              Çmimet njësi janë çmimet 2026 të shabllonit dhe nuk ndryshohen këtu. Sasitë vijnë nga fusha e punës më
              sipër; shkruaji ndryshe kur terreni e kërkon, ose fshij fushën për të kthyer sasinë e parazgjedhur.
              Rreshtat A1, A2, E1, F1 dhe F2 janë fikse ({money(GEOTECH_FIXED_TOTAL)} ALL).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-3 py-2">Nr.</th>
                    <th className="px-3 py-2">Përshkrimi</th>
                    <th className="px-3 py-2">Njësia</th>
                    <th className="px-3 py-2 text-right">Sasia</th>
                    <th className="px-3 py-2 text-right">Çmimi njësi</th>
                    <th className="px-3 py-2 text-right">Vlera (ALL)</th>
                  </tr>
                </thead>
                <tbody>
                  {boq.map((row) => (
                    <tr key={row.code} className="border-b border-line">
                      <td className="px-3 py-2 font-semibold">{row.code}</td>
                      <td className="px-3 py-2">{row.description}</td>
                      <td className="px-3 py-2 text-muted">{row.unit}</td>
                      <td className="px-3 py-2 text-right">
                        <input
                          className="input w-24 text-right"
                          type="number"
                          min={0}
                          value={draft[`qty.${row.code}`] ?? String(row.quantity)}
                          onChange={(event) => set(`qty.${row.code}`, event.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted">{money(row.price)}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums">{money(row.value)}</td>
                    </tr>
                  ))}
                  <tr className="border-b border-line bg-lab-porcelain">
                    <td className="px-3 py-2 font-semibold" colSpan={5}>
                      Nëntotali (pa TVSH)
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">{money(totals.subtotal)}</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-3 py-2" colSpan={5}>
                      TVSH 20%
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{money(totals.vat)}</td>
                  </tr>
                  <tr className="bg-lab-porcelain">
                    <td className="px-3 py-2 text-base font-bold" colSpan={5}>
                      TOTALI (me TVSH)
                    </td>
                    <td className="px-3 py-2 text-right text-base font-bold tabular-nums">{money(totals.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface-card mb-5 p-5">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">
              Programi i testimeve laboratorike (Tabela 2.1)
            </h2>
            <p className="mb-4 text-xs leading-5 text-muted">
              Sasi orientuese, të nxjerra nga numri i kampioneve. Çmimi i tyre është i përfshirë në rreshtin E1 të
              preventivit.
            </p>
            <div className="grid gap-4 lg:grid-cols-4">
              {programme.map((row) => (
                <label key={row.key} className="block text-sm font-medium text-ink">
                  {row.label}
                  <input
                    className="input mt-1"
                    type="number"
                    min={0}
                    value={draft[row.key] ?? String(row.quantity)}
                    onChange={(event) => set(row.key, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {problem.length ? (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <div className="font-semibold">{problem[0]}</div>
          {problem.length > 1 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {problem.slice(1).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {done ? (
        <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          U shkarkua <span className="font-semibold">{done}</span>. Hapi me Word, kontrollo tekstin dhe nënshkruaje
          përpara dërgimit.
        </div>
      ) : null}

      <div className="mb-10 flex items-center gap-4">
        <button className="btn-success" onClick={generate} disabled={busy}>
          {busy ? "Po gjenerohet…" : "Gjenero ofertën (.docx)"}
        </button>
        {kind === "geotech" && totals ? (
          <span className="text-sm text-muted">
            Totali me TVSH: <span className="font-semibold tabular-nums text-ink">{money(totals.total)} ALL</span>
          </span>
        ) : null}
      </div>
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

function FieldInput({
  field,
  value,
  staff,
  onChange
}: {
  field: OfferField;
  value: string;
  /** Employee names, when the field names a role, so it is picked not typed. */
  staff?: string[];
  onChange: (value: string) => void;
}) {
  const label = field.unit ? `${field.label} (${field.unit})` : field.label;

  return (
    <label className={`block text-sm font-medium text-ink${field.kind === "longtext" ? " lg:col-span-3" : ""}`}>
      {label}
      <div className="mt-1">
        {field.kind === "choice" && field.options ? (
          <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
            {field.options.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : staff ? (
          <>
            <select className="input" value={staff.includes(value) ? value : ""} onChange={(event) => onChange(event.target.value)}>
              <option value="">Shkruaj ose zgjidh</option>
              {staff.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input className="input mt-2" value={value} onChange={(event) => onChange(event.target.value)} />
          </>
        ) : field.kind === "longtext" ? (
          <textarea className="input" rows={2} value={value} onChange={(event) => onChange(event.target.value)} />
        ) : (
          <input
            className="input"
            type={field.kind === "date" ? "date" : field.kind === "number" ? "number" : "text"}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </div>
      {field.help ? <span className="mt-1 block text-xs font-normal leading-5 text-muted">{field.help}</span> : null}
    </label>
  );
}
