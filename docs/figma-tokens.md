# Design tokens: Figma → DTCG JSON → CSS

Every brand and layout value on this site is defined in [`tokens/`](../tokens) as
W3C DTCG JSON. `npm run tokens` compiles them into `src/styles/tokens/shared.css`
and `src/styles/tokens/web.css`. No `:root` or `[data-theme]` value is hand-written
anywhere else, apart from the transition aliases in `src/styles/legacy.css`.

```
Figma variables ──(plugin export)──► tokens/**/*.json ──(npm run tokens)──► src/styles/tokens/*.css
```

How those tokens then flow through the stylesheets (legacy, mediums, base,
components) is in [`styles.md`](styles.md).

## Why a plugin, and not the Figma API

| | Availability | Usable? |
|---|---|---|
| **Variables REST API** (`GET /v1/files/:key/variables/local`) | Enterprise plans only | No |
| **Variables Plugin API** (`figma.variables.*`) | Every plan, including Education | Yes |

So there is no automated pull and no CI job that talks to Figma. Export with a
plugin, commit the JSON, let the build do the rest. The token files stay
reviewable in a diff and the site builds with no network access and no secrets.

## The file layout mirrors the Figma file

The source file is **Jameskidd.info - Design System**
(`De2NdUNIHbLHH2vp6H24DX`). Its collections are grouped by prefix: `Shared /`
for the brand that every medium uses, `Web /` for browser-only layout. `tokens/`
uses the same groups, one file per collection, one file per mode:

| `tokens/` path | Figma collection | Emitted as |
|---|---|---|
| `shared/01-primitives.json` | Shared / 01 Primitives | `:root` |
| `shared/02-theme/{tech,nature,editorial}.json` | Shared / 02 Theme (modes Tech, Nature, Editorial) | `:root` (tech) and `[data-theme='…']` |
| `shared/03-core.json` | Shared / 03 Core | `:root` |
| `shared/04-spacing.json` | Shared / 04 Spacing | `:root` |
| `shared/05-motion.json` | Shared / 05 Motion | `:root` |
| `shared/06-effects.json` | Figma effect styles (shadows) | `:root`, hand-maintained |
| `web/01-viewports/{mobile-portrait,mobile-landscape,desktop}.json` | Web / 01 Viewports | `:root` inside one media query per mode |

The Figma file's `Deprecated / Tech|Nature|Editorial` collections are not
exported: their names live on as aliases in `src/styles/legacy.css`.

The `Documents` and `Video` kits in Figma have no CSS output on purpose. Word
documents take their styles from a native Word template, and video composition
is outside the token sync. The `text` medium in `src/styles/mediums/` is the web
reading view, not a Word style.

## The naming contract

**A token's JSON path becomes its CSS custom property, joined with `-`.**

| Figma variable | JSON path | CSS |
|---|---|---|
| `color/action/primary` | `color.action.primary` | `--color-action-primary` |
| `gray/50` | `gray.50` | `--gray-50` |
| `space/2_5` | `space.2_5` | `--space-2_5` |
| `font/family/ui` | `font.family.ui` | `--font-family-ui` |

The name comes from the path, never from Figma's per-variable *code syntax*
field, which is inconsistent in the file today (`var(--x)`, bare `--x`, empty,
and Tailwind class names on the legacy motion group).

Primitives deliberately have no `color-` prefix. `--color-*` is Tailwind v4's
colour namespace, and `--color-gray-50` would silently override Tailwind's own
gray scale for every `bg-gray-*` utility.

### References keep the chain visible

Mode files point at primitives instead of repeating hex values:

```json
{ "color": { "action": { "primary": { "$type": "color", "$value": "{blue.600}" } } } }
```

The build writes references as `var()`:

```css
--color-action-primary: var(--blue-600);
--primary: var(--color-action-primary);   /* legacy.css */
```

Reading the CSS therefore shows where every value comes from, and changing a
theme or a primitive re-resolves everything downstream. A file may only
reference the files listed for it in `REFERENCES` in `scripts/build-tokens.mjs`:
primitives ← theme ← core, never the other way.

## Seeded with the site's values, not Figma's

The token files use the Figma structure and names but hold the values the site
renders today, so this layout landed with zero visual change. Where Figma
already differs, the value is kept and the token's `$description` says so:

| Token | Site (kept) | Figma today |
|---|---|---|
| `color/text/primary` | `slate/900` `#0f172a` | `gray/900` `#111827` |
| `color/text/secondary` | `slate/600` `#475569` | `gray/600` `#4b5563` |
| Nature `color/action/primary` | `emerald/600` `#059669` | `emerald/700` `#047857` |
| UI typeface | per theme: system, Segoe UI, Georgia | `font/family/ui` = Geist for all |

`slate/600` and `slate/900` exist only in code. A Figma export replaces them; the
build will then fail on the dangling reference until the theme files point at
Figma's primitives, which is the moment to accept or reject the change.

## Exporting

Any plugin that emits W3C DTCG JSON works. Free options:

- **[Design Tokens (W3C) Export](https://www.figma.com/community/plugin/1377982390646186215/design-tokens-w3c-export)**: one JSON file per collection, zipped. Closest to this layout.
- **[Tokens Bruecke](https://www.figma.com/community/plugin/1254538877056388290/tokens-bruecke)**: variables and styles to DTCG.
- **[Styleframe](https://www.styleframe.dev/figma)**: exports and imports DTCG, multi-mode aware.

Then:

1. Export, choosing DTCG / W3C output, one file per collection or mode.
2. Overwrite the matching files in `tokens/`. Keep the filenames.
3. `npm run tokens`, then `npm run build`.
4. Review `git diff src/styles/tokens/`. It is plain CSS custom properties, so an
   unintended change is obvious.

The build accepts the shapes plugins differ on: dimensions as `"18px"` or
`{ "value": 18, "unit": "px" }`, font families as a string or an array, easing as
four numbers. Durations must carry a unit (`"200ms"`); Figma stores seconds, so
check the motion export. Anything else fails with the token's path.

## Guard rails

`scripts/build-tokens.mjs` fails the build if:

- the mode files of one collection (themes, viewports) do not declare exactly the
  same token names;
- the same CSS name is produced twice in one block;
- a reference points at nothing;
- a `$value` is a shape the CSS writer does not understand.

## Adding a token

1. Add it in Figma, then export. Or, until the export is wired, add it to the
   matching `tokens/` file by hand (all mode files if the collection has modes).
2. `npm run tokens`.
3. Use it with Tailwind's arbitrary-variable syntax: `text-(--color-text-secondary)`,
   `bg-(--color-action-primary)/10`.
4. Only if you also want a generated utility, add an alias to the `@theme` block
   in `src/index.css`. Mind the namespaces: `--color-*`, `--shadow-*`,
   `--radius-*`, `--text-*` (font size) and `--ease-*` all belong to Tailwind.

For font sizes, `text-(--font-size-body)` compiles to a colour. Write
`text-[length:var(--font-size-body)]`.

## Building

```bash
npm run tokens   # regenerate src/styles/tokens/*.css
npm run build    # runs `tokens` first via `prebuild`
```

The generated CSS is committed so `npm run dev` and a fresh clone work without a
build step. `npm run dev` does not regenerate it.
