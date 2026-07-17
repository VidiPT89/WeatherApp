import { describe, expect, it } from "vitest";
import { backgroundGradientFor, classifyCondition } from "@/lib/weather-condition";

describe("classifyCondition", () => {
  it.each([
    ["Clear sky", "clear"],
    ["Mainly clear", "clear"],
    ["Partly cloudy", "cloudy"],
    ["Overcast", "cloudy"],
    ["Fog", "fog"],
    ["Slight rain", "rain"],
    ["Dense drizzle", "rain"],
    ["Heavy snow fall", "snow"],
    ["Thunderstorm with slight hail", "storm"],
    ["Unknown", "unknown"],
  ] as const)("classifies %s as %s", (description, expected) => {
    expect(classifyCondition(description)).toBe(expected);
  });
});

describe("backgroundGradientFor", () => {
  it("returns a gradient class string for a known condition", () => {
    expect(backgroundGradientFor("Clear sky")).toContain("bg-gradient-to-br");
  });

  it("falls back to the unknown gradient for unrecognized descriptions", () => {
    expect(backgroundGradientFor("Something weird")).toBe(backgroundGradientFor("also weird"));
  });
});
