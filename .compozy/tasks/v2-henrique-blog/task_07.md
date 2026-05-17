---
status: completed
title: Add SEO metadata and static social sharing
type: frontend
complexity: medium
dependencies:
  - task_06
---

# Task 07: Add SEO metadata and static social sharing

## Overview
Rebuild the blog's metadata and sharing behavior in Astro without carrying over broken Gatsby-era discussion links or `react-share`. This task makes migrated pages discoverable, shareable, and free of live `overreacted.io` metadata bugs.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add page metadata for index and post pages.
- MUST include canonical URLs and language alternates for bilingual pages.
- MUST use post `spoiler` or equivalent metadata for post descriptions.
- MUST preserve useful static social sharing links.
- MUST remove broken `overreacted.io` discussion link behavior.
- MUST not use `react-share` or a hydrated React island for sharing.
- SHOULD avoid treating historical post text as live metadata unless it is rendered by the post itself.
</requirements>

## Subtasks
- [x] 7.1 Add Astro SEO/head metadata component or layout integration.
- [x] 7.2 Add canonical and alternate language metadata from route helpers.
- [x] 7.3 Add Open Graph and Twitter metadata from post/site data.
- [x] 7.4 Replace social sharing UI with static share links.
- [x] 7.5 Remove discussion-link behavior from migrated post pages.
- [x] 7.6 Verify metadata and share URLs for EN and PT-BR representative pages.

## Implementation Details
Use TechSpec "System Architecture" and ADR-005. Metadata inputs should come from normalized post records and route helpers, not Gatsby GraphQL.

### Relevant Files
- `src/components/SEO.js` — current Helmet-based SEO reference with known bugs.
- `src/components/Share.js` — current `react-share` implementation reference.
- `src/components/Share.scss` — current share styling reference.
- `src/templates/blog-post.js` — current metadata/share integration and stale `discussUrl`.
- `src/templates/blog-index.js` — current index metadata integration.
- `gatsby-config.js` — current site metadata source.
- `src/assets/HTLogo.jpg` — current social image candidate.

### Dependent Files
- `src/layouts/BaseLayout.astro` — should own or include metadata output.
- `src/layouts/PostLayout.astro` — should pass post metadata to SEO and sharing.
- `src/pages/index.astro` and `src/pages/en/index.astro` — index metadata consumers.
- `src/pages/[slug].astro` and `src/pages/en/[slug].astro` — post metadata/share consumers.
- `package.json` — `react-share` removal is completed in Task 09 after replacement exists.

### Related ADRs
- [ADR-005: Use Static Share Links and Focused Migration Validation](../adrs/adr-005.md) — Requires static share links and no discussion link migration.

## Deliverables
- Astro metadata component or layout metadata integration.
- Static share links component.
- Canonical and alternate metadata for bilingual routes.
- Broken discussion links excluded from migrated UI.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for metadata and sharing output **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify a Portuguese post canonical URL uses `/<slug>/`.
  - [x] Verify an English post canonical URL uses `/en/<slug>/`.
  - [x] Verify alternate metadata links each translation pair.
  - [x] Verify static share URLs encode the post URL and title.
  - [x] Verify no generated share link contains `overreacted.io`.
- Integration tests:
  - [x] Build representative EN and PT-BR posts and inspect metadata output.
  - [x] Verify index pages include correct site-level metadata.
  - [x] Verify rendered post pages contain static sharing UI and no discussion link.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Metadata is generated without React Helmet or Gatsby GraphQL.
- Static share links work without `react-share`.
- Broken `overreacted.io` discussion links are absent from migrated pages.
