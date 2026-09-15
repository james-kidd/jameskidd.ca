import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const NODE_FILES = ['scripts/**/*.js', 'vite.config.js', 'eslint.config.js']
// The Figma plugin is authored as ordered fragments that share one global
// scope; the concatenated bundle is the unit that can be linted as a whole.
const FIGMA_PLUGIN_FILES = ['design/figma-plugin/code.js']
const FIGMA_PLUGIN_FRAGMENTS = ['design/figma-plugin/src/**/*.js']

export default defineConfig([
  globalIgnores(['dist', 'dist-ssr', ...FIGMA_PLUGIN_FRAGMENTS]),
  {
    files: ['**/*.{js,jsx}'],
    ignores: [...NODE_FILES, ...FIGMA_PLUGIN_FILES],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Build tooling runs in Node, not the browser — browser globals must stay
    // undefined here so `no-undef` catches a stray `window`/`document`.
    files: NODE_FILES,
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Runs inside Figma's plugin sandbox: no DOM, no Node — only the `figma`
    // API, the inlined UI markup and the data the build script injects.
    files: FIGMA_PLUGIN_FILES,
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        figma: 'readonly',
        __html__: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
