"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api";

const LINKS = [
  { href: "/dashboard", label: "Pesquisa" },
  { href: "/compare", label: "Comparar" },
  { href: "/favorites", label: "Favoritos" },
  { href: "/history", label: "Histórico" },
  { href: "/settings", label: "Preferências" },
];

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-sky-400">
          WeatherApp
        </Link>
        <ul className="flex flex-wrap items-center gap-1 text-sm">
          {LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 transition ${
                    isActive ? "bg-sky-400/10 text-sky-300" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-1.5 text-sm text-slate-400 transition hover:text-red-300"
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
