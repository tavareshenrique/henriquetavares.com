import { SITE_ORIGIN, SITE_TWITTER_CREATOR, absoluteUrl } from './site-config';

export type ShareNetworkId =
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'reddit'
  | 'whatsapp';

export interface StaticShareLink {
  network: ShareNetworkId;
  href: string;
}

/**
 * Outbound share targets (static anchors, no client JS).
 * URLs use `pagePath` only — callers must pass the real canonical path for the page.
 */
export function buildStaticShareLinks(input: {
  pagePath: string;
  shareTitle: string;
  siteOrigin?: string;
  twitterVia?: string;
}): StaticShareLink[] {
  const origin = input.siteOrigin ?? SITE_ORIGIN;
  const pageUrl = absoluteUrl(origin, input.pagePath);
  const via = (input.twitterVia ?? SITE_TWITTER_CREATOR).replace(/^@/, '');

  const title = input.shareTitle;

  const twitter = new URLSearchParams();
  twitter.set('url', pageUrl);
  twitter.set('text', title);
  if (via) {
    twitter.set('via', via);
  }

  const reddit = new URLSearchParams();
  reddit.set('url', pageUrl);
  reddit.set('title', title);

  const whatsappText = `${title} ${pageUrl}`;

  return [
    {
      network: 'facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    },
    {
      network: 'twitter',
      href: `https://twitter.com/intent/tweet?${twitter.toString()}`,
    },
    {
      network: 'linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    },
    {
      network: 'reddit',
      href: `https://www.reddit.com/submit?${reddit.toString()}`,
    },
    {
      network: 'whatsapp',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
    },
  ];
}
