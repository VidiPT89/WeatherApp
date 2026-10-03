export interface Dictionary {
  landing: {
    badge: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
    statForecastValue: string;
    statForecastLabel: string;
    statProvidersValue: string;
    statProvidersLabel: string;
    statLanguagesValue: string;
    statLanguagesLabel: string;
    featuresEyebrow: string;
    featuresTitle: string;
    featureForecastTitle: string;
    featureForecastBody: string;
    featureMarineTitle: string;
    featureMarineBody: string;
    featureFallbackTitle: string;
    featureFallbackBody: string;
    featureFavoritesTitle: string;
    featureFavoritesBody: string;
    featureI18nTitle: string;
    featureI18nBody: string;
    featureCacheTitle: string;
    featureCacheBody: string;
    showcaseEyebrow: string;
    showcaseTitle: string;
    showcaseSubtitle: string;
    ctaSectionTitle: string;
    ctaSectionSubtitle: string;
    footerTagline: string;
    demoDescription: string;
  };
  nav: {
    appName: string;
    ariaLabel: string;
    search: string;
    favorites: string;
    history: string;
    settings: string;
    admin: string;
    logout: string;
    login: string;
  };
  search: {
    placeholder: string;
    ariaLabel: string;
    viewButton: string;
  };
  unitToggle: {
    ariaLabel: string;
  };
  signIn: {
    requiredFavorites: string;
    requiredHistory: string;
    requiredSettings: string;
    action: string;
  };
  dashboard: {
    idlePrompt: string;
    loading: string;
    locating: string;
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
    airTemperature: string;
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
    tides: string;
    tideHigh: string;
    tideLow: string;
    unavailable: string;
  };
  insights: {
    title: string;
    subtitle: string;
    moonPhase: string;
    uvRisk: string;
    outdoorActivity: string;
    fishingConditions: string;
    moonPhases: {
      newMoon: string;
      waxingCrescent: string;
      firstQuarter: string;
      waxingGibbous: string;
      fullMoon: string;
      waningGibbous: string;
      lastQuarter: string;
      waningCrescent: string;
    };
    uvRiskLabels: {
      low: string;
      moderate: string;
      high: string;
      veryHigh: string;
      extreme: string;
    };
    activityLabels: {
      great: string;
      good: string;
      fair: string;
      poor: string;
    };
    fishingLabels: {
      good: string;
      fair: string;
      poor: string;
    };
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
  favorites: {
    title: string;
    subtitle: string;
    placeholder: string;
    ariaLabel: string;
    addButton: string;
    empty: string;
    addError: string;
    removeButton: string;
    removeButtonAriaLabel: string;
    removeError: string;
  };
  history: {
    title: string;
    subtitle: string;
    empty: string;
    deleteButtonAriaLabel: string;
    deleteError: string;
    clearButton: string;
    clearConfirmMessage: string;
    clearConfirmYes: string;
    clearConfirmCancel: string;
    clearError: string;
  };
  admin: {
    title: string;
    subtitle: string;
    columnEmail: string;
    columnRole: string;
    columnCreated: string;
    roleAdmin: string;
    roleUser: string;
    deleteButton: string;
    deleteButtonAriaLabel: string;
    confirmMessage: string;
    confirmYes: string;
    confirmCancel: string;
    deleteError: string;
    empty: string;
    loadError: string;
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
    orContinueWith: string;
    continueWith: string;
    socialError: string;
  };
  errors: {
    CITY_NOT_FOUND: string;
    PROVIDER_UNAVAILABLE: string;
    PROVIDER_QUOTA_EXCEEDED: string;
    VALIDATION_FAILED: string;
    EMAIL_ALREADY_REGISTERED: string;
    INVALID_CREDENTIALS: string;
    FAVORITE_ALREADY_EXISTS: string;
    FAVORITE_NOT_FOUND: string;
    UNAUTHENTICATED: string;
    ACCESS_DENIED: string;
    RATE_LIMIT_EXCEEDED: string;
    INTERNAL_ERROR: string;
    GENERIC: string;
    WEATHER_LOAD_FAILED: string;
    ADMIN_SELF_DELETE: string;
    SEARCH_HISTORY_ENTRY_NOT_FOUND: string;
    SERVICE_UNAVAILABLE: string;
  };
}

export type ErrorCode = keyof Dictionary["errors"];
