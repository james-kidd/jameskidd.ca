// scripts/lib/approval.mjs
//
// Approval stamps: the gate between "intended" and "online".
//
// Every file that carries words about James (the Markdown and MDX content
// files and the data slices) is covered. A stamp in content.approvals.json binds a file path to
// the sha of its exact text. The build reads the stamps:
//
//   - a collection item (experience/*, projects/*, projects/briefs/*,
//     writing/*) that is not approved is dropped from the site, the same way
//     `published: false` drops it. The file stays in the repo as the record of
//     what is intended.
//   - a structural file (hero.js, the data slices, about.mdx, personal.mdx)
//     that is not approved fails the build, because it cannot be dropped.
//
// Any edit changes the sha, so the stamp stops matching and the item goes back
// to "changed" until it is stamped again: `npm run approve -- <path>`.
//
// Shared by scripts/approve.mjs, scripts/check-content.mjs,
// scripts/copy-deck.mjs and the remark plugin that the Vite build runs.

import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

export const APPROVALS_FILE = "content.approvals.json";

/** Directories whose items can be dropped one by one. */
export const COLLECTION_DIRS = [
  "src/content/experience",
  "src/content/projects",
  "src/content/projects/briefs",
  "src/content/writing",
];

/** Files that cannot be dropped: the build fails if one is unapproved. */
export const STRUCTURAL_FILES = [
  "src/content/about.mdx",
  "src/content/personal.mdx",
  "src/data/hero.js",
];
export const STRUCTURAL_DIRS = ["src/data/sections"];
const STRUCTURAL_EXCLUDE = /(^|\/)index\.js$/; // barrels hold no words

export const STATUS = {
  approved: "approved",
  changed: "changed",
  unapproved: "unapproved",
};

export function toPosix(path) {
  return path.split(sep).join("/");
}

/** Line endings and trailing whitespace never count as a content change. */
export function normalize(text) {
  return `${String(text).replace(/\r\n/g, "\n").replace(/\s+$/, "")}\n`;
}

export function contentSha(text) {
  return createHash("sha256").update(normalize(text)).digest("hex").slice(0, 16);
}

export function parseApprovals(raw, source = APPROVALS_FILE) {
  const data = JSON.parse(raw);
  if (typeof data.requireApproval !== "boolean") {
    throw new Error(`${source}: "requireApproval" must be true or false`);
  }
  if (!data.items || typeof data.items !== "object" || Array.isArray(data.items)) {
    throw new Error(`${source}: "items" must be an object keyed by file path`);
  }
  for (const [path, stamp] of Object.entries(data.items)) {
    for (const key of ["sha", "by", "on"]) {
      if (typeof stamp?.[key] !== "string" || !stamp[key]) {
        throw new Error(`${source}: stamp for ${path} is missing "${key}"`);
      }
    }
  }
  return data;
}

export async function loadApprovals(root) {
  return parseApprovals(await readFile(join(root, APPROVALS_FILE), "utf8"));
}

export function statusFor(relPath, text, approvals) {
  const stamp = approvals.items[relPath] ?? null;
  const sha = contentSha(text);
  if (!stamp) return { status: STATUS.unapproved, sha, stamp };
  if (stamp.sha !== sha) return { status: STATUS.changed, sha, stamp };
  return { status: STATUS.approved, sha, stamp };
}

export const CONTENT_EXT = /\.(md|mdx)$/;

const NOT_CONTENT = /(^|\/)README\.md$/i; // a folder note, never an item

export function isCollectionPath(relPath) {
  if (!CONTENT_EXT.test(relPath) || NOT_CONTENT.test(relPath)) return false;
  return COLLECTION_DIRS.some((dir) => {
    if (!relPath.startsWith(`${dir}/`)) return false;
    return !relPath.slice(dir.length + 1).includes("/");
  });
}

export function isStructuralPath(relPath) {
  if (STRUCTURAL_FILES.includes(relPath)) return true;
  if (!relPath.endsWith(".js") || STRUCTURAL_EXCLUDE.test(relPath)) return false;
  return STRUCTURAL_DIRS.some((dir) => relPath.startsWith(`${dir}/`));
}

export function isCovered(relPath) {
  return isCollectionPath(relPath) || isStructuralPath(relPath);
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

/** Every covered file on disk, as repo-relative POSIX paths, sorted. */
export async function listCoveredFiles(root) {
  const files = new Set();
  for (const dir of [...COLLECTION_DIRS, ...STRUCTURAL_DIRS]) {
    if (!(await exists(join(root, dir)))) continue;
    for (const file of await walk(join(root, dir))) {
      files.add(toPosix(relative(root, file)));
    }
  }
  for (const file of STRUCTURAL_FILES) {
    if (await exists(join(root, file))) files.add(file);
  }
  return [...files].filter(isCovered).sort();
}

/**
 * Status of every covered file plus the stamps that no longer point at a file.
 * `rows[i].kind` is "collection" (droppable) or "structural" (build fails).
 */
export async function approvalReport(root, approvals) {
  const files = await listCoveredFiles(root);
  const rows = [];
  for (const path of files) {
    const text = await readFile(join(root, path), "utf8");
    const { status, sha, stamp } = statusFor(path, text, approvals);
    rows.push({
      path,
      kind: isCollectionPath(path) ? "collection" : "structural",
      status,
      sha,
      stamp,
    });
  }
  const stale = Object.keys(approvals.items).filter((path) => !files.includes(path));
  return { rows, stale };
}

/** The exact command that stamps a file, for error messages and the deck. */
export function approveCommand(paths) {
  return `npm run approve -- ${paths.join(" ")}`;
}
