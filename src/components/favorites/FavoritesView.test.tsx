import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FavoritesView } from "@/components/favorites/FavoritesView";
import { ApiError } from "@/lib/api";
import type { CitySuggestion, FavoriteResponse } from "@/types/weather";

const { removeFavoriteMock, addFavoriteMock, searchCitiesMock } = vi.hoisted(() => ({
  removeFavoriteMock: vi.fn(),
  addFavoriteMock: vi.fn(),
  searchCitiesMock: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    addFavorite: addFavoriteMock,
    removeFavorite: removeFavoriteMock,
    searchCities: searchCitiesMock,
  };
});

function buildFavorite(city: string): FavoriteResponse {
  return { city, createdAt: new Date().toISOString() };
}

function buildSuggestion(name: string, country: string): CitySuggestion {
  return { name, country, latitude: 0, longitude: 0 };
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

  it("shows geocoded suggestions while typing and adds the one the user selects", async () => {
    searchCitiesMock.mockResolvedValue({
      query: "Lis",
      results: [buildSuggestion("Lisboa", "PT"), buildSuggestion("Lisburn", "GB")],
    });
    addFavoriteMock.mockResolvedValue(buildFavorite("Lisboa"));
    render(<FavoritesView initialFavorites={[]} />);

    fireEvent.change(screen.getByLabelText("Nome da cidade"), { target: { value: "Lis" } });

    expect(await screen.findByText("Lisburn", undefined, { timeout: 2000 })).toBeInTheDocument();
    await waitFor(() => expect(searchCitiesMock).toHaveBeenCalledWith("Lis"));

    fireEvent.click(screen.getByRole("button", { name: /Lisboa/i }));

    await waitFor(() => expect(addFavoriteMock).toHaveBeenCalledWith("Lisboa"));
    expect(await screen.findByText("Lisboa")).toBeInTheDocument();
    // Selecting the suggestion closes the dropdown -- "Lisburn" should no longer be listed.
    expect(screen.queryByText("Lisburn")).not.toBeInTheDocument();
  });

  it("does not add a free-typed city that was never confirmed as a real geocoded suggestion", async () => {
    searchCitiesMock.mockResolvedValue({ query: "Nowhereville", results: [] });
    render(<FavoritesView initialFavorites={[]} />);

    const input = screen.getByLabelText("Nome da cidade");
    fireEvent.change(input, { target: { value: "Nowhereville" } });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    await waitFor(() => expect(searchCitiesMock).toHaveBeenCalledWith("Nowhereville"), { timeout: 2000 });
    expect(addFavoriteMock).not.toHaveBeenCalled();
  });
});
