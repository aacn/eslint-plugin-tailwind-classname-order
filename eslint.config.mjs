import eslint from '@eslint/js';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'lib/**',
      'node_modules/**',
      'playground/**',
      'src/types/**',
      'src/**/*.test.ts',
    ],
  },
  eslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['src/rules/*.ts'],
    plugins: { 'eslint-plugin': eslintPlugin },
    rules: eslintPlugin.configs.recommended.rules,
  },
];
