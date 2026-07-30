import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HistoryView } from "@/components/history/HistoryView";
import { ApiError } from "@/lib/api";
import type { SearchHistoryResponse } from "@/types/weather";

const { deleteHistoryEntryMock, clearHistoryMock } = vi.hoisted(() => ({
  deleteHistoryEntryMock: vi.fn(),
  clearHistoryMock: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    deleteHistoryEntry: deleteHistoryEntryMock,
    clearHistory: clearHistoryMock,
  };
});

function buildEntry(id: number, city: string): SearchHistoryResponse {
  return { id, city, units: "metric", searchedAt: new Date().toISOString() };
}

describe("HistoryView", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("removes a history entry when the delete button is clicked", async () => {
    deleteHistoryEntryMock.mockResolvedValue(undefined);
    render(<HistoryView history={[buildEntry(1, "Lisboa"), buildEntry(2, "Porto")]} />);

    fireEvent.click(screen.getByRole("button", { name: /Remover Lisboa/i }));

    await waitFor(() => expect(screen.queryByText("Lisboa")).not.toBeInTheDocument());
    expect(screen.getByText("Porto")).toBeInTheDocument();
    expect(deleteHistoryEntryMock).toHaveBeenCalledWith(1);
  });

  it("shows an error message and keeps the entry when removing fails", async () => {
    deleteHistoryEntryMock.mockRejectedValue(new ApiError(500, "boom"));
    render(<HistoryView history={[buildEntry(1, "Lisboa")]} />);

    fireEvent.click(screen.getByRole("button", { name: /Remover Lisboa/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível remover esta entrada do histórico.");
    expect(screen.getByText("Lisboa")).toBeInTheDocument();
  });

  it("removes the entry without an error banner when the backend already considers it gone", async () => {
    deleteHistoryEntryMock.mockRejectedValue(
      new ApiError(404, "Search history entry not found: '1'", "SEARCH_HISTORY_ENTRY_NOT_FOUND"),
    );
    render(<HistoryView history={[buildEntry(1, "Lisboa")]} />);

    fireEvent.click(screen.getByRole("button", { name: /Remover Lisboa/i }));

    await waitFor(() => expect(screen.queryByText("Lisboa")).not.toBeInTheDocument());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("clears the entire history after confirming", async () => {
    clearHistoryMock.mockResolvedValue(undefined);
    render(<HistoryView history={[buildEntry(1, "Lisboa"), buildEntry(2, "Porto")]} />);

    fireEvent.click(screen.getByRole("button", { name: "Limpar tudo" }));
    fireEvent.click(screen.getByRole("button", { name: "Limpar histórico" }));

    await waitFor(() => expect(screen.queryByText("Lisboa")).not.toBeInTheDocument());
    expect(screen.queryByText("Porto")).not.toBeInTheDocument();
    expect(clearHistoryMock).toHaveBeenCalled();
  });

  it("cancelling the clear-all confirmation keeps the history", () => {
    render(<HistoryView history={[buildEntry(1, "Lisboa")]} />);

    fireEvent.click(screen.getByRole("button", { name: "Limpar tudo" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByText("Lisboa")).toBeInTheDocument();
    expect(clearHistoryMock).not.toHaveBeenCalled();
  });

  it("shows an error message and keeps the history when clearing all fails", async () => {
    clearHistoryMock.mockRejectedValue(new ApiError(500, "boom"));
    render(<HistoryView history={[buildEntry(1, "Lisboa")]} />);

    fireEvent.click(screen.getByRole("button", { name: "Limpar tudo" }));
    fireEvent.click(screen.getByRole("button", { name: "Limpar histórico" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível limpar o histórico.");
    expect(screen.getByText("Lisboa")).toBeInTheDocument();
  });

  it("does not show the clear-all button when there is no history", () => {
    render(<HistoryView history={[]} />);

    expect(screen.getByText("Ainda não pesquisaste nenhuma cidade.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Limpar tudo" })).not.toBeInTheDocument();
  });
});
