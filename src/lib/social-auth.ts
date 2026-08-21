/**
 * Loads each provider's own JS SDK on demand (script tag, no npm dependency) and drives it to
 * produce a native ID token client-side -- the same token the backend's `OidcIdTokenVerifier`
 * checks. No client secret is ever handled here; only the (non-secret) client id per provider.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: (momentListener?: (notification: { isNotDisplayed(): boolean; isSkippedMoment(): boolean }) => void) => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: { clientId: string; scope: string; redirectURI: string; usePopup: boolean }) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
    msal?: {
      PublicClientApplication: new (config: {
        auth: { clientId: string; authority: string };
      }) => {
        initialize: () => Promise<void>;
        loginPopup: (request: { scopes: string[] }) => Promise<{ idToken: string }>;
      };
    };
  }
}

const loadedScripts = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  const existing = loadedScripts.get(src);
  if (existing) return existing;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
  loadedScripts.set(src, promise);
  return promise;
}

const SIGN_IN_TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), SIGN_IN_TIMEOUT_MS)),
  ]);
}

export function signInWithGoogle(clientId: string): Promise<string> {
  return withTimeout(
    loadScript("https://accounts.google.com/gsi/client").then(
      () =>
        new Promise<string>((resolve, reject) => {
          window.google!.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => resolve(response.credential),
          });
          window.google!.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              reject(new Error("Google sign-in was dismissed"));
            }
          });
        }),
    ),
    "Google sign-in timed out",
  );
}

export function signInWithApple(clientId: string, redirectUri: string): Promise<string> {
  return withTimeout(
    loadScript("https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js").then(
      async () => {
        window.AppleID!.auth.init({ clientId, scope: "email", redirectURI: redirectUri, usePopup: true });
        const result = await window.AppleID!.auth.signIn();
        return result.authorization.id_token;
      },
    ),
    "Apple sign-in timed out",
  );
}

export function signInWithMicrosoft(clientId: string): Promise<string> {
  return withTimeout(
    loadScript("https://alcdn.msauth.net/browser/3.x/js/msal-browser.min.js").then(async () => {
      const app = new window.msal!.PublicClientApplication({
        auth: { clientId, authority: "https://login.microsoftonline.com/common" },
      });
      await app.initialize();
      const result = await app.loginPopup({ scopes: ["openid", "email", "profile"] });
      return result.idToken;
    }),
    "Microsoft sign-in timed out",
  );
}
