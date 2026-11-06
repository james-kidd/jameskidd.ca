# 0002: Approval stamps gate what goes online

Status: accepted (James, 2026-11-05: "I want to start with approval stamps on info published online about me")

## Context
Agents edit content. James wants the comfort of editing the site like a document and the certainty that nothing about him goes online before he has read it.

## Decision
`content.approvals.json` binds each covered file to the sha of its text. Collection items without a matching stamp are dropped at build; structural files without one fail the build. Only `npm run approve` writes stamps. `docs/approvals.md` is the workflow.

## Consequences
Every content change needs a read and a stamp before it deploys. A merged PR without stamps keeps the previous build live. The deck's review queue is the to-do list.
