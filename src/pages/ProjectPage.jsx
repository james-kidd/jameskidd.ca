import { Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { Github, ExternalLink, BookOpen } from "lucide-react";
import PageShell from "../components/PageShell";
import TagPill from "../components/TagPill";
import Comments from "../components/Comments";
import { projects, projectChapters } from "../content/projects";
import { briefsBySlug } from "../content/projects/briefs";
import { mdxComponents } from "../components/mdx/mdxComponents";

const STATUS_LABEL = {
  idea: "Idea",
  building: "In progress",
  live: "Live",
  paused: "Paused",
  archived: "Archived",
};

/**
 * One project page, three owners:
 *   - the header is the site's record (src/content/projects/<slug>.mdx frontmatter);
 *   - the read-me is the project's brief, synced from its own repo
 *     (src/content/projects/briefs/<slug>.mdx, contract in docs/project-brief.md);
 *   - the optional write-up is the site's MDX body, kept below the brief.
 * Comments come last and load only on request.
 */
export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/" replace />;

  const brief = briefsBySlug[slug];
  const Chapter = projectChapters[slug] ?? project.Chapter;
  if (!brief && !Chapter) return <Navigate to="/" replace />;

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
        <MDXProvider components={mdxComponents}>
          {brief && (
            <section className="section-panel" aria-labelledby="brief-heading">
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
                <h2 id="brief-heading" className="font-bold text-lg text-(--text-strong)">
                  <BookOpen className="w-4 h-4 mr-2 inline-block align-[-2px]" />
                  Read me
                </h2>
                <span className="text-xs text-(--text-muted)">
                  {STATUS_LABEL[brief.status] ?? brief.status}
                  {brief.updated ? ` · updated ${brief.updated}` : ""}
                  {" · "}
                  <a
                    href={brief.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-(--primary) hover:text-(--primary-dark) underline underline-offset-2"
                  >
                    from the project repo
                  </a>
                </span>
              </div>
              <p className="text-body text-[15px] leading-relaxed mb-2">{brief.summary}</p>
              <Suspense fallback={<p className="text-body text-sm">Loading read me...</p>}>
                <brief.ReadMe />
              </Suspense>
            </section>
          )}

          {Chapter && (
            <section className="section-panel" aria-labelledby={brief ? "writeup-heading" : undefined}>
              {brief && (
                <h2 id="writeup-heading" className="font-bold text-lg text-(--text-strong) mb-2">
                  Write-up
                </h2>
              )}
              <Suspense fallback={<p className="text-body text-sm">Loading chapter...</p>}>
                <Chapter />
              </Suspense>
            </section>
          )}
        </MDXProvider>

        <Comments term={`projects/${slug}`} />
      </div>
    </PageShell>
  );
}
