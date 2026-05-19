import { useState } from "react";
import { FolderGit2 } from "lucide-react";
import SectionPanel from "../components/SectionPanel";
import SectionTitle from "../components/SectionTitle";
import ProjectCard from "./components/ProjectCard";
import { projects } from "../content/projects";

export default function ProjectsSection() {
  const featuredIndex = projects.findIndex((p) => p.featured);
  const [expandedIndex, setExpandedIndex] = useState(featuredIndex >= 0 ? featuredIndex : null);

  return (
    <SectionPanel className="space-y-8">
      <SectionTitle icon={FolderGit2}>Selected Projects</SectionTitle>

      {projects.length === 0 && (
        <div className="card bg-gray-50 border border-dashed border-gray-200 p-8 text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            This section is being actively curated.
            <br />
            Additional projects, technical write-ups, and repositories will be
            added shortly.
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="section-panel p-0">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              isExpanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
            />
          ))}
        </div>
      )}
    </SectionPanel>
  );
}
