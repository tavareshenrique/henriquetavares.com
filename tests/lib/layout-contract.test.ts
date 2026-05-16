import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  LAYOUT_STYLE_MARKER_ATTR,
  LAYOUT_STYLE_MARKER_VALUE,
  POST_LAYOUT_REGIONS,
  SITE_TITLE,
  assertBaseDocumentProps,
  normalizeRoutePath,
} from '../../src/lib/layout-contract';

const repoRoot = path.resolve(__dirname, '..', '..');

describe('layout-contract', () => {
  it('normalizes routes with trailing slashes', () => {
    expect(normalizeRoutePath('/')).toBe('/');
    expect(normalizeRoutePath('hello-world')).toBe('/hello-world/');
    expect(normalizeRoutePath('/hello-world')).toBe('/hello-world/');
    expect(normalizeRoutePath('  /tags/foo  ')).toBe('/tags/foo/');
  });

  it('assertBaseDocumentProps accepts valid shells', () => {
    expect(() =>
      assertBaseDocumentProps({ title: 'T', lang: 'en', route: '/' })
    ).not.toThrow();
    expect(() =>
      assertBaseDocumentProps({ title: 'Olá', lang: 'pt-br', route: '/post/' })
    ).not.toThrow();
  });

  it('assertBaseDocumentProps rejects invalid shells', () => {
    expect(() =>
      assertBaseDocumentProps({ title: '', lang: 'en', route: '/' })
    ).toThrow(/non-empty title/);
    expect(() =>
      assertBaseDocumentProps({ title: '   ', lang: 'en', route: '/' })
    ).toThrow(/non-empty title/);
    expect(() =>
      assertBaseDocumentProps({
        title: 'x',
        // @ts-expect-error — deliberate invalid locale for runtime guard
        lang: 'fr',
        route: '/',
      })
    ).toThrow(/lang/);
    expect(() =>
      assertBaseDocumentProps({ title: 'x', lang: 'en', route: ' ' })
    ).toThrow(/route/);
  });

  it('declares stable regions for article shells', () => {
    expect(POST_LAYOUT_REGIONS).toContain('article-heading');
    expect(POST_LAYOUT_REGIONS).toContain('article-body');
    expect(SITE_TITLE.length).toBeGreaterThan(3);
    expect(LAYOUT_STYLE_MARKER_ATTR).toBe('data-blog-styles');
    expect(LAYOUT_STYLE_MARKER_VALUE.length).toBeGreaterThan(0);
  });
});

describe('BaseLayout stylesheet wiring', () => {
  it('imports the Tailwind/global stylesheet entry', () => {
    const file = path.join(repoRoot, 'src', 'layouts', 'BaseLayout.astro');
    const src = readFileSync(file, 'utf8');
    expect(src).toContain("'../styles/global.css'");
    expect(src).toContain('LAYOUT_STYLE_MARKER_ATTR');
  });
});
