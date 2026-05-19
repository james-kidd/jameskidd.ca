const modules = import.meta.glob("./*.mdx", { eager: true });

export const projects = Object.values(modules)
  .map((mod) => ({
    ...mod.frontmatter,
    Chapter: mod.default,
  }))
  .filter((p) => p.slug);

export const projectChapters = Object.fromEntries(
  projects.map((p) => [p.slug, p.Chapter])
);

export function hasChapter(slug) {
  return Boolean(projectChapters[slug]);
}
