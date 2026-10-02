"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  ApiError,
  fetchForecast,
  fetchInsights,
  fetchMarine,
  fetchPreferences,
  fetchWeather,
  fetchWeatherNearby,
} from "@/lib/api";
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
  const [isLocating, setIsLocating] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const loadCity = useCallback(
    async (targetCity: string, targetUnits: Units, nearbyWeather?: WeatherResponse) => {
      const request = ++requestSequence.current;
      const isCurrent = () => request === requestSequence.current;
      setIsLocating(false);
      setState("loading");
      setErrorMessage(null);
      setForecastError(null);
      setWeather(null);
      setForecast(null);
      setMarine(null);
      setInsights(null);

      // Sections settle independently: slow or unavailable extras must not hide current weather.
      void fetchForecast(targetCity, targetUnits).then((result) => {
        if (isCurrent()) setForecast(result);
      }).catch((error: unknown) => {
        if (isCurrent()) setForecastError(
          error instanceof ApiError ? translateApiError(dict, error) : dict.errors.WEATHER_LOAD_FAILED,
        );
      });
      void fetchMarine(targetCity, targetUnits).then((result) => {
        if (isCurrent()) setMarine(result);
      }).catch(() => {});
      void fetchInsights(targetCity, targetUnits).then((result) => {
        if (isCurrent()) setInsights(result);
      }).catch(() => {});

      try {
        const result = nearbyWeather ?? await fetchWeather(targetCity, targetUnits);
        if (!isCurrent()) return;
        setWeather(result);
        setState("success");
      } catch (error) {
        if (!isCurrent()) return;
        setState("error");
        setErrorMessage(
          error instanceof ApiError ? translateApiError(dict, error) : dict.errors.WEATHER_LOAD_FAILED,
        );
      }
    },
    [dict],
  );

  const loadNearby = useCallback(
    async (latitude: number, longitude: number, targetUnits: Units) => {
      const request = ++requestSequence.current;
      setState("loading");
      try {
        const result = await fetchWeatherNearby(latitude, longitude, targetUnits);
        if (request !== requestSequence.current) return;
        const qualifiedCity = result.country ? `${result.city}, ${result.country}` : result.city;
        setCity(qualifiedCity);
        await loadCity(qualifiedCity, targetUnits, result);
      } catch {
        if (request === requestSequence.current) setState("idle");
      }
    },
    [loadCity],
  );

  useEffect(() => {
    let isCancelled = false;
    const sequence = requestSequence;
    const initialRequest = sequence.current;
    const isCurrent = () => !isCancelled && initialRequest === requestSequence.current;

    async function init() {
      let resolvedUnits: Units = "metric";
      try {
        const preferences = await fetchPreferences();
        resolvedUnits = preferences.units;
        if (isCurrent()) setUnits(resolvedUnits);
      } catch {
        /* preferences are optional context; the metric default already set stays in place */
      }

      if (!isCurrent()) return;
      const initialCity = searchParams.get("city");
      if (initialCity) {
        if (isCurrent()) {
          setCity(initialCity);
          void loadCity(initialCity, resolvedUnits);
        }
        return;
      }

      if (typeof navigator === "undefined" || !navigator.geolocation) return;

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isCurrent()) return;
          setIsLocating(false);
          void loadNearby(position.coords.latitude, position.coords.longitude, resolvedUnits);
        },
        () => {
          if (!isCurrent()) return;
          setIsLocating(false);
        },
        // A weather lookup only needs city-level precision, so a position the browser already
        // resolved recently is just as good as a brand new one -- maximumAge lets it return
        // that cached fix instantly instead of re-resolving from scratch every time this effect
        // runs (e.g. navigating back to the Dashboard within the same session).
        { timeout: 10_000, maximumAge: 5 * 60 * 1000 },
      );
    }

    void init();
    return () => {
      isCancelled = true;
      sequence.current++;
    };
  }, [searchParams, loadCity, loadNearby]);

  function handleSelectCity(selectedCity: string) {
    setCity(selectedCity);
    void loadCity(selectedCity, units);
  }

  function handleUnitsChange(nextUnits: Units) {
    requestSequence.current++;
    setIsLocating(false);
    setUnits(nextUnits);
    if (city) void loadCity(city, nextUnits);
    else setState("idle");
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar onSelectCity={handleSelectCity} isSearching={state === "loading"} />
        <UnitToggle units={units} onChange={handleUnitsChange} />
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && isLocating && (
          <motion.p
            key="locating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="animate-pulse rounded-2xl border border-dashed border-border p-8 text-center text-text-muted"
          >
            {dict.dashboard.locating}
          </motion.p>
        )}

        {state === "idle" && !isLocating && (
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

        {state === "success" && weather && (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <WeatherCard weather={weather} today={forecast?.daily[0]} />
              {forecast && <ForecastChart hourly={forecast.hourly} daily={forecast.daily} units={weather.units} />}
              {forecastError && <p role="status" className="p-6 text-text-muted">{forecastError}</p>}
            </div>
            {marine && <MarineConditionsCard marine={marine} />}
            {insights && <WeatherInsightsCard insights={insights} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
