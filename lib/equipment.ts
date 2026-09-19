/**
 * Pajisjet — the equipment register, ISO/IEC 17025 §6.4.
 *
 * Two controlled documents describe the same instruments and this register
 * holds both, joined on the unique identification code:
 *
 *   SL-FB-6.4.1  LISTA E PAJISJEVE LABORATORIKE — what the instrument is
 *   SL-FP-6.4.7  PROGRAMI I KALIBRIMEVE — when it was calibrated and until when
 *
 * The field names below are the columns of those forms, deliberately unchanged.
 * The register is assessed against the documented system, so the screen has to
 * be readable as the same record, not a re-imagining of it.
 *
 * Not every item is calibrated. Most of the 1,100 inventory rows are sieves and
 * glassware carrying identity only, so every calibration field is optional and
 * an item without them is complete, not unfinished.
 */
export type CalibrationType = "I.J" | "I.B";

export type EquipmentStatus = "Në përdorim" | "Jashtë përdorimit" | "Në riparim" | "Hequr nga përdorimi";

export type Equipment = {
  id: string;

  // --- SL-FB-6.4.1, Lista e pajisjeve laboratorike -------------------------
  /** Kodi unik i identifikimit — FM 38/1, K 12, GJ 6. The key to everything. */
  uniqueCode: string;
  /** Pajisja */
  name: string;
  /** Përshkrimi i pajisjes */
  description?: string;
  /** Prodhuesi */
  manufacturer?: string;
  /** Modeli */
  model?: string;
  /** Numri serial */
  serialNumber?: string;
  /** Sasia fizike */
  quantity?: number;
  /** Vendodhja — the lab area code, 01/A and the like */
  location?: string;
  /** Magazinimi */
  storage?: string;
  /** Shenime */
  notes?: string;
  status: EquipmentStatus;

  // --- SL-FP-6.4.7, Programi i kalibrimeve ---------------------------------
  /** Fusha e provës/matjeve ku përdoret instrumenti */
  measurementField?: string;
  /** Qendra e kalibrimit */
  calibrationCentre?: string;
  /** Tipi i kalibrimit — I.J external, I.B in-house against traceable standards */
  calibrationType?: CalibrationType;
  /** Fillimi i validimit — the calibration date */
  validFrom?: string;
  /**
   * Mbarimi i validimit. Some instruments are verified before each use rather
   * than to a date ("Në përdorimin tjetër"), so this is free text on the form.
   * A parseable date drives the warning; anything else is shown as written.
   */
  validUntil?: string;
  /** Frekuenca e kalibrimit — "1 herë në vit", "Sa herë që përdoret" */
  calibrationFrequency?: string;
  /** Çertifikata e kalibrimit — certificate reference */
  certificateNumber?: string;

  createdAt: string;
  updatedAt?: string;
};

/**
 * How near the end of validity an instrument has to be before the register
 * says so. One month, as the lab asked — long enough to book an external
 * calibration centre, short enough not to cry wolf all year.
 */
export const CALIBRATION_WARNING_DAYS = 30;

export type CalibrationState = "overdue" | "due-soon" | "valid" | "not-dated" | "none";

/**
 * Overdue and due-soon are deliberately separate states, not two shades of the
 * same one. "Due soon" is a task for whoever books calibrations. "Overdue"
 * means the instrument's traceability has lapsed and results produced with it
 * are open to challenge — a different thing to act on, and a different urgency.
 */
export function calibrationState(item: Pick<Equipment, "validUntil">, today = new Date()): CalibrationState {
  const raw = item.validUntil?.trim();
  if (!raw) return "none";
  const due = parseValidUntil(raw);
  // "Në përdorimin tjetër" and "Para çdo përdorimi" are real entries on the
  // form: verified at next use, so there is no date to count down to.
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
 * The forms are written by hand in Albanian practice: 26.08.2025. ISO dates
 * are accepted too, since anything typed into the app will be one.
 */
export function parseValidUntil(value?: string): Date | undefined {
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

/** Sorts the register by what needs attention first, then by code. */
export function calibrationSortKey(item: Equipment, today = new Date()) {
  const due = parseValidUntil(item.validUntil);
  // No date sorts last: it is either an item that is not calibrated at all or
  // one verified at each use, and neither is a deadline.
  if (!due) return Number.MAX_SAFE_INTEGER;
  return daysUntil(due, today);
}

export function equipmentNeedsAttention(item: Equipment, today = new Date()) {
  const state = calibrationState(item, today);
  return state === "overdue" || state === "due-soon";
}
