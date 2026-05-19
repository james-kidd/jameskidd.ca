// src/data/sections.js
// Structured data only — prose content lives in src/content/*.mdx

export const sectionData = {
  about: {
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
          school: "Queen's University",
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

  skills: {
    blocks: [
      {
        id: "languages",
        title: "Languages & Core Technologies",
        icon: "terminal",
        items: [
          "Python",
          "SQL",
          "C/C++",
          "Java",
          "Scala",
          "OCaml",
          "JavaScript / TypeScript",
          "FastAPI",
          "Django",
          "Flask",
          "React",
          "Node.js",
          "RESTful Architecture",
        ],
      },

      {
        id: "ml",
        title: "Machine Learning & AI",
        icon: "trending",
        items: [
          "PyTorch",
          "Transformers (BERT-style fine-tuning)",
          "Sequence Models (LSTMs)",
          "Tokenization & Text Classification",
          "Applied Mathematics (Linear Algebra, Optimization)",
          "Feature Engineering & Model Ablation",
          "XGBoost, Random Forest, Logistic Regression",
          "Image Segmentation (OpenCV, scikit-image)",
        ],
      },

      {
        id: "data",
        title: "Data Engineering & Distributed Systems",
        icon: "database",
        items: [
          "Pandas",
          "NumPy",
          "Jupyter / Google Colab",
          "Apache Spark",
          "Hadoop (HDFS, MapReduce)",
          "ZooKeeper",
          "PostgreSQL",
          "MySQL",
          "MariaDB",
        ],
      },

      {
        id: "infra",
        title: "Infrastructure & Automation",
        icon: "cloud",
        items: [
          "Linux (Ubuntu)",
          "Docker",
          "Kubernetes (K8s)",
          "AWS (EC2/S3)",
          "Git",
          "UiPath (RPA)",
          "Slack / Discord Bot APIs",
          "Meta Pixel & Google Analytics",
          "Jira",
        ],
      },
    ],
  },

  personal: {
    stats: [
      { label: "Countries Visited", value: "39" },
      { label: "Current Read", value: "Options, Futures, and Other Derivatives — John Hull" },
    ],
    milestones: [
      {
        date: "2000s",
        title: "Childhood in the Philippines",
        description: 'Grew up in the Philippines and attended Lycée Français de Manille. I still say "Salamat" to Filipinos I meet today because the country gave me some of my strongest early memories.',
        location: "Manila, Philippines",
      },
      {
        date: "2010s",
        title: "Kuala Lumpur, Malaysia",
        description: '"Malaysia, Truly Asia" holds true. I miss Bastari and the people I grew up with there.',
        location: "Kuala Lumpur, Malaysia",
      },
      {
        date: "2016",
        title: "PADI Scuba Licence",
        description: "Earned my PADI scuba diving licence in Malaysia, which started a lifelong interest in diving and exploring new places properly.",
        location: "Malaysia",
      },
      {
        date: "2010s",
        title: "Moved to Montreal",
        description: "Moved to Montreal and attended Loyola High School and Lower Canada College, where I built strong roots in Canada.",
        location: "Montreal, Canada",
      },
      {
        date: "2018",
        title: "Iquitos, Peru — Service Trip",
        description: "Travelled to Iquitos, Peru for a service trip in the Amazon. It was one of my first major experiences seeing a different part of the world with purpose.",
        location: "Iquitos, Peru",
      },
      {
        date: "2018",
        title: "Lead Role — Lord of the Flies",
        description: "Played Jack Merridew in Lord of the Flies, a demanding lead role that challenged me to explore leadership, fear, and power on stage.",
        location: "Montreal, Canada",
      },
      {
        date: "2018",
        title: "GMAA Varsity Basketball MVP",
        description: "Named GMAA Juvenile Boys Varsity Finals MVP — one of my proudest high school athletic moments.",
        location: "Montreal, Canada",
      },
      {
        date: "2020",
        title: "Queen's University",
        description: "Moved to Kingston to study Computer Engineering at Queen's University, where I became more interested in math, software, and AI.",
        location: "Kingston, Canada",
      },
      {
        date: "Summer 2023",
        title: "Colombia",
        description: "Spent the summer in Colombia, where I learned Spanish, continued scuba diving, and lived in a new culture firsthand.",
        location: "Colombia",
      },
      {
        date: "2023",
        title: "McGill University",
        description: "Transferred to McGill University for a B.Sc. Joint Major in Mathematics and Computer Science, focusing on AI, algorithms, systems, and applied mathematics.",
        location: "Montreal, Canada",
      },
      {
        date: "2025",
        title: "Glasgow, Scotland",
        description: "Moved to Glasgow for an exchange semester at the University of Glasgow. I connected back to my Scottish roots, met family, and learned to play golf on the links.",
        location: "Glasgow, UK",
      },
      {
        date: "2026",
        title: "Toronto — CI Global Asset Management",
        description: "Moved to Toronto to work at CI Global Asset Management, combining technology, finance, automation, and investment research.",
        location: "Toronto, Canada",
      },
      {
        date: "2026",
        title: "CodeJam President",
        description: "Became President of McGill CodeJam, leading the team as we reshape the hackathon around AI, innovation, and the future of software engineering.",
        location: "Montreal, Canada",
      },
    ],
    favorites: {
      books: [
        "Atomic Habits — James Clear",
        "Capitalism in America — Alan Greenspan",
        "Outliers — Malcolm Gladwell",
        "Flash Boys — Michael Lewis",
        "Options, Futures, and Other Derivatives — John Hull",
        "Designing Data-Intensive Applications — Martin Kleppmann",
        "Discrete Mathematics and Its Applications — Kenneth H. Rosen",
        "Introduction to the Theory of Computation — Michael Sipser",
        "Absolute Java — Walter Savitch",
        "The Dirt — Nikki Sixx",
        "Oryx and Crake — Margaret Atwood",
      ],
      websites: [
        "IBM Education Series",
        "ServiceNow Lab Series",
        "Claude",
        "OpenAI",
        "Bloomberg News",
      ],
      technologies: [
        "PyTorch",
        "Google Colab",
        "Plotly",
        "Neovim",
        "Tailwind CSS",
      ],
    },
    gallery: [
      { id: "skiing-alps", src: "photos/about-me-0.jpg", alt: "Skiing in the Alps", caption: "Alps" },
      { id: "nyc", src: "photos/about-me-1.jpg", alt: "New York City", caption: "New York" },
      { id: "portrait-glasgow", src: "photos/about-me-2.jpg", alt: "James Kidd in Glasgow", caption: "Glasgow" },
    ],
  },
};
