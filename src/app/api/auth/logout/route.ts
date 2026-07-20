import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backend-client";
import { clearAuthCookie } from "@/lib/auth-cookie";
import { getRefreshToken } from "@/lib/session";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    await backendFetch("/api/v1/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => {
      // Best-effort: the cookies are cleared below regardless, so a stale refresh token
      // outliving a failed revocation call is not a security regression versus today.
    });
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response);
  return response;
}
