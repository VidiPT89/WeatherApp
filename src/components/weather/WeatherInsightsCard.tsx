"use client";

import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries/types";
import type { WeatherInsightsResponse } from "@/types/weather";

type Props = {
  insights: WeatherInsightsResponse;
};

type BadgeTone = "neutral" | "good" | "warn" | "bad";

const UV_RISK_TONE: Record<string, BadgeTone> = {
  Low: "good",
  Moderate: "neutral",
  High: "warn",
  "Very High": "warn",
  Extreme: "bad",
};

const ACTIVITY_TONE: Record<string, BadgeTone> = {
  Great: "good",
  Good: "good",
  Fair: "neutral",
  Poor: "bad",
};

const FISHING_TONE: Record<string, BadgeTone> = {
  Good: "good",
  Fair: "neutral",
  Poor: "bad",
};

const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-text",
  good: "bg-success-bg text-success",
  warn: "bg-warning-bg text-warning",
  bad: "bg-danger-bg text-danger",
};

function moonPhaseLabel(dict: Dictionary, phase: string): string {
  const key = phase
    .split(" ")
    .map((word, index) => (index === 0 ? word.toLowerCase() : word))
    .join("") as keyof Dictionary["insights"]["moonPhases"];
  return dict.insights.moonPhases[key] ?? phase;
}

function uvRiskLabel(dict: Dictionary, label: string): string {
  const key = label === "Very High" ? "veryHigh" : (label.toLowerCase() as keyof Dictionary["insights"]["uvRiskLabels"]);
  return dict.insights.uvRiskLabels[key] ?? label;
}

function activityLabel(dict: Dictionary, label: string): string {
  const key = label.toLowerCase() as keyof Dictionary["insights"]["activityLabels"];
  return dict.insights.activityLabels[key] ?? label;
}

function fishingLabel(dict: Dictionary, label: string): string {
  const key = label.toLowerCase() as keyof Dictionary["insights"]["fishingLabels"];
  return dict.insights.fishingLabels[key] ?? label;
}

function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${BADGE_TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}

export function WeatherInsightsCard({ insights }: Props) {
  const { dict } = useTranslations();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
      aria-labelledby="insights-heading"
      className="rounded-2xl border border-border bg-surface-raised p-6 shadow-xl"
    >
      <h2 id="insights-heading" className="text-sm font-medium uppercase tracking-wide text-text-muted">
        {dict.insights.title}
      </h2>
      <p className="mt-1 text-xs text-text-subtle">{dict.insights.subtitle}</p>

      <dl className="mt-4 flex flex-wrap gap-4 text-sm text-text">
        <div>
          <dt className="text-text-muted">{dict.insights.moonPhase}</dt>
          <dd className="mt-1">
            <Badge tone="neutral">
              {moonPhaseLabel(dict, insights.moonPhase.phase)} · {insights.moonPhase.illuminationPercent}%
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">{dict.insights.uvRisk}</dt>
          <dd className="mt-1">
            <Badge tone={UV_RISK_TONE[insights.uvRiskLabel] ?? "neutral"}>
              {uvRiskLabel(dict, insights.uvRiskLabel)}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">{dict.insights.outdoorActivity}</dt>
          <dd className="mt-1">
            <Badge tone={ACTIVITY_TONE[insights.outdoorActivityLabel] ?? "neutral"}>
              {activityLabel(dict, insights.outdoorActivityLabel)} · {insights.outdoorActivityScore}
            </Badge>
          </dd>
        </div>
        {insights.fishingConditionLabel && (
          <div>
            <dt className="text-text-muted">{dict.insights.fishingConditions}</dt>
            <dd className="mt-1">
              <Badge tone={FISHING_TONE[insights.fishingConditionLabel] ?? "neutral"}>
                {fishingLabel(dict, insights.fishingConditionLabel)}
              </Badge>
            </dd>
          </div>
        )}
      </dl>
    </motion.section>
  );
}
