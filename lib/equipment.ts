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

  createdAt: string;
  updatedAt?: string;
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
