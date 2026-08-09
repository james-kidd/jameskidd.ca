// src/seo.js
//
// Single source of truth for per-route <head> metadata.
//
// Used twice:
//   1. At build time by scripts/prerender.js, which bakes the tags into each
//      prerendered HTML file so crawlers and link-preview bots see them.
//   2. At runtime by src/hooks/useRouteMeta.js, which keeps the live document
//      in sync during client-side navigation.
//
// Copy is sourced from existing content (hero data, MDX frontmatter, travel
// stats) rather than duplicated by hand.

import { heroData } from "./data/hero";
import { skillsDetailData } from "./data/skills-detail";
import { travelData } from "./data/travel";
import { projects } from "./content/projects";
import { frontmatter as personalMeta } from "./content/personal.mdx";

export const SITE_URL = "https://jameskidd.info";
export const SITE_NAME = heroData.name;
export const DEFAULT_OG_IMAGE = "/photos/about-me-2.jpg";
// about-me-2.jpg is square (900x900). "summary_large_image" expects ~1.91:1 and
// would centre-crop it, so stick to the square card until a dedicated 1200x630
// OG image exists.
export const TWITTER_CARD = "summary";

const MAX_DESCRIPTION = 200;

/** Collapse whitespace and clamp to a link-preview friendly length. */
function clamp(text, max = MAX_DESCRIPTION) {
  const flat = String(text ?? "").replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;

  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]$/, "")}…`;
}

function pageTitle(headline) {
  return `${headline} — ${heroData.name}`;
}

export const DEFAULT_META = {
  path: "/",
  title: `${heroData.name} — ${heroData.title}`,
  description: clamp(
    `${heroData.tagline}. ${heroData.name} is a ${heroData.title} working across ${heroData.stack.join(", ")}.`
  ),
  type: "website",
  image: DEFAULT_OG_IMAGE,
};

const SKILLS_META = {
  path: "/skills",
  title: pageTitle(skillsDetailData.headline),
  description: clamp(skillsDetailData.positioning),
  type: "website",
  image: DEFAULT_OG_IMAGE,
};

const PERSONAL_META = {
  path: "/personal",
  // "Offline Mode" alone reads like an error state in a search result, so the
  // frontmatter heading is qualified with what the page actually contains.
  title: pageTitle(`${personalMeta.title}: Travel & Photography`),
  description: clamp(
    `Life beyond the terminal — a travel map, photo gallery, and life story covering ${travelData.stats.citiesExplored} cities across ${travelData.stats.countriesVisited} countries.`
  ),
  type: "website",
  image: DEFAULT_OG_IMAGE,
};

const NOT_FOUND_META = {
  path: "/404",
  title: pageTitle("Page not found"),
  description: "That page does not exist.",
  type: "website",
  image: DEFAULT_OG_IMAGE,
  robots: "noindex",
};

function projectMeta(project) {
  return {
    path: `/projects/${project.slug}`,
    title: pageTitle(project.title),
    description: clamp(project.description),
    type: "article",
    image: DEFAULT_OG_IMAGE,
  };
}

const STATIC_META = [DEFAULT_META, SKILLS_META, PERSONAL_META];

/** Every route the build should prerender, in emit order. */
export const ROUTE_META = [
  ...STATIC_META,
  ...projects.map(projectMeta),
  NOT_FOUND_META,
];

/** Routes that belong in sitemap.xml — everything crawlable. */
export const INDEXABLE_ROUTE_META = ROUTE_META.filter((meta) => !meta.robots);

const META_BY_PATH = new Map(ROUTE_META.map((meta) => [meta.path, meta]));

/** Normalize `/skills/` and `/skills` (and `''`) to the same lookup key. */
function normalizePath(pathname) {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function getRoutePaths() {
  return ROUTE_META.map((meta) => meta.path);
}

/** Resolve the metadata for a pathname, falling back to the sitewide default. */
export function resolveMeta(pathname) {
  return META_BY_PATH.get(normalizePath(pathname)) ?? DEFAULT_META;
}

/**
 * Flatten a meta record into the concrete tag list rendered into <head>.
 * `selector` is used by both the prerender writer and the runtime updater so
 * the two always agree on which element owns which value.
 */
export function canonicalUrl(path) {
  return `${SITE_URL}${path}`;
}

export function toHeadTags(meta) {
  const canonical = canonicalUrl(meta.path);
  const image = `${SITE_URL}${meta.image}`;

  return {
    title: meta.title,
    canonical,
    metas: [
      ...(meta.robots
        ? [{ selector: 'meta[name="robots"]', attrs: { name: "robots" }, content: meta.robots }]
        : []),
      { selector: 'meta[name="description"]', attrs: { name: "description" }, content: meta.description },
      { selector: 'meta[property="og:type"]', attrs: { property: "og:type" }, content: meta.type },
      { selector: 'meta[property="og:site_name"]', attrs: { property: "og:site_name" }, content: SITE_NAME },
      { selector: 'meta[property="og:title"]', attrs: { property: "og:title" }, content: meta.title },
      { selector: 'meta[property="og:description"]', attrs: { property: "og:description" }, content: meta.description },
      { selector: 'meta[property="og:url"]', attrs: { property: "og:url" }, content: canonical },
      { selector: 'meta[property="og:image"]', attrs: { property: "og:image" }, content: image },
      { selector: 'meta[name="twitter:card"]', attrs: { name: "twitter:card" }, content: TWITTER_CARD },
      { selector: 'meta[name="twitter:title"]', attrs: { name: "twitter:title" }, content: meta.title },
      { selector: 'meta[name="twitter:description"]', attrs: { name: "twitter:description" }, content: meta.description },
      { selector: 'meta[name="twitter:image"]', attrs: { name: "twitter:image" }, content: image },
    ],
  };
}
