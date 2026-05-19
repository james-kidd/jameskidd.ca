import { FolderGit2 } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import ExperienceCard from "./components/ExperienceCard";
import { experiencesByGroup } from "../content/experience";
import { experienceGroups } from "../data";

export default function ExperienceSection() {
  return (
    <SectionPanel className="space-y-12">
      {experienceGroups.map(({ key, label }) => (
        <div key={key} className="space-y-6">
          <SectionTitle icon={FolderGit2}>{label}</SectionTitle>

          <div className="ml-2">
            {experiencesByGroup[key].map((role) => (
              <ExperienceCard
                key={`${role.title}-${role.date}`}
                role={role}
              />
            ))}
          </div>
        </div>
      ))}
    </SectionPanel>
  );
}
