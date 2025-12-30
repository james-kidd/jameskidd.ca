import React, { useState } from "react";
import { Calendar, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

/* ===================== CARD ===================== */

const EducationCard = ({ edu }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="timeline-item group">
      <div className={`timeline-dot ${isExpanded ? "active" : ""}`} />

      {/* HEADER */}
      <div
        onClick={() => setIsExpanded((v) => !v)}
        className="cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
          <h4 className="font-bold text-xl text-gray-900 transition-colors group-hover:text-(--primary)">
            {edu.school}
          </h4>

          <span className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-3 h-3 mr-2" />
            {edu.year}
          </span>
        </div>

        <div className="text-(--primary) font-medium mb-2">
          {edu.degree}
        </div>

        <div className="flex items-center text-xs font-bold text-(--primary) uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </div>
      </div>

      {/* BODY */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-body text-sm mb-6 max-w-2xl">
            {edu.description}
          </p>

          <div>
            <div className="eyebrow text-gray-400 mb-3 opacity-80">
              Key Coursework
            </div>

            <div className="flex flex-wrap gap-2">
              {edu.coursework.map((course) => (
                <span
                  key={course.code}
                  title={course.name}
                  className="tag-pill"
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
    <div className="space-y-12">
      {/* INTRO */}
      <div className="space-y-6 max-w-3xl">
        {intro.map((paragraph) => (
          <p key={paragraph} className="text-xl text-body font-light">
            {paragraph}
          </p>
        ))}
      </div>

      <hr className="border-gray-100" />

      {/* EDUCATION */}
      <div>
        <h3 className="section-title mb-12">
          <GraduationCap className="w-6 h-6 mr-2" />
          Education Timeline
        </h3>

        <div className="ml-2">
          {education.details.map((edu) => (
            <EducationCard
              key={`${edu.school}-${edu.year}`}
              edu={edu}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
