import { FolderGit2 } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import ProjectCard from "./components/ProjectCard";

export default function ProjectsSection({ data = [] }) {
  return (
    <SectionPanel className="space-y-8">
      <SectionTitle icon={FolderGit2}>Selected Projects</SectionTitle>

      {data.length === 0 && (
        <div className="card bg-gray-50 border border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            This section is being actively curated.
            <br />
            Additional projects, technical write-ups, and repositories will be
            added shortly.
          </p>
        </div>
      )}

      {data.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {data.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
