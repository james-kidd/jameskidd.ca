# Design tokens: Figma → DTCG JSON → CSS

Every theme value on this site is defined in a small set of JSON files in
[`tokens/`](../tokens). A build step compiles them into `src/styles/tokens.css`,
which `src/index.css` imports; no `:root` or `[data-theme]` block is hand-written
anywhere else.

Adopting the tokens at every call site is a separate job — some components still
carry literals such as `text-[10px]` or a hard-coded `#f59e0b`. The token for each
of those exists here, ready to be pointed at.

The whole chain is open formats — W3C DTCG JSON in, CSS custom properties out —
so there is no CMS, no vendor account, and nothing to renew.

```
Figma variables ──(plugin export)──► tokens/*.json ──(npm run tokens)──► src/styles/tokens.css
```

## Why a plugin, and not the Figma API

Figma exposes variables two ways, and only one of them is usable here:

| | Availability | Usable? |
|---|---|---|
| **Variables REST API** (`GET /v1/files/:key/variables/local`) | Enterprise plans only | No |
| **Variables Plugin API** (`figma.variables.*`) | Every plan, including Starter and Education | Yes |

So there is no automated pull from Figma and no CI job that talks to Figma. The
supported flow is manual and explicit: **export from Figma with a plugin, commit
the JSON, let the build do the rest.** That is a feature — the token files are
reviewable in a diff, and the site builds with no network access and no secrets.

## Repo layout

```
tokens/
  global.json          # mode-independent tokens  -> :root only
  themes/
    tech.json          # -> :root (as the default) AND [data-theme='tech']
    nature.json        # -> [data-theme='nature']
    editorial.json     # -> [data-theme='editorial']

scripts/build-tokens.mjs   # Style Dictionary build
src/styles/tokens.css      # GENERATED — do not edit, it is overwritten
```

`src/App.jsx` writes the active theme to `document.documentElement.dataset.theme`,
which is what the `[data-theme='…']` blocks key off.

## The naming contract

**A token's path in the JSON becomes its CSS custom property name, verbatim.**

```json
{ "primary-dark": { "$type": "color", "$value": "#1e40af" } }
```

```css
--primary-dark: #1e40af;
```

Tokens are flat — no nesting — precisely so that this holds with no translation
layer. Name the Figma variable exactly as you want the CSS variable to read,
minus the leading `--`, and a plugin export drops straight into `tokens/`.

There is one deliberate exception. The typeface token is called
**`font-family-sans`**, not `font-sans`, because `--font-sans` is also a Tailwind
theme namespace; `src/index.css` aliases one to the other in its `@theme` block:

```css
@theme {
  --font-sans: var(--font-family-sans);
}
```

Consume `var(--font-sans)` (or the `font-sans` utility) in application code. The
raw token exists only so the alias is not a self-reference.

## Setting up the Figma file

The JSON above maps onto Figma like this:

| `tokens/` file | Figma |
|---|---|
| `global.json` | a single-mode collection, e.g. **Global** |
| `themes/*.json` | one collection, e.g. **Theme**, with a mode per file |

**Mode support depends on your plan.** Education, Professional, Organization and
Enterprise plans can create modes; **Starter (free) cannot**. If you are on
Starter, model the three themes as three separate single-mode collections named
`tech`, `nature` and `editorial` instead. The export lands in the same place and
the build does not care which shape produced it.

All six theme tokens must exist in every theme — `primary`, `primary-dark`,
`secondary`, `surface-muted`, `border`, `font-family-sans`. The build enforces
this (see [Guard rails](#guard-rails)).

Shadows are the one thing you cannot round-trip: Figma models them as **effect
styles**, not variables, so no variable export will ever contain them. They stay
hand-authored in `tokens/global.json` as CSS shorthand strings.

## Exporting

Any plugin that emits W3C DTCG JSON works — the pipeline depends on the JSON
shape, not on a particular plugin. Verified free options:

- **[Tokens Bruecke](https://www.figma.com/community/plugin/1254538877056388290/tokens-bruecke)** — converts Figma variables and styles to DTCG JSON.
- **[Design Tokens (W3C) Export](https://www.figma.com/community/plugin/1377982390646186215/design-tokens-w3c-export)** — exports each variable collection as its own JSON file, zipped. Closest match to this repo's one-file-per-mode layout.
- **[Styleframe](https://www.styleframe.dev/figma)** — free and open source, exports *and* imports DTCG, multi-mode aware. Useful if you ever want to push the repo's tokens back into Figma.

Then:

1. Run the plugin, choose DTCG / W3C output, one file per collection-or-mode.
2. Overwrite the matching file in `tokens/`. Keep the filenames.
3. `npm run tokens`
4. Check `git diff` — you are reviewing plain CSS custom properties, so an
   unintended change is obvious.

### If the export does not match byte-for-byte

The build normalises the two shapes plugins actually differ on, so you should not
need to hand-edit:

- **Dimensions** — both `"18px"` and `{ "value": 18, "unit": "px" }` work.
- **Font families** — both `"Georgia, serif"` and `["Georgia", "serif"]` work;
  array entries needing quotes (`Segoe UI`) get them.

Anything else throws with the offending token path rather than emitting broken
CSS.

## Building

```bash
npm run tokens   # regenerate src/styles/tokens.css
npm run build    # runs `tokens` first via `prebuild`, then vite build
```

`prebuild` means a production build — local or on Vercel — can never ship stale
CSS against edited tokens.

`src/styles/tokens.css` **is committed** even though it is generated, so
`npm run dev` and a fresh clone work without a build step. `npm run dev` does not
regenerate it; run `npm run tokens` yourself after editing a token file.

## Guard rails

`scripts/build-tokens.mjs` fails the build if:

- the three `tokens/themes/*.json` files do not declare **exactly the same token
  names** — a half-finished export can't ship a theme that silently falls back to
  `:root` for whatever it forgot;
- the same token name is defined in more than one file;
- a token file produces nothing;
- a `$value` is a shape the CSS writer does not understand.

That last one matters more than it looks: left alone, Style Dictionary downgrades
an unrenderable value to a warning and writes `--shadow-soft: [object Object];`
into the stylesheet. The build turns it into a failure that names the token.

## Adding a token

1. Add it to `tokens/global.json` (mode-independent) or to **all three**
   `tokens/themes/*.json` (mode-varying).
2. `npm run tokens`.
3. Use it. The house style is Tailwind v4's arbitrary-variable syntax —
   `text-(--text-muted)`, `bg-(--primary)/10` — which needs no registration.
4. Only if you also want a generated Tailwind utility (`bg-brand`, `font-sans`),
   add an alias to the `@theme` block in `src/index.css`.

For **font sizes**, note that the `text-*` shorthand resolves to a colour:
`text-(--text-body)` compiles to `color: var(--text-body)`, not a size. Write
`text-[length:var(--text-body)]` instead.

A warning on step 4: `@theme` keys live in Tailwind's own namespaces, and a name
collision changes rendered output. `--shadow-*`, `--radius-*` and `--text-*`
(font sizes) are all Tailwind namespaces, which is why this repo's shadow, radius
and type tokens are deliberately *not* registered — registering `--text-body`, for
instance, would generate a `.text-body` utility that shadows the `.text-body`
component class. `src/index.css` documents each exclusion inline.
