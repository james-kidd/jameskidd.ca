// src/content/projects/briefs/index.js
//
// Project briefs: each project's own read-me, snapshotted from its repo by
// scripts/sync-briefs.mjs (contract: docs/project-brief.md). Plain Markdown,
// compiled in markdown mode: no JSX, no expressions. A brief renders
// as the main body of /projects/<slug>; the site's own record for the project
// stays in src/content/projects/<slug>.mdx.
//
// Everything here is generated. Do not hand-edit the .md files: change the
// brief in the project repo and run `npm run sync-briefs`.

import { collectMdx, keyBy } from "../../mdxCollection";

const modules = import.meta.glob("./*.md", { eager: true });

export const briefs = collectMdx(modules, {
  componentName: "ReadMe",
  filter: (brief) => brief.slug,
});

export const briefsBySlug = keyBy(briefs, "slug");
