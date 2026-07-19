"use client";

import { useTranslations } from "@/i18n/LocaleProvider";

export function LandingFooter() {
  const { dict } = useTranslations();

  return (
    <footer className="border-t border-border px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-sm text-text-subtle sm:flex-row">
        <span>{dict.nav.appName}</span>
        <span>{dict.landing.footerTagline}</span>
      </div>
    </footer>
  );
}
