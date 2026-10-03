import "server-only";
import { BackendApiError, backendFetch } from "@/lib/backend-client";
import type { AuthResponse } from "@/types/weather";

/**
 * - `refreshed`: a new access+refresh pair.
 * - `rejected`: the backend refused the refresh token itself, so the session is over.
 * - `unavailable`: the backend couldn't answer (network error, timeout, waking up, 5xx, 429). The
 *   refresh token may still be perfectly valid, so the session must survive for a later retry.
 */
export type RefreshResult =
  | { status: "refreshed"; auth: AuthResponse }
  | { status: "rejected" }
  | { status: "unavailable" };

const DEFINITIVE_REFRESH_FAILURES = new Set([400, 401, 403]);

/** Exchanges a refresh token for a new access+refresh pair. Never throws. */
export async function refreshTokens(refreshToken: string): Promise<RefreshResult> {
  try {
    const auth = await backendFetch<AuthResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });
    return { status: "refreshed", auth };
  } catch (error) {
    if (error instanceof BackendApiError && DEFINITIVE_REFRESH_FAILURES.has(error.status)) {
      return { status: "rejected" };
    }
    return { status: "unavailable" };
  }
}
