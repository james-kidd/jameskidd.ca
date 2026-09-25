import type { ReactNode } from "react";

/**
 * A home-page section: a heading, an optional one-line lead, and content in
 * the reading column. `wide` widens the column for things that need room
 * (the demos).
 */
export function Section({
  id,
  title,
  lead,
  wide = false,
  children,
}: {
  id: string;
  title: string;
  lead?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-line py-14 md:py-20">
      <div className={`mx-auto px-5 ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
        <header className="mb-8 md:mb-10">
          <h2 className="t-title">{title}</h2>
          {lead && <p className="t-lead mt-3 text-ink-muted">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
