"use client";

import { ReactNode, useState } from "react";
import {
  AGGREGATE_ORIGINS,
  aggregateSampleDescription,
  aggregateSubtypeKind,
  formatAggregateFraction,
  isValidAggregateFraction,
  parseAggregateFraction
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
 * The fraction is two numbers the laboratory types — the smallest and the
 * largest size, d and D — rather than a pick from a list, because a list rounds
 * a real sample to whichever entry somebody thought of in advance. They are
 * saved together on a button and not as they are typed: half a pair is not a
 * fraction, and a 1 on its way to 16 would otherwise reach the certificate as
 * a size of its own.
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
  const sample = store.samples.find((row) => row.id === sampleId);
  const held = heldSizes(sample?.aggregateFractionMinMm, sample?.aggregateFractionMaxMm, sample?.aggregateFraction);
  const [originDraft, setOriginDraft] = useState<string>();
  const [minInput, setMinInput] = useState(held.min);
  const [maxInput, setMaxInput] = useState(held.max);
  const kind = sample ? aggregateSubtypeKind(sample.sampleType) : undefined;
  if (!sample || !kind) return null;

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const linkedTestIds = store.tests.filter((row) => row.sampleId === sampleId).map((row) => row.id);
  const resultsIn = hasRegisteredResult(store, linkedTestIds);
  const linkedReports = store.reports.filter((row) => row.sampleId === sampleId);
  const stage = aggregateNamingStage(linkedReports.map((row) => row.reportStatus));
  const permitted = canNameAggregateSample(currentUser?.role, stage);
  const mayName = permitted && resultsIn;

  const origin = originDraft ?? sample.aggregateOrigin ?? "";
  // Only for a sample registered before the origin was asked for. Where it was
  // answered at the bench it is not this card's to change — but once it has been
  // answered here it stays on screen for the rest of the visit, so a wrong pick
  // can be corrected rather than vanishing the moment it is made.
  const asksOrigin = !sample.aggregateOrigin || originDraft !== undefined;

  const blank = !minInput.trim() && !maxInput.trim();
  const typed = blank ? undefined : { minMm: Number(minInput), maxMm: Number(maxInput) };
  const typedIsValid = typed ? isValidAggregateFraction(typed.minMm, typed.maxMm) : true;
  const unsaved = minInput.trim() !== held.min || maxInput.trim() !== held.max;
  // What the certificate would read if the boxes were saved as they stand.
  // Untouched boxes show the name as stored, down to its spelling: the three
  // samples named off the old list read "0.0/0.2 mm" and go on doing so until
  // somebody saves the sizes. A half-typed pair falls back the same way.
  const fraction =
    unsaved && typedIsValid
      ? blank
        ? ""
        : formatAggregateFraction(typed?.minMm, typed?.maxMm) ?? ""
      : sample.aggregateFraction ?? "";
  const name = aggregateSampleDescription(sample.sampleType, origin || undefined, fraction || undefined);

  const sizeError = typedIsValid
    ? undefined
    : !minInput.trim() || !maxInput.trim()
      ? "Jep të dyja madhësitë, ose lëri të dyja bosh."
      : "Madhësia maksimale duhet të jetë më e madhe se minimalja.";

  function saveOrigin(next: string) {
    setOriginDraft(next);
    store.setAggregateNaming(sampleId, { origin: next });
  }

  function saveFraction() {
    store.setAggregateNaming(sampleId, { fraction: typed ?? null });
  }

  const blocked = !resultsIn
    ? "Fraksioni caktohet pas rezultateve: ruaj fletën e punës dhe kthehu këtu."
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
        : !sample.aggregateFraction
          ? "Pa fraksion certifikata do të dalë vetëm me materialin dhe origjinën."
          : undefined;

  return (
    <div className="surface-card p-4">
      <h2 className="text-base font-semibold text-ink">Emri i kampionit / Sample name</h2>
      <p className="mt-1 text-sm text-muted">
        Fraksionin e cakton laboratori nga granulometria: shkruaj madhësinë më të vogël dhe më të madhe të grimcave.
      </p>
      {asksOrigin ? (
        <CardField label="Origjina / Origin">
          <select
            value={origin}
            onChange={(event) => saveOrigin(event.target.value)}
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
      <div className="mt-3 grid grid-cols-2 gap-3">
        <CardField label="Min. d [mm]" tight>
          <input
            type="number"
            step="0.001"
            min="0"
            inputMode="decimal"
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            disabled={!mayName}
            placeholder="0"
            className="input disabled:bg-lab-porcelain disabled:text-muted"
          />
        </CardField>
        <CardField label="Maks. D [mm]" tight>
          <input
            type="number"
            step="0.001"
            min="0"
            inputMode="decimal"
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            disabled={!mayName}
            placeholder="4"
            className="input disabled:bg-lab-porcelain disabled:text-muted"
          />
        </CardField>
      </div>
      {sizeError ? <p className="mt-2 text-xs font-semibold text-lab-red">{sizeError}</p> : null}
      <button
        type="button"
        onClick={saveFraction}
        disabled={!mayName || !typedIsValid || !unsaved}
        className="btn-secondary mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {blank && sample.aggregateFraction ? "Hiq fraksionin" : "Ruaj fraksionin"}
      </button>
      <div className="soft-panel mt-3 p-3 text-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Emri në certifikatë</div>
        <div className="mt-1 font-semibold text-ink">{name}</div>
        {unsaved && typedIsValid ? <div className="mt-1 text-xs text-muted">Ende i paruajtur.</div> : null}
      </div>
      {blocked ? <p className="mt-3 text-xs text-muted">{blocked}</p> : null}
      {warning ? <p className="mt-3 text-xs font-semibold text-lab-burgundy">{warning}</p> : null}
    </div>
  );
}

/**
 * The boxes open on whatever the sample already holds: the measured sizes, or —
 * for the three samples named from the short list this replaced — the pair read
 * back out of their label. "I përzier / Mixed" yields nothing and the boxes open
 * empty, which is right: it was never a size.
 */
function heldSizes(minMm?: number, maxMm?: number, fraction?: string) {
  if (minMm !== undefined && maxMm !== undefined) return { min: String(minMm), max: String(maxMm) };
  const parsed = parseAggregateFraction(fraction);
  return parsed ? { min: String(parsed.minMm), max: String(parsed.maxMm) } : { min: "", max: "" };
}

function CardField({ label, children, tight = false }: { label: string; children: ReactNode; tight?: boolean }) {
  return (
    <label className={`block text-xs font-medium text-ink ${tight ? "" : "mt-3"}`}>
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
