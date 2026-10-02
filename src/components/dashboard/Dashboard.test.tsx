import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ForecastWeatherResponse, WeatherResponse } from "@/types/weather";
import { Dashboard } from "./Dashboard";

const mocks = vi.hoisted(() => ({
  weather: vi.fn(), forecast: vi.fn(), marine: vi.fn(), insights: vi.fn(),
  preferences: vi.fn(), nearby: vi.fn(), params: new URLSearchParams(),
}));
vi.mock("next/navigation", () => ({ useSearchParams: () => mocks.params }));
vi.mock("@/lib/api", async () => ({
  ...await vi.importActual("@/lib/api"),
  fetchWeather: mocks.weather, fetchForecast: mocks.forecast,
  fetchMarine: mocks.marine, fetchInsights: mocks.insights,
  fetchPreferences: mocks.preferences, fetchWeatherNearby: mocks.nearby,
}));
vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    p: ({ children, role }: { children: React.ReactNode; role?: string }) => <p role={role}>{children}</p>,
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));
vi.mock("@/components/search/SearchBar", () => ({
  SearchBar: ({ onSelectCity }: { onSelectCity: (city: string) => void }) => <>
    <button onClick={() => onSelectCity("Lisboa")}>Lisboa</button>
    <button onClick={() => onSelectCity("Porto")}>Porto</button>
  </>,
}));
vi.mock("@/components/weather/UnitToggle", () => ({
  UnitToggle: ({ onChange }: { onChange: (units: "metric" | "imperial") => void }) =>
    <button onClick={() => onChange("imperial")}>Imperial</button>,
}));
vi.mock("@/components/weather/WeatherCard", () => ({
  WeatherCard: ({ weather }: { weather: WeatherResponse }) => <p>Weather {weather.city} {weather.units}</p>,
}));
vi.mock("@/components/weather/ForecastChart", () => ({
  ForecastChart: () => <p>Forecast</p>,
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}
function weather(city: string): WeatherResponse {
  return { city, country: "Portugal", units: "metric", temperature: 20, feelsLike: 20,
    humidity: 60, windSpeed: 10, description: "clear sky", provider: "open-weather-map",
    observedAt: "2026-10-02T12:00:00Z", fromCache: false };
}
const forecast: ForecastWeatherResponse = {
  city: "Lisboa", country: "Portugal", units: "metric", provider: "open-meteo",
  fromCache: false, hourly: [], daily: [],
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.params = new URLSearchParams();
  mocks.preferences.mockRejectedValue(new Error("Guest"));
  mocks.forecast.mockResolvedValue(forecast);
  mocks.marine.mockResolvedValue(null);
  mocks.insights.mockResolvedValue(null);
  Object.defineProperty(navigator, "geolocation", { configurable: true, value: undefined });
});

describe("Dashboard request ordering and partial failures", () => {
  it("keeps the newest city when an older request finishes last", async () => {
    const old = deferred<WeatherResponse>();
    mocks.weather.mockReturnValueOnce(old.promise).mockResolvedValueOnce(weather("Porto"));
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Lisboa" }));
    fireEvent.click(screen.getByRole("button", { name: "Porto" }));
    expect(await screen.findByText("Weather Porto metric")).toBeInTheDocument();
    await act(async () => old.resolve(weather("Lisboa")));
    expect(screen.getByText("Weather Porto metric")).toBeInTheDocument();
  });

  it("ignores an older request's error after a newer successful search", async () => {
    const old = deferred<WeatherResponse>();
    mocks.weather.mockReturnValueOnce(old.promise).mockResolvedValueOnce(weather("Porto"));
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Lisboa" }));
    fireEvent.click(screen.getByRole("button", { name: "Porto" }));
    await screen.findByText("Weather Porto metric");
    await act(async () => old.reject(new Error("Offline")));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Weather Porto metric")).toBeInTheDocument();
  });

  it("shows current weather without waiting for slow secondary sections", async () => {
    mocks.weather.mockResolvedValue(weather("Lisboa"));
    mocks.forecast.mockReturnValue(new Promise(() => {}));
    mocks.marine.mockReturnValue(new Promise(() => {}));
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Lisboa" }));
    expect(await screen.findByText("Weather Lisboa metric")).toBeInTheDocument();
  });

  it("retains current weather when forecast fails", async () => {
    mocks.weather.mockResolvedValue(weather("Lisboa"));
    mocks.forecast.mockRejectedValue(new Error("Quota"));
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Lisboa" }));
    expect(await screen.findByText("Weather Lisboa metric")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses the GPS weather directly instead of resolving the city again", async () => {
    let located!: PositionCallback;
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition: vi.fn((callback: PositionCallback) => { located = callback; }),
    } });
    mocks.nearby.mockResolvedValue(weather("Lisboa"));
    render(<Dashboard />);
    await waitFor(() => expect(located).toBeDefined());
    await act(async () => located({ coords: { latitude: 38.7, longitude: -9.1 } } as GeolocationPosition));
    expect(await screen.findByText("Weather Lisboa metric")).toBeInTheDocument();
    expect(mocks.weather).not.toHaveBeenCalled();
    expect(mocks.forecast).toHaveBeenCalledWith("Lisboa, Portugal", "metric");
  });

  it("does not let delayed GPS replace a manual search", async () => {
    let located!: PositionCallback;
    Object.defineProperty(navigator, "geolocation", { configurable: true, value: {
      getCurrentPosition: vi.fn((callback: PositionCallback) => { located = callback; }),
    } });
    const nearby = deferred<WeatherResponse>();
    mocks.nearby.mockReturnValue(nearby.promise);
    mocks.weather.mockResolvedValue(weather("Porto"));
    render(<Dashboard />);
    await waitFor(() => expect(located).toBeDefined());
    act(() => located({ coords: { latitude: 38.7, longitude: -9.1 } } as GeolocationPosition));
    fireEvent.click(screen.getByRole("button", { name: "Porto" }));
    await screen.findByText("Weather Porto metric");
    await act(async () => nearby.resolve(weather("Lisboa")));
    expect(screen.getByText("Weather Porto metric")).toBeInTheDocument();
  });
  it("does not let slow saved preferences restart a manual search", async () => {
    const preferences = deferred<{ units: "imperial" }>();
    mocks.preferences.mockReturnValue(preferences.promise);
    mocks.params = new URLSearchParams("city=Lisboa");
    mocks.weather.mockResolvedValue(weather("Porto"));
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Porto" }));
    await screen.findByText("Weather Porto metric");
    await act(async () => preferences.resolve({ units: "imperial" }));
    expect(mocks.weather).toHaveBeenCalledTimes(1);
    expect(mocks.weather).toHaveBeenCalledWith("Porto", "metric");
  });

  it("keeps the selected units when the old units request finishes last", async () => {
    const old = deferred<WeatherResponse>();
    mocks.weather.mockReturnValueOnce(old.promise)
      .mockResolvedValueOnce({ ...weather("Lisboa"), units: "imperial" });
    render(<Dashboard />);
    fireEvent.click(screen.getByRole("button", { name: "Lisboa" }));
    fireEvent.click(screen.getByRole("button", { name: "Imperial" }));
    await screen.findByText("Weather Lisboa imperial");
    await act(async () => old.resolve(weather("Lisboa")));
    expect(screen.getByText("Weather Lisboa imperial")).toBeInTheDocument();
  });

});
