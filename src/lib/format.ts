import type { Units } from "@/types/weather";

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

export function formatRelativeSeconds(observedAt: string, now: Date = new Date()): string {
  const diffSeconds = Math.max(0, Math.round((now.getTime() - new Date(observedAt).getTime()) / 1000));

  if (diffSeconds < SECONDS_PER_MINUTE) return `há ${diffSeconds}s`;

  const diffMinutes = Math.round(diffSeconds / SECONDS_PER_MINUTE);
  if (diffMinutes < MINUTES_PER_HOUR) return `há ${diffMinutes}min`;

  return `há ${Math.round(diffMinutes / MINUTES_PER_HOUR)}h`;
}

export function formatTemperature(value: number, units: Units): string {
  return `${Math.round(value)}°${units === "imperial" ? "F" : "C"}`;
}

export function formatWindSpeed(value: number, units: Units): string {
  return `${Math.round(value)} ${units === "imperial" ? "mph" : "km/h"}`;
}

export function formatHour(isoLocalDateTime: string): string {
  return new Date(isoLocalDateTime).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

export function formatDayLabel(isoLocalDate: string): string {
  return new Date(`${isoLocalDate}T00:00:00`).toLocaleDateString("pt-PT", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}
