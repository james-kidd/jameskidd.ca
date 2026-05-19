import { Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { Github, ExternalLink } from "lucide-react";
import PageShell from "../components/PageShell";
import TagPill from "../components/TagPill";
import { projects, projectChapters } from "../content/projects";
import { mdxComponents } from "../components/mdx/mdxComponents";

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/" replace />;

  const Chapter = projectChapters[slug] ?? project.Chapter;
  if (!Chapter) return <Navigate to="/" replace />;

  return (
    <PageShell>
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
          {project.link && project.link !== "#" && (
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

      {project.embed && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-(--text-strong) mb-4">Try It</h2>
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

      <div className="space-y-8">
        <div className="section-panel">
          <MDXProvider components={mdxComponents}>
            <Suspense
              fallback={<p className="text-body text-sm">Loading chapter...</p>}
            >
              <Chapter />
            </Suspense>
          </MDXProvider>
        </div>
      </div>
    </PageShell>
  );
}
