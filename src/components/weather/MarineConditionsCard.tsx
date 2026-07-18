"use client";

import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { MarineConditionsResponse, Units } from "@/types/weather";

type Props = {
  marine: MarineConditionsResponse;
};

function formatWaterTemperature(value: number | null, units: Units): string | null {
  if (value === null) return null;
  return `${Math.round(value)}°${units === "imperial" ? "F" : "C"}`;
}

function formatWaveHeight(value: number | null, units: Units): string | null {
  if (value === null) return null;
  return units === "imperial" ? `${(value * 3.281).toFixed(1)} ft` : `${value.toFixed(1)} m`;
}

export function MarineConditionsCard({ marine }: Props) {
  const { dict } = useTranslations();

  const hasData =
    marine.waterTemperature !== null ||
    marine.waveHeightMeters !== null ||
    marine.waveDirectionDegrees !== null ||
    marine.wavePeriodSeconds !== null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
      aria-labelledby="marine-heading"
      className="rounded-2xl border border-border bg-surface-raised p-6 shadow-xl"
    >
      <h2 id="marine-heading" className="text-sm font-medium uppercase tracking-wide text-text-muted">
        {dict.marine.title}
      </h2>
      <p className="mt-1 text-xs text-text-subtle">{dict.marine.subtitle}</p>

      {hasData ? (
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-text sm:grid-cols-4">
          <div>
            <dt className="text-text-muted">{dict.marine.waterTemperature}</dt>
            <dd className="text-lg font-semibold">
              {formatWaterTemperature(marine.waterTemperature, marine.units) ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">{dict.marine.waveHeight}</dt>
            <dd className="text-lg font-semibold">
              {formatWaveHeight(marine.waveHeightMeters, marine.units) ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">{dict.marine.waveDirection}</dt>
            <dd className="text-lg font-semibold">
              {marine.waveDirectionDegrees !== null ? `${Math.round(marine.waveDirectionDegrees)}°` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">{dict.marine.wavePeriod}</dt>
            <dd className="text-lg font-semibold">
              {marine.wavePeriodSeconds !== null ? `${marine.wavePeriodSeconds.toFixed(1)}s` : "—"}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm text-text-subtle">{dict.marine.unavailable}</p>
      )}
    </motion.section>
  );
}
