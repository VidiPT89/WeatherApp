import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CacheBadge } from "@/components/weather/CacheBadge";

describe("CacheBadge", () => {
  it("shows a fresh-data badge when fromCache is false", () => {
    render(<CacheBadge fromCache={false} observedAt={new Date().toISOString()} />);
    expect(screen.getByText("Dados frescos")).toBeInTheDocument();
  });

  it("shows a cache-age badge when fromCache is true", () => {
    const observedAt = new Date(Date.now() - 5000).toISOString();
    render(<CacheBadge fromCache observedAt={observedAt} />);
    expect(screen.getByText(/Servido da cache há/)).toBeInTheDocument();
  });
});
