# Writing: from the vault to the site

Articles are written in the Obsidian vault (`~/Notes/jameskidd/Writing/`),
the workspace, and leave for this repo, the record, only by an explicit
export. This document is the contract between the two; the export tool is a
vault script to be written next (`_tools/publish-writing/`), and the site
side (the `/writing` routes) follows once the first article exists. The
schema is already in place: `schemas/article.schema.json`.

## A note that can leave the vault

Frontmatter, in the note:

| key | required | rule |
|---|---|---|
| `publish` | yes | `true`. Everything else in the vault stays private |
| `slug` | yes | route `/writing/<slug>`; never changes once published |
| `title` | yes | up to 120 characters |
| `summary` | yes | 20 to 300 characters, plain text |
| `date` | yes | first published, `YYYY-MM-DD` |
| `updated` | no | `YYYY-MM-DD`; bump on every change to the text |
| `version` | no | integer, bumped with every PDF re-issue |
| `schemaType` | yes | `Article`, `BlogPosting` or `ScholarlyArticle` |
| `topic` | no | up to 6 vault topic slugs |
| `pdf` | no | `papers/<slug>-v<version>.pdf` under `public/`, or an absolute URL |

The vault's own keys (`type`, `area`, `tags`, `created`, `source`) are not
copied: the export carries an allowlist, nothing else crosses.

## What the export checks before writing

- every `[[wikilink]]` resolves to another note with `publish: true` (it
  becomes a site link) or to nothing at all (export fails and names the
  link). A link into the private vault never reaches the site;
- no `![[embed]]`; images are copied to `public/writing/<slug>/` and the
  reference rewritten to a site path;
- callouts (`> [!note]`) are kept as Markdown blockquotes and styled by a
  remark transform at build, never turned into JSX; any other Obsidian-only
  syntax fails the export with the line;
- HTML tags, `{` and `}` outside code fail: the article stays plain Markdown
  (`docs/decisions/0008-content-is-markdown-not-mdx.md`);
- the result validates against `schemas/article.schema.json`.

The export writes `src/content/writing/<slug>.md`. From there the normal
gate applies: the article is held until James stamps it
(`docs/approvals.md`), and `docs/copy-deck.md` lists it under `writing`.

## The PDF side

One canonical URL per article. The PDF is an alternate representation of the
same page (`<link rel="alternate" type="application/pdf">` and schema.org
`encoding`), immutable per version: `papers/<slug>-v2.pdf` never changes,
`updated` and `version` move in the frontmatter, and a short change log
closes the article. Engine and template are an open decision (Typst
recommended; see the vault report).
