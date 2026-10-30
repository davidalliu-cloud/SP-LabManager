import { NextResponse } from "next/server";
import { SESSION_COOKIE, startSession, verifyCredentials } from "@/lib/portal/session";

export const dynamic = "force-dynamic";

/**
 * Sign-in for a client's own people. Posts from the form at /portal/login.
 *
 * A failure says only that the pair was wrong — not which half — and takes the
 * same path whether the address is unknown or the password is.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const origin = new URL(request.url).origin;

  const user = email && password ? await verifyCredentials(email, password) : null;
  if (!user) {
    return NextResponse.redirect(`${origin}/portal/login?gabim=1`, { status: 303 });
  }

  const { token, expires } = await startSession(user.id);
  const response = NextResponse.redirect(`${origin}/portal`, { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: origin.startsWith("https://"),
    sameSite: "lax",
    path: "/",
    expires
  });
  return response;
}
