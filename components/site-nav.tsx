import Link from "next/link";
import { site } from "@/content/site";

const links = [
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Try it out", href: "/#try-it-out" },
  { label: "Skills", href: "/#skills" },
  { label: "Personal", href: "/personal" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
      <nav
        aria-label="Site"
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3"
      >
        <Link href="/" className="t-heading link-quiet">
          {site.name}
        </Link>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="t-label link-quiet">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
