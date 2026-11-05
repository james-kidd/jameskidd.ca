# Project page brief: what a project delivers to jameskidd.info

jameskidd.info shows one page per project. The site owns four things about a
project: the **link**, the **requirements** (this document), the **page
template** (`src/pages/ProjectPage.jsx`) and the **approval stamp**. The project
owns the words. Its board, its cycle, its internal schemas and its data never
reach the site.

A project delivers its words as one Markdown file, the **brief**, in its own
repo. The site fetches it, validates it, snapshots it and shows it as the
"Read me" of the project page once James stamps it.

## The instruction

Paste this into a session inside the project's repo:

> Create a project page brief for jameskidd.info. The requirements are in
> `docs/project-brief.md` of the jameskidd.info repo
> (https://github.com/james-kidd/jameskidd.ca/blob/main/docs/project-brief.md).
> Write it to `docs/jameskidd.info.md` in this repo.

The project's agents read this document, write the brief from what the repo
actually does, and leave it for James to commit. They do not touch the site.

## Where it lives

- Path in the project repo: `docs/jameskidd.info.md` (override with `path` in the
  site's `briefs.config.json`).
- Branch: `main` (override with `ref`).
- The site lists the repo in `briefs.config.json`; nothing is fetched from a
  repo that is not listed.
- The site must already have a project record `src/content/projects/<slug>.mdx`
  with the same `slug`. The record is the card and the page header; the brief
  is the body.

## Frontmatter

YAML between `---` lines. The schema is `schemas/project-brief.schema.json`;
the sync rejects anything that fails it, including unknown keys.

| key | required | rule |
|---|---|---|
| `slug` | yes | equals the site's project slug, `a-z0-9` and hyphens |
| `title` | yes | up to 80 characters |
| `summary` | yes | one plain-text line, 20 to 200 characters, no Markdown |
| `repo` | yes | `https://github.com/<owner>/<name>` |
| `status` | yes | `idea`, `building`, `live`, `paused` or `archived` |
| `updated` | yes | `YYYY-MM-DD`, the day the brief was last rewritten |
| `started` | no | `YYYY` or `YYYY-MM` |
| `url` | no | the project's own site |
| `demo` | no | a live demo |
| `tags` | no | up to 8 short strings |
| `image` | no | absolute URL only; the site hosts nothing for a project |
| `license` | no | short string |

Never set `source`: the sync writes it on the snapshot.

## Body

Plain Markdown, about 300 words (hard limit 350). It is read by someone who has
never seen the repo: what the project does, who it is for, what state it is
in, and how to run or try it.

Allowed: paragraphs, `##` and `###` headings, bullet and numbered lists, bold
and italic, inline code, fenced code blocks, links and images with **absolute
URLs**.

Rejected by the sync, with the reason printed:

- HTML or JSX tags, HTML comments
- `{` or `}` outside code (kept out so the text stays plain Markdown)
- wiki links `[[...]]` and embeds `![[...]]`
- a `#` top-level heading (the site renders the title)
- relative links or image paths
- more than 350 words
- anything the Markdown compiler rejects

Keep the project's own README as it is; the brief is a separate, shorter text
written for the site's reader.

## Example

```markdown
---
slug: paint-by-number
title: Paint by number
summary: Turns a photo or a live camera frame into a numbered paint-by-number kit, with a paid download behind Stripe.
repo: https://github.com/james-kidd/bynumber
url: https://bynumber.app
status: building
started: 2026-09
updated: 2026-11-05
tags: [python, opencv, fastapi, stripe]
license: proprietary
---

## What it does

Upload a photo, or point a camera at a scene, and get back a numbered outline
with a palette. The segmentation is classical: CIELAB colour distances, SLIC
superpixels and region merging, with no neural network, so the same input
always gives the same kit.

## State

The web product runs on Cloud Run behind a Stripe paywall. The live-camera
mode is being ported from an earlier prototype.

## Try it

- Demo: https://huggingface.co/spaces/jkiddmtl/paint-by-number
- Code and runbook: https://github.com/james-kidd/bynumber
```

## What the site does with it

1. `npm run sync-briefs` fetches each listed brief, validates frontmatter and
   body, compiles the body as MDX, and writes
   `src/content/projects/briefs/<slug>.md`. One bad brief and nothing is
   written; the message names the brief and the rule.
2. The snapshot is committed. The build is offline and deterministic.
3. The snapshot is held off the site until James stamps it:
   `npm run approve -- src/content/projects/briefs/<slug>.md`. A new sync that
   changes the words breaks the stamp, and the page shows the previous build
   until he stamps again (`docs/approvals.md`).
4. `npm run sync-briefs:check` validates the committed snapshots in CI.

Private repos: the scheduled sync needs `GITHUB_BRIEFS_TOKEN`, a fine-grained
token with read access to the repo's contents, set as a repository secret.
