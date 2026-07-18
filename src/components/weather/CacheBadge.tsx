"use client";

import { useNow } from "@/hooks/useNow";
import { interpolate } from "@/i18n/interpolate";
import { useTranslations } from "@/i18n/LocaleProvider";
import { formatRelativeSeconds } from "@/lib/format";

type Props = {
  fromCache: boolean;
  observedAt: string;
};

const TICK_MS = 1000;

export function CacheBadge({ fromCache, observedAt }: Props) {
  const { dict, locale } = useTranslations();
  const now = useNow(TICK_MS);

  if (!fromCache) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {dict.weatherCard.freshData}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1 text-xs font-medium text-warning">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      {interpolate(dict.weatherCard.cachedData, { time: formatRelativeSeconds(observedAt, now, locale) })}
    </span>
  );
}
