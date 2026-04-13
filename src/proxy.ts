import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @security-auditor: proxy.ts is a ROUTING boundary, NOT sole security.
 * Auth checks also happen in:
 * - tRPC context (protectedProcedure)
 * - Server Components (session check)
 * - Server Actions (auth verification)
 *
 * Next.js 16: middleware.ts → proxy.ts rename.
 * Export `proxy()` function, not `middleware()`.
 *
 * Supports two auth modes:
 * 1. Better Auth (production) — session_token cookie from Google OAuth
 * 2. Demo Auth (development) — cineforge-demo-session cookie for quick testing
 */

const PUBLIC_PATHS = ["/login", "/api/auth"];
const DEMO_COOKIE = "cineforge-demo-session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip proxy for public paths, static files, images
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check for any valid session:
  // 1. Better Auth production cookie
  const betterAuthSession =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  // 2. Demo session cookie (local dev / portfolio demo)
  const demoSession = request.cookies.get(DEMO_COOKIE);

  const isAuthenticated = !!betterAuthSession?.value || !!demoSession?.value;

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Root redirect — send authenticated users to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|png|svg|webp|gif|ico)$).*)",
  ],
};

