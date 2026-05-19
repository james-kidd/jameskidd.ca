import { useState } from "react";
import { Calendar, Building2, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { MDXProvider } from "@mdx-js/react";
import TagPill from "../../components/TagPill";
import { mdxComponents } from "../../components/mdx/mdxComponents";

export default function ExperienceCard({ role }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { Body } = role;

  return (
    <div className="timeline-item group">
      <div className={`timeline-dot ${isExpanded ? "active" : ""}`} />

      <div
        onClick={() => setIsExpanded((v) => !v)}
        className="cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-900">
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

        <div className="mt-1 flex items-center text-xs font-bold text-(--primary) uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-body text-sm mb-6 space-y-3 [&>p]:m-0">
            <MDXProvider components={mdxComponents}>
              <Body />
            </MDXProvider>
          </div>

          {role.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {role.skills.map((skill) => (
                <TagPill key={skill}>{skill}</TagPill>
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
}
