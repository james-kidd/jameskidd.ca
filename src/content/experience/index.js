import { byOrder, collectMdx, groupBy } from "../mdxCollection";

const modules = import.meta.glob("./*.mdx", { eager: true });

export const experiences = collectMdx(modules, { sort: byOrder });

const groupedExperiences = groupBy(experiences, "group");

export const experiencesByGroup = {
  internships: groupedExperiences.internships ?? [],
  academic: groupedExperiences.academic ?? [],
  freelance: groupedExperiences.freelance ?? [],
};
