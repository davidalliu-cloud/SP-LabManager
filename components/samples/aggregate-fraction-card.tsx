"use client";

import { useState } from "react";
import { aggregateFractions, aggregateSampleDescription, aggregateSubtypeKind } from "@/lib/aggregate-subtypes";
import { useLabStore } from "@/lib/lab-store";
import { canSetAggregateFraction } from "@/lib/permissions";
import { hasRegisteredResult } from "@/lib/test-result-summary";

/**
 * The particle size, asked where it can be answered.
 *
 * A delivery is booked in as sand or gravel, from the river or the mountain —
 * that is everything anyone knows while the bag is still on the bench. Which
 * fraction it is comes out of the sieving, so it is not asked at registration
 * any more; it is asked here, in one card that appears on the sample and on the
 * granulometry worksheet.
 *
 * The card is deliberately visible before it is usable. A sand whose grading
 * has not been run yet shows the question greyed out with the reason under it,
 * so the technician reads "this is still to come" rather than finding nothing
 * and assuming the size was never wanted. Once a report exists the card goes
 * read-only for the same reason the registration does: the name is on a
 * certificate by then.
 */
export function AggregateFractionCard({ sampleId }: { sampleId: string }) {
  const store = useLabStore();
  const [choice, setChoice] = useState<string>();
  const sample = store.samples.find((row) => row.id === sampleId);
  const kind = sample ? aggregateSubtypeKind(sample.sampleType) : undefined;
  if (!sample || !kind) return null;

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const linkedTestIds = store.tests.filter((row) => row.sampleId === sampleId).map((row) => row.id);
  const resultsIn = hasRegisteredResult(store, linkedTestIds);
  const reported = store.reports.some((row) => row.sampleId === sampleId);
  const mayChoose = canSetAggregateFraction(currentUser?.role) && resultsIn && !reported;
  const saved = sample.aggregateFraction ?? "";
  const selected = choice ?? saved;
  const name = aggregateSampleDescription(sample.sampleType, sample.aggregateOrigin, selected || undefined);

  const reason = reported
    ? "Raporti është gjeneruar — emri i kampionit është i fiksuar në certifikatë."
    : !resultsIn
      ? "Fraksioni caktohet pas rezultateve: ruaj fletën e punës së granulometrisë dhe kthehu këtu."
      : !canSetAggregateFraction(currentUser?.role)
        ? "Fraksionin e cakton personi që kryen ose kontrollon testin."
        : undefined;

  return (
    <div className="surface-card p-4">
      <h2 className="text-base font-semibold text-ink">Fraksioni / Particle size</h2>
      <p className="mt-1 text-sm text-muted">
        Madhësia e grimcave del nga granulometria dhe plotëson emrin e kampionit në certifikatë.
      </p>
      <select
        value={selected}
        onChange={(event) => {
          setChoice(event.target.value);
          store.setAggregateFraction(sampleId, event.target.value);
        }}
        disabled={!mayChoose}
        className="input mt-3 disabled:bg-lab-porcelain disabled:text-muted"
      >
        <option value="">— Pa fraksion —</option>
        {aggregateFractions(kind).map((fraction) => (
          <option key={fraction} value={fraction}>{fraction}</option>
        ))}
      </select>
      <div className="soft-panel mt-3 p-3 text-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Emri në certifikatë</div>
        <div className="mt-1 font-semibold text-ink">{name}</div>
      </div>
      {reason ? <p className="mt-3 text-xs text-muted">{reason}</p> : null}
      {mayChoose && !saved ? (
        <p className="mt-3 text-xs font-semibold text-lab-burgundy">
          Pa fraksion certifikata do të dalë vetëm me materialin dhe origjinën.
        </p>
      ) : null}
    </div>
  );
}
