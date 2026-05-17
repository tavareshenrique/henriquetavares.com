import { absoluteUrl } from './site-config';

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

/**
 * hreflang link targets for a single piece of content available in PT-BR and EN.
 * `x-default` follows the site’s Portuguese-default routing.
 */
export function buildBilingualAlternates(
  siteOrigin: string,
  ptPath: string,
  enPath: string
): HreflangAlternate[] {
  return [
    { hreflang: 'pt-BR', href: absoluteUrl(siteOrigin, ptPath) },
    { hreflang: 'en', href: absoluteUrl(siteOrigin, enPath) },
    { hreflang: 'x-default', href: absoluteUrl(siteOrigin, ptPath) },
  ];
}
