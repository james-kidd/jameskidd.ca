import { FileText, Linkedin, ChevronDown } from "lucide-react";
import ContactInfo from "../components/ContactInfo";
import TypingAnimation from "../components/TypingAnimation";

export default function HeroSection({ data }) {
  const { emails } = data;

  return (
    <div className="relative flex flex-col justify-center min-h-[90dvh] md:min-h-[60vh] mb-0 md:mb-12">
      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-center items-start md:block md:flex-none">
        <span className="eyebrow text-(--primary) mb-4 block">
          {data.title}
        </span>

        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tighter mb-6 leading-tight">
          {data.name}
          <span className="text-(--primary)">.</span>
        </h1>

        <p className="section-lead md:text-2xl text-body mb-4 md:max-w-xl">
          {data.tagline}
        </p>

        <div className="mb-6 md:max-w-xl">
          <TypingAnimation />
        </div>

        {data.stack?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-semibold rounded-full border border-(--primary)/20 bg-(--primary)/8 text-(--primary)"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-auto md:mt-8 w-full md:w-auto pb-12 md:pb-0">
        {/* DESKTOP */}
        <div className="hidden md:flex flex-col gap-4 max-w-md">
          <div className="flex gap-4">
            {data.resumeLink && (
              <a
                href={data.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Resume <FileText className="w-4 h-4 ml-2" />
              </a>
            )}

            {data.socials?.linkedin && (
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            )}
          </div>

          <ContactInfo emails={emails} />
        </div>

        {/* MOBILE */}
        <div className="md:hidden flex flex-col gap-4 max-w-md">
          <div className="grid grid-cols-2 gap-3">
            {data.resumeLink && (
              <a
                href={data.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary rounded-xl active:scale-95 transition-transform"
              >
                <FileText className="w-5 h-5 mr-2" />
                Resume
              </a>
            )}

            {data.socials?.linkedin && (
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline rounded-xl active:bg-gray-50 transition-colors"
              >
                <Linkedin className="w-5 h-5 mr-2 text-(--primary)" />
                LinkedIn
              </a>
            )}
          </div>

          <ContactInfo emails={emails} />

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
