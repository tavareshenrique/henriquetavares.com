import { describe, expect, it } from 'vitest';
import {
  auditBlogRoutes,
  buildExpectedBlogRoutes,
  indexPath,
  postPath,
  postRouteMetadata,
} from '../../src/lib/routes';

describe('routes helpers (unit)', () => {
  it('uses "/" for Portuguese index and "/en/" for English index', () => {
    expect(indexPath('pt-br')).toBe('/');
    expect(indexPath('en')).toBe('/en/');
  });

  it('resolves Portuguese posts to /<slug>/', () => {
    expect(postPath('hello-world', 'pt-br')).toBe('/hello-world/');
  });

  it('resolves English posts to /en/<slug>/', () => {
    expect(postPath('hello-world', 'en')).toBe('/en/hello-world/');
  });

  it('exposes alternate locale paths on PostRoute metadata', () => {
    const pt = postRouteMetadata('nlw-4', 'pt-br');
    expect(pt.path).toBe('/nlw-4/');
    expect(pt.canonical).toBe('/nlw-4/');
    expect(pt.alternate).toBe('/en/nlw-4/');

    const en = postRouteMetadata('nlw-4', 'en');
    expect(en.path).toBe('/en/nlw-4/');
    expect(en.alternate).toBe('/nlw-4/');
  });

  it('buildExpectedBlogRoutes returns index routes plus both locales per slug', () => {
    const routes = buildExpectedBlogRoutes(['zebra', 'alpha']);
    expect(routes).toEqual([
      '/',
      '/en/',
      '/alpha/',
      '/en/alpha/',
      '/zebra/',
      '/en/zebra/',
    ]);
  });

  it('auditBlogRoutes carries unpaired slugs and builds expected route inventory', () => {
    const posts = [
      { slug: 'a', lang: 'en' as const },
      { slug: 'a', lang: 'pt-br' as const },
      { slug: 'b', lang: 'en' as const },
    ];
    const audit = auditBlogRoutes({ posts, unpairedSlugs: ['b'] });
    expect(audit.unpairedSlugs).toEqual(['b']);
    expect(audit.expectedRoutes).toEqual(buildExpectedBlogRoutes(['a', 'b']));
    expect(audit.missingRoutes).toEqual([]);
    expect(audit.forbiddenReferences).toEqual([]);
  });
});
