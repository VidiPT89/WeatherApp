"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SearchBar } from "@/components/search/SearchBar";
import { ForecastChart } from "@/components/weather/ForecastChart";
import { MarineConditionsCard } from "@/components/weather/MarineConditionsCard";
import { UnitToggle } from "@/components/weather/UnitToggle";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { WeatherInsightsCard } from "@/components/weather/WeatherInsightsCard";
import { translateApiError } from "@/i18n/errorMessage";
import { useTranslations } from "@/i18n/LocaleProvider";
import { ApiError, fetchForecast, fetchInsights, fetchMarine, fetchPreferences, fetchWeather } from "@/lib/api";
import type {
  ForecastWeatherResponse,
  MarineConditionsResponse,
  Units,
  WeatherInsightsResponse,
  WeatherResponse,
} from "@/types/weather";

type LoadState = "idle" | "loading" | "error" | "success";

export function Dashboard() {
  const { dict } = useTranslations();
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<Units>("metric");
  const [city, setCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastWeatherResponse | null>(null);
  const [marine, setMarine] = useState<MarineConditionsResponse | null>(null);
  const [insights, setInsights] = useState<WeatherInsightsResponse | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCity = useCallback(
    async (targetCity: string, targetUnits: Units) => {
      setState("loading");
      setErrorMessage(null);
      try {
        const [weatherResult, forecastResult, marineResult, insightsResult] = await Promise.all([
          fetchWeather(targetCity, targetUnits),
          fetchForecast(targetCity, targetUnits),
          fetchMarine(targetCity, targetUnits).catch(() => null),
          fetchInsights(targetCity, targetUnits).catch(() => null),
        ]);
        setWeather(weatherResult);
        setForecast(forecastResult);
        setMarine(marineResult);
        setInsights(insightsResult);
        setState("success");
      } catch (error) {
        setWeather(null);
        setForecast(null);
        setMarine(null);
        setInsights(null);
        setState("error");
        setErrorMessage(
          error instanceof ApiError ? translateApiError(dict, error) : dict.errors.WEATHER_LOAD_FAILED,
        );
      }
    },
    [dict],
  );

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      let resolvedUnits: Units = "metric";
      try {
        const preferences = await fetchPreferences();
        resolvedUnits = preferences.units;
        if (!isCancelled) setUnits(resolvedUnits);
      } catch {
        /* preferences are optional context; the metric default already set stays in place */
      }

      const initialCity = searchParams.get("city");
      if (initialCity && !isCancelled) {
        setCity(initialCity);
        void loadCity(initialCity, resolvedUnits);
      }
    }

    void init();
    return () => {
      isCancelled = true;
    };
  }, [searchParams, loadCity]);

  function handleSelectCity(selectedCity: string) {
    setCity(selectedCity);
    void loadCity(selectedCity, units);
  }

  function handleUnitsChange(nextUnits: Units) {
    setUnits(nextUnits);
    if (city) void loadCity(city, nextUnits);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar onSelectCity={handleSelectCity} isSearching={state === "loading"} />
        <UnitToggle units={units} onChange={handleUnitsChange} />
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-dashed border-border p-8 text-center text-text-muted"
          >
            {dict.dashboard.idlePrompt}
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
            {dict.dashboard.loading}
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

        {state === "success" && weather && forecast && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <WeatherCard weather={weather} today={forecast.daily[0]} />
              <ForecastChart hourly={forecast.hourly} daily={forecast.daily} units={units} />
            </div>
            {marine && <MarineConditionsCard marine={marine} />}
            {insights && <WeatherInsightsCard insights={insights} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
