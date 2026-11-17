"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAuthRetryableFetchError, type User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "./supabase/client";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isConfigured = hasSupabaseConfig();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(isConfigured);

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    let isCancelled = false;

    /**
     * Who is signed in - without mistaking a bad connection for nobody.
     *
     * getUser() asks the server, and supabase-js answers a network failure
     * exactly as it answers "no one is signed in": { user: null }. The shell
     * reads that and sends the person to the login page. On 17 November it did
     * that to the Chief of Lab six times in twenty-four minutes while her
     * session - which Supabase had never touched, and which is still alive -
     * sat in this browser the whole time.
     *
     * So when the question cannot be put to Supabase, fall back to the session
     * the browser already holds rather than throwing her out. A real answer
     * still decides it: a session that is genuinely gone signs her out as before.
     */
    async function resolveUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error) return data.user ?? null;
      if (!isAuthRetryableFetchError(error)) return null;
      const { data: stored } = await supabase.auth.getSession();
      return stored.session?.user ?? null;
    }

    resolveUser()
      .catch(() => null)
      .then((resolved) => {
        if (isCancelled) return;
        setUser(resolved);
        setIsLoading(false);
      });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isConfigured,
      async signIn(email, password) {
        if (!isConfigured) return { error: "Supabase is not configured." };

        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      async signOut() {
        if (!isConfigured) return;
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
    }),
    [isConfigured, isLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

