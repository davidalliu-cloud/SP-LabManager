/**
 * Client and project names as they should read on screen.
 *
 * The register is typed in capitals — that is how it arrives from FutureERP
 * and how it is written on the clients' own paperwork. A hundred and fifty
 * lines of capitals is hard to read down, so the screens title-case them. The
 * stored record is never touched: this is a presentation rule, not a migration.
 *
 * The capitals are the easy half. The hard half is knowing what NOT to change,
 * because the register is full of things that are not words — SHPK, RHL, DPA,
 * XH&M, 3XH, F&D, L.L.C, BALFIN (RHL). A token is therefore left exactly as it
 * was written when:
 *
 *   - it contains a digit            3XH, 2M, 2014, O2
 *   - it has no vowel at all         SHPK, RHL, XH, NG
 *   - it is a single letter          the E and D of E&E and F&D
 *   - it is on the list below        the acronyms that do contain vowels and
 *                                    would otherwise read as "Dpa" or "Ebg"
 *
 * Everything else gets a capital and then lower case, with the Albanian and
 * English joining words left small unless they start the name.
 */

/** Albanian vowels, including ë. Anything without one of these is not a word. */
const VOWELS = /[aeiouyëáéíóú]/i;

/**
 * Acronyms and names that do contain vowels, so the rules above would not
 * catch them. Add to this when a name comes out looking wrong — it is the one
 * place that needs editing.
 */
const KEEP_AS_WRITTEN = new Set([
  "SARP", "LAB", "SHPK", "SH.P.K", "LLC", "L.L.C", "NIPT",
  "DPA", "EBG", "ASR", "AB", "ALB", "NG", "GPG", "BOE", "RHL",
  "XPS", "EPS", "UPS", "ISO", "BS", "EN", "AL", "BE", "MK", "QTU"
]);

/**
 * Joining words that stay lower case unless they open the name. Albanian
 * first, then the English ones that turn up in company names.
 */
const SMALL_WORDS = new Set([
  "dhe", "me", "në", "ne", "të", "te", "për", "per", "nga", "së", "se", "mbi", "nën", "nen", "e", "i",
  "and", "of", "the", "for", "at", "in", "on", "de", "di", "da"
]);

/** One word, capitalised: first letter up, the rest down. */
function capitalise(word: string) {
  return word.charAt(0).toLocaleUpperCase("sq-AL") + word.slice(1).toLocaleLowerCase("sq-AL");
}

/**
 * @param isFirst   this is the first word of the name
 * @param freeWord  the token stands on its own between spaces, rather than
 *                  being welded to its neighbours by punctuation. The "E" of
 *                  "E Shqiperise" is a joining word; the two in "E&E" are a
 *                  company's initials, and the only thing telling them apart
 *                  is the space.
 */
function convertToken(token: string, isFirst: boolean, freeWord: boolean) {
  if (!token) return token;
  if (/\d/.test(token)) return token;

  const lower = token.toLocaleLowerCase("sq-AL");
  if (freeWord && !isFirst && SMALL_WORDS.has(lower)) return lower;

  // Single letters are left exactly as written: the initials of E&E and F&D
  // are already capitals, and the "p" and "k" of a lower-case "sh.p.k" should
  // not be promoted to match them.
  if (token.length === 1) return token;
  if (!VOWELS.test(token)) return token;
  if (KEEP_AS_WRITTEN.has(token.toLocaleUpperCase("sq-AL"))) return token.toLocaleUpperCase("sq-AL");

  return capitalise(token);
}

/**
 * Title-case a name for display, preserving every separator exactly as it was
 * — spaces, dots, hyphens, ampersands, slashes, brackets and quotes all stay
 * where they were, so "BALFIN (RHL)" keeps its brackets and "AL-ASFALT" its
 * hyphen. Returns the input untouched when there is nothing to work on.
 */
export function properName(value?: string | null): string {
  if (!value) return value ?? "";
  const trimmed = value.trim();
  if (!trimmed) return "";

  // Is this shouting? Judged on the letters alone, so a name that is capitals
  // apart from a trailing "shpk" still counts, while one somebody has typed
  // out properly — "SARP & LAB Shpk", "Wild hotel" — does not, and is left as
  // they wrote it bar the opening capital.
  const letters = trimmed.match(/\p{L}/gu) ?? [];
  const upper = letters.filter(
    (letter) => letter === letter.toLocaleUpperCase("sq-AL") && letter !== letter.toLocaleLowerCase("sq-AL")
  ).length;
  const shouting = letters.length > 0 && upper / letters.length >= 0.8;

  if (!shouting) {
    // Nothing to tidy but the opening letter, which is all "objekt i ri" needs
    // to read as "Objekt i ri".
    const at = trimmed.search(/\p{L}/u);
    if (at < 0) return trimmed;
    return trimmed.slice(0, at) + trimmed.charAt(at).toLocaleUpperCase("sq-AL") + trimmed.slice(at + 1);
  }

  let seenWord = false;
  // Split into word tokens and the separators between them, keeping both, so
  // every bracket, dot, hyphen and ampersand lands back where it started.
  const parts = trimmed.split(/([^\p{L}\p{N}]+)/u);
  return parts
    .map((part, index) => {
      if (!part) return part;
      if (/^[^\p{L}\p{N}]+$/u.test(part)) return part;
      const before = index === 0 ? " " : parts[index - 1];
      const after = index === parts.length - 1 ? " " : parts[index + 1];
      const freeWord = /\s/.test(before) && /\s/.test(after);
      const converted = convertToken(part, !seenWord, freeWord);
      seenWord = true;
      return converted;
    })
    .join("");
}
