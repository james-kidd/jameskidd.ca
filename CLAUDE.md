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

### Content architecture

Content is split between **MDX files** (prose you edit as Markdown) and **JS data files** (structured data like arrays, URLs, configs). The rule: if it's sentences/paragraphs, it's MDX. If it's a list of tags, a URL, or tabular data, it stays in JS.

#### MDX content (`src/content/`)

All MDX files use YAML frontmatter for structured metadata and Markdown body for prose. Loaded eagerly via `import.meta.glob` in each directory's `index.js` loader.

| Directory | What it contains | Frontmatter keys |
|---|---|---|
| `src/content/experience/*.mdx` | One file per role (7 total). Body is the description/bullets as paragraphs. | `order`, `group` (internships/academic/freelance), `date`, `title`, `company`, `skills[]`, `link?` |
| `src/content/projects/*.mdx` | One file per project (4 total). Body is the full project write-up with Markdown headings. | `slug`, `featured?`, `title`, `description`, `skills[]`, `link`, `demo?`, `embed?` |
| `src/content/pillars/*.mdx` | Skills pillars (3 total). Body is pillar description prose. | `id`, `order`, `title`, `subtitle`, `icon`, `evidence[]` |
| `src/content/about.mdx` | About section intro paragraphs. No frontmatter. | — |
| `src/content/personal.mdx` | Personal section description. | `instagram` |

**To add a new experience:** Create a new `.mdx` file in `src/content/experience/`, set frontmatter fields, write the description as the body. The loader picks it up automatically via glob.

**To add a new project:** Create a new `.mdx` file in `src/content/projects/` with a `slug` in frontmatter. Write the project detail as Markdown body with `## Overview`, `## Why It Matters`, etc. headings.

**To edit prose:** Open the relevant `.mdx` file and write Markdown. Splitting a paragraph is just pressing Enter twice.

#### JS data files (`src/data/`)

These hold only structured/tabular data that doesn't benefit from Markdown formatting:

| File | What it contains |
|---|---|
| `hero.js` | Name, title, tagline, stack tags, contact emails, social URLs, resume link |
| `sections.js` | Education coursework records, skill tag blocks, personal milestones/favorites/gallery config |
| `skills-detail.js` | Skills page headline and positioning text |
| `travel.js` | Auto-generated from photo EXIF — country/city lists, stats (do not edit manually) |

#### Content loaders

Each MDX content directory has an `index.js` that globs and exports parsed content:

- `src/content/experience/index.js` → exports `experiences` (sorted array) and `experiencesByGroup` (object keyed by group)
- `src/content/projects/index.js` → exports `projects` (array with `Chapter` component), `projectChapters` (slug→component map), `hasChapter()`
- `src/content/pillars/index.js` → exports `pillars` (sorted array with `Description` component)

Components import directly from these loaders, not from `src/data/` for content that has been migrated to MDX.

### Section registry (`src/sections/registry.js`)

The canonical list of home page sections. Drives: section rendering order on `HomePage`, nav menu population, and scroll spy tracking. Add or reorder sections here — components receive `data={sectionData[id]}` automatically.

### Theme system

Three themes (`tech`, `nature`, `editorial`) controlled via `data-theme` on `<html>`. CSS custom properties for each are defined in `src/index.css` `@layer base`. Tokens are bridged into Tailwind v4 via `@theme`. Theme persists to `localStorage` key `portfolio-theme`.

### Component layers

- **`src/layout/`** — `Layout` (home shell), `Navigation` (scroll-spy nav), `IdentityBlock` (hero sidebar), `ThemeControls`
- **`src/sections/`** — One component per home section, plus `TravelMap` (uses `react-simple-maps`) and `PersonalPage` (dedicated `/personal` route with gallery, life timeline, and travel map)
- **`src/sections/components/`** — Section-scoped cards (`ExperienceCard`, `ProjectCard`, etc.)
- **`src/components/`** — Shared UI primitives (`SectionPanel`, `TagPill`, `GalleryLightbox`, etc.)
- **`src/components/mdx/`** — MDX component overrides (`mdxComponents.jsx`) used by project pages, experience cards, and other MDX-rendering components via `MDXProvider`

### CSS conventions

Tailwind v4 with `@tailwindcss/vite` plugin. Custom component classes (`.section-block`, `.section-panel`, `.section-shell`, `.eyebrow`, `.btn`, etc.) are defined in `src/index.css` `@layer components`. Prefer these utility classes over ad-hoc Tailwind strings for structural layout. Theme-aware colors reference CSS vars directly: `text-(--text-muted)`, `bg-(--surface)`.
