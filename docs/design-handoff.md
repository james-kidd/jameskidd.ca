# Design handoff: the Figma agent and this repo

For the agent that works in Figma on `Jameskidd.info - Design System`, the
Shared kit and the Web, Documents and Video kits. It says what the site is,
how its structure is fixed, which direction each kind of change flows, and
what to do when a change in Figma looks wrong. Read it before touching a
variable or a component.

## The rule

- **Figma is true for design values.** Colour, type, spacing, radius, shadow,
  motion. If James changes a variable in Figma, the code follows: a DTCG
  export into `tokens/`, `npm run tokens`, a PR with the CSS diff.
- **Code is true for structure.** Components, their props and states, the
  page templates, the content types. Figma mirrors them; it does not invent
  them. A new component starts as a code file plus a style-kit row, and only
  then gets its Figma twin.
- **Words are never in Figma.** Every published word lives in this repo
  (`docs/copy-deck.md` lists them all). Figma holds placeholder text.
- **Advise, never override.** When a Figma change looks like a mistake, the
  agent says so, in writing, with the evidence, and leaves the value as James
  set it until he answers. It does not revert, round, rename or "fix" a value
  on its own.

## What the site is

A static, prerendered React site: the public record of James's experience,
projects and writing. Everything about him passes an approval stamp before
it goes online (`docs/approvals.md`). Content is Markdown with frontmatter
validated by `schemas/`; components render it and hold no copy of their own.
Three themes today (`tech`, `nature`, `editorial`) and three mediums (`site`,
`text`, `app`), with a decision pending to cut to one brand with light and
dark modes (vault report, decision 10).

## Structure the agent must know

| Layer | Where in code | Where in Figma | Flows |
|---|---|---|---|
| Primitives, theme, core, spacing, motion, effects | `tokens/shared/*.json` to `src/styles/tokens/shared.css` (PR #22) | Shared / 01 to 06 | Figma to code |
| Viewports | `tokens/web/01-viewports/*.json` to media queries | Web / 01 Viewports | Figma to code |
| Components | `src/components/`, `src/sections/components/`, `src/styles/components/*.css` | 10 Web Components | code to Figma |
| Page templates | `src/pages/`, `src/layout/`, `src/sections/registry.js` (section order) | 11 Browser layouts | code to Figma |
| Content types | `schemas/*.schema.json` | none; a card shows the fields a schema allows | code only |
| Documents (Word roles) | none | 20 Documents | Figma only, until the article template exists (`docs/writing.md`) |
| Video | `~/dev/sandbox/motion-kit` | 30 Video | separate |

Variable names are the contract: `color/action/primary` in Figma is
`--color-action-primary` in CSS, derived from the path. Set every variable's
code syntax to `var(--path-joined-with-dashes)` so the two never drift.

## When James changes Figma

1. Export the touched collections as DTCG JSON with the plugin named in
   `docs/figma-tokens.md`; overwrite the matching files in `tokens/`.
2. `npm run tokens`, then `npm run build`. The build fails if the three theme
   files no longer declare the same token names, if a value is a shape the
   CSS writer cannot render, or if a name collides with a Tailwind namespace.
3. Open a PR titled `tokens: <what changed>` with the CSS diff. Capture the
   home page in all three themes before and after; attach the captures.
4. In the vault, add one line under the project note's `## Notes` with the
   date and the PR number.

## When the agent notices a change that looks wrong

Write a **Design notes** block in the PR description (or, with no PR, in the
vault report under `## Decisions for James`), one bullet per concern, each
with the token, the old and new value, the evidence, and a recommendation.
Then stop. The value stays as James set it.

Checks worth running on every colour change:

- contrast: text on its surface meets WCAG AA (4.5:1 body, 3:1 large). Name
  the pair and the ratio. Example from 2026-11-05: Nature's `#059669` on
  white fails for small text; Figma's darker `#047857` passes.
- a primitive's name still describes its colour (`blue/200` was gray).
- a theme change reaches every mode, not one.
- durations are in the unit the code expects (milliseconds).
- a renamed variable keeps its code syntax, or the CSS name changes with it
  and the PR says so.

Checks on every component change in Figma:

- the component exists in code with the same props and states; if not, the
  change is a proposal for code, and the agent files it on the project board
  rather than publishing it in the library.
- variant order is `Variant, Size, State`; states are Default, Hover, Focus,
  Pressed, Disabled on anything interactive.
- nothing in the Pages file is drawn by hand: instances only.

## Open asks for the Figma agent (from the vault reports)

- Set every variable's code syntax, as above.
- Rename the mis-named primitives (`blue/200`, `blue/25`, `emerald/25`,
  `emerald/800`, `rose/600`, `rose/800`).
- Store durations in milliseconds, or say seconds in the description.
- Decide whether typeface belongs to the theme or to core (James: Geist
  everywhere, or one face per theme).
- Publish the Shared kit; rebuild the Pages file from instances (510
  hard-coded fills today).
- Code Connect from the Web Components to `src/components/` once the
  component names settle.

## Where to report

- Decisions for James: the vault report
  `Reports/jameskidd.info - design system layers for site, text and app.md`
  and the project note `Projects/Personal site (jameskidd.info).md`.
- Code questions: a PR on this repo. CI must stay green: `npm run lint`,
  `npm run check-content`, `npm run copy-deck:check`, `npm run build`.
- Figma file links: the table in the vault note
  `Design workflow - where work lives`.
