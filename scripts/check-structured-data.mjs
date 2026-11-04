#!/usr/bin/env node
// scripts/check-structured-data.mjs
//
// Checks the schema.org JSON-LD that scripts/prerender.js wrote into dist/.
// Runs at the end of `npm run build`; run it alone with `npm run check:schema`.
//
// It reads every prerendered HTML file and reports, all at once:
//   - JSON-LD that does not parse
//   - a missing @context / @graph, or a node without @type
//   - "@id" references that point at nothing in the same page's graph
//   - required properties missing for the types we emit
//   - indexable pages without JSON-LD, or the 404 page with JSON-LD
// It exits 1 if anything is wrong, after printing every problem it found.

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const JSON_LD = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;

/** The properties a node of each type must carry to be useful. */
const REQUIRED = {
  WebSite: ["@id", "url", "name"],
  Person: ["@id", "name", "url"],
  ProfilePage: ["@id", "url", "name", "mainEntity"],
  WebPage: ["@id", "url", "name"],
  CreativeWork: ["name", "url", "author"],
  SoftwareSourceCode: ["name", "url", "author", "codeRepository"],
  ItemList: ["itemListElement"],
  BreadcrumbList: ["itemListElement"],
  ImageGallery: ["image"],
};

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return htmlFiles(path);
      return entry.name.endsWith(".html") ? [path] : [];
    })
  );
  return nested.flat();
}

/** Every {"@id": ...} object that is a pure reference (no other keys). */
function references(value, found = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => references(item, found));
  } else if (value && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === "@id") found.push(value["@id"]);
    else keys.forEach((key) => references(value[key], found));
  }
  return found;
}

function checkGraph(doc) {
  const problems = [];
  if (doc["@context"] !== "https://schema.org") problems.push('@context is not "https://schema.org"');
  if (!Array.isArray(doc["@graph"])) return [...problems, "@graph is missing or not an array"];

  const ids = new Set(doc["@graph"].map((node) => node["@id"]).filter(Boolean));

  for (const node of doc["@graph"]) {
    const type = node["@type"];
    if (!type) {
      problems.push(`node without @type: ${JSON.stringify(node).slice(0, 80)}`);
      continue;
    }
    for (const key of REQUIRED[type] ?? []) {
      if (node[key] === undefined) problems.push(`${type} is missing "${key}"`);
    }
  }

  for (const id of references(doc["@graph"])) {
    if (!ids.has(id)) problems.push(`reference to unknown @id ${id}`);
  }

  return problems;
}

async function checkFile(file) {
  const html = await readFile(file, "utf8");
  const blocks = [...html.matchAll(JSON_LD)].map((match) => match[1]);
  const isNotFound = /noindex/.test(html);
  const problems = [];

  if (isNotFound && blocks.length > 0) problems.push("noindex page carries JSON-LD");
  if (!isNotFound && blocks.length === 0) problems.push("indexable page has no JSON-LD");

  let nodes = 0;
  for (const block of blocks) {
    try {
      const doc = JSON.parse(block);
      nodes += doc["@graph"]?.length ?? 0;
      problems.push(...checkGraph(doc));
    } catch (error) {
      problems.push(`JSON-LD does not parse: ${error.message}`);
    }
  }

  return { file: relative(ROOT, file), nodes, problems };
}

async function main() {
  const files = await htmlFiles(DIST).catch(() => []);
  if (files.length === 0) {
    console.error("check:schema: no HTML in dist/ — run `npm run build` first.");
    process.exitCode = 1;
    return;
  }

  const results = await Promise.all(files.map(checkFile));
  const failed = results.filter((result) => result.problems.length > 0);

  for (const { file, nodes, problems } of results) {
    const status = problems.length ? "FAIL" : "ok  ";
    console.log(`${status} ${file} (${nodes} nodes)`);
    problems.forEach((problem) => console.log(`       - ${problem}`));
  }

  console.log(`check:schema: ${results.length - failed.length}/${results.length} page(s) passed`);
  if (failed.length > 0) process.exitCode = 1;
}

main();
