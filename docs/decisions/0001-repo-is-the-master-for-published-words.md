# 0001: The repo is the master for every published word

Status: proposed (vault decision 1, 2026-11-05)

## Context
Four sources disagreed on the hero title: a Drive document, a local edit, `origin/main` and the vault. The Google Sheets sync on main had no tab wired.

## Decision
`src/content/*.mdx` and `src/data/**` are the only master for what the site publishes. Other surfaces (the Drive document, the vault) are either generated views of this repo or private workspaces that export into it.

## Consequences
The Drive document is no longer edited by hand; `docs/copy-deck.md` replaces it. Rows stay as JS data in the repo unless decision 2 wires the sheet.
