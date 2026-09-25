import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ComponentType } from "react";
import { projects } from "@/content/projects";
import type { Project } from "@/content/schema";
import { GithubIcon } from "./brand-icons";
import { Tags } from "./tags";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const LINKS: { key: keyof Project["links"]; label: string; Icon: IconComponent }[] = [
  { key: "github", label: "Source", Icon: GithubIcon },
  { key: "live", label: "Live", Icon: ArrowUpRight },
  { key: "writeup", label: "Write-up", Icon: ArrowUpRight },
];

export function Projects() {
  return (
    <ul className="space-y-4">
      {projects.map((project) => (
        <li key={project.title} className="card p-5 md:p-6">
          <div className="flex gap-5">
            {project.image && (
              <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-sm sm:block">
                <Image src={project.image} alt="" fill sizes="96px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="t-heading">{project.title}</h3>
                {project.note && <p className="t-label">{project.note}</p>}
              </div>
              <p className="t-small mt-2 text-ink-muted">{project.description}</p>
              <Tags items={project.tags} className="mt-4" />
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {LINKS.map(({ key, label, Icon }) => {
                  const href = project.links[key];
                  if (!href) return null;
                  return (
                    <li key={key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="t-label inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        <Icon className="size-3.5" aria-hidden />
                        {label}
                      </a>
                    </li>
                  );
                })}
                {project.embed && (
                  <li>
                    <a href="#try-it-out" className="t-label inline-flex items-center gap-1 text-accent hover:underline">
                      <ArrowDown className="size-3.5" aria-hidden />
                      Try it out
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
