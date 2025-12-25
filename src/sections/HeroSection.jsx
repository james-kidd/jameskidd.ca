import React from "react";
import { ArrowDown, FileText, Mail, Linkedin, ChevronDown } from "lucide-react";

export default function HeroSection({ data }) {
  return (
    <div
      className="relative flex flex-col justify-center 
      min-h-[90dvh]      /* Mobile: Fill the screen (minus header) */
      md:min-h-[60vh]    /* Desktop: Keep it compact */
      md:justify-center  /* Desktop: Center normally */
      mb-0 md:mb-12
    "
    >
      {/* --- CONTENT CENTER --- */}
      <div className="flex-1 flex flex-col justify-center items-start md:block md:flex-none">
        {/* Eyebrow */}
        <span className="text-(--primary) font-bold tracking-widest uppercase text-xs mb-4 block">
          Software Developer & Data Scientist
        </span>

        {/* Big Name */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tighter mb-6 leading-tight">
          {data.name}
          <span className="text-(--primary)">.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg md:text-2xl text-gray-500 leading-relaxed font-light mb-8 md:max-w-xl">
          {data.tagline}
        </p>
      </div>

      {/* --- ACTION GRID --- */}
      <div className="mt-auto md:mt-8 w-full md:w-auto pb-12 md:pb-0">
        {/* 
            DESKTOP BUTTONS
            */}
        <div className="hidden md:flex flex-wrap gap-4 items-center">
          {/* Resume */}
          {data.resumeLink && (
            <a
              href={data.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary" // <--- Replaced ~10 classes
            >
              Resume <FileText className="w-4 h-4 ml-2" />
            </a>
          )}

          {/* LinkedIn */}
          {data.socials?.linkedin && (
            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline" // <--- Replaced ~10 classes
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
          )}

          {/* Email */}
          <a
            href={`mailto:${data.contact?.email || ""}`}
            className="btn btn-outline"
          >
            Email Me <Mail className="w-4 h-4 ml-2" />
          </a>
        </div>
        {/* 
            MOBILE APP CONTROLS
            */}
        <div className="md:hidden flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Resume Action */}
            {data.resumeLink && (
              <a
                href={data.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-4 bg-gray-900 text-white rounded-xl font-medium shadow-lg active:scale-95 transition-transform"
              >
                <FileText className="w-5 h-5 mr-2" />
                Resume
              </a>
            )}

            {/* 2. Email Action */}
            <a
              href={`mailto:${
                data.contact?.email || "james.kidd@mail.mcgill.ca"
              }`}
              className="flex items-center justify-center py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-medium shadow-sm active:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2 text-(--primary)" />
              Email
            </a>
          </div>

          {/* 3. LinkedIn Row */}
          {data.socials?.linkedin && (
            <div className="grid grid-cols-1">
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center py-3 text-gray-500 bg-gray-50 rounded-xl hover:text-(--primary) transition-colors text-sm font-medium"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                Connect on LinkedIn
              </a>
            </div>
          )}

          {/* 4. Swipe Indicator */}
          <div className="flex flex-col items-center mt-6 opacity-40">
            <span className="text-[10px] uppercase tracking-widest text-(--primary-dark) mb-1">
              Swipe to explore
            </span>
            <ChevronDown className="w-5 h-5 text-(--primary-dark) animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
