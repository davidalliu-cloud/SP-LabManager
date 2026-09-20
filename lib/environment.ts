/**
 * Kushtet ambjentale — SL-RB-6.3.1 Regjistri i kushteve ambjentale, and the
 * procedure behind it, SL-PB-6.3 (Versioni 7, 28.08.2024).
 *
 * The procedure puts the duty plainly: before work starts, the Head of
 * Laboratory together with the department heads checks and records the
 * temperature and relative humidity of the environment (§5.2). Personnel
 * monitor and record the conditions in their own areas (§3.2), and must
 * recognise when conditions are not met and would affect results (§3.1.8).
 *
 * A paper register cannot tell anyone that yesterday was missed. That is the
 * whole reason for putting this one in the app.
 */
export type LabArea = {
  /** The code written on the register sheet and on the equipment records. */
  code: string;
  /** Ambjenti / Dhoma, as the register names it. */
  name: string;
  floor: "A" | "B";
};

/**
 * Ndarja e ambjenteve të punës, from the register's own first page. Two areas
 * share the code 01/A — the physical-mechanical laboratory and geotechnics are
 * one space — so they are one row here, named as the register names both.
 */
export const LAB_AREAS: LabArea[] = [
  { code: "01/A", name: "Laboratori Fiziko-Mekanik / Gjeoteknikë", floor: "A" },
  { code: "02/A", name: "Dhoma ku kryhen testimet e hekurit", floor: "A" },
  { code: "03/A", name: "Dhoma ku ndodhen vaskat për mostrat e kubikëve", floor: "A" },
  { code: "05/A", name: "Dhoma ku kryhen testet e asfaltit", floor: "A" },
  { code: "01/B", name: "Laboratori kimik", floor: "B" },
  { code: "02/B", name: "Laboratori i çimentos dhe gjeoteknikës", floor: "B" }
];

export function labArea(code?: string) {
  return LAB_AREAS.find((area) => area.code === code);
}

/**
 * The limits printed at the head of every register sheet:
 *
 *   Temperatura e duhur në laborator:      (20 – 25) ± 2 °C
 *   Lagështia relative e duhur:            (35 – 50) ± 5
 *
 * Read as a target band with a tolerance around it, which gives three states
 * rather than two. Inside the band is normal. Inside the tolerance is worth
 * seeing but is not a departure. Outside the tolerance is a condition the
 * procedure says must be recognised as affecting results.
 */
export const ENVIRONMENT_LIMITS = {
  temperature: { min: 20, max: 25, tolerance: 2, unit: "°C" },
  humidity: { min: 35, max: 50, tolerance: 5, unit: "%" }
} as const;

export type ReadingState = "in-range" | "in-tolerance" | "out-of-tolerance" | "missing";

export type EnvironmentReading = {
  id: string;
  /** Ambjenti / Dhoma */
  areaCode: string;
  /** Data — ISO, so it sorts and compares; shown European. */
  date: string;
  /** Ora e matjes */
  time: string;
  /** Temperatura [°C] */
  temperature?: number;
  /** Lagështia [%] */
  humidity?: number;
  /** Shënime / Komente */
  notes?: string;
  recordedBy?: string;
  createdAt: string;
};

function stateFor(value: number | undefined, limit: { min: number; max: number; tolerance: number }): ReadingState {
  if (value === undefined || Number.isNaN(value)) return "missing";
  if (value >= limit.min && value <= limit.max) return "in-range";
  const low = limit.min - limit.tolerance;
  const high = limit.max + limit.tolerance;
  return value >= low && value <= high ? "in-tolerance" : "out-of-tolerance";
}

export function temperatureState(reading: Pick<EnvironmentReading, "temperature">) {
  return stateFor(reading.temperature, ENVIRONMENT_LIMITS.temperature);
}

export function humidityState(reading: Pick<EnvironmentReading, "humidity">) {
  return stateFor(reading.humidity, ENVIRONMENT_LIMITS.humidity);
}

/** The worse of the two, since a reading is only as good as its weaker half. */
export function readingState(reading: Pick<EnvironmentReading, "temperature" | "humidity">): ReadingState {
  const states = [temperatureState(reading), humidityState(reading)];
  if (states.includes("out-of-tolerance")) return "out-of-tolerance";
  if (states.includes("missing")) return "missing";
  if (states.includes("in-tolerance")) return "in-tolerance";
  return "in-range";
}

/** How far outside the band a value sits, for the note beside it. */
export function departure(value: number | undefined, limit: { min: number; max: number }) {
  if (value === undefined) return 0;
  if (value < limit.min) return Number((value - limit.min).toFixed(1));
  if (value > limit.max) return Number((value - limit.max).toFixed(1));
  return 0;
}

/**
 * SARP works Monday to Saturday, so a Sunday without a reading is not a gap.
 * Nothing else about the week is assumed: a public holiday with no reading will
 * show as missing, which is the safer way round — it prompts someone to write
 * down why rather than passing over it in silence.
 */
export function isWorkingDay(date: Date) {
  return date.getDay() !== 0;
}

export function toIsoDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * The working days of a month that have no reading for an area, up to today.
 *
 * Two days are not gaps. A future day has not happened yet. And a day before
 * this area was ever recorded is not a lapse in the register — it is a day
 * before the register was in use, and reporting those would open the screen on
 * a wall of red that says nothing about how the lab is being run.
 */
export function missingDays(params: {
  year: number;
  month: number;
  areaCode: string;
  readings: EnvironmentReading[];
  today?: Date;
}) {
  const { year, month, areaCode, readings, today = new Date() } = params;
  const forArea = readings.filter((reading) => reading.areaCode === areaCode);
  const recorded = new Set(forArea.map((reading) => reading.date));
  const todayIso = toIsoDate(today);
  // Nothing is missing for an area that has never been recorded at all.
  const firstRecorded = forArea.reduce<string | undefined>(
    (earliest, reading) => (!earliest || reading.date < earliest ? reading.date : earliest),
    undefined
  );
  if (!firstRecorded) return [];

  const days: string[] = [];
  const cursor = new Date(year, month - 1, 1);
  while (cursor.getMonth() === month - 1) {
    const iso = toIsoDate(cursor);
    if (iso > todayIso) break;
    if (iso >= firstRecorded && isWorkingDay(cursor) && !recorded.has(iso)) days.push(iso);
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

/** Month names as the register writes them on each sheet. */
export const MONTHS_SQ = [
  "Janar",
  "Shkurt",
  "Mars",
  "Prill",
  "Maj",
  "Qershor",
  "Korrik",
  "Gusht",
  "Shtator",
  "Tetor",
  "Nëntor",
  "Dhjetor"
];

export function monthLabel(year: number, month: number) {
  return `${MONTHS_SQ[month - 1]} ${year}`;
}

/** What the form may file. The id, who and when are the store's business. */
export type EnvironmentReadingInput = {
  areaCode: string;
  date: string;
  time: string;
  temperature?: number;
  humidity?: number;
  notes?: string;
};
