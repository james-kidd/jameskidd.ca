// scripts/lib/frontmatter.mjs
//
// Frontmatter the way the site sees it. gray-matter's YAML engine turns an
// unquoted `2026-11-05` into a Date object; the Vite pipeline (remark with the
// `yaml` package, core schema) keeps it a string. The scripts validate what
// the build will see, so dates are folded back to YYYY-MM-DD strings here.

import matter from "gray-matter";

function plain(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, plain(inner)]));
  }
  return value;
}

/** Parse `text`; returns { data, content } with dates as strings. */
export function readFrontmatter(text) {
  const { data, content } = matter(text);
  return { data: plain(data), content };
}

/** Serialise frontmatter + body the same way, dates as strings. */
export function writeFrontmatter(content, data) {
  return matter.stringify(content, plain(data));
}
