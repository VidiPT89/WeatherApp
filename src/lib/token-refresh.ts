import "server-only";
import { backendFetch } from "@/lib/backend-client";
import type { AuthResponse } from "@/types/weather";

/**
 * Exchanges a refresh token for a new access+refresh pair. Never throws — refreshing is always
 * a best-effort optimization on top of the existing "re-login on 401" fallback, so any failure
 * (invalid/expired/revoked token, network error) just means the caller proceeds without it.
 */
export async function refreshTokens(refreshToken: string): Promise<AuthResponse | null> {
  try {
    return await backendFetch<AuthResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
  } catch {
    return null;
  }
}
