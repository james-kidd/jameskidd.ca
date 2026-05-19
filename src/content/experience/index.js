const modules = import.meta.glob("./*.mdx", { eager: true });

export const experiences = Object.values(modules)
  .map((mod) => ({
    ...mod.frontmatter,
    Body: mod.default,
  }))
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export const experiencesByGroup = {
  internships: experiences
    .filter((entry) => entry.group === "internships")
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
  academic: experiences
    .filter((entry) => entry.group === "academic")
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
  freelance: experiences
    .filter((entry) => entry.group === "freelance")
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999)),
};
