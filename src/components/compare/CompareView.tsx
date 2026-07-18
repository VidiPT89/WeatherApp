"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CompareGrid } from "@/components/compare/CompareGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { translateApiError } from "@/i18n/errorMessage";
import { useTranslations } from "@/i18n/LocaleProvider";
import { ApiError, fetchCompare } from "@/lib/api";
import type { CompareResponse } from "@/types/weather";

type LoadState = "idle" | "loading" | "error" | "success";

export function CompareView() {
  const { dict } = useTranslations();
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSelectCity(city: string) {
    setState("loading");
    setErrorMessage(null);
    try {
      const compareResult = await fetchCompare(city);
      setResult(compareResult);
      setState("success");
    } catch (error) {
      setResult(null);
      setState("error");
      setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.compare.genericError) : dict.compare.genericError);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">{dict.compare.title}</h1>
        <p className="mt-1 text-sm text-text-muted">{dict.compare.subtitle}</p>
      </div>

      <SearchBar onSelectCity={handleSelectCity} isSearching={state === "loading"} />

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted"
          >
            {dict.compare.idlePrompt}
          </motion.p>
        )}

        {state === "loading" && (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="animate-pulse rounded-2xl border border-border bg-surface-raised p-8 text-center text-text-muted"
          >
            {dict.compare.loading}
          </motion.p>
        )}

        {state === "error" && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-2xl border border-danger/30 bg-danger-bg p-8 text-center text-danger"
          >
            {errorMessage}
          </motion.p>
        )}

        {state === "success" && result && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CompareGrid result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
