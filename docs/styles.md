# Styles: layers, mediums and where a rule belongs

`src/index.css` is the only stylesheet the app imports. It imports everything else
in cascade order, and each layer may read the layers above it, never below.

```
tokens/**/*.json                     W3C DTCG, laid out like the Figma file
  │  npm run tokens
  ▼
1. styles/tokens/shared.css          brand: primitives → theme modes → core, spacing, motion, effects
2. styles/tokens/web.css             browser layout: one media query per Figma viewport mode
3. styles/legacy.css                 old names (--primary, --border …) → semantic tokens
4. styles/mediums/{site,text,app}    role tokens: what kind of artifact is being rendered
5. styles/base.css                   element defaults, reading --medium-* only
6. styles/components/*.css           reusable classes, one file per family
   + the @theme bridge in index.css  Tailwind utilities for the legacy names
```

## Two axes: theme and medium

**Theme** is the brand mood: colour, and for now the typeface. It is set on
`<html data-theme="tech|nature|editorial">` and comes from Figma's
`Shared / 02 Theme` modes.

**Medium** is the kind of artifact: how dense, how wide, how readable. It is set
with `data-medium` on any element, so a single page can mix them.

| Medium | For | Status |
|---|---|---|
| `site` (default, `:root`) | the portfolio pages as they render today | live |
| `text` | long-form reading: project write-ups, essays | ready, unused: add `data-medium="text"` to an `<article>` |
| `app` | dense tools: dashboards, micro-apps | proposal: Figma has no App kit yet |

Every medium file declares the same `--medium-*` names:

| Token | site | text | app |
|---|---|---|---|
| `--medium-font` | theme font | reading serif | UI face |
| `--medium-body-size` | 16px | 18px | 14px |
| `--medium-body-leading` | 1.6 | 1.7 | 1.5 |
| `--medium-measure` | none | 68ch | none |
| `--medium-block-gap` | layout section gap | 32px | 16px |
| `--medium-radius` | 18px | 6px | 6px |
| `--medium-control-height` | 44px | 44px | 32px |

Because the two axes are independent, `nature` + `text` and `editorial` + `app`
both work without any extra CSS.

Figma's `Documents` kit (Word and PDF) and `Video` kit have no CSS medium on
purpose: Word styles come from a native Word template and video is composed
outside the token sync.

## Where a new rule goes

| You are adding | Put it in |
|---|---|
| a colour, size, font or duration | Figma, then export to `tokens/` (see `figma-tokens.md`) |
| a value that differs by artifact type (density, measure, reading size) | the same `--medium-*` name in all three `mediums/*.css` |
| a default for an HTML element | `base.css`, reading `--medium-*` |
| a reusable class | `components/<family>.css`, imported in `index.css` |
| a one-off layout | Tailwind utilities in the JSX |

Component CSS should read semantic tokens (`--color-action-primary`) and medium
tokens (`--medium-radius`), never primitives (`--blue-600`) and never a raw hex.

## Migrating off the legacy names

`components/*.css` and the JSX still use the old names (`--primary`, `--border`,
`text-(--text-muted)`). `legacy.css` maps each one onto its semantic token, so the
migration can go one file at a time:

1. Replace the old name with the semantic one in a component file or JSX file.
2. When `grep -rn -- "--primary" src` returns only `legacy.css`, delete that line.
3. When `legacy.css` is empty, delete it and its import.

| Old | New |
|---|---|
| `--primary` | `--color-action-primary` |
| `--primary-dark` | `--color-action-hover` |
| `--secondary` | `--color-surface-accent` |
| `--surface` | `--color-surface-default` |
| `--surface-muted` | `--color-surface-muted` |
| `--border` | `--color-border-default` |
| `--text-strong` | `--color-text-primary` |
| `--text-muted` | `--color-text-secondary` |
| `--accent-warn` | `--color-status-warning` |
| `--text-micro` / `--text-eyebrow` / `--text-body` | `--font-size-micro` / `-eyebrow` / `-body` |
| `--font-family-sans` (per theme) | pending: `--font-family-ui` once the typeface is decided |

## Verifying a style change

There is no visual test suite. The layer split was checked by capturing the
computed style of every element on `/`, `/personal` and a project page, in all
three themes, before and after; the two captures matched exactly. Repeat that
for any change meant to be invisible (see the PR that introduced this file).
