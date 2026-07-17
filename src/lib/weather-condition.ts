export type WeatherCondition = "clear" | "cloudy" | "rain" | "snow" | "storm" | "fog" | "unknown";

const KEYWORD_RULES: Array<[WeatherCondition, RegExp]> = [
  ["storm", /thunderstorm/i],
  ["snow", /snow/i],
  ["rain", /rain|drizzle/i],
  ["fog", /fog/i],
  ["cloudy", /cloud|overcast/i],
  ["clear", /clear/i],
];

const BACKGROUND_GRADIENTS: Record<WeatherCondition, string> = {
  clear: "from-sky-400 to-blue-500",
  cloudy: "from-slate-400 to-slate-600",
  rain: "from-slate-600 to-blue-900",
  snow: "from-slate-200 to-blue-300",
  storm: "from-slate-800 to-indigo-950",
  fog: "from-zinc-300 to-zinc-500",
  unknown: "from-sky-500 to-indigo-600",
};

export function classifyCondition(description: string): WeatherCondition {
  const match = KEYWORD_RULES.find(([, pattern]) => pattern.test(description));
  return match ? match[0] : "unknown";
}

export function backgroundGradientFor(description: string): string {
  return `bg-gradient-to-br ${BACKGROUND_GRADIENTS[classifyCondition(description)]}`;
}
