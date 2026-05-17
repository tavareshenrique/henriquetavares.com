---
status: completed
title: Strip Gatsby runtime and scaffold Astro baseline
type: infra
complexity: high
dependencies: []
---

# Task 01: Strip Gatsby runtime and scaffold Astro baseline

## Overview
Replace the Gatsby runtime foundation with an Astro project baseline while preserving all Markdown content and reference files needed for parity work. This task creates the new build surface that every later migration task depends on.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add an Astro baseline capable of running development and production builds.
- MUST add Tailwind support as the selected styling foundation.
- MUST preserve `src/pages/**/index*.md` and co-located post assets until Task 03 migrates them.
- MUST preserve Gatsby templates/components/styles as references until replacement tasks complete.
- MUST remove or disable Gatsby runtime scripts so future work targets Astro, not Gatsby.
- SHOULD keep static assets such as `static/robots.txt`, profile images, flags, and logo assets available for later tasks.
</requirements>

## Subtasks
- [ ] 1.1 Establish the Astro project configuration and baseline source layout.
- [ ] 1.2 Replace Gatsby development/build scripts with Astro-oriented scripts.
- [ ] 1.3 Add Tailwind project configuration needed by later layout work.
- [ ] 1.4 Preserve existing Markdown post folders and reference React/Gatsby files for migration comparison.
- [ ] 1.5 Remove or quarantine Gatsby runtime entry points without deleting content needed by later tasks.
- [ ] 1.6 Confirm the new baseline can install dependencies and produce an initial build.

## Implementation Details
Create the Astro/Tailwind baseline described in the TechSpec "System Architecture" and "Development Sequencing" sections. Treat Gatsby files as deprecated references until their behavior is replaced in later tasks.

### Relevant Files
- `package.json` — Gatsby scripts and dependencies must become Astro-oriented.
- `yarn.lock` — dependency lockfile likely updates with the package manager.
- `gatsby-config.js` — source of current metadata, Markdown plugins, feed, manifest, and analytics behavior.
- `gatsby-node.js` — source of current route/page-generation behavior.
- `gatsby-browser.js` — current browser runtime behavior reference.
- `src/html.js` — current document/theme/AdSense behavior to replace later.
- `src/pages/**/index*.md` — Markdown posts that must not be deleted in this task.
- `src/templates/blog-index.js` — index layout reference.
- `src/templates/blog-post.js` — post layout and metadata reference.
- `src/components/Layout.js` — shell and language-toggle reference.
- `src/utils/global.scss` — visual/code/theme reference.
- `src/utils/typography.js` — Typography.js reference, not a runtime to preserve.

### Dependent Files
- `src/content/config.ts` — created in Task 03 after Astro baseline exists.
- `src/lib/posts.ts` — created in Task 04 after content moves.
- `src/layouts/*.astro` — created in Task 05 from the baseline.
- `src/pages/*.astro` — created in Task 06 from the baseline.

### Related ADRs
- [ADR-001: Migrate from Gatsby to Astro](../adrs/adr-001.md) — Establishes Astro as the migration target.
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](../adrs/adr-004.md) — Requires Tailwind baseline.

## Deliverables
- Astro project configuration and baseline source structure.
- Updated package scripts for Astro development and build.
- Tailwind configuration available for later styling tasks.
- Existing Markdown content and reference files preserved.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for Astro baseline build **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] Verify package scripts reference Astro commands instead of Gatsby commands.
  - [ ] Verify the configured source directories required by later tasks exist.
  - [ ] Verify no Markdown post directories are deleted by the baseline migration.
- Integration tests:
  - [ ] Run the project build command and confirm the Astro baseline builds successfully.
  - [ ] Run the development command smoke check if supported by the project scripts.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Astro baseline build succeeds.
- Gatsby runtime is no longer the active development/build target.
- All existing Markdown posts and co-located assets remain available for Task 03.
