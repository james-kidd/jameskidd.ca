// src/data/index.js

export const heroData = {
  name: "James Kidd",
  title: "Software Developer & Data Scientist",
  tagline:
    "I design reliable data systems and internal tools. Recruiters: download my résumé below. Contract work inquiries: use the site contact email.",
  resumeLink: "/assets/resume.pdf",
  socials: {
    github: "https://github.com/james-kidd/",
    linkedin: "https://linkedin.com/in/james-kidd-mtl/",
    instagram: "https://instagram.com/jameskidd__/",
  },
};

export const aboutData = {
  banner: "/assets/about-banner.jpg",

  intro: [
    "I build data automation and analytics systems that reduce friction between raw information and decision-making.",
    "My work sits at the intersection of software engineering, data science, and financial analytics.",
    "I focus on eliminating wasted effort, providing clarity, and delivering practical solutions."
  ],

  education: {
    details: [
      {
        school: "McGill University",
        degree: "B.Sc. Joint Mathematics & Computer Science",
        year: "2023 — 2026",
        description:
          "Concentration in data systems, statistical learning, automation, and algorithmic problem-solving.",
        coursework: [
          { code: "COMP 551", name: "Applied Machine Learning" },
          { code: "COMP 424", name: "Artificial Intelligence" },
          { code: "COMP 3XX", name: "Big Data Systems" },
          { code: "COMP 360", name: "Algorithm Design" },
          { code: "COMP 330", name: "Theory of Computation" },
          { code: "COMP 310", name: "Operating Systems" },
          { code: "MATH 324", name: "Statistics" },
          { code: "MATH 323", name: "Probability" },
          { code: "MATH 317", name: "Numerical Analysis" },
        ],
      },
      {
        school: "Queen’s University",
        degree: "B.Sc. Computer Engineering (Transferred)",
        year: "2020 — 2022",
        description:
          "Strong foundation in engineering mathematics, computer architecture, and low-level systems programming.",
        coursework: [
          { code: "ELEC 279", name: "Object-Oriented Programming" },
          { code: "ELEC 274", name: "Computer Architecture" },
          { code: "ELEC 271", name: "Digital Systems" },
          { code: "ELEC 270", name: "Discrete Mathematics" },
          { code: "MTHE 235", name: "Differential Equations" },
        ],
      },
    ],
  },
};

export const skillsData = {
  categories: [
    {
      title: "Languages",
      skills: ["Python", "C", "C++", "Java", "SQL", "JavaScript", "OCaml", "Scala", "PHP"],
    },
    {
      title: "Data Science & Machine Learning",
      skills: ["Pandas", "NumPy", "PyTorch", "TensorFlow", "Scikit-learn", "Matplotlib", "Selenium"],
    },
    {
      title: "Infrastructure & Development",
      skills: ["Linux (Ubuntu)", "Docker", "Git", "Apache Spark", "REST APIs", "React", "Node.js"],
    },
    {
      title: "Finance & Analytics",
      skills: ["Bloomberg Terminal", "Morningstar Direct", "Excel (VBA)", "Power BI"],
    },
  ],
};

export const experienceData = {
  internships: [
    {
      date: "Jan 2026 — May 2026",
      title: "Investment Advisory Intern (Incoming)",
      company: "CI Global Asset Management",
      description:
        "Incoming role supporting investment advisory and portfolio analysis teams.",
      skills: ["Financial Analysis", "Bloomberg", "Excel"],
      link: "https://www.cifinancial.com",
    },
    {
      date: "May 2024 — Sep 2024",
      title: "Software Developer Intern",
      company: "ITM Instruments Inc.",
      description:
        "Built Python automation for data migration between production and test systems. Developed data extraction and order conversion tools, enhanced Jira-based workflows, and implemented analytics using Meta Pixel and Google Analytics.",
      skills: ["Python", "SQL", "MariaDB", "PHP", "JavaScript", "Linux", "Jira"],
      link: "https://www.itm.com",
    },
    {
      date: "Jun 2021 — Sep 2021",
      title: "Technology Enablement Advisor Intern",
      company: "KPMG Hungary",
      description:
        "Analyzed operational workflows to identify automation opportunities. Designed UiPath workflows and delivered RPA recommendations with quantified efficiency gains.",
      skills: ["Process Automation", "UiPath", "Business Analysis"],
      link: "https://kpmg.com",
    },
  ],
  academic: [
    {
      date: "Jun 2023 — Sep 2026",
      title: "CodeJam Hackathon",
      school: "McGill University",
      description: "Logistics coordinator for large-scale student hackathons.",
      skills: [],
      link: "",
    },
  ],
  freelance: [
    {
      date: "2023 — Present",
      title: "Full Stack Developer",
      company: "Independent",
      description: "End-to-end web and automation solutions for small businesses.",
      skills: ["React", "Node.js", "Shopify", "Tailwind CSS"],
      link: "",
    },
  ],
};

export const projectData = [
  {
    title: "ETF Holdings Inference",
    description:
      "Built a data pipeline combining ETF and equity data from Yahoo Finance, iShares, and Bloomberg. Trained machine learning models to predict top-K ETF holdings and analyze portfolio manager behavior.",
    skills: ["Python", "Pandas", "Scikit-learn", "Machine Learning", "Financial Data"],
    link: "https://github.com/james-kidd/",
  },
  {
    title: "SquashNoFriends",
    description:
      "Squash partner-matching platform built at McGill CodeJam. Used NLP to parse availability and a Python scheduler to generate weekly matches. Deployed with a Next.js frontend and MySQL backend.",
    skills: ["Python", "NLP", "Next.js", "MySQL"],
    link: "https://github.com/james-kidd/",
  },
];

export const personalData = {
  description:
    "Outside of software and data, I spend most of my time traveling and exploring the outdoors.",

  favorites: [
    { label: "Current Read", value: "Outliers" },
    { label: "Camera", value: "Canon AE-1 Program" },
    { label: "Golf Handicap", value: "High" },
    { label: "Activities", value: "Backpacking, Hiking" },
  ],

  gallery: [
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Hiking+Trip", alt: "Hiking trip" },
    { src: "https://placehold.co/600x800/2a2a2a/FFF?text=Film+Photo", alt: "Film photography" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Workspace", alt: "Workspace setup" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Travel", alt: "Travel photography" },
  ],
};

export const contactData = {
  email: "james.kidd@mail.mcgill.ca",
  github: "https://github.com/james-kidd",
  linkedin: "https://www.linkedin.com/in/james-kidd-mtl",
  message:
    "Open to discussions around software engineering, data systems, and finance-oriented technical work.",
};

export const siteConfig = {
  navigation: [
    {
      id: "about",
      label: "About",
      component: "AboutSection",
      data: {
        intro: aboutData.intro,
        education: aboutData.education,
      },
    },
    {
      id: "experience",
      label: "Experience",
      component: "ExperienceSection",
      data: experienceData,
    },
    {
      id: "projects",
      label: "Projects",
      component: "ProjectsSection",
      data: projectData,
    },
    {
      id: "skills",
      label: "Skills",
      component: "SkillsSection",
      data: skillsData,
    },
    {
      id: "personal",
      label: "Personal",
      component: "PersonalSection",
      data: personalData,
    },
  ],
};
