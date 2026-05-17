import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildExpectedBlogRoutes } from '../../src/lib/routes';
import { loadPostEntriesFromDisk } from '../helpers/load-post-entries';

const repoRoot = path.resolve(__dirname, '..', '..');
const postsRoot = path.join(repoRoot, 'src', 'content', 'posts');

function listHtmlUnderDist(distDir: string): string[] {
  const out: string[] = [];
  const stack: string[] = [distDir];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const ent of readdirSync(cur, { withFileTypes: true })) {
      const joined = path.join(cur, ent.name);
      if (ent.isDirectory()) stack.push(joined);
      else if (ent.isFile() && ent.name.endsWith('.html')) out.push(joined);
    }
  }
  return out;
}

function distPathForBlogRoute(route: string): string {
  const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
  if (normalized === '' || normalized === '/') {
    return path.join(repoRoot, 'dist', 'index.html');
  }
  const trimmed = normalized.replace(/^\//, '');
  return path.join(repoRoot, 'dist', trimmed, 'index.html');
}

describe('Astro production build (integration)', () => {
  beforeAll(() => {
    execSync('pnpm build', {
      cwd: repoRoot,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'test' },
    });
  });

  it('materializes dist output after content collection validation', () => {
    expect(existsSync(path.join(repoRoot, 'dist', 'index.html'))).toBe(true);
    expect(
      existsSync(path.join(repoRoot, 'dist', 'layout-verify', 'index.html'))
    ).toBe(true);
  });

  it('keeps relative image assets resolvable for a representative image-heavy post', () => {
    const slug = 'setting-eslint-on-reactjs-and-react-native';
    const mdPath = path.join(postsRoot, slug, 'index.md');
    const md = readFileSync(mdPath, 'utf8');
    const refs = [...md.matchAll(/!\[[^\]]*\]\(\.\/([^)]+)\)/g)].map((m) =>
      m[1].trim()
    );
    expect(refs.length).toBeGreaterThan(5);

    for (const ref of refs) {
      expect(
        existsSync(path.join(postsRoot, slug, ref)),
        `missing asset ${ref} for ${slug}`
      ).toBe(true);
    }
  });

  it('preserves fenced code blocks in a representative code-heavy post', () => {
    const mdPath = path.join(
      postsRoot,
      'babel-root-import-ts-reactjs-react-native',
      'index.md'
    );
    const md = readFileSync(mdPath, 'utf8');
    expect(md).toMatch(/```(?:js|ts|tsx|json|bash|shell)[^\n]*\n[\s\S]*?```/);
  });

  it('renders representative blog index HTML without Gatsby layout classes', () => {
    const html = readFileSync(
      path.join(repoRoot, 'dist', 'index.html'),
      'utf8'
    );
    expect(html).toContain('data-blog-styles');
    expect(html).toContain('Henrique Tavares');
    expect(html).not.toMatch(/class="[^"]*gatsby-/i);
    expect(html).toContain('Seja bem vindo ao meu Evernote Público');
    expect(html).toContain('data-testid="lang-switch"');
    expect(html).toContain('href="/en/"');
  });

  it('materializes exactly 22 public blog routes in dist', () => {
    const { entries } = loadPostEntriesFromDisk();
    const slugs = [...new Set(entries.map((e) => e.slug))];
    const routes = buildExpectedBlogRoutes(slugs);
    expect(routes).toHaveLength(22);
    for (const route of routes) {
      expect(
        existsSync(distPathForBlogRoute(route)),
        `missing output for ${route}`
      ).toBe(true);
    }
  });

  it('renders translated post bodies for representative slugs', () => {
    const ptHtml = readFileSync(distPathForBlogRoute('/hello-world/'), 'utf8');
    const enHtml = readFileSync(
      distPathForBlogRoute('/en/hello-world/'),
      'utf8'
    );
    expect(ptHtml).toContain('Faaaaala Codeeeeers');
    expect(enHtml).toContain('Heeeeeey Codeeers');
  });

  it('exposes language switch links to the paired locale route', () => {
    const ptPost = readFileSync(distPathForBlogRoute('/hello-world/'), 'utf8');
    const enPost = readFileSync(
      distPathForBlogRoute('/en/hello-world/'),
      'utf8'
    );
    expect(ptPost).toContain('href="/en/hello-world/"');
    expect(enPost).toContain('href="/hello-world/"');

    const enIndex = readFileSync(distPathForBlogRoute('/en/'), 'utf8');
    expect(enIndex).toContain('href="/"');
    expect(enIndex).toContain('Welcome to my Public Evernote');
  });

  it('ships pre-paint theme bootstrap and manual toggle on index, post, and 404 output', () => {
    const snippets = [
      readFileSync(path.join(repoRoot, 'dist', 'index.html'), 'utf8'),
      readFileSync(distPathForBlogRoute('/hello-world/'), 'utf8'),
      readFileSync(path.join(repoRoot, 'dist', '404.html'), 'utf8'),
    ];
    for (const html of snippets) {
      expect(html).toContain('henrique-blog-theme');
      expect(html).toContain('prefers-color-scheme');
      expect(html).toContain('data-testid="theme-toggle"');
    }
  });

  it('renders static 404 HTML without Gatsby markers', () => {
    const html = readFileSync(path.join(repoRoot, 'dist', '404.html'), 'utf8');
    expect(html).toContain('data-blog-styles');
    expect(html).not.toMatch(/class="[^"]*gatsby-/i);
  });

  it('renders layout-verify fixture with prose regions and Prism classes', () => {
    const html = readFileSync(
      path.join(repoRoot, 'dist', 'layout-verify', 'index.html'),
      'utf8'
    );
    expect(html).toContain('data-region="article-heading"');
    expect(html).toContain('data-region="article-metadata"');
    expect(html).toContain('data-region="article-body"');
    expect(html).toContain('data-region="article-author"');
    expect(html).toContain('data-region="article-site-footer"');
    expect(html).toMatch(/language-/);
    expect(html).toContain('blog-code-frame');
    expect(html).not.toMatch(/class="[^"]*gatsby-/i);
    expect(html).toContain('noindex');
  });

  it('renders classless inline code in layout-verify fixture', () => {
    const html = readFileSync(
      path.join(repoRoot, 'dist', 'layout-verify', 'index.html'),
      'utf8'
    );
    expect(html).toContain('<code>~60-120s</code>');
    expect(html).toContain('<code>/en/</code>');
  });

  it('renders classless inline code in the migration post body', () => {
    const migrationSlug =
      'migrating-this-blog-from-gatsby-to-astro-and-netlify-to-vercel';
    const ptHtml = readFileSync(
      distPathForBlogRoute(`/${migrationSlug}/`),
      'utf8'
    );
    expect(ptHtml).toContain('<code>~60-120s</code>');
    expect(ptHtml).toContain('<code>~8s</code>');
  });

  it('global.css covers classless inline code inside .markdown-body', () => {
    const css = readFileSync(
      path.join(repoRoot, 'src', 'styles', 'global.css'),
      'utf8'
    );
    expect(css).toMatch(/\.markdown-body\s+:not\(pre\)\s*>\s*code/);
  });

  it('renders ul and ol list elements in layout-verify fixture', () => {
    const html = readFileSync(
      path.join(repoRoot, 'dist', 'layout-verify', 'index.html'),
      'utf8'
    );
    expect(html).toMatch(/<ul[^>]*>[\s\S]*?<li/);
    expect(html).toMatch(/<ol[^>]*>[\s\S]*?<li/);
    expect(html).toContain('Unordered item one');
    expect(html).toContain('Ordered item one');
  });

  it('renders bare pre.language-* block in layout-verify fixture', () => {
    const html = readFileSync(
      path.join(repoRoot, 'dist', 'layout-verify', 'index.html'),
      'utf8'
    );
    expect(html).toMatch(/<pre\s[^>]*class="language-js"[^>]*>/);
    expect(html).toContain('data-language="js"');
  });

  it('real post body contains fenced code blocks rendered as pre.language-*', () => {
    const html = readFileSync(
      distPathForBlogRoute('/babel-root-import-ts-reactjs-react-native/'),
      'utf8'
    );
    expect(html).toMatch(/<pre\s[^>]*class="[^"]*language-/);
  });

  it('global.css applies background to .markdown-body pre[class*=language-]', () => {
    const css = readFileSync(
      path.join(repoRoot, 'src', 'styles', 'global.css'),
      'utf8'
    );
    expect(css).toMatch(
      /\.markdown-body\s+pre\[class\*=['"']language-['"']\]\s*\{[^}]*background:\s*var\(--blog-code-bg\)/
    );
  });

  it('global.css restores list-style-type markers inside .markdown-body', () => {
    const css = readFileSync(
      path.join(repoRoot, 'src', 'styles', 'global.css'),
      'utf8'
    );
    expect(css).toMatch(
      /\.markdown-body\s+ul\s*\{[^}]*list-style-type\s*:\s*disc/
    );
    expect(css).toMatch(
      /\.markdown-body\s+ol\s*\{[^}]*list-style-type\s*:\s*decimal/
    );
  });

  it('emits canonical, alternates, and Open Graph metadata for representative posts', () => {
    const ptHtml = readFileSync(distPathForBlogRoute('/hello-world/'), 'utf8');
    expect(ptHtml).toContain(
      '<link rel="canonical" href="https://henriquetavares.com/hello-world/"'
    );
    expect(ptHtml).toContain('hreflang="pt-BR"');
    expect(ptHtml).toContain('hreflang="en"');
    expect(ptHtml).toContain('hreflang="x-default"');
    expect(ptHtml).toContain('property="og:type" content="article"');
    expect(ptHtml).toContain(
      '<meta name="description" content="Seja bem vindo ao meu Evernote Público"'
    );
    expect(ptHtml).toContain('property="og:description"');
    expect(ptHtml).toContain('Seja bem vindo ao meu Evernote Público');

    const enHtml = readFileSync(
      distPathForBlogRoute('/en/hello-world/'),
      'utf8'
    );
    expect(enHtml).toContain(
      '<link rel="canonical" href="https://henriquetavares.com/en/hello-world/"'
    );
    expect(enHtml).toContain(
      '<meta name="description" content="Welcome to my Public Evernote"'
    );
  });

  it('sets site-level index metadata for both locales', () => {
    const ptIndex = readFileSync(distPathForBlogRoute('/'), 'utf8');
    expect(ptIndex).toContain(
      '<link rel="canonical" href="https://henriquetavares.com/"'
    );
    expect(ptIndex).toContain('property="og:type" content="website"');
    expect(ptIndex).toContain('Blog pessoal do Henrique Tavares');

    const enIndex = readFileSync(distPathForBlogRoute('/en/'), 'utf8');
    expect(enIndex).toContain(
      '<link rel="canonical" href="https://henriquetavares.com/en/"'
    );
    expect(enIndex).toContain(
      'Henrique Tavares — articles on development, React, React Native'
    );
  });

  it('does not emit Adsense markup or RSS autodiscovery markers in HTML', () => {
    const distDir = path.join(repoRoot, 'dist');
    const pages = listHtmlUnderDist(distDir);
    expect(pages.length).toBeGreaterThan(0);

    const banned = [/googlesyndication\.com/i, /\badsbygoogle\b/i];
    const rssHints = [
      /type=["']application\/rss\+xml["']/i,
      /href=["'][^"']*\/rss\.xml/i,
    ];

    for (const file of pages) {
      const html = readFileSync(file, 'utf8');
      for (const re of banned) {
        expect(html, file).not.toMatch(re);
      }
      for (const re of rssHints) {
        expect(html, file).not.toMatch(re);
      }
    }
  });

  it('renders homepage bio intro in both locales', () => {
    const ptIndex = readFileSync(distPathForBlogRoute('/'), 'utf8');
    expect(ptIndex).toContain('data-region="homepage-intro"');
    expect(ptIndex).toContain('sou um desenvolvedor apaixonado por Javascript');

    const enIndex = readFileSync(distPathForBlogRoute('/en/'), 'utf8');
    expect(enIndex).toContain('data-region="homepage-intro"');
    // Astro escapes apostrophes in HTML text nodes.
    expect(enIndex).toMatch(
      /i(?:'|&#39;)m a developer in love about Javascript/i
    );
  });

  it('does not materialize removed newsletter confirmation paths in dist', () => {
    expect(
      existsSync(path.join(repoRoot, 'dist', 'thanks', 'index.html'))
    ).toBe(false);
    expect(
      existsSync(path.join(repoRoot, 'dist', 'confirm', 'index.html'))
    ).toBe(false);
  });

  it('renders static sharing controls on posts without discussion links', () => {
    const ptPost = readFileSync(distPathForBlogRoute('/hello-world/'), 'utf8');
    expect(ptPost).toContain('data-testid="static-share-links"');
    expect(ptPost).toContain('href="https://twitter.com/intent/tweet?');
    expect(ptPost).toContain('data-share-network="facebook"');
    const shareBlock = ptPost.match(
      /<ul[^>]*data-testid="static-share-links"[^>]*>[\s\S]*?<\/ul>/i
    );
    expect(shareBlock, 'static share list present').toBeTruthy();
    expect(shareBlock![0].toLowerCase()).not.toContain('overreacted.io');
    expect(ptPost).not.toMatch(/discuss\s+on/i);
    expect(ptPost).not.toContain('mobile.twitter.com/search?q=');
  });
});
