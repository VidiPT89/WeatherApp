"use client";

import type { Units } from "@/types/weather";

type Props = {
  units: Units;
  onChange: (units: Units) => void;
};

export function UnitToggle({ units, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-800/60 p-1 text-sm" role="group" aria-label="Unidades de temperatura">
      <button
        type="button"
        onClick={() => onChange("metric")}
        className={`rounded-md px-3 py-1 transition ${units === "metric" ? "bg-sky-400 text-slate-950" : "text-slate-300"}`}
      >
        °C
      </button>
      <button
        type="button"
        onClick={() => onChange("imperial")}
        className={`rounded-md px-3 py-1 transition ${units === "imperial" ? "bg-sky-400 text-slate-950" : "text-slate-300"}`}
      >
        °F
      </button>
    </div>
  );
}
