import React, { useState } from "react";
import { Calendar, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

const EducationCard = ({ edu }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // shared timeline item class
    <div className="timeline-item group">
      {/* shared dot class */}
      <div className={`timeline-dot ${isExpanded ? "active" : ""}`} />

      {/* ================= HEADER (CLICKABLE) ================= */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
          {/* School Name */}
          <h4 className="font-bold text-xl text-gray-900 transition-colors group-hover:text-(--primary)">
            {edu.school}
          </h4>

          {/* Date Pill */}
          <span className="flex items-center text-sm font-medium text-gray-500">
            <Calendar className="w-3 h-3 mr-2" />
            {edu.year}
          </span>
        </div>

        {/* Degree */}
        <div className="text-(--primary) font-medium mb-2">{edu.degree}</div>

        {/* Toggle Hint (Chevron) */}
        <div className="flex items-center text-xs font-bold text-(--primary) uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-1" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
          )}
        </div>
      </div>

      {/*  BODY (EXPANDABLE)  */}
      <div
        className={`grid transition-all duration-500 ease-in-out cursor-default ${
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-body text-sm mb-6 max-w-2xl">{edu.description}</p>

          {/* Coursework Section */}
          <div>
            <div className="eyebrow text-gray-400 mb-3 opacity-80">
              Key Coursework
            </div>
            <div className="flex flex-wrap gap-2">
              {edu.coursework.map((course, cIdx) => (
                <span key={cIdx} title={course.name} className="tag-pill">
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

// Main Section
export default function AboutSection({ data }) {
  const { intro, education } = data;

  return (
    <div className="space-y-12">
      {/* Intro Text */}
      <div className="space-y-6 max-w-3xl">
        {intro.map((p, i) => (
          <p key={i} className="text-xl text-body font-light">
            {p}
          </p>
        ))}
      </div>

      <hr className="border-gray-100" />

      {/* Timeline Section */}
      <div>
        <h3 className="section-title mb-12">
          <GraduationCap className="w-6 h-6 mr-2" />
          Education Timeline
        </h3>

        <div className="ml-2">
          {education.details.map((edu, idx) => (
            <EducationCard key={idx} edu={edu} />
          ))}
        </div>
      </div>
    </div>
  );
}
