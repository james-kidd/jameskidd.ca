// src/structuredData.js
//
// schema.org JSON-LD for every route, built from the same content the pages render.
//
// Used the same two ways as src/seo.js:
//   1. scripts/prerender.js bakes the graph into each route's static HTML, so
//      crawlers that do not run JavaScript still read it.
//   2. src/hooks/useRouteMeta.js swaps it on client-side navigation.
//
// Nothing here is written by hand per page. The graph "unrolls" from content:
//   - src/data/hero.js                 -> Person (name, job title, socials, skills)
//   - src/data/sections/education.js   -> Person.alumniOf
//   - src/content/experience/*.mdx     -> Person.worksFor / Person.memberOf
//   - src/content/projects/*.mdx       -> one CreativeWork per project page
//   - src/data/sections/personal/gallery.js -> ImageGallery on /personal
// Add a role, project or photo in its usual place and the JSON-LD follows.
//
// Optional frontmatter that refines the output (all can be left out):
//   projects:   schemaType ("SoftwareSourceCode" | "CreativeWork" | "ScholarlyArticle"
//               | any schema.org type), datePublished ("2026-03"), image ("/photos/x.jpg")
//   experience: startDate / endDate (ISO, e.g. "2026-01"); otherwise parsed from `date`
//
// Validate a build with `npm run check:schema`, or paste a page into
// https://validator.schema.org.

import { heroData } from "./data/hero";
import { educationDetails } from "./data/sections/education";
import { skillBlocks } from "./data/sections/skills";
import { gallery } from "./data/sections/personal/gallery";
import { travelData } from "./data/travel";
import { experiences } from "./content/experience";
import { projects } from "./content/projects";
import { frontmatter as personalMeta } from "./content/personal.mdx";
import { SITE_URL, DEFAULT_OG_IMAGE, canonicalUrl, resolveMeta } from "./seo";

// ---------------------------------------------------------------------------
// Stable node ids. Every page points at the same Person and WebSite, so search
// engines merge them into one entity instead of one per page.
// ---------------------------------------------------------------------------

export const IDS = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
};

const pageId = (path) => `${canonicalUrl(path)}#webpage`;
const absolute = (path) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}/${path.replace(/^\/+/, "")}`);

/** Drop keys whose value is undefined, null, "" or []. Keeps the output readable. */
function compact(node) {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
    )
  );
}

// ---------------------------------------------------------------------------
// Dates. Content uses display strings like "Jan 2026 — Apr 2026" or
// "2024 — Present"; schema.org wants ISO 8601 ("2026-01", "2024").
// ---------------------------------------------------------------------------

const MONTHS = {
  jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
  jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
};

/** "Jan 2026" -> "2026-01", "2024" -> "2024", "Present" -> undefined. */
export function toIsoDate(text) {
  const value = String(text ?? "").trim();
  const monthYear = value.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTHS[monthYear[1].toLowerCase()];
    return month ? `${monthYear[2]}-${month}` : monthYear[2];
  }
  const year = value.match(/^(\d{4})$/);
  return year ? year[1] : undefined;
}

/** "Jan 2026 — Apr 2026" -> { startDate: "2026-01", endDate: "2026-04" }. */
export function parseDateRange(text) {
  const [start, end] = String(text ?? "").split(/\s*[—–-]\s*/);
  return { startDate: toIsoDate(start), endDate: toIsoDate(end) };
}

function datesOf(entry, rangeText) {
  const parsed = parseDateRange(rangeText);
  return {
    startDate: entry.startDate ?? parsed.startDate,
    endDate: entry.endDate ?? parsed.endDate,
  };
}

// ---------------------------------------------------------------------------
// Sitewide nodes: WebSite and Person. Present on every page.
// ---------------------------------------------------------------------------

/**
 * How each experience group maps onto a Person property. A schema.org "Role"
 * wraps the organization so it can carry the job title and dates.
 * Groups not listed here (freelance) have no organization to point at and are left out.
 */
const EXPERIENCE_GROUPS = {
  internships: { property: "worksFor", roleType: "EmployeeRole" },
  academic: { property: "memberOf", roleType: "OrganizationRole" },
};

function experienceRole(entry, { property, roleType }) {
  return compact({
    "@type": roleType,
    roleName: entry.title,
    ...datesOf(entry, entry.date),
    [property]: compact({
      "@type": "Organization",
      name: entry.company,
      url: entry.link,
    }),
  });
}

function rolesFor(property) {
  return experiences
    .filter((entry) => EXPERIENCE_GROUPS[entry.group]?.property === property)
    .map((entry) => experienceRole(entry, EXPERIENCE_GROUPS[entry.group]));
}

function educationRole(entry) {
  return compact({
    "@type": "OrganizationRole",
    roleName: entry.degree,
    ...datesOf(entry, entry.year),
    alumniOf: { "@type": "CollegeOrUniversity", name: entry.school },
  });
}

/** The skills block that lists spoken languages rather than technical skills. */
const SPOKEN_LANGUAGES_BLOCK = "spoken";

/** Skills, de-duplicated, in the order the page shows them. */
function knowsAbout() {
  const technical = skillBlocks.filter((block) => block.id !== SPOKEN_LANGUAGES_BLOCK);
  const all = [...heroData.stack, ...technical.flatMap((block) => block.items)];
  return [...new Set(all)];
}

/** "French (fluent)" -> "French". */
function knowsLanguage() {
  const block = skillBlocks.find((entry) => entry.id === SPOKEN_LANGUAGES_BLOCK);
  return (block?.items ?? []).map((item) => item.replace(/\s*\(.*\)\s*$/, ""));
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": IDS.website,
    url: `${SITE_URL}/`,
    name: heroData.name,
    inLanguage: "en",
    publisher: { "@id": IDS.person },
  };
}

export function personNode() {
  return compact({
    "@type": "Person",
    "@id": IDS.person,
    name: heroData.name,
    url: `${SITE_URL}/`,
    image: absolute(DEFAULT_OG_IMAGE),
    jobTitle: heroData.title,
    description: heroData.tagline,
    email: heroData.emails?.dev ? `mailto:${heroData.emails.dev}` : undefined,
    sameAs: [...Object.values(heroData.socials ?? {}), personalMeta.instagram],
    knowsAbout: knowsAbout(),
    knowsLanguage: knowsLanguage(),
    alumniOf: educationDetails.map(educationRole),
    worksFor: rolesFor("worksFor"),
    memberOf: rolesFor("memberOf"),
  });
}

// ---------------------------------------------------------------------------
// Page nodes. One WebPage per route, plus whatever that page is about.
// ---------------------------------------------------------------------------

function webPage(path, type, extra = {}) {
  const meta = resolveMeta(path);
  return compact({
    "@type": type,
    "@id": pageId(path),
    url: canonicalUrl(path),
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": IDS.website },
    ...extra,
  });
}

function breadcrumbs(path, trail) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl(path)}#breadcrumb`,
    itemListElement: trail.map((crumb, index) =>
      compact({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.path ? canonicalUrl(crumb.path) : undefined,
      })
    ),
  };
}

/** GitHub links are source code; everything else is a general creative work. */
function projectType(project) {
  if (project.schemaType) return project.schemaType;
  return /github\.com/.test(project.link ?? "") ? "SoftwareSourceCode" : "CreativeWork";
}

const isRealLink = (url) => Boolean(url) && url !== "#";

export function projectNode(project) {
  const path = `/projects/${project.slug}`;
  const type = projectType(project);
  const links = [project.link, project.demo].filter(isRealLink);

  return compact({
    "@type": type,
    "@id": `${canonicalUrl(path)}#work`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url: canonicalUrl(path),
    image: project.image ? absolute(project.image) : undefined,
    datePublished: project.datePublished,
    author: { "@id": IDS.person },
    keywords: project.skills,
    codeRepository: type === "SoftwareSourceCode" ? project.link : undefined,
    sameAs: links,
    mainEntityOfPage: { "@id": pageId(path) },
  });
}

function projectList() {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#projects`,
    name: "Projects",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: canonicalUrl(`/projects/${project.slug}`),
      name: project.title,
    })),
  };
}

function imageGallery(path) {
  return {
    "@type": "ImageGallery",
    "@id": `${canonicalUrl(path)}#gallery`,
    name: `${personalMeta.title}: photos from ${travelData.stats.countriesVisited} countries`,
    author: { "@id": IDS.person },
    image: gallery.map((photo) =>
      compact({
        "@type": "ImageObject",
        contentUrl: absolute(photo.src),
        name: photo.caption,
        description: photo.alt,
        creator: { "@id": IDS.person },
      })
    ),
  };
}

// ---------------------------------------------------------------------------
// Route table. Each builder returns the page-specific nodes; the sitewide
// WebSite and Person are added by resolveStructuredData.
// ---------------------------------------------------------------------------

const PAGE_BUILDERS = {
  "/": () => [
    webPage("/", "ProfilePage", {
      mainEntity: { "@id": IDS.person },
      about: { "@id": IDS.person },
      hasPart: { "@id": `${SITE_URL}/#projects` },
    }),
    projectList(),
  ],
  "/personal": () => [
    webPage("/personal", "ProfilePage", {
      mainEntity: { "@id": IDS.person },
      primaryImageOfPage: absolute(DEFAULT_OG_IMAGE),
      breadcrumb: { "@id": `${canonicalUrl("/personal")}#breadcrumb` },
    }),
    imageGallery("/personal"),
    breadcrumbs("/personal", [{ name: heroData.name, path: "/" }, { name: personalMeta.title }]),
  ],
  ...Object.fromEntries(
    projects.map((project) => {
      const path = `/projects/${project.slug}`;
      return [
        path,
        () => [
          webPage(path, "WebPage", {
            mainEntity: { "@id": `${canonicalUrl(path)}#work` },
            breadcrumb: { "@id": `${canonicalUrl(path)}#breadcrumb` },
          }),
          projectNode(project),
          breadcrumbs(path, [
            { name: heroData.name, path: "/" },
            { name: "Projects", path: "/#projects" },
            { name: project.title },
          ]),
        ],
      ];
    })
  ),
};

function normalizePath(pathname) {
  const trimmed = String(pathname ?? "").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/**
 * The full JSON-LD document for a route, or null for routes that should carry
 * none (the 404 page, unknown paths).
 */
export function resolveStructuredData(pathname) {
  const build = PAGE_BUILDERS[normalizePath(pathname)];
  if (!build) return null;

  return {
    "@context": "https://schema.org",
    "@graph": [websiteNode(), personNode(), ...build()],
  };
}

/**
 * Serialize for a <script type="application/ld+json"> element. `<` is escaped so
 * content can never close the script tag early.
 */
export function toJsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

export const STRUCTURED_DATA_SCRIPT_ID = "structured-data";
