import { ArrowUpRight } from "lucide-react";
import { playground } from "@/content/playground";
import { projects } from "@/content/projects";
import { BipartiteVisual } from "./bipartite-visual";
import { Tags } from "./tags";

export function TryItOut() {
  const demos = projects.filter((project) => project.embed);

  return (
    <div className="space-y-16">
      {demos.map((project) => (
        <article key={project.title}>
          <header className="max-w-2xl">
            <h3 className="t-heading">{project.title}</h3>
            <p className="t-small mt-2 text-ink-muted">{project.description}</p>
            <Tags items={project.tags} className="mt-4" />
          </header>
          <div className="card mt-6 overflow-hidden">
            <iframe
              src={project.embed}
              title={`${project.title} — interactive demo`}
              loading="lazy"
              allow="clipboard-write"
              className="block h-[42rem] w-full"
            />
          </div>
          <p className="mt-3">
            <a
              href={project.embed}
              target="_blank"
              rel="noreferrer"
              className="t-label inline-flex items-center gap-1 text-accent hover:underline"
            >
              Open the demo in a new tab
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </p>
        </article>
      ))}

      <article>
        <header className="max-w-2xl">
          <h3 className="t-heading">{playground.bipartite.title}</h3>
          <p className="t-small mt-2 text-ink-muted">{playground.bipartite.description}</p>
          <p className="t-small mt-2">{playground.bipartite.detail}</p>
          <Tags items={playground.bipartite.tags} className="mt-4" />
        </header>
        <div className="mt-6">
          <BipartiteVisual />
        </div>
      </article>
    </div>
  );
}
