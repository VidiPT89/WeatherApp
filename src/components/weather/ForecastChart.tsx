"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslations } from "@/i18n/LocaleProvider";
import { formatDayLabel, formatHour } from "@/lib/format";
import { useTheme } from "@/theme/ThemeProvider";
import type { DailyForecastEntry, HourlyForecastEntry, Units } from "@/types/weather";

type Props = {
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  units: Units;
};

type Tab = "hourly" | "daily";

const CHART_PALETTE = {
  dark: { grid: "#1e293b", axis: "#64748b", tooltipBg: "#0f172a", tooltipBorder: "#1e293b", accent: "#38bdf8", warm: "#fbbf24" },
  light: { grid: "#e2e8f0", axis: "#64748b", tooltipBg: "#ffffff", tooltipBorder: "#e2e8f0", accent: "#0284c7", warm: "#d97706" },
};

const HOURLY_POINT_WIDTH = 56;
const DAILY_POINT_WIDTH = 64;

export function ForecastChart({ hourly, daily, units }: Props) {
  const { dict, locale } = useTranslations();
  const { theme } = useTheme();
  const [tab, setTab] = useState<Tab>("hourly");
  const temperatureUnit = units === "imperial" ? "°F" : "°C";
  const palette = CHART_PALETTE[theme];

  const hourlyData = hourly.map((entry) => ({ label: formatHour(entry.time, locale), temperature: entry.temperature }));
  const dailyData = daily.map((entry) => ({
    label: formatDayLabel(entry.date, locale),
    max: entry.temperatureMax,
    min: entry.temperatureMin,
  }));

  const chartMinWidth =
    tab === "hourly" ? hourlyData.length * HOURLY_POINT_WIDTH : dailyData.length * DAILY_POINT_WIDTH;
  const tooltipStyle = { background: palette.tooltipBg, border: `1px solid ${palette.tooltipBorder}`, borderRadius: 8 };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      aria-labelledby="forecast-heading"
      className="rounded-2xl border border-border bg-surface-raised p-6 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h2 id="forecast-heading" className="text-sm font-medium uppercase tracking-wide text-text-muted">
          {dict.forecast.title}
        </h2>
        <div className="relative flex gap-1 rounded-lg bg-surface-muted p-1 text-sm" role="tablist" aria-label={dict.forecast.title}>
          {(["hourly", "daily"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={tab === option}
              onClick={() => setTab(option)}
              className={`relative rounded-md px-3 py-1 transition-colors ${
                tab === option ? "text-accent-foreground" : "text-text-muted"
              }`}
            >
              {tab === option && (
                <motion.span
                  layoutId="forecast-tab-pill"
                  className="absolute inset-0 -z-10 rounded-md bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {option === "hourly" ? dict.forecast.hourlyTab : dict.forecast.dailyTab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-64 overflow-x-auto">
        <div style={{ minWidth: `${chartMinWidth}px`, height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            {tab === "hourly" ? (
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={palette.accent} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={palette.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
                <XAxis dataKey="label" stroke={palette.axis} fontSize={12} />
                <YAxis stroke={palette.axis} fontSize={12} unit={temperatureUnit} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke={palette.accent}
                  fill="url(#temperatureGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            ) : (
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} />
                <XAxis dataKey="label" stroke={palette.axis} fontSize={12} />
                <YAxis stroke={palette.axis} fontSize={12} unit={temperatureUnit} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar
                  dataKey="max"
                  name={`${dict.forecast.max} (${temperatureUnit})`}
                  fill={palette.warm}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="min"
                  name={`${dict.forecast.min} (${temperatureUnit})`}
                  fill={palette.accent}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </motion.section>
  );
}
