// content/projects.ts
// One object per project card, in display order. `links` needs at least one
// of github / live / writeup. Add `embed` to also show the project as a
// playable demo in "Try it out"; add `image` for a thumbnail from public/.
import type { Project } from "./schema";

export const projects: Project[] = [
  {
    title: "Deterministic Vision Pipeline",
    description:
      "A classical computer vision pipeline that segments imagery into discrete color regions without neural networks. Currently being applied to satellite vegetation tracking for agricultural yield prediction. Paint-by-Number is the sandbox.",
    tags: ["Python", "OpenCV", "SLIC Superpixels", "scikit-learn"],
    links: {
      github: "https://github.com/james-kidd/pbn_flask_demo",
      live: "https://huggingface.co/spaces/jkiddmtl/paint-by-number",
    },
    embed: "https://jkiddmtl-paint-by-number.hf.space",
  },
  {
    title: "SquashNoFriends",
    note: "'23 — First pseudo-AI agent",
    description:
      "Squash matchmaking platform built at McGill CodeJam. Fed an LLM ambiguous schedule descriptions and watched it return structured data. That was the moment.",
    tags: ["Python", "OpenAI API", "Next.js", "MySQL"],
    links: {
      writeup: "https://devpost.com/software/squash-no-friends",
    },
  },
  {
    title: "jameskidd.info",
    description:
      "The site you are reading. Content lives in a folder of typed data files; components read from it, so adding a project is one object and a push.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Design Tokens"],
    links: {
      github: "https://github.com/james-kidd/jameskidd.ca",
    },
  },
];
