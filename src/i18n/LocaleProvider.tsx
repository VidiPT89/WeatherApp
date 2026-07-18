"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/locale";
import { LOCALE_COOKIE_NAME } from "@/lib/constants";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type Props = {
  initialLocale: Locale;
  children: ReactNode;
};

export function LocaleProvider({ initialLocale, children }: Props) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
      setLocaleState(nextLocale);
      router.refresh();
    },
    [router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict: dictionaries[locale], setLocale }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslations(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    return { locale: DEFAULT_LOCALE, dict: dictionaries[DEFAULT_LOCALE], setLocale: () => {} };
  }
  return context;
}
