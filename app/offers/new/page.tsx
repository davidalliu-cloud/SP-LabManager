"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CataloguePicker } from "@/components/offers/catalogue-picker";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { OFFER_CATALOGUE } from "@/lib/offer-catalogue";
import {
  OFFER_TEMPLATES,
  money,
  type OfferField,
  type OfferKind
} from "@/lib/offer-fields";
import {
  geotechBoq,
  geotechFixedLines,
  geotechLabProgramme,
  geotechTotals,
  hasPriceOverride,
  offerTotals,
  quantityMode,
  selectedCodes,
  type OfferValues,
  type QuantityMode
} from "@/lib/offer-fill";
import { canGenerateOffers } from "@/lib/permissions";

/**
 * Offer generator.
 *
 * The two Word templates stay the source of the document: this page only
 * collects what is variable in them and posts it to `/api/offers/generate`,
 * which hands back the filled .docx. Nothing about the layout, the branding or
 * the price catalogue is rebuilt here, so an offer cannot drift from the
 * template that was approved.
 *
 * Client and project come from the register, and a client typed in instead is
 * added to it when the offer is generated — an offer is the first thing a new
 * client gets, so it is also where their record should start rather than
 * something to be re-entered by hand afterwards.
 *
 * With `?id=` the page reopens an offer from the register with everything as
 * it was, which is how a revision gets made without retyping it.
 */

type Draft = OfferValues;

function initialDraft(kind: OfferKind): Draft {
  const draft: Draft = {};
  for (const field of OFFER_TEMPLATES[kind].fields) draft[field.key] = field.value ?? "";
  return draft;
}

/** Keys worth keeping when the offer type is switched: the same client either way. */
const SHARED_KEYS = [
  "clientName",
  "clientAddress",
  "contactPerson",
  "clientContact",
  "clientRequest",
  "projectName",
  "location",
  "certifications"
];

export default function NewOfferPage() {
  const store = useLabStore();
  const router = useRouter();
  const params = useSearchParams();
  const reopening = params.get("id") ?? "";

  const [kind, setKind] = useState<OfferKind>("lab");
  const [draft, setDraft] = useState<Draft>(() => initialDraft("lab"));
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<QuantityMode>("unit");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string[]>([]);
  const [done, setDone] = useState("");
  const loaded = useRef("");

  const template = OFFER_TEMPLATES[kind];
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const allowed = canGenerateOffers(currentUser?.email);

  // Reopening an offer: the stored form is the whole of it, including the
  // catalogue selection and the quantities, so the number stays as issued.
  useEffect(() => {
    if (!reopening || loaded.current === reopening) return;
    const offer = store.offers.find((row) => row.id === reopening);
    if (!offer) return;
    loaded.current = reopening;
    setKind(offer.kind);
    setDraft({ ...initialDraft(offer.kind), ...offer.values });
    setClientId(offer.clientId ?? "");
    setSelected(new Set(selectedCodes(offer.values)));
    setMode(quantityMode(offer.values));
    setQuantities(
      Object.fromEntries(
        Object.entries(offer.values)
          .filter(([key]) => key.startsWith("qty."))
          .map(([key, value]) => [key.slice(4), value])
      )
    );
  }, [reopening, store.offers]);

  // A new offer takes the next number in the register. Switching the offer
  // type starts a clean draft but keeps the client, the object and the number.
  //
  // The store is read through a ref rather than named as a dependency: the
  // store's value object is rebuilt on every save-status tick, and depending on
  // it would reset the form under whoever was filling it in.
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    if (reopening) return;
    setDraft((previous) => {
      const next = initialDraft(kind);
      for (const key of SHARED_KEYS) {
        if (previous[key] && next[key] !== undefined) next[key] = previous[key];
      }
      next.offerNumber = storeRef.current.nextOfferNumber();
      return next;
    });
    setProblem([]);
    setDone("");
  }, [kind, reopening]);

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

  const fixedLines = kind === "geotech" ? geotechFixedLines(draft) : [];
  const boq = kind === "geotech" ? geotechBoq(draft) : [];
  const geoTotals = kind === "geotech" ? geotechTotals(draft) : null;
  const programme = kind === "geotech" ? geotechLabProgramme(draft) : [];

  /** The draft plus everything held outside it, as the route wants it. */
  function assembleValues(): OfferValues {
    const values: OfferValues = { ...draft };
    if (kind === "geotech") {
      for (const row of boq) values[`qty.${row.code}`] = String(row.quantity);
      for (const row of programme) values[row.key] = String(row.quantity);
    } else {
      const codes = OFFER_CATALOGUE.filter((test) => selected.has(test.code)).map((test) => test.code);
      values.codes = codes.join(",");
      values.quantityMode = mode;
      for (const code of codes) values[`qty.${code}`] = quantities[code] ?? "0";
    }
    return values;
  }

  /**
   * File the client and the object in the register when they were typed in
   * rather than picked. Returns the client id to store with the offer.
   */
  function fileClientAndProject(): string | undefined {
    const clientName = draft.clientName?.trim();
    const projectName = draft.projectName?.trim();
    if (!clientName) return clientId || undefined;

    const existing =
      store.clients.find((row) => row.id === clientId) ??
      store.rawClients.find(
        (row) => row.clientName.trim().toLocaleLowerCase("sq-AL") === clientName.toLocaleLowerCase("sq-AL")
      );

    if (existing) {
      if (projectName) store.createProjectForClient(existing.id, projectName, draft.location ?? "");
      return existing.id;
    }

    const contact = draft.clientContact ?? "";
    return store.createClient({
      clientName,
      contactPerson: draft.contactPerson ?? "",
      email: /[\w.+-]+@[\w-]+\.[\w.]+/.exec(contact)?.[0] ?? "",
      phone: /(\+?\d[\d\s]{6,})/.exec(contact)?.[1]?.trim() ?? "",
      address: draft.clientAddress ?? "",
      projectName: projectName || "Pa projekt",
      projectLocation: draft.location ?? ""
    });
  }

  async function generate() {
    setBusy(true);
    setProblem([]);
    setDone("");
    try {
      const values = assembleValues();
      // The route decides who may generate an offer, against this token.
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const response = await fetch("/api/offers/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token ?? ""}`
        },
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

      // The document is in hand, so the register can be written: filing a
      // client for an offer that failed to generate would leave a record of
      // something that was never sent.
      const filedClientId = fileClientAndProject();
      const totals = offerTotals(kind, values);
      store.saveOffer({
        id: reopening || undefined,
        offerNumber: draft.offerNumber ?? "",
        kind,
        clientId: filedClientId,
        clientName: draft.clientName ?? "",
        projectName: draft.projectName ?? "",
        location: draft.location,
        offerDate: draft.offerDate ?? "",
        totalExVat: totals?.subtotal,
        totalIncVat: totals?.total,
        values
      });
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
        <PageHeader title="Ofertë e re" />
        <div className="rounded-md border border-lab-mist bg-lab-porcelain px-4 py-3 text-sm text-ink">
          Ofertat përgatiten nga Drejtori i Përgjithshëm ose Shefi i Laboratorit. Kërkoji një prej tyre ofertën për
          klientin.
        </div>
      </>
    );
  }

  const action = (
    <div className="flex items-center gap-3">
      <Link href="/offers" className="btn-secondary">
        Regjistri
      </Link>
      <button className="btn-success" onClick={generate} disabled={busy}>
        {busy ? "Po gjenerohet…" : "Gjenero ofertën (.docx)"}
      </button>
    </div>
  );

  return (
    <>
      <PageHeader
        title={reopening ? `Ofertë SL-OF-${draft.offerNumber}/2026` : "Ofertë e re"}
        description="Plotëso formularin dhe oferta shkarkohet si dokument Word, në të njëjtin format si shabllonet e miratuara. Çmimet, tabelat dhe teksti standard vijnë nga shablloni; vetëm fushat e mëposhtme ndryshojnë."
        action={action}
      />

      <div className="surface-card mb-5 grid gap-4 p-5 lg:grid-cols-3">
        <Field label="Lloji i ofertës">
          <select
            className="input font-semibold"
            value={kind}
            onChange={(event) => setKind(event.target.value as OfferKind)}
            disabled={Boolean(reopening)}
          >
            <option value="lab">Ofertë laboratorike – testimi i materialeve</option>
            <option value="geotech">Ofertë investigim gjeoteknik dhe sizmik</option>
          </select>
        </Field>
        <Field label="Klienti nga regjistri">
          <select className="input" value={clientId} onChange={(event) => pickClient(event.target.value)}>
            <option value="">Klient i ri – shkruaje te «Klienti»</option>
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
            <option value="">
              {clientId ? `Projekt i ri – shkruaje te «Objekti»` : "Zgjidh klientin më parë"}
            </option>
            {clientProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
                {project.location ? ` – ${project.location}` : ""}
              </option>
            ))}
          </select>
        </Field>
        <p className="text-xs leading-5 text-muted lg:col-span-3">
          {template.subtitle} Klienti dhe objekti që shkruhen me dorë ruhen në regjistër bashkë me ofertën.
        </p>
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

      {kind === "lab" ? (
        <CataloguePicker
          values={draft}
          selected={selected}
          quantities={quantities}
          mode={mode}
          onToggle={(code) =>
            setSelected((previous) => {
              const next = new Set(previous);
              if (next.has(code)) next.delete(code);
              else next.add(code);
              return next;
            })
          }
          onToggleGroup={(codes, on) =>
            setSelected((previous) => {
              const next = new Set(previous);
              for (const code of codes) {
                if (on) next.add(code);
                else next.delete(code);
              }
              return next;
            })
          }
          onQuantity={(code, value) => setQuantities((previous) => ({ ...previous, [code]: value }))}
          onPrice={(code, value) => set(`price.${code}`, value)}
          onMode={setMode}
        />
      ) : null}

      {kind === "geotech" && geoTotals ? (
        <>
          <section className="surface-card mb-5 p-5">
            <h2 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-lab-burgundy">
              Preventivi (Tabela 10.1)
            </h2>
            <p className="mb-4 text-xs leading-5 text-muted">
              Sasitë vijnë nga fusha e punës më sipër; shkruaji ndryshe kur terreni e kërkon, ose fshij fushën për
              të kthyer sasinë e parazgjedhur. Çmimet njësi nisin nga çmimet 2026, me zbritjen e vendosur te
              «Çmimet»; shkruaj një çmim mbi rreshtin për ta caktuar vetë. A1, A2, E1, F1 dhe F2 janë shuma të
              plota me sasi 1.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="table-head">
                  <tr>
                    <th className="px-3 py-2">Nr.</th>
                    <th className="px-3 py-2">Përshkrimi</th>
                    <th className="px-3 py-2">Njësia</th>
                    <th className="px-3 py-2 text-right">Sasia</th>
                    <th className="px-3 py-2 text-right">Listë</th>
                    <th className="px-3 py-2 text-right">Çmimi njësi</th>
                    <th className="px-3 py-2 text-right">Vlera (ALL)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...fixedLines, ...boq].map((row) => {
                    const lump = fixedLines.some((line) => line.code === row.code);
                    const typed = hasPriceOverride(draft, row.code);
                    return (
                      <tr key={row.code} className="border-b border-line">
                        <td className="px-3 py-2 font-semibold">{row.code}</td>
                        <td className="px-3 py-2">{row.description}</td>
                        <td className="px-3 py-2 text-muted">{row.unit}</td>
                        <td className="px-3 py-2 text-right">
                          {lump ? (
                            <span className="tabular-nums text-muted">1</span>
                          ) : (
                            <input
                              className="input w-20 text-right"
                              type="number"
                              min={0}
                              value={draft[`qty.${row.code}`] ?? String(row.quantity)}
                              onChange={(event) => set(`qty.${row.code}`, event.target.value)}
                            />
                          )}
                        </td>
                        <td
                          className={`px-3 py-2 text-right tabular-nums text-muted${
                            row.price !== row.listPrice ? " line-through" : ""
                          }`}
                        >
                          {money(row.listPrice)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            className={`input w-24 text-right${typed ? " font-semibold" : ""}`}
                            type="number"
                            min={0}
                            value={draft[`price.${row.code}`] ?? String(row.price)}
                            onChange={(event) => set(`price.${row.code}`, event.target.value)}
                            title="Shkruaj çmimin për këtë rresht, ose fshije për t'u kthyer te çmimi i listës"
                          />
                          {typed ? <div className="mt-1 text-[11px] text-amber-700">çmim i caktuar</div> : null}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums">{money(row.value)}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-b border-line bg-lab-porcelain">
                    <td className="px-3 py-2 font-semibold" colSpan={6}>
                      Nëntotali (pa TVSH)
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums">{money(geoTotals.subtotal)}</td>
                  </tr>
                  <tr className="border-b border-line">
                    <td className="px-3 py-2" colSpan={6}>
                      TVSH 20%
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{money(geoTotals.vat)}</td>
                  </tr>
                  <tr className="bg-lab-porcelain">
                    <td className="px-3 py-2 text-base font-bold" colSpan={6}>
                      TOTALI (me TVSH)
                    </td>
                    <td className="px-3 py-2 text-right text-base font-bold tabular-nums">{money(geoTotals.total)}</td>
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
          U shkarkua <span className="font-semibold">{done}</span> dhe oferta u ruajt në regjistër. Hapi me Word,
          kontrollo tekstin dhe nënshkruaje përpara dërgimit.{" "}
          <button type="button" className="underline" onClick={() => router.push("/offers")}>
            Hap regjistrin
          </button>
        </div>
      ) : null}

      <div className="mb-10 flex items-center gap-4">{action}</div>
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
        {field.readOnly ? (
          <input className="input bg-lab-porcelain font-semibold" value={value} readOnly />
        ) : field.kind === "choice" && field.options ? (
          <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
            {field.options.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : staff ? (
          <>
            <select
              className="input"
              value={staff.includes(value) ? value : ""}
              onChange={(event) => onChange(event.target.value)}
            >
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
