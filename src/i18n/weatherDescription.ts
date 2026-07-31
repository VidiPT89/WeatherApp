import type { Locale } from "@/i18n/locale";

/**
 * The backend's `description` field is always English: Open-Meteo's side comes from the backend's
 * own fixed WMO-code-to-English map, OpenWeatherMap's side is whatever English phrase their API
 * returns. That same raw string is also keyword-matched by `backgroundGradientFor` (see
 * `@/lib/weather-condition`) to pick the weather card's background gradient, so the raw value must
 * keep flowing into that function unchanged. This table only translates the copy actually shown to
 * the user — it must stay byte-for-byte identical to the equivalent table on the iOS and Android
 * clients so all three apps show the same wording for the same backend phrase.
 */
const PT_TRANSLATIONS: Record<string, string> = {
  "clear sky": "Céu limpo",
  "mainly clear": "Praticamente limpo",
  "partly cloudy": "Parcialmente nublado",
  overcast: "Nublado",
  fog: "Nevoeiro",
  "depositing rime fog": "Nevoeiro gelado",
  "light drizzle": "Chuvisco fraco",
  "moderate drizzle": "Chuvisco moderado",
  "dense drizzle": "Chuvisco intenso",
  "light freezing drizzle": "Chuvisco gelado fraco",
  "dense freezing drizzle": "Chuvisco gelado intenso",
  "slight rain": "Chuva fraca",
  "moderate rain": "Chuva moderada",
  "heavy rain": "Chuva forte",
  "light freezing rain": "Chuva gelada fraca",
  "heavy freezing rain": "Chuva gelada forte",
  "slight snow fall": "Neve fraca",
  "moderate snow fall": "Neve moderada",
  "heavy snow fall": "Neve forte",
  "snow grains": "Grãos de neve",
  "slight rain showers": "Aguaceiros fracos",
  "moderate rain showers": "Aguaceiros moderados",
  "violent rain showers": "Aguaceiros fortes",
  "slight snow showers": "Aguaceiros de neve fracos",
  "heavy snow showers": "Aguaceiros de neve fortes",
  thunderstorm: "Trovoada",
  "thunderstorm with slight hail": "Trovoada com granizo fraco",
  "thunderstorm with heavy hail": "Trovoada com granizo forte",
  unknown: "Desconhecido",
  clear: "Céu limpo",
  "few clouds": "Poucas nuvens",
  "scattered clouds": "Nuvens dispersas",
  "broken clouds": "Céu muito nublado",
  "overcast clouds": "Céu encoberto",
  "light rain": "Chuva fraca",
  "heavy intensity rain": "Chuva intensa",
  "shower rain": "Aguaceiros",
  "light intensity shower rain": "Aguaceiros fracos",
  "heavy intensity shower rain": "Aguaceiros fortes",
  "ragged shower rain": "Aguaceiros irregulares",
  snow: "Neve",
  "light snow": "Neve fraca",
  "heavy snow": "Neve forte",
  sleet: "Água-neve",
  mist: "Neblina",
  smoke: "Fumo",
  haze: "Neblina seca",
  "sand/dust whirls": "Redemoinhos de areia/poeira",
  dust: "Poeira",
  sand: "Areia",
  "volcanic ash": "Cinza vulcânica",
  squalls: "Rajadas de vento",
  tornado: "Tornado",
};

function capitalize(text: string): string {
  const lower = text.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Translates a raw, English weather condition description for display, without touching the value
 * used for condition-based styling (see the module doc above). Lookup is case-insensitive. Locales
 * other than `"pt"`, and any phrase not present in the table, fall back to the original English
 * text, capitalized.
 */
export function translateWeatherDescription(description: string, locale: Locale): string {
  if (locale === "pt") {
    const translated = PT_TRANSLATIONS[description.toLowerCase()];
    if (translated !== undefined) return translated;
  }
  return capitalize(description);
}
