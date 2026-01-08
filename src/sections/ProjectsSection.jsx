import React from "react";
import { FolderGit2, ArrowUpRight, Github } from "lucide-react";

export default function ProjectsSection({ data = [] }) {
  return (
    <div className="section-shell">
      <div className="section-panel space-y-8">
        {/* SECTION TITLE */}
        <h2 className="section-title mb-4 flex items-center">
          <FolderGit2 className="w-8 h-8 mr-3 text-(--primary)" />
          Selected Projects
        </h2>

        {/* EMPTY STATE */}
        {data.length === 0 && (
          <div className="card bg-gray-50 border border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-600 text-sm leading-relaxed">
              This section is being actively curated.
              <br />
              Additional projects, technical write-ups, and repositories will
              be added shortly.
            </p>
          </div>
        )}

        {/* PROJECT GRID */}
        {data.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            {data.map((project) => (
              <div
                key={project.title}
                className="card card-hover group flex flex-col"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="icon-box">
                      <Github className="w-5 h-5" />
                    </div>

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

                {/* DESCRIPTION */}
                <p className="text-gray-600 mb-6 grow leading-relaxed text-[15px]">
                  {project.description}
                </p>

                {/* SKILLS */}
                {project.skills?.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="
                            tag-pill
                            text-xs font-medium
                            bg-gray-100 text-gray-700
                            hover:bg-(--primary)/10 hover:text-(--primary)
                            transition-colors
                          "
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
