/**
 * The short link a client is given for their summary: /a/K05-9f2c41a7
 *
 * Same shape and the same reasoning as a report's /r/ link. The client code is
 * there so the recipient can see it is theirs, and the token is what makes the
 * link private — without it, anyone could walk from one client's summary to the
 * next, which for a document listing another company's projects and volumes
 * would be worse than leaking a single test result.
 *
 * The lookup goes by token alone. The code in front of it is read back and has
 * to agree, but it is not what finds the record: a client can have many
 * summaries and only the token tells them apart.
 */
const CODE_PATTERN = /^([A-Za-z0-9]{1,12})-([0-9a-f]{6,16})$/;

export function newAnalysisToken() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

export function analysisShareCode(clientCode: string, token: string) {
  return `${clientCode.replace(/[^A-Za-z0-9]/g, "")}-${token}`;
}

export function parseAnalysisShareCode(code: string): { clientCode: string; token: string } | null {
  const match = CODE_PATTERN.exec(code.trim());
  if (!match) return null;
  return { clientCode: match[1].toUpperCase(), token: match[2].toLowerCase() };
}

export function analysisShareUrl(origin: string, clientCode: string, token: string) {
  return `${origin.replace(/\/$/, "")}/a/${analysisShareCode(clientCode, token)}`;
}
