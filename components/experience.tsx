import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { Tags } from "./tags";

export function Experience() {
  return (
    <div className="space-y-12">
      {experience.map(({ group, roles }) => (
        <div key={group}>
          <h3 className="t-label mb-6">{group}</h3>
          <ol className="timeline space-y-10">
            {roles.map((role) => (
              <li key={`${role.title}-${role.date}`} className="relative">
                <span className="timeline-dot" aria-hidden />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className="t-heading">{role.title}</h4>
                  <p className="t-label">{role.date}</p>
                </div>
                <p className="t-small mt-1 text-ink-muted">
                  {role.link ? (
                    <a
                      href={role.link}
                      target="_blank"
                      rel="noreferrer"
                      className="link-quiet inline-flex items-center gap-1"
                    >
                      {role.company}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  ) : (
                    role.company
                  )}
                </p>
                <ul className="t-small mt-3 space-y-2">
                  {role.summary.map((paragraph) => (
                    <li key={paragraph} className="flex gap-2.5">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-ink-muted" aria-hidden />
                      <span>{paragraph}</span>
                    </li>
                  ))}
                </ul>
                <Tags items={role.tags} className="mt-4" />
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
