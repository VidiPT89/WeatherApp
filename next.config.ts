import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is required here: Next.js's App Router injects its own inline bootstrap/RSC
  // hydration <script> tags with no nonce support in next.config.ts's static headers() (nonces
  // need per-request middleware wiring). Confirmed by testing: 'self' alone silently blocks those
  // scripts and the app never hydrates -- everything server-renders but nothing becomes
  // interactive. Every other directive below stays strict.
  // 'unsafe-eval' is added in dev only -- React's dev-mode debugging (stack trace reconstruction)
  // needs eval(); it never runs in production, so production ships without it.
  // Social login SDKs (loaded as plain <script> tags, no npm deps -- see src/lib/social-auth.ts):
  // Google Identity Services, Apple's Sign in with Apple JS, and Microsoft's MSAL browser bundle.
  `script-src 'self' 'unsafe-inline' https://accounts.google.com https://appleid.cdn-apple.com https://cdn.jsdelivr.net${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://accounts.google.com https://appleid.apple.com https://login.microsoftonline.com",
  "frame-src 'self' https://accounts.google.com https://appleid.apple.com https://login.microsoftonline.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  // Chrome's default cross-origin popup isolation stops MSAL from reading `popup.closed` (it
  // polls that to detect the Microsoft login popup finishing), which without this header hangs
  // "Continuar com Microsoft" until our own 60s timeout -- confirmed via the exact console error
  // MSAL throws: "Cross-Origin-Opener-Policy policy would block the window.closed call."
  { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
