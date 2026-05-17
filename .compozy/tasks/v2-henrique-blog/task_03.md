---
status: completed
title: Migrate Markdown content into Astro collections
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_02
---

# Task 03: Migrate Markdown content into Astro collections

## Overview
Move all existing bilingual Markdown posts into Astro content collections while preserving one folder per post and co-located assets. This task establishes the content source of truth for every route and layout task that follows.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST move 18 Markdown files into `src/content/posts/<slug>/index.md` and `index.pt-br.md`.
- MUST preserve co-located images and other post assets beside the migrated Markdown files.
- MUST define an Astro content collection schema for `title`, `date`, `spoiler`, optional `tags`, and optional `updateDate`.
- MUST preserve the semantic meaning that `index.md` is English and `index.pt-br.md` is Portuguese.
- MUST not rewrite post content except where required to keep asset references valid.
- SHOULD document any content files that need later link normalization.
</requirements>

## Subtasks
- [x] 3.1 Create the posts content collection directory structure.
- [x] 3.2 Move each slug folder's Markdown files and local assets into the collection.
- [x] 3.3 Add frontmatter schema validation for all existing fields.
- [x] 3.4 Confirm all 9 slugs have both English and Portuguese files.
- [x] 3.5 Confirm image-heavy and code-heavy posts retain their local asset references.
- [x] 3.6 Record any Markdown links that require later route normalization.

## Implementation Details
Follow TechSpec "Data Models" and ADR-003. Do not split content by locale and do not keep posts under Gatsby `src/pages` as the long-term content source.

### Relevant Files
- `src/pages/**/index.md` — English source posts.
- `src/pages/**/index.pt-br.md` — Portuguese source posts.
- `src/pages/**/{*.png,*.jpg,*.jpeg,*.gif}` — co-located post assets.
- `src/content/config.ts` — target content collection schema.
- `gatsby-config.js` — current Markdown plugin behavior reference.
- `gatsby-node.js` — current filename/language derivation reference.

### Dependent Files
- `src/lib/posts.ts` — consumes collection entries in Task 04.
- `src/lib/routes.ts` — derives routes from collection metadata in Task 04.
- `src/pages/[slug].astro` and `src/pages/en/[slug].astro` — render migrated content in Task 06.
- `scripts/validate-migration.*` — audits content invariants in Task 10.

### Related ADRs
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](../adrs/adr-003.md) — Defines the content organization decision.

## Deliverables
- `src/content/posts/<slug>/index.md` and `index.pt-br.md` for all 9 slugs.
- Co-located assets preserved under each post slug directory.
- Astro content collection schema for post frontmatter.
- Content inventory confirming 18 entries and 9 translation pairs (see `tests/content/posts-collection.test.ts`).
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for content collection validation **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify all 18 Markdown entries satisfy the content schema.
  - [x] Verify each of the 9 slugs has exactly one English and one Portuguese file.
  - [x] Verify `date` and `updateDate` fields parse consistently from existing frontmatter.
  - [x] Verify optional `tags` defaults to an empty list when absent.
- Integration tests:
  - [x] Run the Astro content collection validation through the project build.
  - [x] Inspect one image-heavy post and confirm its co-located assets are still resolvable.
  - [x] Inspect one code-heavy post and confirm fenced code remains in Markdown.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- 18 content entries are available in Astro.
- 9 paired slugs are available in Astro.
- Existing post assets remain co-located with their post content.
