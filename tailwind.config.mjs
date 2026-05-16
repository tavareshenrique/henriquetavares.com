/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        blog: {
          bg: 'var(--blog-bg)',
          header: 'var(--blog-header-text)',
          text: 'var(--blog-text)',
          title: 'var(--blog-title)',
          link: 'var(--blog-link)',
          hr: 'var(--blog-hr)',
          'inline-code-bg': 'var(--blog-inline-code-bg)',
          'inline-code-text': 'var(--blog-inline-code-text)',
          'code-surface': 'var(--blog-code-bg)',
          'code-line-bg': 'var(--blog-code-highlight-bg)',
          'code-line-accent': 'var(--blog-code-highlight-border)',
        },
      },
      fontFamily: {
        serif: [
          'Merriweather',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '42rem',
      },
      spacing: {
        shell: '1.3125rem',
        'header-block': '2.625rem',
      },
    },
  },
  plugins: [],
};
