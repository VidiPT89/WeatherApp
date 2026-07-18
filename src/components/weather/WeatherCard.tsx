"use client";

import { motion } from "motion/react";
import { CacheBadge } from "@/components/weather/CacheBadge";
import { FallbackBanner } from "@/components/weather/FallbackBanner";
import { useTranslations } from "@/i18n/LocaleProvider";
import { formatHour, formatTemperature, formatWindSpeed } from "@/lib/format";
import { backgroundGradientFor } from "@/lib/weather-condition";
import type { DailyForecastEntry, WeatherResponse } from "@/types/weather";

type Props = {
  weather: WeatherResponse;
  today?: DailyForecastEntry;
};

export function WeatherCard({ weather, today }: Props) {
  const { dict, locale } = useTranslations();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      aria-labelledby="current-weather-heading"
      className={`h-full overflow-hidden rounded-2xl border border-border shadow-xl ${backgroundGradientFor(weather.description)}`}
    >
      <div className="flex h-full flex-col bg-surface/40 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="current-weather-heading" className="text-sm font-medium uppercase tracking-wide text-white/80">
            {weather.city}, {weather.country}
          </h2>
          <CacheBadge fromCache={weather.fromCache} observedAt={weather.observedAt} />
        </div>

        <motion.p
          key={weather.temperature}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-5xl font-semibold text-white"
        >
          {formatTemperature(weather.temperature, weather.units)}
        </motion.p>
        <p className="mt-1 text-white/90">{weather.description}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm text-white/90">
          <div>
            <dt className="text-white/60">{dict.weatherCard.feelsLike}</dt>
            <dd>{formatTemperature(weather.feelsLike, weather.units)}</dd>
          </div>
          <div>
            <dt className="text-white/60">{dict.weatherCard.humidity}</dt>
            <dd>{weather.humidity}%</dd>
          </div>
          <div>
            <dt className="text-white/60">{dict.weatherCard.wind}</dt>
            <dd>{formatWindSpeed(weather.windSpeed, weather.units)}</dd>
          </div>
        </dl>

        {today && (
          <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm text-white/90 sm:grid-cols-4">
            <div>
              <dt className="text-white/60">{dict.weatherCard.sunrise}</dt>
              <dd>{formatHour(today.sunrise, locale)}</dd>
            </div>
            <div>
              <dt className="text-white/60">{dict.weatherCard.sunset}</dt>
              <dd>{formatHour(today.sunset, locale)}</dd>
            </div>
            <div>
              <dt className="text-white/60">{dict.weatherCard.uvIndex}</dt>
              <dd>{today.uvIndexMax.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-white/60">{dict.weatherCard.precipitation}</dt>
              <dd>{today.precipitationProbabilityMax}%</dd>
            </div>
          </dl>
        )}

        <div className="mt-4">
          <FallbackBanner provider={weather.provider} />
        </div>
      </div>
    </motion.section>
  );
}
