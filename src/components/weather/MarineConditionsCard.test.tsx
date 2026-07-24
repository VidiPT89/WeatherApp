import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarineConditionsCard } from "@/components/weather/MarineConditionsCard";
import type { MarineConditionsResponse } from "@/types/weather";

const baseMarine: MarineConditionsResponse = {
  city: "Cascais",
  country: "Portugal",
  units: "metric",
  provider: "open-meteo",
  fromCache: false,
  waterTemperature: 20.2,
  waveHeightMeters: 0.86,
  waveDirectionDegrees: 306,
  wavePeriodSeconds: 5.55,
  tideEvents: [
    { type: "low", time: "2026-07-24T05:00" },
    { type: "high", time: "2026-07-24T11:00" },
  ],
};

describe("MarineConditionsCard", () => {
  it("lists today's tide events with translated high/low labels", () => {
    render(<MarineConditionsCard marine={baseMarine} />);

    expect(screen.getByText("Baixa")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText(/05:00/)).toBeInTheDocument();
    expect(screen.getByText(/11:00/)).toBeInTheDocument();
  });

  it("does not render a tides section when there are no tide events", () => {
    render(<MarineConditionsCard marine={{ ...baseMarine, tideEvents: [] }} />);

    expect(screen.queryByText("Marés de hoje")).not.toBeInTheDocument();
  });
});
