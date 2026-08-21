"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n/LocaleProvider";
import { oauthLogin, type OAuthProvider } from "@/lib/api";
import { signInWithApple, signInWithGoogle, signInWithMicrosoft } from "@/lib/social-auth";

type Props = {
  onSuccess: () => void;
};

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const MICROSOFT_CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;

const PROVIDERS: { id: OAuthProvider; label: string; clientId: string | undefined }[] = [
  { id: "google", label: "Google", clientId: GOOGLE_CLIENT_ID },
  { id: "apple", label: "Apple", clientId: APPLE_CLIENT_ID },
  { id: "microsoft", label: "Microsoft", clientId: MICROSOFT_CLIENT_ID },
];

/**
 * Renders only the providers with a configured client id -- so this reads as "not built yet"
 * (nothing shows) rather than a broken button, for whichever of the three haven't had their
 * client id set in the environment yet.
 */
export function SocialLoginButtons({ onSuccess }: Props) {
  const { dict } = useTranslations();
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const configuredProviders = PROVIDERS.filter((provider) => provider.clientId);
  if (configuredProviders.length === 0) {
    return null;
  }

  async function handleClick(provider: OAuthProvider, clientId: string) {
    setPendingProvider(provider);
    setErrorMessage(null);
    try {
      const idToken =
        provider === "google"
          ? await signInWithGoogle(clientId)
          : provider === "apple"
            ? await signInWithApple(clientId, `${window.location.origin}/login`)
            : await signInWithMicrosoft(clientId);

      await oauthLogin(provider, idToken);
      onSuccess();
    } catch {
      setErrorMessage(dict.auth.socialError);
    } finally {
      setPendingProvider(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs text-text-subtle">
        <span className="h-px flex-1 bg-border" />
        {dict.auth.orContinueWith}
        <span className="h-px flex-1 bg-border" />
      </div>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {configuredProviders.map((provider) => (
          <button
            key={provider.id}
            type="button"
            disabled={pendingProvider !== null}
            onClick={() => handleClick(provider.id, provider.clientId!)}
            className="rounded-lg border border-border bg-surface-raised px-4 py-2.5 font-medium text-text transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendingProvider === provider.id ? dict.auth.processing : `${dict.auth.continueWith} ${provider.label}`}
          </button>
        ))}
      </div>
    </div>
  );
}
