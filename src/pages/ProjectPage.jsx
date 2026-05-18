import { useParams, Navigate } from "react-router-dom";
import { Github, ArrowUpRight, ExternalLink } from "lucide-react";
import PageShell from "../components/PageShell";
import TagPill from "../components/TagPill";
import { sectionData } from "../data";

function DetailSection({ title, children }) {
  return (
    <div>
      <h2 className="font-bold text-lg text-(--text-strong) mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = sectionData.projects.find((p) => p.slug === slug);

  if (!project || !project.detail) {
    return <Navigate to="/" replace />;
  }

  const { detail } = project;

  return (
    <PageShell>
      {/* HEADER */}
      <div className="mb-10">
        <span className="eyebrow text-(--primary) mb-3 block">Project</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-(--text-strong) tracking-tight mb-4">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-sm py-2.5 px-5"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline text-sm py-2.5 px-5"
            >
              <Github className="w-4 h-4 mr-2" />
              Source Code
            </a>
          )}
        </div>

        {project.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <TagPill key={skill}>{skill}</TagPill>
            ))}
          </div>
        )}
      </div>

      {/* EMBEDDED DEMO */}
      {project.embed && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-(--text-strong) mb-4">
            Try It
          </h2>
          <div className="section-panel overflow-hidden p-0">
            <iframe
              src={project.embed}
              title={`${project.title} demo`}
              className="w-full border-0 rounded-lg"
              style={{ height: "720px" }}
              allow="accelerometer; clipboard-write"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* DETAIL SECTIONS */}
      <div className="space-y-8">
        <div className="section-panel space-y-8">
          <DetailSection title="Overview">
            <p className="text-body text-[15px] leading-relaxed">
              {detail.overview}
            </p>
          </DetailSection>

          <DetailSection title="Why It Matters">
            <p className="text-body text-[15px] leading-relaxed">
              {detail.whyItMatters}
            </p>
          </DetailSection>

          <DetailSection title="Technical Approach">
            <ul className="space-y-2">
              {detail.technicalApproach.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 text-sm text-(--text-muted)"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-(--primary) shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Why This Is Relevant">
            <p className="text-body text-[15px] leading-relaxed">
              {detail.recruiterRelevance}
            </p>
          </DetailSection>
        </div>
      </div>
    </PageShell>
  );
}
