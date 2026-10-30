import { NextResponse } from "next/server";
import { SESSION_COOKIE, endSession } from "@/lib/portal/session";

export const dynamic = "force-dynamic";

/** Ends the session in the database as well as dropping the cookie, so a copied
 *  cookie stops working the moment someone signs out. */
export async function POST(request: Request) {
  await endSession();
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(`${origin}/portal/login`, { status: 303 });
  response.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", expires: new Date(0) });
  return response;
}
