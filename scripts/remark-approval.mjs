// scripts/remark-approval.mjs
//
// Remark plugin, wired in vite.config.js after remark-mdx-frontmatter.
// For every covered MDX file it adds a named export:
//
//   export const approval = { status, sha, required, droppable, by, on }
//
// `status` is "approved", "changed" or "unapproved" (scripts/lib/approval.mjs).
// src/content/mdxCollection.js drops collection items whose status is not
// "approved" while content.approvals.json has requireApproval: true.
//
// The stamps file is re-read for every file so `npm run dev` picks up a new
// stamp on the next change without a restart.

import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { valueToEstree } from "estree-util-value-to-estree";
import {
  APPROVALS_FILE,
  isCollectionPath,
  isCovered,
  parseApprovals,
  statusFor,
  toPosix,
} from "./lib/approval.mjs";

export default function remarkApproval({ root }) {
  if (!root) throw new Error("remark-approval: `root` (the repo root) is required");

  return (tree, file) => {
    const absolute = String(file.path ?? "").split("?")[0];
    if (!absolute) return;
    const rel = toPosix(relative(root, absolute));
    if (!isCovered(rel)) return;

    const approvals = parseApprovals(readFileSync(join(root, APPROVALS_FILE), "utf8"));
    const { status, sha, stamp } = statusFor(rel, String(file.value), approvals);
    const approval = {
      status,
      sha,
      required: approvals.requireApproval,
      droppable: isCollectionPath(rel),
      by: stamp?.by ?? null,
      on: stamp?.on ?? null,
    };

    tree.children.unshift({
      type: "mdxjsEsm",
      value: `export const approval = ${JSON.stringify(approval)};`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "approval" },
                    init: valueToEstree(approval),
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
}
