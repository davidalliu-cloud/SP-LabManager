"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useParamState } from "@/components/ui/filter-bar";
import { useLabStore } from "@/lib/lab-store";
import { canAmendEnvironment, canRecordEnvironment } from "@/lib/permissions";
import {
  ENVIRONMENT_LIMITS,
  LAB_AREAS,
  departure,
  humidityState,
  isWorkingDay,
  labArea,
  missingDays,
  monthLabel,
  readingState,
  temperatureState,
  toIsoDate,
  type ReadingState
} from "@/lib/environment";

/**
 * Regjistri i kushteve ambjentale — SL-RB-6.3.1.
 *
 * The page is built around the question somebody actually opens it with: which
 * rooms still need a reading today. That is why the areas are a row of cards
 * showing today's state rather than a dropdown — a dropdown hides five of the
 * six areas, and the one thing that must not be hidden is the one nobody has
 * filled in yet.
 */
export default function EnvironmentPage() {
  const store = useLabStore();
  const today = useMemo(() => new Date(), []);
  const todayIso = toIsoDate(today);
  const [areaCode, setAreaCode] = useParamState("area", LAB_AREAS[0].code);
  const [month, setMonth] = useParamState(
    "month",
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canRecord = canRecordEnvironment(currentUser?.role);
  const canAmend = canAmendEnvironment(currentUser?.role);

  const [year, monthNumber] = month.split("-").map(Number);
  const area = labArea(areaCode) ?? LAB_AREAS[0];

  /** Today's reading per area, which is what the cards at the top report. */
  const todayByArea = useMemo(() => {
    const map = new Map<string, (typeof store.environmentReadings)[number]>();
    for (const reading of store.environmentReadings) {
      if (reading.date === todayIso) map.set(reading.areaCode, reading);
    }
    return map;
  }, [store.environmentReadings, todayIso]);

  // Sunday is not a working day, so nothing is outstanding on one — without
  // this every card would read "pa matje" every Sunday and the warning would
  // start being ignored on the days it matters.
  const workingToday = isWorkingDay(today);
  const outstanding = workingToday ? LAB_AREAS.filter((item) => !todayByArea.has(item.code)) : [];

  const readings = useMemo(
    () =>
      store.environmentReadings
        .filter((reading) => reading.areaCode === areaCode && reading.date.startsWith(month))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [store.environmentReadings, areaCode, month]
  );

  const gaps = useMemo(
    () => missingDays({ year, month: monthNumber, areaCode, readings: store.environmentReadings, today }),
    [year, monthNumber, areaCode, store.environmentReadings, today]
  );

  const outOfTolerance = readings.filter((reading) => readingState(reading) === "out-of-tolerance");
  const recordedToday = todayByArea.get(areaCode);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const number = (name: string) => {
      const raw = String(data.get(name) ?? "").trim();
      return raw === "" ? undefined : Number(raw);
    };
    store.recordEnvironmentReading({
      areaCode,
      date: String(data.get("date")),
      time: String(data.get("time")),
      temperature: number("temperature"),
      humidity: number("humidity"),
      notes: String(data.get("notes") ?? "").trim()
    });
    form.reset();
  }

  return (
    <>
      <PageHeader
        title="Kushtet ambjentale"
        description="SL-RB-6.3.1 Regjistri i kushteve ambjentale — matja bëhet para fillimit të punës."
      />

      {/* Which rooms still need today's reading. The first thing on the page,
          because it is the first thing anyone wants to know. */}
      <section className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-lab-burgundy">
            Matjet e sotme · {formatDay(todayIso)}
          </h2>
          <span className="text-xs text-muted">
            {!workingToday
              ? "E diel — nuk kërkohet matje."
              : outstanding.length === 0
                ? "Të gjitha ambjentet janë matur sot."
                : `${outstanding.length} nga ${LAB_AREAS.length} ambjente ende pa matje`}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LAB_AREAS.map((item) => {
            const reading = todayByArea.get(item.code);
            const state = reading ? readingState(reading) : undefined;
            const selected = item.code === areaCode;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setAreaCode(item.code)}
                className={`rounded-lg border-2 p-4 text-left transition ${
                  selected ? "border-lab-burgundy shadow-sm" : "border-transparent hover:border-lab-burgundy/40"
                } ${
                  !reading
                    ? workingToday
                      ? "bg-amber-50 ring-1 ring-amber-200"
                      : "bg-white ring-1 ring-line"
                    : state === "out-of-tolerance"
                      ? "bg-red-50 ring-1 ring-red-200"
                      : "bg-white ring-1 ring-line"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold tabular-nums text-ink">{item.code}</span>
                  {reading ? (
                    <span className="text-xs font-semibold tabular-nums text-ink">
                      {reading.temperature ?? "—"} °C · {reading.humidity ?? "—"} %
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
                      pa matje
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs leading-snug text-muted">{item.name}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* The entry form, on a tinted panel so the white fields stand out
          against it. On a white card they disappear into the page. */}
      {canRecord ? (
        <form onSubmit={submit} className="mb-6 overflow-hidden rounded-lg border-2 border-lab-burgundy/25 bg-lab-porcelain">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-lab-burgundy/20 bg-lab-burgundy px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Matje e re — {area.code}
            </h2>
            <span className="text-xs text-white/80">{area.name}</span>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Data">
              <input type="date" name="date" required defaultValue={todayIso} className="field" />
            </Field>
            <Field label="Ora e matjes">
              <input type="time" name="time" required defaultValue="08:00" className="field" />
            </Field>
            <Field
              label="Temperatura"
              hint={`${ENVIRONMENT_LIMITS.temperature.min}–${ENVIRONMENT_LIMITS.temperature.max} °C`}
            >
              <div className="relative">
                <input type="number" name="temperature" step="0.1" min="-20" max="60" placeholder="22.0" className="field no-spinner pr-11" />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-muted">°C</span>
              </div>
            </Field>
            <Field
              label="Lagështia"
              hint={`${ENVIRONMENT_LIMITS.humidity.min}–${ENVIRONMENT_LIMITS.humidity.max} %`}
            >
              <div className="relative">
                <input type="number" name="humidity" step="1" min="0" max="100" placeholder="45" className="field no-spinner pr-11" />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-semibold text-muted">%</span>
              </div>
            </Field>
            <Field label="Shënime / Komente">
              <input name="notes" placeholder="opsionale" className="field" />
            </Field>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-lab-burgundy/15 bg-white/60 px-5 py-4">
            <p className="text-xs text-muted">
              {recordedToday
                ? `${area.code} është matur sot në ${recordedToday.time}. Një matje e re për të njëjtën ditë e zëvendëson atë.`
                : `${area.code} nuk është matur ende sot.`}
            </p>
            <button type="submit" className="btn-primary">Ruaj matjen</button>
          </div>
        </form>
      ) : null}

      {/* Alerts for the selected area's month. */}
      <div className="mb-6 space-y-3">
        {outOfTolerance.length > 0 ? (
          <div className="flex gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-900">
            <div>
              <div className="font-semibold">{outOfTolerance.length} matje jashtë tolerancës këtë muaj.</div>
              <p className="mt-1 text-xs">
                Sipas SL-PB-6.3 §3.1.8 duhet vlerësuar nëse kanë ndikuar në rezultatet e testimeve të asaj dite.
              </p>
            </div>
          </div>
        ) : null}
        {gaps.length > 0 ? (
          <div className="flex gap-3 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-4 text-sm text-amber-900">
            <div>
              <div className="font-semibold">
                {gaps.length} ditë pune pa matje në {area.code} gjatë {monthLabel(year, monthNumber)}.
              </div>
              <div className="mt-1 text-xs tabular-nums">
                {gaps.map((day) => `${day.slice(8)}.${day.slice(5, 7)}`).join(" · ")}
              </div>
              <p className="mt-1 text-xs opacity-80">E diela nuk numërohet. Një ditë feste shfaqet këtu.</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* The register sheet itself. */}
      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-lab-porcelain px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-lab-burgundy">Fleta e regjistrit</h2>
            <p className="mt-0.5 text-sm text-ink">
              <span className="font-semibold">{area.code}</span> · {monthLabel(year, monthNumber)}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="text-xs leading-tight text-muted">
              <div>
                Temperatura e duhur:{" "}
                <span className="font-semibold text-ink">
                  ({ENVIRONMENT_LIMITS.temperature.min} – {ENVIRONMENT_LIMITS.temperature.max}) ±{" "}
                  {ENVIRONMENT_LIMITS.temperature.tolerance} °C
                </span>
              </div>
              <div>
                Lagështia relative:{" "}
                <span className="font-semibold text-ink">
                  ({ENVIRONMENT_LIMITS.humidity.min} – {ENVIRONMENT_LIMITS.humidity.max}) ±{" "}
                  {ENVIRONMENT_LIMITS.humidity.tolerance} %
                </span>
              </div>
            </div>
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Muaji</span>
              <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="field" />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="border-b border-line bg-white text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Ora e matjes</th>
                <th className="px-5 py-3">Temperatura [°C]</th>
                <th className="px-5 py-3">Lagështia [%]</th>
                <th className="px-5 py-3">Shënime / Komente</th>
                {canAmend ? <th className="px-5 py-3" /> : null}
              </tr>
            </thead>
            <tbody>
              {readings.map((reading, index) => (
                <tr
                  key={reading.id}
                  className={`border-b border-line/70 ${index % 2 === 1 ? "bg-lab-porcelain/40" : ""} ${
                    reading.date === todayIso ? "ring-1 ring-inset ring-lab-burgundy/20" : ""
                  }`}
                >
                  <td className="px-5 py-3 font-medium tabular-nums text-ink">
                    {formatDay(reading.date)}
                    {reading.date === todayIso ? (
                      <span className="ml-2 rounded bg-lab-burgundy/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-lab-burgundy">
                        sot
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 tabular-nums text-muted">{reading.time}</td>
                  <td className="px-5 py-3">
                    <Measurement
                      value={reading.temperature}
                      state={temperatureState(reading)}
                      off={departure(reading.temperature, ENVIRONMENT_LIMITS.temperature)}
                      unit="°C"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <Measurement
                      value={reading.humidity}
                      state={humidityState(reading)}
                      off={departure(reading.humidity, ENVIRONMENT_LIMITS.humidity)}
                      unit="%"
                    />
                  </td>
                  <td className="px-5 py-3 text-muted">{reading.notes || "—"}</td>
                  {canAmend ? (
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => store.deleteEnvironmentReading(reading.id)}
                        className="text-xs font-semibold text-lab-burgundy underline"
                      >
                        Fshi
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
              {readings.length === 0 ? (
                <tr>
                  <td colSpan={canAmend ? 6 : 5} className="px-5 py-12 text-center text-muted">
                    Asnjë matje për {area.code} në {monthLabel(year, monthNumber)}.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        SL-PB-6.3 §5.2: kontrolli dhe regjistrimi i temperaturës dhe lagështisë relative bëhet para fillimit të punës.
        §3.2: personeli monitoron dhe regjistron kushtet në zonat e veta.
      </p>
    </>
  );
}

function formatDay(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

/**
 * A measured value and what it means. Only a departure is coloured: tint every
 * row and the eye stops finding the ones that matter.
 */
function Measurement({ value, state, off, unit }: { value?: number; state: ReadingState; off: number; unit: string }) {
  if (value === undefined) return <span className="text-muted">—</span>;
  const tone =
    state === "out-of-tolerance"
      ? "bg-red-600 text-white"
      : state === "in-tolerance"
        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300"
        : "";
  return (
    <span className={`inline-flex items-baseline gap-1.5 rounded px-2 py-1 tabular-nums ${tone}`}>
      <span className="font-semibold">{value}</span>
      <span className="text-xs opacity-80">{unit}</span>
      {off !== 0 ? (
        <span className="text-[11px] opacity-90">
          ({off > 0 ? "+" : ""}
          {off})
        </span>
      ) : null}
    </span>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink">{label}</span>
        {hint ? <span className="text-[11px] font-medium text-muted">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}
