# v2-henrique-blog - Product Requirements Document

## Overview

`v2-henrique-blog` is a maintenance-reset migration for Henrique's personal developer blog. It replaces the current Gatsby-based site with a modern static publishing foundation while preserving the current reader experience as closely as possible.

The product outcome for V1 is not a redesign, growth push, or content expansion. V1 exists to remove Gatsby-era maintenance risk while keeping existing readers able to access the same bilingual posts at the same URLs, with the same visual identity and reading behavior. The only intentional user-facing improvement is a proper dark/light mode experience: the site should follow the visitor's system preference by default and let the visitor switch modes at any time.

The migration intentionally removes unused legacy surfaces: RSS, AdSense, newsletter confirmation pages, and broken discussion links copied from the original `overreacted.io` fork.

## Goals

- Preserve 100% of existing published posts: 9 posts in English and Portuguese, 18 Markdown files total.
- Preserve existing public blog URLs with 0 regressions for post and index routes.
- Preserve the current visual style closely enough that the migration does not feel like a redesign.
- Remove Gatsby-related maintenance burden and obsolete fork artifacts.
- Improve reader performance with a Lighthouse Performance score of at least 95 on launch pages.
- Keep authoring friction low so a new Markdown post can be created and committed in under 5 minutes.
- Support dark and light mode with system preference as the default and manual switching available at any time.
- Launch only after manual parity review, automated URL audit, and Lighthouse validation pass.

## User Stories

### Henrique - Author

- As the author, I want every existing Markdown post preserved so that no writing is lost during migration.
- As the author, I want the blog to keep its current URLs so that old links from search engines, social media, and external sites keep working.
- As the author, I want to write future posts in Markdown so that publishing stays close to my existing development workflow.
- As the author, I want unused RSS, AdSense, and newsletter pages removed so that V1 carries only surfaces I intend to maintain.
- As the author, I want the site to remove stale `overreacted.io` references so that the blog fully represents `henriquetavares.com`.

### Technical Reader

- As a reader, I want existing post links to keep working so that bookmarks and search results remain useful.
- As a reader, I want code blocks, images, and article formatting to remain readable so that migrated posts preserve their educational value.
- As a reader, I want the page to load quickly with minimal unnecessary JavaScript so that reading feels instant.
- As a reader, I want to choose dark or light mode so that the blog is comfortable in my current environment.

### Bilingual Reader

- As a Portuguese reader, I want Portuguese content to remain the default experience so that the site behaves as it does today.
- As an English reader, I want English routes to remain available under `/en/` so that the language structure stays predictable.
- As a bilingual reader, I want language metadata and alternate links to be correct so that search engines and sharing previews point to the right language version.

## Core Features

### F1. Content Preservation

All existing posts must be preserved and published in V1. The migrated site must include the same 9 post slugs and both language variants for each post. Post metadata such as title, date, update date, spoiler, tags, and reading-related presentation should remain available where currently used.

### F2. URL and Route Parity

The migrated site must preserve the current public route model. Portuguese remains the default blog experience at `/` and `/<slug>/`. English remains available under `/en/` and `/en/<slug>/`. V1 should not require readers to follow redirects for currently valid URLs.

### F3. Visual and Reading Parity

The migrated blog must retain the current visual identity closely enough to be understood as the same site. Typography, spacing, dark-theme styling, article layout, author/footer presentation, inline links, blockquotes, code blocks, responsive images, and embedded content should remain substantially equivalent.

### F4. Dark and Light Mode

The site must support both dark and light mode. The initial mode should follow the visitor's system preference. Visitors must be able to switch modes at any time. The chosen mode should remain stable while browsing the site.

### F5. Markdown Authoring Workflow

The author must continue writing posts in Markdown. A new post should require only a Markdown file and expected post metadata, without requiring a CMS, dashboard, or external publishing tool.

### F6. Social Sharing Without Broken Discussion Links

The blog should preserve current social sharing capability where it is useful. Broken `overreacted.io` discussion links should be removed from V1 rather than replaced with another discussion surface. Sharing should not imply that comments, RSS, or newsletter features exist.

### F7. Legacy Surface Removal

V1 must remove unused legacy surfaces: RSS feed, AdSense script behavior, `/thanks`, `/confirm`, and stale `overreacted.io` or "Overreacted" branding. These removals are intentional product decisions, not migration regressions.

### F8. Launch Validation

V1 is complete only when launch validation passes. Validation must include a manual parity checklist, automated URL audit for current public routes, and Lighthouse verification against the agreed performance threshold.

## User Experience

### Primary Flow: Existing Reader Opens a Post

1. A reader opens an existing post URL from search, social media, or a bookmark.
2. The same post content appears at the same URL.
3. The page uses the expected language version.
4. Code blocks, images, headings, and article formatting are readable.
5. The page loads quickly and does not show broken fork branding or broken discussion links.
6. The reader can switch between dark and light mode if desired.

### Primary Flow: Henrique Publishes a Future Post

1. Henrique creates a new Markdown post with the required metadata.
2. The post appears in the correct language listing.
3. The post route follows the established URL pattern.
4. The post renders consistently with existing articles.
5. Publishing does not require interacting with a CMS or rebuilding obsolete Gatsby tooling.

### UX Requirements

- The migration must feel like the same blog, not a redesign.
- Portuguese remains the default site language.
- English content remains discoverable and consistently routed under `/en/`.
- Dark/light mode must be available without requiring the visitor to understand site settings.
- Removed surfaces must fail cleanly: there should be no visible links promising RSS, newsletter confirmation, AdSense behavior, or discussion pages that no longer exist.
- The site should be usable on mobile and desktop viewports.

## High-Level Technical Constraints

- Existing public URLs for posts and language indexes must remain valid.
- Existing Markdown content must remain the source of truth for posts.
- The migrated site must support bilingual metadata suitable for search engines and social previews.
- The launch candidate must meet the agreed performance target before release.
- V1 must not introduce a CMS, comment system, newsletter dependency, ad network dependency, or new content product surface.

## Non-Goals (Out of Scope)

- RSS feed restoration is out of scope for V1.
- AdSense is out of scope for V1.
- Newsletter confirmation pages (`/thanks`, `/confirm`) are out of scope for V1.
- New posts during the migration are out of scope for V1.
- A visual redesign is out of scope for V1.
- Search is out of scope for V1.
- Comments or discussion threads are out of scope for V1.
- Post series, related posts, or content recommendation features are out of scope for V1.
- Additional languages beyond English and Portuguese are out of scope for V1.
- A CMS or non-Markdown authoring interface is out of scope for V1.
- Full personal-site expansion with projects, talks, or bio sections is out of scope for V1.

## Phased Rollout Plan

### MVP (Phase 1): Migration Candidate

Included:

- All existing posts migrated.
- Bilingual index and post routes available.
- Current visual style preserved.
- Markdown rendering, code blocks, images, and metadata visible.
- Dark/light mode available with system preference default.
- RSS, AdSense, newsletter pages, and broken discussion links removed.

Success criteria:

- All 18 existing Markdown posts render.
- Manual parity checklist passes for representative EN and PT-BR posts.
- No visible `overreacted.io` or "Overreacted" branding remains.

### Phase 2: Release Candidate

Included:

- Full route parity validation.
- Full visual and content parity review.
- Performance validation.
- Mobile and desktop reading checks.
- Social sharing behavior validated.

Success criteria:

- Automated URL audit reports 0 regressions for current public routes.
- Lighthouse Performance score is at least 95 on the home page and representative post pages.
- No links remain to removed RSS, AdSense, newsletter, or broken discussion surfaces.

### Phase 3: Launch and Stabilization

Included:

- Production release.
- Post-launch verification of primary routes.
- First new Markdown post publishing check when the author is ready.

Success criteria:

- Production routes behave the same as release candidate routes.
- No reader-facing regressions reported after launch.
- First post created after migration can be prepared in under 5 minutes.

## Success Metrics

| Metric | Target | Measurement |
|---|---:|---|
| Existing posts preserved | 18 of 18 | Content inventory comparison |
| Existing post slugs preserved | 9 of 9 | URL audit |
| Broken current public URLs | 0 | Automated URL audit |
| Lighthouse Performance | >= 95 | Lighthouse run on home and representative posts |
| Critical dependency vulnerabilities at launch | 0 | Launch audit |
| New Markdown post preparation time | < 5 minutes | Author self-report |
| Removed legacy surfaces visible in navigation/content | 0 | Manual release checklist |

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| URL parity regression | Existing inbound links and search results break | Require automated URL audit before launch |
| Visual drift turns migration into redesign | Scope expands and launch slows | Use strict visual parity as release criterion |
| Bilingual metadata or routes are inconsistent | Search previews and language discovery degrade | Include EN/PT-BR route and metadata checks in release checklist |
| Removed surfaces create confusing dead ends | Readers see RSS/newsletter/discussion promises that no longer work | Remove all visible links and references to those surfaces |
| Dark/light mode expands scope | Migration becomes a broader theme redesign | Limit the requirement to system default plus manual switch, with no redesign |
| Migration stalls due to scope creep | Gatsby remains in production longer | Keep V1 restricted to maintenance reset and defer all growth features |

## Architecture Decision Records

- [ADR-001: Migrate from Gatsby to Astro](adrs/adr-001.md) - Chose Astro over Next.js and Eleventy as the migration target for the Markdown-only personal blog.
- [ADR-002: Use Strict Parity Maintenance Reset for V1](adrs/adr-002.md) - Chose a strict migration scope with URL/visual parity, intentional removals, and dark/light mode as the only user-facing improvement.

## Open Questions

- No unresolved product questions remain for V1.
- Technical implementation details for theme persistence, content validation, routing, and launch audit design should be handled in the TechSpec.
