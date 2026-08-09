// src/data/sections/index.js
// Assembles `sectionData` from the per-slice modules in this directory.
// Structured data, with one known exception: the education and milestone
// `description` fields are prose that has not yet been migrated to src/content/*.mdx,
// which the repo's content-split rule says is where sentences belong.
//
// Top-level keys are looked up by section id: HomePage renders each registry entry
// with `data={sectionData[id]}` (src/App.jsx). Not every section has an entry here —
// `experience` and `projects` intentionally receive `undefined` and source their
// content from src/content/*.mdx instead. Key order is irrelevant; only the names matter.

import { educationDetails } from "./education";
import { skillBlocks } from "./skills";
import { personal } from "./personal";

// Display labels for the experience groups.
// MUST stay in sync with the hardcoded group buckets in src/content/experience/index.js,
// which ExperienceSection.jsx indexes by these keys. Neither side is derived from the
// other, so both failure modes are live:
//   - a `group:` value in MDX frontmatter that is missing from BOTH lists is silently
//     dropped from the page;
//   - a key added HERE but not to experience/index.js makes `experiencesByGroup[key]`
//     undefined, and ExperienceSection.jsx crashes on `.map`.
// Add a group to both files at once.
export const experienceGroups = [
  { key: "internships", label: "Internships" },
  { key: "academic", label: "Leadership" },
  { key: "freelance", label: "Freelance" },
];

export const sectionData = {
  about: {
    education: {
      details: educationDetails,
    },
  },

  skills: {
    blocks: skillBlocks,
  },

  personal,
};
