import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { TEST_DETAIL_KEYS, type TestDetailTables } from "@/lib/test-result-summary";
import type { LabState } from "@/lib/types";

/**
 * The client portal's own sign-in, kept apart from the laboratory's.
 *
 * A client's engineer is not an employee and must not hold an account in the
 * lab's own authentication. The policies on `app_state` grant every
 * authenticated role select AND update on the whole register, and the staff app
 * loads that register into the browser on sign-in — so a Supabase account for
 * an outsider would let them read every other client's projects, volumes and
 * prices, and overwrite the lab's data. No arrangement of screens closes that;
 * it is a grant underneath the screens.
 *
 * So the portal has its own credential table, reachable only by the service
 * role, and its own session cookie. A portal visitor never holds a Supabase
 * session, never carries the publishable key, and never touches `app_state`
 * from the browser: every page here is rendered on the server, and the server
 * hands back one client's slice of the register and nothing else.
 */

const COOKIE = "sarp_portal";
const SESSION_HOURS = 12;
const STATE_ROW_ID = "shared-lab-state";

export type PortalUser = {
  id: string;
  email: string;
  clientId: string;
  fullName: string | null;
};

/** The service-role client. Every read in the portal goes through this. */
export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * Checks an email and password against the portal's own table.
 *
 * The comparison happens in Postgres, against a bcrypt hash: the plaintext is
 * never stored and never leaves the request. A wrong password and an unknown
 * address answer the same way, so the form cannot be used to learn which of a
 * client's people have access.
 */
export async function verifyCredentials(email: string, password: string): Promise<PortalUser | null> {
  const supabase = serviceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .rpc("client_portal_sign_in", { p_email: email.trim().toLowerCase(), p_password: password });
  if (error || !data || !data.length) return null;

  const row = data[0] as { id: string; email: string; client_id: string; full_name: string | null };
  return { id: row.id, email: row.email, clientId: row.client_id, fullName: row.full_name };
}

/** Opens a session and returns the cookie value to set. */
export async function startSession(userId: string) {
  const supabase = serviceClient();
  if (!supabase) throw new Error("Portal is not configured.");

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_HOURS * 3600_000);
  const { error } = await supabase
    .from("client_portal_sessions")
    .insert({ token, user_id: userId, expires_at: expires.toISOString() });
  if (error) throw new Error(error.message);

  await supabase.from("client_portal_users").update({ last_login_at: new Date().toISOString() }).eq("id", userId);
  return { token, expires };
}

export const SESSION_COOKIE = COOKIE;

/** Whoever is signed in on this request, or null. Expired sessions count as null. */
export async function currentPortalUser(): Promise<PortalUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const supabase = serviceClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("client_portal_sessions")
    .select("expires_at, client_portal_users(id, email, client_id, full_name, is_active)")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  // PostgREST gives a to-one join back as an object, but returns an array for
  // the same relationship in some versions. Taking either keeps a signed-in
  // client from being logged out by a client-library upgrade.
  type Joined = { id: string; email: string; client_id: string; full_name: string | null; is_active: boolean };
  const joined = data.client_portal_users as unknown as Joined | Joined[] | null;
  const user = Array.isArray(joined) ? joined[0] : joined;
  if (!user || !user.is_active) return null;

  return { id: user.id, email: user.email, clientId: user.client_id, fullName: user.full_name };
}

export async function endSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return;
  const supabase = serviceClient();
  if (!supabase) return;
  await supabase.from("client_portal_sessions").delete().eq("token", token);
}

/**
 * One client's slice of the register.
 *
 * The whole blob is read on the server — it is one row — and everything
 * belonging to anyone else is dropped before anything is rendered. What the
 * browser receives is already filtered; there is no fuller copy behind it to
 * ask for.
 */
export type ClientSlice = Pick<LabState, "clients" | "projects" | "samples" | "tests" | "reports" | "offers"> &
  TestDetailTables;

export async function readClientSlice(clientId: string): Promise<ClientSlice | null> {
  const supabase = serviceClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  if (error || !data?.state) return null;

  const state = data.state as Partial<LabState>;
  const client = (state.clients ?? []).find((row) => row.id === clientId);
  if (!client) return null;

  const samples = (state.samples ?? []).filter((row) => row.clientId === clientId);
  const sampleIds = new Set(samples.map((row) => row.id));
  const tests = (state.tests ?? []).filter((row) => row.clientId === clientId || sampleIds.has(row.sampleId));
  const testIds = new Set(tests.map((row) => row.id));

  // Every per-family result table, cut down to this client's own tests. The
  // portal shows the measured result beside each test, as the laboratory's own
  // client page does, and these are the rows those results are read from.
  const details = Object.fromEntries(
    TEST_DETAIL_KEYS.map((key) => [
      key,
      ((state[key] ?? []) as Array<{ testId?: string }>).filter((row) => row.testId && testIds.has(row.testId))
    ])
  ) as TestDetailTables;

  return {
    ...details,
    clients: [client],
    projects: (state.projects ?? []).filter((row) => row.clientId === clientId),
    samples,
    tests,
    reports: (state.reports ?? []).filter((row) => row.clientId === clientId || testIds.has(row.testId)),
    offers: (state.offers ?? []).filter((row) => row.clientId === clientId)
  };
}
