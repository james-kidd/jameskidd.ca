/**
 * figma-mock.mjs — a small, strict stand-in for the Figma Plugin API.
 *
 * It exists so `code.js` can be executed in Node (`npm run design:kit:smoke`)
 * and crash on the mistakes that are easy to make blind: calling a method
 * that does not exist on a node type, setting FILL/HUG where Figma rejects
 * it, mutating text before its font is loaded, resizing to a bad size,
 * referencing a component that was never built, and so on.
 *
 * It is not a renderer — sizes are rough — but every rule it enforces is a
 * rule the real API enforces too, so a clean smoke run means the bundle
 * cannot throw for those reasons inside Figma.
 */

let nextId = 1;
const id = () => `${nextId++}:${Math.floor(Math.random() * 1000)}`;

const LAYOUT_SIZING = new Set(["FIXED", "HUG", "FILL"]);
const AXIS_SIZING = new Set(["FIXED", "AUTO"]);
const ALIGN = new Set(["MIN", "CENTER", "MAX", "BASELINE"]);
const JUSTIFY = new Set(["MIN", "CENTER", "MAX", "SPACE_BETWEEN"]);

const loadedFonts = new Set();
const AVAILABLE_FONTS = [];
for (const family of ["Inter", "Roboto Mono", "Lora"]) {
  const styles = family === "Inter"
    ? ["Thin", "Light", "Regular", "Medium", "Semi Bold", "Bold", "Extra Bold", "Italic", "Medium Italic", "Semi Bold Italic", "Bold Italic"]
    : ["Regular", "Medium", "Bold", "Italic"];
  for (const style of styles) AVAILABLE_FONTS.push({ fontName: { family, style } });
}
const fontKey = (f) => `${f.family}|${f.style}`;

function assertPaintArray(paints, what) {
  if (!Array.isArray(paints)) throw new Error(`${what} must be an array`);
  for (const p of paints) {
    if (p.type === "SOLID") {
      if (!p.color || "a" in p.color) throw new Error(`${what}: SOLID paint colour must be {r,g,b} without alpha`);
      for (const k of ["r", "g", "b"]) {
        if (typeof p.color[k] !== "number" || p.color[k] < 0 || p.color[k] > 1) throw new Error(`${what}: colour channel ${k} out of 0..1`);
      }
    } else if (p.type === "IMAGE") {
      if (!p.imageHash) throw new Error(`${what}: IMAGE paint needs imageHash`);
    } else if (!p.type) {
      throw new Error(`${what}: paint without type`);
    }
  }
}

class BaseNode {
  constructor(type) {
    this.id = id();
    this.type = type;
    this.name = type[0] + type.slice(1).toLowerCase();
    this.parent = null;
    this.removed = false;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.visible = true;
    this.opacity = 1;
    this._w = 100;
    this._h = 100;
    this.constraints = { horizontal: "MIN", vertical: "MIN" };
    this.reactions = [];
    this.relaunchData = {};
  }
  get width() { return this._w; }
  get height() { return this._h; }
  set width(v) { throw new Error("width is read-only — use resize()"); }
  set height(v) { throw new Error("height is read-only — use resize()"); }
  resize(w, h) {
    if (!(w > 0) || !(h > 0)) throw new Error(`resize(${w}, ${h}) on ${this.type} "${this.name}": both sizes must be > 0`);
    this._w = w;
    this._h = h;
    if ("primaryAxisSizingMode" in this && this.layoutMode !== "NONE") {
      this.primaryAxisSizingMode = "FIXED";
      this.counterAxisSizingMode = "FIXED";
    }
  }
  resizeWithoutConstraints(w, h) { this.resize(w, h); }
  remove() {
    this.removed = true;
    if (this.parent) this.parent.children = this.parent.children.filter((c) => c !== this);
    this.parent = null;
  }
  clone() {
    const c = Object.create(Object.getPrototypeOf(this));
    Object.assign(c, this, { id: id(), parent: null });
    if (this.children) c.children = this.children.map((ch) => { const cc = ch.clone(); cc.parent = c; return cc; });
    return c;
  }
  async setReactionsAsync(reactions) {
    for (const r of reactions) {
      if (!r.trigger || !r.trigger.type) throw new Error("reaction needs a trigger.type");
      for (const a of r.actions) {
        if (a.type === "NODE" && a.navigation === "CHANGE_TO" && !a.destinationId) throw new Error("CHANGE_TO needs destinationId");
        if (a.transition && a.transition.type === "SMART_ANIMATE" && !(a.transition.duration >= 0)) throw new Error("transition.duration must be seconds >= 0");
        if (a.transition && a.transition.easing && !["EASE_IN", "EASE_OUT", "EASE_IN_AND_OUT", "LINEAR", "EASE_IN_BACK", "EASE_OUT_BACK", "EASE_IN_AND_OUT_BACK", "CUSTOM_CUBIC_BEZIER", "GENTLE", "QUICK", "BOUNCY", "SLOW", "CUSTOM_SPRING"].includes(a.transition.easing.type)) {
          throw new Error(`invalid easing ${a.transition.easing.type}`);
        }
      }
    }
    this.reactions = reactions;
  }
  setRelaunchData(d) { this.relaunchData = d; }
  setExplicitVariableModeForCollection(collection, modeId) {
    if (!collection || !collection.modes.some((m) => m.modeId === modeId)) throw new Error("mode does not belong to collection");
  }
  setBoundVariable(field, variable) {
    if (!variable || !variable.id) throw new Error(`setBoundVariable(${field}) needs a variable`);
    this.boundVariables = this.boundVariables || {};
    this.boundVariables[field] = { type: "VARIABLE_ALIAS", id: variable.id };
  }
  toString() { return `${this.type}:${this.name}`; }
}

class GeometryNode extends BaseNode {
  constructor(type) {
    super(type);
    this._fills = [];
    this._strokes = [];
    this.strokeWeight = 1;
    this.strokeAlign = "INSIDE";
    this.dashPattern = [];
    this._effects = [];
    this.effectStyleId = "";
    this.cornerRadius = 0;
    this.topLeftRadius = 0; this.topRightRadius = 0; this.bottomLeftRadius = 0; this.bottomRightRadius = 0;
    this.layoutPositioning = "AUTO";
    this._layoutSizingHorizontal = "FIXED";
    this._layoutSizingVertical = "FIXED";
    this.layoutGrow = 0;
  }
  get fills() { return this._fills; }
  set fills(v) { assertPaintArray(v, `${this} fills`); this._fills = v; }
  get strokes() { return this._strokes; }
  set strokes(v) { assertPaintArray(v, `${this} strokes`); this._strokes = v; }
  get effects() { return this._effects; }
  set effects(v) { this._effects = v; }
  _checkSizing(value, axis) {
    if (!LAYOUT_SIZING.has(value)) throw new Error(`layoutSizing${axis}: invalid value ${value}`);
    const parentAuto = this.parent && this.parent.layoutMode && this.parent.layoutMode !== "NONE";
    const selfAuto = this.layoutMode && this.layoutMode !== "NONE";
    if (value === "FILL") {
      if (!parentAuto) throw new Error(`layoutSizing${axis}=FILL on ${this}: FILL can only be set on children of auto-layout frames`);
      if (this.layoutPositioning === "ABSOLUTE") throw new Error(`layoutSizing${axis}=FILL on ${this}: absolute positioned`);
    }
    if (value === "HUG" && !selfAuto && !(this.type === "TEXT" && parentAuto)) {
      throw new Error(`layoutSizing${axis}=HUG on ${this}: HUG can only be set on auto-layout frames or text children of auto-layout frames`);
    }
    if (value !== "FIXED" && !parentAuto && !selfAuto) throw new Error(`layoutSizing${axis} on ${this}: node must be an auto-layout frame or a child of one`);
  }
  get layoutSizingHorizontal() { return this._layoutSizingHorizontal; }
  set layoutSizingHorizontal(v) { this._checkSizing(v, "Horizontal"); this._layoutSizingHorizontal = v; }
  get layoutSizingVertical() { return this._layoutSizingVertical; }
  set layoutSizingVertical(v) { this._checkSizing(v, "Vertical"); this._layoutSizingVertical = v; }
}

class ContainerNode extends GeometryNode {
  constructor(type) {
    super(type);
    this.children = [];
    this.layoutMode = "NONE";
    this._primaryAxisSizingMode = "AUTO";
    this._counterAxisSizingMode = "AUTO";
    this._primaryAxisAlignItems = "MIN";
    this._counterAxisAlignItems = "MIN";
    this.itemSpacing = 0;
    this.counterAxisSpacing = 0;
    this.layoutWrap = "NO_WRAP";
    this.paddingTop = 0; this.paddingRight = 0; this.paddingBottom = 0; this.paddingLeft = 0;
    this.clipsContent = false;
    this.minHeight = null;
    this.strokeTopWeight = 1; this.strokeBottomWeight = 1; this.strokeLeftWeight = 1; this.strokeRightWeight = 1;
  }
  get primaryAxisSizingMode() { return this._primaryAxisSizingMode; }
  set primaryAxisSizingMode(v) { if (!AXIS_SIZING.has(v)) throw new Error(`primaryAxisSizingMode: ${v}`); this._primaryAxisSizingMode = v; }
  get counterAxisSizingMode() { return this._counterAxisSizingMode; }
  set counterAxisSizingMode(v) { if (!AXIS_SIZING.has(v)) throw new Error(`counterAxisSizingMode: ${v}`); this._counterAxisSizingMode = v; }
  get primaryAxisAlignItems() { return this._primaryAxisAlignItems; }
  set primaryAxisAlignItems(v) { if (!JUSTIFY.has(v)) throw new Error(`primaryAxisAlignItems: ${v}`); this._primaryAxisAlignItems = v; }
  get counterAxisAlignItems() { return this._counterAxisAlignItems; }
  set counterAxisAlignItems(v) { if (!ALIGN.has(v)) throw new Error(`counterAxisAlignItems: ${v}`); this._counterAxisAlignItems = v; }
  appendChild(child) {
    if (!child || child.removed) throw new Error(`appendChild on ${this}: invalid child`);
    if (child.type === "PAGE") throw new Error("cannot append a page");
    if (child.parent) child.parent.children = child.parent.children.filter((c) => c !== child);
    child.parent = this;
    this.children.push(child);
  }
  insertChild(index, child) {
    this.appendChild(child);
    this.children.pop();
    this.children.splice(index, 0, child);
  }
  findAll(pred) {
    const out = [];
    const walk = (n) => { for (const c of n.children || []) { if (!pred || pred(c)) out.push(c); walk(c); } };
    walk(this);
    return out;
  }
  findOne(pred) { return this.findAll(pred)[0] || null; }
  findAllWithCriteria({ types }) { return this.findAll((n) => types.includes(n.type)); }
}

class FrameNode extends ContainerNode { constructor() { super("FRAME"); } }
class SectionNode extends ContainerNode {
  constructor() { super("SECTION"); }
  resizeWithoutConstraints(w, h) { this._w = w; this._h = h; }
}
class ComponentNode extends ContainerNode {
  constructor() { super("COMPONENT"); this.description = ""; this.componentPropertyDefinitions = {}; this.documentationLinks = []; }
  addComponentProperty(name, type, value) {
    if (!["TEXT", "BOOLEAN", "INSTANCE_SWAP", "VARIANT"].includes(type)) throw new Error(`addComponentProperty: bad type ${type}`);
    if (type === "INSTANCE_SWAP" && typeof value !== "string") throw new Error(`addComponentProperty ${name}: INSTANCE_SWAP default must be a component id`);
    if (type === "TEXT" && typeof value !== "string") throw new Error(`addComponentProperty ${name}: TEXT default must be a string`);
    if (type === "BOOLEAN" && typeof value !== "boolean") throw new Error(`addComponentProperty ${name}: BOOLEAN default must be boolean`);
    const key = `${name}#${id()}`;
    this.componentPropertyDefinitions[key] = { type, defaultValue: value };
    return key;
  }
  createInstance() {
    const inst = new InstanceNode(this);
    inst.name = this.name;
    inst._w = this._w; inst._h = this._h;
    inst.layoutMode = this.layoutMode;
    inst.children = this.children.map((c) => { const cc = c.clone(); cc.parent = inst; return cc; });
    return inst;
  }
}
class ComponentSetNode extends ContainerNode {
  constructor() { super("COMPONENT_SET"); this.description = ""; this.componentPropertyDefinitions = {}; }
  get defaultVariant() { return this.children[0]; }
  addComponentProperty(name, type, value) { return ComponentNode.prototype.addComponentProperty.call(this, name, type, value); }
}
class InstanceNode extends ContainerNode {
  constructor(main) {
    super("INSTANCE");
    this.mainComponent = main;
    const owner = main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : main;
    this.componentProperties = {};
    for (const [key, def] of Object.entries(owner.componentPropertyDefinitions || {})) {
      this.componentProperties[key] = { type: def.type, value: def.defaultValue };
    }
  }
  setProperties(patch) {
    for (const key of Object.keys(patch)) {
      if (!(key in this.componentProperties)) throw new Error(`setProperties: unknown property ${key} on ${this.name}`);
    }
    Object.assign(this.componentProperties, Object.fromEntries(Object.entries(patch).map(([k, v]) => [k, { type: this.componentProperties[k].type, value: v }])));
  }
  swapComponent(comp) {
    if (!comp || comp.type !== "COMPONENT") throw new Error("swapComponent needs a component");
    this.mainComponent = comp;
    this.children = comp.children.map((c) => { const cc = c.clone(); cc.parent = this; return cc; });
  }
}
class RectangleNode extends GeometryNode { constructor() { super("RECTANGLE"); } }
class EllipseNode extends GeometryNode { constructor() { super("ELLIPSE"); } }
class VectorNode extends GeometryNode {
  constructor() { super("VECTOR"); this.strokeCap = "NONE"; this._vectorPaths = []; }
  set vectorPaths(v) {
    for (const p of v) if (!["NONZERO", "EVENODD", "NONE"].includes(p.windingRule) || typeof p.data !== "string") throw new Error("bad vectorPaths");
    this._vectorPaths = v;
  }
  get vectorPaths() { return this._vectorPaths; }
}
class TextNode extends GeometryNode {
  constructor() {
    super("TEXT");
    this._fontName = { family: "Inter", style: "Regular" };
    this._characters = "";
    this.fontSize = 12;
    this.textAutoResize = "WIDTH_AND_HEIGHT";
    this.textAlignHorizontal = "LEFT";
    this.textCase = "ORIGINAL";
    this.textDecoration = "NONE";
    this.textStyleId = "";
    this._lineHeight = { unit: "AUTO" };
    this._letterSpacing = { unit: "PERCENT", value: 0 };
  }
  _needFont() { if (!loadedFonts.has(fontKey(this._fontName))) throw new Error(`font ${fontKey(this._fontName)} not loaded before mutating "${this.name}"`); }
  get fontName() { return this._fontName; }
  set fontName(v) {
    if (!loadedFonts.has(fontKey(v))) throw new Error(`fontName ${fontKey(v)} set before loadFontAsync`);
    this._fontName = v;
  }
  get characters() { return this._characters; }
  set characters(v) {
    this._needFont();
    if (typeof v !== "string") throw new Error("characters must be a string");
    this._characters = v;
    this._w = Math.max(1, Math.min(v.length * this.fontSize * 0.55, this.textAutoResize === "WIDTH_AND_HEIGHT" ? Infinity : this._w));
    this._h = Math.max(this.fontSize * 1.4, 1);
  }
  get lineHeight() { return this._lineHeight; }
  set lineHeight(v) { if (typeof v !== "object" || !v.unit) throw new Error("lineHeight must be an object"); this._lineHeight = v; }
  get letterSpacing() { return this._letterSpacing; }
  set letterSpacing(v) { if (typeof v !== "object" || !v.unit) throw new Error("letterSpacing must be an object"); this._letterSpacing = v; }
  async setTextStyleIdAsync(styleId) { if (!styles.text.some((s) => s.id === styleId)) throw new Error("unknown text style"); this.textStyleId = styleId; }
}
class PageNode extends ContainerNode {
  constructor() { super("PAGE"); this.name = "Page"; }
  async loadAsync() {}
  remove() { root.children = root.children.filter((c) => c !== this); this.removed = true; }
}

const root = { type: "DOCUMENT", children: [], setRelaunchData() {}, insertChild(i, page) { root.children = root.children.filter((c) => c !== page); root.children.splice(i, 0, page); } };
const firstPage = new PageNode();
firstPage.name = "Page 1";
root.children.push(firstPage);
let currentPage = firstPage;

/* ---- variables + styles -------------------------------------------- */
const collections = [];
const variables = [];
class VariableCollection {
  constructor(name) { this.id = `VariableCollectionId:${id()}`; this.name = name; this.modes = [{ modeId: `mode:${id()}`, name: "Mode 1" }]; this.variableIds = []; this.removed = false; }
  renameMode(modeId, name) { const m = this.modes.find((x) => x.modeId === modeId); if (!m) throw new Error("renameMode: bad mode"); m.name = name; }
  addMode(name) { if (this.modes.length >= 4) throw new Error("Limited to 4 modes"); const m = { modeId: `mode:${id()}`, name }; this.modes.push(m); return m.modeId; }
  remove() { this.removed = true; collections.splice(collections.indexOf(this), 1); for (const v of variables.filter((x) => x.variableCollectionId === this.id)) v.removed = true; }
}
class Variable {
  constructor(name, collection, type) {
    this.id = `VariableID:${id()}`; this.name = name; this.variableCollectionId = collection.id; this.resolvedType = type;
    this.scopes = ["ALL_SCOPES"]; this.codeSyntax = {}; this.description = ""; this.valuesByMode = {}; this.removed = false;
  }
  setValueForMode(modeId, value) {
    const c = collections.find((x) => x.id === this.variableCollectionId);
    if (!c.modes.some((m) => m.modeId === modeId)) throw new Error(`setValueForMode: mode ${modeId} not in collection ${c.name}`);
    if (this.resolvedType === "COLOR" && (typeof value !== "object" || !("a" in value))) throw new Error(`COLOR variable ${this.name} needs {r,g,b,a}`);
    if (this.resolvedType === "FLOAT" && typeof value !== "number") throw new Error(`FLOAT variable ${this.name} needs a number, got ${typeof value}`);
    if (this.resolvedType === "STRING" && typeof value !== "string") throw new Error(`STRING variable ${this.name} needs a string, got ${typeof value}`);
    this.valuesByMode[modeId] = value;
  }
  setVariableCodeSyntax(platform, syntax) { if (!["WEB", "ANDROID", "iOS"].includes(platform)) throw new Error("bad platform"); this.codeSyntax[platform] = syntax; }
}
const styles = { text: [], effect: [] };
class TextStyle {
  constructor() { this.id = `S:${id()}`; this.name = ""; this._fontName = { family: "Inter", style: "Regular" }; this.fontSize = 12; this.description = ""; this.textCase = "ORIGINAL"; }
  get fontName() { return this._fontName; }
  set fontName(v) { if (!loadedFonts.has(fontKey(v))) throw new Error(`text style fontName ${fontKey(v)} not loaded`); this._fontName = v; }
  set lineHeight(v) { if (typeof v !== "object") throw new Error("lineHeight object"); this._lh = v; }
  get lineHeight() { return this._lh; }
  set letterSpacing(v) { if (typeof v !== "object") throw new Error("letterSpacing object"); this._ls = v; }
  get letterSpacing() { return this._ls; }
  remove() { styles.text.splice(styles.text.indexOf(this), 1); }
}
class EffectStyle {
  constructor() { this.id = `S:${id()}`; this.name = ""; this.effects = []; this.description = ""; }
  remove() { styles.effect.splice(styles.effect.indexOf(this), 1); }
}

/* ---- figma global -------------------------------------------------- */
export const uiMessages = [];
export const figma = {
  editorType: "figma",
  mixed: Symbol("mixed"),
  root,
  get currentPage() { return currentPage; },
  async setCurrentPageAsync(page) { if (!page || page.type !== "PAGE") throw new Error("setCurrentPageAsync needs a page"); currentPage = page; },
  viewport: { center: { x: 0, y: 0 }, scrollAndZoomIntoView() {} },
  ui: { postMessage(m) { uiMessages.push(m); }, resize() {}, onmessage: null },
  showUI() {},
  createPage() { const p = new PageNode(); root.children.push(p); return p; },
  createFrame() { const n = new FrameNode(); currentPage.appendChild(n); return n; },
  createComponent() { const n = new ComponentNode(); currentPage.appendChild(n); return n; },
  createRectangle() { const n = new RectangleNode(); currentPage.appendChild(n); return n; },
  createEllipse() { const n = new EllipseNode(); currentPage.appendChild(n); return n; },
  createVector() { const n = new VectorNode(); currentPage.appendChild(n); return n; },
  createText() { const n = new TextNode(); currentPage.appendChild(n); return n; },
  createSection() { const n = new SectionNode(); currentPage.appendChild(n); return n; },
  createNodeFromSvg(svg) {
    if (typeof svg !== "string" || svg.indexOf("<svg") !== 0) throw new Error("createNodeFromSvg: bad svg");
    const f = new FrameNode();
    f.name = "svg";
    f.resize(24, 24);
    const count = (svg.match(/<(path|circle|rect|line|polyline|polygon)\b/g) || []).length;
    for (let i = 0; i < count; i++) { const v = new VectorNode(); v.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; f.appendChild(v); }
    currentPage.appendChild(f);
    return f;
  },
  combineAsVariants(nodes, parent) {
    if (!Array.isArray(nodes) || !nodes.length || nodes.some((n) => n.type !== "COMPONENT")) throw new Error("combineAsVariants: needs ComponentNodes");
    const set = new ComponentSetNode();
    parent.appendChild(set);
    for (const n of nodes) set.appendChild(n);
    const names = new Set(nodes.map((n) => n.name));
    if (names.size !== nodes.length) throw new Error("combineAsVariants: duplicate variant names");
    return set;
  },
  async loadFontAsync(f) {
    if (!AVAILABLE_FONTS.some((a) => a.fontName.family === f.family && a.fontName.style === f.style)) throw new Error(`Font not found: ${fontKey(f)}`);
    loadedFonts.add(fontKey(f));
  },
  async listAvailableFontsAsync() { return AVAILABLE_FONTS; },
  async createImageAsync() { throw new Error("network disabled in mock"); },
  variables: {
    createVariableCollection(name) { const c = new VariableCollection(name); collections.push(c); return c; },
    createVariable(name, collection, type) {
      if (!collection || !collection.id) throw new Error("createVariable: collection object required");
      if (!["COLOR", "FLOAT", "STRING", "BOOLEAN"].includes(type)) throw new Error(`createVariable: bad type ${type}`);
      if (variables.some((v) => !v.removed && v.name === name && v.variableCollectionId === collection.id)) throw new Error(`duplicate variable ${name}`);
      const v = new Variable(name, collection, type); variables.push(v); collection.variableIds.push(v.id); return v;
    },
    async getLocalVariableCollectionsAsync() { return collections.filter((c) => !c.removed); },
    async getLocalVariablesAsync() { return variables.filter((v) => !v.removed); },
    async getVariableByIdAsync(vid) { return variables.find((v) => v.id === vid) || null; },
    setBoundVariableForPaint(paint, field, variable) {
      if (paint.type !== "SOLID") throw new Error("setBoundVariableForPaint: SOLID only");
      if (!variable || !variable.id) throw new Error("setBoundVariableForPaint: variable required");
      return Object.assign({}, paint, { boundVariables: { [field]: { type: "VARIABLE_ALIAS", id: variable.id } } });
    },
  },
  createTextStyle() { const s = new TextStyle(); styles.text.push(s); return s; },
  createEffectStyle() { const s = new EffectStyle(); styles.effect.push(s); return s; },
  async getLocalTextStylesAsync() { return styles.text.slice(); },
  async getLocalEffectStylesAsync() { return styles.effect.slice(); },
  async getNodeByIdAsync() { return null; },
  notify() { throw new Error("figma.notify is not available"); },
};

export const inspect = { root, collections, variables, styles };
