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

### Data vs. MDX content

All site content falls into one of three categories:

**`src/data/*.js`** — Structured JS objects consumed directly by section components. `hero.js` has identity/contact info; `sections.js` has all section content (about, experience, skills, projects); `travel.js` feeds the personal section and travel map; `skills-detail.js` has only the skills page headline/positioning (not the pillars).

**`src/content/pillars/*.mdx`** — Skills pillars with YAML frontmatter (`id`, `order`, `title`, `subtitle`, `icon`, `evidence[]`) and MDX body text. Loaded eagerly via `import.meta.glob` and sorted by `order`. `SkillsPage` consumes the `pillars` export from `src/content/pillars/index.js`.

**`src/content/projects/*.mdx`** — Optional deep-dive chapters for projects. Lazy-loaded via `import.meta.glob`. A project gets a chapter if its `slug` from `sections.js` matches a filename in this directory. `ProjectPage` renders either the MDX chapter or a `StructuredDetail` fallback from `project.detail` in sections data.

### Section registry (`src/sections/registry.js`)

The canonical list of home page sections. Drives: section rendering order on `HomePage`, nav menu population, and scroll spy tracking. Add or reorder sections here — components receive `data={sectionData[id]}` automatically.

### Theme system

Three themes (`tech`, `nature`, `editorial`) controlled via `data-theme` on `<html>`. CSS custom properties for each are defined in `src/index.css` `@layer base`. Tokens are bridged into Tailwind v4 via `@theme`. Theme persists to `localStorage` key `portfolio-theme`.

### Component layers

- **`src/layout/`** — `Layout` (home shell), `Navigation` (scroll-spy nav), `IdentityBlock` (hero sidebar), `ThemeControls`
- **`src/sections/`** — One component per home section, plus `TravelMap` (uses `react-simple-maps`) and `PersonalPage` (dedicated `/personal` route with gallery, life timeline, and travel map)
- **`src/sections/components/`** — Section-scoped cards (`ExperienceCard`, `ProjectCard`, etc.)
- **`src/components/`** — Shared UI primitives (`SectionPanel`, `TagPill`, `GalleryLightbox`, etc.)
- **`src/components/mdx/`** — MDX component overrides (`mdxComponents.jsx`) used by `ProjectPage` via `MDXProvider`

### CSS conventions

Tailwind v4 with `@tailwindcss/vite` plugin. Custom component classes (`.section-block`, `.section-panel`, `.section-shell`, `.eyebrow`, `.btn`, etc.) are defined in `src/index.css` `@layer components`. Prefer these utility classes over ad-hoc Tailwind strings for structural layout. Theme-aware colors reference CSS vars directly: `text-(--text-muted)`, `bg-(--surface)`.
