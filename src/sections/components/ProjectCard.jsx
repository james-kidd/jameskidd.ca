import { Link } from "react-router-dom";
import { Github, ArrowUpRight, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import TagPill from "../../components/TagPill";

export default function ProjectCard({ project, isExpanded, onToggle }) {
  return (
    <div className="border-b border-(--border) last:border-b-0">
      <div
        onClick={onToggle}
        className="flex items-center justify-between py-5 px-2 cursor-pointer group"
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-(--text-strong) group-hover:text-(--primary) transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-(--text-muted) mt-1 line-clamp-1">
            {project.description}
          </p>
        </div>

        <div className="ml-4 shrink-0 text-(--text-muted)">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-2 pb-6 space-y-4">
            <p className="text-sm text-(--text-muted) leading-relaxed">
              {project.description}
            </p>

            {project.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <TagPill key={skill}>{skill}</TagPill>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-(--primary) hover:underline"
                >
                  Live Demo
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-strong)"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}

              {project.slug && project.detail && (
                <Link
                  to={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-(--text-muted) hover:text-(--primary) transition-colors ml-auto"
                >
                  Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
