"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LocaleToggle } from "@/components/layout/LocaleToggle";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useTranslations } from "@/i18n/LocaleProvider";
import { logout } from "@/lib/api";

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { dict } = useTranslations();

  const links = [
    { href: "/dashboard", label: dict.nav.search },
    { href: "/compare", label: dict.nav.compare },
    { href: "/favorites", label: dict.nav.favorites },
    { href: "/history", label: dict.nav.history },
    { href: "/settings", label: dict.nav.settings },
  ];

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-lg">
      <nav
        aria-label={dict.nav.ariaLabel}
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-accent">
          {dict.nav.appName}
        </Link>
        <ul className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`relative z-10 rounded-md px-3 py-1.5 transition-colors ${
                    isActive ? "text-accent-foreground" : "text-text-muted hover:text-text"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 -z-10 rounded-md bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-1.5 text-sm text-text-muted transition hover:text-danger"
            >
              {dict.nav.logout}
            </button>
          </li>
          <li className="flex items-center gap-2 pl-2">
            <LocaleToggle />
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
