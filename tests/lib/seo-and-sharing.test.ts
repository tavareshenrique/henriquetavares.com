import { describe, expect, it } from 'vitest';
import { postPath, postRouteMetadata } from '../../src/lib/routes';
import { buildBilingualAlternates } from '../../src/lib/seo-alternates';
import { buildStaticShareLinks } from '../../src/lib/share-links';
import {
  SITE_ORIGIN,
  absoluteUrl,
  siteDescriptionForLang,
} from '../../src/lib/site-config';
import { loadPostEntriesFromDisk } from '../helpers/load-post-entries';

describe('SEO and static sharing (unit)', () => {
  it('uses /<slug>/ as the Portuguese post canonical path', () => {
    const { slugs } = loadPostEntriesFromDisk();
    for (const slug of slugs) {
      expect(postRouteMetadata(slug, 'pt-br').canonical).toBe(`/${slug}/`);
      expect(absoluteUrl(SITE_ORIGIN, postPath(slug, 'pt-br'))).toBe(
        `${SITE_ORIGIN}/${slug}/`
      );
    }
  });

  it('uses /en/<slug>/ as the English post canonical path', () => {
    const { slugs } = loadPostEntriesFromDisk();
    for (const slug of slugs) {
      expect(postRouteMetadata(slug, 'en').canonical).toBe(`/en/${slug}/`);
      expect(absoluteUrl(SITE_ORIGIN, postPath(slug, 'en'))).toBe(
        `${SITE_ORIGIN}/en/${slug}/`
      );
    }
  });

  it('lists hreflang alternates for both locales plus x-default', () => {
    const slug = 'hello-world';
    const pt = postPath(slug, 'pt-br');
    const en = postPath(slug, 'en');
    const alts = buildBilingualAlternates(SITE_ORIGIN, pt, en);
    expect(alts).toEqual([
      {
        hreflang: 'pt-BR',
        href: `${SITE_ORIGIN}${pt}`,
      },
      {
        hreflang: 'en',
        href: `${SITE_ORIGIN}${en}`,
      },
      {
        hreflang: 'x-default',
        href: `${SITE_ORIGIN}${pt}`,
      },
    ]);
  });

  it('encodes the page URL and title in static share targets', () => {
    const pagePath = '/hello-world/';
    const shareTitle = 'Hello & goodbye';
    const links = buildStaticShareLinks({
      pagePath,
      shareTitle,
      siteOrigin: 'https://henriquetavares.com',
    });

    const pageUrl = 'https://henriquetavares.com/hello-world/';
    const facebook = links.find((l) => l.network === 'facebook')!;
    expect(facebook.href).toContain(`u=${encodeURIComponent(pageUrl)}`);

    const twitter = new URL(links.find((l) => l.network === 'twitter')!.href);
    expect(twitter.searchParams.get('url')).toBe(pageUrl);
    expect(twitter.searchParams.get('text')).toBe(shareTitle);

    const reddit = new URL(links.find((l) => l.network === 'reddit')!.href);
    expect(reddit.searchParams.get('url')).toBe(pageUrl);
    expect(reddit.searchParams.get('title')).toBe(shareTitle);

    const wa = new URL(links.find((l) => l.network === 'whatsapp')!.href);
    expect(decodeURIComponent(wa.searchParams.get('text')!)).toBe(
      `${shareTitle} ${pageUrl}`
    );
  });

  it('never embeds overreacted.io in generated share links', () => {
    const links = buildStaticShareLinks({
      pagePath: '/using-environment-variable-in-react-native/',
      shareTitle: 'Test',
      siteOrigin: SITE_ORIGIN,
    });
    for (const { href } of links) {
      expect(href.toLowerCase()).not.toContain('overreacted.io');
    }
  });

  it('exposes site-level descriptions per locale (index pages)', () => {
    expect(siteDescriptionForLang('pt-br').length).toBeGreaterThan(20);
    expect(siteDescriptionForLang('en').length).toBeGreaterThan(20);
  });
});
