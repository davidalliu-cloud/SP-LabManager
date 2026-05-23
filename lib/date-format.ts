const isoDatePattern = /^\d{4}-\d{2}-\d{2}/;

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
