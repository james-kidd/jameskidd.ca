import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import ExpandToggle from "../components/ExpandToggle";
import SkillCard from "./components/SkillCard";

export default function SkillsSection({ data }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const primaryBlock = data.blocks.find((b) => b.id === "primary");
  const otherBlocks = data.blocks.filter((b) => b.id !== "primary");

  return (
    <SectionPanel>
      <SectionTitle>Core Technologies</SectionTitle>

      {primaryBlock && <SkillCard block={primaryBlock} />}

      <div className="flex justify-center pt-6">
        <ExpandToggle
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((v) => !v)}
          collapsedLabel="View Full Stack"
        />
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          isExpanded ? "max-h-500 opacity-100 mt-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid gap-5 sm:grid-cols-2 pb-2">
          {otherBlocks.map((block) => (
            <SkillCard key={block.id} block={block} />
          ))}
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 text-sm font-medium text-(--primary) hover:underline"
        >
          Full skills & background
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </SectionPanel>
  );
}
