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
      <div className="space-y-4 mb-10">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="surface-muted p-6">
            <div className="flex items-start gap-4">
              <div className="icon-box shrink-0 mt-0.5">
                <pillar.Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-(--text-strong) text-lg">{pillar.title}</h3>
                <p className="text-sm text-(--text-muted) mt-1">{pillar.subtitle}</p>
                {pillar.evidence?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {pillar.evidence.map((item) => (
                      <li key={item} className="text-sm text-(--text-muted) flex items-start gap-2">
                        <span className="text-(--primary) mt-1.5 shrink-0 w-1 h-1 rounded-full bg-(--primary)" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
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
