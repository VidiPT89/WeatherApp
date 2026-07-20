// `server-only` unconditionally throws when imported — Next.js's bundler swaps it for a no-op in
// server bundles at build time. Vitest doesn't know about that alias, so tests that import a
// module marked `import "server-only"` need this stand-in instead.
export {};
