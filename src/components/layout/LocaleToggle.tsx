"use client";

import { useTranslations } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/locale";

const OPTIONS: { value: Locale; label: string }[] = [
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
];

export function LocaleToggle() {
  const { locale, setLocale } = useTranslations();

  return (
    <div className="flex gap-0.5 rounded-full border border-border bg-surface-muted p-0.5 text-xs font-medium" role="group" aria-label="Idioma">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLocale(option.value)}
          aria-pressed={locale === option.value}
          className={`rounded-full px-2.5 py-1 transition ${
            locale === option.value ? "bg-accent text-accent-foreground" : "text-text-muted hover:text-text"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
