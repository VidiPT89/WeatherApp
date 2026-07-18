import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { parseLocale } from "@/i18n/locale";
import { LOCALE_COOKIE_NAME, THEME_COOKIE_NAME } from "@/lib/constants";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { parseTheme } from "@/theme/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeatherApp",
  description: "Cliente da Weather API Agregadora — cache, fallback e comparação de providers ao vivo.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const theme = parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${theme === "dark" ? "dark" : ""} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-surface text-text">
        <ThemeProvider initialTheme={theme}>
          <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
