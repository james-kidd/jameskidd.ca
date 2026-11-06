# Handoff: get James through the open tickets, then the content gate goes live

From: mac, 2026-11-05 evening   Branch: `content-system` (local commit e858923, not pushed)

**First thing, next session:** read this file, then walk James through "Next steps" in order
and tick each one here as it closes. Do no other work on the site until the first three are done.
James asked for exactly this on 2026-11-05: "ensure I resolve the open tickets".

## Goal
The content gate (approval stamps, copy deck, schemas, project briefs, CI) is merged, the
current content is stamped by James, and nothing about him is online that he has not read.

## Done
- Content system built and committed on this branch; what each piece does: `README.md`,
  `docs/approvals.md`, `docs/project-brief.md`, `docs/design-handoff.md`, `docs/writing.md`,
  `docs/decisions/`.
- Old uncommitted edits preserved on `wip/local-edits-2026-11-05` (hero title
  "Technology Investment Analyst", meta tags, docs rewrite, hub plan). Not merged.
- Vault: `Reports/jameskidd.info - content system considerations.md` (16 decisions) and
  `Projects/Personal site (jameskidd.info).md` (the board).
- Verified locally: lint, `copy-deck:check`, `sync-briefs:check` pass; with temporary stamps
  the build is green, a brief renders, an unstamped item drops, an unstamped `hero.js` fails.

## Next steps (James's tickets, in order)
1. [ ] **Push and open the draft PR** (the agent is not allowed to publish from a session):
   ```bash
   git push -u origin content-system && git push -u origin wip/local-edits-2026-11-05
   gh pr create --draft --base main --head content-system \
     --title "Content gate: approval stamps, copy deck, schemas, project briefs" \
     --body-file .cache/pr-body.md
   ```
   `.cache/pr-body.md` exists only on the Mac mini; elsewhere, reuse the commit message of e858923.
2. [ ] **Stamp the current content** on this branch. The build fails on purpose until then.
   ```bash
   npm run copy-deck            # read docs/copy-deck.md, every word with its source and status
   npm run approve -- --all     # or one file: npm run approve -- experience/codejam
   npm run copy-deck && git commit -am "Approve current content" && git push
   ```
   The agent may run `copy-deck` and explain items; it never runs `approve`.
3. [ ] **Merge the PR** once CI is green. Online content is unchanged by the merge.
4. [ ] **Decide the hero title**: `git diff main wip/local-edits-2026-11-05 -- src/data/hero.js`.
   Main carries a `TODO(James)` on it. Whatever he picks, the file needs a stamp afterwards.
5. [ ] **Review draft PRs #21 (JSON-LD) and #22 (design system layers).** Both independent of this one.
6. [ ] **Domain**: renew or drop `jameskidd.info` by 2026-12-15 (Porkbun, expires 2026-12-30);
   add `www` in Vercel (HTTPS fails on it). Vault: `System/Accounts/Environments/jameskidd.info.md`.
7. [ ] **Cloudflare**: delete the `hub` tunnel, the `hub.jameskidd.info` DNS record and its Access
   apps (hub retired 2026-10-31). Vault: `System/Accounts/Services/Cloudflare.md`.
8. [ ] **Answer decisions 1 to 16** in the vault report (inline, each ends with its answer form).
   Built with defaults already: 3, 4, 6, 7, 16. Once answered, the agent turns them into
   accepted ADRs under `docs/decisions/`.
9. [ ] **Send the Figma design-branch link** so the Figma agent can start from `docs/design-handoff.md`.
10. [ ] Optional: **comments on**. Create a public Discussions repo, install the giscus app, fill
    `src/data/comments.js` (steps in the file).
11. [ ] Optional: **first project brief**. In a bynumber session paste: "Create a project page brief
    for jameskidd.info. The requirements are in `docs/project-brief.md` of the jameskidd.info repo.
    Write it to `docs/jameskidd.info.md` in this repo." Commit it there, add the repo to
    `briefs.config.json`, `npm run sync-briefs`, stamp the snapshot. bynumber is private: the
    scheduled sync needs a `GITHUB_BRIEFS_TOKEN` repository secret (fine-grained, contents: read).

After 1 to 3: delete this file in a commit on `main` and move anything still open to the
project note's board in the vault.

## Open decisions
- All in the vault report; the ones that change code next: rename `.mdx` content to `.md`
  (ADR 0008), cut to one theme (10), Cloudflare Pages (13), Typst for article PDFs (9).

## Not on the other machine
- `.cache/pr-body.md` (Mac mini only; gitignored).
- `gh` login as james-kidd (keyring on the Mac).
- The vault syncs by Syncthing; `~/.claude` memory does not.
- No `GITHUB_BRIEFS_TOKEN` exists yet anywhere.

## Commands
```bash
npm install
npm run lint && npm run copy-deck:check && npm run sync-briefs:check
npm run check-content        # exits 1 until James stamps: expected
npm run build                # fails at prebuild for the same reason until stamped
npm run approve -- --list    # status of every covered file
```
