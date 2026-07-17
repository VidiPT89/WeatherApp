"use client";

import { useNow } from "@/hooks/useNow";
import { formatRelativeSeconds } from "@/lib/format";

type Props = {
  fromCache: boolean;
  observedAt: string;
};

const TICK_MS = 1000;

export function CacheBadge({ fromCache, observedAt }: Props) {
  const now = useNow(TICK_MS);

  if (!fromCache) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Dados frescos
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-300">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Servido da cache {formatRelativeSeconds(observedAt, now)}
    </span>
  );
}
