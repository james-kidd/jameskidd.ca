/* ================================================================== *
 * 10-foundations.js — tokens -> variables, text/effect styles, docs page.
 *
 * Variable names equal the CSS custom property names (minus `--`), which is
 * the contract documented in docs/figma-tokens.md: a DTCG export of the
 * "Global" + "Theme" collections drops straight back into tokens/*.json.
 * ================================================================== */

/** Tailwind greys the components still reference directly (not yet tokens). */
const PRIMITIVES = {
  "gray/50": "#f9fafb",
  "gray/100": "#f3f4f6",
  "gray/200": "#e5e7eb",
  "gray/300": "#d1d5db",
  "gray/400": "#9ca3af",
  "gray/500": "#6b7280",
  "gray/600": "#4b5563",
  "gray/700": "#374151",
  "gray/800": "#1f2937",
  "gray/900": "#111827",
  white: "#ffffff",
  black: "#000000",
};

/** Tailwind spacing scale actually used by the site (px). */
const SPACING = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64, 20: 80 };

/** Motion tokens lifted from the Tailwind classes / JS constants in the code. */
const MOTION_TOKENS = [
  { name: "motion/duration/fast", value: 200, css: "duration-200", note: "Colour + transform hovers (tag pills, nav, icon boxes, theme swatches)." },
  { name: "motion/duration/base", value: 300, css: "duration-300", note: "Cards, timeline hover, gallery overlay." },
  { name: "motion/duration/slow", value: 500, css: "duration-500", note: "Expand / collapse (experience, education, project, pillar cards), gallery zoom." },
  { name: "motion/duration/reveal", value: 700, css: "duration-700", note: "BipartiteVisual edge fade." },
  { name: "motion/duration/morph", value: 1000, css: "duration-1000", note: "BipartiteVisual node travel." },
  { name: "motion/duration/pulse", value: 2000, css: "animate-pulse", note: "Typing cursor and 'swipe to explore' chevron (infinite)." },
  { name: "motion/typing/char", value: SITE.typing.timing.typeSpeedMs, css: "TYPE_SPEED", note: "Hero typing animation, ms per character." },
  { name: "motion/typing/pause", value: SITE.typing.timing.pauseMs, css: "PAUSE", note: "Hero typing animation, pause after a line." },
  { name: "motion/typing/strike", value: SITE.typing.timing.strikePauseMs, css: "STRIKE_PAUSE", note: "Hero typing animation, hold on the struck phrase." },
];

const EASINGS = [
  { name: "motion/ease/out", value: "cubic-bezier(0, 0, 0.2, 1)", css: "ease-out" },
  { name: "motion/ease/in-out", value: "cubic-bezier(0.4, 0, 0.2, 1)", css: "ease-in-out" },
  { name: "motion/ease/default", value: "cubic-bezier(0.4, 0, 0.2, 1)", css: "transition-all" },
  { name: "motion/ease/pulse", value: "cubic-bezier(0.4, 0, 0.6, 1)", css: "animate-pulse" },
];

/** Token name -> hex (default theme) / raw value, for fallbacks and docs. */
const TOKEN_HEX = {};
const TOKEN_RAW = {};
(function indexTokens() {
  const add = (name, def) => {
    TOKEN_RAW[name] = def.$value;
    if (def.$type === "color") TOKEN_HEX[name] = def.$value;
  };
  for (const name of Object.keys(TOKENS.global)) {
    if (name[0] !== "$") add(name, TOKENS.global[name]);
  }
  for (const name of Object.keys(TOKENS.themes[SITE.site.defaultTheme])) {
    if (name[0] !== "$") add(name, TOKENS.themes[SITE.site.defaultTheme][name]);
  }
  for (const name of Object.keys(PRIMITIVES)) {
    TOKEN_HEX[name] = PRIMITIVES[name];
    TOKEN_RAW[name] = PRIMITIVES[name];
  }
})();

const COLOR_SCOPES = {
  surface: ["FRAME_FILL", "SHAPE_FILL"],
  "surface-muted": ["FRAME_FILL", "SHAPE_FILL"],
  secondary: ["FRAME_FILL", "SHAPE_FILL"],
  border: ["STROKE_COLOR", "FRAME_FILL", "SHAPE_FILL"],
  "text-strong": ["TEXT_FILL"],
  "text-muted": ["TEXT_FILL"],
  primary: ["ALL_FILLS", "STROKE_COLOR"],
  "primary-dark": ["ALL_FILLS", "STROKE_COLOR"],
  "accent-warn": ["ALL_FILLS", "STROKE_COLOR"],
};

/* ------------------------------------------------------------------ *
 * Typography
 * ------------------------------------------------------------------ */

/**
 * Text style definitions. `weight` maps to a Figma style name through
 * KIT.fonts.styles. Sizes/leading mirror the Tailwind classes in the JSX.
 */
const TEXT_STYLE_DEFS = {
  "display/hero": { weight: "ExtraBold", size: 72, lineHeight: 110, letterSpacing: -5, css: "text-7xl font-extrabold tracking-tighter leading-tight" },
  "display/hero-mobile": { weight: "ExtraBold", size: 60, lineHeight: 110, letterSpacing: -5, css: "text-6xl font-extrabold tracking-tighter" },
  "heading/page": { weight: "ExtraBold", size: 48, lineHeight: 110, letterSpacing: -2.5, css: "text-5xl font-extrabold tracking-tight" },
  "heading/page-sm": { weight: "Bold", size: 36, lineHeight: 120, letterSpacing: 0, css: "text-4xl font-bold" },
  "heading/section": { weight: "Bold", size: 30, lineHeight: 120, letterSpacing: 0, css: ".section-title (text-3xl font-bold)" },
  "heading/identity": { weight: "ExtraBold", size: 30, lineHeight: 120, letterSpacing: 0, css: "text-3xl font-extrabold (IdentityBlock)" },
  "heading/panel": { weight: "Bold", size: 20, lineHeight: 140, letterSpacing: 0, css: "text-xl font-bold" },
  "heading/card": { weight: "SemiBold", size: 18, lineHeight: 140, letterSpacing: 0, css: "text-lg font-semibold" },
  "heading/card-bold": { weight: "Bold", size: 18, lineHeight: 140, letterSpacing: 0, css: "text-lg font-bold" },
  "heading/prose-h2": { weight: "Bold", size: 24, lineHeight: 130, letterSpacing: -2.5, css: "mdx h2 (text-2xl font-bold tracking-tight)" },
  "heading/prose-h3": { weight: "SemiBold", size: 18, lineHeight: 140, letterSpacing: 0, css: "mdx h3 (text-lg font-semibold)" },
  "body/lead": { weight: "Light", size: 20, lineHeight: 160, letterSpacing: 0, css: ".section-lead (text-xl font-light)" },
  "body/lead-lg": { weight: "Light", size: 24, lineHeight: 150, letterSpacing: 0, css: "hero tagline (md:text-2xl)" },
  "body/base": { weight: "Regular", size: 16, lineHeight: 160, letterSpacing: 0, css: "body (line-height 1.6)" },
  "body/base-medium": { weight: "Medium", size: 16, lineHeight: 160, letterSpacing: 0, css: "font-medium" },
  "body/prose": { weight: "Regular", size: 15, lineHeight: 162, letterSpacing: 0, css: ".text-body text-[15px] leading-relaxed (--text-body)" },
  "body/lg": { weight: "Regular", size: 18, lineHeight: 162, letterSpacing: 0, css: "text-lg leading-relaxed (skills positioning)" },
  "body/sm": { weight: "Regular", size: 14, lineHeight: 150, letterSpacing: 0, css: "text-sm" },
  "body/sm-medium": { weight: "Medium", size: 14, lineHeight: 150, letterSpacing: 0, css: "text-sm font-medium" },
  "body/sm-semibold": { weight: "SemiBold", size: 14, lineHeight: 150, letterSpacing: 0, css: "text-sm font-semibold" },
  "body/xs": { weight: "Medium", size: 12, lineHeight: 133, letterSpacing: 0, css: "text-xs font-medium (tag pill, badge)" },
  "body/xs-semibold": { weight: "SemiBold", size: 12, lineHeight: 133, letterSpacing: 0, css: "text-xs font-semibold" },
  "label/eyebrow": { weight: "SemiBold", size: 11, lineHeight: 130, letterSpacing: 24, upper: true, css: ".eyebrow (--text-eyebrow, tracking .24em)" },
  "label/section-eyebrow": { weight: "SemiBold", size: 12, lineHeight: 130, letterSpacing: 5, upper: true, css: "text-xs font-semibold uppercase tracking-wider" },
  "label/micro": { weight: "Medium", size: 10, lineHeight: 130, letterSpacing: 5, upper: true, css: "text-[10px] uppercase tracking-wider (--text-micro)" },
  "label/micro-bold": { weight: "SemiBold", size: 10, lineHeight: 130, letterSpacing: 10, upper: true, css: "text-[10px] font-semibold uppercase tracking-widest (Featured)" },
  "label/micro-italic": { weight: "Medium", size: 10, lineHeight: 130, letterSpacing: 0, css: "text-[10px] italic (project tag)" },
  "label/nav": { weight: "Medium", size: 14, lineHeight: 140, letterSpacing: 2.5, css: ".nav-item (text-sm font-medium tracking-wide)" },
  "label/chevron": { weight: "Bold", size: 12, lineHeight: 130, letterSpacing: 10, upper: true, css: "text-xs font-bold uppercase tracking-widest" },
  "label/contact": { weight: "Regular", size: 11, lineHeight: 137, letterSpacing: 0, css: "ContactInfo text-[11px] leading-snug" },
  "code/mono": { weight: "Regular", size: 15, lineHeight: 160, letterSpacing: 0, mono: true, css: "TypingAnimation font-mono text-sm md:text-base" },
  "code/inline": { weight: "Regular", size: 14, lineHeight: 150, letterSpacing: 0, mono: true, css: "mdx code (text-[0.9em] font-mono)" },
};

const WEIGHT_CANDIDATES = {
  Light: ["Light", "Regular"],
  Regular: ["Regular"],
  Medium: ["Medium", "Regular"],
  SemiBold: ["Semi Bold", "SemiBold", "Medium", "Bold"],
  Bold: ["Bold", "Semi Bold", "Regular"],
  ExtraBold: ["Extra Bold", "ExtraBold", "Bold"],
};

function fontFor(def, italic) {
  const family = def.mono ? KIT.fonts.mono : KIT.fonts.sans;
  const styles = def.mono ? KIT.fonts.monoStyles : KIT.fonts.styles;
  let style = styles[def.weight] || styles.Regular || "Regular";
  if (italic) {
    const it = style === "Regular" ? "Italic" : `${style} Italic`;
    if ((def.mono ? KIT.fonts.monoAll : KIT.fonts.sansAll).has(it)) style = it;
  }
  return { family, style };
}

/** Discover which families/styles exist, pick sans / serif / mono, load them. */
async function resolveFonts() {
  const all = await figma.listAvailableFontsAsync();
  const byFamily = {};
  for (const f of all) {
    (byFamily[f.fontName.family] = byFamily[f.fontName.family] || new Set()).add(f.fontName.style);
  }
  const pick = (candidates) => candidates.find((c) => byFamily[c]) || null;
  const sans = pick(["Inter", "SF Pro Text", "Segoe UI", "Roboto", "Arial"]) || "Inter";
  const serif = pick(["Georgia", "Lora", "Merriweather", "Source Serif Pro", "Times New Roman"]);
  const mono = pick(["Roboto Mono", "JetBrains Mono", "Source Code Pro", "IBM Plex Mono", "Courier New"]);

  const styleMap = (family) => {
    const available = byFamily[family] || new Set(["Regular"]);
    const out = {};
    for (const weight of Object.keys(WEIGHT_CANDIDATES)) {
      out[weight] = WEIGHT_CANDIDATES[weight].find((s) => available.has(s)) || "Regular";
    }
    return out;
  };

  KIT.fonts = {
    sans,
    serif,
    mono: mono || sans,
    styles: styleMap(sans),
    monoStyles: styleMap(mono || sans),
    sansAll: byFamily[sans] || new Set(),
    monoAll: byFamily[mono || sans] || new Set(),
  };
  if (!serif) warn("No serif font available for the 'editorial' theme; Inter is used everywhere.");
  if (!mono) warn("No monospace font available; the typing animation specimen uses the sans font.");

  const fonts = new Set();
  for (const key of Object.keys(TEXT_STYLE_DEFS)) {
    const def = TEXT_STYLE_DEFS[key];
    fonts.add(JSON.stringify(fontFor(def)));
    fonts.add(JSON.stringify(fontFor(def, true)));
  }
  await Promise.all([...fonts].map((f) => figma.loadFontAsync(JSON.parse(f)).catch(() => null)));
  status(`Fonts: ${sans}${serif ? ` / ${serif}` : ""}${mono ? ` / ${mono}` : ""}`);
}

/* ------------------------------------------------------------------ *
 * Variables
 * ------------------------------------------------------------------ */

async function findCollection(name) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  return all.find((c) => c.name === name) || null;
}

async function freshCollection(name, firstMode) {
  const existing = await findCollection(name);
  if (existing) existing.remove();
  const collection = figma.variables.createVariableCollection(name);
  collection.renameMode(collection.modes[0].modeId, firstMode);
  return collection;
}

function makeVariable(name, collection, type, scopes, codeSyntax, description) {
  const v = figma.variables.createVariable(name, collection, type);
  v.scopes = scopes;
  if (codeSyntax) v.setVariableCodeSyntax("WEB", codeSyntax);
  if (description) v.description = description;
  KIT.vars[name] = v;
  return v;
}

function tokenValue(def) {
  if (def.$type === "color") return rgba(def.$value);
  if (def.$type === "dimension") return pxValue(def.$value);
  if (def.$type === "fontFamily") {
    const families = Array.isArray(def.$value) ? def.$value : String(def.$value).split(",");
    const first = families[0].trim().replace(/"/g, "");
    if (/georgia|times|serif/i.test(first) && KIT.fonts.serif) return KIT.fonts.serif;
    return KIT.fonts.sans;
  }
  return String(def.$value);
}

function tokenType(def) {
  if (def.$type === "color") return "COLOR";
  if (def.$type === "dimension") return "FLOAT";
  return "STRING";
}

function tokenScopes(name, def) {
  if (def.$type === "color") return COLOR_SCOPES[name] || ["ALL_FILLS"];
  if (def.$type === "dimension") return /^radius/.test(name) ? ["CORNER_RADIUS"] : ["FONT_SIZE"];
  if (def.$type === "fontFamily") return ["FONT_FAMILY"];
  return [];
}

async function buildVariables() {
  if (!KIT.options.replace && (await findCollection("Global"))) {
    warn("Variable collections already exist — reusing them (tick Replace to recreate).");
    await loadExisting();
    return;
  }
  // Global (single mode) — mode-independent tokens, shadows excluded (effect styles).
  const global = await freshCollection("Global", "Value");
  const gMode = global.modes[0].modeId;
  for (const name of Object.keys(TOKENS.global)) {
    if (name[0] === "$") continue;
    const def = TOKENS.global[name];
    if (def.$type === "shadow") continue;
    const v = makeVariable(name, global, tokenType(def), tokenScopes(name, def), `var(--${name})`, def.$description);
    v.setValueForMode(gMode, tokenValue(def));
  }

  // Theme — one collection with a mode per theme when the plan allows it,
  // otherwise one single-mode collection per theme (docs/figma-tokens.md).
  const themes = SITE.site.themes.map((t) => t.id);
  const theme = await freshCollection("Theme", themes[0]);
  KIT.themeCollection = theme;
  KIT.themeModes = { [themes[0]]: theme.modes[0].modeId };
  let multiMode = true;
  for (const id of themes.slice(1)) {
    try {
      KIT.themeModes[id] = theme.addMode(id);
    } catch {
      multiMode = false;
      break;
    }
  }
  if (!multiMode) {
    warn("This Figma plan allows a single mode per collection — creating one 'Theme / <name>' collection per theme instead (see docs/figma-tokens.md).");
    KIT.themeModes = { [themes[0]]: theme.modes[0].modeId };
    theme.name = `Theme / ${themes[0]}`;
  }
  for (const name of Object.keys(TOKENS.themes[themes[0]])) {
    if (name[0] === "$") continue;
    const def = TOKENS.themes[themes[0]][name];
    const v = makeVariable(name, theme, tokenType(def), tokenScopes(name, def), `var(--${name})`, def.$description);
    for (const id of Object.keys(KIT.themeModes)) {
      v.setValueForMode(KIT.themeModes[id], tokenValue(TOKENS.themes[id][name]));
    }
  }
  if (!multiMode) {
    for (const id of themes.slice(1)) {
      const c = await freshCollection(`Theme / ${id}`, id);
      KIT.themeCollections[id] = c;
      for (const name of Object.keys(TOKENS.themes[id])) {
        if (name[0] === "$") continue;
        const def = TOKENS.themes[id][name];
        const v = figma.variables.createVariable(name, c, tokenType(def));
        v.scopes = tokenScopes(name, def);
        v.setVariableCodeSyntax("WEB", `var(--${name})`);
        v.setValueForMode(c.modes[0].modeId, tokenValue(def));
      }
    }
  }

  // Primitives — Tailwind greys still referenced directly by components.
  const prim = await freshCollection("Primitives", "Value");
  const pMode = prim.modes[0].modeId;
  for (const name of Object.keys(PRIMITIVES)) {
    const css = name.indexOf("/") > 0 ? `var(--color-${name.replace("/", "-")})` : `var(--color-${name})`;
    const v = makeVariable(name, prim, "COLOR", ["ALL_FILLS", "STROKE_COLOR"], css,
      "Tailwind palette value used directly in JSX (candidate for promotion to a semantic token).");
    v.setValueForMode(pMode, rgba(PRIMITIVES[name]));
  }

  // Spacing — Tailwind scale.
  const spacing = await freshCollection("Spacing", "Value");
  const sMode = spacing.modes[0].modeId;
  for (const step of Object.keys(SPACING)) {
    const v = makeVariable(`space/${step}`, spacing, "FLOAT", ["GAP", "WIDTH_HEIGHT"], `calc(var(--spacing) * ${step})`,
      `Tailwind spacing step ${step} (${SPACING[step]}px).`);
    v.setValueForMode(sMode, SPACING[step]);
  }

  // Motion — durations (ms) and easings (CSS strings) as reference tokens.
  const motion = await freshCollection("Motion", "Value");
  const mMode = motion.modes[0].modeId;
  for (const t of MOTION_TOKENS) {
    const v = makeVariable(t.name, motion, "FLOAT", [], t.css, `${t.note} Value in milliseconds.`);
    v.setValueForMode(mMode, t.value);
  }
  for (const e of EASINGS) {
    const v = makeVariable(e.name, motion, "STRING", [], e.css, "CSS timing function.");
    v.setValueForMode(mMode, e.value);
  }

  status(`Variables: ${Object.keys(KIT.vars).length} across Global, Theme, Primitives, Spacing, Motion`);
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

async function buildStyles() {
  if (!KIT.options.replace && Object.keys(KIT.textStyles).length) {
    status("Text and effect styles already exist — reusing them.");
    return;
  }
  const existingText = await figma.getLocalTextStylesAsync();
  for (const s of existingText) if (TEXT_STYLE_DEFS[s.name]) s.remove();
  for (const name of Object.keys(TEXT_STYLE_DEFS)) {
    const def = TEXT_STYLE_DEFS[name];
    const style = figma.createTextStyle();
    style.name = name;
    style.fontName = fontFor(def);
    style.fontSize = def.size;
    style.lineHeight = { unit: "PERCENT", value: def.lineHeight };
    style.letterSpacing = { unit: "PERCENT", value: def.letterSpacing || 0 };
    if (def.upper) style.textCase = "UPPER";
    style.description = `CSS: ${def.css}`;
    KIT.textStyles[name] = style;
  }

  const shadows = [
    { name: "shadow/soft", css: TOKENS.global["shadow-soft"].$value, desc: "--shadow-soft · resting card / panel elevation" },
    { name: "shadow/hover", css: TOKENS.global["shadow-hover"].$value, desc: "--shadow-hover · raised card elevation" },
    { name: "shadow/sm", css: "0 1px 2px rgba(0, 0, 0, 0.05)", desc: "Tailwind shadow-sm · nav-item hover, tag-pill hover, btn-pill" },
    { name: "shadow/lg", css: "0 10px 15px rgba(0, 0, 0, 0.1)", desc: "Tailwind shadow-lg · BipartiteVisual info box" },
    { name: "shadow/xl", css: "0 20px 25px rgba(0, 0, 0, 0.1)", desc: "Tailwind shadow-xl · mobile menu sheet" },
  ];
  const existingEffects = await figma.getLocalEffectStylesAsync();
  for (const s of existingEffects) if (shadows.some((d) => d.name === s.name)) s.remove();
  for (const s of shadows) {
    const effect = parseShadow(s.css);
    if (!effect) continue;
    const style = figma.createEffectStyle();
    style.name = s.name;
    style.effects = [effect];
    style.description = s.desc;
    KIT.effectStyles[s.name] = style;
  }
  status(`Styles: ${Object.keys(KIT.textStyles).length} text, ${Object.keys(KIT.effectStyles).length} effect`);
}

/* ------------------------------------------------------------------ *
 * Foundations page
 * ------------------------------------------------------------------ */

async function swatch(parent, name, hex, note) {
  const card = frame(parent, { name, gap: 8, w: 168 });
  rect(card, { name: "colour", w: 168, h: 72, fill: name, radius: "radius-md", stroke: "border" });
  const meta = frame(card, { name: "meta", gap: 2 });
  meta.layoutSizingHorizontal = "FILL";
  await text(meta, name, { style: "body/sm-medium" });
  await text(meta, `${hex.toLowerCase()} · --${name}`, { style: "body/xs", color: "text-muted", fill: true });
  if (note) await text(meta, note, { style: "body/xs", color: "text-muted", fill: true });
  return card;
}

async function buildFoundationsPage() {
  const page = await getOrCreatePage(PAGE_NAMES.foundations);
  await figma.setCurrentPageAsync(page);
  const blocks = [];

  // --- Theme colours, one preview per mode ---------------------------------
  const themeDoc = frame(page, { name: "Colour · Theme", gap: 32, pad: 48, w: 1240, fill: "surface", radius: 24, stroke: "border" });
  await docHeader(themeDoc, "Theme colours",
    `Collection "Theme" · modes: ${SITE.site.themes.map((t) => t.id).join(", ")}. Each swatch is bound to the variable; the row's frame pins one mode.`);
  for (const t of SITE.site.themes) {
    const row = frame(themeDoc, { name: `theme=${t.id}`, gap: 16, pad: 24, radius: "radius-lg", fill: "surface-muted", stroke: "border" });
    row.layoutSizingHorizontal = "FILL";
    if (KIT.themeModes[t.id]) row.setExplicitVariableModeForCollection(KIT.themeCollection, KIT.themeModes[t.id]);
    const head = frame(row, { name: "head", dir: "HORIZONTAL", gap: 12, align: "CENTER" });
    ellipse(head, { name: "swatch", size: 20, fill: t.color });
    await text(head, `${t.label} (${t.id})${t.default ? " · default" : ""}`, { style: "heading/card" });
    const fontDef = TOKENS.themes[t.id]["font-family-sans"];
    await text(head, `font-family-sans: ${(Array.isArray(fontDef.$value) ? fontDef.$value : [fontDef.$value]).join(", ")}`,
      { style: "body/xs", color: "text-muted" });
    const swatches = frame(row, { name: "swatches", dir: "HORIZONTAL", gap: 16, wrap: true });
    swatches.layoutSizingHorizontal = "FILL";
    for (const name of Object.keys(TOKENS.themes[t.id])) {
      if (name[0] === "$" || TOKENS.themes[t.id][name].$type !== "color") continue;
      await swatch(swatches, name, TOKENS.themes[t.id][name].$value);
    }
  }
  blocks.push(themeDoc);

  // --- Global + primitives ---------------------------------------------------
  const globalDoc = frame(page, { name: "Colour · Global + Primitives", gap: 24, pad: 48, w: 1240, fill: "surface", radius: 24, stroke: "border" });
  await docHeader(globalDoc, "Global colours", 'Collection "Global" (single mode) — identical in every theme.');
  const gRow = frame(globalDoc, { name: "global", dir: "HORIZONTAL", gap: 16, wrap: true });
  gRow.layoutSizingHorizontal = "FILL";
  for (const name of Object.keys(TOKENS.global)) {
    if (name[0] === "$" || TOKENS.global[name].$type !== "color") continue;
    await swatch(gRow, name, TOKENS.global[name].$value, TOKENS.global[name].$description);
  }
  await docHeader(globalDoc, "Primitives",
    'Collection "Primitives" — Tailwind greys the JSX still uses directly (text-gray-400, bg-gray-100, …). Promote to semantic tokens when the components are cleaned up.');
  const pRow = frame(globalDoc, { name: "primitives", dir: "HORIZONTAL", gap: 16, wrap: true });
  pRow.layoutSizingHorizontal = "FILL";
  for (const name of Object.keys(PRIMITIVES)) await swatch(pRow, name, PRIMITIVES[name]);
  blocks.push(globalDoc);

  // --- Typography -------------------------------------------------------------
  const typeDoc = frame(page, { name: "Typography", gap: 20, pad: 48, w: 1240, fill: "surface", radius: 24, stroke: "border" });
  await docHeader(typeDoc, "Type styles",
    `Sans: ${KIT.fonts.sans} (stands in for system-ui / Segoe UI)${KIT.fonts.serif ? ` · Serif: ${KIT.fonts.serif} (editorial theme, Georgia)` : ""} · Mono: ${KIT.fonts.mono}. Line height and tracking mirror the Tailwind classes noted on each row.`);
  for (const name of Object.keys(TEXT_STYLE_DEFS)) {
    const def = TEXT_STYLE_DEFS[name];
    const row = frame(typeDoc, { name, dir: "HORIZONTAL", gap: 24, align: "CENTER" });
    row.layoutSizingHorizontal = "FILL";
    const meta = frame(row, { name: "meta", gap: 2, w: 280 });
    await text(meta, name, { style: "body/sm-medium" });
    await text(meta, `${def.size}px · ${def.weight} · lh ${def.lineHeight}%${def.letterSpacing ? ` · ls ${def.letterSpacing}%` : ""}`, { style: "body/xs", color: "text-muted", fill: true });
    await text(meta, def.css, { style: "body/xs", color: "text-muted", fill: true });
    const sample = name.indexOf("display") === 0 ? SITE.identity.name : name.indexOf("code") === 0 ? "I orchestrate AI with taste" : "The quick brown fox jumps over the lazy dog";
    await text(row, sample, { style: name, fill: true });
  }
  blocks.push(typeDoc);

  // --- Radius, shadow, spacing ---------------------------------------------
  const shapeDoc = frame(page, { name: "Radius · Shadow · Spacing", gap: 32, pad: 48, w: 1240, fill: "surface", radius: 24, stroke: "border" });
  await docHeader(shapeDoc, "Radius", "Bound to Global radius-* variables. radius-lg (18px) is the signature panel radius.");
  const rRow = frame(shapeDoc, { name: "radius", dir: "HORIZONTAL", gap: 24 });
  for (const name of ["radius-sm", "radius-md", "radius-lg", "radius-full"]) {
    const cell = frame(rRow, { name, gap: 8, align: "CENTER" });
    rect(cell, { name: "shape", w: 96, h: 96, fill: "secondary", stroke: "primary", radius: name });
    await text(cell, `${name} · ${TOKEN_RAW[name]}`, { style: "body/xs", color: "text-muted" });
  }
  await docHeader(shapeDoc, "Shadows", "Effect styles (Figma cannot store shadows in variables). shadow-soft / shadow-hover are the tokens; shadow-sm/lg/xl are Tailwind defaults used by a few components.");
  const sRow = frame(shapeDoc, { name: "shadows", dir: "HORIZONTAL", gap: 32, pad: [8, 8, 24, 8] });
  for (const name of Object.keys(KIT.effectStyles)) {
    const cell = frame(sRow, { name, gap: 8, align: "CENTER" });
    rect(cell, { name: "shape", w: 120, h: 80, fill: "surface", radius: "radius-lg", stroke: "border" }).effectStyleId = KIT.effectStyles[name].id;
    await text(cell, name, { style: "body/xs", color: "text-muted" });
  }
  await docHeader(shapeDoc, "Spacing", 'Collection "Spacing" — the Tailwind steps the layout uses (gap-2 = space/2 = 8px …).');
  const spRow = frame(shapeDoc, { name: "spacing", dir: "HORIZONTAL", gap: 16, align: "MAX" });
  for (const step of Object.keys(SPACING)) {
    const cell = frame(spRow, { name: `space/${step}`, gap: 6, align: "CENTER" });
    rect(cell, { name: "bar", w: SPACING[step], h: SPACING[step], fill: "primary", radius: 2 });
    await text(cell, `${step} · ${SPACING[step]}`, { style: "body/xs", color: "text-muted" });
  }
  blocks.push(shapeDoc);

  // --- Motion tokens ---------------------------------------------------------
  const motionDoc = frame(page, { name: "Motion tokens", gap: 12, pad: 48, w: 1240, fill: "surface", radius: 24, stroke: "border" });
  await docHeader(motionDoc, "Motion tokens", 'Collection "Motion" — every duration and easing found in the code, so animations can be tuned in one place. See the "Motion & States" page for each movement isolated.');
  for (const t of MOTION_TOKENS) await specRow(motionDoc, t.name, `${t.value} ms · ${t.css} — ${t.note}`);
  for (const e of EASINGS) await specRow(motionDoc, e.name, `${e.value} · ${e.css}`);
  blocks.push(motionDoc);

  placeBelow(blocks, 0, 0, 80);
  return page;
}
