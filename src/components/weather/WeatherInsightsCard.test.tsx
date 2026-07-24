import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WeatherInsightsCard } from "@/components/weather/WeatherInsightsCard";
import type { WeatherInsightsResponse } from "@/types/weather";

const baseInsights: WeatherInsightsResponse = {
  city: "Cascais",
  country: "Portugal",
  moonPhase: { phase: "Waxing Gibbous", illuminationPercent: 76 },
  uvRiskLabel: "High",
  outdoorActivityScore: 88,
  outdoorActivityLabel: "Great",
  fishingConditionLabel: "Fair",
};

describe("WeatherInsightsCard", () => {
  it("shows translated moon phase, UV risk and activity labels", () => {
    render(<WeatherInsightsCard insights={baseInsights} />);

    expect(screen.getByText(/Gibosa Crescente/)).toBeInTheDocument();
    expect(screen.getByText("Alto")).toBeInTheDocument();
    expect(screen.getByText(/Ótimo/)).toBeInTheDocument();
    expect(screen.getByText("Razoáveis")).toBeInTheDocument();
  });

  it("hides the fishing conditions badge when there is no marine data", () => {
    render(<WeatherInsightsCard insights={{ ...baseInsights, fishingConditionLabel: null }} />);

    expect(screen.queryByText("Condições de pesca")).not.toBeInTheDocument();
  });
});
