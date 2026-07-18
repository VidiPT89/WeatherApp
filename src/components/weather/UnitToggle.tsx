"use client";

import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { Units } from "@/types/weather";

type Props = {
  units: Units;
  onChange: (units: Units) => void;
};

export function UnitToggle({ units, onChange }: Props) {
  const { dict } = useTranslations();

  return (
    <div
      className="flex gap-1 rounded-lg bg-surface-muted p-1 text-sm"
      role="group"
      aria-label={dict.unitToggle.ariaLabel}
    >
      {(["metric", "imperial"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`relative rounded-md px-3 py-1 transition-colors ${
            units === option ? "text-accent-foreground" : "text-text-muted"
          }`}
        >
          {units === option && (
            <motion.span
              layoutId="unit-toggle-pill"
              className="absolute inset-0 -z-10 rounded-md bg-accent"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}
          {option === "metric" ? "°C" : "°F"}
        </button>
      ))}
    </div>
  );
}
