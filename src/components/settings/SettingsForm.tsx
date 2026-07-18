"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { translateApiError } from "@/i18n/errorMessage";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/locale";
import { ApiError, updatePreferences } from "@/lib/api";
import { useTheme } from "@/theme/ThemeProvider";
import type { Theme } from "@/theme/theme";
import type { Units } from "@/types/weather";

type Props = {
  initialUnits: Units;
};

export function SettingsForm({ initialUnits }: Props) {
  const { dict, locale, setLocale } = useTranslations();
  const { theme, setTheme } = useTheme();
  const [units, setUnits] = useState<Units>(initialUnits);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSelect(nextUnits: Units) {
    if (nextUnits === units) return;

    setIsSaving(true);
    setFeedback(null);
    try {
      const updated = await updatePreferences(nextUnits);
      setUnits(updated.units);
      setFeedback(dict.settings.saved);
    } catch (error) {
      setFeedback(error instanceof ApiError ? translateApiError(dict, error, dict.settings.saveError) : dict.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex max-w-md flex-col gap-8"
    >
      <div>
        <h1 className="text-2xl font-semibold text-text">{dict.settings.title}</h1>
        <p className="mt-1 text-sm text-text-muted">{dict.settings.subtitle}</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-surface-muted p-1 text-sm" role="group" aria-label={dict.settings.title}>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect("metric")}
          className={`flex-1 rounded-md px-3 py-2 transition ${
            units === "metric" ? "bg-accent text-accent-foreground" : "text-text-muted"
          }`}
        >
          {dict.settings.metric}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect("imperial")}
          className={`flex-1 rounded-md px-3 py-2 transition ${
            units === "imperial" ? "bg-accent text-accent-foreground" : "text-text-muted"
          }`}
        >
          {dict.settings.imperial}
        </button>
      </div>

      {feedback && <p className="text-sm text-text-muted">{feedback}</p>}

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">{dict.settings.languageTitle}</h2>
        <p className="mt-1 text-sm text-text-subtle">{dict.settings.languageSubtitle}</p>
        <div className="mt-3 flex gap-1 rounded-lg bg-surface-muted p-1 text-sm" role="group" aria-label={dict.settings.languageTitle}>
          {(["pt", "en"] as Locale[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLocale(option)}
              className={`flex-1 rounded-md px-3 py-2 transition ${
                locale === option ? "bg-accent text-accent-foreground" : "text-text-muted"
              }`}
            >
              {option === "pt" ? "Português" : "English"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">{dict.settings.themeTitle}</h2>
        <p className="mt-1 text-sm text-text-subtle">{dict.settings.themeSubtitle}</p>
        <div className="mt-3 flex gap-1 rounded-lg bg-surface-muted p-1 text-sm" role="group" aria-label={dict.settings.themeTitle}>
          {(["light", "dark"] as Theme[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              className={`flex-1 rounded-md px-3 py-2 transition ${
                theme === option ? "bg-accent text-accent-foreground" : "text-text-muted"
              }`}
            >
              {option === "light" ? dict.settings.themeLight : dict.settings.themeDark}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
