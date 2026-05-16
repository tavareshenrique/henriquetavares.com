# Task Memory: task_07.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Implemented Astro-native SEO (`SeoHead.astro`) and static outbound share links (`StaticShareLinks.astro` + `buildStaticShareLinks`), wired into blog index and post routes with canonical + hreflang alternates from route helpers; post descriptions use frontmatter `spoiler`. No discussion URLs or `react-share`.

## Important Decisions

- Site origin `https://henriquetavares.com` and default OG/Twitter image `/profile-pic.jpg` live in `src/lib/site-config.ts` (aligned with `package.json` homepage and Bio asset).
- Index pages use dedicated locale-specific site descriptions (not post spoilers) to avoid hoisting historical post copy into head metadata.
- Integration test scopes “no overreacted.io in share” to the `static-share-links` list only — post bodies may still cite overreacted.io as historical prose until content edits/task 09.

## Learnings

- Vitest integration test reads minified built HTML; regex extraction is robust for asserting share-only markup.

## Files / Surfaces

- Added: `src/lib/site-config.ts`, `src/lib/seo-alternates.ts`, `src/lib/share-links.ts`, `src/components/SeoHead.astro`, `src/components/StaticShareLinks.astro`
- Updated: `src/layouts/PostLayout.astro` (optional `share` prop), `src/pages/index.astro`, `src/pages/en/index.astro`, `src/pages/[slug].astro`, `src/pages/en/[slug].astro`
- Tests: `tests/lib/seo-and-sharing.test.ts`, `tests/integration/content-collections-build.test.ts`

## Errors / Corrections

- Prettier required on new/edited test files for `yarn format:check`.
- Full-page assertion for `overreacted.io` failed because hello-world PT body links to Dan’s blog; narrowed to share `<ul>` only.

## Ready for Next Run

None — task complete pending human review of diffs and manual spot-check of OG previews if desired.
