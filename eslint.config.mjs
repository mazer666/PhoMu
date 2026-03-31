import nextVitals from 'eslint-config-next/core-web-vitals';

// eslint-config-next v16 exports flat config arrays — direct spread works without FlatCompat.
// core-web-vitals already includes next/typescript rules, so no separate import needed.

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: ['.next/**', 'out/**', 'dist/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextVitals,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      // Keep as warn (not off) to align with the project's TypeScript strict goal
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
