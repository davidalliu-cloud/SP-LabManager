/**
 * Pajisjet — the equipment register, ISO/IEC 17025 §6.4.
 *
 * The field names below are the columns of SL-FB-6.4.7 PROGRAMI I KALIBRIMIT TË
 * PAJISJEVE LABORATORIKE (Versioni 7, viti 2026), kept word for word. The
 * register is assessed against the documented system, so the screen has to read
 * as the same record rather than a re-imagining of it.
 *
 * The inventory form SL-FB-6.4.1 describes the same instruments in less detail
 * and adds where each one is kept; its columns are here too, optional, so the
 * ~1,100 uncalibrated items can join the register later without reshaping it.
 */
export type EquipmentStatus = "Në përdorim" | "Jashtë përdorimit" | "Në riparim" | "Hequr nga përdorimi";

export type Equipment = {
  id: string;

  // --- SL-FB-6.4.7, Programi i kalibrimit ---------------------------------
  /** Nr. unik i identifikimit — FM38/1, K12, GJ-3/6. The key to everything. */
  uniqueCode: string;
  /** Pajisja */
  name: string;
  /** Fusha — the measurement domain: forcë, peshë, gjatësi, temperaturë… */
  field?: string;
  /** Intervali i matjes */
  measuringRange?: string;
  /** Klasa */
  accuracyClass?: string;
  /** Prodhuesi */
  manufacturer?: string;
  /** Modeli */
  model?: string;
  /** Nr. Serial */
  serialNumber?: string;
  /** Lloji i kalibrimit — "I jashtëm" or "I brendshëm" */
  calibrationType?: string;
  /** Data e kalibrimit aktual */
  lastCalibration?: string;
  /** Intervali i kalibrimit — "1 herë në vit" */
  calibrationInterval?: string;
  /** Kalibrimi i ardhshëm — the planned month, "Gusht 2026" */
  nextCalibrationPeriod?: string;
  /**
   * Data e ardhshme e kalibrimit. This is the date the register is judged on
   * and the one the warning counts down to. Some instruments are verified
   * before each use rather than to a date, so anything unparseable is shown as
   * written and never counted down.
   */
  nextCalibrationDate?: string;
  /** Organizmi kalibrues */
  calibrationBody?: string;
  /** Kodi i Çertifikatës së kalibrimit */
  certificateCode?: string;

  // --- SL-FB-6.4.1, Lista e pajisjeve laboratorike ------------------------
  /** Përshkrimi i pajisjes */
  description?: string;
  /** Sasia fizike */
  quantity?: number;
  /** Vendodhja */
  location?: string;
  /** Magazinimi */
  storage?: string;
  /** Shenime */
  notes?: string;
  status: EquipmentStatus;

  /**
   * Every calibration recorded through the app, newest first.
   *
   * ISO/IEC 17025 §6.4.13 wants the calibration records kept, not just the
   * current status, and a register that only ever holds the latest date
   * silently destroys the previous one each time it is updated. Each save that
   * changes the calibration date files the entry that is being replaced.
   */
  calibrationHistory?: CalibrationEntry[];

  createdAt: string;
  updatedAt?: string;
};

export type CalibrationEntry = {
  /** Data e kalibrimit aktual, as it stood */
  lastCalibration?: string;
  /** Data e ardhshme e kalibrimit, as it stood */
  nextCalibrationDate?: string;
  /** Kodi i Çertifikatës së kalibrimit */
  certificateCode?: string;
  /** Organizmi kalibrues */
  calibrationBody?: string;
  /** When the app filed it, and who was signed in */
  recordedAt: string;
  recordedBy?: string;
};

/**
 * How near the next calibration an instrument has to be before the register
 * says so. One month, as the lab asked — long enough to book an external
 * calibration body, short enough not to cry wolf all year.
 */
export const CALIBRATION_WARNING_DAYS = 30;

export type CalibrationState = "overdue" | "due-soon" | "valid" | "not-dated" | "none";

/**
 * Overdue and due-soon are deliberately separate states, not two shades of the
 * same one. "Due soon" is a booking for whoever arranges calibration.
 * "Overdue" means the instrument's traceability has lapsed and results
 * produced with it are open to challenge — a different thing to act on, and a
 * different urgency.
 */
export function calibrationState(item: Pick<Equipment, "nextCalibrationDate">, today = new Date()): CalibrationState {
  const raw = item.nextCalibrationDate?.trim();
  if (!raw) return "none";
  const due = parseLabDate(raw);
  // Entries such as "Në përdorimin tjetër" are real answers on the form:
  // verified at next use, so there is no date to count down to.
  if (!due) return "not-dated";
  const days = daysUntil(due, today);
  if (days < 0) return "overdue";
  return days <= CALIBRATION_WARNING_DAYS ? "due-soon" : "valid";
}

/** Whole days from `today` to `due`, both taken at local midnight. */
export function daysUntil(due: Date, today = new Date()) {
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const end = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

/**
 * The forms are written in Albanian practice: 31.08.2026. ISO dates are
 * accepted too, since anything typed into the app will be one.
 */
export function parseLabDate(value?: string): Date | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  const dotted = /^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/.exec(raw);
  if (dotted) {
    const date = new Date(Number(dotted[3]), Number(dotted[2]) - 1, Number(dotted[1]));
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (iso) {
    const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  return undefined;
}

/** dd.mm.yyyy → yyyy-mm-dd, for a date input. Empty when unparseable. */
export function toDateInputValue(value?: string) {
  const date = parseLabDate(value);
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * yyyy-mm-dd → dd.mm.yyyy, the way the forms are written.
 *
 * Storage keeps the document's own format: the register is read beside the
 * paper record and printed from it, and a screen that says 2027-05-12 where
 * the certificate says 12.05.2027 invites somebody to "correct" one of them.
 */
export function fromDateInputValue(value?: string) {
  const raw = value?.trim();
  if (!raw) return "";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  return iso ? `${iso[3]}.${iso[2]}.${iso[1]}` : raw;
}

/**
 * What the next calibration date probably is, given when this one happened and
 * how often the instrument is calibrated.
 *
 * A suggestion only. The certificate states the validity and it is the
 * certificate that counts — SARP's own entries sit a day or two either side of
 * the arithmetic. So this fills the field to save typing and says where the
 * number came from, and the technician is free to overwrite it.
 *
 * The lab's convention is the day before the anniversary: 13.05.2026 calibrated
 * yearly reads 12.05.2027.
 */
export function suggestNextCalibrationDate(lastCalibration?: string, interval?: string) {
  const from = parseLabDate(lastCalibration);
  if (!from) return "";

  const months = intervalInMonths(interval);
  if (!months) return "";

  const next = new Date(from.getFullYear(), from.getMonth() + months, from.getDate());
  next.setDate(next.getDate() - 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(next.getDate())}.${pad(next.getMonth() + 1)}.${next.getFullYear()}`;
}

/** The intervals the programme actually uses, in months. */
function intervalInMonths(interval?: string) {
  const text = interval?.toLocaleLowerCase("sq-AL").trim();
  if (!text) return 0;
  if (text.includes("herë në vit")) {
    // "1 herë në vit" is yearly; "2 herë në vit" is twice a year, and so on.
    const times = Number(/^(\d+)/.exec(text)?.[1] ?? 1);
    return times > 0 ? Math.round(12 / times) : 12;
  }
  if (text.includes("herë në 6 muaj")) return 6;
  if (text.includes("herë në muaj")) return 1;
  // "Sa herë që përdoret" and "Para çdo përdorimi" have no period to add.
  return 0;
}

/** Sorts the register by what needs attention first. */
export function calibrationSortKey(item: Equipment, today = new Date()) {
  const due = parseLabDate(item.nextCalibrationDate);
  // No date sorts last: the instrument is either not calibrated at all or
  // verified at each use, and neither is a deadline.
  if (!due) return Number.MAX_SAFE_INTEGER;
  return daysUntil(due, today);
}

/**
 * Records written by the first version of the register, before the columns were
 * aligned to SL-FB-6.4.7 Versioni 7.
 *
 * These names existed only in that shape, so finding one is proof the saved
 * list predates the current record. It matters because the app saves its whole
 * state every 800 ms: a tab left open on the older build writes its copy back,
 * and the new screen then reads fields those rows do not have and shows a
 * register with no dates in it at all. Detecting them lets the next load put
 * the correct list back rather than needing the database edited by hand.
 */
const SUPERSEDED_KEYS = ["validUntil", "validFrom", "measurementField", "calibrationCentre", "calibrationFrequency"];

export function isSupersededEquipmentShape(rows: unknown): boolean {
  if (!Array.isArray(rows) || rows.length === 0) return false;
  return rows.some(
    (row) => typeof row === "object" && row !== null && SUPERSEDED_KEYS.some((key) => key in (row as Record<string, unknown>))
  );
}

export function equipmentNeedsAttention(item: Equipment, today = new Date()) {
  const state = calibrationState(item, today);
  return state === "overdue" || state === "due-soon";
}

/** What the edit form may change. Identity and history are not its business. */
export type EquipmentInput = Partial<
  Omit<Equipment, "id" | "createdAt" | "updatedAt" | "calibrationHistory">
>;
