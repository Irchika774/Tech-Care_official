import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Global ignores - exclude vendor/third-party files and build outputs
  globalIgnores([
    'dist',
    'node_modules',
    'public/landing/**',
    'landingpage/**',
    'server/**',
    '*.min.js',
    'build/**'
  ]),
  // Main config for React frontend
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused vars that start with underscore or uppercase
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^_|^[A-Z_]',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      // Downgrade some rules to warnings for incremental fixes
      'no-undef': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // React Refresh - only affects HMR, not critical
      'react-refresh/only-export-components': 'warn',
      // Allow empty catch blocks (common pattern for ignoring errors)
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  // Config for test files  
  {
    files: ['src/**/*.{test,spec}.{js,jsx}', 'src/test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        vi: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
  },
])
