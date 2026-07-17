import { CacheBadge } from "@/components/weather/CacheBadge";
import { FallbackBanner } from "@/components/weather/FallbackBanner";
import { formatTemperature, formatWindSpeed } from "@/lib/format";
import { backgroundGradientFor } from "@/lib/weather-condition";
import type { WeatherResponse } from "@/types/weather";

type Props = {
  weather: WeatherResponse;
};

export function WeatherCard({ weather }: Props) {
  return (
    <section
      aria-labelledby="current-weather-heading"
      className={`h-full overflow-hidden rounded-2xl border border-slate-800 shadow-xl ${backgroundGradientFor(weather.description)}`}
    >
      <div className="flex h-full flex-col bg-slate-950/40 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="current-weather-heading" className="text-sm font-medium uppercase tracking-wide text-slate-100/80">
            {weather.city}, {weather.country}
          </h2>
          <CacheBadge fromCache={weather.fromCache} observedAt={weather.observedAt} />
        </div>

        <p className="mt-2 text-5xl font-semibold text-white">
          {formatTemperature(weather.temperature, weather.units)}
        </p>
        <p className="mt-1 text-slate-100/90">{weather.description}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm text-slate-100/90">
          <div>
            <dt className="text-slate-100/60">Sensação</dt>
            <dd>{formatTemperature(weather.feelsLike, weather.units)}</dd>
          </div>
          <div>
            <dt className="text-slate-100/60">Humidade</dt>
            <dd>{weather.humidity}%</dd>
          </div>
          <div>
            <dt className="text-slate-100/60">Vento</dt>
            <dd>{formatWindSpeed(weather.windSpeed, weather.units)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <FallbackBanner provider={weather.provider} />
        </div>
      </div>
    </section>
  );
}
