---
status: completed
title: Implement post domain and route helpers
type: frontend
complexity: medium
dependencies:
  - task_03
---

# Task 04: Implement post domain and route helpers

## Overview
Create the typed helper layer that turns Astro collection entries into language-aware post records and canonical routes. This task centralizes routing and translation-pair logic so pages, metadata, sharing, and validation all use the same rules.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST derive `pt-br` and `en` language values from migrated filenames.
- MUST derive slugs from post directory names, not titles.
- MUST generate `/`, `/en/`, `/<slug>/`, and `/en/<slug>/` routes from one source of truth.
- MUST detect translation pairs and report unpaired slugs.
- MUST sort post lists by date descending.
- MUST expose route metadata that later SEO and share components can consume.
</requirements>

## Subtasks
- [x] 4.1 Add typed post domain records for normalized collection entries.
- [x] 4.2 Add language detection from `index.md` and `index.pt-br.md`.
- [x] 4.3 Add slug extraction and translation-pair grouping.
- [x] 4.4 Add route helpers for index routes, post routes, canonical routes, and alternates.
- [x] 4.5 Add sorted post-list helpers by language.
- [x] 4.6 Add tests that lock the expected bilingual route model.

## Implementation Details
Use TechSpec "Core Interfaces" and "Data Flow" as the contract. Replace the behavior currently spread across Gatsby i18n config and page generation with focused helpers under `src/lib`.

### Relevant Files
- `gatsby-node.js` — current slug, language, translation, and sorting logic reference.
- `gatsby-config.js` — current i18n plugin configuration reference.
- `i18n.js` — legacy language registry, broader than V1 scope.
- `src/utils/i18n.js` — legacy translation helpers.
- `src/content/posts/**/index*.md` — collection entries from Task 03.

### Dependent Files
- `src/pages/index.astro` — consumes language-filtered sorted posts in Task 06.
- `src/pages/en/index.astro` — consumes English sorted posts in Task 06.
- `src/pages/[slug].astro` — consumes Portuguese routes in Task 06.
- `src/pages/en/[slug].astro` — consumes English routes in Task 06.
- `src/components/SEO.astro` — consumes canonical and alternate route data in Task 07.
- `scripts/validate-migration.*` — consumes or mirrors route invariants in Task 10.

### Related ADRs
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](../adrs/adr-003.md) — Requires deterministic language and route derivation from paired files.

## Deliverables
- Post normalization helper module.
- Route generation helper module.
- Translation-pair helper behavior.
- Unit tests for language, slug, route, pair, and sorting rules.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for helper behavior against migrated content **(REQUIRED)**

## Tests
- Unit tests:
  - [x] `index.md` derives `en`.
  - [x] `index.pt-br.md` derives `pt-br`.
  - [x] A slug directory derives the same slug for both languages.
  - [x] Portuguese post route resolves to `/<slug>/`.
  - [x] English post route resolves to `/en/<slug>/`.
  - [x] Post lists sort by `date` descending.
  - [x] Missing translation files are reported as unpaired slugs.
- Integration tests:
  - [x] Run helpers against the migrated content and confirm 18 posts and 9 translation pairs.
  - [x] Confirm expected route inventory contains 20 blog routes.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- All later page/SEO/share tasks can consume a single route helper contract.
- Portuguese default and English `/en/` route rules are locked by tests.
