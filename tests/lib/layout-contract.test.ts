import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
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

describe('BaseLayout analytics wiring', () => {
  const file = path.join(repoRoot, 'src', 'layouts', 'BaseLayout.astro');
  let src: string;
  beforeAll(() => {
    src = readFileSync(file, 'utf8');
  });

  it('imports Analytics from @vercel/analytics/astro', () => {
    expect(src).toContain("from '@vercel/analytics/astro'");
    expect(src).toContain('Analytics');
  });

  it('renders the <Analytics> component inside <head>', () => {
    expect(src).toContain('<Analytics');
    const headOpen = src.indexOf('<head>');
    const headClose = src.indexOf('</head>');
    const analyticsPos = src.indexOf('<Analytics');
    expect(analyticsPos).toBeGreaterThan(headOpen);
    expect(analyticsPos).toBeLessThan(headClose);
  });

  it('filters out /layout-verify/ events via beforeSend', () => {
    expect(src).toContain('/layout-verify/');
    expect(src).toContain('return null');
  });
});

describe('layout header title parity', () => {
  function extractHeaderTitleBlock(src: string): string {
    const start = src.indexOf('<div slot="header-title">');
    expect(start).toBeGreaterThanOrEqual(0);
    const end = src.indexOf('</div>', start);
    expect(end).toBeGreaterThan(start);
    return src.slice(start, end + '</div>'.length);
  }

  it('keeps the site-title header typography/color tokens aligned', () => {
    const blogLayoutFile = path.join(
      repoRoot,
      'src',
      'layouts',
      'BlogLayout.astro'
    );
    const postLayoutFile = path.join(
      repoRoot,
      'src',
      'layouts',
      'PostLayout.astro'
    );
    const blogLayoutSrc = readFileSync(blogLayoutFile, 'utf8');
    const postLayoutSrc = readFileSync(postLayoutFile, 'utf8');

    expect(extractHeaderTitleBlock(blogLayoutSrc)).toBe(
      extractHeaderTitleBlock(postLayoutSrc)
    );
  });
});
