import React, { useState } from "react";
import {
  FolderGit2,
  Calendar,
  Building2,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ExperienceCard = ({ role }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    /* 1. Added 'group' so children can use group-hover */
    <div className="timeline-item group">
      {/* 2. Simplified Dot Logic */}
      <div className={`timeline-dot ${isExpanded ? "active" : ""}`} />

      {/* ================= HEADER ================= */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
          {/* Title hover color is now handled by CSS (.timeline-item:hover h3) */}
          <h3 className="text-lg font-semibold text-gray-900 transition-colors">
            {role.title}
          </h3>

          <span className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {role.date}
          </span>
        </div>

        <div className="flex items-center mb-2 text-gray-700 font-medium">
          <Building2 className="w-4 h-4 mr-2" />
          {role.company || role.school}
        </div>

        {role.tagline && (
          <p className="text-sm text-(--primary-dark) font-medium italic mb-2">
            {role.tagline}
          </p>
        )}

        {/* Toggle Hint - Uses 'group-hover' from the parent class */}
        <div className="mt-1 flex items-center text-xs font-bold text-(--primary) uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div
        className={`grid transition-all duration-500 ease-in-out cursor-default ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-body text-sm mb-6">{role.description}</p>

          {role.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {role.skills.map((skill) => (
                <span key={skill} className="tag-pill">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {role.link && (
            <a
              href={role.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-(--primary) hover:underline"
            >
              View Organization <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ExperienceSection({ data }) {
  return (
    <div className="space-y-16">
      {data.internships && (
        <div>
          <h3 className="section-title mb-12">
            <FolderGit2 className="w-8 h-8 mr-3 text-(--primary)" />
            Internships
          </h3>
          <div className="ml-2">
            {data.internships.map((role, idx) => (
              <ExperienceCard key={idx} role={role} />
            ))}
          </div>
        </div>
      )}

      {data.academic && (
        <div>
          <h3 className="section-title mb-12">
            <FolderGit2 className="w-8 h-8 mr-3 text-(--primary)" />
            Leadership
          </h3>
          <div className="ml-2">
            {data.academic.map((role, idx) => (
              <ExperienceCard key={idx} role={role} />
            ))}
          </div>
        </div>
      )}

      {data.freelance && (
        <div>
          <h3 className="section-title mb-12">
            <FolderGit2 className="w-8 h-8 mr-3 text-(--primary)" />
            Freelance
          </h3>
          <div className="ml-2">
            {data.freelance.map((role, idx) => (
              <ExperienceCard key={idx} role={role} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
