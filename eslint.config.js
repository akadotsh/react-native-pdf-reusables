const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: ['**/dist/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
