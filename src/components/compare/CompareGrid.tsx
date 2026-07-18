"use client";

import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";
import { formatTemperature } from "@/lib/format";
import type { CompareResponse } from "@/types/weather";
import { PRIMARY_PROVIDER } from "@/types/weather";

type Props = {
  result: CompareResponse;
};

export function CompareGrid({ result }: Props) {
  const { dict } = useTranslations();
  const successfulEntries = result.results.filter((entry) => entry.success && entry.weather);
  const averageTemperature =
    successfulEntries.length > 0
      ? successfulEntries.reduce((sum, entry) => sum + (entry.weather?.temperature ?? 0), 0) /
        successfulEntries.length
      : null;

  return (
    <div className="flex flex-col gap-4">
      {averageTemperature !== null && (
        <p className="text-sm text-text-muted">
          {dict.compare.average} <span className="font-medium text-text">{Math.round(averageTemperature)}°</span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {result.results.map((entry, index) => (
          <motion.section
            key={entry.provider}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.06 }}
            className={`rounded-2xl border p-6 shadow-xl ${
              entry.success ? "border-border bg-surface-raised" : "border-danger/30 bg-danger-bg"
            }`}
          >
            <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
              {entry.provider}
              {entry.provider === PRIMARY_PROVIDER && (
                <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  {dict.compare.primary}
                </span>
              )}
            </h2>

            {entry.success && entry.weather ? (
              <>
                <p className="mt-2 text-4xl font-semibold text-text">
                  {formatTemperature(entry.weather.temperature, entry.weather.units)}
                </p>
                <p className="mt-1 text-text-muted">{entry.weather.description}</p>
              </>
            ) : (
              <p className="mt-2 text-danger">{entry.errorMessage ?? dict.compare.unavailable}</p>
            )}
          </motion.section>
        ))}
      </div>
    </div>
  );
}
