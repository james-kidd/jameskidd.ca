// scripts/approve.mjs
//
// Stamp content as approved for publication. James runs this after reading
// docs/copy-deck.md (or the file itself); nothing else writes
// content.approvals.json.
//
//   npm run approve -- --list                      status of every covered file
//   npm run approve -- experience/codejam          stamp one file (any unique part of its path)
//   npm run approve -- src/content/about.mdx src/data/hero.js
//   npm run approve -- --all                       stamp everything unapproved or changed
//   npm run approve -- --by "James Kidd" ...       override the name on the stamp
//
// A stamp records the sha of the file's exact text. Editing the file breaks
// the stamp, and the item is held offline again until it is re-stamped.

import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  APPROVALS_FILE,
  STATUS,
  approvalReport,
  loadApprovals,
} from "./lib/approval.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const args = { paths: [], all: false, list: false, by: null, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--list") args.list = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--by") {
      args.by = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--")) throw new Error(`unknown flag ${arg}`);
    else args.paths.push(arg);
  }
  return args;
}

function gitUserName() {
  try {
    return execFileSync("git", ["config", "user.name"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function today() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function resolvePath(query, rows) {
  const exact = rows.find((row) => row.path === query);
  if (exact) return exact;
  const matches = rows.filter((row) => row.path.includes(query));
  if (matches.length === 1) return matches[0];
  if (matches.length === 0) {
    throw new Error(`"${query}" matches no covered file. Try --list.`);
  }
  throw new Error(
    `"${query}" is ambiguous:\n${matches.map((row) => `  ${row.path}`).join("\n")}`
  );
}

function printList(rows, stale, requireApproval) {
  const width = Math.max(...rows.map((row) => row.path.length));
  console.log(`requireApproval: ${requireApproval}\n`);
  for (const row of rows) {
    const note =
      row.status === STATUS.approved
        ? `approved ${row.stamp.on} by ${row.stamp.by}`
        : row.status === STATUS.changed
          ? `CHANGED since ${row.stamp.on} (${row.kind})`
          : `UNAPPROVED (${row.kind})`;
    console.log(`${row.path.padEnd(width)}  ${note}`);
  }
  if (stale.length > 0) {
    console.log(`\nstamps with no file on disk (removed on the next stamp):`);
    for (const path of stale) console.log(`  ${path}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || (!args.list && !args.all && args.paths.length === 0)) {
    console.log(
      [
        "usage: npm run approve -- [--list] [--all] [--by NAME] [path ...]",
        "",
        "  --list   show the status of every covered file",
        "  --all    stamp every file that is unapproved or changed",
        "  path     any unique part of a covered file's path",
      ].join("\n")
    );
    process.exitCode = args.help ? 0 : 1;
    return;
  }

  const approvals = await loadApprovals(ROOT);
  const { rows, stale } = await approvalReport(ROOT, approvals);

  if (args.list) {
    printList(rows, stale, approvals.requireApproval);
    return;
  }

  const by = args.by || gitUserName() || process.env.USER;
  if (!by) throw new Error("no name for the stamp: pass --by \"Your Name\"");
  const on = today();

  const targets = args.all
    ? rows.filter((row) => row.status !== STATUS.approved)
    : args.paths.map((query) => resolvePath(query, rows));

  if (targets.length === 0) {
    console.log("nothing to stamp: every covered file is already approved.");
    return;
  }

  const items = { ...approvals.items };
  for (const path of stale) delete items[path];
  for (const row of targets) {
    items[row.path] = { sha: row.sha, by, on };
    console.log(`approved  ${row.path}  (${row.sha}, ${on}, ${by})`);
  }
  if (stale.length > 0) console.log(`removed ${stale.length} stamp(s) with no file on disk`);

  const next = {
    ...approvals,
    items: Object.fromEntries(Object.entries(items).sort(([a], [b]) => a.localeCompare(b))),
  };
  await writeFile(join(ROOT, APPROVALS_FILE), `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`\n${APPROVALS_FILE} updated. Run \`npm run copy-deck\` to refresh the deck.`);
}

main().catch((error) => {
  console.error(`approve: ${error.message}`);
  process.exitCode = 1;
});
