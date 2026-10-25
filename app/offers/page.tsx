"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChips, FilterField, useParamState } from "@/components/ui/filter-bar";
import type { FilterChip } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { money } from "@/lib/offer-fields";
import { offerFileName } from "@/lib/offer-fill";
import { canGenerateOffers } from "@/lib/permissions";
import { buildHaystack, matchesHaystack, tokeniseQuery } from "@/lib/search";
import { OFFER_STATUSES, type OfferRecord, type OfferStatus } from "@/lib/types";

/**
 * The offer register.
 *
 * Every offer generated is filed here, with what it was worth and where it has
 * got to, because an offer that nobody chases is a job the lab has already
 * done the pricing work for and lost. The status is the point of the page: the
 * ones sitting at "Dërguar" are the ones to ring about.
 *
 * Reopening an offer loads the form exactly as it was, so a revision means
 * changing one figure rather than retyping the whole thing, and downloading
 * re-generates the same document from the stored form.
 */

const STICKY_HEAD = "sticky top-0 z-20 bg-white";

/** Status colours: what needs attention should read as such at a glance. */
const STATUS_STYLE: Record<OfferStatus, string> = {
  Draft: "border-slate-200 bg-slate-50 text-slate-700",
  Dërguar: "border-amber-200 bg-amber-50 text-amber-800",
  Pranuar: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Refuzuar: "border-red-200 bg-red-50 text-red-800",
  Skaduar: "border-slate-200 bg-slate-100 text-slate-500"
};

const albanian = (iso?: string) => {
  if (!iso) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : iso;
};

export default function OffersRegisterPage() {
  const store = useLabStore();
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const allowed = canGenerateOffers(currentUser?.email);

  const [query, setQuery] = useParamState("q");
  const [status, setStatus] = useParamState("status");
  const [kind, setKind] = useParamState("kind");
  const [busy, setBusy] = useState("");
  const [problem, setProblem] = useState("");

  const offers = useMemo(() => {
    const tokens = tokeniseQuery(query);
    return store.offers
      .filter((offer) => (status ? offer.status === status : true))
      .filter((offer) => (kind ? offer.kind === kind : true))
      .filter((offer) =>
        matchesHaystack(
          buildHaystack([offer.offerNumber, offer.clientName, offer.projectName, offer.location, offer.status]),
          tokens
        )
      )
      .sort((left, right) => right.offerNumber.localeCompare(left.offerNumber, undefined, { numeric: true }));
  }, [store.offers, query, status, kind]);

  const chips: FilterChip[] = [
    ...(query ? [{ key: "q", label: `Kërkim: ${query}`, onRemove: () => setQuery("") }] : []),
    ...(status ? [{ key: "status", label: `Statusi: ${status}`, onRemove: () => setStatus("") }] : []),
    ...(kind
      ? [
          {
            key: "kind",
            label: `Lloji: ${kind === "lab" ? "Laboratorike" : "Gjeoteknike"}`,
            onRemove: () => setKind("")
          }
        ]
      : [])
  ];

  function clearFilters() {
    setQuery("");
    setStatus("");
    setKind("");
  }

  const pipeline = useMemo(() => {
    const open = store.offers.filter((offer) => offer.status === "Dërguar");
    const won = store.offers.filter((offer) => offer.status === "Pranuar");
    const sum = (rows: OfferRecord[]) => rows.reduce((total, offer) => total + (offer.totalIncVat ?? 0), 0);
    return { open: open.length, openValue: sum(open), won: won.length, wonValue: sum(won) };
  }, [store.offers]);

  /** Regenerate the .docx from the stored form, unchanged. */
  async function download(offer: OfferRecord) {
    setBusy(offer.id);
    setProblem("");
    try {
      // The route decides who may generate an offer, against this token.
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getSession();
      const response = await fetch("/api/offers/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token ?? ""}`
        },
        body: JSON.stringify({ kind: offer.kind, values: offer.values })
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProblem(payload?.error ?? `Shkarkimi dështoi (HTTP ${response.status}).`);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = offerFileName(offer.kind, offer.values);
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setProblem(error instanceof Error ? error.message : "Shkarkimi dështoi.");
    } finally {
      setBusy("");
    }
  }

  if (!allowed) {
    return (
      <>
        <PageHeader title="Ofertat" />
        <div className="rounded-md border border-lab-mist bg-lab-porcelain px-4 py-3 text-sm text-ink">
          Regjistri i ofertave është i hapur për Drejtorin e Përgjithshëm dhe Shefin e Laboratorit.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Ofertat"
        description="Regjistri i ofertave të lëshuara, me vlerën dhe statusin e secilës. Hap një ofertë për ta rishikuar me të njëjtat të dhëna, ose shkarkoje përsëri si dokument Word."
        action={
          <Link href="/offers/new" className="btn-success">
            Ofertë e re
          </Link>
        }
      />

      <div className="no-print mb-5 grid gap-4 sm:grid-cols-3">
        <Stat label="Në pritje të përgjigjes" value={String(pipeline.open)} note={`${money(pipeline.openValue)} ALL`} />
        <Stat label="Të pranuara" value={String(pipeline.won)} note={`${money(pipeline.wonValue)} ALL`} />
        <Stat label="Gjithsej në regjistër" value={String(store.offers.length)} note="Numri vijon vetë" />
      </div>

      <div className="no-print mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <FilterField label="Kërko ofertë">
          <input
            className="input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="numër, klient, objekt"
          />
        </FilterField>
        <FilterField label="Statusi">
          <select className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">Të gjitha</option>
            {OFFER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Lloji">
          <select className="input" value={kind} onChange={(event) => setKind(event.target.value)}>
            <option value="">Të dyja</option>
            <option value="lab">Laboratorike</option>
            <option value="geotech">Gjeoteknike</option>
          </select>
        </FilterField>
      </div>

      <FilterChips chips={chips} resultCount={offers.length} onClearAll={clearFilters} countLabel="oferta" />

      {problem ? (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{problem}</div>
      ) : null}

      {store.offers.length === 0 ? (
        <div className="rounded-md border border-lab-mist bg-lab-porcelain px-4 py-6 text-sm text-ink">
          Regjistri është bosh. Shtyp <span className="font-semibold">Ofertë e re</span> për të përgatitur ofertën e
          parë — numri caktohet vetë dhe oferta ruhet këtu pasi gjenerohet.
        </div>
      ) : (
        <div className="register-scroll max-h-[70vh] overflow-auto rounded-md border border-line">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="table-head">
              <tr>
                <th className={`${STICKY_HEAD} px-3 py-2`}>Nr.</th>
                <th className={`${STICKY_HEAD} px-3 py-2`}>Data</th>
                <th className={`${STICKY_HEAD} px-3 py-2`}>Klienti</th>
                <th className={`${STICKY_HEAD} px-3 py-2`}>Objekti</th>
                <th className={`${STICKY_HEAD} px-3 py-2`}>Lloji</th>
                <th className={`${STICKY_HEAD} px-3 py-2 text-right`}>Vlera me TVSH</th>
                <th className={`${STICKY_HEAD} px-3 py-2`}>Statusi</th>
                <th className={`${STICKY_HEAD} px-3 py-2`}></th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-line">
                  <td className="px-3 py-2 font-semibold tabular-nums">SL-OF-{offer.offerNumber}</td>
                  <td className="px-3 py-2 tabular-nums text-muted">{albanian(offer.offerDate)}</td>
                  <td className="px-3 py-2">{offer.clientName}</td>
                  <td className="px-3 py-2">
                    {offer.projectName}
                    {offer.location ? <span className="block text-xs text-muted">{offer.location}</span> : null}
                  </td>
                  <td className="px-3 py-2 text-muted">{offer.kind === "lab" ? "Laboratorike" : "Gjeoteknike"}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums">
                    {offer.totalIncVat === undefined ? (
                      <span className="font-normal text-muted" title="Ofertë me çmime njësi, pa sasi">
                        çmime njësi
                      </span>
                    ) : (
                      money(offer.totalIncVat)
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className={`rounded-md border px-2 py-1 text-xs font-semibold ${STATUS_STYLE[offer.status]}`}
                      value={offer.status}
                      onChange={(event) => store.setOfferStatus(offer.id, event.target.value as OfferStatus)}
                    >
                      {OFFER_STATUSES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/offers/new?id=${offer.id}`}
                        className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                      >
                        Hap
                      </Link>
                      <button
                        type="button"
                        className="rounded-md border border-lab-mist bg-lab-porcelain px-2 py-1 text-xs font-semibold text-ink transition hover:border-lab-burgundy"
                        onClick={() => download(offer)}
                        disabled={busy === offer.id}
                      >
                        {busy === offer.id ? "…" : "Shkarko"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {offers.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-sm text-muted" colSpan={8}>
                    Asnjë ofertë nuk i përgjigjet filtrave.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="surface-card p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold tabular-nums text-ink">{value}</div>
      <div className="mt-1 text-xs text-muted">{note}</div>
    </div>
  );
}
