export interface Dictionary {
  nav: {
    appName: string;
    ariaLabel: string;
    search: string;
    compare: string;
    favorites: string;
    history: string;
    settings: string;
    logout: string;
  };
  search: {
    placeholder: string;
    ariaLabel: string;
    viewButton: string;
  };
  unitToggle: {
    ariaLabel: string;
  };
  dashboard: {
    idlePrompt: string;
    loading: string;
  };
  weatherCard: {
    freshData: string;
    cachedData: string;
    feelsLike: string;
    humidity: string;
    wind: string;
    sunrise: string;
    sunset: string;
    uvIndex: string;
    precipitation: string;
  };
  fallbackBanner: {
    message: string;
  };
  forecast: {
    title: string;
    hourlyTab: string;
    dailyTab: string;
    max: string;
    min: string;
  };
  marine: {
    title: string;
    subtitle: string;
    waterTemperature: string;
    waveHeight: string;
    waveDirection: string;
    wavePeriod: string;
    unavailable: string;
  };
  settings: {
    title: string;
    subtitle: string;
    metric: string;
    imperial: string;
    saved: string;
    saveError: string;
    languageTitle: string;
    languageSubtitle: string;
    themeTitle: string;
    themeSubtitle: string;
    themeLight: string;
    themeDark: string;
  };
  compare: {
    title: string;
    subtitle: string;
    idlePrompt: string;
    loading: string;
    average: string;
    primary: string;
    unavailable: string;
    genericError: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    placeholder: string;
    ariaLabel: string;
    addButton: string;
    empty: string;
    addError: string;
  };
  history: {
    title: string;
    subtitle: string;
    empty: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    loginSubmit: string;
    registerTitle: string;
    registerSubtitle: string;
    registerSubmit: string;
    email: string;
    password: string;
    processing: string;
    noAccount: string;
    createOne: string;
    hasAccount: string;
    signIn: string;
    genericError: string;
  };
  errors: {
    CITY_NOT_FOUND: string;
    PROVIDER_UNAVAILABLE: string;
    PROVIDER_QUOTA_EXCEEDED: string;
    VALIDATION_FAILED: string;
    EMAIL_ALREADY_REGISTERED: string;
    INVALID_CREDENTIALS: string;
    FAVORITE_ALREADY_EXISTS: string;
    UNAUTHENTICATED: string;
    ACCESS_DENIED: string;
    RATE_LIMIT_EXCEEDED: string;
    INTERNAL_ERROR: string;
    GENERIC: string;
    WEATHER_LOAD_FAILED: string;
  };
}

export type ErrorCode = keyof Dictionary["errors"];
