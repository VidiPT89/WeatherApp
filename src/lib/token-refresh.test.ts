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

    expect(result).toEqual({ status: "refreshed", auth });
  });

  it("reports a rejection instead of throwing when the backend refuses the refresh token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ message: "Invalid or expired refresh token", errorCode: "INVALID_REFRESH_TOKEN" }, 401))
    );

    const result = await refreshTokens("expired-refresh-token");

    expect(result).toEqual({ status: "rejected" });
  });

  it("reports the backend as unavailable instead of throwing on a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await refreshTokens("any-token");

    expect(result).toEqual({ status: "unavailable" });
  });

  it("reports the backend as unavailable, not a rejection, on a server error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ message: "Bad gateway" }, 502)));

    const result = await refreshTokens("valid-refresh-token");

    expect(result).toEqual({ status: "unavailable" });
  });
});
