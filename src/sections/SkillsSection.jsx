import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import TagPill from "../components/TagPill";
import { sectionData, skillsDetailData } from "../data";
import { pillars } from "../content/pillars";

export default function SkillsSection() {
  const languages = sectionData.skills.blocks
    .find((block) => block.id === "languages")
    ?.items.slice(0, 9) ?? [];

  return (
    <SectionPanel>
      <SectionTitle>Skills & Expertise</SectionTitle>

      <p className="section-lead mb-8">
        {skillsDetailData.sectionLead}
      </p>

      {/* THREE PILLARS */}
      <div className="grid gap-5 md:grid-cols-3 mb-10">
        {pillars.map((pillar) => {
          return (
            <div key={pillar.id} className="surface-muted p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="icon-box">
                  <pillar.Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-(--text-strong)">{pillar.title}</h3>
              </div>
              <p className="text-sm text-(--text-muted) leading-relaxed">
                {pillar.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* QUICK LANGUAGES */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Languages
        </h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <TagPill key={lang}>{lang}</TagPill>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 text-sm font-medium text-(--primary) hover:underline"
        >
          View Core Technologies
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionPanel>
  );
}
