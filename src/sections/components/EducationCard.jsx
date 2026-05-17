import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import TagPill from "../../components/TagPill";

export default function EducationCard({ edu }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="timeline-item group relative">
      <div
        className={`timeline-dot transition-all duration-300 ${
          isExpanded ? "scale-125 bg-(--primary)" : "bg-gray-300"
        }`}
      />

      <div
        onClick={() => setIsExpanded((v) => !v)}
        className="cursor-pointer rounded-xl p-4 transition-all duration-300 hover:bg-gray-50"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
          <h4 className="font-semibold text-lg text-gray-900 transition-colors group-hover:text-(--primary)">
            {edu.school}
          </h4>

          <span className="flex items-center text-xs font-medium text-gray-500 whitespace-nowrap">
            <Calendar className="w-3 h-3 mr-1.5" />
            {edu.year}
          </span>
        </div>

        <div className="text-(--primary) font-medium text-sm mb-2">
          {edu.degree}
        </div>

        <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-(--primary) transition-colors">
          <span className="mr-1">
            {isExpanded ? "Hide details" : "View details"}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-4 pr-2 pb-2">
          <p className="text-sm text-gray-600 mb-6 max-w-2xl leading-relaxed">
            {edu.description}
          </p>

          <div>
            <div className="eyebrow text-gray-400 mb-3">Key Coursework</div>

            <div className="flex flex-wrap gap-2">
              {edu.coursework.map((course) => (
                <TagPill
                  key={course.code}
                  href={course.URL}
                  title={course.name}
                >
                  {course.code}
                </TagPill>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
