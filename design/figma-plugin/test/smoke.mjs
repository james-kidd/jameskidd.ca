#!/usr/bin/env node
/**
 * smoke.mjs — runs design/figma-plugin/code.js against the mock Plugin API.
 *
 *   npm run design:kit:smoke
 *
 * Fails (exit 1) when the build throws, when any build step reported an error
 * through the plugin UI, or when the finished document is missing something
 * the kit promises (pages, theme modes, components, prototype links).
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { figma, uiMessages, inspect } from "./figma-mock.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const code = await readFile(path.join(here, "..", "code.js"), "utf8");

const context = vm.createContext({ figma, __html__: "<html></html>", console, setTimeout, clearTimeout, Date, Math, JSON, Object, Array, Number, String, Boolean, Promise, Symbol, Error, Set, Map, parseInt, parseFloat });
vm.runInContext(code, context, { filename: "code.js" });

if (typeof figma.ui.onmessage !== "function") {
  console.error("plugin did not register figma.ui.onmessage");
  process.exit(1);
}

await figma.ui.onmessage({ type: "build", options: { foundations: true, components: true, screens: true, motion: true, content: true, photos: false, replace: false } });

const warnings = uiMessages.filter((m) => m.type === "warn").map((m) => m.text);
const errors = uiMessages.filter((m) => m.type === "error").map((m) => m.text);
const done = uiMessages.find((m) => m.type === "done");

const pages = inspect.root.children.map((p) => p.name);
const expectedPages = ["Cover", "Getting started", "Foundations", "Components", "Screens", "Motion & States", "Content model"];
const missingPages = expectedPages.filter((p) => !pages.includes(p));

const componentsPage = inspect.root.children.find((p) => p.name === "Components");
const sets = componentsPage ? componentsPage.findAllWithCriteria({ types: ["COMPONENT_SET"] }) : [];
const singles = componentsPage ? componentsPage.findAllWithCriteria({ types: ["COMPONENT"] }).filter((c) => c.parent.type !== "COMPONENT_SET" && !c.name.startsWith("icon/")) : [];
const icons = componentsPage ? componentsPage.findAllWithCriteria({ types: ["COMPONENT"] }).filter((c) => c.name.startsWith("icon/")) : [];
const wired = componentsPage ? componentsPage.findAllWithCriteria({ types: ["COMPONENT"] }).filter((c) => c.reactions.length).length : 0;
const theme = inspect.collections.find((c) => c.name === "Theme");
const screens = inspect.root.children.find((p) => p.name === "Screens");
const screenNames = screens ? screens.children.map((n) => n.name) : [];

const failures = [];
if (errors.length) failures.push(`errors: ${errors.join(" | ")}`);
if (!done) failures.push("build did not post a done message");
if (missingPages.length) failures.push(`missing pages: ${missingPages.join(", ")}`);
if (!theme || theme.modes.length !== 3) failures.push("Theme collection should have 3 modes in the mock");
if (sets.length < 24) failures.push(`only ${sets.length} component sets`);
// Component properties must actually be wired to child nodes (a rename would silently unwire them).
const wiredProps = (setName, ref) => {
  const set = sets.find((s) => s.name === setName);
  return set ? set.findAll((n) => n.componentPropertyReferences && n.componentPropertyReferences[ref]).length : 0;
};
if (!wiredProps("Button", "visible")) failures.push("Button: icon BOOLEAN props are not wired");
if (!wiredProps("Button", "mainComponent")) failures.push("Button: INSTANCE_SWAP prop is not wired");
if (!wiredProps("ExperienceCard", "characters")) failures.push("ExperienceCard: TEXT props are not wired");
if (!wiredProps("ProjectCard", "characters")) failures.push("ProjectCard: TEXT props are not wired");
if (!wiredProps("IconBox", "mainComponent")) failures.push("IconBox: Icon swap is not wired");
if (!wired) failures.push("no prototype reactions were written");
if (screenNames.length < 7) failures.push(`only ${screenNames.length} screens: ${screenNames.join(", ")}`);
const unexpectedWarnings = warnings.filter((w) => !/serif|monospace|Photo /.test(w));
if (unexpectedWarnings.length) failures.push(`warnings:\n  - ${unexpectedWarnings.join("\n  - ")}`);

console.log(`pages: ${pages.join(" · ")}`);
console.log(`variables: ${inspect.variables.filter((v) => !v.removed).length} · text styles: ${inspect.styles.text.length} · effect styles: ${inspect.styles.effect.length}`);
console.log(`component sets: ${sets.length} · single components: ${singles.length} · icons: ${icons.length} · variants with reactions: ${wired}`);
console.log(`screens: ${screenNames.join(" · ")}`);
console.log(done ? done.text : "(no done message)");
if (warnings.length) console.log(`warnings (${warnings.length}):\n  - ${warnings.join("\n  - ")}`);

if (failures.length) {
  console.error(`\nSMOKE FAILED\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log("\nSMOKE OK");
