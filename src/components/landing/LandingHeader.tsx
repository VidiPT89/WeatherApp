"use client";

import Link from "next/link";
import { LocaleToggle } from "@/components/layout/LocaleToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTranslations } from "@/i18n/LocaleProvider";

export function LandingHeader() {
  const { dict } = useTranslations();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-lg">
      <nav
        aria-label={dict.nav.ariaLabel}
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <span className="text-lg font-semibold tracking-tight text-accent">{dict.nav.appName}</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-text-muted transition hover:text-text">
            {dict.landing.ctaSecondary}
          </Link>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
