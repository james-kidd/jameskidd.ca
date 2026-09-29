// src/data/hero.js
export const heroData = {
  name: "James Kidd",
  // TODO(James): positioning. Was "Software Developer & Data Scientist"; the plain
  // degree line below is the audit's proposal. Decide whether the hero stays technical.
  title: "Mathematics & Computer Science, McGill '26",
  tagline: "I design reliable data systems and internal tools",
  stack: ["Python", "PyTorch", "Pandas / NumPy", "SQL"],
  resumeLink: "/James_Kidd_Resume.pdf",

  emails: {
    school: "james.kidd@mail.mcgill.ca",
    dev: "dev@jameskidd.info",
  },

  contactGuidance: {
    recruiter: {
      label: "Recruiters",
      text: "contact details are included in my resume",
    },
    contract: {
      label: "Contract inquiries",
      emailKey: "dev",
    },
  },

  socials: {
    github: "https://github.com/james-kidd/",
    linkedin: "https://linkedin.com/in/james-kidd-mtl/",
  },
};
