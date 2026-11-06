# 0003: The copy deck is generated, never hand-kept

Status: proposed (vault decision 3)

## Context
James kept a Drive document listing every section's copy. It drifted from the site within weeks.

## Decision
`scripts/copy-deck.mjs` writes `docs/copy-deck.md` from the content files in section-registry order, each field keyed by path with its source line and approval status. `npm run copy-deck:check` fails CI when it is stale. A push of the same text to the Drive document can follow later for comment-based review.

## Consequences
One page to read before stamping; PR diffs show copy changes in one place. The deck is read-only: edits go to the source file it names.
