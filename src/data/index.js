// src/data/index.js

export const heroData = {
  name: "James Kidd",
  title: "Software Developer & Data Scientist",
  tagline:
    "I build data-driven systems, internal tooling, and scalable software with a focus on clarity and performance.",
  resumeLink: "/assets/resume.pdf",
  socials: {
    github: "https://github.com/james-kidd/",
    linkedin: "https://linkedin.com/in/james-kidd-mtl/",
    instagram: "https://instagram.com/jameskidd__/",
  },
};

export const aboutData = {
  banner: "/assets/about-banner.jpg", // You can remove this if you prefer a clean text look

  // The "Selling Point" Intro
  intro: [
    "I build data automation and analytics systems that reduce friction between raw information and real decision-making.",
    "My work sits at the intersection of software engineering, data pipelines, and financial analytics — turning messy inputs into structured, reliable outputs.",
    "I care less about flashy tech and more about systems that run quietly, scale cleanly, and earn trust over time."
  ],

  education: {
    details: [
      {
        school: "McGill University",
        degree: "B.Sc. Joint Mathematics & Computer Science",
        year: "2023 — 2026",
        description:
          "Focus on data systems, statistical learning, automation, and algorithmic thinking.",
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
        ]
      },
      {
        school: "Queen’s University",
        degree: "B.Sc. Computer Engineering (Transferred)",
        year: "2020 — 2022",
        description:
          "Strong foundation in engineering mathematics, systems, and low-level programming.",
        coursework: [
          { code: "ELEC 279", name: "Object-Oriented Programming" },
          { code: "ELEC 274", name: "Computer Architecture" },
          { code: "ELEC 271", name: "Digital Systems" },
          { code: "ELEC 270", name: "Discrete Math" },
          { code: "MTHE 235", name: "Differential Equations" },
        ]
      }
    ]
  },
};

// Organized Skills for the SkillsSection
export const skillsData = {
  categories: [
    {
      title: "Languages",
      skills: ["Python", "C", "Java", "C++", "SQL", "JavaScript", "OCaml", "Scala", "PHP"]
    },
    {
      title: "Data Science & ML",
      skills: ["Pandas", "NumPy", "PyTorch", "TensorFlow", "Scikit-learn", "Matplotlib", "Selenium"]
    },
    {
      title: "Infrastructure & Tools",
      skills: ["Docker", "Linux (Ubuntu)", "Git", "Apache Spark", "REST APIs", "React", "Node.js"]
    },
    {
      title: "Finance & BI",
      skills: ["Bloomberg Terminal", "Morningstar Direct", "Excel (VBA)", "Power BI"]
    }
  ]
};

export const experienceData = {
  internships: [
    {
      date: "Jan 2026 — May 2026",
      title: "Investment Advisory Intern (Incoming)",
      company: "CI Global Asset Management",
      description:
        "Incoming internship focused on investment advisory and portfolio analysis within a global asset management firm. Will be leveraging financial data tools to support strategic decision-making.",
      skills: ["Financial Analysis", "Data Analysis", "Bloomberg", "Excel"],
      link: "https://www.cifinancial.com",
    },
    {
      date: "May 2024 — Sep 2024",
      title: "Software Developer Intern",
      company: "ITM Instruments Inc.",
      description:
        "Developed Python automation scripts to support data transfer between production and test environments. Built flexible data extraction and order conversion features, enhanced Jira-based project tracking, and implemented analytics tooling using Meta Pixel and Google Analytics.",
      skills: ["Python", "SQL", "MariaDB", "PHP", "JavaScript", "Linux", "Jira"],
      link: "https://www.itm.com",
    },
    {
      date: "Jun 2021 — Sep 2021",
      title: "Technology Enablement Advisor Intern",
      company: "KPMG Hungary",
      description:
        "Mapped end-to-end operational workflows to identify automation opportunities. Designed UiPath workflow diagrams highlighting efficiency gaps and delivered RPA recommendations with projected time savings.",
      skills: ["Process Automation", "UiPath", "Business Analysis"],
      link: "https://kpmg.com",
    }
  ],
  academic: [
    {
      date: "2023",
      title: "CodeJam Participant",
      school: "McGill University",
      description: "Collaborated in a 48-hour hackathon to build a sports matchmaking platform using NLP and Python.",
      skills: ["Python", "NLP", "Teamwork"],
      link: "",
    }
  ],
  freelance: [
    {
      date: "2023 — Present",
      title: "Full Stack Developer",
      company: "Freelance",
      description: "Building custom web solutions for local businesses, focusing on SEO-optimized landing pages and inventory management systems.",
      skills: ["React", "Shopify", "Node.js", "Tailwind CSS"],
      link: "",
    }
  ],
};

export const projectData = [
  {
    title: "ETF Holdings Inference",
    description:
      "Built a data pipeline combining ETF and equity data from Yahoo Finance/iShares with Bloomberg fundamentals. Developed machine learning models to predict whether securities appear in an ETF’s top-K holdings to analyze portfolio manager behavior.",
    skills: ["Python", "Pandas", "Scikit-learn", "ML", "Financial Data"],
    link: "https://github.com/james-kidd/etf-inference",
  },
  {
    title: "SquashNoFriends",
    description:
      "A squash-partner matching platform built at McGill CodeJam. Used NLP techniques to parse player availability and a Python scheduling algorithm to generate weekly matches. Deployed with a Next.js frontend and MySQL backend.",
    skills: ["Python", "NLP", "Next.js", "MySQL", "Apache"],
    link: "https://github.com/james-kidd/squash-no-friends",
  },
  {
    title: "High-Frequency Order Book Sim",
    description:
      "Designed a low-latency limit order book simulation in C++. Implemented matching engine logic to handle bid/ask spread updates and trade execution, optimizing for memory safety and pointer management.",
    skills: ["C++", "Systems Programming", "Algorithms", "Market Microstructure"],
    link: "https://github.com/james-kidd/cpp-orderbook",
  },
  {
    title: "Distributed Log Analyzer",
    description:
      "A distributed system tool written in Java and Python to parse and aggregate server logs across multiple nodes. Uses a master-worker architecture to parallelize log processing for anomaly detection.",
    skills: ["Java", "Python", "Distributed Systems", "Networking"],
    link: "https://github.com/james-kidd/log-analyzer",
  }
];

export const personalData = {
  description:
    "Outside of code and data, I need to be moving. Whether it's backpacking through a national park, shooting film on my old Canon, or just finding the best espresso in Montreal, I value environments that reward curiosity.",
  
  // The "Fun Sub-Things"
  favorites: [
    { label: "Current Read", value: "Thinking, Fast and Slow" },
    { label: "Camera", value: "Canon AE-1 Program" },
    { label: "Go-to Coffee", value: "Cortado" },
    { label: "Activity", value: "Backpacking & Hiking" },
  ],

  // Placeholder Images - Just replace the src with your actual local paths later
  // e.g. src: "/assets/personal/hiking.jpg"
  gallery: [
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Hiking+Trip", alt: "Hiking in the Laurentians" },
    { src: "https://placehold.co/600x800/2a2a2a/FFF?text=Film+Photo+1", alt: "Street photography shot" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Code+Setup", alt: "My workspace" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Coffee+Shop", alt: "Cafe work session" },
    { src: "https://placehold.co/600x800/2a2a2a/FFF?text=Travel+Shot", alt: "Backpacking Europe" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Graduation", alt: "University event" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Hackathon", alt: "McGill CodeJam Team" },
    { src: "https://placehold.co/600x400/2a2a2a/FFF?text=Skiing", alt: "Winter sports" },
  ]
};

export const contactData = {
  email: "james.kidd@mail.mcgill.ca",
  github: "https://github.com/james-kidd",
  linkedin: "https://www.linkedin.com/in/james-kidd-mtl",
  message:
    "I'm always open to discussing software engineering, data science, and finance-focused technical projects.",
};

// Site Config: Maps Navigation to Component & Data
export const siteConfig = {
  navigation: [
    {
      id: "about",
      label: "About",
      component: "AboutSection",
      data: {
        intro: aboutData.intro,
        education: aboutData.education // Passing education here
      }
    },
    {
      id: "experience",
      label: "Experience",
      component: "ExperienceSection",
      data: experienceData
    },
    {
      id: "projects",
      label: "Projects",
      component: "ProjectsSection",
      data: projectData // Uses the new 4-item list
    },
    {
      id: "skills",
      label: "Skills",
      component: "SkillsSection",
      data: skillsData // Uses the new Categorized Object
    },
    {
      id: "personal",
      label: "Personal",
      component: "PersonalSection",
      data: personalData // Uses the new Rich Personal Object
    }
  ]
};