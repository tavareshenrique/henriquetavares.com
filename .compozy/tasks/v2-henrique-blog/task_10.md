---
status: completed
title: Add migration validation audit
type: test
complexity: medium
dependencies:
  - task_04
  - task_09
---

# Task 10: Add migration validation audit

## Overview
Add a focused migration audit that verifies the content, route, translation, and legacy-cleanup invariants required by the PRD and TechSpec. This task turns the migration's highest-risk assumptions into repeatable checks that can run with lint and build.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST audit that 18 post entries exist.
- MUST audit that 9 slugs have paired English and Portuguese entries.
- MUST audit expected public route inventory for `/`, `/en/`, `/<slug>/`, and `/en/<slug>/`.
- MUST audit absence of removed live surfaces and forbidden legacy references.
- MUST expose package scripts for lint, build, audit, and combined validation.
- MUST scope forbidden-reference scanning so intentional historical content is handled deliberately.
- SHOULD produce actionable failure messages for missing content, route mismatches, and legacy leftovers.
</requirements>

## Subtasks
- [x] 10.1 Add migration audit script or test suite.
- [x] 10.2 Add content count and translation-pair checks.
- [x] 10.3 Add route inventory checks.
- [x] 10.4 Add forbidden legacy-reference checks.
- [x] 10.5 Add package scripts for audit and combined validation.
- [x] 10.6 Verify validation fails on known bad inputs and passes on the migrated site.

## Implementation Details
Follow TechSpec "Testing Approach" and "Monitoring and Observability". The audit should reuse or mirror route/content helper rules from Task 04 instead of hard-coding a disconnected route model.

### Relevant Files
- `package.json` — add audit and validation scripts.
- `src/content/posts/**/index*.md` — content inventory source.
- `src/lib/posts.ts` — content normalization behavior.
- `src/lib/routes.ts` — route generation behavior.
- `src/pages/**/*.astro` — generated route surface.
- `gatsby-config.js`, `src/html.js`, `now.json` — examples of forbidden legacy surfaces before cleanup.
- `README.md` and `src/content/posts/hello-world/**` — may contain historical references that need deliberate scan scoping.

### Dependent Files
- `src/content/config.ts` — validates frontmatter before audit.
- `src/pages/index.astro` and `src/pages/en/index.astro` — route inventory targets.
- `src/pages/[slug].astro` and `src/pages/en/[slug].astro` — route inventory targets.
- `src/components/ShareLinks.astro` — forbidden discussion/share reference target.
- `src/layouts/BaseLayout.astro` — forbidden AdSense/RSS reference target.

### Related ADRs
- [ADR-005: Use Static Share Links and Focused Migration Validation](../adrs/adr-005.md) — Defines focused automated validation scope.
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](../adrs/adr-003.md) — Defines content and pairing invariants.

## Deliverables
- Migration audit script or test suite.
- Package scripts for audit and combined validation.
- Content, route, translation-pair, and forbidden-reference checks.
- Clear validation output for failures.
- Unit tests with 80%+ coverage **(REQUIRED)**
- Integration tests for lint/build/audit validation **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Verify audit passes with 18 entries and 9 paired slugs.
  - [x] Verify audit fails when a translation pair is missing.
  - [x] Verify audit reports the exact missing route when route inventory is incomplete.
  - [x] Verify audit flags `adsbygoogle` in live source/output.
  - [x] Verify audit flags live `react-share` usage after static sharing is required.
  - [x] Verify audit handles intentionally scoped historical content references as designed.
- Integration tests:
  - [x] Run lint, build, and audit through the combined validation script.
  - [x] Confirm the audit passes on the completed migrated site.
  - [x] Confirm validation output is actionable when a forbidden reference is introduced.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Combined validation script exits 0 on the migrated site.
- Audit confirms 18 posts, 9 pairs, expected routes, and no forbidden live legacy references.
- Validation failures identify the specific invariant and file involved.
