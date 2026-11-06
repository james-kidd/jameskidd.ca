# 0007: Lint, content check, deck check, brief check and build block every PR

Status: proposed (vault decision 16)

## Context
Only a scheduled sheet sync existed as automation; nothing ran on a PR.

## Decision
`.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm run check-content`, `npm run copy-deck:check`, `npm run sync-briefs:check` and `npm run build` on every PR and push to main. `.github/workflows/sync-briefs.yml` runs the brief sync daily and commits snapshots.

## Consequences
A stale deck, an invalid frontmatter or an unstamped structural file turns the PR red with a message naming the file. Lighthouse and visual captures stay advisory for now.
