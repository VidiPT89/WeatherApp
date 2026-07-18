"use client";

import { interpolate } from "@/i18n/interpolate";
import { useTranslations } from "@/i18n/LocaleProvider";
import { PRIMARY_PROVIDER } from "@/types/weather";

type Props = {
  provider: string;
};

export function FallbackBanner({ provider }: Props) {
  const { dict } = useTranslations();
  if (provider === PRIMARY_PROVIDER) return null;

  return (
    <p role="status" className="rounded-lg border border-warning/30 bg-warning-bg px-3 py-2 text-sm text-warning">
      {interpolate(dict.fallbackBanner.message, { provider })}
    </p>
  );
}
