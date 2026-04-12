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
 * DEV MODE: When no .env is configured (no GOOGLE_CLIENT_ID),
 * auth is bypassed to allow local development/preview.
 */

const PUBLIC_PATHS = ["/login", "/api/auth"];

/**
 * In dev mode without OAuth credentials, skip auth entirely
 * so the dashboard/studio can be previewed.
 */
const isDev = process.env.NODE_ENV === "development";
const hasOAuthCreds = !!process.env.GOOGLE_CLIENT_ID;

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

  // DEV BYPASS: Skip auth when no OAuth is configured
  if (isDev && !hasOAuthCreds) {
    // Redirect root to dashboard for convenience
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check for session cookie (Better Auth uses 'better-auth.session_token')
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ??
    request.cookies.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Root redirect — send authenticated users to studio
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/studio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
