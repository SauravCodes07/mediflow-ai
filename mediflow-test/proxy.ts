import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths allowed without authentication
  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/api/");

  // Controlled test auth check: reads cookie `mediflow_session` if present
  const sessionToken = request.cookies.get("mediflow_session")?.value;

  // If trying to access protected dashboard route without session
  if (!isPublicPath && !sessionToken) {
    const response = NextResponse.next();
    response.headers.set("x-mediflow-protected", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
