# 0004: Every content type has a JSON Schema with its schema.org mapping

Status: proposed (vault decisions 4 and 5)

## Context
Frontmatter keys were documented in prose only. The site's JSON-LD graph (PR #21) reads them.

## Decision
`schemas/<type>.schema.json` (draft 2020-12) for experience, project, project-brief and article. Each carries an `x-schema-org` block naming the `@type` and the key mapping. `scripts/check-content.mjs` validates every MDX frontmatter in `prebuild` and CI. The site's graph is about one Person; projects own their domain schemas and the site never imports them.

## Consequences
An unknown key or a bad value fails the build with the file and the key. The schemas can move to `~/dev/platform/schemas/` once the platform's type policy lands.
