import React from "react";
import { FolderGit2, ArrowUpRight, Github } from "lucide-react";

export default function ProjectsSection({ data }) {
  return (
    <div className="mb-24">
      {/* Section Title */}
      <h2 className="text-3xl font-bold mb-8 flex items-center text-gray-900">
        <FolderGit2 className="w-8 h-8 mr-3 text-(--primary)" />
        Selected Projects
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {data.map((project, idx) => (
          <div
            key={idx}
            className="card card-hover group flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {/* Icon Box */}
                <div className="icon-box">
                    <Github className="w-5 h-5" />
                </div>
                <h3 className="ml-3 font-bold text-lg text-gray-900 leading-tight">
                  {project.title}
                </h3>
              </div>

              {/* External Link */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-(--primary) transition-colors p-1"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 grow leading-relaxed text-[15px]">
              {project.description}
            </p>

            {/* Skills Pills */}
            <div className="border-t border-gray-100 pt-4 mt-auto">
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="tag-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
