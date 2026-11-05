# jameskidd.info

James Kidd's personal site: the public record of experience, projects and
writing. React 19, Vite 7, Tailwind v4, prerendered to static HTML, deployed
on Vercel. No backend.

```bash
npm install
npm run dev          # Vite with HMR; prints the content report first
npm run build        # tokens, content gate, client, SSR, prerender
npm run lint
```

## How content works

Words are data. Prose lives in Markdown with frontmatter under `src/content/`
(`.mdx` only where an old write-up embeds a component), rows in JS under
`src/data/`, design values in `tokens/`. Components render; they hold no copy
of their own beyond labels.

Nothing about James goes online until he has read it and stamped it.

| I want to | do |
|---|---|
| read every word the site publishes, with its status | `npm run copy-deck`, then open `docs/copy-deck.md` |
| approve content after reading it | `npm run approve -- <any unique part of the path>` or `--all` |
| see what is held and why | `npm run approve -- --list` or `npm run check-content` |
| change a role, a project card, the about text | edit the file the deck names, then stamp it |
| add a project | `src/content/projects/<slug>.mdx` (schema in `schemas/project.schema.json`), list its repo in `briefs.config.json` |
| get a project's read-me onto its page | in the project repo, create `docs/jameskidd.info.md` per `docs/project-brief.md`; here, `npm run sync-briefs` |
| turn on comments | fill `src/data/comments.js` from giscus.app |
| publish an article | `docs/writing.md` (vault export, next step) |
| change colours, type, spacing | `tokens/*.json`, then `npm run tokens` (`docs/figma-tokens.md`) |

Full workflow: `docs/approvals.md`. Decisions: `docs/decisions/`.

## Layout

```
src/content/          prose: experience/, projects/, projects/briefs/ (synced .md), writing/ (.md), about.mdx, personal.mdx
src/data/             rows: hero.js, sections/, travel.js (generated)
src/sections/         one component per home section; registry.js sets the order
src/pages/            /projects/:slug, /personal, 404
src/components/       shared UI, Comments, mdx/ overrides
schemas/              one JSON Schema per content type, with its schema.org mapping
scripts/              build-tokens, prerender, check-content, approve, copy-deck, sync-briefs, sync-content
docs/                 copy-deck.md (generated), approvals.md, project-brief.md, writing.md, design-handoff.md, figma-tokens.md, decisions/
content.approvals.json   the stamps (written by `npm run approve`)
briefs.config.json       which project repos deliver a brief
content.config.json      Google Sheets tabs, if any
```

## Checks that run on every PR

`.github/workflows/ci.yml`: lint, `check-content` (schemas and stamps),
`copy-deck:check`, `sync-briefs:check`, build. `.github/workflows/sync-briefs.yml`
fetches project briefs daily; `.github/workflows/sync-content.yml` does the
same for sheet tabs.
