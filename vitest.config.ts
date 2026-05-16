import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: [
        'tooling/**/*.mjs',
        'tooling/**/*.ts',
        'src/content/post-schema.ts',
        'src/lib/**/*.ts',
        'src/scripts/theme-toggle.ts',
      ],
    },
  },
});
