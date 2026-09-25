// content/skills.ts
// The Skills section: a one-line lead, three pillars, and the toolbox rows.
import type { Pillar, SkillGroup } from "./schema";

export const skillsLead =
  "Backend engineer with full-stack capability, AI and data science depth, and financial markets exposure.";

export const pillars: Pillar[] = [
  {
    title: "Systematic",
    subtitle: "Systems-driven, organized, and execution-focused",
    evidence: [
      "Designed automated regulatory translation workflows for 34 financial funds",
      "Built production data migration pipelines and structured RPA workflows",
      "Comfortable bridging high-level business requirements with technical implementation",
    ],
  },
  {
    title: "Forward-Looking",
    subtitle: "Adaptable, curious, and grounded in what actually works",
    evidence: [
      "Pivoted McGill CodeJam as President to focus on applied AI governance and orchestration",
      "Built AI-powered tools ranging from NLP scheduling to computer vision pipelines",
      "Both an AI adopter and a thoughtful skeptic — focused on commercial value, not hype",
    ],
  },
  {
    title: "Quantitative",
    subtitle: "Depth in mathematics, statistics, and financial analysis",
    evidence: [
      "Applied ML coursework encompassing PyTorch, classical ML, and NLP pipelines",
      "Algorithm design and complexity analysis across competitive and academic settings",
      "Supported fundamental research across global equities and private markets at CI GAM",
    ],
  },
];

export const toolbox: SkillGroup[] = [
  {
    title: "Languages & Core Technologies",
    items: [
      "Python", "SQL", "C/C++", "Java", "Scala", "OCaml", "JavaScript / TypeScript",
      "FastAPI", "Django", "Flask", "React", "Node.js", "RESTful Architecture",
    ],
  },
  {
    title: "Machine Learning & AI",
    items: [
      "PyTorch", "Transformers (BERT-style fine-tuning)", "Sequence Models (LSTMs)",
      "Tokenization & Text Classification", "Applied Mathematics (Linear Algebra, Optimization)",
      "Feature Engineering & Model Ablation", "XGBoost, Random Forest, Logistic Regression",
      "Image Segmentation (OpenCV, scikit-image)",
    ],
  },
  {
    title: "Data Engineering & Distributed Systems",
    items: [
      "Pandas", "NumPy", "Jupyter / Google Colab", "Apache Spark", "Hadoop (HDFS, MapReduce)",
      "ZooKeeper", "PostgreSQL", "MySQL", "MariaDB",
    ],
  },
  {
    title: "Infrastructure & Automation",
    items: [
      "Linux (Ubuntu)", "Docker", "Kubernetes (K8s)", "AWS (EC2/S3)", "Git", "UiPath (RPA)",
      "Slack / Discord Bot APIs", "Meta Pixel & Google Analytics", "Jira",
    ],
  },
];
