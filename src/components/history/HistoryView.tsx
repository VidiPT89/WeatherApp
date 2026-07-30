"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { translateApiError } from "@/i18n/errorMessage";
import { interpolate } from "@/i18n/interpolate";
import { useTranslations } from "@/i18n/LocaleProvider";
import { formatDateTime } from "@/lib/format";
import { ApiError, clearHistory, deleteHistoryEntry } from "@/lib/api";
import type { SearchHistoryResponse } from "@/types/weather";

type Props = {
  history: SearchHistoryResponse[];
};

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m2 0v12.5A1.5 1.5 0 0 1 15.5 21h-7A1.5 1.5 0 0 1 7 19.5V7h10Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function HistoryView({ history: initialHistory }: Props) {
  const { dict, locale } = useTranslations();
  const [history, setHistory] = useState<SearchHistoryResponse[]>(initialHistory);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRemove(id: number) {
    setRemovingId(id);
    setErrorMessage(null);
    try {
      await deleteHistoryEntry(id);
      setHistory((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "SEARCH_HISTORY_ENTRY_NOT_FOUND") {
        // Already gone server-side (e.g. removed from another tab) -- reflect that instead of
        // showing an error for a delete that, from the user's perspective, already succeeded.
        setHistory((current) => current.filter((entry) => entry.id !== id));
      } else {
        setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.history.deleteError) : dict.history.deleteError);
      }
    } finally {
      setRemovingId(null);
    }
  }

  async function handleClearAll() {
    setClearingAll(true);
    setErrorMessage(null);
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.history.clearError) : dict.history.clearError);
    } finally {
      setClearingAll(false);
      setConfirmingClearAll(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">{dict.history.title}</h1>
          <p className="mt-1 text-sm text-text-muted">{dict.history.subtitle}</p>
        </div>

        {history.length > 0 &&
          (confirmingClearAll ? (
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-text-muted">{dict.history.clearConfirmMessage}</span>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={clearingAll}
                className="shrink-0 rounded-md bg-danger px-2.5 py-1 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {dict.history.clearConfirmYes}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingClearAll(false)}
                className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-text-muted transition hover:text-text"
              >
                {dict.history.clearConfirmCancel}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingClearAll(true)}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-text-muted transition hover:bg-danger-bg hover:text-danger"
            >
              {dict.history.clearButton}
            </button>
          ))}
      </div>

      {errorMessage && (
        <p role="alert" className="max-w-md rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted">
          {dict.history.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {history.map((entry, index) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface-raised px-4 py-3 text-text"
              >
                <span>{entry.city}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-subtle">
                    {entry.units === "imperial" ? "°F" : "°C"} · {formatDateTime(entry.searchedAt, locale)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(entry.id)}
                    disabled={removingId === entry.id}
                    aria-label={interpolate(dict.history.deleteButtonAriaLabel, { city: entry.city })}
                    className="shrink-0 rounded-md p-1.5 text-text-muted transition hover:bg-danger-bg hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
