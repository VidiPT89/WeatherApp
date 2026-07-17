import type {
  CompareResponse,
  FavoriteResponse,
  ForecastWeatherResponse,
  GeocodingSearchResponse,
  SearchHistoryResponse,
  Units,
  UserPreferences,
  WeatherResponse,
} from "@/types/weather";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  const body = await response.json().catch(() => null);
  return body?.message ?? response.statusText;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));
  return response.json() as Promise<T>;
}

async function send<T>(path: string, method: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new ApiError(response.status, await readErrorMessage(response));
  return response.json() as Promise<T>;
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

export function fetchForecast(city: string, units?: Units) {
  return get<ForecastWeatherResponse>(`/api/weather/forecast?${buildQuery({ city, units })}`);
}

export function fetchCompare(city: string, units?: Units) {
  return get<CompareResponse>(`/api/weather/compare?${buildQuery({ city, units })}`);
}

export function fetchHistory() {
  return get<SearchHistoryResponse[]>("/api/weather/history");
}

export function fetchFavorites() {
  return get<FavoriteResponse[]>("/api/weather/favorites");
}

export function addFavorite(city: string) {
  return send<FavoriteResponse>("/api/weather/favorites", "POST", { city });
}

export function fetchPreferences() {
  return get<UserPreferences>("/api/user/preferences");
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
