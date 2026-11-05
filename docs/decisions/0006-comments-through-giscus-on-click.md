# 0006: Comments through giscus, loaded on click

Status: proposed (vault decision 7)

## Context
The site has no backend. James wants comments on project pages.

## Decision
giscus (GitHub Discussions) in `src/components/Comments.jsx`, mapped by page path, injected only after the reader clicks "Load comments". Config in `src/data/comments.js`, `enabled: false` until the ids are filled in.

## Consequences
No third-party script on a plain visit. Posting needs a GitHub account. Moderation is GitHub's. A Cloudflare Worker with D1 remains the alternative if ownership of the data matters later.
