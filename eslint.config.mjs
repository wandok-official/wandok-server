// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // [1] 전역 무시 설정
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },

  // [2] 기본 확장 설정
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,

  // [3] 공통 설정 및 플러그인 정의
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // [4] 규칙 정의
  {
    rules: {
      /* =========================================
         [NestJS 기본 규칙]
      ========================================= */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      /* =========================================
         [자바스크립트 로직]
      ========================================= */
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-empty': 'warn',

      /* =========================================
         [TypeScript 전용]
      ========================================= */
      // JS의 기본 no-unused-vars는 끄고 TS 전용 규칙 사용
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 'argsIgnorePattern': '^_' },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],

      /* =========================================
         [Prettier 관련]
      ========================================= */
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
);