# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Production build to dist/
npm run lint     # ESLint
npm run preview  # Preview production build
```

No test runner is configured.

## Architecture

React 19 + Vite 7 + Tailwind CSS v4 portfolio site deployed on Vercel. JavaScript/JSX only (no TypeScript). Client-side rendering with no backend.

### Routing (React Router v7)

| Route | Component | Layout |
|---|---|---|
| `/` | `HomePage` (inline in App.jsx) | `Layout` (nav + theme controls) |
| `/skills` | `SkillsPage` | `PageShell` (no nav) |
| `/projects/:slug` | `ProjectPage` | `PageShell` (no nav) |
| `/personal` | `PersonalPage` | `PageShell` (no nav) |

`Layout` wraps only the home route and provides the sticky nav (built from `SECTIONS` registry) and theme switcher. All other pages use `PageShell` (a centered content container with a back link).

### Content Architecture

Content is split between **MDX files** (prose) and **JS data files** (structured data). The rule: if it's sentences/paragraphs, it's MDX. If it's a list of tags, a URL, or tabular data, it stays in JS.

#### MDX content (`src/content/`)

All MDX files use YAML frontmatter for structured metadata and Markdown body for prose. Loaded eagerly via `import.meta.glob` in each directory's `index.js` loader. The generic loader lives in `src/content/mdxCollection.js` — it parses glob results into sorted/filtered arrays with the MDX default export attached under a configurable component name (`Chapter`, `Body`, `Description`).

| Directory | What it contains | Frontmatter keys |
|---|---|---|
| `src/content/experience/*.mdx` | One file per role. Body is description/bullets. | `order`, `group` (internships/academic/freelance), `date`, `title`, `company`, `skills[]`, `link?` |
| `src/content/projects/*.mdx` | One file per project. Body is the full write-up with Markdown headings. Can embed interactive React components. | `slug`, `featured?`, `title`, `description`, `skills[]`, `link`, `demo?`, `embed?` |
| `src/content/pillars/*.mdx` | Skills pillars. Body is description prose. | `id`, `order`, `title`, `subtitle`, `icon`, `evidence[]` |
| `src/content/about.mdx` | About section intro paragraphs. No frontmatter. | — |
| `src/content/personal.mdx` | Personal section description. | `title`, `instagram` |

**To add a new experience:** Create a `.mdx` file in `src/content/experience/`, set frontmatter fields, write description as body. The glob loader picks it up automatically.

**To add a new project:** Create a `.mdx` file in `src/content/projects/` with a `slug` in frontmatter. The project detail page (`ProjectPage`) renders the MDX body inside an `MDXProvider` with themed components.

**Using React components in MDX:** Register interactive components in `src/components/mdx/mdxComponents.jsx`, then use them directly in `.mdx` files as JSX tags (e.g., `<BipartiteVisual />`). The `MDXProvider` in `ProjectPage` makes them available automatically.

#### MDX pipeline

Vite processes MDX via `@mdx-js/rollup` (configured in `vite.config.js` with `enforce: 'pre'`). Remark plugins: `remark-frontmatter` + `remark-mdx-frontmatter` (exports frontmatter as named `frontmatter` export) + `remark-gfm`. The `MDXProvider` from `@mdx-js/react` supplies themed component overrides (`h2`, `h3`, `p`, `ul`, `ol`, `strong`, `em`, `a`, `code`) plus custom components (`Callout`, `Figure`, `BipartiteVisual`).

#### Content loaders

Each MDX content directory has an `index.js` that globs and exports parsed content:

- `src/content/experience/index.js` → exports `experiences` (sorted array) and `experiencesByGroup` (object keyed by group)
- `src/content/projects/index.js` → exports `projects` (array with `Chapter` component), `projectChapters` (slug→component map), `hasChapter()`
- `src/content/pillars/index.js` → exports `pillars` (sorted array with `Description` component)

Components import from these loaders, not from `src/data/` for content that has been migrated to MDX.

#### JS data files (`src/data/`)

| File | What it contains |
|---|---|
| `hero.js` | Name, title, tagline, stack tags, contact emails, social URLs, resume link |
| `sections/` | One module per data slice, assembled into `sectionData` by `sections/index.js` (which also exports `experienceGroups`): `education.js`, `skills.js`, and `personal/{stats,milestones,favorites,gallery}.js` |
| `skills-detail.js` | Skills page headline and positioning text |
| `travel.js` | Auto-generated from photo EXIF — country/city lists, stats (do not edit manually) |
| `index.js` | Re-exports `heroData`, `sectionData`, `experienceGroups`, `skillsDetailData` |

`sectionData` keeps a fixed shape regardless of how the slices are split: `about.education.details[]`, `skills.blocks[]`, and `personal.{stats,milestones,favorites,gallery}`. Edit a slice in its own file. There are two barrels: `sections/index.js` composes the top-level `about`/`skills`/`personal` keys, and `sections/personal/index.js` composes the four `personal.*` keys — add or remove a key in whichever one owns that level.

### Section Registry (`src/sections/registry.js`)

Canonical list of home page sections. Drives: section rendering order on `HomePage`, nav menu population, and scroll spy tracking. Each entry has `{ id, label, Component, nav }`. Components receive `data={sectionData[id]}` automatically.

### Theme System

Three themes (`tech`, `nature`, `editorial`) controlled via `data-theme` on `<html>`. CSS custom properties defined in `src/index.css` `@layer base`. Tokens bridged into Tailwind v4 via `@theme`. Theme persists to `localStorage` key `portfolio-theme`.

### Component Layers

- **`src/layout/`** — `Layout` (home shell), `Navigation` (scroll-spy nav), `IdentityBlock` (hero sidebar), `ThemeControls`
- **`src/sections/`** — One component per home section, plus `TravelMap` (react-simple-maps)
- **`src/sections/components/`** — Section-scoped cards (`ExperienceCard`, `ProjectCard`, `SkillCard`, `EducationCard`)
- **`src/pages/`** — Full-page routes: `PersonalPage`, `ProjectPage`, `SkillsPage`
- **`src/components/`** — Shared UI primitives (`SectionPanel`, `TagPill`, `GalleryLightbox`, `BipartiteVisual`, etc.)
- **`src/components/mdx/`** — MDX component overrides and custom components (`mdxComponents.jsx`, `Callout`, `Figure`) used via `MDXProvider`
- **`src/hooks/`** — `useScrollSpy` (Intersection Observer for active nav), `useScrollToTop` (auto-scroll on route change)

### CSS Conventions

Tailwind v4 with `@tailwindcss/vite` plugin. Custom component classes (`.section-block`, `.section-panel`, `.section-shell`, `.surface-muted`, `.eyebrow`, `.btn`, `.card`, `.tag-pill`, `.timeline-item`, etc.) defined in `src/index.css` `@layer components`. Prefer these over ad-hoc Tailwind strings for structural layout. Theme-aware colors reference CSS vars: `text-(--text-muted)`, `bg-(--surface)`.

### Key Conventions

- ESLint: `no-unused-vars` allows uppercase or `_`-prefixed identifiers
- Icons from `lucide-react` exclusively
- Vercel SPA rewrites in `vercel.json`
- `react-simple-maps` peer dep override in `package.json` for React 19 compat
