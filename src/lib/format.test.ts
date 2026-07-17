import { describe, expect, it } from "vitest";
import { formatDayLabel, formatHour, formatRelativeSeconds, formatTemperature, formatWindSpeed } from "@/lib/format";

describe("formatRelativeSeconds", () => {
  it("formats sub-minute ages in seconds", () => {
    const now = new Date("2024-01-01T12:00:12.000Z");
    const observedAt = "2024-01-01T12:00:00.000Z";

    expect(formatRelativeSeconds(observedAt, now)).toBe("há 12s");
  });

  it("formats ages between one minute and one hour in minutes", () => {
    const now = new Date("2024-01-01T12:05:00.000Z");
    const observedAt = "2024-01-01T12:00:00.000Z";

    expect(formatRelativeSeconds(observedAt, now)).toBe("há 5min");
  });

  it("formats ages of an hour or more in hours", () => {
    const now = new Date("2024-01-01T14:00:00.000Z");
    const observedAt = "2024-01-01T12:00:00.000Z";

    expect(formatRelativeSeconds(observedAt, now)).toBe("há 2h");
  });

  it("clamps negative ages (clock skew) to zero", () => {
    const now = new Date("2024-01-01T12:00:00.000Z");
    const observedAt = "2024-01-01T12:00:05.000Z";

    expect(formatRelativeSeconds(observedAt, now)).toBe("há 0s");
  });
});

describe("formatTemperature", () => {
  it("rounds and suffixes Celsius for metric", () => {
    expect(formatTemperature(21.6, "metric")).toBe("22°C");
  });

  it("rounds and suffixes Fahrenheit for imperial", () => {
    expect(formatTemperature(70.4, "imperial")).toBe("70°F");
  });
});

describe("formatWindSpeed", () => {
  it("suffixes km/h for metric", () => {
    expect(formatWindSpeed(12.3, "metric")).toBe("12 km/h");
  });

  it("suffixes mph for imperial", () => {
    expect(formatWindSpeed(8.7, "imperial")).toBe("9 mph");
  });
});

describe("formatHour", () => {
  it("renders a local-time HH:mm label", () => {
    expect(formatHour("2024-01-01T14:30:00")).toMatch(/14:30|02:30/);
  });
});

describe("formatDayLabel", () => {
  it("renders a weekday + day/month label", () => {
    expect(formatDayLabel("2024-01-01")).toContain("01");
  });
});
