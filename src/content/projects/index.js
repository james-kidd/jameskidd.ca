import { collectMdx, keyBy } from "../mdxCollection";

const modules = import.meta.glob("./*.mdx", { eager: true });

export const projects = collectMdx(modules, {
  componentName: "Chapter",
  filter: (project) => project.slug,
});

export const projectChapters = keyBy(projects, "slug", (project) => project.Chapter);

export function hasChapter(slug) {
  return Boolean(projectChapters[slug]);
}
