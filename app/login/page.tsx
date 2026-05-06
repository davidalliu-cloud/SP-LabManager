"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (auth.user) router.replace("/");
  }, [auth.user, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await auth.signIn(email.trim(), password);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F3F7F3] px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-white shadow-sm md:grid-cols-[1fr_420px]">
        <div className="hidden bg-lab-burgundy p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-52 brightness-0 invert" />
            <h1 className="mt-10 text-3xl font-semibold tracking-normal">Sistemi i Menaxhimit SARP LAB</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
              Hyrje e sigurt për regjistrimin e kampionëve, ndjekjen e testeve, miratimin e raporteve dhe kontrollin e dokumenteve laboratorike.
            </p>
          </div>
          <div className="text-xs text-white/70">Hapësira e punës për laboratorin e materialeve të ndërtimit</div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="md:hidden">
            <img src="/brand/sarp-logo.png" alt="SARP" className="h-auto w-36" />
          </div>
          <h2 className="mt-8 text-2xl font-semibold text-ink md:mt-0">Hyr në sistem</h2>
          <p className="mt-2 text-sm text-muted">Përdorni llogarinë që është krijuar nga administratori i laboratorit.</p>

          {!auth.isConfigured ? (
            <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Konfigurimi i Supabase nuk është vendosur ende.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm text-ink outline-none transition focus:border-lab-burgundy focus:ring-2 focus:ring-lab-burgundy/15"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-ink">Fjalëkalimi</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm text-ink outline-none transition focus:border-lab-burgundy focus:ring-2 focus:ring-lab-burgundy/15"
              />
            </label>

            {error ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

            <button
              type="submit"
              disabled={isSubmitting || !auth.isConfigured}
              className="w-full rounded-md bg-lab-burgundy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4F1535] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Duke hyrë..." : "Hyr"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
