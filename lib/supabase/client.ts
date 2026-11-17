import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The one Supabase client this browser uses.
 *
 * It used to build a fresh one on every call - twenty-odd call sites, and
 * lib/activity-log.ts alone makes one per flush of the audit trail. Each client
 * brings its own auth client, its own refresh timer and its own reading of the
 * single sign-in token in local storage, and they all share that one token
 * between them.
 *
 * On 17 November nine audit entries were refused by the database as anonymous
 * writes - "new row violates row-level security policy" - while the app had the
 * Chief of Lab signed in and working: a client had read the token at the moment
 * another was rewriting it, and sent the request with nothing attached. One
 * client, one token, one refresh, and that race has nowhere to happen.
 */
let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  // Never keep one on the server: there is no local storage to sign anyone in
  // with, and a module-level client there would be shared between requests -
  // which is to say between people.
  if (typeof window === "undefined") return createClient(url, anonKey);

  if (!browserClient) browserClient = createClient(url, anonKey);
  return browserClient;
}
