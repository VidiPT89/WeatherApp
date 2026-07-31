"use client";

import { useState, type FormEvent } from "react";
import { CitySuggestionsList } from "@/components/search/CitySuggestionsList";
import { useCitySuggestions } from "@/hooks/useCitySuggestions";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { CitySuggestion } from "@/types/weather";

type Props = {
  onSelectCity: (cityLabel: string) => void;
  isSearching: boolean;
};

export function SearchBar({ onSelectCity, isSearching }: Props) {
  const { dict } = useTranslations();
  const [query, setQuery] = useState("");
  const { suggestions, isOpen, isQueryLongEnough, containerRef, openIfHasSuggestions, close } =
    useCitySuggestions(query);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    close();
    onSelectCity(query.trim());
  }

  function handleSelectSuggestion(suggestion: CitySuggestion) {
    setQuery(suggestion.name);
    close();
    onSelectCity(suggestion.name);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={openIfHasSuggestions}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.ariaLabel}
          className="w-full rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-text outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="shrink-0 rounded-lg bg-accent px-4 py-2.5 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? "…" : dict.search.viewButton}
        </button>
      </form>

      <CitySuggestionsList
        suggestions={suggestions}
        visible={isOpen && isQueryLongEnough}
        onSelect={handleSelectSuggestion}
      />
    </div>
  );
}
