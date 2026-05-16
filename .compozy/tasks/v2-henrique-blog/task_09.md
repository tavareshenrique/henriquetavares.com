---
status: completed
title: Remove legacy Gatsby surfaces and dependencies
type: refactor
complexity: medium
dependencies:
  - task_07
  - task_08
---

# Task 09: Remove legacy Gatsby surfaces and dependencies

## Overview

Remove obsolete Gatsby runtime files, unused legacy surfaces, stale fork artifacts, and dependencies after Astro replacements exist. This task completes the product-approved cleanup without deleting migrated content or breaking replaced reader-facing behavior.

<critical>

- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables

</critical>

## Requirements

- MUST remove RSS feed behavior and links from the migrated site.
- MUST remove AdSense behavior from the migrated site.
- MUST remove newsletter confirmation pages `/thanks` and `/confirm`.
- MUST remove broken discussion-link behavior.
- MUST remove Gatsby-only runtime files after Astro replacements cover their behavior.
- MUST remove unused dependencies such as Gatsby packages and `react-share` after replacements exist.
- SHOULD clean stale `overreacted.io`, “Overreacted”, and legacy Now deployment artifacts from live source/config surfaces.

## Subtasks

- [x] 9.1 Remove Gatsby config/runtime files that are no longer used.
- [x] 9.2 Remove RSS, AdSense, and newsletter page surfaces.
- [x] 9.3 Remove stale `overreacted.io` and “Overreacted” live-source artifacts.
- [x] 9.4 Remove `react-share` and other unused runtime dependencies.
- [x] 9.5 Update deployment/config/docs surfaces that still point at legacy behavior.
- [x] 9.6 Verify Astro replacements still cover routes, metadata, sharing, and theme behavior.

## Implementation Details

Only perform this cleanup after Tasks 06, 07, and 08 provide Astro replacements. Preserve migrated Markdown content under `src/content/posts`.

### Relevant Files

- `gatsby-config.js` — Gatsby plugin, RSS, manifest, metadata, and analytics config.
- `gatsby-node.js` — Gatsby page generation no longer used after Astro routes.
- `gatsby-browser.js` — Gatsby browser runtime no longer used.
- `src/html.js` — AdSense and forced-dark behavior replaced by Astro layout/theme script.
- `src/pages/confirm.js` — newsletter confirmation page to remove.
- `src/pages/thanks.js` — newsletter confirmation page to remove.
- `now.json` — stale Now/Overreacted deployment artifact.
- `.nowignore` — legacy Now deployment artifact.
- `package.json` — dependency and script cleanup.
- `src/components/Share.js` — replaced by static share links.
- `src/components/SEO.js` — replaced by Astro metadata.

### Dependent Files

- `src/pages/index.astro` and `src/pages/en/index.astro` — must still render after cleanup.
- `src/pages/[slug].astro` and `src/pages/en/[slug].astro` — must still render after cleanup.
- `src/layouts/BaseLayout.astro` — replaces `src/html.js`.
- `StaticShareLinks.astro` + `share-links.ts` — replaces `react-share`.
- `scripts/validate-migration.*` — added in Task 10 to catch leftovers.

### Related ADRs

- [ADR-002: Use Strict Parity Maintenance Reset for V1](../adrs/adr-002.md) — Defines intentional removals.
- [ADR-005: Use Static Share Links and Focused Migration Validation](../adrs/adr-005.md) — Requires static sharing and legacy-reference cleanup.

## Deliverables

- Removed Gatsby runtime/config files that are no longer active.
- Removed RSS, AdSense, `/thanks`, `/confirm`, and broken discussion surfaces.
- Removed unused dependencies and scripts.
- Cleaned live-source/config references to `overreacted.io` where applicable.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for post-cleanup build and route behavior **(REQUIRED)**

## Tests

- Unit tests:
  - [x] Verify package dependency list no longer includes Gatsby packages required only by the old runtime.
  - [x] Verify package dependency list no longer includes `react-share`.
  - [x] Verify cleanup does not remove `src/content/posts/**`.
  - [x] Verify known removed routes `/thanks` and `/confirm` are not generated as normal pages.
- Integration tests:
  - [x] Run the build after cleanup.
  - [x] Verify `/`, `/en/`, a PT-BR post, an EN post, and 404 still render.
  - [x] Verify built output does not include AdSense script markers.
  - [x] Verify built output does not include RSS feed links.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria

- All tests passing
- Test coverage >=80%
- Gatsby is no longer part of the active runtime.
- Removed legacy surfaces are absent from the migrated site.
- Astro pages still satisfy route and reader-experience requirements.
