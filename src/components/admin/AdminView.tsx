"use client";

import { useState } from "react";
import { translateApiError } from "@/i18n/errorMessage";
import { interpolate } from "@/i18n/interpolate";
import { useTranslations } from "@/i18n/LocaleProvider";
import { ApiError, deleteAdminUser } from "@/lib/api";
import type { UserResponse } from "@/types/weather";

type Props = {
  initialUsers: UserResponse[];
  currentUserId: number;
  initialLoadError?: boolean;
};

export function AdminView({ initialUsers, currentUserId, initialLoadError = false }: Props) {
  const { dict, locale } = useTranslations();
  const [users, setUsers] = useState<UserResponse[]>(initialUsers);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setErrorMessage(null);
    try {
      await deleteAdminUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.admin.deleteError) : dict.admin.deleteError);
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">{dict.admin.title}</h1>
        <p className="mt-1 text-sm text-text-muted">{dict.admin.subtitle}</p>
      </div>

      {errorMessage && (
        <p role="alert" className="max-w-md rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      {initialLoadError && (
        <p role="alert" className="max-w-md rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {dict.admin.loadError}
        </p>
      )}

      {users.length === 0 ? (
        !initialLoadError && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted">
            {dict.admin.empty}
          </p>
        )
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-raised text-text-muted">
                <th scope="col" className="px-4 py-3 font-medium">{dict.admin.columnEmail}</th>
                <th scope="col" className="px-4 py-3 font-medium">{dict.admin.columnRole}</th>
                <th scope="col" className="px-4 py-3 font-medium">{dict.admin.columnCreated}</th>
                <th scope="col" className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-text">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.role === "admin" ? "bg-accent/15 text-accent" : "bg-surface-raised text-text-muted"
                      }`}
                    >
                      {user.role === "admin" ? dict.admin.roleAdmin : dict.admin.roleUser}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString(locale)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.id === currentUserId ? (
                      <span className="text-xs text-text-muted">—</span>
                    ) : confirmingId === user.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-text-muted">{interpolate(dict.admin.confirmMessage, { email: user.email })}</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="shrink-0 rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {dict.admin.confirmYes}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingId(null)}
                          className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-text-muted transition hover:text-text"
                        >
                          {dict.admin.confirmCancel}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingId(user.id)}
                        aria-label={interpolate(dict.admin.deleteButtonAriaLabel, { email: user.email })}
                        className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-text-muted transition hover:bg-danger-bg hover:text-danger"
                      >
                        {dict.admin.deleteButton}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
