import type {
  CompareResponse,
  FavoriteResponse,
  ForecastWeatherResponse,
  GeocodingSearchResponse,
  MarineConditionsResponse,
  SearchHistoryResponse,
  Units,
  UserPreferences,
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

async function get<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    const body = await readErrorBody(response);
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
    throw new ApiError(response.status, errorBody.message, errorBody.errorCode);
  }
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

export function fetchMarine(city: string, units?: Units) {
  return get<MarineConditionsResponse>(`/api/weather/marine?${buildQuery({ city, units })}`);
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
