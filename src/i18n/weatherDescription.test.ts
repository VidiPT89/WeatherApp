import { describe, expect, it } from "vitest";
import { translateWeatherDescription } from "@/i18n/weatherDescription";

describe("translateWeatherDescription", () => {
  it("translates a known Open-Meteo phrase in the pt locale", () => {
    expect(translateWeatherDescription("Mainly clear", "pt")).toBe("Praticamente limpo");
  });

  it("looks up the translation case-insensitively", () => {
    expect(translateWeatherDescription("MAINLY CLEAR", "pt")).toBe("Praticamente limpo");
    expect(translateWeatherDescription("mainly clear", "pt")).toBe("Praticamente limpo");
  });

  it("falls back to capitalized English for an unmapped phrase in the pt locale", () => {
    expect(translateWeatherDescription("extreme heat warning", "pt")).toBe("Extreme heat warning");
  });

  it("returns capitalized English unchanged for the en locale", () => {
    expect(translateWeatherDescription("mainly clear", "en")).toBe("Mainly clear");
    expect(translateWeatherDescription("clear sky", "en")).toBe("Clear sky");
  });
});
