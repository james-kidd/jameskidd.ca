// src/data/hero.js
//
// The whole published surface of the shell site: a name, one line, and a list of
// links shown as tiles. Nothing else about James is rendered, so this one file is
// the only content the approval gate has to cover (scripts/lib/approval.mjs).
//
// To add a tile (a new page later, a project, a profile): add an entry to `links`.
// That edits this file, which breaks its stamp, so the tile stays off the site
// until James runs `npm run approve -- hero`.
//
// Held back on purpose (kept in the repo, not rendered): stack tags, the school
// email, the resume (held/James_Kidd_Resume.pdf, no longer served), the email tile, education, experience, skills, projects, personal,
// travel and photos. Their files are untouched; see docs/approvals.md.
export const heroData = {
  name: "James Kidd",
  // TODO(James): positioning. Was "Software Developer & Data Scientist"; the plain
  // degree line below is the audit's proposal. Decide whether the hero stays technical.
  title: "Mathematics & Computer Science, McGill '26",
  tagline: "I design reliable data systems and internal tools",

  // Tiles, in order. `external` opens a new tab; internal pages use a path and no flag.
  links: [
    {
      id: "linkedin",
      label: "LinkedIn",
      note: "Experience and background",
      href: "https://linkedin.com/in/james-kidd-mtl/",
      icon: "linkedin",
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      note: "Code and projects",
      href: "https://github.com/james-kidd/",
      icon: "github",
      external: true,
    },
  ],
};
