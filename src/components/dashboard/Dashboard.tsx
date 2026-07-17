"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { ForecastChart } from "@/components/weather/ForecastChart";
import { UnitToggle } from "@/components/weather/UnitToggle";
import { WeatherCard } from "@/components/weather/WeatherCard";
import { ApiError, fetchForecast, fetchPreferences, fetchWeather } from "@/lib/api";
import type { ForecastWeatherResponse, Units, WeatherResponse } from "@/types/weather";

type LoadState = "idle" | "loading" | "error" | "success";

export function Dashboard() {
  const searchParams = useSearchParams();
  const [units, setUnits] = useState<Units>("metric");
  const [city, setCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastWeatherResponse | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCity = useCallback(async (targetCity: string, targetUnits: Units) => {
    setState("loading");
    setErrorMessage(null);
    try {
      const [weatherResult, forecastResult] = await Promise.all([
        fetchWeather(targetCity, targetUnits),
        fetchForecast(targetCity, targetUnits),
      ]);
      setWeather(weatherResult);
      setForecast(forecastResult);
      setState("success");
    } catch (error) {
      setWeather(null);
      setForecast(null);
      setState("error");
      setErrorMessage(error instanceof ApiError ? error.message : "Não foi possível obter o tempo.");
    }
  }, []);

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

      {state === "idle" && (
        <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
          Pesquisa uma cidade para veres o tempo atual e a previsão.
        </p>
      )}

      {state === "loading" && (
        <p className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400">
          A carregar…
        </p>
      )}

      {state === "error" && (
        <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
          {errorMessage}
        </p>
      )}

      {state === "success" && weather && forecast && (
        <div className="grid gap-6 lg:grid-cols-2">
          <WeatherCard weather={weather} />
          <ForecastChart hourly={forecast.hourly} daily={forecast.daily} units={units} />
        </div>
      )}
    </div>
  );
}
