# Figma design kit

The site's design system as a Figma file — tokens with the three theme modes,
every element as a component with its states, every route as a screen, and each
animation / toggle isolated with a spec and prototype links — generated from the
code so it never drifts from what ships.

The kit is produced by a Figma plugin that lives in this repo
(`design/figma-plugin/`). Everything it draws comes from two committed inputs:

| Input | Produced by | Feeds |
|---|---|---|
| `design/content/site-content.json` | `npm run design:content` | every string on every screen (the "content" half) |
| `tokens/*.json` | hand-authored, see [figma-tokens.md](./figma-tokens.md) | variables, modes, effect styles (the "presentation" half) |

```
src/data + src/content ──► design/content/site-content.json ─┐
tokens/*.json ───────────────────────────────────────────────┼──► design/figma-plugin/code.js ──► Figma file
lucide-react (node_modules) ─────────────────────────────────┘
```

## Installing the plugin (one time)

1. Clone the repo (or `git pull`), no build needed — `code.js` is committed.
2. In the Figma **desktop app** open any Design file, then
   **Plugins → Development → Import plugin from manifest…** and pick
   `design/figma-plugin/manifest.json`.
3. Create a new, empty Design file and run **Plugins → Development →
   jameskidd.ca · Design Kit builder**.
4. Leave every section ticked and press **Build design kit**. It takes about a
   minute; progress and any warnings appear in the panel.

Tick **Load gallery photos** to pull the eight `/photos/about-me-*.jpg` images
from jameskidd.info into the gallery tiles (needs network access, which the
manifest allows for that domain only). Tick **Replace** when re-running in a file
that already has the kit — otherwise the plugin keeps the old pages and builds
time-stamped copies next to them.

To publish the same builder as an account-level plugin (runnable from any file
without dev import), it can be uploaded through Figma's generative-plugin API;
that needs the Figma team's plan key (`team::<id>` from the team URL).

## What the file contains

| Page | Contents |
|---|---|
| **Cover** | Title, build stamp, counts. |
| **Getting started** | How each page maps back to the code, and where to make a change. |
| **Foundations** | Variable collections **Global** (surface, text-strong, text-muted, accent-warn, radius-*, text-* sizes), **Theme** (primary, primary-dark, secondary, surface-muted, border, font-family-sans — one mode per theme: tech / nature / editorial), **Primitives** (the Tailwind greys the JSX still uses directly), **Spacing**, **Motion** (every duration/easing found in the code). 32 text styles named by role with the Tailwind classes in their descriptions; 5 effect styles (shadow-soft, shadow-hover + the Tailwind shadow-sm/lg/xl a few components use). Swatch, type, radius, shadow, spacing and motion specimens; the theme swatches are pinned to each mode so the palettes sit side by side. |
| **Components** | 37 lucide icons, then one component (set) per React component — see the map below. Sets are laid out State-in-columns; every set's description names its source file and CSS class. Text that comes from data is a TEXT property; icons are INSTANCE_SWAP; toggles are BOOLEAN. |
| **Screens** | Home (desktop 1440, mobile 390), `/skills`, `/projects/manager-dna`, `/projects/paint-by-number`, `/personal`, `/404`, plus the hero + nav in all three theme modes. Built from instances and filled with the real content. |
| **Motion & States** | One card per interaction (below): trigger, animated CSS properties, duration + easing, notes, and the states side by side. Smart-animate prototype reactions are written on the master variants, so any instance plays in Present mode. |
| **Content model** | Copy deck: every string grouped by source file, including the ~36 UI strings still hard-coded in components. |

Variable names equal the CSS custom-property names, so a DTCG export of the
Global + Theme collections overwrites `tokens/*.json` with no translation — the
round trip described in [figma-tokens.md](./figma-tokens.md).

### Component map

| Figma component | Source | Variants / properties |
|---|---|---|
| `TagPill` | `components/TagPill.jsx`, `.tag-pill` | State = Default · Hover · Selected (map filter) — Label |
| `Badge` | `.badge*`, `ProjectCard`, hero stack chips | Variant = Neutral · Primary · Featured · Outline · Stack — Label |
| `Button` | `.btn-primary` `.btn-outline` `.btn-pill` | State × Style (Primary · Outline · Pill) × Size (Default · Small) — Label, Leading icon, Trailing icon, Icon |
| `TextLink` | inline arrow links | State × Tone (Primary · Muted) — Label |
| `BackLink` | `components/PageShell.jsx` | State — Label |
| `NavItem` | `layout/Navigation.jsx`, `.nav-item` | State = Default · Hover · Active — Label |
| `ThemeSwatch`, `ThemeControls` | `layout/ThemeControls.jsx`, `theme.js` | Selected × Theme |
| `IdentityBlock` | `layout/IdentityBlock.jsx` | — |
| `MobileHeader`, `MobileMenu` | `layout/Layout.jsx`, `.glass-header` | State = Closed · Open |
| `IconBox` | `components/IconBox.jsx`, `SocialIcon.jsx`, `.icon-box` | State — Icon |
| `SectionTitle`, `Eyebrow` | `components/SectionTitle.jsx`, `.eyebrow` | Label, Show icon, Icon |
| `ExpandToggle` | `components/ExpandToggle.jsx` | State = Collapsed · Expanded — Label |
| `TimelineDot` | `.timeline-dot` | State = Default · Hover · Active |
| `ExperienceCard` | `sections/components/ExperienceCard.jsx` | State = Collapsed · Hover · Expanded — Title, Company, Date |
| `EducationCard` | `sections/components/EducationCard.jsx` | State — School, Degree, Year |
| `ProjectCard` | `sections/components/ProjectCard.jsx` | State × Featured — Title, Description, Tag, Show tag, Show demo badge |
| `SkillCard` | `sections/components/SkillCard.jsx`, `.card` | State — Title |
| `PillarSummary`, `PillarCard` | `sections/SkillsSection.jsx`, `pages/SkillsPage.jsx` | (State) — Title, Subtitle |
| `StatTile`, `QuickStats` | `sections/PersonalSection.jsx`, `pages/PersonalPage.jsx` | Variant = Card · Compact — Value, Label, Icon |
| `GalleryTile`, `GalleryLightbox`, `LightboxDot` | `components/GalleryLightbox.jsx` | State — Caption |
| `Milestone` | `pages/PersonalPage.jsx` Life Story | Title, Date, Description, Location |
| `PlaceGroup` | `pages/PersonalPage.jsx` Places | State = Closed · Open — Name, Meta |
| `FavoritesCard` | `pages/PersonalPage.jsx` | Title, Icon |
| `MapMarker`, `MapTooltip`, `MapBadge` | `sections/TravelMap.jsx` | Kind = City · University — text props |
| `ContactInfo`, `TypingLine` | `components/ContactInfo.jsx`, `TypingAnimation.jsx` | Mode = Typing · Strike · Done — Text |
| `Callout`, `Figure`, `BipartiteVisual` | `components/mdx/*`, `components/BipartiteVisual.jsx` | Type = Note · Aside · Warn — Title, Body / Caption / Step = 0 · 1 · 2 |
| `SectionPanel`, `SurfaceMuted`, `SectionSurface`, `Card` | `index.css` surfaces | documentation containers |

### Motion spec

Everything that moves, with the values from the code. Each row is a card on the
Motion & States page and the durations are variables in the Motion collection.

| Interaction | Trigger | Animates | Timing |
|---|---|---|---|
| ExperienceCard expand | click | grid-rows 0fr→1fr, opacity, margin-top; hover turns rail/dot/title primary | 500ms ease-in-out; hover 300ms |
| EducationCard expand | click | max-height 0→500px, opacity, margin-top; dot scale 1.25 + fill | 500ms ease-out |
| ProjectCard accordion | click (one open) | grid-rows, opacity, description + demo badge hide | 500ms ease-in-out |
| PillarCard expand | click | grid-rows, opacity, margin-top | 500ms ease-in-out |
| TagPill hover | hover / group-hover | bg, border, text, shadow-sm | 200ms |
| Button hover / press | hover, :active | Primary bg→primary-dark; Outline text+border→primary; Pill border/50 + text; scale .95 | 150ms |
| TextLink hover | hover | underline / colour; arrow translate-x 4px | 150ms |
| NavItem | hover; scroll spy | bg white, shadow, indicator; Active from IntersectionObserver (rootMargin −50%) | 200ms |
| Theme switch | click swatch | ring + scale 1.1; `data-theme` + localStorage; palette swaps instantly | 200ms swatch, 0ms palette |
| IconBox / SocialIcon | group-hover | bg primary/10→/20, icon primary-dark; scale 1.1 | 200ms |
| ExpandToggle | hover, click | chevron nudge ±2px; label + chevron swap | 150ms |
| GalleryTile → Lightbox | hover, click | image scale 1.05; overlay black/30; caption; lightbox mounts, Esc / arrows | 500 / 300 / 150ms |
| Hero typing | mount | type old (45ms/char) → pause 600 → strike 800 → type new → pause 600 → commit 200; cursor pulse 2s | per line |
| BipartiteVisual | click pill | edges opacity 700ms; nodes travel 1000ms; info box mounts | 700–1000ms ease-in-out |
| PlaceGroup accordion | click (one open) | bg secondary, border primary; pills mount | 150ms |
| Mobile menu | tap | Menu↔X; sheet mounts/unmounts | 0ms |
| Travel map | click filter; hover marker | filter chip Selected; zoom/center jump; tooltip mounts; geography hover fill | instant |
| SkillCard hover | hover / focus-within | border color-mix(primary 30%) | 300ms |
| Routing | pathname change; nav click | scrollTo(0,0) after first mount; smooth scrollIntoView; swipe-hint pulse | browser |

## Regenerating

```bash
npm run design:content     # src/data + src/content -> design/content/site-content.json
npm run design:kit         # the above + tokens + icons -> design/figma-plugin/code.js
npm run design:kit:check   # exit 1 if either committed output is stale
npm run design:kit:smoke   # run code.js against the mock Plugin API (design/figma-plugin/test)
```

`npm run design:kit` regenerates both files; commit them. The smoke test executes
the whole build in Node against a strict mock of the Plugin API, so a bundle
that would throw inside Figma (bad sizing mode, unloaded font, unknown
component, unwired property) fails before it is committed. Run it after editing
`design/figma-plugin/src/*.js`; `npm run lint` lints the generated bundle with
the sandbox globals.

Then in Figma: open the kit file, run the plugin with **Replace** ticked.

## Data cleanup findings

Building the content export meant reading every content path. The kit works with
the data as it is, but these are the things that would make the content/data
split cleaner (and two of them are bugs). None of these have been changed.

**Bugs**

1. **Course links never render.** `src/data/sections/education.js` defines
   `url` for every course, but `EducationCard.jsx` reads `course.URL`, so
   every coursework pill is a plain span. Rename one side.
2. **Two answers for "countries visited".** `personal/stats.js` hard-codes
   `"39"` for the home-page Quick Stats; `src/data/travel.js` (the generated
   source of truth) says 29 and drives `/personal` and the SEO description.
   Derive the stat from `travelData.stats.countriesVisited` or drop the row.

**Content still living in components (should be data)**

3. `TypingAnimation.jsx` — the three `LINES` and the three timing constants.
4. `TravelMap.jsx` — `FILTERS` (region → country codes, map center, zoom) and
   `VISITED_CODES` (a hand-maintained copy of `travel.js` → `countries[].iso3`).
5. `PersonalPage.jsx` — `CONTINENTS` (region → country codes) and the four
   stat tiles' labels/icons; `PersonalSection.jsx` — the same three stats
   again with different labels.
6. About 36 UI strings (section headings, button labels, the whole 404 page,
   the empty-projects copy) — listed with their file under `ui` in
   `design/content/site-content.json` and on the Content model page.
7. `SkillCard.jsx` and `pillars/index.js` each carry an icon-name → lucide
   map; the data files store the key (`"terminal"`, `"barChart"`).

**Data shape**

8. Prose inside JS data: `education.description`, `milestones[].description`
   (both flagged in the file comments) — the repo rule says sentences go in
   MDX.
9. Socials are split: `heroData.socials` has GitHub + LinkedIn and
   `IdentityBlock` renders a hidden Instagram icon because the URL only
   exists in `personal.mdx` frontmatter (`instagram`, `instagramHandle`).
10. `experienceGroups` (labels) in `data/sections/index.js` and the group
    buckets in `content/experience/index.js` must be edited together; the key
    `academic` displays as "Leadership".
11. `link: "#"` in `manager-dna.mdx` is a sentinel every consumer has to
    special-case; `null` / omit would do.
12. `gallery.js` paths have no leading slash (documented there) — fine today,
    breaks under any nested route.
13. `content.config.json` has `tabs: []`, so the Google Sheets sync pipeline
    is wired up but unused; the tables above (stats, milestones, favorites,
    education, coursework) are exactly the shape it expects.

**Presentation that bypasses the tokens**

14. Tailwind greys used directly (`text-gray-400`, `bg-gray-100`,
    `border-gray-200`, …) in most components instead of `--text-muted` /
    `--border` / `--surface-muted`. The kit carries them as the Primitives
    collection so the mapping is visible; promoting them is the next step for
    real theme support (the nature/editorial themes currently only recolour
    primary-ish elements).
15. Literals with an existing token: `#f59e0b` in `TravelMap.jsx`
    (`--accent-warn`), `text-[10px]` / `text-[11px]` / `text-[15px]`
    (`--text-micro` / `--text-eyebrow` / `--text-body`), `rounded-xl` /
    `rounded-2xl` alongside `--radius-lg`.
16. Theme swatch colours are duplicated in `src/theme.js` (`THEMES[].color`)
    rather than read from the `primary` token of each theme.

Suggested order: fix 1 and 2, move 3–5 into `src/data`, then decide whether the
strings in 6 live in a `src/data/ui.js` or in the Sheets pipeline (13).
