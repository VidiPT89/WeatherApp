import { backendFetch } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { SearchHistoryResponse } from "@/types/weather";

function formatSearchedAt(value: string): string {
  return new Date(value).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function HistoryPage() {
  const token = await getToken();
  const history = token
    ? await backendFetch<SearchHistoryResponse[]>("/api/v1/weather/history", { token }).catch(() => [])
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Histórico</h1>
        <p className="mt-1 text-sm text-slate-400">As tuas pesquisas mais recentes.</p>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
          Ainda não pesquisaste nenhuma cidade.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {history.map((entry, index) => (
            <li
              key={`${entry.city}-${entry.searchedAt}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-slate-200"
            >
              <span>{entry.city}</span>
              <span className="text-sm text-slate-500">
                {entry.units === "imperial" ? "°F" : "°C"} · {formatSearchedAt(entry.searchedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
