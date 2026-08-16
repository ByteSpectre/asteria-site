import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "asteria_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/api/admin")) {
    if (!hasSession) {
      return NextResponse.json(
        { error: "Требуется вход в панель управления" },
        { status: 401 },
      );
    }
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !hasSession
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
