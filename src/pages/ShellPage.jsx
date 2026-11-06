import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { heroData } from "../data";

const ICONS = { github: Github, linkedin: Linkedin, mail: Mail };

/**
 * The whole site: name, one line, link tiles. Landmarks are real elements so
 * the page reads correctly without CSS: one h1, a nav of links, a footer.
 */
export default function ShellPage() {
  const { name, title, tagline, links } = heroData;

  return (
    <div className="min-h-dvh flex flex-col">
      <main id="main" className="flex-1 flex items-center">
        <div className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24">
          <header className="mb-12">
            <p className="eyebrow text-(--primary) mb-4">{title}</p>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight text-gray-900 mb-5">
              {name}
              <span className="text-(--primary)">.</span>
            </h1>
            <p className="section-lead md:text-2xl max-w-xl">{tagline}</p>
          </header>

          <nav aria-label="Links">
            <ul className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => {
                const Icon = ICONS[link.icon];
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="card card-hover group flex items-center gap-4 !p-5"
                    >
                      {Icon && <Icon className="w-6 h-6 shrink-0 text-(--primary)" aria-hidden="true" />}
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-gray-900">{link.label}</span>
                        {link.note && (
                          <span className="block text-sm text-(--text-muted) truncate">
                            {link.note}
                          </span>
                        )}
                      </span>
                      <ArrowUpRight
                        className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--primary)"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-(--text-muted)">
        {name}
      </footer>
    </div>
  );
}
