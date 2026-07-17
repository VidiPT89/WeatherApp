# 🌤️ WeatherApp — Web Client

> Next.js client for the [Weather API Aggregator](https://github.com/VidiPT89/WeatherAPI) — makes the backend's cache, provider fallback and multi-provider comparison **visible**, live, in the UI.

**Live demo:** [weather-app-psi-inky-53.vercel.app](https://weather-app-psi-inky-53.vercel.app)

This is one of three clients (Web / [iOS](https://github.com/VidiPT89/WeatherApp-iOS) / [Android](https://github.com/VidiPT89/WeatherApp-Android)) built on top of the same backend, to prove the API serves multiple platforms through one contract. It never talks to Open-Meteo/OpenWeatherMap directly — every request goes through the Weather API.

## 📦 What's Inside

- 🔎 City search with debounced autocomplete (backend geocoding endpoint)
- 🌡️ Current weather + hourly/daily forecast chart (Recharts), with a °C/°F toggle
- ⚡ **Cache badge** — "dados frescos" vs "servido da cache há Xs", computed live from the response's `fromCache` flag and timestamp
- 🔁 **Fallback banner** — appears when the response was served by the secondary provider, surfacing the backend's circuit breaker/fallback in real time
- ⚖️ **Provider comparison screen** — the same city, side by side, across every configured provider, with a computed average
- 🔐 Auth (register/login), favorite cities, search history, saved unit preference
- ✅ Loading, error and empty states treated as first-class UI states, not afterthoughts

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)

## 🏗️ Architecture

```
Browser
   │  (only ever talks to this app's own /api/* routes — never the backend directly)
   ▼
WeatherApp (Next.js, this repo)
   │  Route Handlers act as a BFF: hold the JWT in an httpOnly cookie,
   │  attach "Authorization: Bearer <token>" server-side, proxy the request
   ▼
WeatherAPI (Spring Boot, sibling repo)
   │  cache (Caffeine) → circuit breaker + retry → provider adapters
   ▼
Open-Meteo / OpenWeatherMap (external providers)
```

Keeping the JWT server-side (httpOnly cookie, never `localStorage`) means client-side JS never sees the token, and the browser never needs CORS configured on the backend — every backend call is server-to-server.

```
src/
├── app/
│   ├── (app)/                  # authenticated pages: dashboard, compare, favorites, history, settings
│   ├── login/, register/       # public auth pages
│   └── api/                    # BFF route handlers (auth, weather, forecast, compare, favorites, preferences, geocoding)
├── components/                 # feature-organized: weather/, search/, compare/, favorites/, settings/, layout/
├── lib/                        # backend-client (server), api client (browser), format/weather-condition utils
├── hooks/                      # useDebouncedValue, useNow
└── types/weather.ts            # TS types mirroring the backend's DTOs
```

### Why these choices

- **BFF over a client-side SDK**: the browser only ever calls this app's own `/api/*` routes. Route Handlers hold the JWT in an httpOnly cookie and attach it server-side — the token is never reachable from client JS (XSS-safer than `localStorage`), and there's no CORS surface to configure on the backend.
- **Middleware-based route protection is a soft check only**: it just verifies a cookie is present before rendering a page. The backend remains the actual source of truth for authorization — a missing/expired token still gets a `401` from the API, handled by each page's error state.
- **Dynamic backgrounds from keyword matching, not a new backend field**: the weather `description` string already returned by the API is enough to classify a handful of conditions (clear/cloudy/rain/snow/storm/fog) — no need to plumb the raw WMO weather code through the contract for a purely cosmetic feature.

## 🚀 How to Run

Prerequisites: Node.js 20+, and the [Weather API](https://github.com/VidiPT89/WeatherAPI) running locally on `http://localhost:8080` (see that repo's README — Postgres + `mvn spring-boot:run`).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend URL is configurable via `WEATHER_API_URL` (server-side only, defaults to `http://localhost:8080`).

## ✅ Tests

```bash
npm test        # Vitest — business logic: API client, cache-age formatting, weather-condition mapping, provider-comparison averaging
npx tsc --noEmit # type check
npx eslint .     # lint
```

Given the project's scope (three separate client apps on top of one backend), test effort is weighted toward business logic (API client error handling, cache-badge age math, fallback/average computation) rather than chasing a literal coverage percentage on presentational components — golden-path and edge-case flows (auth, search, fallback, cache) were additionally verified manually in-browser.

## 📝 Notes

- No PWA/offline support, interactive map, or public share links yet — out of scope for this v1 (see the project spec's backlog).
- Open-Meteo's geocoding can occasionally resolve an ambiguous city name to the wrong country (e.g. "Lisboa" matching a same-named town instead of Lisbon, Portugal) — this is a known backend/provider limitation, documented in the [WeatherAPI README](https://github.com/VidiPT89/WeatherAPI#-notes), not a bug in this client.

## 📄 License

MIT.

---

Developed by **David Arsénio Martins**
🌐 [ividi.dev](https://ividi.dev/) · 💻 [github.com/VidiPT89](https://github.com/VidiPT89/)
