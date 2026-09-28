export type Locale = "pt" | "en";

export const DEFAULT_LOCALE: Locale = "pt";

function isLocale(value: string | undefined): value is Locale {
  return value === "pt" || value === "en";
}

export function parseLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
