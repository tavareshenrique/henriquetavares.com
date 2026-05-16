import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

export function parseMarkdownFrontmatter(filePath: string): unknown {
  const raw = readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`Missing frontmatter in ${filePath}`);
  }
  return parseYaml(match[1]);
}
