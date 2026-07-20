// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { refreshTokens } from "@/lib/token-refresh";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("refreshTokens", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the new auth response on success", async () => {
    const auth = { token: "new-token", tokenType: "Bearer", expiresInSeconds: 3600, refreshToken: "new-refresh" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(auth)));

    const result = await refreshTokens("old-refresh-token");

    expect(result).toEqual(auth);
  });

  it("returns null instead of throwing when the backend rejects the refresh token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ message: "Invalid or expired refresh token", errorCode: "INVALID_REFRESH_TOKEN" }, 401))
    );

    const result = await refreshTokens("expired-refresh-token");

    expect(result).toBeNull();
  });

  it("returns null instead of throwing on a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await refreshTokens("any-token");

    expect(result).toBeNull();
  });
});
