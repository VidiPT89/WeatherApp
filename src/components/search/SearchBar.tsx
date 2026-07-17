"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchCities } from "@/lib/api";
import type { CitySuggestion } from "@/types/weather";

type Props = {
  onSelectCity: (cityLabel: string) => void;
  isSearching: boolean;
};

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function SearchBar({ onSelectCity, isSearching }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const containerRef = useRef<HTMLDivElement>(null);

  const isQueryLongEnough = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!isQueryLongEnough) {
      return;
    }

    let isCancelled = false;
    searchCities(debouncedQuery)
      .then((result) => {
        if (!isCancelled) {
          setSuggestions(result.results);
          setIsOpen(true);
        }
      })
      .catch(() => {
        if (!isCancelled) setSuggestions([]);
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, isQueryLongEnough]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    onSelectCity(query.trim());
  }

  function handleSelectSuggestion(suggestion: CitySuggestion) {
    setQuery(suggestion.name);
    setIsOpen(false);
    onSelectCity(suggestion.name);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Pesquisar cidade…"
          aria-label="Pesquisar cidade"
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="shrink-0 rounded-lg bg-sky-400 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "…" : "Ver"}
        </button>
      </form>

      {isOpen && isQueryLongEnough && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.name}-${suggestion.latitude}-${index}`}>
              <button
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-200 transition hover:bg-slate-800"
              >
                <span>{suggestion.name}</span>
                <span className="text-slate-500">{suggestion.country}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
