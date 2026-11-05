# 0008: Content is Markdown with frontmatter, not MDX

Status: accepted (James, 2026-11-05: MDX belongs to component notes and design transfer, not to the site's content; as content it hurts the engineering discipline and the design)

## Context
The site's content lived in `.mdx` files. MDX lets prose embed JSX, which blurs the line between words and presentation, lets an agent reach for a component inside copy, and makes every content file a program.

## Decision
Content files are plain Markdown with YAML frontmatter, compiled in markdown mode (no JSX, no expressions). Project briefs and articles are `.md` only. The loaders and the approval gate accept both `.md` and `.mdx`; `.mdx` is tolerated for the existing write-ups that embed a registered interactive component (`BipartiteVisual`) and for nothing new. MDX stays the format for component documentation in component repos and for design-concept notes in the vault, per the platform's type policy.

## Consequences
The existing `src/content/experience/*.mdx` and `src/content/projects/*.mdx` can be renamed to `.md` once James approves (each rename breaks its stamp, which is the point). `about.mdx` carries an MDX comment and needs that comment moved to frontmatter first. The brief and article contracts reject HTML, braces and embeds so the text stays data.
