# v2-henrique-blog - Technical Specification

## Executive Summary

Migrate the blog from Gatsby 2 to Astro with a static, content-collection architecture. Markdown posts move from `src/pages/<slug>/index*.md` to `src/content/posts/<slug>/index*.md`, keeping co-located assets and deriving language-aware routes from the content collection. Astro pages generate the Portuguese default routes (`/`, `/<slug>/`) and English routes (`/en/`, `/en/<slug>/`) while preserving URL parity and close visual continuity.

The primary trade-off is using Tailwind to rebuild styling while keeping the migrated blog recognizably close to the current design. Tailwind provides a cleaner long-term styling foundation, and the migration should preserve close visual continuity without recreating Typography.js exactly. Minor typography and spacing differences are acceptable when they simplify migration and do not harm readability. Client JavaScript stays minimal: dark/light mode uses a pre-paint inline script, and social sharing uses static links instead of a React island.

## System Architecture

### Component Overview

| Component | Responsibility | Boundaries |
|---|---|---|
| Astro content collection | Owns Markdown post ingestion and frontmatter validation | Reads `src/content/posts/**/index*.md`; does not own route formatting |
| Post library | Normalizes collection entries into typed post/domain records | Derives slug, language, route, translation pair, sorted lists |
| Route library | Single source of truth for blog URL generation | Generates `/`, `/en/`, `/<slug>/`, `/en/<slug>/` |
| Page routes | Render index, post pages, and 404 | Use post/route helpers; contain no content parsing logic |
| Layouts | Provide base document, article layout, head metadata, theme bootstrap | No content querying except props passed from pages |
| Tailwind + global styles | Preserve visual continuity, typography, code blocks, themes | Tailwind for layout/components; global CSS for Markdown/prose/code |
| Theme script + toggle | Apply system preference before paint and persist manual override | Uses `localStorage` and `prefers-color-scheme`; no React hydration |
| Static share links | Render outbound social sharing links | No `react-share`, no discussion URL |
| Validation script | Checks migration invariants | Content count, route count, paired translations, forbidden legacy references |

### Data Flow

1. Markdown files live under `src/content/posts/<slug>/`.
2. Astro content collections validate frontmatter.
3. `posts.ts` maps raw entries into `PostEntry` records.
4. `routes.ts` derives canonical routes and language alternates.
5. `index.astro`, `en/index.astro`, `[slug].astro`, and `en/[slug].astro` render sorted post lists or individual posts.
6. Layouts receive post metadata and route data for SEO/social metadata.
7. Validation scripts inspect content and source/output invariants before release.

## Implementation Design

### Core Interfaces

```ts
export type Lang = "pt-br" | "en";

export interface PostEntry {
  slug: string;
  lang: Lang;
  route: string;
  sourcePath: string;
  title: string;
  date: Date;
  spoiler: string;
  tags: string[];
  updateDate?: Date;
}
```

```go
type PostRoute struct {
	Slug      string
	Lang      string
	Path      string
	Canonical string
	Alternate string
}
```

```ts
export interface RouteAuditResult {
  expectedRoutes: string[];
  missingRoutes: string[];
  forbiddenReferences: string[];
  unpairedSlugs: string[];
}
```

### Data Models

| Model | Fields | Notes |
|---|---|---|
| Post frontmatter | `title`, `date`, `spoiler`, optional `tags`, optional `updateDate` | Schema validates all Markdown entries |
| Post entry | slug, lang, route, source path, normalized frontmatter | Derived from content collection |
| Translation pair | slug, `pt-br` entry, `en` entry | Required for all 9 post slugs |
| Route audit result | expected routes, missing routes, forbidden references, unpaired slugs | Used by validation script |

### API Endpoints

No API endpoints are required. The site is static and has no backend, CMS, comment system, newsletter integration, or ad integration in V1.

## Integration Points

No external runtime integrations are required for V1. Deployment can stay static-host compatible. RSS, AdSense, newsletter pages, and discussion links are removed rather than integrated.

## Impact Analysis

| Component | Impact Type | Description and Risk | Required Action |
|---|---|---|---|
| `package.json` | Modified | Replace Gatsby stack with Astro, Tailwind, Sass, Markdown/rehype tooling | Update scripts and dependencies |
| `gatsby-config.js` / `gatsby-node.js` | Deprecated | Gatsby config and page generation no longer used | Remove after Astro routes replace behavior |
| `src/pages/**/index*.md` | Moved | 18 Markdown files move to content collection structure | Preserve content and co-located assets |
| Blog index template | Replaced | Gatsby GraphQL list becomes Astro index pages | Recreate EN/PT-BR lists from post helpers |
| Blog post template | Replaced | Gatsby post template becomes Astro post route pages | Preserve article layout, metadata, prev/next if retained |
| Layout/SEO components | Replaced | React Helmet and Gatsby layout become Astro layouts/components | Rebuild metadata in Astro head |
| `src/utils/global.scss` | Reworked | Existing visual rules move into Tailwind/global CSS | Preserve close prose/code/theme continuity without exact Typography.js parity |
| `src/html.js` | Removed | AdSense and forced dark body are removed | Replace with Astro base layout and theme script |
| `Share.js` | Replaced | React sharing becomes static links | Remove `react-share` dependency |
| `/thanks`, `/confirm`, RSS | Removed | Product-approved surface removals | Ensure no links point to them |
| Validation tooling | New | Content/URL/legacy-reference audit | Add script to project commands |

## Testing Approach

### Unit Tests

- Test route generation for `/`, `/en/`, `/<slug>/`, and `/en/<slug>/`.
- Test language derivation from `index.md` and `index.pt-br.md`.
- Test paired-translation detection: exactly 9 paired slugs and 18 total posts.
- Test forbidden reference detection for `overreacted.io`, RSS links, AdSense markers, `/thanks`, `/confirm`, and discussion link labels.
- Test theme preference helper behavior where logic is extracted from the inline script.

### Integration Tests

- Build the Astro site successfully.
- Run validation script after build or against source content.
- Verify generated or expected route inventory includes all current routes.
- Verify representative Markdown rendering for code-heavy and image-heavy posts.
- Verify static share URLs are generated without `overreacted.io` discussion links.

## Development Sequencing

### Build Order

1. Initialize Astro/Tailwind project baseline - no dependencies.
2. Configure content collection schema - depends on step 1.
3. Move Markdown posts and co-located assets into `src/content/posts/<slug>/` - depends on step 2.
4. Implement post and route helper modules - depends on step 3.
5. Build Portuguese and English index routes - depends on step 4.
6. Build Portuguese and English post routes - depends on step 4.
7. Recreate base, blog, and post layouts with Tailwind/global styles - depends on steps 5 and 6.
8. Implement SEO/social metadata components - depends on steps 4 and 7.
9. Implement dark/light pre-paint script and theme toggle - depends on step 7.
10. Replace social sharing with static share links - depends on steps 6 and 8.
11. Remove Gatsby-only surfaces and dependencies - depends on steps 5 through 10.
12. Add validation script for content, routes, and forbidden references - depends on steps 3, 4, and 11.
13. Run lint, build, and validation audit - depends on step 12.
14. Perform manual continuity checks for representative pages - depends on step 13.

### Technical Dependencies

- Astro content collections.
- Tailwind CSS.
- Sass or plain CSS support for global article/code styles.
- Remark/rehype plugins for heading slugs, autolinks, smartypants, external links, responsive iframe handling, and Prism-compatible code highlighting.
- No runtime external services.

## Monitoring and Observability

This is a static site, so operational observability is release-oriented:

- Build duration from CI logs; target `< 20s`.
- Validation script result; target 0 missing routes, 0 unpaired slugs, 0 forbidden references.
- Lighthouse Performance on home page and representative posts; PRD target `>= 95`.
- Post-launch manual smoke check for `/`, `/en/`, representative PT-BR post, representative EN post, and 404.

## Technical Considerations

### Key Decisions

- **Content architecture:** Astro content collections with one folder per slug and paired language files.
- **Routing:** Central route helper derives all public paths; page files render the two language variants explicitly.
- **Styling:** Tailwind is the main styling system; global CSS handles Markdown prose, code highlighting, and theme tokens. Exact Typography.js parity is not required.
- **Theme:** Pre-paint inline script prevents initial theme flash and persists manual override.
- **Sharing:** Static share links replace `react-share` and remove discussion links.
- **Validation:** Automated scope is URL/content audit plus lint/build; Lighthouse and visual continuity remain release-gate checks.

### Known Risks

- **Visual drift from Tailwind migration:** Mitigate with representative page continuity checks and global Markdown styles. Minor differences are acceptable if readability and the overall identity remain intact.
- **Relative image breakage:** Mitigate by preserving co-located assets and checking image-heavy posts.
- **Bilingual route mismatch:** Mitigate by central route helpers and route audit assertions.
- **Markdown code highlight mismatch:** Mitigate by selecting Prism-compatible highlighting and checking fenced code with line highlights.
- **Theme flash:** Mitigate by placing the theme script before first paint.
- **Legacy reference leakage:** Mitigate with forbidden-reference scan.

## Architecture Decision Records

- [ADR-001: Migrate from Gatsby to Astro](adrs/adr-001.md) - Chose Astro over Next.js and Eleventy as the migration target for the Markdown-only personal blog.
- [ADR-002: Use Strict Parity Maintenance Reset for V1](adrs/adr-002.md) - Chose strict URL/visual parity, intentional removals, and dark/light mode as the only user-facing improvement.
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](adrs/adr-003.md) - Chose `src/content/posts/<slug>/index*.md` to preserve authoring ergonomics and assets.
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](adrs/adr-004.md) - Chose Tailwind for close visual continuity without exact Typography.js parity, plus a pre-paint theme script for dark/light mode.
- [ADR-005: Use Static Share Links and Focused Migration Validation](adrs/adr-005.md) - Chose static social sharing and focused automated checks for route/content parity and legacy cleanup.
