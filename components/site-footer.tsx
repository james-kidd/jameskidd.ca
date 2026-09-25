import { site } from "@/content/site";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./brand-icons";

const socials = [
  { label: "GitHub", href: site.socials.github, Icon: GithubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedinIcon },
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-8">
        <p className="t-small text-ink-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex items-center gap-x-5">
          <li>
            <a href={`mailto:${site.contact.contract}`} className="t-small link-quiet text-ink-muted">
              {site.contact.contract}
            </a>
          </li>
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="link-quiet block text-ink-muted"
              >
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
