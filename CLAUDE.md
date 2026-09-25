# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A one-page resume site plus a personal page. Next.js 16 (App Router),
TypeScript (strict), Tailwind v4, React 19. Deployed on Vercel from `main`.
The owner's use case is: add a project or a photo, push, done — keep it that
simple. There is no CMS, no MDX, no external content source, no test runner.

## Commands

```bash
npm run dev          # regenerates tokens, then next dev
npm run build        # regenerates tokens, then next build (runs tsc too)
npm run lint         # eslint .
npm run typecheck    # tsc --noEmit
npm run tokens       # tokens/tokens.json -> app/tokens.css
```

`lint`, `typecheck` and `build` all clean is the definition of done.

## Layout

```
content/     typed data files — the only thing the owner edits
  schema.ts  the types every content file must satisfy
  site.ts    name, title, tagline, contact, socials, typing lines, OG image
  about.ts   experience.ts  projects.ts  playground.ts  skills.ts
  education.ts  personal.ts  travel.ts
tokens/tokens.json   design tokens (Figma variable names as keys)
scripts/build-tokens.mjs  -> app/tokens.css (generated, committed)
app/         layout, page (home), personal/page, not-found, sitemap, robots
components/  one file per section or interactive piece
public/      photos/, resume.pdf, favicon.svg, world-110m.json
```

## Rules that keep it maintainable

- **Content goes in `content/`, never in components.** A component that
  needs a string reads it from there.
- **The types are the guardrail.** `Project.links` requires at least one of
  `github` / `live` / `writeup`, and every URL is typed `` `https://${string}` ``.
  A project with no link, or a `"#"` placeholder, must keep failing `tsc`.
  Do not loosen `schema.ts` to make an entry fit; fix the entry.
- **Server components by default.** Only `typing-animation`, `bipartite-visual`,
  `travel-map` and `gallery` are `"use client"`. Do not add client code for
  things CSS or a native element can do (`<details>`, `<dialog>`,
  `loading="lazy"`).
- **Eight text styles, defined once** in `app/globals.css`: `t-display`,
  `t-title`, `t-lead`, `t-heading`, `t-body`, `t-small`, `t-label`, `t-code`.
  Every text element uses exactly one. Components never set font-size,
  weight, line-height, letter-spacing or family. Tailwind's `text-sm` etc.
  are deliberately removed (`--text-*: initial` in the generated tokens).
- **Colours are tokens.** Tailwind's palette is cleared; only `surface`,
  `surface-raised`, `ink`, `ink-muted`, `line`, `accent`, `accent-ink`,
  `overlay`, `on-overlay` exist (`bg-surface`, `text-ink-muted`,
  `border-line`, `fill-accent/25` …). Need a new colour? Add it to
  `tokens.json` with a light and a dark value.
- **Dark mode is automatic** (`prefers-color-scheme`). There is no toggle and
  no `dark:` variant in use; a token's dark value is the whole story.
- **Short dependency list.** next, react, react-dom, lucide-react,
  react-simple-maps, and dev tooling. Anything else needs a reason in the PR.

## How the tokens flow

`tokens/tokens.json` key `color/ink` → CSS `--color-ink` → Tailwind `text-ink`.
Groups `color`, `font`, `radius` are registered in `@theme` (so they become
utilities); anything else (`type/*`) is a plain variable on `:root`. The
font tokens point at `--font-plex-sans` / `--font-plex-mono`, which
`app/layout.tsx` defines through `next/font` (IBM Plex Sans and Mono,
self-hosted at build time). To change the typeface, change both.

## Redirects

Old URLs `/skills` and `/projects/<slug>` are indexed. `next.config.ts` sends
them to `/#skills`, `/#try-it-out` (manager-dna) and `/#projects`. Keep the
section ids in `app/page.tsx` in sync with those.

## Try it out

Any project in `projects.ts` with an `embed` URL is rendered as an iframe in
the "Try it out" section, in addition to its card. The bipartite graph is a
hand-built component (`components/bipartite-visual.tsx`); its surrounding
copy lives in `content/playground.ts`.

## Things to know

- `public/favicon.svg` is a 1.9 MB SVG wrapping a raster image. It was kept
  as-is; a real vector or a small PNG would be a worthwhile swap.
- Photos are served through `next/image`, so the multi-megabyte originals in
  `public/photos/` are fine to keep.
- The travel map matches countries by numeric ISO code (`Country.mapId`),
  the id scheme of `public/world-110m.json`.
