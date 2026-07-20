import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { setAuthCookie } from "@/lib/auth-cookie";
import { refreshTokens } from "@/lib/token-refresh";

const PUBLIC_EXACT_PATHS = ["/"];
const PUBLIC_PREFIX_PATHS = ["/login", "/register"];
const NEAR_EXPIRY_THRESHOLD_SECONDS = 5 * 60;

/**
 * Reads the `exp` claim without verifying the signature — this is only a hint for whether to
 * proactively refresh. The backend still verifies every real request; a forged/expired token
 * that slips past this check simply results in a real 401, handled by `withAuth`'s retry.
 */
function decodeExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const claims = JSON.parse(json) as { exp?: number };
    return typeof claims.exp === "number" ? claims.exp : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    PUBLIC_EXACT_PATHS.includes(pathname) ||
    PUBLIC_PREFIX_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const expiry = decodeExpiry(token);
  const nowSeconds = Date.now() / 1000;
  const isNearExpiry = expiry !== null && expiry - nowSeconds < NEAR_EXPIRY_THRESHOLD_SECONDS;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (isNearExpiry && refreshToken) {
    const refreshed = await refreshTokens(refreshToken);
    if (refreshed) {
      request.cookies.set(AUTH_COOKIE_NAME, refreshed.token);
      const response = NextResponse.next({ request });
      setAuthCookie(response, refreshed);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|screenshots/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)"],
};
