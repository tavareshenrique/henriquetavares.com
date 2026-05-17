/**
 * Canonical list of blog post slugs for migration parity checks (9 paired locales → 18 entries).
 */
export const EXPECTED_BLOG_SLUGS = [
  'babel-root-import-ts-reactjs-react-native',
  'hello-world',
  'how-to-debug-in-vscode-using-microsoft-edge',
  'my-basic-settings-of-a-react-native-projects',
  'nlw-4',
  'react-conf-br-2019',
  'root-import-reactjs',
  'setting-eslint-on-reactjs-and-react-native',
  'using-environment-variable-in-react-native',
] as const;

export type ExpectedBlogSlug = (typeof EXPECTED_BLOG_SLUGS)[number];
