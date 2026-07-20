// @vitest-environment node
import { NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BackendApiError } from "@/lib/backend-client";
import { withAuth } from "@/lib/route-helpers";
import { getRefreshToken, getToken } from "@/lib/session";
import { refreshTokens } from "@/lib/token-refresh";

vi.mock("@/lib/session", () => ({
  getToken: vi.fn(),
  getRefreshToken: vi.fn(),
}));

vi.mock("@/lib/token-refresh", () => ({
  refreshTokens: vi.fn(),
}));

describe("withAuth", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns 401 without calling the handler when there is no access token", async () => {
    vi.mocked(getToken).mockResolvedValue(undefined);
    const handler = vi.fn();

    const response = await withAuth(handler);

    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it("returns the handler's response on success", async () => {
    vi.mocked(getToken).mockResolvedValue("valid-token");
    const handler = vi.fn().mockResolvedValue(NextResponse.json({ ok: true }));

    const response = await withAuth(handler);

    expect(response.status).toBe(200);
    expect(handler).toHaveBeenCalledWith("valid-token");
  });

  it("passes through non-auth errors unchanged", async () => {
    vi.mocked(getToken).mockResolvedValue("valid-token");
    const handler = vi.fn().mockRejectedValue(new BackendApiError(404, "City not found", "CITY_NOT_FOUND"));

    const response = await withAuth(handler);

    expect(response.status).toBe(404);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it("refreshes and retries once when the handler reports an expired access token", async () => {
    vi.mocked(getToken).mockResolvedValue("expired-token");
    vi.mocked(getRefreshToken).mockResolvedValue("valid-refresh-token");
    vi.mocked(refreshTokens).mockResolvedValue({
      token: "new-token",
      tokenType: "Bearer",
      expiresInSeconds: 3600,
      refreshToken: "new-refresh-token",
    });
    const handler = vi
      .fn()
      .mockRejectedValueOnce(new BackendApiError(401, "Session expired", "UNAUTHENTICATED"))
      .mockResolvedValueOnce(NextResponse.json({ ok: true }));

    const response = await withAuth(handler);

    expect(response.status).toBe(200);
    expect(handler).toHaveBeenNthCalledWith(2, "new-token");
    expect(response.cookies.get("weather_app_token")?.value).toBe("new-token");
  });

  it("returns 401 and clears cookies when there is no refresh token to fall back on", async () => {
    vi.mocked(getToken).mockResolvedValue("expired-token");
    vi.mocked(getRefreshToken).mockResolvedValue(undefined);
    const handler = vi.fn().mockRejectedValue(new BackendApiError(401, "Session expired", "UNAUTHENTICATED"));

    const response = await withAuth(handler);

    expect(response.status).toBe(401);
    expect(refreshTokens).not.toHaveBeenCalled();
    expect(response.cookies.get("weather_app_token")?.value).toBe("");
  });

  it("returns 401 and clears cookies when the refresh token itself is invalid", async () => {
    vi.mocked(getToken).mockResolvedValue("expired-token");
    vi.mocked(getRefreshToken).mockResolvedValue("revoked-refresh-token");
    vi.mocked(refreshTokens).mockResolvedValue(null);
    const handler = vi.fn().mockRejectedValue(new BackendApiError(401, "Session expired", "UNAUTHENTICATED"));

    const response = await withAuth(handler);

    expect(response.status).toBe(401);
    expect(response.cookies.get("weather_app_token")?.value).toBe("");
  });
});
