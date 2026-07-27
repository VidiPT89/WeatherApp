import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminView } from "@/components/admin/AdminView";
import { ApiError } from "@/lib/api";
import type { UserResponse } from "@/types/weather";

const { deleteAdminUserMock } = vi.hoisted(() => ({
  deleteAdminUserMock: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    deleteAdminUser: deleteAdminUserMock,
  };
});

function buildUser(id: number, email: string, role: "user" | "admin" = "user"): UserResponse {
  return { id, email, role, units: "metric", createdAt: new Date().toISOString() };
}

describe("AdminView", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("does not show a delete action for the current admin's own row", () => {
    render(
      <AdminView
        initialUsers={[buildUser(1, "admin@example.com", "admin"), buildUser(2, "someone@example.com")]}
        currentUserId={1}
      />,
    );

    expect(screen.queryByRole("button", { name: /Eliminar conta admin@example.com/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Eliminar conta someone@example.com/i })).toBeInTheDocument();
  });

  it("deletes a user after confirming", async () => {
    deleteAdminUserMock.mockResolvedValue(undefined);
    render(<AdminView initialUsers={[buildUser(1, "admin@example.com", "admin"), buildUser(2, "someone@example.com")]} currentUserId={1} />);

    fireEvent.click(screen.getByRole("button", { name: /Eliminar conta someone@example.com/i }));
    fireEvent.click(screen.getByRole("button", { name: "Eliminar conta" }));

    await waitFor(() => expect(screen.queryByText("someone@example.com")).not.toBeInTheDocument());
    expect(deleteAdminUserMock).toHaveBeenCalledWith(2);
  });

  it("cancelling the confirmation keeps the account", () => {
    render(<AdminView initialUsers={[buildUser(1, "admin@example.com", "admin"), buildUser(2, "someone@example.com")]} currentUserId={1} />);

    fireEvent.click(screen.getByRole("button", { name: /Eliminar conta someone@example.com/i }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByText("someone@example.com")).toBeInTheDocument();
    expect(deleteAdminUserMock).not.toHaveBeenCalled();
  });

  it("shows an error message and keeps the row when deleting fails", async () => {
    deleteAdminUserMock.mockRejectedValue(new ApiError(400, "You cannot delete your own admin account."));
    render(<AdminView initialUsers={[buildUser(1, "admin@example.com", "admin"), buildUser(2, "someone@example.com")]} currentUserId={1} />);

    fireEvent.click(screen.getByRole("button", { name: /Eliminar conta someone@example.com/i }));
    fireEvent.click(screen.getByRole("button", { name: "Eliminar conta" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível eliminar esta conta.");
    expect(screen.getByText("someone@example.com")).toBeInTheDocument();
  });

  it("shows the empty state when there are no other accounts", () => {
    render(<AdminView initialUsers={[]} currentUserId={1} />);

    expect(screen.getByText("Ainda não há outras contas.")).toBeInTheDocument();
  });
});
