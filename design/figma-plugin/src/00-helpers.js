/* ================================================================== *
 * 00-helpers.js — shared state, colour maths, node factories.
 *
 * Everything below runs inside Figma's plugin sandbox. `SITE`, `TOKENS` and
 * `ICONS` are injected ahead of this file by scripts/build-figma-kit.mjs.
 * ================================================================== */

/** Mutable build state: variables, styles, components, fonts, log. */
const KIT = {
  fonts: null, // { sans: family, serif: family, mono: family, styles: {weight -> style name} }
  vars: {}, // token name -> Variable
  themeCollection: null,
  themeModes: {}, // theme id -> modeId (empty when the plan has no modes)
  themeCollections: {}, // theme id -> collection (fallback layout on single-mode plans)
  textStyles: {}, // style name -> TextStyle
  effectStyles: {}, // style name -> EffectStyle
  icons: {}, // icon name -> ComponentNode
  components: {}, // component name -> ComponentSetNode | ComponentNode
  pages: {}, // page name -> PageNode
  options: {},
  log: [],
  warnings: [],
};

const PAGE_NAMES = {
  cover: "Cover",
  start: "Getting started",
  foundations: "Foundations",
  components: "Components",
  screens: "Screens",
  motion: "Motion & States",
  content: "Content model",
};

/* ------------------------------------------------------------------ *
 * Logging
 * ------------------------------------------------------------------ */

function status(text) {
  KIT.log.push(text);
  figma.ui.postMessage({ type: "status", text });
}

function warn(text) {
  KIT.warnings.push(text);
  figma.ui.postMessage({ type: "warn", text });
}

/** Run a build step; a failure is reported and the build continues. */
async function step(label, fn) {
  status(label);
  try {
    return await fn();
  } catch (err) {
    warn(`${label} — ${err && err.message ? err.message : String(err)}`);
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Colour + value parsing
 * ------------------------------------------------------------------ */

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function rgba(hex, a) {
  const c = hexToRgb(hex);
  return { r: c.r, g: c.g, b: c.b, a: a === undefined ? 1 : a };
}

/** Mix two hex colours (0..1 weight towards `b`), like CSS color-mix in sRGB. */
function mixHex(a, b, weight) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const to = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return (
    "#" +
    to(ca.r + (cb.r - ca.r) * weight) +
    to(ca.g + (cb.g - ca.g) * weight) +
    to(ca.b + (cb.b - ca.b) * weight)
  );
}

/** "18px" | "0.25rem" | "9999px" -> number of px. */
function pxValue(dimension) {
  const m = String(dimension).trim().match(/^(-?[\d.]+)(px|rem|em)?$/);
  if (!m) return Number(dimension) || 0;
  const n = Number(m[1]);
  return m[2] === "rem" || m[2] === "em" ? n * 16 : n;
}

/** "0 1px 3px rgba(15, 23, 42, 0.06)" -> Figma DROP_SHADOW effect. */
function parseShadow(css) {
  const m = String(css).match(
    /(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?(?:\s+(-?[\d.]+)(?:px)?)?\s+rgba?\(([^)]+)\)/
  );
  if (!m) return null;
  const parts = m[5].split(",").map((p) => Number(p.trim()));
  return {
    type: "DROP_SHADOW",
    color: { r: parts[0] / 255, g: parts[1] / 255, b: parts[2] / 255, a: parts[3] === undefined ? 1 : parts[3] },
    offset: { x: Number(m[1]), y: Number(m[2]) },
    radius: Number(m[3]),
    spread: m[4] ? Number(m[4]) : 0,
    visible: true,
    blendMode: "NORMAL",
  };
}

/* ------------------------------------------------------------------ *
 * Paints
 * ------------------------------------------------------------------ */

function solid(hex, opacity) {
  const paint = { type: "SOLID", color: hexToRgb(hex) };
  if (opacity !== undefined && opacity !== 1) paint.opacity = opacity;
  return paint;
}

/**
 * A SOLID paint bound to a kit variable. Falls back to the literal colour
 * (and records a warning) when the variable was not created.
 */
function tokenPaint(name, opacity) {
  const variable = KIT.vars[name];
  const fallback = solid(TOKEN_HEX[name] || "#ff00ff", opacity);
  if (!variable) {
    warn(`No variable for token "${name}", using literal colour.`);
    return fallback;
  }
  const bound = figma.variables.setBoundVariableForPaint(fallback, "color", variable);
  if (opacity !== undefined && opacity !== 1) bound.opacity = opacity;
  return bound;
}

/** Paint for either a token name or a hex literal. */
function paintOf(name, opacity) {
  if (!name) return null;
  if (name[0] === "#") return solid(name, opacity);
  return tokenPaint(name, opacity);
}

/* ------------------------------------------------------------------ *
 * Node factories (append-first so FILL/HUG rules are satisfied)
 * ------------------------------------------------------------------ */

function applyPadding(node, pad) {
  if (pad === undefined) return;
  const p = Array.isArray(pad) ? pad : [pad, pad, pad, pad];
  const [t, r, b, l] = p.length === 2 ? [p[0], p[1], p[0], p[1]] : p;
  node.paddingTop = t;
  node.paddingRight = r;
  node.paddingBottom = b;
  node.paddingLeft = l;
}

function applyRadius(node, radius) {
  if (radius === undefined) return;
  if (typeof radius === "number") {
    node.cornerRadius = radius;
    return;
  }
  // token name -> bind each corner
  const variable = KIT.vars[radius];
  node.cornerRadius = pxValue(TOKEN_RAW[radius] || 0);
  if (!variable) return;
  for (const corner of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]) {
    try {
      node.setBoundVariable(corner, variable);
    } catch {
      /* radius binding is cosmetic; the literal value above already applies */
    }
  }
}

function applyStroke(node, stroke, weight, align) {
  if (!stroke) return;
  const paint = paintOf(typeof stroke === "string" ? stroke : stroke.color, stroke.opacity);
  node.strokes = paint ? [paint] : [];
  node.strokeWeight = weight === undefined ? 1 : weight;
  node.strokeAlign = align || "INSIDE";
}

/**
 * Box options shared by frame()/component():
 *   dir      'VERTICAL' | 'HORIZONTAL' | 'NONE'   (default VERTICAL)
 *   gap, pad, radius, fill (token|hex|null), fillOpacity, stroke, strokeWeight,
 *   w/h      fixed size (omit for hug), fillW/fillH (FILL parent axis),
 *   align    counter-axis alignment MIN|CENTER|MAX,  justify  primary MIN|CENTER|MAX|SPACE_BETWEEN
 *   wrap     true for wrapping horizontal layouts,  clip  clipsContent
 *   effect   effect style name, opacity, name
 */
function box(node, parent, opts) {
  const o = opts || {};
  node.name = o.name || node.name;
  if (parent) parent.appendChild(node);

  const dir = o.dir || "VERTICAL";
  node.layoutMode = dir === "NONE" ? "NONE" : dir;
  node.fills = o.fill ? [paintOf(o.fill, o.fillOpacity)] : [];
  node.clipsContent = Boolean(o.clip);
  if (o.opacity !== undefined) node.opacity = o.opacity;

  if (node.layoutMode !== "NONE") {
    node.itemSpacing = o.gap || 0;
    if (o.wrap) {
      node.layoutWrap = "WRAP";
      node.counterAxisSpacing = o.rowGap === undefined ? o.gap || 0 : o.rowGap;
    }
    applyPadding(node, o.pad);
    node.primaryAxisAlignItems = o.justify || "MIN";
    node.counterAxisAlignItems = o.align || "MIN";
  }

  // Size: resize first (it resets sizing modes), then declare hug/fill.
  const w = o.w;
  const h = o.h;
  if (w !== undefined || h !== undefined) {
    node.resize(w === undefined ? Math.max(node.width, 1) : w, h === undefined ? Math.max(node.height, 1) : h);
  }
  if (node.layoutMode !== "NONE") {
    const horizontalIsPrimary = node.layoutMode === "HORIZONTAL";
    const primaryFixed = horizontalIsPrimary ? w !== undefined : h !== undefined;
    const counterFixed = horizontalIsPrimary ? h !== undefined : w !== undefined;
    node.primaryAxisSizingMode = primaryFixed ? "FIXED" : "AUTO";
    node.counterAxisSizingMode = counterFixed ? "FIXED" : "AUTO";
  }
  if (parent && parent.layoutMode && parent.layoutMode !== "NONE") {
    if (o.fillW) node.layoutSizingHorizontal = "FILL";
    if (o.fillH) node.layoutSizingVertical = "FILL";
  }

  applyRadius(node, o.radius);
  applyStroke(node, o.stroke, o.strokeWeight, o.strokeAlign);
  if (o.effect && KIT.effectStyles[o.effect]) node.effectStyleId = KIT.effectStyles[o.effect].id;
  return node;
}

function frame(parent, opts) {
  return box(figma.createFrame(), parent, opts);
}

function component(parent, opts) {
  return box(figma.createComponent(), parent, opts);
}

/** Fixed-size spacer / flexible spacer (fillW/fillH) inside auto layout. */
function spacer(parent, w, h, opts) {
  const s = frame(parent, Object.assign({ name: "spacer", dir: "NONE", w: w || 1, h: h || 1 }, opts || {}));
  return s;
}

/** 1px divider line spanning the parent width. */
function divider(parent, color) {
  const d = frame(parent, { name: "divider", dir: "NONE", h: 1, fill: color || "border" });
  d.layoutSizingHorizontal = "FILL";
  return d;
}

function rect(parent, opts) {
  const o = opts || {};
  const r = figma.createRectangle();
  r.name = o.name || "rect";
  if (parent) parent.appendChild(r);
  r.resize(o.w || 24, o.h || 24);
  r.fills = o.fill ? [paintOf(o.fill, o.fillOpacity)] : [];
  if (o.radius !== undefined) applyRadius(r, o.radius);
  applyStroke(r, o.stroke, o.strokeWeight, o.strokeAlign);
  if (parent && parent.layoutMode && parent.layoutMode !== "NONE") {
    if (o.fillW) r.layoutSizingHorizontal = "FILL";
    if (o.fillH) r.layoutSizingVertical = "FILL";
  }
  return r;
}

function ellipse(parent, opts) {
  const o = opts || {};
  const e = figma.createEllipse();
  e.name = o.name || "dot";
  if (parent) parent.appendChild(e);
  e.resize(o.size || 8, o.size || 8);
  e.fills = o.fill ? [paintOf(o.fill, o.fillOpacity)] : [];
  applyStroke(e, o.stroke, o.strokeWeight, o.strokeAlign || "INSIDE");
  return e;
}

/* ------------------------------------------------------------------ *
 * Text
 * ------------------------------------------------------------------ */

/**
 * Text node factory.
 *   style   text style name (see TEXT_STYLE_DEFS)
 *   color   token | hex (default text-strong)
 *   w       fixed width (wrapping);  fill  true -> FILL parent width (wrapping)
 *   align   'LEFT'|'CENTER'|'RIGHT', opacity, name, upper, italic, strike
 */
async function text(parent, characters, opts) {
  const o = opts || {};
  const def = TEXT_STYLE_DEFS[o.style || "body/base"] || TEXT_STYLE_DEFS["body/base"];
  const font = fontFor(def, o.italic);
  const node = figma.createText();
  node.name = o.name || (characters.length > 40 ? characters.slice(0, 37) + "…" : characters) || "text";
  if (parent) parent.appendChild(node);

  await figma.loadFontAsync(font);
  node.fontName = font;
  node.fontSize = o.size || def.size;
  node.lineHeight = { unit: "PERCENT", value: def.lineHeight };
  node.letterSpacing = { unit: "PERCENT", value: def.letterSpacing || 0 };
  node.textCase = o.upper || def.upper ? "UPPER" : "ORIGINAL";
  if (o.strike) node.textDecoration = "STRIKETHROUGH";

  const wrapping = o.w !== undefined || o.fill;
  node.textAutoResize = wrapping ? "HEIGHT" : "WIDTH_AND_HEIGHT";
  node.characters = characters;
  if (o.w !== undefined) {
    node.resize(o.w, node.height);
  } else if (o.fill && parent && parent.layoutMode && parent.layoutMode !== "NONE") {
    node.layoutSizingHorizontal = "FILL";
  }
  node.textAlignHorizontal = o.align || "LEFT";
  node.fills = [paintOf(o.color || "text-strong", o.colorOpacity)];
  if (o.opacity !== undefined) node.opacity = o.opacity;

  const style = KIT.textStyles[o.style || "body/base"];
  if (style && !o.size && !o.italic) {
    try {
      await node.setTextStyleIdAsync(style.id);
    } catch {
      /* style linkage is optional */
    }
  }
  return node;
}

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

/**
 * Instance of the `icon/<name>` component, resized and recoloured.
 * Lucide icons are stroke-only, so recolouring means overriding vector strokes.
 */
function icon(parent, name, opts) {
  const o = opts || {};
  const comp = KIT.icons[name];
  const size = o.size || 20;
  if (!comp) {
    warn(`Icon "${name}" missing; drawing a placeholder.`);
    return rect(parent, { name: `icon/${name}`, w: size, h: size, fill: o.color || "text-muted", radius: 4 });
  }
  const inst = comp.createInstance();
  inst.name = o.name || `icon/${name}`;
  if (parent) parent.appendChild(inst);
  inst.resize(size, size);
  recolorIcon(inst, o.color || "text-strong", o.opacity);
  if (o.rotate) inst.rotation = o.rotate;
  return inst;
}

function recolorIcon(node, color, opacity) {
  const paint = paintOf(color, opacity);
  const vectors = node.findAllWithCriteria
    ? node.findAllWithCriteria({ types: ["VECTOR", "ELLIPSE", "RECTANGLE", "LINE", "POLYGON", "STAR", "BOOLEAN_OPERATION"] })
    : [];
  for (const v of vectors) {
    if ("strokes" in v && v.strokes.length) v.strokes = [paint];
    if ("fills" in v && v.fills !== figma.mixed && v.fills.length) v.fills = [paint];
  }
}

/* ------------------------------------------------------------------ *
 * Pages, sections, layout
 * ------------------------------------------------------------------ */

async function getOrCreatePage(name) {
  let page = figma.root.children.find((p) => p.name === name);
  if (page && KIT.options.replace) {
    // Never remove the page we are standing on.
    if (figma.currentPage === page) {
      const other = figma.root.children.find((p) => p !== page);
      if (other) await figma.setCurrentPageAsync(other);
    }
    await page.loadAsync();
    page.remove();
    page = null;
  } else if (page) {
    // Keep the existing page untouched; build next to it instead.
    const stamp = new Date().toISOString().slice(11, 16);
    warn(`Page "${name}" already exists — building "${name} · ${stamp}" (tick Replace to rebuild in place).`);
    page = figma.createPage();
    page.name = `${name} · ${stamp}`;
    await page.loadAsync();
    KIT.pages[name] = page;
    return page;
  }
  if (!page) {
    page = figma.createPage();
    page.name = name;
  }
  await page.loadAsync();
  KIT.pages[name] = page;
  return page;
}

/** Vertical stack of top-level nodes on a page with a fixed gutter. */
function placeBelow(nodes, x, startY, gutter) {
  let y = startY;
  for (const n of nodes) {
    n.x = x;
    n.y = y;
    y += n.height + gutter;
  }
  return y;
}

/** Title + caption block used at the top of documentation frames. */
async function docHeader(parent, title, caption) {
  const head = frame(parent, { name: "header", gap: 6 });
  head.layoutSizingHorizontal = "FILL";
  await text(head, title, { style: "heading/section" });
  if (caption) await text(head, caption, { style: "body/sm", color: "text-muted", fill: true });
  return head;
}

/** A labelled key/value row for spec tables. */
async function specRow(parent, key, value) {
  const row = frame(parent, { name: key, dir: "HORIZONTAL", gap: 16, align: "MIN" });
  row.layoutSizingHorizontal = "FILL";
  await text(row, key, { style: "body/xs", color: "text-muted", w: 150, upper: true });
  await text(row, value, { style: "body/sm", color: "text-strong", fill: true });
  return row;
}

/* ------------------------------------------------------------------ *
 * Component set helpers
 * ------------------------------------------------------------------ */

/**
 * Build a component set from a variant matrix.
 *   name      set name
 *   axes      [{ prop: 'State', values: ['Default','Hover'] }, ...]
 *   build     async ({State, ...}) => ComponentNode  (must not append to a parent)
 *   parent    where the set lives
 * Returns the ComponentSetNode; variants are laid out in a grid by the first two axes.
 */
async function variantSet(parent, name, axes, build, opts) {
  const o = opts || {};
  const combos = [];
  const walk = (i, acc) => {
    if (i === axes.length) {
      combos.push(Object.assign({}, acc));
      return;
    }
    for (const v of axes[i].values) {
      acc[axes[i].prop] = v;
      walk(i + 1, acc);
    }
  };
  walk(0, {});

  const comps = [];
  for (const combo of combos) {
    const comp = await build(combo);
    comp.name = axes.map((a) => `${a.prop}=${combo[a.prop]}`).join(", ");
    comps.push(comp);
  }

  const set = figma.combineAsVariants(comps, parent);
  set.name = name;
  if (o.description) set.description = o.description;

  // Grid: first axis -> columns, second axis -> rows, further axes -> extra rows.
  const gap = o.gap || 32;
  const cols = axes[0].values.length;
  const colW = Math.max.apply(null, comps.map((c) => c.width)) + gap;
  const rowH = Math.max.apply(null, comps.map((c) => c.height)) + gap;
  comps.forEach((c, i) => {
    c.x = (i % cols) * colW;
    c.y = Math.floor(i / cols) * rowH;
  });
  let maxX = 0;
  let maxY = 0;
  for (const c of set.children) {
    maxX = Math.max(maxX, c.x + c.width);
    maxY = Math.max(maxY, c.y + c.height);
  }
  set.resizeWithoutConstraints(maxX + gap, maxY + gap);
  set.layoutMode = "NONE";
  if (o.props) addProps(set, o.props);
  KIT.components[name] = set;
  return set;
}

/**
 * Register a single (non-variant) component under `name`.
 */
function singleComponent(name, comp, opts) {
  const o = opts || {};
  comp.name = name;
  if (o.description) comp.description = o.description;
  if (o.props) addProps(comp, o.props);
  KIT.components[name] = comp;
  return comp;
}

/**
 * Add component properties on a set (or single component) and wire them to
 * the child nodes that carry the matching `node` name in every variant.
 *   { name: 'Label', type: 'TEXT', value: 'Button', node: 'label' }
 *   { name: 'Show icon', type: 'BOOLEAN', value: true, node: 'icon' }
 *   { name: 'Icon', type: 'INSTANCE_SWAP', value: componentId, node: 'icon' }
 */
function addProps(owner, props) {
  const variants = owner.type === "COMPONENT_SET" ? owner.children : [owner];
  for (const p of props) {
    let key;
    try {
      key = owner.addComponentProperty(p.name, p.type, p.value);
    } catch (err) {
      warn(`Property "${p.name}" on ${owner.name}: ${err.message}`);
      continue;
    }
    for (const v of variants) {
      const targets = v.findAll((n) => n.name === p.node);
      for (const t of targets) {
        const refs = Object.assign({}, t.componentPropertyReferences || {});
        if (p.type === "TEXT" && "characters" in t) refs.characters = key;
        else if (p.type === "BOOLEAN") refs.visible = key;
        else if (p.type === "INSTANCE_SWAP" && t.type === "INSTANCE") refs.mainComponent = key;
        else continue;
        try {
          t.componentPropertyReferences = refs;
        } catch (err) {
          warn(`Could not wire "${p.name}" to ${t.name}: ${err.message}`);
        }
      }
    }
  }
}

/** Find a variant inside a set by property values. */
function variantOf(set, props) {
  if (!set) return null;
  if (set.type === "COMPONENT") return set;
  return (
    set.children.find((c) => {
      const parts = Object.fromEntries(c.name.split(", ").map((p) => p.split("=")));
      return Object.keys(props).every((k) => parts[k] === props[k]);
    }) || set.defaultVariant
  );
}

/** Instance of a kit component (set + props, or single component). */
function instance(parent, name, props, opts) {
  const o = opts || {};
  const set = KIT.components[name];
  if (!set) {
    warn(`Component "${name}" missing; drawing a placeholder.`);
    return frame(parent, { name, dir: "NONE", w: 120, h: 32, fill: "gray/200", radius: 6 });
  }
  const variant = variantOf(set, props || {});
  const inst = variant.createInstance();
  if (parent) parent.appendChild(inst);
  if (o.fillW && parent && parent.layoutMode && parent.layoutMode !== "NONE") inst.layoutSizingHorizontal = "FILL";
  if (o.w !== undefined) inst.resize(o.w, inst.height);
  return inst;
}

/** Override the TEXT component properties of an instance by property name. */
function setTextProps(inst, values) {
  const props = inst.componentProperties;
  const patch = {};
  for (const key of Object.keys(props)) {
    const base = key.replace(/#[^#]+$/, "");
    if (props[key].type === "TEXT" && values[base] !== undefined) patch[key] = String(values[base]);
    if (props[key].type === "BOOLEAN" && values[base] !== undefined) patch[key] = Boolean(values[base]);
  }
  if (Object.keys(patch).length) inst.setProperties(patch);
  return inst;
}

/** Prototype wiring: clicking/hovering `from` swaps to `to` with smart-animate. */
async function wire(from, to, trigger, durationMs, easing) {
  if (!from || !to) return;
  try {
    const existing = from.reactions || [];
    await from.setReactionsAsync(
      existing.concat([
        {
          trigger: { type: trigger || "ON_CLICK" },
          actions: [
            {
              type: "NODE",
              destinationId: to.id,
              navigation: "CHANGE_TO",
              transition: {
                type: "SMART_ANIMATE",
                easing: { type: easing || "EASE_IN_AND_OUT" },
                duration: Math.max(0.01, (durationMs === undefined ? 300 : durationMs) / 1000),
              },
              preserveScrollPosition: false,
              resetVideoPosition: false,
            },
          ],
        },
      ])
    );
  } catch (err) {
    warn(`Could not add prototype interaction on "${from.name}": ${err.message}`);
  }
}

