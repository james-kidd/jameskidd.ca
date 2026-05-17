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
              code: "COMP 302",
              name: "Programming Languages and Paradigms",
              url: "https://www.mcgill.ca/study/2024-2025/courses/comp-302",
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
          "Incoming role supporting investment advisory teams working accross multiple asset classes.",
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
          "Analyzed operational workflows to identify automation opportunities. Designed UiPath workflows and delivered RPA recommendations.",
        skills: ["Process Automation", "UiPath", "Business Analysis"],
        link: "https://kpmg.com",
      },
    ],

    academic: [
      {
        date: "2024 — Present",
        title: "Executive Committee Member",
        company: "McGill CodeJam (Engineering Hackathon)",
        description:
          "Leadership role supporting academic and technical programming for McGill’s largest engineering hackathon. Organized logistics for 350+ participants across facilities, sponsors, and staff. Also prepared and delivered four MERN-stack workshops spanning backend, frontend, and cloud deployment while mentoring first-time hackers.",
        skills: [
          "Event Operations",
          "Technical Mentorship",
          "MERN Stack",
          "Systems Coordination",
        ],
      },
      {
        date: "2021 — 2022",
        title: "Director of Sponsorships",
        company: "QCTF (Queen’s Cybersecurity Hackathon)",
        description:
          "Led sponsor outreach and external relations for Queen’s University’s annual cybersecurity hackathon, managing sponsor communications, event publicity, and securing funding to support competition operations and growth.",
        skills: [
          "Sponsorship Strategy",
          "Stakeholder Management",
          "Event Operations",
        ],
      },
    ],

    freelance: [
      {
        date: "2024 — Present",
        title: "Technology Advisor",
        company: "Independent / Contract",
        description:
          "Consulted on operational and technology transitions for Marquis Logistics; advised Elevate Financial on QuickBooks API–based integrations.",
        skills: [
          "Process Automation",
          "CRM & ERP Integration",
          "APIs",
          "Systems Design",
        ],
      },
    ],

  },

  /* =========================
     PROJECTS
  ========================= */
  projects: [
    {
      slug: "squash-no-friends",
      title: "SquashNoFriends",
      description:
        "Squash partner-matching platform built at McGill CodeJam. Used NLP to parse availability and a Python scheduler to generate weekly matches.",
      skills: ["Python", "NLP", "Next.js", "MySQL"],
      link: "https://devpost.com/software/squash-no-friends",
      detail: {
        overview:
          "SquashNoFriends is a scheduling platform that matches squash players at McGill based on their availability. Users describe their free time in plain language, and the system uses NLP to parse those descriptions into structured time blocks, then runs a constraint-based scheduler to generate optimal weekly pairings.",
        whyItMatters:
          "Finding a consistent playing partner is a real friction point in recreational sports. This project demonstrates how natural language processing can remove barriers to adoption — users don't need to fill out rigid forms, they just describe their schedule naturally.",
        technicalApproach: [
          "Built an NLP parser that converts free-text availability descriptions into structured time intervals",
          "Designed a Python scheduling algorithm that maximizes pairings while respecting time constraints",
          "Used Next.js for the frontend with MySQL for persistent storage of user profiles and match history",
          "Developed and shipped the full prototype during a 24-hour hackathon at McGill CodeJam",
        ],
        recruiterRelevance:
          "This project shows my ability to scope, design, and deliver a working product under time pressure. It combines NLP, algorithm design, and full-stack development — skills that translate directly to building data-driven internal tools and automation systems.",
      },
    },
    {
      slug: "paint-by-number",
      title: "Paint-by-Number Generator",
      description:
        "Deterministic image-to-paint-by-number pipeline in Python (segmentation + color quantization), exposed via a Flask API and integrated with a React frontend.",
      skills: ["Python", "Flask", "Image Processing", "OpenCV"],
      link: "https://github.com/james-kidd/pbn_flask_demo",
      demo: "https://pbn-flask-demo.onrender.com",
      detail: {
        overview:
          "A deterministic computer vision pipeline that converts any photograph into a print-ready paint-by-number template. The system segments the image, quantizes colors to a manageable palette, and generates clean numbered outlines — all exposed through a Flask API with a React frontend.",
        whyItMatters:
          "This project solves a real creative workflow: generating custom paint-by-number sheets from personal photos. It also demonstrates how to take a complex image processing pipeline and make it accessible through a clean web interface — a pattern common in productizing ML and data science work.",
        technicalApproach: [
          "Built a multi-stage pipeline: image segmentation, color quantization (k-means), region detection, and outline generation",
          "Used OpenCV and scikit-image for deterministic (non-ML) image processing — chosen deliberately over neural approaches for reproducibility and speed",
          "Exposed the pipeline as a stateless Flask API with file upload, processing, and result download",
          "Built a React frontend for drag-and-drop image upload with real-time preview of generated templates",
          "Deployed on Render with a live demo available for immediate testing",
        ],
        recruiterRelevance:
          "This project demonstrates end-to-end product thinking: taking a data processing pipeline from algorithm design through API development to user-facing deployment. It shows comfort with Python, computer vision, API design, and full-stack integration — plus the judgment to choose the right tool for the job.",
      },
    },
  ],

  /* =========================
     SKILLS
  ========================= */
skills: {
  blocks: [
    {
      id: "primary",
      title: "Core Strengths",
      icon: "star",
      items: [
        "End-to-end ML pipelines",
        "Algorithm design & complexity analysis",
        "Data-intensive backend systems",
        "Production Python services",
        "Relational data modeling",
        "Linux-based development",
      ],
    },

    {
      id: "languages",
      title: "Programming Languages",
      icon: "terminal",
      items: [
        "Python",
        "Java",
        "JavaScript / TypeScript",
        "SQL",
        "C",
        "C++",
        "Scala",
        "OCaml",
      ],
    },

    {
      id: "ml",
      title: "Machine Learning & AI",
      icon: "trending",
      items: [
        "PyTorch (custom models & training loops)",
        "Transformer fine-tuning (BERT-style models)",
        "Classical ML (LogReg, RF, XGBoost)",
        "Computer vision pipelines",
        "NLP pipelines & text classification",
        "Feature engineering & statistical analysis",
        "Model evaluation & ablation",
      ],
    },

    {
      id: "data",
      title: "Data Science & Numerical Computing",
      icon: "database",
      items: [
        "Pandas",
        "NumPy",
        "Exploratory data analysis",
        "Scientific computing workflows (Jupyter, Colab)",
        "Image processing (OpenCV, scikit-image)",
        "Clustering & segmentation methods",
      ],
    },

    {
      id: "web",
      title: "Web & API Development",
      icon: "cloud",
      items: [
        "REST APIs",
        "Flask",
        "FastAPI",
        "Django",
        "React",
        "Node.js",
      ],
    },

    {
      id: "systems",
      title: "Systems & Infrastructure",
      icon: "terminal",
      items: [
        "Linux",
        "Docker",
        "Virtual machines",
        "Cloud deployment (AWS)",
        "Kubernetes (foundations)",
        "Containerized services",
      ],
    },

    {
      id: "databases",
      title: "Databases & Distributed Systems",
      icon: "database",
      items: [
        "SQL databases",
        "MariaDB",
        "MySQL",
        "Apache Spark",
        "Hadoop ecosystem (HDFS, MapReduce)",
        "ZooKeeper (coordination concepts)",
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
        "API integrations",
        "Slack & Discord bots",
        "Google Analytics",
        "Meta Pixel",
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
    gallery: [
      { id: "about-0", src: "photos/about-me-0.jpg" },
      { id: "about-1", src: "photos/about-me-1.jpg" },
      { id: "about-2", src: "photos/about-me-2.jpg" },
    ]

  },
};
