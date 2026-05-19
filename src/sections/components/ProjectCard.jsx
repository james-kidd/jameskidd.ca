import { Link } from "react-router-dom";
import { Github, ArrowUpRight, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import TagPill from "../../components/TagPill";

export default function ProjectCard({ project, isExpanded, onToggle }) {
  return (
    <div className={`border-b border-(--border) last:border-b-0 ${project.featured ? "bg-(--secondary)" : ""}`}>
      <div
        onClick={onToggle}
        className="flex items-start justify-between py-5 px-4 cursor-pointer group gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-(--text-strong) group-hover:text-(--primary) transition-colors">
              {project.title}
            </h3>
            {project.featured && (
              <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-(--primary) text-white">
                Featured
              </span>
            )}
            {project.demo && !isExpanded && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-(--primary) text-(--primary)">
                Live Demo
              </span>
            )}
          </div>
          {!isExpanded && (
            <p className="text-sm text-(--text-muted) mt-1 line-clamp-1">
              {project.description}
            </p>
          )}
        </div>

        <div className="shrink-0 text-(--text-muted) mt-0.5">
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
          <div className="px-4 pb-6 space-y-4">
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

            <div className="flex items-center gap-3 flex-wrap">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg bg-(--primary) text-white hover:opacity-85 transition-opacity"
                >
                  Live Demo
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-strong) transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}

              {project.slug && (
                <Link
                  to={`/projects/${project.slug}`}
                  onClick={(e) => e.stopPropagation()}
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
