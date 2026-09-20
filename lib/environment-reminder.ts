import { LAB_AREAS, isWorkingDay, readingState, toIsoDate, type EnvironmentReading } from "./environment";

/**
 * The 08:00 prompt to take the day's ambient readings, and the check that
 * yesterday's were taken.
 *
 * SL-PB-6.3 §5.2 puts the measurement before work starts, which is exactly the
 * moment nobody is at a screen. So the register asks rather than waits: the
 * email goes to whoever keeps it, and the two managers see the same thing
 * without having to open the app to find out it was missed.
 */
export type ReminderDigest = {
  /** The Tirana date the reminder is for. */
  date: string;
  /** Areas with no reading yet today. */
  outstanding: string[];
  /** Areas already recorded today, with their figures. */
  recorded: EnvironmentReading[];
  /** The working day before this one — Saturday, when today is Monday. */
  previousDate?: string;
  /** Areas that were never recorded on that day. */
  previousMissing: string[];
  /** Readings from that day that fell outside tolerance. */
  previousOutOfTolerance: EnvironmentReading[];
  subject: string;
};

/** The working day before `date`, skipping Sundays. */
export function previousWorkingDay(date: string) {
  const cursor = new Date(`${date}T00:00:00`);
  if (Number.isNaN(cursor.getTime())) return undefined;
  do {
    cursor.setDate(cursor.getDate() - 1);
  } while (!isWorkingDay(cursor));
  return toIsoDate(cursor);
}

export function buildReminderDigest(readings: EnvironmentReading[], date: string): ReminderDigest {
  const forDay = (day: string) => readings.filter((reading) => reading.date === day);

  const todays = forDay(date);
  const recordedCodes = new Set(todays.map((reading) => reading.areaCode));
  const outstanding = LAB_AREAS.filter((area) => !recordedCodes.has(area.code)).map((area) => area.code);

  const previousDate = previousWorkingDay(date);
  const previous = previousDate ? forDay(previousDate) : [];
  const previousCodes = new Set(previous.map((reading) => reading.areaCode));
  const previousMissing = previousDate
    ? LAB_AREAS.filter((area) => !previousCodes.has(area.code)).map((area) => area.code)
    : [];
  const previousOutOfTolerance = previous.filter((reading) => readingState(reading) === "out-of-tolerance");

  // The subject carries the exception, because that is what decides whether
  // this gets opened now or after lunch.
  const subject = previousMissing.length
    ? `Kushtet ambjentale — ${outstanding.length} matje sot, ${previousMissing.length} mungojnë nga ${formatDay(previousDate)}`
    : `Kushtet ambjentale — ${outstanding.length} matje për t'u kryer sot`;

  return { date, outstanding, recorded: todays, previousDate, previousMissing, previousOutOfTolerance, subject };
}

function formatDay(iso?: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function areaName(code: string) {
  return LAB_AREAS.find((area) => area.code === code)?.name ?? "";
}

export function reminderEmailHtml(digest: ReminderDigest, appUrl: string) {
  const list = (codes: string[]) =>
    codes
      .map(
        (code) =>
          `<li style="margin:2px 0;"><strong>${code}</strong> <span style="color:#6b7280;">${areaName(code)}</span></li>`
      )
      .join("");

  const missedBlock = digest.previousMissing.length
    ? `<div style="margin:16px 0;padding:12px 14px;border-left:4px solid #dc2626;background:#fef2f2;">
         <div style="font-weight:600;color:#7f1d1d;">Nuk u regjistruan më ${formatDay(digest.previousDate)}:</div>
         <ul style="margin:6px 0 0 18px;padding:0;color:#7f1d1d;">${list(digest.previousMissing)}</ul>
         <div style="margin-top:8px;font-size:12px;color:#7f1d1d;">
           Regjistrimi i munguar duhet plotësuar ose arsyetuar te shënimet e matjes më të afërt.
         </div>
       </div>`
    : `<div style="margin:16px 0;padding:12px 14px;border-left:4px solid #16a34a;background:#f0fdf4;color:#14532d;">
         Të gjitha ambjentet u regjistruan më ${formatDay(digest.previousDate)}.
       </div>`;

  const outOfToleranceBlock = digest.previousOutOfTolerance.length
    ? `<div style="margin:16px 0;padding:12px 14px;border-left:4px solid #dc2626;background:#fef2f2;color:#7f1d1d;">
         <div style="font-weight:600;">${digest.previousOutOfTolerance.length} matje jashtë tolerancës më ${formatDay(digest.previousDate)}:</div>
         <ul style="margin:6px 0 0 18px;padding:0;">
           ${digest.previousOutOfTolerance
             .map(
               (reading) =>
                 `<li><strong>${reading.areaCode}</strong> — ${reading.temperature ?? "—"} °C, ${reading.humidity ?? "—"} %</li>`
             )
             .join("")}
         </ul>
         <div style="margin-top:8px;font-size:12px;">
           SL-PB-6.3 §3.1.8: duhet vlerësuar nëse kanë ndikuar në rezultatet e testimeve të asaj dite.
         </div>
       </div>`
    : "";

  const todayBlock = digest.outstanding.length
    ? `<div style="font-weight:600;">Për t'u matur sot (${digest.outstanding.length}):</div>
       <ul style="margin:6px 0 0 18px;padding:0;">${list(digest.outstanding)}</ul>`
    : `<div style="color:#14532d;font-weight:600;">Të gjitha ambjentet janë matur tashmë sot.</div>`;

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;font-size:14px;color:#111827;">
      <p style="margin:0 0 4px;">Mirëmëngjes,</p>
      <p style="margin:0 0 16px;color:#6b7280;">
        Kujtesë për matjen e temperaturës dhe lagështisë relative para fillimit të punës — SL-PB-6.3 §5.2.
      </p>

      ${todayBlock}
      ${missedBlock}
      ${outOfToleranceBlock}

      <p style="margin:20px 0 0;">
        <a href="${appUrl}/quality/environment"
           style="display:inline-block;background:#5B193F;color:#ffffff;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;">
          Hap regjistrin
        </a>
      </p>

      <p style="margin-top:20px;font-size:12px;color:#6b7280;">
        Kufijtë: temperatura (20 – 25) ± 2 °C, lagështia relative (35 – 50) ± 5.<br />
        SL-RB-6.3.1 Regjistri i kushteve ambjentale.
      </p>
    </div>
  `;
}
