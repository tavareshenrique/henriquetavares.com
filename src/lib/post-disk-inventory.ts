import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { postFrontmatterSchema } from '../content/post-schema';
import { toPostEntry, type PostEntry } from './posts';

export interface LoadPostEntriesResult {
  slugs: string[];
  entries: PostEntry[];
}

function parseMarkdownFrontmatter(filePath: string): unknown {
  const raw = readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }
  return parseYaml(match[1]);
}

export function loadPostEntriesFromDisk(
  repoRoot: string
): LoadPostEntriesResult {
  const postsRoot = path.join(repoRoot, 'src', 'content', 'posts');

  const slugs = readdirSync(postsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  const entries: PostEntry[] = [];

  for (const slug of slugs) {
    const enId = `${slug}/index.md`;
    const ptId = `${slug}/index.pt-br.md`;
    const enPath = path.join(postsRoot, slug, 'index.md');
    const ptPath = path.join(postsRoot, slug, 'index.pt-br.md');

    entries.push(
      toPostEntry({
        id: enId,
        data: postFrontmatterSchema.parse(parseMarkdownFrontmatter(enPath)),
      })
    );
    entries.push(
      toPostEntry({
        id: ptId,
        data: postFrontmatterSchema.parse(parseMarkdownFrontmatter(ptPath)),
      })
    );
  }

  return { slugs, entries };
}
