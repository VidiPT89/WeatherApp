"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { THEME_COOKIE_NAME } from "@/lib/constants";
import { DEFAULT_THEME, type Theme } from "@/theme/theme";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Props = {
  initialTheme: Theme;
  children: ReactNode;
};

export function ThemeProvider({ initialTheme, children }: Props) {
  const router = useRouter();
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      document.cookie = `${THEME_COOKIE_NAME}=${nextTheme}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setThemeState(nextTheme);
      router.refresh();
    },
    [router],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: DEFAULT_THEME, setTheme: () => {}, toggleTheme: () => {} };
  }
  return context;
}
