import { FavoritesView } from "@/components/favorites/FavoritesView";
import { backendFetch } from "@/lib/backend-client";
import { getToken } from "@/lib/session";
import type { FavoriteResponse } from "@/types/weather";

export default async function FavoritesPage() {
  const token = await getToken();
  const favorites = token
    ? await backendFetch<FavoriteResponse[]>("/api/v1/weather/favorites", { token }).catch(() => [])
    : [];

  return <FavoritesView initialFavorites={favorites} />;
}
