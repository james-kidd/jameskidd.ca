// src/data/sections.js

export const sectionData = {
  about: {
    intro: [
      "I build data automation and analytics systems that reduce friction between raw information and decision-making.",
      "My work sits at the intersection of software engineering, data science, and financial analytics.",
      "I focus on eliminating wasted effort, providing clarity, and delivering practical solutions.",
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
  },

  experience: {
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
        description:
          "End-to-end web and automation solutions for small businesses.",
        skills: ["React", "Node.js", "Shopify", "Tailwind CSS"],
        link: "",
      },
    ],
  },

  projects: [
    {
      title: "ETF Holdings Inference",
      description:
        "Built a data pipeline combining ETF and equity data from Yahoo Finance, iShares, and Bloomberg. Trained machine learning models to predict top-K ETF holdings and analyze portfolio manager behavior.",
      skills: [
        "Python",
        "Pandas",
        "Scikit-learn",
        "Machine Learning",
        "Financial Data",
      ],
      link: "https://github.com/james-kidd/",
    },
    {
      title: "SquashNoFriends",
      description:
        "Squash partner-matching platform built at McGill CodeJam. Used NLP to parse availability and a Python scheduler to generate weekly matches. Deployed with a Next.js frontend and MySQL backend.",
      skills: ["Python", "NLP", "Next.js", "MySQL"],
      link: "https://github.com/james-kidd/",
    },
  ],

  skills: {
    blocks: [
      {
        id: "primary",
        title: "Primary Toolset",
        icon: "star",
        items: [
          "Python",
          "SQL",
          "Linux",
          "Docker",
          "Pandas",
          "NumPy",
          "Flask",
          "Apache Spark",
        ],
      },

      {
        id: "languages",
        title: "Programming Languages",
        icon: "terminal",
        items: [
          "Python",
          "SQL",
          "JavaScript",
          "C",
          "Java",
          "PHP",
          "C++",
          "Scala",
          "OCaml",
          "VBA",
          "VHDL",
        ],
      },

      {
        id: "data",
        title: "Data Science & Analytics",
        icon: "database",
        items: [
          "Pandas",
          "NumPy",
          "Matplotlib",
          "Jupyter Notebooks",
          "OpenCV",
          "Data Cleaning",
          "Exploratory Data Analysis",
          "Feature Engineering",
        ],
      },

      {
        id: "ml",
        title: "Machine Learning",
        icon: "trending",
        items: [
          "PyTorch",
          "TensorFlow",
          "scikit-learn",
          "Model Training",
          "Model Evaluation",
          "ML Pipelines",
        ],
      },

      {
        id: "web",
        title: "Web & API Development",
        icon: "cloud",
        items: [
          "React",
          "Node.js",
          "Flask",
          "Django",
          "FastAPI",
          "REST APIs",
        ],
      },

      {
        id: "systems",
        title: "Systems & Infrastructure",
        icon: "terminal",
        items: [
          "Linux",
          "Docker",
          "Virtual Machines",
          "AWS (EC2, S3)",
        ],
      },

      {
        id: "databases",
        title: "Databases & Distributed Systems",
        icon: "database",
        items: [
          "SQL",
          "MariaDB",
          "MySQL",
          "Apache Spark",
          "Kubernetes",
          "Zookeeper",
        ],
      },

      {
        id: "tooling",
        title: "Tooling, Automation & Analytics",
        icon: "terminal",
        items: [
          "Git",
          "Jira",
          "UiPath (RPA)",
          "Google Analytics",
          "Meta Pixel",
          "Slack Bots",
          "Discord Bots",
          "QuickBooks API",
        ],
      },
    ],
  },




  personal: {
    description:
      "Outside of software and data, I spend most of my time traveling and exploring the outdoors.",
    favorites: [
      { label: "Current Read", value: "Outliers" },
      { label: "Camera", value: "Canon AE-1 Program" },
      { label: "Golf Handicap", value: "High" },
      { label: "Activities", value: "Backpacking, Hiking" },
    ],
    gallery: [
      {
        src: "https://placehold.co/600x400/2a2a2a/FFF?text=Hiking+Trip",
        alt: "Hiking trip",
      },
      {
        src: "https://placehold.co/600x800/2a2a2a/FFF?text=Film+Photo",
        alt: "Film photography",
      },
      {
        src: "https://placehold.co/600x400/2a2a2a/FFF?text=Workspace",
        alt: "Workspace setup",
      },
      {
        src: "https://placehold.co/600x400/2a2a2a/FFF?text=Travel",
        alt: "Travel photography",
      },
    ],
  },
};
