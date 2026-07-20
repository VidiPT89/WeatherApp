import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_MAX_AGE_SECONDS, REFRESH_COOKIE_NAME } from "@/lib/constants";
import type { AuthResponse } from "@/types/weather";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}

export function setAuthCookie(response: NextResponse, auth: AuthResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, auth.token, cookieOptions(auth.expiresInSeconds));
  response.cookies.set(REFRESH_COOKIE_NAME, auth.refreshToken, cookieOptions(REFRESH_COOKIE_MAX_AGE_SECONDS));
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", cookieOptions(0));
  response.cookies.set(REFRESH_COOKIE_NAME, "", cookieOptions(0));
}
