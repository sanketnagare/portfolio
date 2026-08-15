import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * Guards the admin panel. Everything under /studio and /api/admin requires a
 * valid session cookie, with the login endpoints themselves excluded so there
 * is a way in.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/studio/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginApi) return NextResponse.next();

  const authed = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (isLoginPage) {
    // Already signed in? Skip the form.
    return authed
      ? NextResponse.redirect(new URL("/studio", request.url))
      : NextResponse.next();
  }

  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/studio/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/studio/:path*", "/api/admin/:path*"],
};
