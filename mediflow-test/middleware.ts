import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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
    // In production Firebase auth (Step 21/22), client-side auth context handles guard redirects,
    // while middleware allows pass-through with header signals.
    const response = NextResponse.next();
    response.headers.set("x-mediflow-protected", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
