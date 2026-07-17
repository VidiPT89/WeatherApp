import { PRIMARY_PROVIDER } from "@/types/weather";

type Props = {
  provider: string;
};

export function FallbackBanner({ provider }: Props) {
  if (provider === PRIMARY_PROVIDER) return null;

  return (
    <p
      role="status"
      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"
    >
      Provider principal indisponível — a usar alternativa ({provider}).
    </p>
  );
}
