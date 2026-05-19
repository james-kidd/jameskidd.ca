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

  /* =========================
     EXPERIENCE
  ========================= */
  experience: {
    internships: [
      {
        date: "May 2026 — Present",
        title: "Distribution Enablement Co-op",
        company: "CI Financial",
        bullets: [
          "Architected Seismic LiveDocs templates via a .NET application plugin, SQL, and Cinchy to auto-populate fund performance and $450B+ AUM data, saving the Equities team 40+ hours monthly.",
          "Engineered a tracking architecture using NLP and Excel key-sort logic to map disparate Seismic content IDs to client interaction URLs, extracting precise KPIs on optimal sending periods and engagement.",
          "Designed a content schema to govern the ETF and Mutual Fund advisory merger and Invesco Canada transition, restructuring universal SharePoint libraries to prepare enterprise data for Microsoft Copilot deployment.",
        ],
        skills: ["SQL", ".NET", "Cinchy", "NLP", "Advanced Excel", "Seismic", "SharePoint"],
        link: "https://www.cifinancial.com",
      },
      {
        date: "Jan 2026 — Apr 2026",
        title: "Investment Advisory Analyst Co-op",
        company: "CI Financial",
        bullets: [
          "Synthesized capital flow trends to underwrite PM-published macro-research. Co-authored pieces on AI infrastructure credit yields, AI agents disrupting legacy SaaS, and private markets software resets.",
          "Authored evergreen positioning collateral for Global Alpha Innovators, Emerging Markets, and Small Cap funds, directly bridging portfolio manager strategy with global sales distribution.",
          "Automated regulatory translation workflows using Morningstar bulk data and custom glossaries, reducing a 146-page manual task to 34 automated pages, ensuring 34 Know-Your-Product documents met Quebec language laws ahead of deadline.",
        ],
        skills: ["SQL", "Morningstar Direct", "Regulatory Automation", "Advanced Excel"],
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
          "Leadership role supporting academic and technical programming for McGill's largest engineering hackathon. Organized logistics for 350+ participants across facilities, sponsors, and staff. Also prepared and delivered four MERN-stack workshops spanning backend, frontend, and cloud deployment while mentoring first-time hackers.",
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
        company: "QCTF (Queen's Cybersecurity Hackathon)",
        description:
          "Led sponsor outreach and external relations for Queen's University's annual cybersecurity hackathon, managing sponsor communications, event publicity, and securing funding to support competition operations and growth.",
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
      slug: "paint-by-number",
      featured: true,
      title: "Commodity Forecasting via Deterministic Vision",
      description:
        "An automated, deterministic computer vision pipeline designed to track vegetation progressions across satellite imagery to predict agricultural yields, with a Paint-by-Number sandbox for the core segmentation engine.",
      skills: ["Python", "OpenCV", "SLIC Superpixels", "scikit-learn"],
      link: "https://github.com/james-kidd/pbn_flask_demo",
      demo: "https://huggingface.co/spaces/jkiddmtl/paint-by-number",
      embed: "https://jkiddmtl-paint-by-number.hf.space",
      detail: {
        overview:
          "In commodity markets, accurate supply forecasting often comes down to tracking the physical maturation of crops from space. This project is the groundwork for an automated, deterministic computer vision pipeline designed to track vegetation progressions across satellite imagery to predict agricultural yields. The core engine is currently exposed as an interactive Paint-by-Number web application.",
        whyItMatters:
          "While the industry default is often to throw deep learning at image problems, I explicitly avoided black-box neural networks in favor of classical, deterministic methods. When dealing with massive time-series multispectral agricultural data, interpretability, strict reproducibility, and scale matter most.",
        technicalApproach: [
          "Operates entirely in the CIELAB color space, ensuring mathematical distances between pixels match human-perceived color differences",
          "Uses Simple Linear Iterative Clustering (SLIC) in a joint 5D LAB+XY space, allowing precise control over the trade-off between color adherence and shape regularity",
          "Extracts region mean colors into k-means clustering to define a representative palette, applying a Region Adjacency Graph (RAG) to collapse similar adjacent superpixels",
          "Guarantees O(N) complexity, demonstrating that the best solution for commercial data processing isn't always the trendiest AI model",
          "Deployed on Hugging Face Spaces with a Gradio interface for interactive parameter tuning",
        ],
        recruiterRelevance:
          "Demonstrates end-to-end product thinking: taking a data processing pipeline from algorithm design through deployment. Shows comfort with Python, computer vision, and the judgment to choose mathematically sound, highly scalable deterministic pipelines over neural approaches.",
      },
    },
    {
      slug: "manager-dna",
      title: "Manager DNA: The Dynamic Style Box",
      description:
        "A quantitative research pipeline that reverse-engineers the behavioral tendencies of active ETF managers using regime-aware factor analysis, PCA, and network theory.",
      skills: ["Python", "Financial Econometrics", "GMM", "PCA", "Network Theory"],
      link: "#",
      detail: {
        overview:
          "In active management, the most critical question is whether a fund manager is generating genuine alpha or simply taking on disguised factor risk. Manager DNA is a quantitative research pipeline built to reverse-engineer the behavioral tendencies of active ETF managers.",
        whyItMatters:
          "Traditional fund analysis relies heavily on static models, like the standard Morningstar 3x3 style box. Markets aren't static. A static grid fails to capture how a manager adapts when the market is under stress. This tool explicitly detects style drift, revealing whether a manager holds firm to their mandate during a downturn or tactically rotates their exposures.",
        technicalApproach: [
          "Extracts active return factor loadings using a rolling 63-day OLS regression against the Fama-French 5-Factor model",
          "Applies Gaussian Mixture Modeling (GMM) over macroeconomic indicators (SPY returns, VIX, credit spreads, 10Y yields) for probabilistic market regime classification",
          "Uses Principal Component Analysis (PCA) to extract orthogonal Super-Styles from the beta matrix, then layers cosine similarity networks over GMM-defined regimes to construct a bipartite conviction network",
          "Calculates Louvain communities and spectral distances across multi-layer graphs to quantify style drift at both intra-fund and universe levels",
        ],
        recruiterRelevance:
          "Demonstrates the ability to apply rigorous econometrics and unsupervised learning to noisy financial data, separating true conviction from cyclical luck.",
      },
    },
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
      slug: "personal-portfolio",
      title: "jameskidd.info",
      description:
        "A modular, data-driven React application built to cleanly present quantitative research, software systems, and professional experience.",
      skills: ["React", "JavaScript", "Data Architecture", "UI/UX"],
      link: "https://jameskidd.info",
      detail: {
        overview:
          "The platform you are currently viewing. Rather than using a rigid website builder, I built a custom React application where all content is dynamically driven by structured JavaScript data files, making it highly maintainable and extensible.",
        whyItMatters:
          "First impressions matter. In the intersection of finance and tech, the ability to communicate complex information clearly and cleanly is just as important as the underlying math.",
        technicalApproach: [
          "Architected with React and modular data structures, separating content from presentation logic",
          "Implemented fully responsive design focusing on readability and intuitive navigation",
          "Deployed via continuous integration for seamless updates as the portfolio evolves",
        ],
        recruiterRelevance:
          "Shows front-end competency, attention to detail, and a strong understanding of product positioning and user experience.",
      },
    },
  ],

  /* =========================
     SKILLS
  ========================= */
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


  /* =========================
     PERSONAL
  ========================= */
  personal: {
    description:
      "There's life beyond coding. As much as I enjoy building software, I value time spent outdoors, traveling, and real human connection.",
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
    instagram: "https://www.instagram.com/jameskidd__/",
    gallery: [
      { id: "skiing-alps", src: "photos/about-me-0.jpg", alt: "Skiing in the Alps", caption: "Alps" },
      { id: "nyc", src: "photos/about-me-1.jpg", alt: "New York City", caption: "New York" },
      { id: "portrait-glasgow", src: "photos/about-me-2.jpg", alt: "James Kidd in Glasgow", caption: "Glasgow" },
    ],
  },
};
