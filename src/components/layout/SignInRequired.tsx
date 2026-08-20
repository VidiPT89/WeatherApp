"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/LocaleProvider";

type Props = {
  message: string;
};

/** Shown in place of Favorites/History/Settings content for a guest (not signed in) user, since
 * those are the only features still gated behind an account -- weather lookup itself is anonymous. */
export function SignInRequired({ message }: Props) {
  const { dict } = useTranslations();

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
      <p className="max-w-sm text-text-muted">{message}</p>
      <Link
        href="/login"
        className="rounded-full bg-accent px-6 py-2.5 font-medium text-accent-foreground transition hover:opacity-90"
      >
        {dict.signIn.action}
      </Link>
    </div>
  );
}
