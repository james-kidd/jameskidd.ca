# src/data/generated

**Machine-written. Do not hand-edit anything in this directory.**

Every `.json` file here is produced by `scripts/sync-content.mjs` from a published
Google Sheet tab and overwritten on the next sync. Edits made here are lost the
moment the sheet changes.

To change this content, edit the Google Sheet, then run:

```bash
npm run sync-content
```

The scheduled workflow `.github/workflows/sync-content.yml` does the same thing
daily and commits the result.

- Which sheet tab produces which file: `content.config.json`
- Sheet + column conventions: `docs/content-sheet.md`
- Verify the checked-in JSON still matches the sheet: `npm run sync-content:check`

Each file carries a `$generated` field repeating this warning, plus the `source`
URL it came from. There is deliberately no timestamp field — output depends only
on sheet contents, so an unchanged sheet produces a byte-identical file and the
CI commit step no-ops.
