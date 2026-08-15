import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabase } from "@/lib/supabase";
import { SESSION_COOKIE, signSession, sessionCookieOptions } from "@/lib/session";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash || !process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 500 });
  }

  // Next runs .env values through dotenv-expand, which silently eats the "$"
  // separators in a bcrypt hash and turns every login into "Incorrect
  // password". Fail loudly instead. (In .env.local write \$; on Vercel, where
  // there is no expansion, paste the hash raw.)
  if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(passwordHash)) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD_HASH is not a valid bcrypt hash. In .env.local, escape each $ as \\$.",
      },
      { status: 500 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  const supabase = getSupabase();
  const ip = clientIp(request);
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count } = await supabase
    .from("login_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("attempted_at", windowStart);

  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${WINDOW_MINUTES} minutes.` },
      { status: 429 }
    );
  }

  const valid = await bcrypt.compare(password, passwordHash);

  if (!valid) {
    await supabase.from("login_attempts").insert({ ip });
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // Successful login clears the failure history for this address.
  await supabase.from("login_attempts").delete().eq("ip", ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await signSession(), sessionCookieOptions);
  return response;
}
