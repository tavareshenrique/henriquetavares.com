# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Deliver typed `PostEntry` normalization plus centralized route helpers (`/`, `/en/`, `/<slug>/`, `/en/<slug>/`), translation pairing and unpaired-slug reporting, date-descending lists, and tests (unit + integration on migrated content).

## Important Decisions

- Slug and language come from the Astro collection entry id shape `<slug>/index.md` (EN) and `<slug>/index.pt-br.md` (PT-BR), matching Astro’s normalized ids — not from `title` or Astro’s derived `slug` field for odd filenames.
- `PostRoute.canonical` equals the localized `path` per TechSpec field names; `alternate` is the other locale’s post URL (hreflang-style pairing for Task 07).
- `RouteAuditResult.missingRoutes` / `forbiddenReferences` stay empty here; Task 10 fills validation semantics.

## Learnings

- Vitest coverage thresholds apply only to `coverage.include`; extended the glob with `src/lib/**/*.ts` alongside existing targets.
- TechSpec’s `PostRoute` snippet is Go-shaped; implemented as TypeScript interfaces in `src/lib/routes.ts`.

## Files / Surfaces

- `src/lib/posts.ts` — `PostEntry`, `parsePostEntryId`, `toPostEntry`, sorting, `groupPostsBySlug`, `findUnpairedSlugs`.
- `src/lib/routes.ts` — `Lang`, path builders, `PostRoute`, `buildExpectedBlogRoutes`, `auditBlogRoutes`, `RouteAuditResult`.
- `tests/lib/posts.test.ts`, `tests/lib/routes.test.ts`, `tests/integration/blog-routes-content.test.ts`.
- `vitest.config.ts` — coverage includes `src/lib`.

## Errors / Corrections

- Prettier initially failed on new/edited files; ran `yarn prettier --write` on touched paths.

## Ready for Next Run

Task 06 can `getCollection('posts')`, map with `toPostEntry`, use `postsForLang`, and wire `postRouteMetadata` / `indexPath` into layouts and SEO.
