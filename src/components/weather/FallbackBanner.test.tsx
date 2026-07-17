import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FallbackBanner } from "@/components/weather/FallbackBanner";

describe("FallbackBanner", () => {
  it("renders nothing when the primary provider served the response", () => {
    const { container } = render(<FallbackBanner provider="open-meteo" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("warns when a secondary provider served the response", () => {
    render(<FallbackBanner provider="open-weather-map" />);
    expect(screen.getByRole("status")).toHaveTextContent(/indisponível.*open-weather-map/i);
  });
});
