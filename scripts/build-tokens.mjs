#!/usr/bin/env node
/**
 * Generates `src/styles/tokens.css` from the W3C DTCG token files in `tokens/`.
 *
 * Run it with `npm run tokens`. `npm run build` runs it automatically via `prebuild`,
 * so a committed token edit can never ship without the CSS being regenerated.
 *
 * Layout of the emitted CSS (four blocks, all inside `@layer base`):
 *
 *   :root                     global tokens + the `tech` theme (the implicit default)
 *   [data-theme='tech']       \
 *   [data-theme='nature']      >  the mode-varying tokens, one block per theme
 *   [data-theme='editorial']  /
 *
 * `:root` and `[data-theme='…']` have identical specificity (0,1,0), so the theme
 * blocks win purely by coming later in the file. Keep that order.
 *
 * Naming contract: a token's path in the JSON becomes its CSS custom property name
 * verbatim (`primary-dark` -> `--primary-dark`). Name Figma variables the same way
 * and a plugin export can overwrite these files with no translation layer.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import StyleDictionary from 'style-dictionary'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_FILE = resolve(ROOT, 'src/styles/tokens.css')

const GLOBAL_FILE = 'tokens/global.json'
const THEMES = ['tech', 'nature', 'editorial']
const themeFile = (theme) => `tokens/themes/${theme}.json`

/**
 * `:root` carries the globals plus the default theme, then each theme gets an
 * explicit block — including `tech`, so all three modes are symmetric rather than
 * `tech` silently falling through to `:root`.
 */
const BLOCKS = [
  { selector: ':root', sources: [themeFile('tech'), GLOBAL_FILE] },
  ...THEMES.map((theme) => ({
    selector: `[data-theme='${theme}']`,
    sources: [themeFile(theme)],
  })),
]

/* ------------------------------------------------------------------ *
 * Transforms
 * ------------------------------------------------------------------ */

StyleDictionary.registerTransform({
  name: 'name/css-custom-property',
  type: 'name',
  transform: (token) => token.path.join('-'),
})

const BARE_FONT_FAMILY = /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/

/** Quote family names that are not valid bare CSS identifiers (e.g. `Segoe UI`). */
const quoteFontFamily = (family) =>
  BARE_FONT_FAMILY.test(family) ? family : JSON.stringify(family)

const isDimensionObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  'value' in value &&
  'unit' in value

/** Reasons recorded by `reject()`; cleared at the start of every `formatSource`. */
const unsupportedTokens = new Set()

/**
 * Turns a DTCG `$value` into a CSS value.
 *
 * Hand-authored values here are already CSS strings and pass through untouched.
 * The array / `{ value, unit }` branches exist so a Figma plugin export — which
 * emits font families as arrays and dimensions as objects — drops in unchanged.
 * The array branch does not require `$type`, because exports routinely declare it
 * on the enclosing group or omit it entirely.
 */
StyleDictionary.registerTransform({
  name: 'value/dtcg-css',
  type: 'value',
  transitive: true,
  transform: (token) => {
    const value = token.$value ?? token.value

    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every((entry) => typeof entry === 'string')
    ) {
      return value.map(quoteFontFamily).join(', ')
    }
    if (isDimensionObject(value)) {
      return `${value.value}${value.unit}`
    }
    // A bare number is only meaningful for unitless types. `"radius-lg": 18` would
    // otherwise emit `--radius-lg: 18`, which browsers drop on the floor.
    if (typeof value === 'number' && token.$type === 'dimension') {
      return reject(token, value, 'a dimension needs a unit — use "18px" or { "value": 18, "unit": "px" }')
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }

    return reject(
      token,
      value,
      'supported shapes are string, unitless number, { value, unit }, and an array of strings',
    )
  },
})

/**
 * Style Dictionary reports a thrown transform as an aggregate "some token
 * transformations could not be applied" error that names no token, so the reason
 * is recorded here for `loadSource` to re-report with the token's path.
 */
function reject(token, value, reason) {
  unsupportedTokens.add(
    `${token.path.join('.')} ($type: ${token.$type ?? 'none'}) = ${JSON.stringify(value)}\n      ${reason}`,
  )
  // Thrown only so Style Dictionary aborts. Left to itself it warns and writes the
  // untransformed value, which stringifies to "[object Object]".
  throw new Error(reason)
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

/**
 * Resolves one token file to `{ name, value }` pairs.
 *
 * Each file gets its own Style Dictionary run rather than letting it merge them:
 * merging makes the files' root-level `$description` collide, and duplicate token
 * names are caught more precisely by `formatBlock` below.
 */
async function loadSource(source) {
  unsupportedTokens.clear()

  const sd = new StyleDictionary({
    source: [resolve(ROOT, source)],
    // `warnings: 'error'` is load-bearing: it promotes soft failures — an
    // unrenderable value, a broken reference — into a build failure instead of
    // quietly malformed CSS.
    log: { warnings: 'error', verbosity: 'silent' },
    platforms: {
      css: { transforms: ['name/css-custom-property', 'value/dtcg-css'] },
    },
  })

  let tokens
  try {
    tokens = (await sd.getPlatformTokens('css')).allTokens
  } catch (error) {
    if (unsupportedTokens.size === 0) throw error
    throw new Error(
      `Cannot render these tokens from ${source} as CSS:\n    ` +
        [...unsupportedTokens].join('\n    '),
    )
  }

  if (tokens.length === 0) {
    throw new Error(`${source} produced no tokens.`)
  }

  return tokens.map((token) => ({ name: `--${token.name}`, value: token.$value ?? token.value }))
}

/** Resolves one selector block's declarations, in source order. */
async function formatBlock({ selector, sources }) {
  const declarations = []
  for (const source of sources) {
    declarations.push(...(await loadSource(source)))
  }

  const seen = new Set()
  for (const { name } of declarations) {
    if (seen.has(name)) {
      throw new Error(
        `"${name}" is defined more than once in ${selector} (from ${sources.join(' + ')}). ` +
          'A token belongs to exactly one file.',
      )
    }
    seen.add(name)
  }

  return declarations
}

/**
 * A Figma variable collection gives every mode the same set of variables. Guard
 * that invariant here so a half-finished export cannot ship a theme that silently
 * inherits `:root` for the tokens it forgot.
 */
function assertThemesAreSymmetric(blocks) {
  const themeBlocks = blocks.filter(({ selector }) => selector !== ':root')
  const namesOf = ({ declarations }) => declarations.map(({ name }) => name).sort()
  const [reference, ...rest] = themeBlocks
  const expected = namesOf(reference)

  for (const block of rest) {
    const actual = namesOf(block)
    if (actual.join('|') !== expected.join('|')) {
      throw new Error(
        `Theme modes are not symmetric.\n` +
          `  ${reference.selector}: ${expected.join(', ')}\n` +
          `  ${block.selector}: ${actual.join(', ')}\n` +
          'Every tokens/themes/*.json file must declare the same token names.',
      )
    }
  }
}

async function main() {
  const blocks = []
  for (const block of BLOCKS) {
    blocks.push({ ...block, declarations: await formatBlock(block) })
  }

  assertThemesAreSymmetric(blocks)

  const body = blocks
    .map(({ selector, declarations }) =>
      [
        `  ${selector} {`,
        ...declarations.map(({ name, value }) => `    ${name}: ${value};`),
        '  }',
      ].join('\n'),
    )
    .join('\n\n')

  const css = [
    '/**',
    ' * DO NOT EDIT — generated by `npm run tokens`.',
    ' *',
    ` * Source: ${GLOBAL_FILE}, ${THEMES.map(themeFile).join(', ')}`,
    ' * See docs/figma-tokens.md for the Figma -> DTCG -> CSS workflow.',
    ' */',
    '',
    '@layer base {',
    body,
    '}',
    '',
  ].join('\n')

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, css, 'utf8')

  const count = blocks.reduce((total, { declarations }) => total + declarations.length, 0)
  console.log(
    `tokens: wrote ${count} custom properties across ${blocks.length} selectors -> src/styles/tokens.css`,
  )
}

main().catch((error) => {
  console.error(`tokens: build failed\n${error.message}`)
  process.exitCode = 1
})
