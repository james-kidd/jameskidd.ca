#!/usr/bin/env node
/**
 * export-design-content.mjs — flattens every piece of site content into one
 * JSON document, `design/content/site-content.json`, that design tooling can
 * consume without touching React, MDX or Vite.
 *
 * It is the "content" half of the content/presentation split the Figma kit is
 * built on: the plugin under design/figma-plugin/ renders *this* document, so
 * the kit and the site read from the same source of truth.
 *
 * Sources, in the order they appear in the output:
 *   src/data/hero.js                 identity, contact, socials
 *   src/theme.js                     theme ids / swatch colours
 *   src/sections/registry.js         home page section order (parsed, not imported — it pulls in JSX)
 *   src/content/about.mdx            about intro paragraphs
 *   src/data/sections/education.js   education timeline
 *   src/content/experience/*.mdx     roles, grouped like ExperienceSection
 *   src/data/sections/skills.js      skill blocks
 *   src/content/pillars/*.mdx        pillars
 *   src/data/skills-detail.js        skills page copy
 *   src/content/projects/*.mdx       projects + full write-ups (as blocks)
 *   src/content/personal.mdx         personal heading + description
 *   src/data/sections/personal/*.js  stats, milestones, favorites, gallery
 *   src/data/travel.js               travel stats, countries, cities
 *   src/seo.js is *not* imported (it imports MDX); route meta is reconstructed
 *   from the same inputs it uses.
 *
 * Strings that live inside components (button labels, section headings, the
 * typing-animation script, map filters…) are collected under `ui`, each tagged
 * with the file it was lifted from. That list doubles as the backlog of copy
 * that has not yet been moved out of JSX.
 *
 * Usage:  node scripts/export-design-content.mjs [--check]
 *   --check  exit 1 if the committed JSON is stale instead of writing it.
 */

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = path.join(REPO_ROOT, "design/content/site-content.json");

const rel = (p) => path.join(REPO_ROOT, p);
const importSrc = (p) => import(pathToFileURL(rel(p)).href);

/* ------------------------------------------------------------------ *
 * Frontmatter + Markdown
 * ------------------------------------------------------------------ */

function parseScalar(raw) {
  const value = raw.trim();
  if (value === "") return "";
  if (/^".*"$/.test(value) || /^'.*'$/.test(value)) return value.slice(1, -1);
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return value;
}

/** Minimal YAML subset: `key: scalar` and `key:` + indented `- item` lists. */
function parseFrontmatter(block) {
  const data = {};
  let listKey = null;

  for (const line of block.split("\n")) {
    if (!line.trim()) continue;
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      data[listKey].push(parseScalar(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (rest.trim() === "") {
      data[key] = [];
      listKey = key;
    } else {
      data[key] = parseScalar(rest);
      listKey = null;
    }
  }
  return data;
}

function splitMdx(source) {
  const m = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { frontmatter: {}, body: source.trim() };
  return { frontmatter: parseFrontmatter(m[1]), body: m[2].trim() };
}

/** Strip inline Markdown so the text can be dropped into a design tool as-is. */
export function plainText(md) {
  return md
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Turns a Markdown/MDX body into an ordered list of blocks the kit can lay out:
 * heading, paragraph, list, divider, callout, embed.
 */
export function markdownToBlocks(body) {
  const blocks = [];
  const lines = body.split("\n");
  let para = [];
  let list = null;

  const flushPara = () => {
    if (para.length) blocks.push({ type: "paragraph", text: plainText(para.join(" ")) });
    para = [];
  };
  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushPara();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length, text: plainText(heading[2]) });
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      flushPara();
      flushList();
      blocks.push({ type: "divider" });
      continue;
    }

    const callout = trimmed.match(/^<Callout\s*([^>]*)>$/);
    if (callout) {
      flushPara();
      flushList();
      const attrs = Object.fromEntries(
        [...callout[1].matchAll(/(\w+)="([^"]*)"/g)].map((a) => [a[1], a[2]])
      );
      const inner = [];
      while (++i < lines.length && !/^<\/Callout>/.test(lines[i].trim())) inner.push(lines[i]);
      blocks.push({
        type: "callout",
        variant: attrs.type ?? "note",
        title: attrs.title ?? null,
        text: plainText(inner.join(" ")),
      });
      continue;
    }

    const embed = trimmed.match(/^<([A-Z]\w*)\s*\/>$/);
    if (embed) {
      flushPara();
      flushList();
      blocks.push({ type: "embed", component: embed[1] });
      continue;
    }

    const item = trimmed.match(/^[-*]\s+(.*)$/);
    if (item) {
      flushPara();
      list = list ?? { type: "list", items: [] };
      list.items.push(plainText(item[1]));
      continue;
    }

    flushList();
    para.push(trimmed);
  }
  flushPara();
  flushList();
  return blocks;
}

async function loadMdxDir(dir) {
  const files = (await readdir(rel(dir))).filter((f) => f.endsWith(".mdx")).sort();
  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(rel(path.join(dir, file)), "utf8");
      const { frontmatter, body } = splitMdx(source);
      return { file: path.posix.join(dir, file), frontmatter, body };
    })
  );
}

function bodyParagraphs(body) {
  return markdownToBlocks(body)
    .filter((b) => b.type === "paragraph")
    .map((b) => b.text);
}

/* ------------------------------------------------------------------ *
 * Sources that are parsed rather than imported (they pull in JSX/React)
 * ------------------------------------------------------------------ */

async function readRegistry() {
  const source = await readFile(rel("src/sections/registry.js"), "utf8");
  return [...source.matchAll(/id:\s*"([^"]+)",\s*label:\s*"([^"]+)"/g)].map((m) => ({
    id: m[1],
    label: m[2],
  }));
}

async function readTypingLines() {
  const source = await readFile(rel("src/components/TypingAnimation.jsx"), "utf8");
  const lines = [...source.matchAll(
    /prefix:\s*"([^"]*)",\s*old:\s*"([^"]*)",\s*new:\s*"([^"]*)",\s*suffix:\s*"([^"]*)"/g
  )].map((m) => ({ prefix: m[1], old: m[2], new: m[3], suffix: m[4] }));
  const num = (name) => Number(source.match(new RegExp(`const ${name} = (\\d+)`))[1]);
  return {
    lines,
    timing: { typeSpeedMs: num("TYPE_SPEED"), pauseMs: num("PAUSE"), strikePauseMs: num("STRIKE_PAUSE") },
  };
}

/** Split the body of a `[ {...}, {...} ]` literal into its top-level object sources. */
function splitObjectLiterals(arrayBody) {
  const entries = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < arrayBody.length; i++) {
    const ch = arrayBody[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        entries.push(arrayBody.slice(start, i + 1));
        start = -1;
      }
    }
  }
  return entries;
}

async function readMapFilters() {
  const source = await readFile(rel("src/sections/TravelMap.jsx"), "utf8");
  const block = source.match(/const FILTERS = \[([\s\S]*?)\n\];/)[1];
  return splitObjectLiterals(block).map((entry) => {
    const codes = entry.match(/codes:\s*\[([\s\S]*?)\]/);
    const center = entry.match(/center:\s*\[([^\]]+)\]/);
    const zoom = entry.match(/zoom:\s*([\d.]+)/);
    return {
      key: entry.match(/key:\s*"(\w+)"/)[1],
      label: entry.match(/label:\s*"([^"]+)"/)[1],
      codes: codes ? codes[1].match(/"(\w+)"/g).map((c) => c.replace(/"/g, "")) : null,
      center: center ? center[1].split(",").map(Number) : null,
      zoom: zoom ? Number(zoom[1]) : null,
    };
  });
}

async function readRegions() {
  const source = await readFile(rel("src/pages/PersonalPage.jsx"), "utf8");
  const block = source.match(/const CONTINENTS = \[([\s\S]*?)\n\];/)[1];
  return [...block.matchAll(/name:\s*"([^"]+)",\s*codes:\s*\[([^\]]+)\]/g)].map((m) => ({
    name: m[1],
    codes: m[2].match(/"(\w+)"/g).map((c) => c.replace(/"/g, "")),
  }));
}

/* ------------------------------------------------------------------ *
 * Build the document
 * ------------------------------------------------------------------ */

export async function buildSiteContent() {
  // The src/data barrels use extensionless imports (fine under Vite, not under
  // plain Node), so the leaf modules are imported directly and the barrel's one
  // piece of logic — the experience group labels — is parsed out of its source.
  const [
    { heroData },
    { THEMES, DEFAULT_THEME },
    { educationDetails },
    { skillBlocks },
    { stats },
    { milestones },
    { favorites },
    { gallery },
    { skillsDetailData },
    { travelData },
    sectionsIndexSource,
  ] = await Promise.all([
    importSrc("src/data/hero.js"),
    importSrc("src/theme.js"),
    importSrc("src/data/sections/education.js"),
    importSrc("src/data/sections/skills.js"),
    importSrc("src/data/sections/personal/stats.js"),
    importSrc("src/data/sections/personal/milestones.js"),
    importSrc("src/data/sections/personal/favorites.js"),
    importSrc("src/data/sections/personal/gallery.js"),
    importSrc("src/data/skills-detail.js"),
    importSrc("src/data/travel.js"),
    readFile(rel("src/data/sections/index.js"), "utf8"),
  ]);
  const experienceGroups = [...sectionsIndexSource.matchAll(/key:\s*"(\w+)",\s*label:\s*"([^"]+)"/g)].map(
    (m) => ({ key: m[1], label: m[2] })
  );
  const sectionData = {
    about: { education: { details: educationDetails } },
    skills: { blocks: skillBlocks },
    personal: { stats, milestones, favorites, gallery },
  };

  const [aboutMdx, personalMdx, experienceMdx, pillarMdx, projectMdx, registry, typing, mapFilters, regions] =
    await Promise.all([
      readFile(rel("src/content/about.mdx"), "utf8"),
      readFile(rel("src/content/personal.mdx"), "utf8"),
      loadMdxDir("src/content/experience"),
      loadMdxDir("src/content/pillars"),
      loadMdxDir("src/content/projects"),
      readRegistry(),
      readTypingLines(),
      readMapFilters(),
      readRegions(),
    ]);

  const personal = splitMdx(personalMdx);
  const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999);

  const roles = experienceMdx
    .map(({ file, frontmatter, body }) => ({
      id: path.basename(file, ".mdx"),
      order: frontmatter.order ?? null,
      group: frontmatter.group,
      date: frontmatter.date,
      title: frontmatter.title,
      company: frontmatter.company,
      skills: frontmatter.skills ?? [],
      link: frontmatter.link ?? null,
      paragraphs: bodyParagraphs(body),
      source: file,
    }))
    .sort(byOrder);

  const pillars = pillarMdx
    .map(({ file, frontmatter, body }) => ({
      id: frontmatter.id,
      order: frontmatter.order,
      title: frontmatter.title,
      subtitle: frontmatter.subtitle,
      icon: frontmatter.icon,
      evidence: frontmatter.evidence ?? [],
      paragraphs: bodyParagraphs(body),
      source: file,
    }))
    .sort(byOrder);

  const projects = projectMdx
    .filter(({ frontmatter }) => frontmatter.slug)
    .map(({ file, frontmatter, body }) => ({
      slug: frontmatter.slug,
      featured: Boolean(frontmatter.featured),
      tag: frontmatter.tag ?? null,
      title: frontmatter.title,
      description: frontmatter.description,
      skills: frontmatter.skills ?? [],
      link: frontmatter.link && frontmatter.link !== "#" ? frontmatter.link : null,
      demo: frontmatter.demo ?? null,
      embed: frontmatter.embed ?? null,
      blocks: markdownToBlocks(body),
      source: file,
    }));

  const siteUrl = "https://jameskidd.info";
  const pageTitle = (h) => `${h} — ${heroData.name}`;

  return {
    $generated:
      "Generated by scripts/export-design-content.mjs (npm run design:content). Do not edit by hand — edit the source files listed in each `source` field.",
    site: {
      name: heroData.name,
      url: siteUrl,
      themes: THEMES.map((t) => ({ ...t, default: t.id === DEFAULT_THEME })),
      defaultTheme: DEFAULT_THEME,
      sections: registry,
    },

    identity: {
      name: heroData.name,
      title: heroData.title,
      tagline: heroData.tagline,
      stack: heroData.stack,
      resumeLink: heroData.resumeLink,
      emails: heroData.emails,
      contactGuidance: Object.entries(heroData.contactGuidance).map(([key, g]) => ({
        key,
        label: g.label,
        text: g.emailKey ? heroData.emails[g.emailKey] : g.text,
        isEmail: Boolean(g.emailKey),
      })),
      socials: heroData.socials,
      source: "src/data/hero.js",
    },

    typing: { ...typing, source: "src/components/TypingAnimation.jsx" },

    about: {
      intro: bodyParagraphs(splitMdx(aboutMdx).body),
      education: sectionData.about.education.details.map((edu) => ({
        school: edu.school,
        degree: edu.degree,
        year: edu.year,
        description: edu.description,
        coursework: edu.coursework.map((c) => ({ code: c.code, name: c.name, url: c.url ?? c.URL ?? null })),
      })),
      source: ["src/content/about.mdx", "src/data/sections/education.js"],
    },

    experience: {
      groups: experienceGroups.map((g) => ({
        ...g,
        roles: roles.filter((r) => r.group === g.key).map((r) => r.id),
      })),
      roles,
      source: ["src/data/sections/index.js", "src/content/experience/*.mdx"],
    },

    skills: {
      headline: skillsDetailData.headline,
      positioning: skillsDetailData.positioning,
      sectionLead: skillsDetailData.sectionLead,
      blocks: sectionData.skills.blocks,
      pillars,
      source: ["src/data/skills-detail.js", "src/data/sections/skills.js", "src/content/pillars/*.mdx"],
    },

    projects,

    personal: {
      title: personal.frontmatter.title,
      instagram: personal.frontmatter.instagram,
      instagramHandle: personal.frontmatter.instagramHandle,
      description: bodyParagraphs(personal.body),
      stats: sectionData.personal.stats,
      milestones: sectionData.personal.milestones,
      favorites: sectionData.personal.favorites,
      gallery: sectionData.personal.gallery.map((img) => ({
        ...img,
        url: `${siteUrl}/${img.src.replace(/^\//, "")}`,
      })),
      source: ["src/content/personal.mdx", "src/data/sections/personal/*.js"],
    },

    travel: {
      stats: travelData.stats,
      countries: travelData.countries,
      cities: travelData.cities,
      mapFilters,
      regions,
      source: ["src/data/travel.js", "src/sections/TravelMap.jsx", "src/pages/PersonalPage.jsx"],
    },

    routes: [
      { path: "/", title: `${heroData.name} — ${heroData.title}` },
      { path: "/skills", title: pageTitle(skillsDetailData.headline) },
      { path: "/personal", title: pageTitle(`${personal.frontmatter.title}: Travel & Photography`) },
      ...projects.map((p) => ({ path: `/projects/${p.slug}`, title: pageTitle(p.title) })),
      { path: "/404", title: pageTitle("Page not found") },
    ],

    // Copy that still lives inside components. Each entry names the file so it
    // can be migrated to src/data or src/content later.
    ui: [
      { key: "hero.resume", text: "Resume", source: "src/sections/HeroSection.jsx" },
      { key: "hero.linkedin", text: "LinkedIn", source: "src/sections/HeroSection.jsx" },
      { key: "hero.swipe", text: "Swipe to explore", source: "src/sections/HeroSection.jsx" },
      { key: "nav.theme", text: "Theme", source: "src/layout/ThemeControls.jsx" },
      { key: "about.educationTitle", text: "Education Timeline", source: "src/sections/AboutSection.jsx" },
      { key: "education.viewDetails", text: "View details", source: "src/sections/components/EducationCard.jsx" },
      { key: "education.hideDetails", text: "Hide details", source: "src/sections/components/EducationCard.jsx" },
      { key: "education.coursework", text: "Key Coursework", source: "src/sections/components/EducationCard.jsx" },
      { key: "experience.viewOrg", text: "View Organization", source: "src/sections/components/ExperienceCard.jsx" },
      { key: "skills.title", text: "Skills & Expertise", source: "src/sections/SkillsSection.jsx" },
      { key: "skills.languages", text: "Languages", source: "src/sections/SkillsSection.jsx" },
      { key: "skills.viewCore", text: "View Core Technologies", source: "src/sections/SkillsSection.jsx" },
      { key: "skillsPage.eyebrow", text: "Skills & Background", source: "src/pages/SkillsPage.jsx" },
      { key: "skillsPage.core", text: "Core Technologies", source: "src/pages/SkillsPage.jsx" },
      { key: "skillsPage.pillars", text: "How I Think About Work", source: "src/pages/SkillsPage.jsx" },
      { key: "projects.title", text: "Selected Projects", source: "src/sections/ProjectsSection.jsx" },
      { key: "projects.empty", text: "This section is being actively curated. Additional projects, technical write-ups, and repositories will be added shortly.", source: "src/sections/ProjectsSection.jsx" },
      { key: "project.featured", text: "Featured", source: "src/sections/components/ProjectCard.jsx" },
      { key: "project.liveDemo", text: "Live Demo", source: "src/sections/components/ProjectCard.jsx" },
      { key: "project.github", text: "GitHub", source: "src/sections/components/ProjectCard.jsx" },
      { key: "project.details", text: "Details", source: "src/sections/components/ProjectCard.jsx" },
      { key: "projectPage.eyebrow", text: "Project", source: "src/pages/ProjectPage.jsx" },
      { key: "projectPage.source", text: "Source Code", source: "src/pages/ProjectPage.jsx" },
      { key: "projectPage.tryIt", text: "Try It", source: "src/pages/ProjectPage.jsx" },
      { key: "personal.quickStats", text: "Quick Stats", source: "src/sections/PersonalSection.jsx" },
      { key: "personal.gallery", text: "Gallery", source: "src/sections/PersonalSection.jsx" },
      { key: "personal.explore", text: "Explore where I've been", source: "src/sections/PersonalSection.jsx" },
      { key: "personalPage.map", text: "Where I've Been", source: "src/pages/PersonalPage.jsx" },
      { key: "personalPage.places", text: "Places", source: "src/pages/PersonalPage.jsx" },
      { key: "personalPage.lifeStory", text: "Life Story", source: "src/pages/PersonalPage.jsx" },
      { key: "personalPage.favorites", text: "Favorites", source: "src/pages/PersonalPage.jsx" },
      { key: "pageShell.back", text: "Home", source: "src/components/PageShell.jsx" },
      { key: "expandToggle.more", text: "View More", source: "src/components/ExpandToggle.jsx" },
      { key: "expandToggle.less", text: "Show Less", source: "src/components/ExpandToggle.jsx" },
      { key: "notFound.eyebrow", text: "404", source: "src/pages/NotFoundPage.jsx" },
      { key: "notFound.title", text: "Page not found", source: "src/pages/NotFoundPage.jsx" },
      { key: "notFound.body", text: "That link points somewhere that does not exist. The pages that do are all one click away.", source: "src/pages/NotFoundPage.jsx" },
      { key: "notFound.cta", text: "Back to home", source: "src/pages/NotFoundPage.jsx" },
    ],
  };
}

export function serialize(doc) {
  return `${JSON.stringify(doc, null, 2)}\n`;
}

async function main() {
  const check = process.argv.includes("--check");
  const output = serialize(await buildSiteContent());

  if (check) {
    const current = await readFile(OUT_FILE, "utf8").catch(() => null);
    if (current !== output) {
      console.error(`design/content/site-content.json is stale — run \`npm run design:content\`.`);
      process.exit(1);
    }
    console.log("design/content/site-content.json is up to date.");
    return;
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, output);
  console.log(`Wrote ${path.relative(REPO_ROOT, OUT_FILE)} (${(output.length / 1024).toFixed(1)} KB)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
