import { lazy } from "react";

const modules = import.meta.glob("./*.mdx");

export const projectChapters = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => {
    const slug = path.replace(/^\.\//, "").replace(/\.mdx$/, "");
    return [slug, lazy(loader)];
  })
);

export function hasChapter(slug) {
  return Boolean(projectChapters[slug]);
}
