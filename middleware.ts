import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// ============================================
// SECURITY HEADERS
// ============================================
const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  "X-Frame-Options": "DENY",
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Enable XSS protection (legacy browsers)
  "X-XSS-Protection": "1; mode=block",
  // Referrer policy for privacy
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Permissions policy
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

// ============================================
// COMING SOON MODE - REDIRECT ALL TRAFFIC
// ============================================
const COMING_SOON_MODE = process.env.COMING_SOON_MODE === "true";

/**
 * Apply security headers to response
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In coming soon mode, redirect everything except the coming-soon page itself
  if (COMING_SOON_MODE) {
    // Allow access to the coming-soon page and static assets
    if (
      pathname === "/coming-soon" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/favicon") ||
      pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|css|js)$/)
    ) {
      return applySecurityHeaders(NextResponse.next());
    }

    // Redirect everything else to coming-soon
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/coming-soon", request.url)),
    );
  }

  // ============================================
  // URL REDIRECTS - Legacy routes → Clean unified IA
  // ============================================

  // Legacy profile route → Dashboard
  if (pathname === "/profile") {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/dashboard", request.url), 301),
    );
  }

  // Legacy public gallery → Auth-only discover
  if (pathname === "/gallery" || pathname.startsWith("/gallery/")) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/dashboard/discover", request.url), 301),
    );
  }

  // Legacy projects list → Discover
  if (pathname === "/projects") {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/dashboard/discover", request.url), 301),
    );
  }

  // Legacy /workspace/[code] → Unified editor (/edit/[code])
  // Note: /workspace/new is preserved as a valid creation flow
  if (
    pathname.startsWith("/workspace/") &&
    !pathname.startsWith("/workspace/new")
  ) {
    const code = pathname.split("/")[2];
    if (code) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`/edit/${code}`, request.url), 301),
      );
    }
  }

  // Legacy /showcase/[code] → Unified editor (/edit/[code])
  // Note: /showcase/new is preserved as a valid creation flow
  if (
    pathname.startsWith("/showcase/") &&
    !pathname.startsWith("/showcase/new")
  ) {
    const code = pathname.split("/")[2];
    if (code) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`/edit/${code}`, request.url), 301),
      );
    }
  }

  // Legacy /project/[code] → Unified editor (/edit/[code])
  if (
    pathname.startsWith("/project/") &&
    !pathname.startsWith("/project/new")
  ) {
    const parts = pathname.split("/");
    const code = parts[2];
    if (code) {
      return applySecurityHeaders(
        NextResponse.redirect(new URL(`/edit/${code}`, request.url), 301),
      );
    }
  }

  // ============================================
  // NORMAL AUTH MIDDLEWARE (disabled when COMING_SOON_MODE = true)
  // ============================================
  const PROTECTED_PATHS = [
    "/dashboard", // Unified authenticated hub
    "/edit", // Unified project editor
    "/workspace", // Creation flow + legacy redirects
    "/showcase", // Creation flow + legacy redirects
    "/project", // Legacy redirects only
    "/mentor", // Deferred to '26
    "/groups", // Deferred to '26
  ] as const;

  // Standard Firebase auth cookie (preferred)
  const PRIMARY_AUTH_COOKIE = "__session";
  // Legacy cookies for backward compatibility (to be phased out)
  const LEGACY_AUTH_COOKIES = ["buffalo-auth", "buffalo-auth-token"];

  // Auth guard disabled by default - Firebase Client SDK + Firestore rules provide security
  // Enable only if you have implemented session cookie mechanism via API route
  const guardEnabled = process.env.AUTH_MIDDLEWARE_ENABLED === "true" && false;

  const isProtectedPath = (pathname: string): boolean => {
    return PROTECTED_PATHS.some((prefix) => pathname.startsWith(prefix));
  };

  /**
   * Check for valid authentication cookie
   *
   * SECURITY NOTE: This only checks cookie existence and basic format.
   * Full JWT verification is handled by Firebase Admin SDK in API routes.
   * Firestore security rules provide the actual authorization layer.
   *
   * This middleware serves as:
   * 1. User experience improvement (redirect to signin)
   * 2. First line of defense (prevents trivial bypasses)
   * 3. Not a security boundary (Firestore rules are)
   */
  const hasAuthCookie = (request: NextRequest): boolean => {
    // Check primary auth cookie first
    const primaryCookie = request.cookies.get(PRIMARY_AUTH_COOKIE)?.value;
    if (primaryCookie && primaryCookie.length > 20) {
      // Basic length check to filter out invalid tokens
      return true;
    }

    // Fall back to legacy cookies for backward compatibility
    for (const name of LEGACY_AUTH_COOKIES) {
      const value = request.cookies.get(name)?.value;
      if (value && value.length > 20) {
        return true;
      }
    }

    return false;
  };

  if (!guardEnabled) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (!isProtectedPath(pathname)) {
    return applySecurityHeaders(NextResponse.next());
  }

  if (hasAuthCookie(request)) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Allow access to locally created projects when present in cookie
  // Cookie is managed by LocalWorkspaceService on the client
  // Format: bp_local_projects=BUF-ABCD|BUF-EFGH
  try {
    if (pathname.startsWith("/project/")) {
      const parts = pathname.split("/");
      const code = parts[2] || "";
      // Validate project code format to prevent injection attacks
      if (code && /^(BUF-[A-Z0-9]{4,8})$/.test(code)) {
        const cookieValue =
          request.cookies.get("bp_local_projects")?.value || "";
        // Sanitize cookie value to prevent injection
        const codes = cookieValue
          .split("|")
          .map((s) => s.trim())
          .filter((s) => /^BUF-[A-Z0-9]{4,8}$/.test(s)); // Validate each code
        if (codes.includes(code)) {
          return applySecurityHeaders(NextResponse.next());
        }
      }
    }
  } catch {
    // fallthrough to redirect on any error
  }

  // Redirect to signin with original path for post-auth redirect
  const redirectUrl = new URL("/signin", request.url);
  const originalPath = `${pathname}${request.nextUrl.search}`;
  redirectUrl.searchParams.set("redirect", originalPath);
  redirectUrl.searchParams.set("source", "middleware");

  return applySecurityHeaders(NextResponse.redirect(redirectUrl));
}

export const config = {
  matcher: [
    // Match all routes when in coming soon mode
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
