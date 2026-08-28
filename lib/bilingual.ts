/**
 * Report labels are written as "Albanian / English" — usually. A handful are the
 * other way round ("Notes / Shënime", "Grade / Grada"), and plenty of slashes
 * are not language separators at all ("[kg/ml]", "05/A", "SL-RA-PT-7.8/1").
 *
 * House style for an issued report: Albanian upright, English italic. Deciding
 * which half is which by hand across ~250 labels invites getting one backwards
 * on an accredited document, so it is done here, once, and tested.
 */

/** Letters that only occur in the Albanian half. */
const ALBANIAN_LETTERS = /[ëçËÇ]/;

/** Albanian words with no English lookalike, for strings carrying no diacritic. */
const ALBANIAN_WORDS = new Set([
  "i", "e", "të", "së", "dhe", "në", "me", "për", "nga", "pa", "sipas", "mbi",
  "data", "datë", "kampioni", "kampionit", "klienti", "klientit", "objekti",
  "projekti", "testi", "testimi", "testimit", "rezultatet", "rezultati",
  "shënime", "raporti", "raport", "metoda", "vendi", "pesha", "masa", "mostra",
  "mostrës", "grada", "densiteti", "lagështia", "temperaturë", "fillimi",
  "mbarimi", "përfundimi", "periudha", "laboratori", "laboratorit", "testuesi",
  "miratoi", "përgatiti", "numri", "kodi", "tipi", "sasia", "njësi", "mesatare",
  "shtypje", "tërheqje", "përkulje", "zgjatimi", "forca", "sitat", "kalimi",
  // Added after checking the classifier against every label in the templates.
  "adresa", "elementi", "faqe", "gjendja", "gravimetri", "kontaktet", "kontakti",
  "ngjyra", "normale", "nr", "regjistri", "totali", "aparat", "analiza",
  "përcaktimi", "indeksit", "rezistenca", "parametri", "materialeve", "sektori"
]);

/** English words that would otherwise look ambiguous. */
const ENGLISH_WORDS = new Set([
  "the", "of", "and", "for", "by", "with", "test", "report", "sample", "client",
  "purchaser", "object", "project", "results", "result", "notes", "note",
  "method", "date", "grade", "mass", "weight", "density", "humidity",
  "temperature", "starting", "ending", "location", "laboratory", "strength",
  "tensile", "compressive", "flexural", "elongation", "sieves", "passing",
  "tested", "approved", "prepared", "number", "code", "type", "quantity", "unit",
  "address", "element", "page", "appearance", "gravimetry", "contact", "colour",
  "color", "normal", "no", "register", "total", "apparatus", "analysis",
  "determination", "index", "resistance", "parameter", "materials", "sector"
]);

function score(part: string) {
  if (ALBANIAN_LETTERS.test(part)) return { albanian: 3, english: 0 };
  let albanian = 0;
  let english = 0;
  for (const raw of part.toLowerCase().split(/[^a-zëç]+/)) {
    if (!raw) continue;
    if (ALBANIAN_WORDS.has(raw)) albanian += 1;
    if (ENGLISH_WORDS.has(raw)) english += 1;
  }
  return { albanian, english };
}

export type BilingualParts = {
  sq: string;
  en: string;
  /** True when the source string had English first, so the caller can keep the
   *  original word order while still italicising the English half. */
  englishFirst: boolean;
};

/**
 * Splits "A / B" into its Albanian and English halves.
 *
 * Returns undefined when the string is not a language pair at all — no " / "
 * separator (so "kg/ml" and "05/A" are untouched), or neither half reads as
 * one language more than the other.
 */
export function splitBilingual(text: string): BilingualParts | undefined {
  const separator = " / ";
  const index = text.indexOf(separator);
  if (index <= 0) return undefined;

  const first = text.slice(0, index).trim();
  const second = text.slice(index + separator.length).trim();
  if (!first || !second) return undefined;

  const a = score(first);
  const b = score(second);

  // Clear Albanian signal on one side decides it.
  if (a.albanian > b.albanian) return { sq: first, en: second, englishFirst: false };
  if (b.albanian > a.albanian) return { sq: second, en: first, englishFirst: true };

  // No Albanian signal either way: let the English signal decide.
  if (b.english > a.english) return { sq: first, en: second, englishFirst: false };
  if (a.english > b.english) return { sq: second, en: first, englishFirst: true };

  // Genuinely ambiguous - e.g. "Object / Project", where both halves are the
  // same in both languages. Leave it alone rather than guess.
  return undefined;
}
