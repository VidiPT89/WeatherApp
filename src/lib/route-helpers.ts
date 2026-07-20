import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie";
import { BackendApiError } from "@/lib/backend-client";
import { getRefreshToken, getToken } from "@/lib/session";
import { refreshTokens } from "@/lib/token-refresh";

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof BackendApiError) {
    return NextResponse.json({ message: error.message, errorCode: error.errorCode }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ message: "Unexpected error", errorCode: "INTERNAL_ERROR" }, { status: 500 });
}

/**
 * Runs `handler` with the current access token. If the backend rejects it as expired
 * (`UNAUTHENTICATED`), transparently refreshes once and retries before giving up — this is the
 * safety net for `/api/*` calls, which `proxy.ts`'s proactive refresh never reaches (its matcher
 * already lets `/api/*` requests through before any token logic runs).
 */
export async function withAuth(
  handler: (token: string) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    return await handler(token);
  } catch (error) {
    if (!(error instanceof BackendApiError) || error.errorCode !== "UNAUTHENTICATED") {
      return errorResponse(error);
    }

    const refreshToken = await getRefreshToken();
    const refreshed = refreshToken ? await refreshTokens(refreshToken) : null;
    if (!refreshed) {
      const response = errorResponse(error);
      clearAuthCookie(response);
      return response;
    }

    try {
      const response = await handler(refreshed.token);
      setAuthCookie(response, refreshed);
      return response;
    } catch (retryError) {
      return errorResponse(retryError);
    }
  }
}

export function searchParamsOf(request: NextRequest): URLSearchParams {
  return request.nextUrl.searchParams;
}
