// scripts/check-content.mjs
//
// The content gate, run by `prebuild` and by CI:
//
//   1. every content file's (.md or .mdx) frontmatter validates against its JSON Schema in
//      schemas/ (one schema per content type; the schema names the
//      schema.org type the item becomes);
//   2. content.approvals.json parses and every stamp points at a file;
//   3. with requireApproval: true, every structural file (hero.js, the data
//      slices, about.mdx, personal.mdx) carries a matching stamp. Collection
//      items without one are reported as held offline, which is not a failure:
//      the Vite build drops them (src/content/mdxCollection.js).
//
//   node scripts/check-content.mjs            fail on any problem
//   node scripts/check-content.mjs --report   print the report, never fail (predev)

import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFrontmatter } from "./lib/frontmatter.mjs";
import {
  STATUS,
  approvalReport,
  approveCommand,
  loadApprovals,
} from "./lib/approval.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPORT_ONLY = process.argv.includes("--report");

/** Content directory to the schema that every .mdx file in it must satisfy. */
export const SCHEMA_FOR_DIR = {
  "src/content/experience": "experience",
  "src/content/projects": "project",
  "src/content/projects/briefs": "project-brief",
  "src/content/writing": "article",
};

async function listMdx(dir) {
  try {
    const entries = await readdir(join(ROOT, dir), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name) && !/^README\.md$/i.test(entry.name))
      .map((entry) => `${dir}/${entry.name}`)
      .sort();
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

export async function loadSchema(name) {
  const raw = await readFile(join(ROOT, "schemas", `${name}.schema.json`), "utf8");
  return JSON.parse(raw);
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

export async function validateFrontmatter() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const problems = [];
  let checked = 0;

  for (const [dir, schemaName] of Object.entries(SCHEMA_FOR_DIR)) {
    const files = await listMdx(dir);
    if (files.length === 0) continue;
    const validate = ajv.compile(await loadSchema(schemaName));
    for (const file of files) {
      const { data } = readFrontmatter(await readFile(join(ROOT, file), "utf8"));
      checked += 1;
      if (!validate(data)) {
        problems.push(`${file} (schema ${schemaName}):\n${validate.errors.map((e) => `    ${formatError(e)}`).join("\n")}`);
      }
    }
  }
  return { checked, problems };
}

async function main() {
  const failures = [];

  const { checked, problems } = await validateFrontmatter();
  console.log(`check-content: ${checked} content file(s) checked against schemas/`);
  for (const problem of problems) {
    failures.push(`frontmatter: ${problem}`);
  }

  const approvals = await loadApprovals(ROOT);
  const { rows, stale } = await approvalReport(ROOT, approvals);
  const approved = rows.filter((row) => row.status === STATUS.approved);
  const heldCollection = rows.filter((row) => row.kind === "collection" && row.status !== STATUS.approved);
  const blockedStructural = rows.filter((row) => row.kind === "structural" && row.status !== STATUS.approved);

  console.log(
    `check-content: requireApproval=${approvals.requireApproval}; ${approved.length}/${rows.length} covered file(s) approved`
  );
  if (stale.length > 0) {
    console.warn(`check-content: ${stale.length} stamp(s) point at no file: ${stale.join(", ")}`);
  }
  if (heldCollection.length > 0) {
    const verb = approvals.requireApproval ? "held offline until approved" : "unapproved (published anyway: requireApproval is false)";
    console.log(`check-content: ${heldCollection.length} item(s) ${verb}:`);
    for (const row of heldCollection) console.log(`  ${row.status.padEnd(10)} ${row.path}`);
  }
  if (blockedStructural.length > 0) {
    const lines = blockedStructural.map((row) => `  ${row.status.padEnd(10)} ${row.path}`);
    if (approvals.requireApproval) {
      failures.push(
        `structural content is not approved, and it cannot be dropped from the site:\n${lines.join("\n")}\n  Read it, then stamp it: ${approveCommand(blockedStructural.map((row) => row.path))}`
      );
    } else {
      console.log(`check-content: structural files unapproved (allowed, requireApproval is false):\n${lines.join("\n")}`);
    }
  }

  if (failures.length > 0) {
    const banner = REPORT_ONLY ? "check-content (report only, would fail the build):" : "check-content FAILED:";
    console.error(`\n${banner}\n${failures.map((f) => `- ${f}`).join("\n")}`);
    if (!REPORT_ONLY) process.exitCode = 1;
    return;
  }
  console.log("check-content: ok");
}

main().catch((error) => {
  console.error(`check-content: ${error.message}`);
  process.exitCode = 1;
});
