/**
 * Register search matching.
 *
 * Codes get written down by hand and typed back in a dozen ways: "BE-241",
 * "BE 241", "be/241". Raw substring matching treats those as three different
 * searches, so the sample the technician is holding does not come up.
 *
 * The rules here:
 *   - fold case and strip accents, so "Përmbledhje" is found by "perm";
 *   - collapse every separator to a single space, so "BE-241", "BE 241" and
 *     "be/241" all normalise to "be 241";
 *   - match each query token against the START of a haystack token, not
 *     anywhere inside it, so "be" finds "BE-241" but "e24" does not;
 *   - index a zero-stripped twin of every padded number, so "42" still finds
 *     "K-00042" - people quote the short form of a code constantly.
 *
 * These are the same semantics a Postgres trigram/tsvector search would give,
 * kept deliberately identical so the matching does not change when the query
 * eventually moves server-side.
 */

/** Lowercase, strip accents, collapse anything that is not a letter or digit
 *  into a single space. */
export function normaliseForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Query tokens, normalised. An empty query yields no tokens. */
export function tokeniseQuery(query: string): string[] {
  const normalised = normaliseForSearch(query);
  return normalised ? normalised.split(" ") : [];
}

/**
 * Build the searchable text for one row.
 *
 * Returns a space-delimited string with a leading and trailing space, so a
 * token-prefix test is a plain `includes(" " + token)` - no per-row splitting
 * on the hot path.
 */
export function buildHaystack(parts: Array<string | number | null | undefined>): string {
  const tokens: string[] = [];
  for (const part of parts) {
    if (part === null || part === undefined || part === "") continue;
    for (const token of normaliseForSearch(String(part)).split(" ")) {
      if (!token) continue;
      tokens.push(token);
      // "00042" is also findable as "42".
      if (/^0\d+$/.test(token)) {
        const stripped = token.replace(/^0+/, "");
        if (stripped && stripped !== token) tokens.push(stripped);
      }
    }
  }
  return tokens.length ? ` ${tokens.join(" ")} ` : " ";
}

/** True when every query token prefixes some token in the haystack. All tokens
 *  must match, so extra words narrow the result rather than widening it. */
export function matchesHaystack(haystack: string, queryTokens: string[]): boolean {
  for (const token of queryTokens) {
    if (!haystack.includes(` ${token}`)) return false;
  }
  return true;
}
