import type { PostFrontmatter } from '../content/post-schema';
import type { Lang } from './routes';
import { postPath } from './routes';

export type { Lang };

const EN_FILE = 'index.md';
const PT_FILE = 'index.pt-br.md';

export interface PostEntry {
  slug: string;
  lang: Lang;
  route: string;
  /** Astro collection entry id — typically `<slug>/index*.md` with forward slashes */
  sourcePath: string;
  title: string;
  date: Date;
  spoiler: string;
  tags: string[];
  updateDate?: Date;
}

export interface TranslationPair {
  slug: string;
  en?: PostEntry;
  'pt-br'?: PostEntry;
}

/**
 * Parse Astro content collection entry id into slug (directory path) and language (filename).
 */
export function parsePostEntryId(entryId: string): {
  slug: string;
  lang: Lang;
} {
  const normalized = entryId.replace(/\\/g, '/');
  const segments = normalized.split('/').filter(Boolean);
  if (segments.length < 2) {
    throw new Error(
      `Invalid post entry id "${entryId}" (expected <slug>/${EN_FILE} or <slug>/${PT_FILE})`
    );
  }

  const file = segments[segments.length - 1]!;
  const slug = segments.slice(0, -1).join('/');

  if (file === EN_FILE) {
    return { slug, lang: 'en' };
  }
  if (file === PT_FILE) {
    return { slug, lang: 'pt-br' };
  }

  throw new Error(
    `Unsupported post entry file "${file}" in "${entryId}" (expected ${EN_FILE} or ${PT_FILE})`
  );
}

export function languageFromEntryFilename(fileName: string): Lang {
  if (fileName === EN_FILE) {
    return 'en';
  }
  if (fileName === PT_FILE) {
    return 'pt-br';
  }
  throw new Error(
    `Unsupported entry filename "${fileName}" (expected ${EN_FILE} or ${PT_FILE})`
  );
}

export function toPostEntry(raw: {
  id: string;
  data: PostFrontmatter;
}): PostEntry {
  const { slug, lang } = parsePostEntryId(raw.id);
  const { title, date, spoiler, tags, updateDate } = raw.data;
  return {
    slug,
    lang,
    route: postPath(slug, lang),
    sourcePath: raw.id,
    title,
    date,
    spoiler,
    tags,
    ...(updateDate !== undefined ? { updateDate } : {}),
  };
}

export function sortPostsByDateDescending(posts: PostEntry[]): PostEntry[] {
  return [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function postsForLang(posts: PostEntry[], lang: Lang): PostEntry[] {
  return sortPostsByDateDescending(posts.filter((p) => p.lang === lang));
}

export function groupPostsBySlug(
  posts: PostEntry[]
): Map<string, TranslationPair> {
  const map = new Map<string, TranslationPair>();
  for (const post of posts) {
    let pair = map.get(post.slug);
    if (!pair) {
      pair = { slug: post.slug };
      map.set(post.slug, pair);
    }
    pair[post.lang] = post;
  }
  return map;
}

export function findUnpairedSlugs(posts: PostEntry[]): string[] {
  const unpaired: string[] = [];
  for (const pair of groupPostsBySlug(posts).values()) {
    if (!pair.en || !pair['pt-br']) {
      unpaired.push(pair.slug);
    }
  }
  return unpaired.sort((a, b) => a.localeCompare(b));
}
