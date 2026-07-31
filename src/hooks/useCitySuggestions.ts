import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { searchCities } from "@/lib/api";
import type { CitySuggestion } from "@/types/weather";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

/**
 * Debounced, click-outside-aware city geocoding autocomplete.
 *
 * Shared between any input that needs to resolve free-typed text into real
 * geocoded places (via the `/geocoding` endpoint) before it's used for
 * anything else -- e.g. the Dashboard's search box and the Favorites "add"
 * field.
 */
export function useCitySuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

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

  function openIfHasSuggestions() {
    if (suggestions.length > 0) setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function reset() {
    setSuggestions([]);
    setIsOpen(false);
  }

  return {
    suggestions,
    isOpen,
    isQueryLongEnough,
    containerRef,
    openIfHasSuggestions,
    close,
    reset,
  };
}
