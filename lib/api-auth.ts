import { createClient } from "@supabase/supabase-js";

/**
 * Who is calling a route, decided on the server.
 *
 * A route handler is reachable by anyone who knows its path, so a page that
 * hides its own button protects nothing: the check has to happen here, against
 * the bearer token the browser sends, and never against anything in the
 * request body.
 *
 * One copy of the token check, shared by every route that needs it, so a
 * second one cannot be the one that quietly stops verifying. What each route
 * then does with the email is its own decision — the allowlists live next to
 * the thing they guard, because sending a report and pricing an offer are
 * different permissions that happen to belong to the same two people today.
 */

export type Caller = { email: string };

/** The signed-in caller's email, lowercased, or why there isn't one. */
export async function signedInEmail(request: Request): Promise<Caller | { error: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { error: "Supabase is not configured." };

  const token = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Not signed in." };

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  const email = data?.user?.email?.trim().toLowerCase();
  if (error || !email) return { error: "Not signed in." };
  return { email };
}
