import { pillars, toolbox } from "@/content/skills";

export function Skills() {
  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-3 md:gap-6">
        {pillars.map((pillar) => (
          <div key={pillar.title}>
            <h3 className="t-heading">{pillar.title}</h3>
            <p className="t-small mt-1 text-ink-muted">{pillar.subtitle}</p>
            <ul className="t-small mt-4 space-y-2">
              {pillar.evidence.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <dl className="divide-y divide-line border-y border-line">
        {toolbox.map((group) => (
          <div key={group.title} className="grid gap-1 py-4 md:grid-cols-[13rem_1fr] md:gap-6">
            <dt className="t-label md:pt-1">{group.title}</dt>
            <dd className="t-small text-ink-muted">{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
