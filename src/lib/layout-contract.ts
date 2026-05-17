import type { Lang } from './routes';

/** Marker on `<html>` — asserted by layout tests */
export const LAYOUT_STYLE_MARKER_ATTR = 'data-blog-styles';
export const LAYOUT_STYLE_MARKER_VALUE = 'v2';

export const SITE_TITLE = 'Henrique Tavares';

export interface BaseDocumentProps {
  title: string;
  lang: Lang;
  /** Active route path for parity with bilingual URLs */
  route: string;
}

/** Regions rendered by `PostLayout` for structural tests */
export const POST_LAYOUT_REGIONS = [
  'article-heading',
  'article-metadata',
  'article-body',
  'article-author',
  'article-site-footer',
] as const;

export type PostLayoutRegion = (typeof POST_LAYOUT_REGIONS)[number];

export function normalizeRoutePath(route: string): string {
  const trimmed = route.trim();
  if (!trimmed || trimmed === '/') {
    return '/';
  }
  const withSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
}

export function assertBaseDocumentProps(
  props: Partial<BaseDocumentProps>
): asserts props is BaseDocumentProps {
  if (typeof props.title !== 'string' || !props.title.trim()) {
    throw new Error('Layout requires a non-empty title string');
  }
  if (props.lang !== 'en' && props.lang !== 'pt-br') {
    throw new Error('Layout requires lang "en" | "pt-br"');
  }
  if (typeof props.route !== 'string' || !props.route.trim()) {
    throw new Error('Layout requires a non-empty route string');
  }
}
