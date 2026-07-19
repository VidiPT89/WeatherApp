"use client";

import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries";

type Feature = {
  titleKey: keyof Pick<
    Dictionary["landing"],
    | "featureForecastTitle"
    | "featureMarineTitle"
    | "featureCompareTitle"
    | "featureFavoritesTitle"
    | "featureI18nTitle"
    | "featureCacheTitle"
  >;
  bodyKey: keyof Pick<
    Dictionary["landing"],
    | "featureForecastBody"
    | "featureMarineBody"
    | "featureCompareBody"
    | "featureFavoritesBody"
    | "featureI18nBody"
    | "featureCacheBody"
  >;
  icon: string;
  span?: string;
};

const FEATURES: Feature[] = [
  { titleKey: "featureForecastTitle", bodyKey: "featureForecastBody", icon: "📈", span: "sm:col-span-2" },
  { titleKey: "featureMarineTitle", bodyKey: "featureMarineBody", icon: "🌊" },
  { titleKey: "featureCompareTitle", bodyKey: "featureCompareBody", icon: "🔀" },
  { titleKey: "featureFavoritesTitle", bodyKey: "featureFavoritesBody", icon: "⭐" },
  { titleKey: "featureI18nTitle", bodyKey: "featureI18nBody", icon: "🌓" },
  { titleKey: "featureCacheTitle", bodyKey: "featureCacheBody", icon: "⚡", span: "sm:col-span-2" },
];

export function FeatureGrid() {
  const { dict } = useTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-accent">{dict.landing.featuresEyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          {dict.landing.featuresTitle}
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature, index) => (
          <motion.article
            key={feature.titleKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            className={`rounded-2xl border border-border bg-surface-raised p-6 transition hover:border-accent/40 ${feature.span ?? ""}`}
          >
            <span className="text-2xl">{feature.icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-text">{dict.landing[feature.titleKey]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{dict.landing[feature.bodyKey]}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
