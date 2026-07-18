export type Units = "metric" | "imperial";

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
}

export interface WeatherResponse {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  units: Units;
  provider: string;
  observedAt: string;
  fromCache: boolean;
}

export interface HourlyForecastEntry {
  time: string;
  temperature: number;
  description: string;
  precipitationProbability: number;
}

export interface DailyForecastEntry {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  description: string;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
}

export interface ForecastWeatherResponse {
  city: string;
  country: string;
  units: Units;
  provider: string;
  fromCache: boolean;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
}

export interface MarineConditionsResponse {
  city: string;
  country: string;
  units: Units;
  provider: string;
  fromCache: boolean;
  waterTemperature: number | null;
  waveHeightMeters: number | null;
  waveDirectionDegrees: number | null;
  wavePeriodSeconds: number | null;
}

export interface ProviderComparisonEntry {
  provider: string;
  success: boolean;
  weather: WeatherResponse | null;
  errorMessage: string | null;
}

export interface CompareResponse {
  city: string;
  results: ProviderComparisonEntry[];
}

export interface SearchHistoryResponse {
  city: string;
  units: Units;
  searchedAt: string;
}

export interface FavoriteRequest {
  city: string;
}

export interface FavoriteResponse {
  city: string;
  createdAt: string;
}

export interface UserPreferences {
  units: Units;
}

export interface CitySuggestion {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface GeocodingSearchResponse {
  query: string;
  results: CitySuggestion[];
}

export interface ApiErrorBody {
  message: string;
  errorCode?: string;
}

export const PRIMARY_PROVIDER = "open-meteo";
