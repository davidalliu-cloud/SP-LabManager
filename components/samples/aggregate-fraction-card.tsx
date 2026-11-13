"use client";

import { ReactNode, useState } from "react";
import {
  AGGREGATE_ORIGINS,
  aggregateFractions,
  aggregateSampleDescription,
  aggregateSubtypeKind
} from "@/lib/aggregate-subtypes";
import { useLabStore } from "@/lib/lab-store";
import { aggregateNamingStage, canNameAggregateSample } from "@/lib/permissions";
import { hasRegisteredResult } from "@/lib/test-result-summary";

/**
 * What a sand or gravel sample is called, asked where it can be answered.
 *
 * A delivery is booked in as what the driver can tell you. Which fraction it is
 * comes out of the sieving, so it is not asked at registration any more; it is
 * asked here, on the granulometry worksheet and on the sample itself, once a
 * worksheet has been saved.
 *
 * The origin appears here too, but only for a sample that never recorded one —
 * everything registered before the question existed. For a sample booked in
 * since, the origin was answered at the bench and this card leaves it alone.
 *
 * The card is deliberately visible before it is usable: greyed, with the reason
 * under it, so a sand whose grading has not been run reads as "still to come"
 * rather than as a question nobody wanted asked. When the sample already has a
 * certificate it stays usable — that is the normal case for everything tested
 * before the fraction was asked for — and says plainly that the stored PDF has
 * to be regenerated, because rewriting the name does not rewrite a file.
 */
export function AggregateFractionCard({ sampleId }: { sampleId: string }) {
  const store = useLabStore();
  const [draft, setDraft] = useState<{ origin?: string; fraction?: string }>({});
  const sample = store.samples.find((row) => row.id === sampleId);
  const kind = sample ? aggregateSubtypeKind(sample.sampleType) : undefined;
  if (!sample || !kind) return null;

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const linkedTestIds = store.tests.filter((row) => row.sampleId === sampleId).map((row) => row.id);
  const resultsIn = hasRegisteredResult(store, linkedTestIds);
  const linkedReports = store.reports.filter((row) => row.sampleId === sampleId);
  const stage = aggregateNamingStage(linkedReports.map((row) => row.reportStatus));
  const permitted = canNameAggregateSample(currentUser?.role, stage);
  const mayName = permitted && resultsIn;

  const origin = draft.origin ?? sample.aggregateOrigin ?? "";
  const fraction = draft.fraction ?? sample.aggregateFraction ?? "";
  const name = aggregateSampleDescription(sample.sampleType, origin || undefined, fraction || undefined);
  // Only for a sample registered before the origin was asked for. Where it was
  // answered at the bench it is not this card's to change - but once it has been
  // answered here it stays on screen for the rest of the visit, so a wrong pick
  // can be corrected rather than vanishing the moment it is made.
  const asksOrigin = !sample.aggregateOrigin || draft.origin !== undefined;

  function save(next: { origin?: string; fraction?: string }) {
    setDraft((current) => ({ ...current, ...next }));
    store.setAggregateNaming(sampleId, next);
  }

  const blocked = !resultsIn
    ? "Fraksioni caktohet pas rezultateve: ruaj fletën e punës së granulometrisë dhe kthehu këtu."
    : !permitted
      ? stage === "issued"
        ? "Raporti i këtij kampioni ka shkuar te klienti — emrin e ndryshon vetëm Drejtori Ekzekutiv."
        : stage === "reported"
          ? "Ky kampion ka raport të gjeneruar — emrin e ndryshon Kryelaboranti."
          : "Fraksionin e cakton personi që kryen ose kontrollon testin."
      : undefined;

  const warning = blocked
    ? undefined
    : stage === "issued"
      ? "Raporti ka shkuar te klienti: pas ndryshimit rigjenero PDF-në dhe ridërgoje, përndryshe kopja e klientit mbetet me emrin e vjetër."
      : stage === "reported"
        ? linkedReports.length === 1
          ? "1 raport i këtij kampioni e merr emrin e ri menjëherë — hape dhe shtyp “Gjenero PDF”, që kopja e ruajtur të përputhet."
          : `${linkedReports.length} raporte të këtij kampioni e marrin emrin e ri menjëherë — hapi dhe shtyp “Gjenero PDF”, që kopjet e ruajtura të përputhen.`
        : !fraction
          ? "Pa fraksion certifikata do të dalë vetëm me materialin dhe origjinën."
          : undefined;

  return (
    <div className="surface-card p-4">
      <h2 className="text-base font-semibold text-ink">Emri i kampionit / Sample name</h2>
      <p className="mt-1 text-sm text-muted">
        Madhësia e grimcave del nga granulometria dhe plotëson emrin që printohet në certifikatë.
      </p>
      {asksOrigin ? (
        <CardField label="Origjina / Origin">
          <select
            value={origin}
            onChange={(event) => save({ origin: event.target.value })}
            disabled={!mayName}
            className="input disabled:bg-lab-porcelain disabled:text-muted"
          >
            <option value="">— Pa origjinë —</option>
            {AGGREGATE_ORIGINS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </CardField>
      ) : null}
      <CardField label="Fraksioni / Particle size">
        <select
          value={fraction}
          onChange={(event) => save({ fraction: event.target.value })}
          disabled={!mayName}
          className="input disabled:bg-lab-porcelain disabled:text-muted"
        >
          <option value="">— Pa fraksion —</option>
          {aggregateFractions(kind).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </CardField>
      <div className="soft-panel mt-3 p-3 text-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Emri në certifikatë</div>
        <div className="mt-1 font-semibold text-ink">{name}</div>
      </div>
      {blocked ? <p className="mt-3 text-xs text-muted">{blocked}</p> : null}
      {warning ? <p className="mt-3 text-xs font-semibold text-lab-burgundy">{warning}</p> : null}
    </div>
  );
}

function CardField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-3 block text-xs font-medium text-ink">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
