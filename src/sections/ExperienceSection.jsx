import { FolderGit2 } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import ExperienceCard from "./components/ExperienceCard";

const GROUPS = [
  { key: "internships", label: "Internships" },
  { key: "academic", label: "Leadership" },
  { key: "freelance", label: "Freelance" },
];

export default function ExperienceSection({ data }) {
  return (
    <SectionPanel className="space-y-12">
      {GROUPS.map(({ key, label }) => (
        <div key={key} className="space-y-6">
          <SectionTitle icon={FolderGit2}>{label}</SectionTitle>

          <div className="ml-2">
            {data[key].map((role) => (
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
