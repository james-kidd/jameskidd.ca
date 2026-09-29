// src/data/sections/skills.js
// Skill tag blocks for sectionData.skills.blocks
// Consumed by src/sections/SkillsSection.jsx
// The resume's skills section is the source of truth; this is the subset a
// non-technical reader can parse.

export const skillBlocks = [
  {
    id: "languages",
    title: "Languages",
    icon: "terminal",
    items: ["Python", "SQL", "TypeScript / JavaScript", "Java", "C/C++", "C# / .NET"],
  },

  {
    id: "data-ml",
    title: "Data & ML",
    icon: "database",
    items: [
      "Pandas",
      "NumPy",
      "scikit-learn",
      "PyTorch",
      "OpenCV",
      "PostgreSQL",
      "Snowflake",
      "Power Query",
    ],
  },

  {
    id: "infra",
    title: "Infra",
    icon: "cloud",
    items: ["Linux", "Docker", "AWS (EC2/S3)", "Git", "CI/CD"],
  },

  {
    id: "finance",
    title: "Finance Tools",
    icon: "trending",
    items: ["Bloomberg", "Morningstar Direct", "Seismic", "Salesforce"],
  },

  {
    id: "spoken",
    title: "Spoken Languages",
    icon: "web",
    items: ["English", "French (fluent)"],
  },
];
