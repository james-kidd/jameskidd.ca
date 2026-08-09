# Managing site content in Google Sheets

Tabular content on this site (things that are naturally a list of rows —
education, coursework, certifications, timeline entries, and so on) is authored
in a single Google Sheet and synced into the repo as JSON. Prose stays in MDX
under `src/content/`; this pipeline is only for rows and columns.

The site has no backend and does no runtime fetching — everything is bundled at
build time. So the sheet is not read by visitors' browsers. Instead:

```
Google Sheet tab
  -> published as CSV
    -> scripts/sync-content.mjs (scheduled GitHub Action, or run by hand)
      -> src/data/generated/<name>.json  (committed to the repo)
        -> imported by src/data/*.js at build time
          -> Vercel deploy
```

Nothing here is proprietary: CSV in, JSON out, both plain text in git.

---

## 1. Sheet layout rules

**One tab per content type.** A tab maps 1:1 to a generated JSON file. Don't put
two kinds of thing in one tab.

**Row 1 is the header row.** Every other row is data.

**Column names** must be:

- `lower_snake_case` — `start_date`, not `Start Date`
- unique within the tab (the sync fails on duplicates)
- stable — renaming a column is a code change, because `content.config.json`
  and the consuming JS both reference it by name

**Reserved names.** Never use `Body`, `Chapter`, `Description`, or `sourcePath`
as column names. The MDX loader (`src/content/mdxCollection.js`) flattens
frontmatter to the top level and attaches the compiled body component under
those keys, so a sheet column with one of those names would collide the moment
this data is merged with MDX frontmatter.

**Every column in the tab ends up in the JSON.** If you want a scratch column
that stays out of the build, list it under `ignoreColumns` in the config (see
below) — or just keep it in a separate tab.

**Blank rows are skipped**, wherever they are — leading, trailing, or in the
middle. Error messages still quote the row number you see in the sheet, so you
can jump straight to it.

**Don't put data to the right of the last named column.** A value in a column
with no header would be dropped silently, so the sync fails instead.

**Cells are trimmed.** Leading/trailing whitespace is stripped from every value.

---

## 2. Ordering: always add an `order` column

Do **not** rely on row position. Sorting or inserting rows in the sheet would
silently reshuffle the site, and a spreadsheet is exactly the place where
somebody sorts a column to look something up and forgets to undo it.

Add an integer `order` column and declare it as a number:

| order | ... |
| ----- | --- |
| 10    | ... |
| 20    | ... |
| 30    | ... |

Number in tens so you can insert between rows without renumbering.

The sync sorts by `order` automatically when that column exists. Set `sortBy` in
the config to sort by a different column, plus `sortDirection: "desc"` to
reverse. If a tab has neither, the sync still works but prints a warning and
falls back to sheet row order.

---

## 3. Publishing a tab as CSV

For each tab, in Google Sheets:

1. **File → Share → Publish to web**
2. In the first dropdown, select **the specific tab** (not "Entire document")
3. In the second dropdown, select **Comma-separated values (.csv)**
4. Click **Publish**, confirm, and copy the URL

The URL looks like:

```
https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123456789&single=true&output=csv
```

The `gid` identifies the tab, so **each tab has its own URL** — publish every
tab you want synced and copy each one.

> ### ⚠️ Publishing makes that tab publicly readable
>
> Anyone with the URL can read the published tab, no Google account needed, and
> the URL ends up committed to a public repo in `content.config.json`. Search
> engines can index published sheets.
>
> **Put nothing private in a published tab.** No addresses, phone numbers,
> salaries, unpublished plans, other people's details, or anything you wouldn't
> post on the site itself — the whole point is that it *is* going on the site.
> Keep private working notes in a separate, unpublished tab.
>
> Publishing is also independent of sharing: a sheet can be private to your
> account and still have a published tab. Unpublish from the same dialog
> (**Publish to web → Published content & settings → Stop publishing**).

Google caches published CSVs for a few minutes, so an edit may take up to ~5
minutes to show up in a sync. That's fine for a daily job.

---

## 4. Wiring a tab into the build

Add an entry to the `tabs` array in `content.config.json`:

```json
{
  "key": "certifications",
  "description": "One row per certification shown on the home page.",
  "csvUrl": "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=987654321&single=true&output=csv",
  "output": "certifications.json",
  "requiredColumns": ["order", "name", "issuer", "issued"],
  "columns": {
    "order": "number",
    "featured": "boolean",
    "skills": "string-array"
  },
  "sortBy": "order"
}
```

### Field reference

| Field             | Required | Meaning                                                                                                                                                        |
| ----------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`             | yes      | Stable identifier. Also what you pass to `--tab`.                                                                                                              |
| `csvUrl`          | yes      | The published-CSV URL for that tab. Must end in `output=csv`.                                                                                                   |
| `output`          | yes      | Bare `.json` filename written under `src/data/generated/`. No slashes.                                                                                          |
| `requiredColumns` | no       | Must exist in the header **and** be non-empty in every data row. The sync fails, naming the tab and the column, and writes nothing.                              |
| `columns`         | no       | Column name → type. Anything unlisted stays a string.                                                                                                           |
| `sortBy`          | no       | Column to sort by. Defaults to `order` when present.                                                                                                            |
| `sortDirection`   | no       | `"asc"` (default) or `"desc"`.                                                                                                                                  |
| `ignoreColumns`   | no       | Sheet columns to keep out of the JSON. A column here may not also appear in `requiredColumns`, `sortBy`, or `groupBy.column` — the config check rejects that rather than silently disabling the feature. |
| `groupBy`         | no       | Emit a `groups` map instead of a flat `rows` array. See [parent/child tabs](#6-parentchild-tabs).                                                                |
| `description`     | no       | Free-text note for whoever reads the config next.                                                                                                               |

### Column types

| Type           | Sheet value           | JSON value            | Notes                                                          |
| -------------- | --------------------- | --------------------- | -------------------------------------------------------------- |
| `string`       | `McGill University`   | `"McGill University"` | The default. Trimmed.                                          |
| `number`       | `10`, `1,250`, `3.5`  | `10`, `1250`, `3.5`   | Empty cell → `null`. Non-numeric → hard error. Commas are stripped only in thousands position, so a locale decimal like `3,5` fails loudly rather than becoming `35` — use `3.5`. |
| `boolean`      | `TRUE`/`yes`/`1`/`x`  | `true`                | `FALSE`/`no`/`0`/empty → `false`. Anything else → hard error.   |
| `string-array` | `React \| Vite \| CSS` | `["React","Vite","CSS"]` | Split on `\|`, trimmed, empties dropped.                      |

Aliases accepted: `text`/`str` → string, `int`/`integer`/`float` → number,
`bool` → boolean, `list`/`array` → string-array.

---

## 5. Running the sync

```bash
npm run sync-content               # sync every tab
npm run sync-content:check         # fail if checked-in JSON is stale; writes nothing
node scripts/sync-content.mjs --tab certifications    # one tab (repeatable)
node scripts/sync-content.mjs --config other.json     # alternate config file
node scripts/sync-content.mjs --help
```

Behaviour worth knowing:

- **Writes are atomic across the run.** Every tab is fetched and validated
  before anything touches disk. One bad tab means no files change at all — you
  never get a half-updated `src/data/generated/`.
- **Validation is loud, not lenient.** A missing required column, an empty
  required cell, a non-numeric value in a number column, or a duplicate header
  aborts the run with the tab name, the sheet row number, and the column name.
  Silently emitting partial data is the failure mode this pipeline exists to
  avoid.
- **Output is deterministic.** Row keys are sorted alphabetically, rows are
  sorted by the sort column, files end in a newline, and there is no timestamp
  field. An unchanged sheet produces a byte-identical file, so the CI commit
  step correctly no-ops.
- **Failures exit non-zero**, including network failures (each URL is retried
  three times first).

`.github/workflows/sync-content.yml` runs `npm run sync-content` daily and on
manual dispatch, and commits only if files actually changed. Pushing to the
default branch triggers the normal Vercel deploy.

---

## 6. Parent/child tabs

Some content is relational — a couple of schools, each with a dozen courses.
Model that as two tabs joined on an explicit id, never as one wide tab.

**Parent tab `education`** — one row per school, with a stable `id`:

| order | id       | school            | credential          | start | end  |
| ----- | -------- | ----------------- | ------------------- | ----- | ---- |
| 10    | `mcgill` | McGill University | BCom, Finance       | 2018  | 2022 |
| 20    | `ivey`   | Ivey Business ... | Exchange, Business  | 2021  | 2021 |

**Child tab `coursework`** — many rows, pointing back with `school_id`:

| order | school_id | title                     | featured |
| ----- | --------- | ------------------------- | -------- |
| 10    | `mcgill`  | Corporate Finance         | TRUE     |
| 20    | `mcgill`  | Financial Derivatives     | FALSE    |
| 10    | `ivey`    | Cross-Enterprise Strategy | TRUE     |

Config the child with `groupBy`:

```json
{
  "key": "coursework",
  "csvUrl": "...output=csv",
  "output": "coursework.json",
  "requiredColumns": ["order", "school_id", "title"],
  "columns": { "order": "number", "featured": "boolean" },
  "sortBy": "order",
  "groupBy": {
    "column": "school_id",
    "references": { "tab": "education", "column": "id" }
  }
}
```

`references` turns typos into build failures: if a `school_id` has no matching
`education.id`, the sync aborts and names the orphaned values. (The check is
skipped with a printed note when you sync only the child via `--tab`, since the
parent isn't part of that run.)

The child's JSON then contains a `groups` map keyed by `school_id`, so joining
in JS is one line:

```js
// src/data/education.js
import educationJson from "./generated/education.json";
import courseworkJson from "./generated/coursework.json";

export const education = educationJson.rows.map((school) => ({
  ...school,
  coursework: courseworkJson.groups[school.id] ?? [],
}));
```

---

## 7. Generated output shape

A flat tab produces:

```json
{
  "$generated": "Auto-generated by scripts/sync-content.mjs from a published Google Sheet. Do not edit by hand.",
  "tab": "certifications",
  "source": "https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv",
  "sortedBy": "order",
  "count": 2,
  "rows": [
    { "featured": true, "issued": "2024-03", "issuer": "AWS", "name": "Solutions Architect", "order": 10, "skills": ["AWS", "IaC"] },
    { "featured": false, "issued": "2023-11", "issuer": "Google", "name": "Data Analytics", "order": 20, "skills": ["SQL"] }
  ]
}
```

A `groupBy` tab replaces `rows` with `groupedBy` (the column name) and `groups`
(a map from column value to that value's rows).

Consumers import the JSON from a hand-written `src/data/*.js` module rather than
importing `src/data/generated/*.json` directly from components — that keeps the
shaping logic (joins, derived fields, renames) in one place and matches the
existing data-file convention.

`src/data/generated/` is machine-written. Don't hand-edit it; edit the sheet.

---

## 8. Troubleshooting

| Symptom                                     | Cause                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `the URL returned HTML, not CSV`            | The tab isn't published, or the URL is the normal `/edit` sheet URL. Republish and copy the `output=csv` one. |
| `missing required column(s): x`             | The header row doesn't contain `x` — check spelling and case.                                              |
| `row 7: required column "x" is empty`       | Sheet row 7 has a blank cell in a required column. Row 1 is the header, so this is the 6th data row.        |
| `expected a number, got "12 months"`        | A number column has non-numeric text. Split it into two columns.                                            |
| `duplicate column name(s)`                  | Two columns share a header. Rename one.                                                                    |
| `data found outside the header columns`     | A cell has content in a column with no header. Add a header or clear the cell.                             |
| `no sort column, so JSON order mirrors...`  | The tab has no `order` column and no `sortBy`. Add one — see [Ordering](#2-ordering-always-add-an-order-column). |
| Edit in the sheet doesn't show up           | Google caches published CSVs a few minutes. Wait, then re-run.                                              |
| `sync-content:check` fails in CI            | The sheet changed but the JSON wasn't committed. Run `npm run sync-content` and commit.                     |
