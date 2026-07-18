"use client";

import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";
import { formatDateTime } from "@/lib/format";
import type { SearchHistoryResponse } from "@/types/weather";

type Props = {
  history: SearchHistoryResponse[];
};

export function HistoryView({ history }: Props) {
  const { dict, locale } = useTranslations();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">{dict.history.title}</h1>
        <p className="mt-1 text-sm text-text-muted">{dict.history.subtitle}</p>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted">
          {dict.history.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((entry, index) => (
            <motion.li
              key={`${entry.city}-${entry.searchedAt}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-raised px-4 py-3 text-text"
            >
              <span>{entry.city}</span>
              <span className="text-sm text-text-subtle">
                {entry.units === "imperial" ? "°F" : "°C"} · {formatDateTime(entry.searchedAt, locale)}
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
