/**
 * The short link a client is given for a report.
 *
 * WhatsApp shows a URL as the URL — there is no way to put a word over a link
 * the way an email can. So a tidy message needs a genuinely short address, and
 * one that says what it is:
 *
 *   before   https://nnvxkukvjospeukixlye.supabase.co/storage/v1/object/sign/
 *            reports/5926_26-1790084285?token=eyJhbGciOiJIUzI1NiIs…
 *   after    https://www.sarp-lab-manager.com/r/5926-26-9f2c41a7
 *
 * The report number is there because the client should be able to see which
 * report they are opening, and because it is the number they will quote back.
 *
 * The trailing token is what keeps the link private. Report numbers run in
 * sequence, so a link that were only /r/5926-26 would let anyone walk the whole
 * register a number at a time. The token is per report, so knowing one tells
 * you nothing about the next.
 */
const SHARE_CODE_PATTERN = /^(\d{1,6})-(\d{2})-([0-9a-f]{6,16})$/;

/** A fresh token for a report that has never been shared. */
export function newShareToken() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

/** "5926/26" + token -> "5926-26-9f2c41a7" */
export function reportShareCode(reportNumber: string, token: string) {
  return `${reportNumber.replace("/", "-")}-${token}`;
}

/** The other direction, for the route that has to find the report again. */
export function parseReportShareCode(code: string): { reportNumber: string; token: string } | null {
  const match = SHARE_CODE_PATTERN.exec(code.trim().toLowerCase());
  if (!match) return null;
  return { reportNumber: `${match[1]}/${match[2]}`, token: match[3] };
}

/** The full address to put in a message. */
export function reportShareUrl(origin: string, reportNumber: string, token: string) {
  return `${origin.replace(/\/$/, "")}/r/${reportShareCode(reportNumber, token)}`;
}
