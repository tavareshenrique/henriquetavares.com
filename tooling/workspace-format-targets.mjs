/**
 * Single source of truth for what the workspace lint/format setup is supposed to cover.
 * Used by ESLint config and unit tests.
 */

/** File globs (relative to repo root) that ESLint should actively lint for the Astro era. */
export const eslintLintFileGlobs = [
  '**/*.astro',
  '**/*.{ts,tsx,mts,cts}',
  '*.{mjs,cjs}',
  '**/*.{mjs,cjs}',
];

/**
 * Prettier CLI glob argument used by format / format:check scripts (excluding ignored paths).
 * Keeps Markdown out of bulk formatting while covering Astro-era sources and configs.
 */
export const prettierWriteGlob =
  '{astro.config.*,tailwind.config.*,eslint.config.mjs,vitest.config.ts,src/**/*.{astro,ts,tsx,css,scss},src/**/*.json,tooling/**/*.{mjs,js,ts},tests/**/*.{ts,mjs}}';

/** Lines that must appear in `.prettierignore` to keep blog Markdown out of bulk formatting. */
export const requiredPrettierIgnoreTokens = ['*.md', 'src/pages/'];
