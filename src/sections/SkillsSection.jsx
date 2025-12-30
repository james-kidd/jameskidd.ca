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
  terminal: Terminal,
  database: Database,
  cloud: Cloud,
  trending: TrendingUp,
  star: Star,
  systems: Cpu,
  web: Globe,
  tooling: Layers,
};

function SkillCard({ block, isPrimary }) {
  const Icon = ICONS[block.icon] ?? Terminal;

  return (
    <div
      className={`card card-hover group relative overflow-hidden ${
        isPrimary
          ? "bg-(--secondary) border-(--primary)/15 ring-1 ring-(--primary)/10"
          : ""
      }`}
    >
      {isPrimary && (
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-(--primary) via-(--primary)/70 to-transparent" />
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div
            className={`icon-box ${
              isPrimary ? "bg-(--primary)/15 text-(--primary-dark)" : ""
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <h3 className="ml-3 font-bold text-lg text-gray-900 leading-tight">
            {block.title}
          </h3>
        </div>

        {isPrimary && <span className="badge badge-primary">Core Stack</span>}
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
    <div>
      <h2 className="section-title mb-8">Technical Arsenal</h2>

      {/* 1. PRIMARY BLOCK (Always Visible) */}
      <div className="relative z-10">
        {primaryBlock && <SkillCard block={primaryBlock} isPrimary={true} />}
      </div>

      {/* 2. EXPAND TRIGGER */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          className="btn btn-outline group text-sm gap-2 px-6 py-3 shadow-sm active:scale-95"
        >
          <span>{isExpanded ? "Show Less" : "View Full Stack"}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          )}
        </button>
      </div>

      {/* 3. EXPANDABLE GRID (Slides out) */}
      <div
        className={`
          grid transition-all duration-700 ease-in-out
          ${isExpanded ? "grid-rows-[1fr] opacity-100 mt-8" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="grid gap-6 sm:grid-cols-2 pb-2">
            {otherBlocks.map((block) => (
              <SkillCard key={block.id} block={block} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
