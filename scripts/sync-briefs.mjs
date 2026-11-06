// scripts/sync-briefs.mjs
//
// Project page briefs: each project repo owns a short read-me for this site
// (docs/project-brief.md is the contract). This script fetches every brief
// listed in briefs.config.json, validates it against
// schemas/project-brief.schema.json and the body rules, compiles it as MDX so
// a bad brief fails here rather than inside the Vite build, and snapshots it
// into src/content/projects/briefs/<slug>.md (plain Markdown, never MDX). The build stays offline and
// deterministic; the snapshot goes online only once James stamps it
// (docs/approvals.md).
//
//   npm run sync-briefs                      fetch, validate, write all (atomic: one bad brief, nothing written)
//   npm run sync-briefs:check                offline: validate the committed snapshots (CI)
//   node scripts/sync-briefs.mjs --from-file ../bynumber/docs/jameskidd.info.md --slug paint-by-number
//                                            dev override: read a local file instead of fetching
//
// Private repos: set GITHUB_BRIEFS_TOKEN (fine-grained token, contents: read).

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { compile } from "@mdx-js/mdx";
import { readFrontmatter, writeFrontmatter } from "./lib/frontmatter.mjs";
import remarkGfm from "remark-gfm";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = "briefs.config.json";
const PROJECTS_DIR = "src/content/projects";
const DEFAULT_PATH = "docs/jameskidd.info.md";
const DEFAULT_REF = "main";
const MAX_WORDS = 350;
const FETCH_RETRIES = 3;

// ---------------------------------------------------------------------------
// args and config

function parseArgs(argv) {
  const args = { check: false, fromFile: null, slug: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--check") args.check = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--from-file") {
      args.fromFile = argv[i + 1];
      i += 1;
    } else if (arg === "--slug") {
      args.slug = argv[i + 1];
      i += 1;
    } else throw new Error(`unknown argument ${arg}`);
  }
  if ((args.fromFile && !args.slug) || (!args.fromFile && args.slug)) {
    throw new Error("--from-file and --slug go together");
  }
  return args;
}

async function loadConfig() {
  const data = JSON.parse(await readFile(join(ROOT, CONFIG), "utf8"));
  if (typeof data.outDir !== "string" || !data.outDir) throw new Error(`${CONFIG}: "outDir" is required`);
  if (!Array.isArray(data.briefs)) throw new Error(`${CONFIG}: "briefs" must be an array`);
  const seen = new Set();
  for (const brief of data.briefs) {
    if (!brief.slug || !brief.repo) throw new Error(`${CONFIG}: every brief needs "slug" and "repo"`);
    if (!/^[\w.-]+\/[\w.-]+$/.test(brief.repo)) throw new Error(`${CONFIG}: "repo" must be owner/name, got ${brief.repo}`);
    if (seen.has(brief.slug)) throw new Error(`${CONFIG}: duplicate slug ${brief.slug}`);
    seen.add(brief.slug);
  }
  return data;
}

// ---------------------------------------------------------------------------
// validation

async function loadValidator() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const schema = JSON.parse(await readFile(join(ROOT, "schemas", "project-brief.schema.json"), "utf8"));
  return ajv.compile(schema);
}

async function siteProjectSlugs() {
  const entries = await readdir(join(ROOT, PROJECTS_DIR), { withFileTypes: true });
  const slugs = new Set();
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
    const { data } = readFrontmatter(await readFile(join(ROOT, PROJECTS_DIR, entry.name), "utf8"));
    if (data.slug) slugs.add(data.slug);
  }
  return slugs;
}

function stripCode(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, " ").replace(/`[^`\n]*`/g, " ");
}

function wordCount(markdown) {
  return stripCode(markdown)
    .replace(/[#>*_\-[\]()!]/g, " ")
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

/** The body rules from docs/project-brief.md, as messages. */
export function bodyProblems(body) {
  const problems = [];
  const prose = stripCode(body);
  if (!body.trim()) problems.push("body is empty");
  if (/<!--/.test(prose)) problems.push("HTML comments are not allowed");
  if (/<\/?[A-Za-z]/.test(prose)) problems.push("HTML and JSX tags are not allowed; write Markdown");
  if (/[{}]/.test(prose)) problems.push("braces are not allowed outside code (MDX reads them as expressions)");
  if (/!\[\[|\[\[/.test(prose)) problems.push("wiki links and embeds are not allowed; use absolute URLs");
  if (/^#\s/m.test(prose)) problems.push("no top-level heading: the site renders the title; use ## and ###");
  const relative = [...prose.matchAll(/!?\[[^\]]*\]\(([^)\s]+)/g)]
    .map((m) => m[1])
    .filter((target) => !/^(https?:\/\/|mailto:|#)/.test(target));
  if (relative.length > 0) problems.push(`links must be absolute URLs, found: ${relative.join(", ")}`);
  const words = wordCount(body);
  if (words > MAX_WORDS) problems.push(`body is ${words} words; the limit is ${MAX_WORDS}`);
  return problems;
}

async function compileProblems(body) {
  try {
    await compile(body, { format: "md", remarkPlugins: [remarkGfm] });
    return [];
  } catch (error) {
    return [`does not compile as MDX: ${error.message}`];
  }
}

function formatError(error) {
  const where = error.instancePath ? error.instancePath.replace(/^\//, "").replace(/\//g, ".") : "(root)";
  const extra = error.params?.additionalProperty
    ? ` "${error.params.additionalProperty}"`
    : error.params?.allowedValues
      ? ` (one of ${error.params.allowedValues.join(", ")})`
      : "";
  return `${where}: ${error.message}${extra}`;
}

/**
 * Validate one brief (raw Markdown) for `expectedSlug`.
 * Returns { data, body, problems }.
 */
export async function validateBrief(raw, expectedSlug, { validate, slugs, snapshot = false }) {
  const { data, content } = readFrontmatter(raw);
  const problems = [];

  const frontmatter = { ...data };
  if (snapshot) delete frontmatter.source;
  if (!validate(frontmatter)) {
    problems.push(...validate.errors.map((e) => `frontmatter ${formatError(e)}`));
  }
  if (data.slug && data.slug !== expectedSlug) {
    problems.push(`frontmatter slug is "${data.slug}" but the site expects "${expectedSlug}"`);
  }
  if (!slugs.has(expectedSlug)) {
    problems.push(`no site project record for "${expectedSlug}": add ${PROJECTS_DIR}/${expectedSlug}.mdx first`);
  }
  if (!snapshot && "source" in data) {
    problems.push(`frontmatter "source" is set by the sync, not by the project`);
  }
  problems.push(...bodyProblems(content));
  if (problems.length === 0) problems.push(...(await compileProblems(content)));
  return { data, body: content, problems };
}

// ---------------------------------------------------------------------------
// fetch and write

function rawUrl({ repo, path = DEFAULT_PATH, ref = DEFAULT_REF }) {
  return `https://raw.githubusercontent.com/${repo}/${ref}/${path}`;
}

async function fetchBrief(brief) {
  const url = rawUrl(brief);
  const headers = { Accept: "text/plain" };
  if (process.env.GITHUB_BRIEFS_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_BRIEFS_TOKEN}`;
  let lastError = null;
  for (let attempt = 1; attempt <= FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, { headers });
      if (response.status === 404) {
        throw new Error(`404 at ${url}. The repo has no brief there yet, or it is private and GITHUB_BRIEFS_TOKEN is unset.`);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status} at ${url}`);
      return { url, text: await response.text() };
    } catch (error) {
      lastError = error;
      if (error.message.startsWith("404")) break;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  throw lastError;
}

function renderSnapshot(data, body, source) {
  const frontmatter = { ...data, source };
  const header = [
    "<!-- GENERATED by scripts/sync-briefs.mjs from the project's own repo. Do not edit here:",
    `     change ${source} and run \`npm run sync-briefs\`. -->`,
  ].join("\n");
  return writeFrontmatter(`\n${header}\n\n${body.trim()}\n`, frontmatter);
}

async function listSnapshots(outDir) {
  try {
    const entries = await readdir(join(ROOT, outDir), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// ---------------------------------------------------------------------------
// main

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("usage: node scripts/sync-briefs.mjs [--check] [--from-file FILE --slug SLUG]");
    return;
  }

  const config = await loadConfig();
  const validate = await loadValidator();
  const slugs = await siteProjectSlugs();
  const context = { validate, slugs };

  if (args.check) {
    const files = await listSnapshots(config.outDir);
    const failures = [];
    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const raw = await readFile(join(ROOT, config.outDir, file), "utf8");
      const { problems } = await validateBrief(raw, slug, { ...context, snapshot: true });
      if (problems.length > 0) failures.push(`${config.outDir}/${file}:\n${problems.map((p) => `    ${p}`).join("\n")}`);
    }
    const listed = new Set(config.briefs.map((brief) => `${brief.slug}.md`));
    for (const file of files) {
      if (!listed.has(file)) failures.push(`${config.outDir}/${file} has no entry in ${CONFIG}; delete the snapshot or list the repo`);
    }
    if (failures.length > 0) {
      console.error(`sync-briefs: ${failures.length} problem(s):\n${failures.map((f) => `- ${f}`).join("\n")}`);
      process.exitCode = 1;
      return;
    }
    console.log(`sync-briefs: ${files.length} snapshot(s) valid`);
    return;
  }

  const jobs = args.fromFile
    ? [{ slug: args.slug, read: async () => ({ url: pathToFileURL(resolve(ROOT, args.fromFile)).href, text: await readFile(resolve(ROOT, args.fromFile), "utf8") }) }]
    : config.briefs.map((brief) => ({ slug: brief.slug, source: rawUrl(brief), read: () => fetchBrief(brief) }));

  if (jobs.length === 0) {
    console.log(`sync-briefs: no briefs listed in ${CONFIG}; nothing to do`);
    return;
  }

  const results = [];
  const failures = [];
  for (const job of jobs) {
    try {
      const { url, text } = await job.read();
      const { data, body, problems } = await validateBrief(text, job.slug, context);
      if (problems.length > 0) {
        failures.push(`${job.slug} (${url}):\n${problems.map((p) => `    ${p}`).join("\n")}`);
        continue;
      }
      results.push({ slug: job.slug, snapshot: renderSnapshot(data, body, url) });
    } catch (error) {
      failures.push(`${job.slug}: ${error.message}`);
    }
  }

  if (failures.length > 0) {
    console.error(`sync-briefs: nothing written. ${failures.length} brief(s) failed:\n${failures.map((f) => `- ${f}`).join("\n")}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(join(ROOT, config.outDir), { recursive: true });
  for (const { slug, snapshot } of results) {
    const out = join(config.outDir, `${slug}.md`);
    await writeFile(join(ROOT, out), snapshot, "utf8");
    console.log(`sync-briefs: wrote ${out}`);
  }
  console.log(`sync-briefs: ${results.length} brief(s) snapshotted. They go online once stamped: npm run approve -- ${results.map((r) => `${config.outDir}/${r.slug}.md`).join(" ")}`);
}

main().catch((error) => {
  console.error(`sync-briefs: ${error.message}`);
  process.exitCode = 1;
});
