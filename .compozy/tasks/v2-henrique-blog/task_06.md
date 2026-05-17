---
status: completed
title: Implement bilingual index and post pages
type: frontend
complexity: high
dependencies:
  - task_04
  - task_05
---

# Task 06: Implement bilingual index and post pages

## Overview
Build the reader-facing Astro routes for the migrated bilingual blog. This task turns the content, routing helpers, and layout foundation into working pages for indexes, posts, and 404 behavior.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST implement `/` as the Portuguese index.
- MUST implement `/en/` as the English index.
- MUST implement `/<slug>/` for Portuguese posts.
- MUST implement `/en/<slug>/` for English posts.
- MUST implement a static 404 page compatible with the migrated layout.
- MUST render posts and indexes from the helper contracts created in Task 04.
- SHOULD preserve date, spoiler, tags, update date, and reading-related presentation where currently visible.
</requirements>

## Subtasks
- [x] 6.1 Build the Portuguese index page.
- [x] 6.2 Build the English index page.
- [x] 6.3 Build Portuguese dynamic post pages.
- [x] 6.4 Build English dynamic post pages.
- [x] 6.5 Build a migrated 404 page.
- [x] 6.6 Wire language switch behavior to paired routes.
- [x] 6.7 Verify route parity for all existing slugs.

## Implementation Details
Use TechSpec "Data Flow" and "Development Sequencing" as the guide. Keep content parsing in helpers; page files should render normalized entries through layouts.

### Relevant Files
- `src/templates/blog-index.js` — current post-list behavior reference.
- `src/templates/blog-post.js` — current article behavior reference.
- `src/pages/404.js` — current 404 behavior reference.
- `gatsby-node.js` — current page creation behavior reference.
- `src/components/Layout.js` — language toggle and shell reference.
- `src/lib/posts.ts` — post-list and lookup helper from Task 04.
- `src/lib/routes.ts` — route helper from Task 04.

### Dependent Files
- `src/components/SEO.astro` — added in Task 07 for metadata.
- `src/components/ShareLinks.astro` — added in Task 07 for post pages.
- `src/components/ThemeToggle.astro` — added in Task 08 for layout interaction.
- `scripts/validate-migration.*` — audits these routes in Task 10.

### Related ADRs
- [ADR-002: Use Strict Parity Maintenance Reset for V1](../adrs/adr-002.md) — Requires strict URL and reader-experience continuity.
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](../adrs/adr-003.md) — Defines source content shape for pages.

## Deliverables
- `src/pages/index.astro`.
- `src/pages/en/index.astro`.
- `src/pages/[slug].astro`.
- `src/pages/en/[slug].astro`.
- `src/pages/404.astro`.
- Bilingual route and page-rendering tests.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for bilingual page generation **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify Portuguese index only lists Portuguese posts.
  - [x] Verify English index only lists English posts.
  - [x] Verify every Portuguese slug produces `/<slug>/`.
  - [x] Verify every English slug produces `/en/<slug>/`.
  - [x] Verify 404 page renders without Gatsby props.
- Integration tests:
  - [x] Build the site and confirm all 20 expected blog routes are generated.
  - [x] Render one Portuguese post and verify body content appears.
  - [x] Render one English post and verify body content appears.
  - [x] Verify language switch links point to paired translated routes.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `/`, `/en/`, `/<slug>/`, and `/en/<slug>/` are available for all existing content.
- 404 page renders through the migrated layout.
- No currently valid public blog route requires a redirect.
