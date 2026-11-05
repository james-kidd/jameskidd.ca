#!/usr/bin/env node
/**
 * Generates the token stylesheets in `src/styles/tokens/` from the W3C DTCG files in `tokens/`.
 *
 * Run it with `npm run tokens`. `npm run build` runs it first via `prebuild`, so a
 * committed token edit can never ship without the CSS being regenerated.
 *
 * `tokens/` mirrors the Figma file one-to-one, so a variable export drops in without
 * translation. One folder per Figma group, one file per collection, one file per mode:
 *
 *   tokens/shared/01-primitives.json            -> :root
 *   tokens/shared/02-theme/<mode>.json          -> :root (tech) and [data-theme='<mode>']
 *   tokens/shared/03-core.json ... 06-*.json    -> :root
 *   tokens/web/01-viewports/<mode>.json         -> :root, inside one media query per mode
 *
 * Output: `shared.css` (brand, every medium) and `web.css` (browser layout only).
 *
 * Naming contract: a token's path becomes its CSS custom property, joined with '-'.
 * Figma `color/action/primary` -> JSON { color: { action: { primary } } } -> `--color-action-primary`.
 *
 * References: `"$value": "{gray.900}"` is emitted as `var(--gray-900)`, not as the hex,
 * so the inheritance chain (primitive -> theme -> core -> component) stays visible in
 * the CSS and a theme change re-resolves everything downstream.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import StyleDictionary from 'style-dictionary'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = resolve(ROOT, 'src/styles/tokens')

const PRIMITIVES = 'tokens/shared/01-primitives.json'
const THEMES = ['tech', 'nature', 'editorial']
const DEFAULT_THEME = 'tech'
const themeFile = (theme) => `tokens/shared/02-theme/${theme}.json`
const CORE = 'tokens/shared/03-core.json'
const SPACING = 'tokens/shared/04-spacing.json'
const MOTION = 'tokens/shared/05-motion.json'
const EFFECTS = 'tokens/shared/06-effects.json'
const viewportFile = (mode) => `tokens/web/01-viewports/${mode}.json`

/**
 * Files a source may reference. Each source is resolved against these, but only the
 * source's own tokens are emitted. Keeping this explicit makes the trickle-down
 * direction a rule: primitives <- theme <- core, never the other way.
 */
const REFERENCES = {
  [PRIMITIVES]: [],
  [CORE]: [PRIMITIVES, themeFile(DEFAULT_THEME)],
  ...Object.fromEntries(THEMES.map((theme) => [themeFile(theme), [PRIMITIVES]])),
}

/**
 * Figma 'Web / 01 Viewports' modes and when each applies. Breakpoints come from the
 * Figma file's breakpoint/* variables (desktop-min 1024, compact-height-max 500); CSS
 * cannot read a custom property inside a media query, so they are fixed here.
 * Order matters: desktop comes last so it wins on a short but wide window.
 */
const VIEWPORTS = [
  { mode: 'mobile-portrait', media: null },
  { mode: 'mobile-landscape', media: '(orientation: landscape) and (max-height: 500px)' },
  { mode: 'desktop', media: '(min-width: 1024px)' },
]

const OUTPUTS = [
  {
    file: 'shared.css',
    summary: 'Shared brand tokens: primitives, theme modes, core, spacing, motion, effects.',
    blocks: [
      {
        selector: ':root',
        sources: [PRIMITIVES, themeFile(DEFAULT_THEME), CORE, SPACING, MOTION, EFFECTS],
      },
      ...THEMES.map((theme) => ({
        selector: `[data-theme='${theme}']`,
        sources: [themeFile(theme)],
        symmetryGroup: 'theme',
      })),
    ],
  },
  {
    file: 'web.css',
    summary: 'Web-only layout tokens, one media query per Figma viewport mode.',
    blocks: VIEWPORTS.map(({ mode, media }) => ({
      selector: ':root',
      media,
      sources: [viewportFile(mode)],
      symmetryGroup: 'viewport',
    })),
  },
]

/* ------------------------------------------------------------------ *
 * Transforms
 * ------------------------------------------------------------------ */

const cssName = (path) => `--${path.join('-')}`

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

const isNumberList = (value, length) =>
  Array.isArray(value) && value.length === length && value.every((entry) => typeof entry === 'number')

/** Reasons recorded by `reject()`; cleared at the start of every `loadSource`. */
const unsupportedTokens = new Set()

/**
 * Turns a DTCG `$value` into a CSS value.
 *
 * Hand-authored values are already CSS strings and pass through. The other branches
 * accept what a Figma plugin export emits: font families as arrays, dimensions as
 * `{ value, unit }`, easing as four numbers.
 */
StyleDictionary.registerTransform({
  name: 'value/dtcg-css',
  type: 'value',
  transitive: true,
  transform: (token) => {
    const value = token.$value ?? token.value

    if (Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === 'string')) {
      return value.map(quoteFontFamily).join(', ')
    }
    if (isNumberList(value, 4)) {
      return `cubic-bezier(${value.join(', ')})`
    }
    if (isDimensionObject(value)) {
      return `${value.value}${value.unit}`
    }
    // A bare number is only meaningful for unitless types. `"radius-lg": 18` would
    // otherwise emit `--radius-lg: 18`, which browsers drop on the floor.
    if (typeof value === 'number' && ['dimension', 'duration'].includes(token.$type)) {
      return reject(token, value, 'a dimension or duration needs a unit, e.g. "18px", "200ms" or { "value": 18, "unit": "px" }')
    }
    if (typeof value === 'string' || typeof value === 'number') {
      return String(value)
    }

    return reject(
      token,
      value,
      'supported shapes are string, unitless number, { value, unit }, four numbers (cubic-bezier) and an array of strings',
    )
  },
})

/**
 * Style Dictionary reports a thrown transform as an aggregate error that names no
 * token, so the reason is recorded here for `loadSource` to re-report with its path.
 */
function reject(token, value, reason) {
  unsupportedTokens.add(
    `${token.path.join('.')} ($type: ${token.$type ?? 'none'}) = ${JSON.stringify(value)}\n      ${reason}`,
  )
  // Thrown only so Style Dictionary aborts instead of writing "[object Object]".
  throw new Error(reason)
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

const REFERENCE = /^\{([^{}]+)\}$/

/** `{color.text.primary}` -> `var(--color-text-primary)`; anything else -> the resolved value. */
function cssValue(token) {
  const original = token.original?.$value ?? token.original?.value
  const match = typeof original === 'string' ? original.match(REFERENCE) : null
  return match ? `var(${cssName(match[1].split('.'))})` : token.$value ?? token.value
}

/** Resolves one token file to `{ name, value }` pairs, in source order. */
async function loadSource(source) {
  unsupportedTokens.clear()

  const sd = new StyleDictionary({
    include: (REFERENCES[source] ?? []).map((file) => resolve(ROOT, file)),
    source: [resolve(ROOT, source)],
    // `warnings: 'error'` turns soft failures (an unrenderable value, a broken
    // reference) into a build failure instead of quietly malformed CSS.
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
    throw new Error(`Cannot render these tokens from ${source} as CSS:\n    ${[...unsupportedTokens].join('\n    ')}`)
  }

  const own = tokens.filter((token) => token.isSource)
  if (own.length === 0) throw new Error(`${source} produced no tokens.`)

  return own.map((token) => ({ name: cssName(token.path), value: cssValue(token) }))
}

async function resolveBlock(block) {
  const declarations = []
  for (const source of block.sources) {
    declarations.push(...(await loadSource(source)))
  }

  const seen = new Set()
  for (const { name } of declarations) {
    if (seen.has(name)) {
      throw new Error(
        `"${name}" is defined more than once in ${block.selector} (from ${block.sources.join(' + ')}). A token belongs to exactly one file.`,
      )
    }
    seen.add(name)
  }

  return { ...block, declarations }
}

/**
 * A Figma collection gives every mode the same variables. Guard that here so a
 * half-finished export cannot ship a mode that silently inherits another's values.
 */
function assertModesAreSymmetric(blocks) {
  const groups = Map.groupBy(blocks.filter((block) => block.symmetryGroup), (block) => block.symmetryGroup)
  const namesOf = (block) => block.declarations.map(({ name }) => name).sort().join(', ')

  for (const [group, members] of groups) {
    const [reference, ...rest] = members
    for (const block of rest) {
      if (namesOf(block) !== namesOf(reference)) {
        throw new Error(
          `The ${group} modes are not symmetric.\n` +
            `  ${reference.sources[0]}: ${namesOf(reference)}\n` +
            `  ${block.sources[0]}: ${namesOf(block)}\n` +
            'Every mode file in a collection must declare the same token names.',
        )
      }
    }
  }
}

function renderBlock({ selector, media, declarations }) {
  const indent = media ? '      ' : '    '
  const rule = [
    `${indent.slice(2)}${selector} {`,
    ...declarations.map(({ name, value }) => `${indent}${name}: ${value};`),
    `${indent.slice(2)}}`,
  ].join('\n')
  return media ? `  @media ${media} {\n${rule}\n  }` : rule
}

function renderFile({ summary, blocks }) {
  const sources = [...new Set(blocks.flatMap((block) => block.sources))]
  return [
    '/**',
    ' * DO NOT EDIT — generated by `npm run tokens` (scripts/build-tokens.mjs).',
    ` * ${summary}`,
    ' *',
    ` * Source: ${sources.join(', ')}`,
    ' * See docs/figma-tokens.md for the Figma -> DTCG -> CSS workflow.',
    ' */',
    '',
    '@layer base {',
    blocks.map(renderBlock).join('\n\n'),
    '}',
    '',
  ].join('\n')
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  let total = 0

  for (const output of OUTPUTS) {
    const blocks = []
    for (const block of output.blocks) blocks.push(await resolveBlock(block))
    assertModesAreSymmetric(blocks)

    await writeFile(resolve(OUT_DIR, output.file), renderFile({ ...output, blocks }), 'utf8')
    const count = blocks.reduce((sum, { declarations }) => sum + declarations.length, 0)
    total += count
    console.log(`tokens: ${output.file} <- ${count} custom properties in ${blocks.length} blocks`)
  }

  console.log(`tokens: wrote ${total} custom properties to src/styles/tokens/`)
}

main().catch((error) => {
  console.error(`tokens: build failed\n${error.message}`)
  process.exitCode = 1
})
