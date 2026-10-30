import { redirect } from "next/navigation";
import { currentPortalUser } from "@/lib/portal/session";

export const dynamic = "force-dynamic";

export const metadata = { title: "Portali i klientit — SARP & LAB" };

export default async function PortalLoginPage({
  searchParams
}: {
  searchParams: Promise<{ gabim?: string }>;
}) {
  if (await currentPortalUser()) redirect("/portal");
  const { gabim } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-lab-mist px-6 py-10">
      <div className="w-full max-w-sm rounded-lg border border-line bg-white p-6 shadow-sm">
        <img src="/brand/sarp-logo.png" alt="SARP" className="mx-auto h-auto w-36" />
        <h1 className="mt-5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-lab-burgundy">
          Portali i klientit
        </h1>
        <p className="mt-1 text-center text-xs leading-5 text-muted">
          Hyrje vetëm për klientët e laboratorit / Client access only
        </p>

        {gabim ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800">
            Email-i ose fjalëkalimi nuk është i saktë. / Wrong email or password.
          </p>
        ) : null}

        <form method="post" action="/api/portal/login" className="mt-5 space-y-3">
          <div>
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="field mt-1 w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-muted">
              Fjalëkalimi / Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="field mt-1 w-full"
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Hyr / Sign in
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] leading-5 text-muted">
          SARP &amp; LAB sh.p.k. · Durrës · ISO/IEC 17025
        </p>
      </div>
    </main>
  );
}
