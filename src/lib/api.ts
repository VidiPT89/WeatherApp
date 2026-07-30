import type {
  FavoriteResponse,
  ForecastWeatherResponse,
  GeocodingSearchResponse,
  MarineConditionsResponse,
  Units,
  UserPreferences,
  WeatherInsightsResponse,
  WeatherResponse,
} from "@/types/weather";

export class ApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

async function readErrorBody(response: Response): Promise<{ message: string; errorCode?: string }> {
  const body = await response.json().catch(() => null);
  return { message: body?.message ?? response.statusText, errorCode: body?.errorCode };
}

/**
 * `UNAUTHENTICATED` means the backend has already exhausted the refresh flow (see
 * `withAuth` in route-helpers.ts) — there's no in-app recovery, so send the user to
 * `/login` instead of leaving them stuck on an inline error with no way forward.
 */
function redirectToLoginOnSessionExpiry(errorCode?: string): void {
  if (errorCode === "UNAUTHENTICATED" && typeof window !== "undefined") {
    window.location.assign("/login");
  }
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    const body = await readErrorBody(response);
    redirectToLoginOnSessionExpiry(body.errorCode);
    throw new ApiError(response.status, body.message, body.errorCode);
  }
  return response.json() as Promise<T>;
}

async function send<T>(path: string, method: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await readErrorBody(response);
    redirectToLoginOnSessionExpiry(errorBody.errorCode);
    throw new ApiError(response.status, errorBody.message, errorBody.errorCode);
  }
  return response.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const response = await fetch(path, { method: "DELETE" });
  if (!response.ok) {
    const body = await readErrorBody(response);
    redirectToLoginOnSessionExpiry(body.errorCode);
    throw new ApiError(response.status, body.message, body.errorCode);
  }
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  return search.toString();
}

export function fetchWeather(city: string, units?: Units) {
  return get<WeatherResponse>(`/api/weather?${buildQuery({ city, units })}`);
}

export function fetchWeatherNearby(latitude: number, longitude: number, units?: Units) {
  return get<WeatherResponse>(
    `/api/weather/nearby?${buildQuery({ lat: latitude.toString(), lon: longitude.toString(), units })}`,
  );
}

export function fetchForecast(city: string, units?: Units) {
  return get<ForecastWeatherResponse>(`/api/weather/forecast?${buildQuery({ city, units })}`);
}

export function fetchMarine(city: string, units?: Units) {
  return get<MarineConditionsResponse>(`/api/weather/marine?${buildQuery({ city, units })}`);
}

export function fetchInsights(city: string, units?: Units) {
  return get<WeatherInsightsResponse>(`/api/weather/insights?${buildQuery({ city, units })}`);
}

export function deleteHistoryEntry(id: number) {
  return del(`/api/weather/history/${id}`);
}

export function clearHistory() {
  return del("/api/weather/history");
}

export function addFavorite(city: string) {
  return send<FavoriteResponse>("/api/weather/favorites", "POST", { city });
}

export function removeFavorite(city: string) {
  return del(`/api/weather/favorites?${buildQuery({ city })}`);
}

export function fetchPreferences() {
  return get<UserPreferences>("/api/user/preferences");
}

export function deleteAdminUser(id: number) {
  return del(`/api/admin/users/${id}`);
}

export function updatePreferences(units: Units) {
  return send<UserPreferences>("/api/user/preferences", "POST", { units });
}

export function searchCities(query: string) {
  return get<GeocodingSearchResponse>(`/api/geocoding?${buildQuery({ query })}`);
}

export function login(email: string, password: string) {
  return send<{ email: string }>("/api/auth/login", "POST", { email, password });
}

export function register(email: string, password: string) {
  return send<{ email: string }>("/api/auth/register", "POST", { email, password });
}

export function logout() {
  return send<{ ok: boolean }>("/api/auth/logout", "POST", {});
}
