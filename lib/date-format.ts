/**
 * A full ISO date, either alone or at the head of an ISO timestamp.
 *
 * The end anchor matters. Without it this matched a prefix, and a sample code
 * is shaped exactly like a date with one digit too many: "2026-08-035" matched
 * "2026-08-03", so every report that put a register number through here printed
 * it as 03/08/2026, and "2026-08-001" printed as 00/08/2026 — a day that does
 * not exist. Concrete cube reports escaped it only because ConcreteCubeMeta
 * renders its value without formatting.
 */
const isoDatePattern = /^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/;

export function formatEuropeanDate(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "-";
  const text = String(value);
  if (!isoDatePattern.test(text)) return text;

  const [year, month, day] = text.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function formatEuropeanDateRange(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "-";
  return String(value)
    .split(" / ")
    .map((part) => formatEuropeanDate(part))
    .join(" / ");
}
