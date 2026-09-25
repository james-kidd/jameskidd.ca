// content/site.ts
// Who the site is about: the hero, contact details and links in the footer.
import type { Site } from "./schema";

export const site: Site = {
  name: "James Kidd",
  title: "Software Developer & Data Scientist",
  tagline: "I design reliable data systems and internal tools",
  stack: ["Python", "PyTorch", "Pandas / NumPy", "SQL"],
  url: "https://jameskidd.info",
  ogImage: "/photos/about-me-2.jpg",
  resume: "/resume.pdf",

  contact: {
    recruiters: "contact details are included in my resume",
    contract: "dev@jameskidd.info",
  },

  socials: {
    github: "https://github.com/james-kidd/",
    linkedin: "https://linkedin.com/in/james-kidd-mtl/",
    instagram: "https://www.instagram.com/jameskidd__/",
  },

  typingLines: [
    { prefix: "I ", old: "code with", next: "orchestrate AI with", suffix: " taste" },
    { prefix: "I design ", old: "reliable data systems", next: "to rely on" },
    { prefix: "I ", old: "train models", next: "calculate decisions" },
  ],
};
