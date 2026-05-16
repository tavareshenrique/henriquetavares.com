import type { Lang } from './routes';

export const SITE_ORIGIN = 'https://henriquetavares.com';

export const SITE_TWITTER_CREATOR = '@ihenrits';

/** Path under `SITE_ORIGIN` for default OG / Twitter images */
export const DEFAULT_OG_IMAGE_PATH = '/profile-pic.jpg';

const SITE_DESCRIPTION: Record<Lang, string> = {
  'pt-br':
    'Blog pessoal do Henrique Tavares — artigos sobre desenvolvimento, React, React Native e engenharia de software.',
  en: 'Henrique Tavares — articles on development, React, React Native, and software engineering.',
};

export function siteDescriptionForLang(lang: Lang): string {
  return SITE_DESCRIPTION[lang];
}

export function absoluteUrl(siteOrigin: string, pathname: string): string {
  const origin = siteOrigin.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${path}`;
}
