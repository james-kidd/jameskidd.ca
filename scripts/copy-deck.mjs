// scripts/copy-deck.mjs
//
// The copy deck: one page holding every word the site publishes about James,
// in section-registry order, each field keyed by path and pointing at the file
// and line it comes from, with its approval status.
//
//   npm run copy-deck          rewrite docs/copy-deck.md
//   npm run copy-deck:check    fail if docs/copy-deck.md is stale (CI)
//
// Read the deck, then stamp what may go online: `npm run approve -- <path>`.
// Nothing is edited here; change the source named on each line and regenerate.
//
// Sources, in order:
//   hero            src/data/hero.js
//   <registry ids>  src/sections/registry.js decides the order:
//                     experience  src/content/experience/*.md
//                     about       src/content/about.mdx + src/data/sections/education.js
//                     skills      src/data/sections/skills.js
//                     projects    src/content/projects/*.mdx + briefs/*.md
//                     personal    src/content/personal.mdx + src/data/sections/personal/*.js
//   writing         src/content/writing/*.md
//   microcopy       literal strings inside src/**/*.jsx (labels, buttons, alt text)
// src/data/travel.js is generated from photo EXIF and is left out.

import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFrontmatter } from "./lib/frontmatter.mjs";
import {
  CONTENT_EXT,
  STATUS,
  approveCommand,
  isCovered,
  loadApprovals,
  statusFor,
} from "./lib/approval.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = "docs/copy-deck.md";
const CHECK = process.argv.includes("--check");

const LABEL = {
  [STATUS.approved]: "approved",
  [STATUS.changed]: "changed since approval",
  [STATUS.unapproved]: "awaiting approval",
  held: "held (published: false)",
  generated: "generated",
};

// ---------------------------------------------------------------------------
// helpers

function cell(value) {
  return String(value ?? "")
    .replace(/\r?\n+/g, " ")
    .replace(/\|/g, "\\|")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(markdown) {
  const text = String(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/[#>*_`\-[\]()]/g, " ");
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

function paragraphCount(markdown) {
  return String(markdown)
    .trim()
    .split(/\n\s*\n/)
    .filter((block) => block.trim().length > 0).length;
}

/** 1-based line of the first line containing `needle`, searching from `from`. */
function lineOf(text, needle, from = 0) {
  if (!needle) return null;
  const lines = text.split("\n");
  for (let i = from; i < lines.length; i += 1) {
    if (lines[i].includes(needle)) return i + 1;
  }
  return null;
}

function slugOf(file) {
  return basename(file).replace(/\.(mdx|js)$/, "");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function statusLabel(row) {
  if (row.held) return LABEL.held;
  return LABEL[row.status] ?? row.status;
}

async function listFiles(dir, ext) {
  try {
    const entries = await readdir(join(ROOT, dir), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && !/^README\.md$/i.test(entry.name) && (ext instanceof RegExp ? ext.test(entry.name) : entry.name.endsWith(ext)))
      .map((entry) => `${dir}/${entry.name}`)
      .sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function importData(rel) {
  return import(pathToFileURL(join(ROOT, rel)).href);
}

/**
 * Walk a plain data value and yield every string as a (keyPath, text) pair.
 * Arrays of strings join into one line; arrays of objects recurse with the
 * object's own slug (id, code, title, school, label) as the key segment.
 */
function* flatten(value, prefix) {
  if (typeof value === "string") {
    yield { key: prefix, text: value, needle: value };
    return;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    yield { key: prefix, text: String(value), needle: String(value) };
    return;
  }
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      yield { key: prefix, text: value.join(" · "), needle: value[0] ?? "" };
      return;
    }
    for (let index = 0; index < value.length; index += 1) {
      const item = value[index];
      const seg =
        item && typeof item === "object"
          ? slugify(item.id ?? item.code ?? item.key ?? item.title ?? item.school ?? item.label ?? index)
          : String(index);
      yield* flatten(item, `${prefix}.${seg}`);
    }
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, inner] of Object.entries(value)) {
      yield* flatten(inner, `${prefix}.${key}`);
    }
  }
}

// ---------------------------------------------------------------------------
// readers

async function readMdx(rel, approvals) {
  const text = await readFile(join(ROOT, rel), "utf8");
  const { data, content } = readFrontmatter(text);
  const lines = text.split("\n");
  let bodyLine = 1;
  if (lines[0]?.trim() === "---") {
    const close = lines.findIndex((line, i) => i > 0 && line.trim() === "---");
    bodyLine = close >= 0 ? close + 2 : 1;
  }
  const { status, stamp } = isCovered(rel) ? statusFor(rel, text, approvals) : { status: LABEL.generated, stamp: null };
  return {
    rel,
    slug: data.slug ?? slugOf(rel),
    data,
    body: content,
    text,
    bodyLine,
    status,
    stamp,
    held: data.published === false,
  };
}

async function readData(rel, exportName, approvals) {
  const text = await readFile(join(ROOT, rel), "utf8");
  const mod = await importData(rel);
  const { status, stamp } = isCovered(rel) ? statusFor(rel, text, approvals) : { status: LABEL.generated, stamp: null };
  return { rel, value: mod[exportName], text, status, stamp, held: false };
}

function registryOrder(text) {
  const order = [];
  const re = /id:\s*["']([\w-]+)["'][\s\S]*?Component:\s*(\w+)/g;
  let match;
  while ((match = re.exec(text)) !== null) order.push({ id: match[1], component: match[2] });
  return order;
}

// ---------------------------------------------------------------------------
// renderers

function fieldRows(prefix, data, text, { skip = [] } = {}) {
  const rows = [];
  for (const { key, text: value, needle } of flatten(data, prefix)) {
    const last = key.split(".").pop();
    if (skip.includes(last)) continue;
    const probe = needle.length > 60 ? needle.slice(0, 60) : needle;
    rows.push({ key, value, line: lineOf(text, probe) });
  }
  return rows;
}

function renderFieldTable(rows, file) {
  const lines = ["| key | text | source |", "|---|---|---|"];
  for (const row of rows) {
    const src = row.line ? `${basename(file)}:${row.line}` : basename(file);
    lines.push(`| \`${row.key}\` | ${cell(row.value)} | ${src} |`);
  }
  return lines;
}

function renderBody(key, body, file, bodyLine) {
  const trimmed = body.trim();
  if (!trimmed) return [];
  const words = wordCount(trimmed);
  const paragraphs = paragraphCount(trimmed);
  const quoted = trimmed.split("\n").map((line) => (line ? `> ${line}` : ">"));
  return [
    "",
    `**\`${key}.body\`** · ${paragraphs} block${paragraphs === 1 ? "" : "s"}, ${words} words · ${basename(file)}:${bodyLine}`,
    "",
    ...quoted,
  ];
}

function renderMdxItem(sectionId, item, { bodyKey = "body" } = {}) {
  const key = `${sectionId}.${item.slug}`;
  const out = [
    "",
    `### \`${key}\``,
    "",
    `Status: **${statusLabel(item)}**${item.stamp ? ` (${item.stamp.on}, ${item.stamp.by})` : ""} · source: \`${item.rel}\``,
    "",
  ];
  const rows = fieldRows(key, item.data, item.text, { skip: ["published"] });
  if (rows.length > 0) out.push(...renderFieldTable(rows, item.rel));
  if (bodyKey) out.push(...renderBody(key, item.body, item.rel, item.bodyLine));
  return { key, lines: out, words: wordCount(item.body), fields: rows.length };
}

function renderDataItem(key, data, text, rel, status, stamp) {
  const rows = fieldRows(key, data, text);
  return {
    key,
    fields: rows.length,
    words: rows.reduce((sum, row) => sum + wordCount(row.value), 0),
    lines: [
      "",
      `### \`${key}\``,
      "",
      `Status: **${LABEL[status] ?? status}**${stamp ? ` (${stamp.on}, ${stamp.by})` : ""} · source: \`${rel}\``,
      "",
      ...renderFieldTable(rows, rel),
    ],
  };
}

// ---------------------------------------------------------------------------
// microcopy: literal strings inside JSX

async function walkJsx(dir) {
  const out = [];
  const entries = await readdir(join(ROOT, dir), { withFileTypes: true });
  for (const entry of entries) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...(await walkJsx(rel)));
    else if (entry.name.endsWith(".jsx")) out.push(rel);
  }
  return out.sort();
}

const TEXT_NODE = />\s*([^<>{}]*[A-Za-z][^<>{}]*?)\s*</g;
const TEXT_ATTR = /\b(aria-label|title|alt|placeholder)=["']([^"'{}]+)["']/g;
const TEMPLATE_HOLE = /\$\{[^}]*\}/;

/** Drop block and line comments so prose in them is not mistaken for copy. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/^\s*\/\/.*$/gm, (m) => " ".repeat(m.length));
}

function microcopyIn(source) {
  const text = stripComments(source);
  const found = new Map();
  const add = (raw, index) => {
    const value = raw.replace(/\s+/g, " ").trim();
    if (value.length < 2 || TEMPLATE_HOLE.test(value)) return;
    if (!/[A-Za-z]{2,}/.test(value)) return;
    if (!found.has(value)) found.set(value, text.slice(0, index).split("\n").length);
  };
  let match;
  while ((match = TEXT_NODE.exec(text)) !== null) add(match[1], match.index);
  while ((match = TEXT_ATTR.exec(text)) !== null) add(match[2], match.index);
  return [...found.entries()].map(([value, line]) => ({ value, line }));
}

async function renderMicrocopy() {
  const files = await walkJsx("src");
  const lines = [
    "",
    "## microcopy",
    "",
    "Literal strings inside the components: labels, buttons, alt text, empty states. Found by pattern, so treat as a checklist rather than a guarantee. Edit the component to change one.",
    "",
    "| component | text | source |",
    "|---|---|---|",
  ];
  let count = 0;
  for (const file of files) {
    const text = await readFile(join(ROOT, file), "utf8");
    for (const { value, line } of microcopyIn(text)) {
      lines.push(`| \`${slugOf(file)}\` | ${cell(value)} | ${basename(file)}:${line} |`);
      count += 1;
    }
  }
  return { lines, count };
}

// ---------------------------------------------------------------------------
// main

async function buildDeck() {
  const approvals = await loadApprovals(ROOT);
  const sections = [];
  const items = [];

  const addItem = (item) => {
    items.push(item);
    return item.lines;
  };

  // hero
  {
    const hero = await readData("src/data/hero.js", "heroData", approvals);
    sections.push(["", "## hero", "", "`src/data/hero.js`, rendered by `src/sections/HeroSection.jsx` and `src/layout/IdentityBlock.jsx`."]);
    sections.push(addItem({ ...renderDataItem("hero", hero.value, hero.text, hero.rel, hero.status, hero.stamp), rel: hero.rel, status: hero.status, held: false }));
  }

  const registry = registryOrder(await readFile(join(ROOT, "src/sections/registry.js"), "utf8"));

  for (const { id, component } of registry) {
    const header = ["", `## ${id}`, ""];

    if (id === "experience") {
      header.push(`\`src/content/experience/*.mdx\`, rendered by \`${component}\` through \`ExperienceCard\`. Sorted by \`order\` within each group.`);
      sections.push(header);
      const files = await listFiles("src/content/experience", CONTENT_EXT);
      const entries = [];
      for (const file of files) entries.push(await readMdx(file, approvals));
      entries.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
      for (const entry of entries) {
        const rendered = renderMdxItem(id, entry);
        sections.push(addItem({ ...rendered, rel: entry.rel, status: entry.status, held: entry.held }));
      }
    } else if (id === "about") {
      header.push(`\`src/content/about.mdx\` and \`src/data/sections/education.js\`, rendered by \`${component}\`.`);
      sections.push(header);
      const about = await readMdx("src/content/about.mdx", approvals);
      about.slug = "intro";
      sections.push(addItem({ ...renderMdxItem(id, about), rel: about.rel, status: about.status, held: false }));
      const education = await readData("src/data/sections/education.js", "educationDetails", approvals);
      sections.push(addItem({ ...renderDataItem("about.education", education.value, education.text, education.rel, education.status, education.stamp), rel: education.rel, status: education.status, held: false }));
    } else if (id === "skills") {
      header.push(`\`src/data/sections/skills.js\`, rendered by \`${component}\` through \`SkillCard\`.`);
      sections.push(header);
      const skills = await readData("src/data/sections/skills.js", "skillBlocks", approvals);
      sections.push(addItem({ ...renderDataItem("skills", skills.value, skills.text, skills.rel, skills.status, skills.stamp), rel: skills.rel, status: skills.status, held: false }));
    } else if (id === "projects") {
      header.push(`\`src/content/projects/*.mdx\` (the site's record: card and page header, optional write-up) and \`src/content/projects/briefs/*.md\` (each project's own read-me, plain Markdown synced from its repo), rendered by \`${component}\` and \`src/pages/ProjectPage.jsx\`.`);
      sections.push(header);
      for (const file of await listFiles("src/content/projects", CONTENT_EXT)) {
        const entry = await readMdx(file, approvals);
        sections.push(addItem({ ...renderMdxItem(id, entry), rel: entry.rel, status: entry.status, held: entry.held }));
      }
      const briefs = await listFiles("src/content/projects/briefs", CONTENT_EXT);
      for (const file of briefs) {
        const entry = await readMdx(file, approvals);
        const rendered = renderMdxItem("projects.brief", entry);
        sections.push(addItem({ ...rendered, rel: entry.rel, status: entry.status, held: entry.held }));
      }
      if (briefs.length === 0) sections.push(["", "_No project briefs synced yet (`npm run sync-briefs`, see `docs/project-brief.md`)._"]);
    } else if (id === "personal") {
      header.push(`\`src/content/personal.mdx\` and \`src/data/sections/personal/*.js\`, rendered by \`${component}\` and \`src/pages/PersonalPage.jsx\`. Travel counters come from the generated \`src/data/travel.js\` and are not listed.`);
      sections.push(header);
      const personal = await readMdx("src/content/personal.mdx", approvals);
      personal.slug = "intro";
      sections.push(addItem({ ...renderMdxItem(id, personal), rel: personal.rel, status: personal.status, held: false }));
      for (const [file, exportName, key] of [
        ["src/data/sections/personal/stats.js", "stats", "personal.stats"],
        ["src/data/sections/personal/milestones.js", "milestones", "personal.milestones"],
        ["src/data/sections/personal/favorites.js", "favorites", "personal.favorites"],
        ["src/data/sections/personal/gallery.js", "gallery", "personal.gallery"],
      ]) {
        const data = await readData(file, exportName, approvals);
        sections.push(addItem({ ...renderDataItem(key, data.value, data.text, data.rel, data.status, data.stamp), rel: data.rel, status: data.status, held: false }));
      }
    } else {
      header.push(`Rendered by \`${component}\`. No content source registered in scripts/copy-deck.mjs for this section.`);
      sections.push(header);
    }
  }

  // writing
  {
    const files = await listFiles("src/content/writing", CONTENT_EXT);
    sections.push(["", "## writing", "", "`src/content/writing/*.md`, exported from the vault (`docs/writing.md`)."]);
    if (files.length === 0) sections.push(["", "_No articles yet._"]);
    for (const file of files) {
      const entry = await readMdx(file, approvals);
      sections.push(addItem({ ...renderMdxItem("writing", entry), rel: entry.rel, status: entry.status, held: entry.held }));
    }
  }

  const micro = await renderMicrocopy();

  // review queue
  const queue = items.filter((item) => !item.held && item.status !== STATUS.approved && item.status !== LABEL.generated);
  const byFile = [...new Set(queue.map((item) => item.rel))];
  const totalWords = items.reduce((sum, item) => sum + (item.words ?? 0), 0);
  const totalFields = items.reduce((sum, item) => sum + (item.fields ?? 0), 0);

  const head = [
    "# Copy deck",
    "",
    "Every word the site publishes about James, in section-registry order, keyed by path with its source file and line and its approval status. Generated by `npm run copy-deck`; `npm run copy-deck:check` fails CI when this file is stale. Do not edit here: change the source named on each line and regenerate.",
    "",
    `Approval: \`requireApproval\` is **${approvals.requireApproval}**. ${approvals.requireApproval ? "An item goes online only once its file carries a matching stamp in `content.approvals.json`. Experience, projects, briefs and writing without one are held offline; hero, about, skills and personal without one fail the build." : "Stamps are recorded but not enforced."}`,
    "",
    `Totals: ${items.length} items, ${totalFields} fields, ${totalWords} words of prose, ${micro.count} microcopy strings.`,
    "",
    "## Review queue",
    "",
  ];
  if (byFile.length === 0) {
    head.push("Nothing waiting: every covered file is approved.");
  } else {
    head.push(`${byFile.length} file(s) are not approved as they stand. Read each one below, then stamp it:`, "", "```");
    for (const rel of byFile) head.push(approveCommand([rel]));
    head.push("```", "", "Or, after reading the whole deck: `npm run approve -- --all`.");
  }

  const held = items.filter((item) => item.held);
  if (held.length > 0) {
    head.push("", `Held by \`published: false\` (not on the site, no stamp needed): ${held.map((item) => `\`${item.key}\``).join(", ")}.`);
  }

  return [...head, ...sections.flat(), ...micro.lines, ""].join("\n");
}

async function main() {
  const deck = await buildDeck();
  const outPath = join(ROOT, OUT);

  if (CHECK) {
    let current = null;
    try {
      current = await readFile(outPath, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (current === deck) {
      console.log(`copy-deck: ${OUT} is up to date`);
      return;
    }
    console.error(`copy-deck: ${OUT} is stale. Run \`npm run copy-deck\` and commit the result.`);
    process.exitCode = 1;
    return;
  }

  await writeFile(outPath, deck, "utf8");
  console.log(`copy-deck: wrote ${OUT}`);
}

main().catch((error) => {
  console.error(`copy-deck: ${error.message}`);
  process.exitCode = 1;
});
