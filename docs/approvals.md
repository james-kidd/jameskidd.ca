# Approval stamps: workspace, record, and what is online

Two kinds of thing exist about James:

- the **workspace**: what he did, notes, drafts, inspiration for copy. That
  lives in the Obsidian vault and in project repos, and none of it is public;
- the **record**: the words published on jameskidd.info, and the words
  intended for it. That is this repo.

The record has its own gate. A piece of content goes online only when its
file carries an **approval stamp** that matches the file's exact text.
Anything an agent or James edits is held off the site until James reads it
and stamps it again. The site can be edited like a document, and nothing new
leaks before it has been read.

## The three states

| state | meaning | on the site? |
|---|---|---|
| `approved` | a stamp in `content.approvals.json` matches the file's sha | yes |
| `changed` | the file was edited after its stamp | no (last approved build stays up) |
| `unapproved` | the file has never been stamped | no |

`published: false` in an MDX file is a fourth, manual hold: the file stays in
the repo and nothing renders, stamp or not.

## What is covered

| files | kind | when not approved |
|---|---|---|
| `src/content/experience/*.{md,mdx}`, `src/content/projects/*.{md,mdx}`, `src/content/projects/briefs/*.md`, `src/content/writing/*.md` | collection | the item is dropped from the build, like `published: false` |
| `src/data/hero.js`, `src/data/sections/**/*.js` (not barrels), `src/content/about.mdx`, `src/content/personal.mdx` | structural | the build fails and names the file |

`src/data/travel.js` is generated from photo EXIF and is not covered.

## The workflow

1. Edit, or let an agent edit, any covered file. Or sync a project brief.
2. `npm run copy-deck`. Read `docs/copy-deck.md`: every word in section
   order, each with its source and status, and a review queue at the top.
3. Stamp what may go online:

   ```bash
   npm run approve -- --list                      # status of every covered file
   npm run approve -- experience/codejam          # one file, any unique part of its path
   npm run approve -- --all                       # everything unapproved or changed
   ```

4. `npm run copy-deck` again, commit `content.approvals.json` and the deck
   with the content change, push. The build runs `check-content` first and
   refuses to ship a structural file without a stamp.

`npm run dev` prints the same report without failing, so a held item is
visible while working.

## The switch

`content.approvals.json` has `"requireApproval": true`. Setting it to `false`
records stamps but stops enforcing them. It is a one-line change and a
visible one in any diff.

## What a stamp is

```json
"src/content/experience/codejam.mdx": { "sha": "0b1f6c9a2d3e4f50", "by": "James Kidd", "on": "2026-11-05" }
```

The sha is the first 16 hex digits of the SHA-256 of the file's text with
line endings and trailing whitespace normalised. The stamp is computed by
`npm run approve`; never type one in.

## How the build enforces it

- `scripts/remark-approval.mjs` runs inside the Vite MDX pipeline and adds
  `export const approval = {...}` to every covered Markdown or MDX file.
- `src/content/mdxCollection.js` drops entries whose approval is required and
  not `approved`.
- `scripts/check-content.mjs` (in `prebuild` and CI) validates every
  frontmatter against `schemas/` and fails on an unapproved structural file.
