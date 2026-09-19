"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useLabStore } from "@/lib/lab-store";
import { canManageEquipment } from "@/lib/permissions";
import {
  CALIBRATION_WARNING_DAYS,
  calibrationState,
  daysUntil,
  fromDateInputValue,
  parseLabDate,
  suggestNextCalibrationDate,
  toDateInputValue,
  type EquipmentStatus
} from "@/lib/equipment";

const STATUSES: EquipmentStatus[] = ["Në përdorim", "Jashtë përdorimit", "Në riparim", "Hequr nga përdorimi"];

/**
 * One instrument: what it is, when it was last calibrated, and when it is due.
 *
 * The calibration block sits first and alone, because recording a calibration
 * is what this page is opened for. Everything that describes the instrument is
 * below it and changes rarely.
 */
export default function EquipmentDetailPage() {
  const params = useParams<{ id: string }>();
  const store = useLabStore();
  const item = store.equipment.find((row) => row.id === params.id);
  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  // Read-only for everyone but the two roles that own the calibration
  // programme, and the Managing Director.
  const canEdit = canManageEquipment(currentUser?.role);

  const today = useMemo(() => new Date(), []);
  const [lastCalibration, setLastCalibration] = useState("");
  const [nextCalibrationDate, setNextCalibrationDate] = useState("");
  const [saved, setSaved] = useState(false);

  // Seed the two date fields from the record once it has loaded, and again if
  // someone else's save changes them underneath.
  useEffect(() => {
    if (!item) return;
    setLastCalibration(toDateInputValue(item.lastCalibration));
    setNextCalibrationDate(toDateInputValue(item.nextCalibrationDate));
  }, [item?.id, item?.lastCalibration, item?.nextCalibrationDate]);

  if (!store.isReady) return null;
  if (!item) {
    return (
      <>
        <PageHeader title="Pajisja nuk u gjet" description="Kjo pajisje nuk ekziston në regjistër." />
        <Link href="/quality/equipment" className="text-sm font-semibold text-lab-burgundy underline">
          Kthehu te regjistri
        </Link>
      </>
    );
  }

  const state = calibrationState(item, today);
  const due = parseLabDate(item.nextCalibrationDate);
  const days = due ? daysUntil(due, today) : undefined;

  // What the interval implies, for the date the technician has just entered —
  // not for the one on file, which is the whole point when recalibrating.
  const suggestion = suggestNextCalibrationDate(
    fromDateInputValue(lastCalibration),
    item.calibrationInterval
  );
  const suggestionAccepted = suggestion && fromDateInputValue(nextCalibrationDate) === suggestion;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => String(form.get(name) ?? "").trim();
    store.saveEquipment(item!.id, {
      uniqueCode: text("uniqueCode"),
      name: text("name"),
      field: text("field"),
      measuringRange: text("measuringRange"),
      accuracyClass: text("accuracyClass"),
      manufacturer: text("manufacturer"),
      model: text("model"),
      serialNumber: text("serialNumber"),
      calibrationType: text("calibrationType"),
      calibrationInterval: text("calibrationInterval"),
      nextCalibrationPeriod: text("nextCalibrationPeriod"),
      calibrationBody: text("calibrationBody"),
      certificateCode: text("certificateCode"),
      certificateUrl: text("certificateUrl"),
      location: text("location"),
      notes: text("notes"),
      status: text("status") as EquipmentStatus,
      lastCalibration: fromDateInputValue(lastCalibration),
      nextCalibrationDate: fromDateInputValue(nextCalibrationDate)
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  }

  return (
    <>
      <PageHeader
        title={item.uniqueCode || item.name}
        description={`${item.name}${item.manufacturer ? ` · ${item.manufacturer}` : ""}`}
        action={
          <Link href="/quality/equipment" className="text-sm font-semibold text-lab-burgundy underline">
            Kthehu te regjistri
          </Link>
        }
      />

      <div
        className={`mb-5 rounded-lg border p-4 ${
          state === "overdue"
            ? "border-red-300 bg-red-50 text-red-900"
            : state === "due-soon"
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-line bg-white text-ink"
        }`}
      >
        <div className="text-sm font-semibold">
          {state === "overdue"
            ? `Kalibrimi ka skaduar më ${item.nextCalibrationDate} — ${Math.abs(days ?? 0)} ditë më parë.`
            : state === "due-soon"
              ? `Kalibrimi skadon më ${item.nextCalibrationDate} — për ${days} ditë.`
              : state === "valid"
                ? `Në afat deri më ${item.nextCalibrationDate}.`
                : state === "not-dated"
                  ? `Verifikohet para çdo përdorimi (${item.nextCalibrationDate}).`
                  : "Nuk ka datë kalibrimi të regjistruar."}
        </div>
        {item.certificateCode ? (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="opacity-80">Çertifikata: {item.certificateCode}</span>
            {item.certificateUrl ? (
              <>
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-lab-burgundy ring-1 ring-line transition hover:bg-lab-burgundy hover:text-white"
                >
                  Shiko çertifikatën
                </a>
                <a
                  href={`${item.certificateUrl}?download=1`}
                  className="rounded-md bg-white px-2.5 py-1.5 text-xs font-semibold text-lab-burgundy ring-1 ring-line transition hover:bg-lab-burgundy hover:text-white"
                >
                  Shkarko
                </a>
              </>
            ) : (
              <span className="opacity-70">Skedari i çertifikatës nuk është lidhur ende.</span>
            )}
          </div>
        ) : null}
      </div>

      <section className="surface-card mb-5">
        <div className="border-b border-line bg-lab-porcelain px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Të dhënat e regjistruara</h2>
        </div>
        <dl className="grid gap-x-8 gap-y-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail label="Nr. unik i identifikimit" value={item.uniqueCode} />
          <Detail label="Pajisja" value={item.name} />
          <Detail label="Fusha" value={item.field} />
          <Detail label="Intervali i matjes" value={item.measuringRange} />
          <Detail label="Klasa" value={item.accuracyClass} />
          <Detail label="Prodhuesi" value={item.manufacturer} />
          <Detail label="Modeli" value={item.model} />
          <Detail label="Nr. Serial" value={item.serialNumber} />
          <Detail label="Lloji i kalibrimit" value={item.calibrationType} />
          <Detail label="Organizmi kalibrues" value={item.calibrationBody} />
          <Detail label="Data e kalibrimit aktual" value={item.lastCalibration} />
          <Detail label="Intervali i kalibrimit" value={item.calibrationInterval} />
          <Detail label="Kalibrimi i ardhshëm" value={item.nextCalibrationPeriod} />
          <Detail label="Data e ardhshme e kalibrimit" value={item.nextCalibrationDate} />
          <Detail label="Kodi i Çertifikatës" value={item.certificateCode} />
          <Detail label="Gjendja" value={item.status} />
          <Detail label="Vendodhja" value={item.location} />
          <Detail label="Magazinimi" value={item.storage} />
          <Detail label="Sasia fizike" value={item.quantity !== undefined ? String(item.quantity) : undefined} />
          <Detail label="Përshkrimi" value={item.description} />
          <Detail label="Shënime" value={item.notes} />
        </dl>
      </section>

      {!canEdit ? (
        <p className="rounded-lg border border-line bg-lab-porcelain p-4 text-sm text-muted">
          Vetëm Menaxheri i Cilësisë, Përgjegjësi i Laboratorit dhe Administratori mund ta ndryshojnë regjistrin e
          pajisjeve.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <form onSubmit={submit} hidden={!canEdit} className="space-y-5">
          <section className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <h2 className="text-lg font-semibold text-ink">Kalibrimi</h2>
              <p className="mt-1 text-sm text-muted">
                Kur kryhet një kalibrim i ri, vendosni datën dhe kodin e çertifikatës. Data e mëparshme ruhet në historik.
              </p>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="Data e kalibrimit aktual">
                <input
                  type="date"
                  value={lastCalibration}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLastCalibration(value);
                    // Move the due date along with it, unless it has been set
                    // by hand — then it is deliberate and must not be lost.
                    const next = suggestNextCalibrationDate(fromDateInputValue(value), item.calibrationInterval);
                    const currentIsSuggested =
                      !nextCalibrationDate ||
                      fromDateInputValue(nextCalibrationDate) ===
                        suggestNextCalibrationDate(fromDateInputValue(lastCalibration), item.calibrationInterval);
                    if (next && currentIsSuggested) setNextCalibrationDate(toDateInputValue(next));
                  }}
                  className="input"
                />
              </Field>
              <Field label="Data e ardhshme e kalibrimit">
                <input
                  type="date"
                  value={nextCalibrationDate}
                  onChange={(event) => setNextCalibrationDate(event.target.value)}
                  className="input"
                />
                {suggestion ? (
                  <p className="mt-1 text-xs text-muted">
                    {suggestionAccepted ? (
                      <>Propozuar nga intervali ({item.calibrationInterval}). Ndryshojeni nëse çertifikata thotë ndryshe.</>
                    ) : (
                      <>
                        Nga intervali del {suggestion}.{" "}
                        <button
                          type="button"
                          onClick={() => setNextCalibrationDate(toDateInputValue(suggestion))}
                          className="font-semibold text-lab-burgundy underline"
                        >
                          Përdore
                        </button>
                      </>
                    )}
                  </p>
                ) : null}
              </Field>
              <Field label="Kodi i Çertifikatës së kalibrimit">
                <input name="certificateCode" defaultValue={item.certificateCode ?? ""} className="input" />
              </Field>
              <Field label="Lidhja me çertifikatën (SharePoint)">
                <input
                  name="certificateUrl"
                  type="url"
                  defaultValue={item.certificateUrl ?? ""}
                  placeholder="https://sarpandlab.sharepoint.com/..."
                  className="input"
                />
              </Field>
              <Field label="Organizmi kalibrues">
                <input name="calibrationBody" defaultValue={item.calibrationBody ?? ""} className="input" />
              </Field>
              <Field label="Lloji i kalibrimit">
                <select name="calibrationType" defaultValue={item.calibrationType ?? ""} className="input">
                  <option value="">—</option>
                  <option value="I jashtëm">I jashtëm</option>
                  <option value="I brendshëm">I brendshëm</option>
                </select>
              </Field>
              <Field label="Intervali i kalibrimit">
                <input name="calibrationInterval" defaultValue={item.calibrationInterval ?? ""} className="input" />
              </Field>
              <Field label="Kalibrimi i ardhshëm (periudha)">
                <input
                  name="nextCalibrationPeriod"
                  defaultValue={item.nextCalibrationPeriod ?? ""}
                  placeholder="p.sh. Gusht 2026"
                  className="input"
                />
              </Field>
              <Field label="Gjendja">
                <select name="status" defaultValue={item.status} className="input">
                  {STATUSES.map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="surface-card">
            <div className="border-b border-line bg-lab-porcelain px-5 py-4">
              <h2 className="text-lg font-semibold text-ink">Të dhënat e pajisjes</h2>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field label="Nr. unik i identifikimit">
                <input name="uniqueCode" defaultValue={item.uniqueCode} className="input" />
              </Field>
              <Field label="Pajisja">
                <input name="name" defaultValue={item.name} required className="input" />
              </Field>
              <Field label="Fusha">
                <input name="field" defaultValue={item.field ?? ""} className="input" />
              </Field>
              <Field label="Intervali i matjes">
                <input name="measuringRange" defaultValue={item.measuringRange ?? ""} className="input" />
              </Field>
              <Field label="Klasa">
                <input name="accuracyClass" defaultValue={item.accuracyClass ?? ""} className="input" />
              </Field>
              <Field label="Prodhuesi">
                <input name="manufacturer" defaultValue={item.manufacturer ?? ""} className="input" />
              </Field>
              <Field label="Modeli">
                <input name="model" defaultValue={item.model ?? ""} className="input" />
              </Field>
              <Field label="Nr. Serial">
                <input name="serialNumber" defaultValue={item.serialNumber ?? ""} className="input" />
              </Field>
              <Field label="Vendodhja">
                <input name="location" defaultValue={item.location ?? ""} className="input" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Shënime">
                  <input name="notes" defaultValue={item.notes ?? ""} className="input" />
                </Field>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-line p-5">
              {saved ? <span className="text-sm font-semibold text-green-700">U ruajt.</span> : null}
              <button type="submit" className="btn-primary">Ruaj</button>
            </div>
          </section>
        </form>

        <aside className="surface-card h-fit">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Historiku i kalibrimeve</h2>
          </div>
          <div className="p-5">
            {item.calibrationHistory?.length ? (
              <ol className="space-y-4">
                {item.calibrationHistory.map((entry, index) => (
                  <li key={`${entry.recordedAt}-${index}`} className="border-l-2 border-line pl-3">
                    <div className="text-sm font-semibold text-ink">{entry.lastCalibration || "—"}</div>
                    <div className="text-xs text-muted">
                      Vlente deri {entry.nextCalibrationDate || "—"}
                      {entry.certificateCode ? ` · ${entry.certificateCode}` : ""}
                    </div>
                    {entry.calibrationBody ? <div className="text-xs text-muted">{entry.calibrationBody}</div> : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted">
                Ende asnjë kalibrim i regjistruar përmes aplikacionit. Kalibrimi aktual u mor nga SL-FB-6.4.7; çdo
                kalibrim i ri i regjistruar këtu do të ruajë atë që zëvendëson.
              </p>
            )}
          </div>
        </aside>
      </div>

      <p className="mt-4 text-xs text-muted">
        Paralajmërimi shfaqet {CALIBRATION_WARNING_DAYS} ditë përpara datës së ardhshme të kalibrimit.
      </p>
    </>
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

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value || "—"}</dd>
    </div>
  );
}
