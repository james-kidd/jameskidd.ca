# 0005: A project page is a brief the project repo delivers

Status: proposed (vault decision 6)

## Context
James: the site keeps only the link, the requirements, the small text and the page template per project; the project's repo and agents own the rest, and write the page text when told "create a project page brief for jameskidd.info".

## Decision
`docs/project-brief.md` is the outward-facing contract. `scripts/sync-briefs.mjs` fetches `docs/jameskidd.info.md` from each repo in `briefs.config.json`, validates it (schema, body rules, MDX compile) and snapshots it under `src/content/projects/briefs/`. `ProjectPage` renders the brief as the body, the site's optional write-up below, comments last. Snapshots go online only once stamped.

## Consequences
The build stays offline. A project's README is untouched. Private repos need a read token in the scheduled sync.
