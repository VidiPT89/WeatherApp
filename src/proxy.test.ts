// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { proxy } from "@/proxy";
import { refreshTokens } from "@/lib/token-refresh";

vi.mock("@/lib/token-refresh", () => ({
  refreshTokens: vi.fn(),
}));

function buildToken(expiresInSeconds: number | null): string {
  const payload = expiresInSeconds === null ? {} : { exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
  const base64url = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `header.${base64url}.signature`;
}

function buildRequest(path: string, cookies: Record<string, string> = {}): NextRequest {
  const cookieHeader = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
  return new NextRequest(new URL(path, "https://example.com"), {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

describe("proxy middleware", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it.each([
    "/",
    "/login",
    "/login/callback",
    "/register",
    "/dashboard",
    "/favorites",
    "/history",
    "/settings",
    "/api/weather",
    "/api/auth/login",
  ])(
    "lets public/API path %s through without checking for a token",
    async (path) => {
      const response = await proxy(buildRequest(path));

      expect(response.status).toBe(200);
      expect(refreshTokens).not.toHaveBeenCalled();
    },
  );

  it("lets the public privacy policy through without an auth cookie", async () => {
    const response = await proxy(buildRequest("/privacy"));

    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects to /login when there is no auth cookie on a protected path", async () => {
    const response = await proxy(buildRequest("/admin"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/login");
  });

  it("passes a protected request through unchanged when the token is not near expiry", async () => {
    const token = buildToken(60 * 60);
    const response = await proxy(buildRequest("/admin", { [AUTH_COOKIE_NAME]: token }));

    expect(response.status).toBe(200);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it("does not attempt a refresh when near expiry but no refresh-token cookie is present", async () => {
    const token = buildToken(60);
    const response = await proxy(buildRequest("/admin", { [AUTH_COOKIE_NAME]: token }));

    expect(response.status).toBe(200);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it("proactively refreshes and sets new cookies when the token is near expiry", async () => {
    const token = buildToken(60);
    vi.mocked(refreshTokens).mockResolvedValue({
      status: "refreshed",
      auth: { token: "new-access-token", tokenType: "Bearer", expiresInSeconds: 3600, refreshToken: "new-refresh-token" },
    });

    const response = await proxy(
      buildRequest("/admin", { [AUTH_COOKIE_NAME]: token, [REFRESH_COOKIE_NAME]: "valid-refresh-token" }),
    );

    expect(refreshTokens).toHaveBeenCalledWith("valid-refresh-token");
    expect(response.cookies.get(AUTH_COOKIE_NAME)?.value).toBe("new-access-token");
    expect(response.cookies.get(REFRESH_COOKIE_NAME)?.value).toBe("new-refresh-token");
  });

  it("falls through to a plain response when the refresh attempt fails", async () => {
    const token = buildToken(60);
    vi.mocked(refreshTokens).mockResolvedValue({ status: "rejected" });

    const response = await proxy(
      buildRequest("/admin", { [AUTH_COOKIE_NAME]: token, [REFRESH_COOKIE_NAME]: "revoked-refresh-token" }),
    );

    expect(refreshTokens).toHaveBeenCalledWith("revoked-refresh-token");
    expect(response.status).toBe(200);
    expect(response.cookies.get(AUTH_COOKIE_NAME)).toBeUndefined();
  });

  it("treats an unparsable token as not near expiry rather than crashing", async () => {
    const response = await proxy(buildRequest("/admin", { [AUTH_COOKIE_NAME]: "not-a-real-jwt" }));

    expect(response.status).toBe(200);
    expect(refreshTokens).not.toHaveBeenCalled();
  });

  it("treats a token with no exp claim as not near expiry", async () => {
    const token = buildToken(null);
    const response = await proxy(
      buildRequest("/admin", { [AUTH_COOKIE_NAME]: token, [REFRESH_COOKIE_NAME]: "some-refresh-token" }),
    );

    expect(response.status).toBe(200);
    expect(refreshTokens).not.toHaveBeenCalled();
  });
});
