"use client";

import { useTranslations } from "@/i18n/LocaleProvider";
import { useTheme } from "@/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { dict } = useTranslations();
  const isDark = theme === "dark";
  const label = isDark ? dict.settings.themeLight : dict.settings.themeDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-muted text-text-muted transition hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
          <path d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 1 0 20.354 15.354Z" />
        </svg>
      )}
    </button>
  );
}
