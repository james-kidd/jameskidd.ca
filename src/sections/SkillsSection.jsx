import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import SkillCard from "./components/SkillCard";

export default function SkillsSection({ data }) {
  return (
    <SectionPanel>
      <SectionTitle>Skills & Expertise</SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        {data.blocks.map((block) => (
          <SkillCard key={block.id} block={block} />
        ))}
      </div>
    </SectionPanel>
  );
}
