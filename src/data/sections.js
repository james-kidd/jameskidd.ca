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
          "Leadership role supporting academic and technical programming for McGill’s largest engineering hackathon. Organized logistics for 350+ participants across facilities, sponsors, and staff; built the event-wide scheduling system covering registration, ceremonies, catering, and judging; and prepared and delivered four MERN-stack workshops spanning backend, frontend, and cloud deployment while mentoring first-time hackers.",
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
        title: "Technology & Operations Consultant",
        company: "Independent / Contract",
        description:
          "Advised small businesses on operational and technology transitions, focusing on automation-ready system design, data integrity, and scalable workflows. Consulted with Marquis Logistics on migrating pricing and operational processes to a new CRM by redesigning data flows to support future end-to-end automation, and advised ElevateFi on accounting automation, including integration planning and data synchronization using the QuickBooks API.",
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
      title: "SquashNoFriends",
      description:
        "Squash partner-matching platform built at McGill CodeJam. Used NLP to parse availability and a Python scheduler to generate weekly matches.",
      skills: ["Python", "NLP", "Next.js", "MySQL"],
      link: "https://devpost.com/software/squash-no-friends",
    },
    // {
    //   title: "Paint-By-Number Pipeline",
    //   description:
    //     "Designed a deterministic computer-vision pipeline that converts images into print-ready paint-by-number outlines using segmentation and color quantization.",
    //   skills: [
    //     "Python",
    //     "Computer Vision",
    //     "OpenCV",
    //     "scikit-image",
    //     "NumPy",
    //     "Image Processing",
    //     "Jupyter",
    //   ],
    //   link: "https://github.com/james-kidd/",
    // },

    {
      title: "Paint-by-Number Generator",
      description:
        "Deterministic image-to-paint-by-number pipeline in Python (segmentation + color quantization), exposed via a Flask API and integrated with a React frontend.",      skills: ["Python", "Flask", "Image Processing", "OpenCV"],
      link: "https://github.com/james-kidd/pbn_flask_demo",
      demo: "https://pbn-flask-demo.onrender.com",   // NEW
    }

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
    gallery: [
      { id: "about-0", src: "photos/about-me-0.jpg" },
      { id: "about-1", src: "photos/about-me-1.jpg" },
      { id: "about-2", src: "photos/about-me-2.jpg" },
    ]

  },
};
