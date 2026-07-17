"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ApiError, addFavorite } from "@/lib/api";
import type { FavoriteResponse } from "@/types/weather";

type Props = {
  initialFavorites: FavoriteResponse[];
};

export function FavoritesView({ initialFavorites }: Props) {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>(initialFavorites);
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage(error instanceof ApiError ? error.message : "Não foi possível adicionar o favorito.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Favoritos</h1>
        <p className="mt-1 text-sm text-slate-400">Cidades guardadas para consulta rápida.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-md gap-2">
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Adicionar cidade aos favoritos…"
          aria-label="Nome da cidade"
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 rounded-lg bg-sky-400 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Adicionar
        </button>
      </form>

      {errorMessage && (
        <p role="alert" className="max-w-md rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {favorites.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
          Ainda não tens cidades favoritas.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((favorite) => (
            <li
              key={favorite.city}
              className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-slate-200"
            >
              <Link href={`/dashboard?city=${encodeURIComponent(favorite.city)}`} className="hover:text-sky-300">
                {favorite.city}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
