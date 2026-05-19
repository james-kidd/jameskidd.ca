import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import PageShell from "../components/PageShell";
import SkillCard from "../sections/components/SkillCard";
import { skillsDetailData, sectionData } from "../data";
import { pillars } from "../content/pillars";
import { mdxComponents } from "../components/mdx/mdxComponents";

function PillarCard({ pillar }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { Icon, Description } = pillar;

  return (
    <div className="section-panel">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="icon-box">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-(--text-strong)">
              {pillar.title}
            </h3>
            <p className="text-sm text-(--text-muted)">{pillar.subtitle}</p>
          </div>
          <div className="shrink-0 text-(--text-muted)">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {pillar.evidence?.length > 0 && (
        <ul className="mt-4 space-y-2 pt-3 border-t border-(--border)">
          {pillar.evidence.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm text-(--text-muted)"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--primary) shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-5"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 border-t border-(--border) [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 text-sm text-(--text-muted) leading-relaxed">
            <MDXProvider components={mdxComponents}>
              <Description />
            </MDXProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const { blocks } = sectionData.skills;

  return (
    <PageShell width="wide">
      <div className="mb-12 max-w-3xl">
        <span className="eyebrow text-(--primary) mb-3 block">
          Skills & Background
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-(--text-strong) tracking-tight mb-5">
          {skillsDetailData.headline}
        </h1>
        <p className="text-lg text-(--text-muted) leading-relaxed max-w-2xl">
          {skillsDetailData.positioning}
        </p>
      </div>

      <div className="mb-16">
        <h2 className="section-title mb-8">Core Technologies</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {blocks.map((block) => (
            <SkillCard key={block.id} block={block} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="section-title mb-8">How I Think About Work</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
