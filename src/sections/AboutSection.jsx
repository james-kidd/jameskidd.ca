import React, { useState } from "react";
import { Calendar, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

/* CARD  */

const EducationCard = ({ edu }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="timeline-item group relative">
      {/* TIMELINE DOT */}
      <div
        className={`
          timeline-dot
          transition-all duration-300
          ${isExpanded ? "scale-125 bg-(--primary)" : "bg-gray-300"}
        `}
      />

      {/* HEADER */}
      <div
        onClick={() => setIsExpanded((v) => !v)}
        className="
          cursor-pointer rounded-xl p-4
          transition-all duration-300
          hover:bg-gray-50
        "
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

      {/* BODY */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}
        `}
      >
        <div className="pl-4 pr-2 pb-2">
          <p className="text-sm text-gray-600 mb-6 max-w-2xl leading-relaxed">
            {edu.description}
          </p>

          <div>
            <div className="eyebrow text-gray-400 mb-3">Key Coursework</div>

            <div className="flex flex-wrap gap-2">
              {edu.coursework.map((course) => (
                <span
                  key={course.code}
                  title={course.name}
                  className="
                    tag-pill
                    text-xs font-medium
                    bg-gray-100 text-gray-700
                    hover:bg-(--primary)/10 hover:text-(--primary)
                    transition-colors
                  "
                >
                  {course.code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== SECTION ===================== */

export default function AboutSection({ data }) {
  const { intro, education } = data;

  return (

      // <div className="section-shell">
      //   <div className="section-panel space-y-10">
      //     {/* INTRO */}
      //     <div className="space-y-6 max-w-3xl">
      //       {intro.map((paragraph) => (
      //         <p key={paragraph} className="section-lead">
      //           {paragraph}
      //         </p>
      //       ))}
      //     </div>
      //   </div>
      // </div>

      
      <div className="section-shell">
        <div className="section-panel space-y-10">
          {/* EDUCATION */}
          <div>
            <h3 className="section-title mb-12">
              <GraduationCap className="w-6 h-6 mr-2" />
              Education Timeline
            </h3>

            <div className="ml-2">
              {education.details.map((edu) => (
                <EducationCard key={`${edu.school}-${edu.year}`} edu={edu} />
              ))}
            </div>
          </div>
        </div>
      </div>

  );
}
