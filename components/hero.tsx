import { ArrowUpRight, FileText } from "lucide-react";
import { site } from "@/content/site";
import { TypingAnimation } from "./typing-animation";

export function Hero() {
  return (
    <section className="mx-auto max-w-2xl px-5 pb-14 pt-16 md:pb-20 md:pt-28">
      <p className="t-label">{site.title}</p>
      <h1 className="t-display mt-4">
        {site.name}
        <span className="text-accent">.</span>
      </h1>
      <p className="t-lead mt-5 max-w-xl text-ink-muted">{site.tagline}</p>

      <div className="mt-6">
        <TypingAnimation lines={site.typingLines} />
      </div>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {site.stack.map((item) => (
          <li key={item} className="tag t-small">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href={site.resume} target="_blank" rel="noreferrer" className="btn t-label">
          Resume <FileText className="size-4" aria-hidden />
        </a>
        <a href={site.socials.linkedin} target="_blank" rel="noreferrer" className="btn-ghost t-label">
          LinkedIn <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <a href={site.socials.github} target="_blank" rel="noreferrer" className="btn-ghost t-label">
          GitHub <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>

      <dl className="t-small mt-6 space-y-1 text-ink-muted">
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-ink">Recruiters</dt>
          <dd>{site.contact.recruiters}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="text-ink">Contract inquiries</dt>
          <dd>
            <a href={`mailto:${site.contact.contract}?subject=Contract%20inquiry`} className="link">
              {site.contact.contract}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
