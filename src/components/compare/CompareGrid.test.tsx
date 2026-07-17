import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompareGrid } from "@/components/compare/CompareGrid";
import type { CompareResponse, WeatherResponse } from "@/types/weather";

function buildWeather(overrides: Partial<WeatherResponse>): WeatherResponse {
  return {
    city: "Lisboa",
    country: "Portugal",
    temperature: 20,
    feelsLike: 19,
    humidity: 60,
    windSpeed: 10,
    description: "Clear sky",
    units: "metric",
    provider: "open-meteo",
    observedAt: new Date().toISOString(),
    fromCache: false,
    ...overrides,
  };
}

describe("CompareGrid", () => {
  it("computes the average temperature across successful providers only", () => {
    const result: CompareResponse = {
      city: "Lisboa",
      results: [
        { provider: "open-meteo", success: true, weather: buildWeather({ temperature: 20 }), errorMessage: null },
        { provider: "open-weather-map", success: true, weather: buildWeather({ temperature: 24 }), errorMessage: null },
      ],
    };

    render(<CompareGrid result={result} />);

    expect(screen.getByText("22°")).toBeInTheDocument();
  });

  it("shows the provider error message when a provider fails", () => {
    const result: CompareResponse = {
      city: "Lisboa",
      results: [
        { provider: "open-meteo", success: true, weather: buildWeather({}), errorMessage: null },
        { provider: "open-weather-map", success: false, weather: null, errorMessage: "Provider unavailable" },
      ],
    };

    render(<CompareGrid result={result} />);

    expect(screen.getByText("Provider unavailable")).toBeInTheDocument();
  });

  it("marks the primary provider", () => {
    const result: CompareResponse = {
      city: "Lisboa",
      results: [{ provider: "open-meteo", success: true, weather: buildWeather({}), errorMessage: null }],
    };

    render(<CompareGrid result={result} />);

    expect(screen.getByText("Principal")).toBeInTheDocument();
  });
});
