import { Link } from "react-router-dom";
import { Github, ArrowUpRight, ArrowRight } from "lucide-react";
import IconBox from "../../components/IconBox";
import TagPill from "../../components/TagPill";

export default function ProjectCard({ project }) {
  return (
    <div className="card card-hover group flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <IconBox>
            <Github className="w-5 h-5" />
          </IconBox>
          <h3 className="ml-3 font-bold text-lg text-gray-900 leading-tight">
            {project.title}
          </h3>
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-(--primary) transition-colors p-1"
            aria-label={`View ${project.title} repository`}
          >
            <ArrowUpRight className="w-5 h-5" />
          </a>
        )}
      </div>

      <p className="text-gray-600 mb-6 grow leading-relaxed text-[15px]">
        {project.description}
      </p>

      <div className="flex items-center gap-4 mb-6">
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
            className="text-sm text-gray-500 hover:text-gray-800"
          >
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

      {project.skills?.length > 0 && (
        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <TagPill key={skill}>{skill}</TagPill>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
