import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, fetchWeather, login } from "@/lib/api";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON on success", async () => {
    const weather = { city: "Lisboa", temperature: 20 };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(weather));
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchWeather("Lisboa", "metric");

    expect(result).toEqual(weather);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/weather?city=Lisboa&units=metric"),
      expect.anything()
    );
  });

  it("throws ApiError with the backend message on failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ message: "City not found: 'Atlantis'" }, 404));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchWeather("Atlantis")).rejects.toMatchObject(
      new ApiError(404, "City not found: 'Atlantis'")
    );
  });

  function stubLocationAssign(): ReturnType<typeof vi.fn> {
    const assignSpy = vi.fn();
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, assign: assignSpy },
    });
    return assignSpy;
  }

  it("redirects to /login when the session is genuinely expired (UNAUTHENTICATED)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ message: "Session expired", errorCode: "UNAUTHENTICATED" }, 401));
    vi.stubGlobal("fetch", fetchMock);
    const assignSpy = stubLocationAssign();

    await expect(fetchWeather("Lisboa")).rejects.toThrow();

    expect(assignSpy).toHaveBeenCalledWith("/login");
  });

  it("does not redirect for ordinary API errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ message: "City not found" }, 404));
    vi.stubGlobal("fetch", fetchMock);
    const assignSpy = stubLocationAssign();

    await expect(fetchWeather("Atlantis")).rejects.toThrow();

    expect(assignSpy).not.toHaveBeenCalled();
  });

  it("sends credentials-free JSON POST requests for auth calls", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ email: "demo@example.com" }, 200));
    vi.stubGlobal("fetch", fetchMock);

    await login("demo@example.com", "password123");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "demo@example.com", password: "password123" }),
      })
    );
  });
});
