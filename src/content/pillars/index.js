const modules = import.meta.glob("./*.mdx", { eager: true });

export const pillars = Object.values(modules)
  .map((mod) => ({
    ...mod.frontmatter,
    Description: mod.default,
  }))
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
