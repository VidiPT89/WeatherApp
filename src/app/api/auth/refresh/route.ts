import { NextResponse } from "next/server";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie";
import { getRefreshToken } from "@/lib/session";
import { refreshTokens } from "@/lib/token-refresh";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const refreshed = await refreshTokens(refreshToken);
  if (refreshed.status === "unavailable") {
    return NextResponse.json(
      { message: "The server could not be reached. Please try again.", errorCode: "SERVICE_UNAVAILABLE" },
      { status: 503 }
    );
  }
  if (refreshed.status === "rejected") {
    const response = NextResponse.json({ message: "Refresh token invalid or expired" }, { status: 401 });
    clearAuthCookie(response);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  setAuthCookie(response, refreshed.auth);
  return response;
}
