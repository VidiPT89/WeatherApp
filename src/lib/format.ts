import type { Locale } from "@/i18n/locale";
import type { Units } from "@/types/weather";

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

const INTL_LOCALE: Record<Locale, string> = { pt: "pt-PT", en: "en-US" };

export function formatRelativeSeconds(observedAt: string, now: Date = new Date(), locale: Locale = "pt"): string {
  const diffSeconds = Math.max(0, Math.round((now.getTime() - new Date(observedAt).getTime()) / 1000));

  if (locale === "en") {
    if (diffSeconds < SECONDS_PER_MINUTE) return `${diffSeconds}s ago`;
    const diffMinutes = Math.round(diffSeconds / SECONDS_PER_MINUTE);
    if (diffMinutes < MINUTES_PER_HOUR) return `${diffMinutes}min ago`;
    return `${Math.round(diffMinutes / MINUTES_PER_HOUR)}h ago`;
  }

  if (diffSeconds < SECONDS_PER_MINUTE) return `há ${diffSeconds}s`;

  const diffMinutes = Math.round(diffSeconds / SECONDS_PER_MINUTE);
  if (diffMinutes < MINUTES_PER_HOUR) return `há ${diffMinutes}min`;

  return `há ${Math.round(diffMinutes / MINUTES_PER_HOUR)}h`;
}

export function formatTemperature(value: number, units: Units): string {
  return `${Math.round(value)}°${units === "imperial" ? "F" : "C"}`;
}

export function formatWindSpeed(value: number, units: Units): string {
  return `${Math.round(value)} ${units === "imperial" ? "mph" : "km/h"}`;
}

export function formatHour(isoLocalDateTime: string, locale: Locale = "pt"): string {
  return new Date(isoLocalDateTime).toLocaleTimeString(INTL_LOCALE[locale], { hour: "2-digit", minute: "2-digit" });
}

export function formatDayLabel(isoLocalDate: string, locale: Locale = "pt"): string {
  return new Date(`${isoLocalDate}T00:00:00`).toLocaleDateString(INTL_LOCALE[locale], {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatDateTime(isoDateTime: string, locale: Locale = "pt"): string {
  return new Date(isoDateTime).toLocaleString(INTL_LOCALE[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
