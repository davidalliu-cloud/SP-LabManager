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
  labArea,
  missingDays,
  monthLabel,
  readingState,
  temperatureState,
  toIsoDate,
  type EnvironmentReading,
  type ReadingState
} from "@/lib/environment";

/**
 * Regjistri i kushteve ambjentale — SL-RB-6.3.1.
 *
 * The paper register is one sheet per room per month, so this is too: pick the
 * area and the month and you are looking at the same page. What it adds is the
 * one thing paper cannot do — say which working days have no reading at all.
 */
export default function EnvironmentPage() {
  const store = useLabStore();
  const today = useMemo(() => new Date(), []);
  const [areaCode, setAreaCode] = useParamState("area", LAB_AREAS[0].code);
  const [month, setMonth] = useParamState("month", `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);

  const currentUser = store.users.find((user) => user.id === store.currentUserId);
  const canRecord = canRecordEnvironment(currentUser?.role);
  const canAmend = canAmendEnvironment(currentUser?.role);

  const [year, monthNumber] = month.split("-").map(Number);
  const area = labArea(areaCode) ?? LAB_AREAS[0];

  const readings = useMemo(
    () =>
      store.environmentReadings
        .filter((reading) => reading.areaCode === areaCode && reading.date.startsWith(month))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [store.environmentReadings, areaCode, month]
  );

  const gaps = useMemo(
    () => missingDays({ year, month: monthNumber, areaCode, readings: store.environmentReadings, today }),
    [year, monthNumber, areaCode, store.environmentReadings, today]
  );

  const outOfTolerance = readings.filter((reading) => readingState(reading) === "out-of-tolerance");

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
        description="SL-RB-6.3.1 Regjistri i kushteve ambjentale — një fletë për çdo ambjent dhe muaj."
      />

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Ambjenti / Dhoma</span>
          <select value={areaCode} onChange={(event) => setAreaCode(event.target.value)} className="input min-w-72">
            {LAB_AREAS.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} — {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">Muaji / Viti</span>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="input" />
        </label>
      </div>

      {/* The limits, where the register prints them: at the head of the sheet. */}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <LimitCard
          label="Temperatura e duhur"
          value={`(${ENVIRONMENT_LIMITS.temperature.min} – ${ENVIRONMENT_LIMITS.temperature.max}) ± ${ENVIRONMENT_LIMITS.temperature.tolerance} °C`}
        />
        <LimitCard
          label="Lagështia relative e duhur"
          value={`(${ENVIRONMENT_LIMITS.humidity.min} – ${ENVIRONMENT_LIMITS.humidity.max}) ± ${ENVIRONMENT_LIMITS.humidity.tolerance} %`}
        />
        <LimitCard label="Fleta" value={`${area.code} · ${monthLabel(year, monthNumber)}`} />
      </div>

      {gaps.length > 0 ? (
        <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">
            {gaps.length} ditë pune pa matje në {area.code}.
          </div>
          <div className="mt-1 text-xs">
            {gaps.map((day) => day.slice(8) + "." + day.slice(5, 7)).join(", ")}
          </div>
          <div className="mt-2 text-xs opacity-80">
            E diela nuk numërohet. Një ditë feste shfaqet këtu — shënoni arsyen te matja më e afërt.
          </div>
        </div>
      ) : null}

      {outOfTolerance.length > 0 ? (
        <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <span className="font-semibold">{outOfTolerance.length} matje jashtë tolerancës këtë muaj.</span>{" "}
          Sipas SL-PB-6.3 §3.1.8 duhet vlerësuar nëse kanë ndikuar në rezultatet e testimeve të asaj dite.
        </div>
      ) : null}

      {canRecord ? (
        <form onSubmit={submit} className="surface-card mb-5">
          <div className="border-b border-line bg-lab-porcelain px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Matje e re</h2>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-5">
            <Field label="Data">
              <input type="date" name="date" required defaultValue={toIsoDate(today)} className="input" />
            </Field>
            <Field label="Ora e matjes">
              <input type="time" name="time" required defaultValue="08:00" className="input" />
            </Field>
            <Field label={`Temperatura [${ENVIRONMENT_LIMITS.temperature.unit}]`}>
              <input type="number" name="temperature" step="0.1" min="-20" max="60" className="input" />
            </Field>
            <Field label={`Lagështia [${ENVIRONMENT_LIMITS.humidity.unit}]`}>
              <input type="number" name="humidity" step="1" min="0" max="100" className="input" />
            </Field>
            <Field label="Shënime / Komente">
              <input name="notes" className="input" />
            </Field>
          </div>
          <div className="flex justify-end border-t border-line p-5">
            <button type="submit" className="btn-primary">Ruaj matjen</button>
          </div>
        </form>
      ) : null}

      <div className="surface-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="bg-lab-porcelain text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Ora e matjes</th>
                <th className="px-4 py-3">Temperatura [°C]</th>
                <th className="px-4 py-3">Lagështia [%]</th>
                <th className="px-4 py-3">Shënime / Komente</th>
                {canAmend ? <th className="px-4 py-3" /> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {readings.map((reading) => (
                <tr key={reading.id}>
                  <td className="px-4 py-3 tabular-nums">{formatDay(reading.date)}</td>
                  <td className="px-4 py-3 tabular-nums">{reading.time}</td>
                  <td className="px-4 py-3">
                    <Measurement
                      value={reading.temperature}
                      state={temperatureState(reading)}
                      off={departure(reading.temperature, ENVIRONMENT_LIMITS.temperature)}
                      unit="°C"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Measurement
                      value={reading.humidity}
                      state={humidityState(reading)}
                      off={departure(reading.humidity, ENVIRONMENT_LIMITS.humidity)}
                      unit="%"
                    />
                  </td>
                  <td className="px-4 py-3 text-muted">{reading.notes || "—"}</td>
                  {canAmend ? (
                    <td className="px-4 py-3 text-right">
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
                  <td colSpan={canAmend ? 6 : 5} className="px-4 py-10 text-center text-muted">
                    Asnjë matje e regjistruar për {area.code} në {monthLabel(year, monthNumber)}.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted">
        Sipas SL-PB-6.3 §5.2, kontrolli dhe regjistrimi i temperaturës dhe lagështisë relative bëhet para fillimit të
        punës. Personeli monitoron dhe regjistron kushtet në zonat e veta (§3.2).
      </p>
    </>
  );
}

function formatDay(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

/**
 * A measured value and what it means. Only a departure is coloured: if a normal
 * reading were also tinted, the eye would stop finding the ones that matter.
 */
function Measurement({
  value,
  state,
  off,
  unit
}: {
  value?: number;
  state: ReadingState;
  off: number;
  unit: string;
}) {
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

function LimitCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-sm font-semibold text-ink">{value}</div>
    </div>
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
