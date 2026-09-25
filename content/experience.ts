// content/experience.ts
// Roles, grouped. Groups appear in the order listed here; roles appear in the
// order they are listed within each group (most recent first).
import type { Role } from "./schema";

export const experience: { group: string; roles: Role[] }[] = [
  {
    group: "Internships",
    roles: [
      {
        title: "Distribution Enablement Co-op",
        company: "CI Financial",
        date: "May 2026 — Present",
        link: "https://www.cifinancial.com",
        summary: [
          "Built data-connected Seismic LiveDocs templates via a .NET application plugin, SQL, and Cinchy to automate the population of fund performance and $450B+ AUM data. Executed this workflow under the guidance of the enablement team, ultimately saving the Equities group 40+ hours monthly.",
          "Created a tracking system using NLP and Excel key-sort logic to map disparate Seismic content IDs to client interaction URLs. This tooling provided supervisors with actionable KPIs on optimal sending periods and engagement.",
          "Supported the ETF and Mutual Fund advisory merger, as well as the Invesco Canada transition, by designing a new content schema. Reorganized universal SharePoint libraries to improve team accessibility and help prepare the firm’s data environment for Microsoft Copilot deployment.",
        ],
        tags: ["SQL", ".NET", "Cinchy", "NLP", "Advanced Excel", "Seismic", "SharePoint"],
      },
      {
        title: "Investment Advisory Analyst Co-op",
        company: "CI Financial",
        date: "Jan 2026 — Apr 2026",
        link: "https://www.cifinancial.com",
        summary: [
          "Identified a compliance bottleneck regarding Quebec language laws and proactively proposed an automated workflow using Morningstar bulk data and custom glossaries. Developed the script to reduce a 146-page manual translation task to 34 automated pages, ensuring 34 Know-Your-Product documents met compliance ahead of the deadline.",
          "Assisted the portfolio management team by researching and synthesizing capital flow trends. Contributed foundational research for PM-published macro-commentaries on AI infrastructure credit yields, legacy SaaS disruption, and private markets software resets.",
          "Drafted evergreen positioning collateral for Global Alpha Innovators, Emerging Markets, and Small Cap funds. Worked closely with advisors to help bridge portfolio manager strategy with materials used for global sales distribution.",
        ],
        tags: ["SQL", "Morningstar Direct", "Regulatory Automation", "Advanced Excel"],
      },
      {
        title: "Software Developer Intern",
        company: "ITM Instruments Inc.",
        date: "May 2024 — Sep 2024",
        link: "https://www.itm.com",
        summary: [
          "Developed Python automation scripts for data migration between production and test systems. Built data extraction and order conversion tools to enhance Jira-based workflows, and implemented analytics tracking utilizing Meta Pixel and Google Analytics.",
        ],
        tags: ["Python", "SQL", "MariaDB", "PHP", "JavaScript", "Linux", "Jira"],
      },
      {
        title: "Technology Enablement Advisor Intern",
        company: "KPMG Hungary",
        date: "Jun 2021 — Sep 2021",
        link: "https://kpmg.com",
        summary: [
          "Assisted in analyzing operational workflows to identify automation opportunities. Proposed and designed UiPath workflows, delivering actionable RPA recommendations to senior advisors.",
        ],
        tags: ["Process Automation", "UiPath", "Business Analysis"],
      },
    ],
  },
  {
    group: "Leadership",
    roles: [
      {
        title: "President & Strategic Visionary",
        company: "McGill CodeJam (Engineering Hackathon)",
        date: "2024 — Present",
        summary: [
          "Progressed from a participant (2023) to Logistics Lead (2024–2025), and ultimately President (2026) of McGill's largest engineering hackathon.",
          "Working alongside the executive committee, I helped pivot the competition's focus from standard software prototyping to an applied AI systems laboratory. Coordinated with enterprise partners like IBM to integrate their technologies into the event, designing technical challenge tracks to evaluate 400+ students on multi-agent orchestration, token budgeting, and responsible AI governance.",
        ],
        tags: ["Event Operations", "Technical Mentorship", "AI Systems Orchestration", "Stakeholder Management"],
      },
      {
        title: "Director of Sponsorships",
        company: "QCTF (Queen's Cybersecurity Hackathon)",
        date: "2021 — 2022",
        summary: [
          "Managed sponsor communications and external relations for Queen's University's annual cybersecurity hackathon, helping secure the funding required to support competition operations and event growth.",
        ],
        tags: ["Sponsorship Strategy", "Stakeholder Management", "Event Operations"],
      },
    ],
  },
  {
    group: "Freelance",
    roles: [
      {
        title: "Technology Advisor",
        company: "Independent / Contract",
        date: "2024 — Present",
        summary: [
          "Advised executive leadership on architecture transitions and API integrations to modernize legacy ERP/CRM workflows for Marquis Logistics and Elevate Financial.",
        ],
        tags: ["Process Automation", "CRM & ERP Integration", "APIs", "Systems Design"],
      },
    ],
  },
];
