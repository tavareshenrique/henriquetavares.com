# Workflow Memory

Keep only durable, cross-task context here. Do not duplicate facts that are obvious from the repository, PRD documents, or git history.

## Current State

- Task 02 (lint/format/editor baseline) implemented in repo; verify with `yarn lint`, `yarn format:check`, `yarn test:coverage`.
- Task 04: bilingual blog domain + routing helpers live under `src/lib/posts.ts` and `src/lib/routes.ts` (consumers: Task 06 pages, Task 07 SEO, Task 10 validation).
- Task 05: Astro shells under `src/layouts/` (`BaseLayout`, `BlogLayout`, `PostLayout`) import global Tailwind/CSS from `src/styles/global.css`; head slot forwarded for SEO; `/layout-verify/` is a noindex HTML fixture used by unified build integration tests.
- Task 06: public blog routes are `src/pages/index.astro` (pt-br), `src/pages/en/index.astro`, `src/pages/[slug].astro` (pt-br posts), `src/pages/en/[slug].astro`, and `src/pages/404.astro`. Listing and posts use `getCollection('posts')` → `toPostEntry` / `postsForLang`; post bodies use `entry.render()`. Language toggle is `src/components/LangSwitch.astro` (header `header-actions` slot), with post pages using `postRouteMetadata(...).alternate`. `src/lib/blog-display.ts` holds `formatBlogDate`. Disk-backed test fixtures share `tests/helpers/load-post-entries.ts`.
- Task 07: SEO and sharing — `src/components/SeoHead.astro` (canonical, hreflang alternates, description, OG/Twitter) consumes `src/lib/site-config.ts`, `src/lib/seo-alternates.ts`, and route paths; `src/components/StaticShareLinks.astro` + `src/lib/share-links.ts` render static outbound share URLs (no `react-share`). Post pages pass `spoiler` as description and `share={{ title }}` into `PostLayout`; index pages use `siteDescriptionForLang`. Default social image path: `/profile-pic.jpg`.
- Task 08: theme — persisted key `henrique-blog-theme` (`src/lib/theme.ts`); pre-paint inline script in `BaseLayout.astro` head; `ThemeToggle.astro` + `src/scripts/theme-toggle.ts` in blog/post header row; `html.light` variables + Prism overrides in `src/styles/global.css`. Build integration asserts bootstrap + toggle on index, post, and 404; `happy-dom` tests cover click + reload persistence.
- Task 09: legacy React/Gatsby blog shell deleted from active `src/` (no JSX templates/HTML bootstrap); `dependencies` intentionally empty (`zod`/Astro toolchain in devDependencies); `now.json`/`.nowignore` and Zeit `deploy`/`dry`/`now-build` hooks removed—static output is Astro `dist/` only. Historical snapshots remain under `references/gatsby-runtime/` and are ESLint/CI-ignored unless a task explicitly validates them against `dist/`.
- Task 10: migration audit — `yarn audit:migration` (`tsx tooling/migration-audit.ts`) and `yarn validate` (`lint` → `build` → audit). Core logic `src/lib/migration-audit.ts` + disk loader `src/lib/post-disk-inventory.ts`; canonical slug list `src/lib/expected-blog-slugs.ts`. Forbidden-token scan skips co-located post Markdown and the audit definition file; dist HTML scan omits `gatsby-marker` so Markdown-rendered links (e.g. Gatsby starter URLs) do not fail the audit. When `dist/` exists, audit verifies expected blog routes via `buildExpectedBlogRoutes` and absence of `dist/thanks` / `dist/confirm`.

## Shared Decisions

## Shared Learnings

- `node-sass` does not install on modern Node (e.g. 22) without legacy Python/node-gyp; prefer `sass` (Dart Sass) or Tailwind-era pipelines when touching styles again.

## Open Risks

## Handoffs
