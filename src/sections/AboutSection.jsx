import { GraduationCap } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import EducationCard from "./components/EducationCard";

export default function AboutSection({ data }) {
  const { education } = data;

  return (
    <SectionPanel>
      <div>
        <SectionTitle icon={GraduationCap} className="mb-12">
          Education Timeline
        </SectionTitle>

        <div className="ml-2">
          {education.details.map((edu) => (
            <EducationCard key={`${edu.school}-${edu.year}`} edu={edu} />
          ))}
        </div>
      </div>
    </SectionPanel>
  );
}
