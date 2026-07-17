"use client";

import { useState } from "react";
import { ApiError, updatePreferences } from "@/lib/api";
import type { Units } from "@/types/weather";

type Props = {
  initialUnits: Units;
};

export function SettingsForm({ initialUnits }: Props) {
  const [units, setUnits] = useState<Units>(initialUnits);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSelect(nextUnits: Units) {
    if (nextUnits === units) return;

    setIsSaving(true);
    setFeedback(null);
    try {
      const updated = await updatePreferences(nextUnits);
      setUnits(updated.units);
      setFeedback("Preferências guardadas.");
    } catch (error) {
      setFeedback(error instanceof ApiError ? error.message : "Não foi possível guardar as preferências.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Preferências</h1>
        <p className="mt-1 text-sm text-slate-400">A unidade de temperatura por omissão para novas pesquisas.</p>
      </div>

      <div className="flex gap-1 rounded-lg bg-slate-800/60 p-1 text-sm" role="group" aria-label="Unidade preferida">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect("metric")}
          className={`flex-1 rounded-md px-3 py-2 transition ${
            units === "metric" ? "bg-sky-400 text-slate-950" : "text-slate-300"
          }`}
        >
          Métrico (°C, km/h)
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleSelect("imperial")}
          className={`flex-1 rounded-md px-3 py-2 transition ${
            units === "imperial" ? "bg-sky-400 text-slate-950" : "text-slate-300"
          }`}
        >
          Imperial (°F, mph)
        </button>
      </div>

      {feedback && <p className="text-sm text-slate-400">{feedback}</p>}
    </div>
  );
}
