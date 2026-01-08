// src/data/sections.js

export const sectionData = {
  /* =========================
     ABOUT
  ========================= */
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
            {
              code: "COMP 551",
              name: "Applied Machine Learning",
              url: "https://www.mcgill.ca/study/2024-2025/courses/comp-551",
            },
            {
              code: "COMP 424",
              name: "Artificial Intelligence",
              url: "https://www.mcgill.ca/study/2024-2025/courses/comp-424",
            },
            {
              code: "COMPSCI 4064",
              name: "Big Data: Systems, Programming, and Management",
              url: "https://www.gla.ac.uk/coursecatalogue/course/?code=COMPSCI4064",
            },
            {
              code: "COMP 360",
              name: "Algorithm Design",
              url: "https://www.mcgill.ca/study/2024-2025/courses/comp-360",
            },
            {
              code: "COMP 330",
              name: "Theory of Computation",
              url: "https://www.mcgill.ca/study/2024-2025/courses/comp-330",
            },
            {
              code: "COMP 310",
              name: "Operating Systems",
              url: "https://www.mcgill.ca/study/2024-2025/courses/comp-310",
            },
            {
              code: "MATH 324",
              name: "Statistics",
              url: "https://www.mcgill.ca/study/2024-2025/courses/math-324",
            },
            {
              code: "MATH 323",
              name: "Probability",
              url: "https://www.mcgill.ca/study/2024-2025/courses/math-323",
            },
            {
              code: "MATH 340",
              name: "Discrete Mathematics",
              url: "https://www.mcgill.ca/study/2024-2025/courses/math-340",
            },
            {
              code: "MATH 317",
              name: "Numerical Analysis",
              url: "https://www.mcgill.ca/study/2024-2025/courses/math-317",
            },
          ],
        },

        {
          school: "Queen’s University",
          degree: "B.Sc. Computer Engineering (Transferred)",
          year: "2020 — 2022",
          description:
            "Strong foundation in engineering mathematics, computer architecture, and low-level systems programming.",
          coursework: [
            {
              code: "ELEC 279",
              name: "Object-Oriented Programming",
              url: "https://smithengineering.queensu.ca/ece/undergraduate/courses/elec-279.html",
            },
            {
              code: "ELEC 274",
              name: "Computer Architecture",
              url: "https://smithengineering.queensu.ca/ece/undergraduate/courses/elec-274.html",
            },
            {
              code: "ELEC 271",
              name: "Digital Systems",
              url: "https://smithengineering.queensu.ca/ece/undergraduate/courses/elec-271.html",
            },
            {
              code: "ELEC 270",
              name: "Discrete Mathematics",
              url: "https://smithengineering.queensu.ca/ece/undergraduate/courses/elec-270.html",
            },
            {
              code: "MTHE 225",
              name: "Differential Equations",
              url: "https://www.queensu.ca/artsci_online/courses/ordinary-differential-equations-1",
            },
          ],
        },
      ],
    },
  },

  /* =========================
     EXPERIENCE
  ========================= */
  experience: {
    internships: [
      {
        date: "Jan 2026 — May 2026",
        title: "Investment Advisory Intern (Incoming)",
        company: "CI Global Asset Management",
        description:
          "Incoming role supporting investment advisory teams.",
        skills: [],
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
  },

  /* =========================
     PROJECTS
  ========================= */
  projects: [
    {
      title: "SquashNoFriends",
      description:
        "Squash partner-matching platform built at McGill CodeJam. Used NLP to parse availability and a Python scheduler to generate weekly matches.",
      skills: ["Python", "NLP", "Next.js", "MySQL"],
      link: "https://devpost.com/software/squash-no-friends",
    },
    {
      title: "Paint-By-Number Pipeline",
      description:
        "Designed a deterministic computer-vision pipeline that converts images into print-ready paint-by-number outlines using segmentation and color quantization.",
      skills: [
        "Python",
        "Computer Vision",
        "OpenCV",
        "scikit-image",
        "NumPy",
        "Image Processing",
        "Jupyter",
      ],
      link: "https://github.com/james-kidd/",
    },
  ],

  /* =========================
     SKILLS
  ========================= */
  skills: {
    blocks: [
      {
        id: "primary",
        title: "Primary Toolset",
        icon: "star",
        items: [

          "ML and ETL Processes",
          "Python Solutions",
          "Java, JavaScript, C++",
          "PyTorch, scikit-learn",
          "SQL",
          "Linux Ecosystem",
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
          "End-to-End ML Pipelines",
          "ML Systems Integration",
          "Applied CNNs",
          "Applied NLP",
          "Reinforcement Learning (Foundations)",
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
          "Git",
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
        ],
      },
      {
        id: "tooling",
        title: "Tooling, Automation & Analytics",
        icon: "terminal",
        items: [
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

  /* =========================
     PERSONAL
  ========================= */
  personal: {
    description:
      "There’s life beyond coding. As much as I enjoy building software, I value time spent outdoors, traveling, and real human connection.",
    favorites: [
      { label: "Current Read", value: "Options, Futures, and Other Derivatives — John Hull" },
      { label: "Countries Visited", value: "39" },
    ],
    instagram: "https://www.instagram.com/jameskidd__/",
  },
};
