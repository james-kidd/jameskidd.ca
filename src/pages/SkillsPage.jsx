import { Lightbulb, Rocket, Settings } from "lucide-react";
import PageShell from "../components/PageShell";
import SectionPanel from "../components/SectionPanel";
import SkillCard from "../sections/components/SkillCard";
import { skillsDetailData, sectionData } from "../data";

const PILLAR_ICONS = {
  insightful: Lightbulb,
  innovative: Rocket,
  structured: Settings,
};

function Pillar({ pillar }) {
  const Icon = PILLAR_ICONS[pillar.id];

  return (
    <div className="section-panel space-y-5">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="icon-box">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg text-(--text-strong)">
            {pillar.title}
          </h3>
          <p className="text-sm text-(--text-muted)">{pillar.subtitle}</p>
        </div>
      </div>

      <p className="text-body text-[15px] leading-relaxed">
        {pillar.description}
      </p>

      <ul className="space-y-2">
        {pillar.evidence.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2 text-sm text-(--text-muted)"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--primary) shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SkillsPage() {
  const { blocks } = sectionData.skills;

  return (
    <PageShell>
      {/* HERO */}
      <div className="mb-12">
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

      {/* PILLARS */}
      <div className="space-y-6 mb-16">
        {skillsDetailData.pillars.map((pillar) => (
          <Pillar key={pillar.id} pillar={pillar} />
        ))}
      </div>

      {/* TECHNICAL SKILLS */}
      <div className="mb-8">
        <h2 className="section-title mb-8">Technical Proficiencies</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {blocks.map((block) => (
            <SkillCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
