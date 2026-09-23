/**
 * Turning the phone numbers on a client card into something WhatsApp accepts.
 *
 * The register holds them as they were written down — 0672022609, 069 20 22 609,
 * +355 67 202 2609, 00355672022609 — because that is how a client says a number
 * and how it arrives on a delivery note. WhatsApp wants one shape: digits only,
 * country code first, no leading zero and no plus.
 *
 * Albania is +355. A mobile is written locally as 06x xxx xxxx: ten digits
 * beginning 06. Dropping that first zero and putting 355 in front of it is the
 * whole conversion, and the rest of this file is recognising which of the forms
 * above we were handed.
 *
 * Landlines are deliberately not converted. 04 is a Tirana landline, and
 * sending a WhatsApp message to a number that cannot receive one is a silent
 * failure that looks exactly like a successful send.
 */
const ALBANIA_COUNTRY_CODE = "355";

/** Albanian mobile prefixes, as dialled locally without the leading zero. */
const ALBANIAN_MOBILE_PREFIXES = ["66", "67", "68", "69"];

export type PhoneParseResult =
  | { ok: true; e164: string; national: string }
  | { ok: false; reason: "empty" | "not-a-mobile" | "unrecognised" };

/**
 * Reads one stored phone number and returns it in the form WhatsApp wants.
 *
 * Returns a reason rather than throwing, because the caller's job is to explain
 * to whoever is looking at the screen why the button is not available.
 */
export function toWhatsAppNumber(raw: string | undefined | null): PhoneParseResult {
  // Strip the labels the register carries alongside the number — "Mob.:",
  // "Tel.:" — and anything else that is not a digit or a plus. A card holding
  // an email address in the phone field simply comes out empty.
  const digits = (raw ?? "").replace(/[^\d+]/g, "");
  if (!digits) return { ok: false, reason: "empty" };

  let rest = digits;
  const wasWrittenInternationally = rest.startsWith("+") || rest.startsWith("00");
  // +355…, 00355… and a bare 355… are all the country code written three ways.
  if (rest.startsWith("+")) rest = rest.slice(1);
  if (rest.startsWith("00")) rest = rest.slice(2);

  // A number someone wrote with a country code that is not Albania's is a
  // foreign number — Kosovo (+383) is a routine one here — and we are in no
  // position to know that country's mobile ranges. Take it as given; WhatsApp
  // will say soon enough if nobody is there.
  if (wasWrittenInternationally && !rest.startsWith(ALBANIA_COUNTRY_CODE)) {
    if (!/^\d{7,15}$/.test(rest)) return { ok: false, reason: "unrecognised" };
    return { ok: true, e164: rest, national: `+${rest}` };
  }

  if (rest.startsWith(ALBANIA_COUNTRY_CODE)) rest = rest.slice(ALBANIA_COUNTRY_CODE.length);
  // What is left should be the national number. Locally it carries a leading 0.
  if (rest.startsWith("0")) rest = rest.slice(1);

  if (!/^\d+$/.test(rest)) return { ok: false, reason: "unrecognised" };

  const prefix = rest.slice(0, 2);
  if (!ALBANIAN_MOBILE_PREFIXES.includes(prefix)) return { ok: false, reason: "not-a-mobile" };
  // An Albanian mobile is nine digits once the leading zero is gone.
  if (rest.length !== 9) return { ok: false, reason: "unrecognised" };

  return {
    ok: true,
    e164: `${ALBANIA_COUNTRY_CODE}${rest}`,
    national: `0${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`
  };
}

/** How the number should read on screen: +355 67 202 2609. */
export function formatInternational(e164: string) {
  const rest = e164.startsWith(ALBANIA_COUNTRY_CODE) ? e164.slice(ALBANIA_COUNTRY_CODE.length) : e164;
  return `+${ALBANIA_COUNTRY_CODE} ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
}

/**
 * The click-to-chat link. Opening it hands the message to whichever WhatsApp
 * the sender already uses — phone, desktop or web — with the recipient and the
 * text filled in, and leaves the send itself to them.
 */
export function whatsAppLink(e164: string, message: string) {
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}
