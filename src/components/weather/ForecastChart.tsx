"use client";

import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDayLabel, formatHour } from "@/lib/format";
import type { DailyForecastEntry, HourlyForecastEntry, Units } from "@/types/weather";

type Props = {
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  units: Units;
};

type Tab = "hourly" | "daily";

const TOOLTIP_STYLE = { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 };

export function ForecastChart({ hourly, daily, units }: Props) {
  const [tab, setTab] = useState<Tab>("hourly");
  const temperatureUnit = units === "imperial" ? "°F" : "°C";

  const hourlyData = hourly.map((entry) => ({ label: formatHour(entry.time), temperature: entry.temperature }));
  const dailyData = daily.map((entry) => ({
    label: formatDayLabel(entry.date),
    max: entry.temperatureMax,
    min: entry.temperatureMin,
  }));

  return (
    <section
      aria-labelledby="forecast-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h2 id="forecast-heading" className="text-sm font-medium uppercase tracking-wide text-slate-400">
          Previsão
        </h2>
        <div className="flex gap-1 rounded-lg bg-slate-800/60 p-1 text-sm" role="tablist" aria-label="Tipo de previsão">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "hourly"}
            onClick={() => setTab("hourly")}
            className={`rounded-md px-3 py-1 transition ${tab === "hourly" ? "bg-sky-400 text-slate-950" : "text-slate-300"}`}
          >
            Horária
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "daily"}
            onClick={() => setTab("daily")}
            className={`rounded-md px-3 py-1 transition ${tab === "daily" ? "bg-sky-400 text-slate-950" : "text-slate-300"}`}
          >
            Diária
          </button>
        </div>
      </div>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          {tab === "hourly" ? (
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit={temperatureUnit} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="temperature" stroke="#38bdf8" fill="url(#temperatureGradient)" />
            </AreaChart>
          ) : (
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} unit={temperatureUnit} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="max" name={`Máx (${temperatureUnit})`} fill="#fbbf24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="min" name={`Mín (${temperatureUnit})`} fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
