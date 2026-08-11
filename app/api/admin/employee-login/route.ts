import { NextResponse } from "next/server";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { LabState } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATE_ROW_ID = "shared-lab-state";

// A Supabase client with the service-role key — full admin, server-side only.
// Returns null if the key hasn't been configured yet.
function serviceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function findAuthUserByEmail(admin: SupabaseClient, email: string): Promise<User | null> {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return null;
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < 200) break;
  }
  return null;
}

// Create or reset an employee's login. Requires the caller to be a signed-in
// Admin / Managing Director (verified from their Supabase session token + role
// in app_state). The password is chosen by the admin and handed to Supabase Auth,
// which stores it hashed; the app never stores it.
export async function POST(request: Request) {
  const admin = serviceClient();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Shërbimi nuk është konfiguruar (mungon SUPABASE_SERVICE_ROLE_KEY)." }, { status: 500 });
  }

  // 1) Verify the caller's session.
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return NextResponse.json({ ok: false, error: "Nuk jeni i identifikuar." }, { status: 401 });
  const { data: caller, error: callerError } = await admin.auth.getUser(token);
  const callerEmail = caller.user?.email?.toLowerCase();
  if (callerError || !callerEmail) {
    return NextResponse.json({ ok: false, error: "Sesion i pavlefshëm." }, { status: 401 });
  }

  // 2) Confirm the caller is the super-admin, from app_state.
  const { data: stateRow } = await admin.from("app_state").select("state").eq("id", STATE_ROW_ID).maybeSingle();
  const users = (stateRow?.state as Partial<LabState> | undefined)?.users ?? [];
  const callerUser = users.find((user) => user.email?.toLowerCase() === callerEmail);
  if (!callerUser || callerUser.role !== "Admin / Managing Director") {
    return NextResponse.json({ ok: false, error: "Vetëm Admin / Drejtor Menaxhues mund të menaxhojë kredencialet e hyrjes." }, { status: 403 });
  }

  // 3) Validate input.
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email) return NextResponse.json({ ok: false, error: "Email-i mungon." }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ ok: false, error: "Fjalëkalimi duhet të ketë të paktën 8 karaktere." }, { status: 400 });
  }

  // 4) Create the login; if it already exists, update its password instead.
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (!created.error) {
    return NextResponse.json({ ok: true, action: "created" });
  }

  const existing = await findAuthUserByEmail(admin, email);
  if (!existing) {
    return NextResponse.json({ ok: false, error: created.error.message }, { status: 400 });
  }
  const updated = await admin.auth.admin.updateUserById(existing.id, { password });
  if (updated.error) {
    return NextResponse.json({ ok: false, error: updated.error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, action: "updated" });
}
