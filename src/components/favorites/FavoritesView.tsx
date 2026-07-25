"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { translateApiError } from "@/i18n/errorMessage";
import { interpolate } from "@/i18n/interpolate";
import { useTranslations } from "@/i18n/LocaleProvider";
import { ApiError, addFavorite, removeFavorite } from "@/lib/api";
import type { FavoriteResponse } from "@/types/weather";

type Props = {
  initialFavorites: FavoriteResponse[];
};

export function FavoritesView({ initialFavorites }: Props) {
  const { dict } = useTranslations();
  const [favorites, setFavorites] = useState<FavoriteResponse[]>(initialFavorites);
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [removingCity, setRemovingCity] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!city.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const favorite = await addFavorite(city.trim());
      setFavorites((current) => [favorite, ...current]);
      setCity("");
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.favorites.addError) : dict.favorites.addError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(favoriteCity: string) {
    setRemovingCity(favoriteCity);
    setErrorMessage(null);
    try {
      await removeFavorite(favoriteCity);
      setFavorites((current) => current.filter((favorite) => favorite.city !== favoriteCity));
    } catch (error) {
      if (error instanceof ApiError && error.errorCode === "FAVORITE_NOT_FOUND") {
        // Already gone server-side (e.g. removed from another tab) -- reflect that instead of
        // showing an error for a delete that, from the user's perspective, already succeeded.
        setFavorites((current) => current.filter((favorite) => favorite.city !== favoriteCity));
      } else {
        setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.favorites.removeError) : dict.favorites.removeError);
      }
    } finally {
      setRemovingCity(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">{dict.favorites.title}</h1>
        <p className="mt-1 text-sm text-text-muted">{dict.favorites.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder={dict.favorites.placeholder}
          aria-label={dict.favorites.ariaLabel}
          className="w-full rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-text outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-lg bg-accent px-4 py-2.5 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {dict.favorites.addButton}
        </button>
      </form>

      {errorMessage && (
        <p role="alert" className="max-w-md rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      {favorites.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted">
          {dict.favorites.empty}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {favorites.map((favorite, index) => (
              <motion.li
                key={favorite.city}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-raised px-4 py-3 text-text"
              >
                <Link href={`/dashboard?city=${encodeURIComponent(favorite.city)}`} className="hover:text-accent">
                  {favorite.city}
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(favorite.city)}
                  disabled={removingCity === favorite.city}
                  aria-label={interpolate(dict.favorites.removeButtonAriaLabel, { city: favorite.city })}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-text-muted transition hover:bg-danger-bg hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {dict.favorites.removeButton}
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
