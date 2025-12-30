import React, { useState } from "react";
import {
  Terminal,
  Database,
  Cloud,
  TrendingUp,
  Star,
  ChevronDown,
  ChevronUp,
  Cpu,
  Globe,
  Layers,
} from "lucide-react";

const ICONS = {
  terminal: <Terminal className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  systems: <Cpu className="w-5 h-5" />,
  web: <Globe className="w-5 h-5" />,
  tooling: <Layers className="w-5 h-5" />,
};

function SkillCard({ block }) {
  return (
    <div className="card card-hover group flex flex-col">
      <div className="flex items-center mb-5">
        <div className="icon-box">
          {ICONS[block.icon] ?? ICONS.terminal}
        </div>

        <h3 className="ml-3 font-bold text-lg text-(--text-strong)">
          {block.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {block.items.map((item) => (
          <span key={item} className="tag-pill">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryBlock = data.blocks.find((b) => b.id === "primary");
  const otherBlocks = data.blocks.filter((b) => b.id !== "primary");

  return (
    <div className="section-shell">
      <div className="section-panel space-y-10">
        <h2 className="section-title">Core Technologies</h2>

        {primaryBlock && <SkillCard block={primaryBlock} />}

        <div className="flex justify-center pt-6">
          <button
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
            className="btn-pill group"
          >
            <span>{isExpanded ? "Show Less" : "View Full Stack"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>

        <div
          className={`
            overflow-hidden transition-[max-height,opacity] duration-300 ease-out
            ${isExpanded ? "max-h-500 opacity-100 mt-6" : "max-h-0 opacity-0"}
          `}
        >
          <div className="grid gap-5 sm:grid-cols-2 pb-2">
            {otherBlocks.map((block) => (
              <SkillCard key={block.id} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
