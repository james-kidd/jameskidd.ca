/* ================================================================== *
 * 90-main.js — plugin entry: UI lifecycle + build orchestration.
 * ================================================================== */

const PANEL_WIDTH = 360;

figma.showUI(__html__, { width: PANEL_WIDTH, height: 520, themeColors: true });
figma.root.setRelaunchData({ build: "Rebuild the jameskidd.ca design kit" });

/** Reuse variables, styles, icons and components from a previous run. */
async function loadExisting() {
  const variables = await figma.variables.getLocalVariablesAsync();
  for (const v of variables) if (!KIT.vars[v.name]) KIT.vars[v.name] = v;
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const theme = collections.find((c) => c.name === "Theme");
  if (theme) {
    KIT.themeCollection = theme;
    for (const m of theme.modes) KIT.themeModes[m.name] = m.modeId;
  }
  for (const s of await figma.getLocalTextStylesAsync()) KIT.textStyles[s.name] = s;
  for (const s of await figma.getLocalEffectStylesAsync()) KIT.effectStyles[s.name] = s;

  const page = figma.root.children.find((p) => p.name === PAGE_NAMES.components);
  if (page) {
    await page.loadAsync();
    for (const node of page.findAllWithCriteria({ types: ["COMPONENT", "COMPONENT_SET"] })) {
      if (node.type === "COMPONENT" && node.parent && node.parent.type === "COMPONENT_SET") continue;
      if (node.name.indexOf("icon/") === 0) KIT.icons[node.name.slice(5)] = node;
      else KIT.components[node.name] = node;
    }
  }
}

async function runBuild(options) {
  KIT.options = options;
  KIT.log = [];
  KIT.warnings = [];
  const started = Date.now();

  await step("Resolving fonts", resolveFonts);

  if (options.foundations) {
    await step("Foundations · variables", buildVariables);
    await step("Foundations · styles", buildStyles);
    await step("Foundations · documentation page", buildFoundationsPage);
  } else {
    await step("Loading existing variables, styles and components", loadExisting);
  }

  if (options.components) {
    await step("Components", buildComponentsPage);
  }
  if (options.screens) await step("Screens", buildScreensPage);
  if (options.motion) await step("Motion & States", buildMotionPage);
  if (options.content) await step("Content model", buildContentPage);
  await step("Getting started", buildStartPage);
  await step("Cover", buildCoverPage);

  // Put the kit pages in reading order at the top of the file.
  const order = [PAGE_NAMES.cover, PAGE_NAMES.start, PAGE_NAMES.foundations, PAGE_NAMES.components, PAGE_NAMES.screens, PAGE_NAMES.motion, PAGE_NAMES.content];
  let index = 0;
  for (const name of order) {
    const page = figma.root.children.find((p) => p.name === name);
    if (page) figma.root.insertChild(index++, page);
  }
  const cover = figma.root.children.find((p) => p.name === PAGE_NAMES.cover);
  if (cover) {
    await figma.setCurrentPageAsync(cover);
    figma.viewport.scrollAndZoomIntoView(cover.children);
    cover.setRelaunchData({ build: "Rebuild the jameskidd.ca design kit" });
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  const summary = `Done in ${seconds}s — ${Object.keys(KIT.vars).length} variables, ${Object.keys(KIT.textStyles).length} text styles, ${Object.keys(KIT.components).length} components, ${Object.keys(KIT.icons).length} icons${KIT.warnings.length ? `, ${KIT.warnings.length} warning(s) above` : ""}.`;
  figma.ui.postMessage({ type: "done", text: summary });
}

figma.ui.onmessage = async (message) => {
  if (!message || !message.type) return;
  if (message.type === "resize") {
    figma.ui.resize(PANEL_WIDTH, Math.max(240, Math.min(900, Math.round(message.height) + 8)));
    return;
  }
  if (message.type === "build") {
    if (figma.editorType !== "figma") {
      figma.ui.postMessage({ type: "error", text: "Run this plugin in a Figma Design file." });
      return;
    }
    try {
      await runBuild(message.options || {});
    } catch (err) {
      figma.ui.postMessage({ type: "error", text: err && err.message ? err.message : String(err) });
    }
  }
};
