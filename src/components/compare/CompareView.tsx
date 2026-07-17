"use client";

import { useState } from "react";
import { CompareGrid } from "@/components/compare/CompareGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { ApiError, fetchCompare } from "@/lib/api";
import type { CompareResponse } from "@/types/weather";

type LoadState = "idle" | "loading" | "error" | "success";

export function CompareView() {
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
      setErrorMessage(error instanceof ApiError ? error.message : "Não foi possível comparar os providers.");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Comparar providers</h1>
        <p className="mt-1 text-sm text-slate-400">
          A mesma cidade, lado a lado, em cada fonte configurada — mostra o fallback e o circuit breaker em ação.
        </p>
      </div>

      <SearchBar onSelectCity={handleSelectCity} isSearching={state === "loading"} />

      {state === "idle" && (
        <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
          Pesquisa uma cidade para comparar todos os providers configurados.
        </p>
      )}

      {state === "loading" && (
        <p className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
          A comparar…
        </p>
      )}

      {state === "error" && (
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
          {errorMessage}
        </p>
      )}

      {state === "success" && result && <CompareGrid result={result} />}
    </div>
  );
}
