import { Settings, Rocket, BarChart3, Sparkles } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import PageShell from "../components/PageShell";
import SkillCard from "../sections/components/SkillCard";
import { skillsDetailData, sectionData } from "../data";
import { pillars } from "../content/pillars";
import { mdxComponents } from "../components/mdx/mdxComponents";

const PILLAR_ICONS = {
  settings: Settings,
  rocket: Rocket,
  barChart: BarChart3,
};

function Pillar({ pillar }) {
  const Icon = PILLAR_ICONS[pillar.icon] ?? Sparkles;
  const { Description } = pillar;

  return (
    <div className="section-panel space-y-5">
      <div className="flex items-center gap-3">
        <div className="icon-box">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-(--text-strong)">
            {pillar.title}
          </h3>
          <p className="text-sm text-(--text-muted)">{pillar.subtitle}</p>
        </div>
      </div>

      <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        <MDXProvider components={mdxComponents}>
          <Description />
        </MDXProvider>
      </div>

      {pillar.evidence?.length > 0 && (
        <ul className="space-y-2 pt-2 border-t border-(--border)">
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

      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {pillars.map((pillar) => (
          <Pillar key={pillar.id} pillar={pillar} />
        ))}
      </div>

      <div className="mb-8">
        <h2 className="section-title mb-8">Core Technologies</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {blocks.map((block) => (
            <SkillCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
