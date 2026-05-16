/**
 * Single source of truth for public blog URL paths (Portuguese default + English under `/en/`).
 */

export type Lang = 'pt-br' | 'en';

/** Portuguese home */
export const INDEX_PT_PATH = '/';

/** English home */
export const INDEX_EN_PATH = '/en/';

export interface PostRoute {
  slug: string;
  lang: Lang;
  /** URL path for this localized post */
  path: string;
  /** Canonical URL path for this document (same as `path` for static parity pages) */
  canonical: string;
  /** Same post in the other locale */
  alternate: string;
}

export interface RouteAuditResult {
  expectedRoutes: string[];
  missingRoutes: string[];
  forbiddenReferences: string[];
  unpairedSlugs: string[];
}

export function indexPath(lang: Lang): string {
  return lang === 'pt-br' ? INDEX_PT_PATH : INDEX_EN_PATH;
}

export function postPath(slug: string, lang: Lang): string {
  const encoded = encodeUriSegments(slug);
  return lang === 'pt-br' ? `/${encoded}/` : `/en/${encoded}/`;
}

export function postRouteMetadata(slug: string, lang: Lang): PostRoute {
  const path = postPath(slug, lang);
  const alternateLang: Lang = lang === 'pt-br' ? 'en' : 'pt-br';
  return {
    slug,
    lang,
    path,
    canonical: path,
    alternate: postPath(slug, alternateLang),
  };
}

/**
 * All blog routes: both index pages plus every localized post path for the given slugs.
 */
export function buildExpectedBlogRoutes(slugs: string[]): string[] {
  const sorted = [...new Set(slugs)].sort((a, b) => a.localeCompare(b));
  const routes: string[] = [INDEX_PT_PATH, INDEX_EN_PATH];
  for (const slug of sorted) {
    routes.push(postPath(slug, 'pt-br'));
    routes.push(postPath(slug, 'en'));
  }
  return routes;
}

export function auditBlogRoutes(input: {
  posts: { slug: string; lang: Lang }[];
  unpairedSlugs: string[];
}): RouteAuditResult {
  const uniqueSlugs = [...new Set(input.posts.map((p) => p.slug))];
  return {
    expectedRoutes: buildExpectedBlogRoutes(uniqueSlugs),
    missingRoutes: [],
    forbiddenReferences: [],
    unpairedSlugs: [...input.unpairedSlugs].sort((a, b) => a.localeCompare(b)),
  };
}

function encodeUriSegments(slug: string): string {
  return slug
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}
