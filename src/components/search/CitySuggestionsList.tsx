"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CitySuggestion } from "@/types/weather";

type Props = {
  suggestions: CitySuggestion[];
  visible: boolean;
  onSelect: (suggestion: CitySuggestion) => void;
};

/**
 * Dropdown list of geocoded city suggestions, shared between any input built
 * on top of `useCitySuggestions` (Dashboard search, Favorites add field, …).
 */
export function CitySuggestionsList({ suggestions, visible, onSelect }: Props) {
  return (
    <AnimatePresence>
      {visible && suggestions.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface-raised shadow-xl"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.name}-${suggestion.latitude}-${index}`}>
              <button
                type="button"
                onClick={() => onSelect(suggestion)}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-text transition hover:bg-surface-muted"
              >
                <span>{suggestion.name}</span>
                <span className="text-text-subtle">{suggestion.country}</span>
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
