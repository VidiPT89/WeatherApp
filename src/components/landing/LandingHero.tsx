"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";

const CARD_ENTRANCE = { duration: 0.6, ease: "easeOut" as const };

export function LandingHero() {
  const { dict } = useTranslations();

  const stats = [
    { value: dict.landing.statForecastValue, label: dict.landing.statForecastLabel },
    { value: dict.landing.statProvidersValue, label: dict.landing.statProvidersLabel },
    { value: dict.landing.statLanguagesValue, label: dict.landing.statLanguagesLabel },
  ];

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-3xl dark:bg-accent/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-[-10%] h-96 w-96 rounded-full bg-accent-warm/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl gap-16 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {dict.landing.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl font-semibold tracking-tight text-text sm:text-6xl"
          >
            {dict.landing.heroTitle}{" "}
            <span className="bg-gradient-to-br from-accent to-accent-warm bg-clip-text text-transparent">
              {dict.landing.heroTitleHighlight}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg text-text-muted"
          >
            {dict.landing.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/register"
              className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground shadow-lg shadow-accent/20 transition hover:opacity-90"
            >
              {dict.landing.ctaPrimary}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-border px-6 py-3 font-medium text-text transition hover:bg-surface-muted"
            >
              {dict.landing.ctaSecondary}
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 grid grid-cols-1 gap-6 border-t border-border pt-8 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-semibold text-text">{stat.value}</dt>
                <dd className="mt-1 text-sm text-text-subtle">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ ...CARD_ENTRANCE, delay: 0.2 }}
          className="relative"
        >
          <HeroPreviewCard />
        </motion.div>
      </div>
    </section>
  );
}

function HeroPreviewCard() {
  const { dict, locale } = useTranslations();
  const hours =
    locale === "pt"
      ? ["Agora", "15h", "16h", "17h", "18h"]
      : ["Now", "3pm", "4pm", "5pm", "6pm"];
  const bars = [62, 74, 88, 96, 70];

  return (
    <div className="relative mx-auto max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 16, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ ...CARD_ENTRANCE, delay: 0.45 }}
        className="absolute -right-6 -top-8 z-20 w-48 rounded-2xl border border-border bg-surface-raised p-4 shadow-xl"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{dict.marine.title}</p>
        <p className="mt-2 text-2xl font-semibold text-text">20°C</p>
        <p className="text-xs text-text-subtle">{dict.marine.waveHeight}: 0.4 m</p>
      </motion.div>

      <div className="relative z-10 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-sky-400 to-blue-500 shadow-2xl">
        <div className="bg-surface/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between text-white/90">
            <span className="text-sm font-medium uppercase tracking-wide">Lisboa, Portugal</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
              {dict.weatherCard.freshData}
            </span>
          </div>
          <p className="mt-3 text-5xl font-semibold text-white">22°C</p>
          <p className="text-white/80">{locale === "pt" ? "Céu limpo" : "Clear sky"}</p>

          <div className="mt-6 flex items-end gap-2">
            {bars.map((height, index) => (
              <motion.div
                key={hours[index]}
                initial={{ height: 0 }}
                animate={{ height: `${height * 0.5}px` }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.07, ease: "easeOut" }}
                className="flex-1 rounded-t-full bg-white/70"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-white/70">
            {hours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -16, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ ...CARD_ENTRANCE, delay: 0.6 }}
        className="absolute -bottom-6 -left-6 z-20 w-40 rounded-2xl border border-border bg-surface-raised p-4 shadow-xl"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{dict.forecast.title}</p>
        <p className="mt-1 text-sm text-text">16 {locale === "pt" ? "dias" : "days"}</p>
        <p className="text-xs text-text-subtle">48h {locale === "pt" ? "horária" : "hourly"}</p>
      </motion.div>
    </div>
  );
}
