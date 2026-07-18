import { HistoryView } from "@/components/history/HistoryView";
import { backendFetch } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { SearchHistoryResponse } from "@/types/weather";

export default async function HistoryPage() {
  const token = await getToken();
  const history = token
    ? await backendFetch<SearchHistoryResponse[]>("/api/v1/weather/history", { token }).catch(() => [])
    : [];

  return <HistoryView history={history} />;
}
