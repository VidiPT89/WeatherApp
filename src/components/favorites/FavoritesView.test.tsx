import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FavoritesView } from "@/components/favorites/FavoritesView";
import { ApiError } from "@/lib/api";
import type { FavoriteResponse } from "@/types/weather";

const { removeFavoriteMock, addFavoriteMock } = vi.hoisted(() => ({
  removeFavoriteMock: vi.fn(),
  addFavoriteMock: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    addFavorite: addFavoriteMock,
    removeFavorite: removeFavoriteMock,
  };
});

function buildFavorite(city: string): FavoriteResponse {
  return { city, createdAt: new Date().toISOString() };
}

describe("FavoritesView", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("removes a favorite when the remove button is clicked", async () => {
    removeFavoriteMock.mockResolvedValue(undefined);
    render(<FavoritesView initialFavorites={[buildFavorite("Lisboa"), buildFavorite("Porto")]} />);

    fireEvent.click(screen.getByRole("button", { name: /Remover Lisboa/i }));

    await waitFor(() => expect(screen.queryByText("Lisboa")).not.toBeInTheDocument());
    expect(screen.getByText("Porto")).toBeInTheDocument();
    expect(removeFavoriteMock).toHaveBeenCalledWith("Lisboa");
  });

  it("shows an error message and keeps the card when removing fails", async () => {
    removeFavoriteMock.mockRejectedValue(new ApiError(500, "boom"));
    render(<FavoritesView initialFavorites={[buildFavorite("Lisboa")]} />);

    fireEvent.click(screen.getByRole("button", { name: /Remover Lisboa/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível remover o favorito.");
    expect(screen.getByText("Lisboa")).toBeInTheDocument();
  });

  it("removes the card without an error banner when the backend already considers it gone", async () => {
    removeFavoriteMock.mockRejectedValue(new ApiError(404, "City is not a favorite: 'Lisboa'", "FAVORITE_NOT_FOUND"));
    render(<FavoritesView initialFavorites={[buildFavorite("Lisboa")]} />);

    fireEvent.click(screen.getByRole("button", { name: /Remover Lisboa/i }));

    await waitFor(() => expect(screen.queryByText("Lisboa")).not.toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
