import { formatTemperature } from "@/lib/format";
import type { CompareResponse } from "@/types/weather";
import { PRIMARY_PROVIDER } from "@/types/weather";

type Props = {
  result: CompareResponse;
};

export function CompareGrid({ result }: Props) {
  const successfulEntries = result.results.filter((entry) => entry.success && entry.weather);
  const averageTemperature =
    successfulEntries.length > 0
      ? successfulEntries.reduce((sum, entry) => sum + (entry.weather?.temperature ?? 0), 0) /
        successfulEntries.length
      : null;

  return (
    <div className="flex flex-col gap-4">
      {averageTemperature !== null && (
        <p className="text-sm text-slate-400">
          Média entre providers: <span className="font-medium text-slate-200">{Math.round(averageTemperature)}°</span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {result.results.map((entry) => (
          <section
            key={entry.provider}
            className={`rounded-2xl border p-6 shadow-xl ${
              entry.success ? "border-slate-800 bg-slate-900/60" : "border-red-500/30 bg-red-500/5"
            }`}
          >
            <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">
              {entry.provider}
              {entry.provider === PRIMARY_PROVIDER && (
                <span className="ml-2 rounded-full bg-sky-400/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                  Principal
                </span>
              )}
            </h2>

            {entry.success && entry.weather ? (
              <>
                <p className="mt-2 text-4xl font-semibold text-slate-50">
                  {formatTemperature(entry.weather.temperature, entry.weather.units)}
                </p>
                <p className="mt-1 text-slate-300">{entry.weather.description}</p>
              </>
            ) : (
              <p className="mt-2 text-red-300">{entry.errorMessage ?? "Provider indisponível"}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
