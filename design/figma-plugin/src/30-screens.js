/* ================================================================== *
 * 30-screens.js — every route composed from the components + SITE content.
 *
 * Home (desktop 1440 / mobile 390), /skills, /projects/:slug (two examples),
 * /personal, /404. Layout numbers are the Tailwind values in the JSX.
 * ================================================================== */

const ICON_FOR_SKILL_BLOCK = { terminal: "terminal", database: "database", cloud: "cloud", trending: "trending-up", star: "star", systems: "cpu", web: "globe", tooling: "layers" };
const ICON_FOR_PILLAR = { settings: "settings", rocket: "rocket", barChart: "chart-column" };

/* ------------------------------------------------------------------ *
 * Instance override helpers
 * ------------------------------------------------------------------ */

/** Replace the characters of the TEXT nodes inside `containerName`, in order. */
async function overrideTexts(inst, containerName, values) {
  const container = containerName ? inst.findOne((n) => n.name === containerName) : inst;
  if (!container) return;
  const nodes = container.findAllWithCriteria({ types: ["TEXT"] });
  for (let i = 0; i < nodes.length && i < values.length; i++) {
    try {
      await figma.loadFontAsync(nodes[i].fontName);
      nodes[i].characters = String(values[i]);
    } catch (err) {
      warn(`Text override failed on ${nodes[i].name}: ${err.message}`);
    }
  }
}

/** Swap the icon inside a nested IconBox / icon slot and recolour it. */
function overrideIcon(inst, iconName, color, slotName) {
  const target = inst.findOne((n) => n.type === "INSTANCE" && (slotName ? n.name === slotName : n.name === "icon" || n.name.indexOf("icon/") === 0));
  if (!target || !KIT.icons[iconName]) return;
  try {
    target.swapComponent(KIT.icons[iconName]);
    recolorIcon(target, color || "primary");
  } catch (err) {
    warn(`Icon override ${iconName}: ${err.message}`);
  }
}

/** Try to paint a live photo into a GalleryTile instance (needs network access). */
async function paintPhoto(inst, url) {
  if (!KIT.options.photos) return;
  try {
    const image = await figma.createImageAsync(url);
    const photo = inst.findOne((n) => n.name === "photo");
    if (photo) photo.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: image.hash }];
  } catch (err) {
    warn(`Photo ${url}: ${err.message}`);
    KIT.options.photos = false; // stop retrying after the first failure
  }
}

/* ------------------------------------------------------------------ *
 * Layout primitives that mirror index.css
 * ------------------------------------------------------------------ */

/** `.section-panel` — fills the parent width. */
function sectionPanel(parent, opts) {
  const o = opts || {};
  const p = frame(parent, { name: o.name || "section-panel", gap: o.gap === undefined ? 40 : o.gap, pad: o.pad === undefined ? 32 : o.pad, radius: "radius-lg", fill: "surface", stroke: "border", effect: "shadow/soft", clip: o.clip });
  p.layoutSizingHorizontal = "FILL";
  return p;
}

/** `<section class="section-block">` — border-top + vertical padding. */
function sectionBlock(parent, id, mobile) {
  const s = frame(parent, { name: `#${id}`, gap: 0, pad: [mobile ? 64 : 80, 0] });
  s.layoutSizingHorizontal = "FILL";
  divider(s, "border").name = "border-top";
  const inner = frame(s, { name: "section-shell", gap: 0, pad: [mobile ? 64 : 80, 0, 0, 0] });
  inner.layoutSizingHorizontal = "FILL";
  return inner;
}

async function pageHeading(parent, textValue, mobile) {
  return text(parent, textValue, { style: mobile ? "heading/page-sm" : "heading/page", color: "text-strong", fill: true });
}

/* ------------------------------------------------------------------ *
 * Home sections (shared by desktop + mobile)
 * ------------------------------------------------------------------ */

async function heroSection(parent, ctx) {
  const id = SITE.identity;
  const hero = frame(parent, { name: "HeroSection", gap: 0, pad: [0, 0, ctx.mobile ? 48 : 48, 0], justify: "CENTER" });
  hero.layoutSizingHorizontal = "FILL";
  if (!ctx.mobile) hero.minHeight = 520;

  const content = frame(hero, { name: "content", gap: 0 });
  content.layoutSizingHorizontal = "FILL";
  const eyebrow = instance(content, "Eyebrow");
  setTextProps(eyebrow, { Label: id.title });
  const nameRow = frame(content, { name: "h1", dir: "HORIZONTAL", gap: 0, align: "MAX", pad: [16, 0, 24, 0] });
  await text(nameRow, id.name, { style: ctx.mobile ? "display/hero-mobile" : "display/hero", color: "gray/900" });
  await text(nameRow, ".", { style: ctx.mobile ? "display/hero-mobile" : "display/hero", color: "primary" });
  await text(content, id.tagline, { style: ctx.mobile ? "body/lead" : "body/lead-lg", color: "text-muted", w: Math.min(576, ctx.w) });
  const typing = frame(content, { name: "TypingAnimation", gap: 6, pad: [16, 0, 24, 0] });
  typing.layoutSizingHorizontal = "FILL";
  for (const line of SITE.typing.lines) {
    setTextProps(instance(typing, "TypingLine", { Mode: "Done" }), { Text: line.prefix + line.new + line.suffix });
  }
  const stack = frame(content, { name: "stack", dir: "HORIZONTAL", gap: 8, wrap: true });
  stack.layoutSizingHorizontal = "FILL";
  for (const tech of id.stack) setTextProps(instance(stack, "Badge", { Variant: "Stack" }), { Label: tech });

  const actions = frame(hero, { name: "actions", gap: 16, pad: [ctx.mobile ? 40 : 32, 0, 0, 0], w: Math.min(448, ctx.w) });
  const buttons = frame(actions, { name: "buttons", dir: "HORIZONTAL", gap: ctx.mobile ? 12 : 16 });
  buttons.layoutSizingHorizontal = "FILL";
  const resume = instance(buttons, "Button", { State: "Default", Style: "Primary", Size: "Default" }, { fillW: ctx.mobile });
  setTextProps(resume, { Label: "Resume", "Leading icon": ctx.mobile, "Trailing icon": !ctx.mobile });
  const linkedin = instance(buttons, "Button", { State: "Default", Style: "Outline", Size: "Default" }, { fillW: ctx.mobile });
  setTextProps(linkedin, { Label: "LinkedIn", "Leading icon": true, "Trailing icon": false });
  instance(actions, "ContactInfo", {}, { fillW: true });
  if (ctx.mobile) {
    const hint = frame(actions, { name: "swipe-hint", gap: 4, align: "CENTER", pad: [24, 0, 0, 0], opacity: 0.4 });
    hint.layoutSizingHorizontal = "FILL";
    await text(hint, "Swipe to explore", { style: "label/micro", color: "primary-dark", align: "CENTER" });
    icon(hint, "chevron-down", { size: 20, color: "primary-dark" });
  }
  return hero;
}

async function experienceSection(parent, ctx) {
  const panel = sectionPanel(sectionBlock(parent, "experience", ctx.mobile), { gap: 48, pad: ctx.mobile ? 24 : 32 });
  for (const group of SITE.experience.groups) {
    const g = frame(panel, { name: group.key, gap: 24 });
    g.layoutSizingHorizontal = "FILL";
    setTextProps(instance(g, "SectionTitle"), { Label: group.label });
    const list = frame(g, { name: "roles", gap: 0, pad: [0, 0, 0, 8] });
    list.layoutSizingHorizontal = "FILL";
    for (const roleId of group.roles) {
      const role = SITE.experience.roles.find((r) => r.id === roleId);
      const card = instance(list, "ExperienceCard", { State: "Collapsed" }, { fillW: true });
      setTextProps(card, { Title: role.title, Company: role.company, Date: role.date });
    }
  }
  return panel;
}

async function aboutSection(parent, ctx) {
  const panel = sectionPanel(sectionBlock(parent, "about", ctx.mobile), { gap: 48, pad: ctx.mobile ? 24 : 32 });
  const intro = frame(panel, { name: "about.mdx", gap: 16 });
  intro.layoutSizingHorizontal = "FILL";
  for (const p of SITE.about.intro) await text(intro, p, { style: "body/lead", color: "text-muted", fill: true });
  const edu = frame(panel, { name: "education", gap: 48 });
  edu.layoutSizingHorizontal = "FILL";
  const title = instance(edu, "SectionTitle");
  setTextProps(title, { Label: "Education Timeline" });
  overrideIcon(title, "graduation-cap", "primary", "icon");
  const list = frame(edu, { name: "timeline", gap: 0, pad: [0, 0, 0, 8] });
  list.layoutSizingHorizontal = "FILL";
  for (const e of SITE.about.education) {
    setTextProps(instance(list, "EducationCard", { State: "Collapsed" }, { fillW: true }), { School: e.school, Degree: e.degree, Year: e.year });
  }
  return panel;
}

async function skillsSection(parent, ctx) {
  const panel = sectionPanel(sectionBlock(parent, "skills", ctx.mobile), { gap: 32, pad: ctx.mobile ? 24 : 32 });
  setTextProps(instance(panel, "SectionTitle"), { Label: "Skills & Expertise", "Show icon": false });
  await text(panel, SITE.skills.sectionLead, { style: "body/lead", color: "text-muted", fill: true });
  const pillars = frame(panel, { name: "pillars", gap: 16 });
  pillars.layoutSizingHorizontal = "FILL";
  for (const p of SITE.skills.pillars) {
    const inst = instance(pillars, "PillarSummary", {}, { fillW: true });
    setTextProps(inst, { Title: p.title, Subtitle: p.subtitle });
    await overrideTexts(inst, "evidence", p.evidence);
    overrideIcon(inst, ICON_FOR_PILLAR[p.icon] || "sparkles", "primary");
  }
  const langs = frame(panel, { name: "languages", gap: 12 });
  langs.layoutSizingHorizontal = "FILL";
  await text(langs, "Languages", { style: "label/section-eyebrow", color: "gray/400" });
  const pills = frame(langs, { name: "pills", dir: "HORIZONTAL", gap: 8, wrap: true });
  pills.layoutSizingHorizontal = "FILL";
  const block = SITE.skills.blocks.find((b) => b.id === "languages");
  for (const item of (block ? block.items : []).slice(0, 9)) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: item });
  const cta = frame(panel, { name: "cta", dir: "HORIZONTAL", justify: "CENTER" });
  cta.layoutSizingHorizontal = "FILL";
  setTextProps(instance(cta, "TextLink", { State: "Default", Tone: "Primary" }), { Label: "View Core Technologies" });
  return panel;
}

async function projectsSection(parent, ctx) {
  const panel = sectionPanel(sectionBlock(parent, "projects", ctx.mobile), { gap: 32, pad: ctx.mobile ? 24 : 32 });
  setTextProps(instance(panel, "SectionTitle"), { Label: "Selected Projects" });
  const list = sectionPanel(panel, { name: "project-list", gap: 0, pad: 0, clip: true });
  const expandedIndex = SITE.projects.findIndex((p) => p.featured);
  SITE.projects.forEach((p, i) => {
    const card = instance(list, "ProjectCard", { State: i === expandedIndex ? "Expanded" : "Collapsed", Featured: p.featured ? "Yes" : "No" }, { fillW: true });
    setTextProps(card, { Title: p.title, Description: p.description, Tag: p.tag || "", "Show tag": Boolean(p.tag), "Show demo badge": Boolean(p.demo) && i !== expandedIndex });
  });
  return panel;
}

async function personalSection(parent, ctx) {
  const panel = sectionPanel(sectionBlock(parent, "personal", ctx.mobile), { gap: 40, pad: ctx.mobile ? 24 : 32 });
  const top = frame(panel, { name: "intro", dir: ctx.mobile ? "VERTICAL" : "HORIZONTAL", gap: 32, align: "MIN" });
  top.layoutSizingHorizontal = "FILL";
  const left = frame(top, { name: "text", gap: 24 });
  left.layoutSizingHorizontal = "FILL";
  setTextProps(instance(left, "SectionTitle"), { Label: SITE.personal.title, "Show icon": false });
  for (const p of SITE.personal.description) await text(left, p, { style: "body/lead", color: "text-muted", fill: true });
  const qs = instance(top, "QuickStats");
  if (ctx.mobile) qs.layoutSizingHorizontal = "FILL";

  const gallery = frame(panel, { name: "Gallery", gap: 24 });
  gallery.layoutSizingHorizontal = "FILL";
  const gHead = frame(gallery, { name: "header", dir: "HORIZONTAL", align: "CENTER", justify: "SPACE_BETWEEN" });
  gHead.layoutSizingHorizontal = "FILL";
  const gTitle = frame(gHead, { name: "title", dir: "HORIZONTAL", gap: 8, align: "CENTER" });
  icon(gTitle, "camera", { size: 20, color: "text-strong" });
  await text(gTitle, "Gallery", { style: "heading/panel", color: "text-strong" });
  const ig = frame(gHead, { name: "instagram", dir: "HORIZONTAL", gap: 4, align: "CENTER" });
  await text(ig, SITE.personal.instagramHandle, { style: "body/sm", color: "text-strong" });
  icon(ig, "instagram", { size: 20, color: "text-strong" });
  const grid = frame(gallery, { name: "grid", dir: "HORIZONTAL", gap: 16, wrap: true });
  grid.layoutSizingHorizontal = "FILL";
  const cols = ctx.mobile ? 2 : 3;
  const inner = ctx.w - (ctx.mobile ? 48 : 64);
  const tileW = Math.floor((inner - 16 * (cols - 1)) / cols);
  for (const img of SITE.personal.gallery) {
    const tile = instance(grid, "GalleryTile", { State: "Default" });
    setTextProps(tile, { Caption: img.caption });
    tile.resize(tileW, Math.round(tileW * 0.75));
    await paintPhoto(tile, img.url);
  }

  const travel = frame(panel, { name: "TravelPreview", gap: 20, pad: 24, radius: "radius-lg", fill: "surface-muted", stroke: "border" });
  travel.layoutSizingHorizontal = "FILL";
  const stats = frame(travel, { name: "stats", dir: "HORIZONTAL", gap: 12 });
  stats.layoutSizingHorizontal = "FILL";
  const s = SITE.travel.stats;
  for (const [label, value, ic] of [["Countries", s.countriesVisited, "globe"], ["Cities", s.citiesExplored, "map-pin"], ["Photos", s.totalPhotos.toLocaleString(), "camera"]]) {
    const tile = instance(stats, "StatTile", { Variant: "Compact" }, { fillW: true });
    setTextProps(tile, { Value: String(value), Label: label });
    overrideIcon(tile, ic, "primary", "icon");
  }
  const cities = frame(travel, { name: "cities", dir: "HORIZONTAL", gap: 8, wrap: true });
  cities.layoutSizingHorizontal = "FILL";
  const top6 = SITE.travel.cities.filter((c) => !["CA", "US"].includes(c.countryCode)).slice(0, 6);
  for (const c of top6) setTextProps(instance(cities, "TagPill", { State: "Default" }), { Label: `${c.city}, ${c.country}` });
  setTextProps(instance(cities, "TagPill", { State: "Default" }), { Label: `+${SITE.travel.cities.length - top6.length} more` });
  const btn = instance(travel, "Button", { State: "Default", Style: "Outline", Size: "Default" }, { fillW: true });
  setTextProps(btn, { Label: "Explore where I've been", "Leading icon": false, "Trailing icon": true });
  overrideIcon(btn, "arrow-right", "gray/500", "trailing-icon");
  return panel;
}

const HOME_SECTIONS = { experience: experienceSection, about: aboutSection, skills: skillsSection, projects: projectsSection, personal: personalSection };

async function homeContent(parent, ctx) {
  await heroSection(parent, ctx);
  for (const s of SITE.site.sections) {
    const build = HOME_SECTIONS[s.id];
    if (build) await step(`Screens · Home · ${s.label}`, () => build(parent, ctx));
    else warn(`No screen builder for section "${s.id}"`);
  }
}

/* ------------------------------------------------------------------ *
 * Screens
 * ------------------------------------------------------------------ */

async function homeDesktop(page) {
  const screen = frame(page, { name: "Home · Desktop (1440)", dir: "HORIZONTAL", w: 1440, fill: "surface-muted" });
  const sidebar = frame(screen, { name: "Sidebar", gap: 0, pad: 40, w: 320, fill: "white" });
  sidebar.layoutSizingVertical = "FILL";
  sidebar.strokes = [tokenPaint("border")];
  sidebar.strokeAlign = "INSIDE";
  sidebar.strokeTopWeight = 0;
  sidebar.strokeBottomWeight = 0;
  sidebar.strokeLeftWeight = 0;
  sidebar.strokeRightWeight = 1;
  const tc = instance(sidebar, "ThemeControls");
  tc.opacity = 0.8;
  spacer(sidebar, 1, 24).layoutSizingVertical = "FILL";
  const nav = frame(sidebar, { name: "Navigation", gap: 4 });
  nav.layoutSizingHorizontal = "FILL";
  SITE.site.sections.forEach((s, i) => {
    setTextProps(instance(nav, "NavItem", { State: i === 0 ? "Active" : "Default" }, { fillW: true }), { Label: s.label });
  });
  spacer(sidebar, 1, 24).layoutSizingVertical = "FILL";
  instance(sidebar, "IdentityBlock", {}, { fillW: true });

  const main = frame(screen, { name: "main", gap: 0, pad: [80, 48], align: "CENTER" });
  main.layoutSizingHorizontal = "FILL";
  const column = frame(main, { name: "content (max-w-4xl)", gap: 0, w: CONTENT_W });
  await homeContent(column, { w: CONTENT_W, mobile: false });
  return screen;
}

async function homeMobile(page) {
  const screen = frame(page, { name: "Home · Mobile (390)", gap: 0, w: 390, fill: "surface-muted" });
  instance(screen, "MobileHeader", { State: "Closed" }, { fillW: true });
  const main = frame(screen, { name: "main", gap: 0, pad: [48, 24] });
  main.layoutSizingHorizontal = "FILL";
  const column = frame(main, { name: "content", gap: 0 });
  column.layoutSizingHorizontal = "FILL";
  await homeContent(column, { w: 342, mobile: true });
  return screen;
}

/** PageShell: bg surface-muted, centred column, back link. */
async function pageShell(page, name, width) {
  const screen = frame(page, { name, gap: 0, pad: [80, 48], align: "CENTER", w: 1440, fill: "surface-muted" });
  const column = frame(screen, { name: `content (max-w ${width})`, gap: 40, w: width });
  instance(column, "BackLink", { State: "Default" });
  return column;
}

async function skillCardFrame(parent, block, width) {
  const c = frame(parent, { name: `SkillCard/${block.id}`, gap: 20, pad: 24, w: width, radius: 16, fill: "surface", stroke: "border", effect: "shadow/soft" });
  const head = frame(c, { name: "header", dir: "HORIZONTAL", gap: 12, align: "CENTER" });
  const ib = instance(head, "IconBox", { State: "Default" });
  overrideIcon(ib, ICON_FOR_SKILL_BLOCK[block.icon] || "terminal", "primary", "icon");
  await text(head, block.title, { style: "heading/card-bold", color: "text-strong" });
  const pills = frame(c, { name: "items", dir: "HORIZONTAL", gap: 8, wrap: true });
  pills.layoutSizingHorizontal = "FILL";
  for (const item of block.items) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: item });
  return c;
}

async function skillsPage(page) {
  const column = await pageShell(page, "Skills · /skills", 1024);
  const head = frame(column, { name: "header", gap: 12, w: 768 });
  setTextProps(instance(head, "Eyebrow"), { Label: "Skills & Background" });
  await pageHeading(head, SITE.skills.headline);
  await text(head, SITE.skills.positioning, { style: "body/lg", color: "text-muted", w: 672 });

  const core = frame(column, { name: "Core Technologies", gap: 32, pad: [24, 0, 0, 0] });
  core.layoutSizingHorizontal = "FILL";
  await text(core, "Core Technologies", { style: "heading/section", color: "text-strong" });
  const grid = frame(core, { name: "grid", dir: "HORIZONTAL", gap: 20, wrap: true });
  grid.layoutSizingHorizontal = "FILL";
  for (const block of SITE.skills.blocks) await skillCardFrame(grid, block, 502);

  const how = frame(column, { name: "How I Think About Work", gap: 32, pad: [24, 0, 0, 0] });
  how.layoutSizingHorizontal = "FILL";
  await text(how, "How I Think About Work", { style: "heading/section", color: "text-strong" });
  const row = frame(how, { name: "pillars", dir: "HORIZONTAL", gap: 24, align: "MIN" });
  row.layoutSizingHorizontal = "FILL";
  for (const p of SITE.skills.pillars) {
    const card = instance(row, "PillarCard", { State: "Collapsed" }, { fillW: true });
    setTextProps(card, { Title: p.title, Subtitle: p.subtitle });
    await overrideTexts(card, "evidence", p.evidence);
    overrideIcon(card, ICON_FOR_PILLAR[p.icon] || "sparkles", "primary");
  }
  return column.parent;
}

/** Render MDX blocks with the mdxComponents styles. */
async function renderBlocks(parent, blocks) {
  for (const b of blocks) {
    if (b.type === "heading") {
      await text(parent, b.text, { style: b.level <= 2 ? "heading/prose-h2" : "heading/prose-h3", color: "text-strong", fill: true });
    } else if (b.type === "paragraph") {
      await text(parent, b.text, { style: "body/prose", color: "text-muted", fill: true });
    } else if (b.type === "list") {
      const list = frame(parent, { name: "ul", gap: 8, pad: [0, 0, 0, 20] });
      list.layoutSizingHorizontal = "FILL";
      for (const item of b.items) {
        const row = frame(list, { name: "li", dir: "HORIZONTAL", gap: 10, align: "MIN" });
        row.layoutSizingHorizontal = "FILL";
        await text(row, "•", { style: "body/prose", color: "primary" });
        await text(row, item, { style: "body/prose", color: "text-muted", fill: true });
      }
    } else if (b.type === "divider") {
      divider(parent, "border");
    } else if (b.type === "callout") {
      const type = { note: "Note", aside: "Aside", warn: "Warn" }[b.variant] || "Note";
      const inst = instance(parent, "Callout", { Type: type }, { fillW: true });
      setTextProps(inst, { Title: b.title || "", Body: b.text, "Show title": Boolean(b.title) });
    } else if (b.type === "embed") {
      if (KIT.components[b.component]) instance(parent, b.component, { Step: "0" }, { fillW: true });
      else await text(parent, `<${b.component} />`, { style: "code/inline", color: "text-muted" });
    }
  }
}

async function projectPage(page, project) {
  const column = await pageShell(page, `Project · /projects/${project.slug}`, 768);
  const head = frame(column, { name: "header", gap: 24 });
  head.layoutSizingHorizontal = "FILL";
  setTextProps(instance(head, "Eyebrow"), { Label: "Project" });
  await pageHeading(head, project.title);
  const actions = frame(head, { name: "actions", dir: "HORIZONTAL", gap: 16, align: "CENTER", wrap: true });
  actions.layoutSizingHorizontal = "FILL";
  if (project.demo) {
    const b = instance(actions, "Button", { State: "Default", Style: "Primary", Size: "Small" });
    setTextProps(b, { Label: "Live Demo", "Leading icon": true, "Trailing icon": false });
    overrideIcon(b, "external-link", "white", "leading-icon");
  }
  if (project.link) {
    const b = instance(actions, "Button", { State: "Default", Style: "Outline", Size: "Small" });
    setTextProps(b, { Label: "Source Code", "Leading icon": true, "Trailing icon": false });
    overrideIcon(b, "github", "gray/500", "leading-icon");
  }
  const pills = frame(head, { name: "skills", dir: "HORIZONTAL", gap: 8, wrap: true });
  pills.layoutSizingHorizontal = "FILL";
  for (const s of project.skills) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: s });

  if (project.embed) {
    const tryIt = frame(column, { name: "Try It", gap: 16 });
    tryIt.layoutSizingHorizontal = "FILL";
    await text(tryIt, "Try It", { style: "heading/card-bold", color: "text-strong" });
    const holder = sectionPanel(tryIt, { name: "iframe", pad: 0, gap: 0, clip: true });
    const ph = frame(holder, { name: "embed", dir: "VERTICAL", h: 720, align: "CENTER", justify: "CENTER", gap: 8, fill: "gray/50" });
    ph.layoutSizingHorizontal = "FILL";
    await text(ph, project.embed, { style: "code/inline", color: "text-muted" });
    await text(ph, "<iframe> · 720px", { style: "body/xs", color: "gray/400" });
  }

  const body = sectionPanel(column, { name: "chapter", gap: 16 });
  await renderBlocks(body, project.blocks);
  return column.parent;
}

async function personalPage(page) {
  const column = await pageShell(page, "Personal · /personal", 1024);
  const s = SITE.travel.stats;

  const hero = sectionPanel(column, { name: "hero", gap: 32 });
  const heroText = frame(hero, { name: "text", gap: 12 });
  heroText.layoutSizingHorizontal = "FILL";
  await text(heroText, SITE.personal.title, { style: "heading/page-sm", color: "gray/900" });
  for (const p of SITE.personal.description) await text(heroText, p, { style: "body/lead", color: "text-muted", w: 672 });
  const statRow = frame(hero, { name: "stats", dir: "HORIZONTAL", gap: 16 });
  statRow.layoutSizingHorizontal = "FILL";
  for (const [label, value, ic] of [["Countries", s.countriesVisited, "globe"], ["Cities", s.citiesExplored, "map-pin"], ["Photos", s.totalPhotos.toLocaleString(), "camera"], ["Years", s.dateRange, "graduation-cap"]]) {
    const tile = instance(statRow, "StatTile", { Variant: "Card" }, { fillW: true });
    setTextProps(tile, { Value: String(value), Label: label });
    overrideIcon(tile, ic, "primary", "icon");
  }

  const mapPanel = sectionPanel(column, { name: "Where I've Been", gap: 16 });
  const mapTitle = frame(mapPanel, { name: "h2", dir: "HORIZONTAL", gap: 8, align: "CENTER" });
  icon(mapTitle, "map-pin", { size: 20, color: "primary" });
  await text(mapTitle, "Where I've Been", { style: "heading/panel", color: "gray/900" });
  const filters = frame(mapPanel, { name: "filters", dir: "HORIZONTAL", gap: 8, wrap: true });
  filters.layoutSizingHorizontal = "FILL";
  for (const f of SITE.travel.mapFilters) setTextProps(instance(filters, "TagPill", { State: f.key === "all" ? "Selected" : "Default" }), { Label: f.label });
  const map = frame(mapPanel, { name: "TravelMap (react-simple-maps)", dir: "NONE", h: 520, radius: "radius-lg", fill: "surface", stroke: "border", effect: "shadow/soft", clip: true });
  map.layoutSizingHorizontal = "FILL";
  const world = frame(map, { name: "geographies (placeholder)", dir: "HORIZONTAL", w: 960, h: 520, align: "CENTER", justify: "CENTER", fill: "secondary", fillOpacity: 0.5 });
  await text(world, "ComposableMap · geoMercator · world-atlas countries-110m · visited countries fill secondary, others surface", { style: "body/xs", color: "text-muted", w: 480, align: "CENTER" });
  // a few markers scattered to show the marker sizes
  SITE.travel.cities.slice(0, 12).forEach((c, i) => {
    const m = instance(map, "MapMarker", { Kind: c.tag === "university" ? "University" : "City" });
    m.x = 80 + ((i * 73) % 800);
    m.y = 80 + ((i * 131) % 360);
  });
  const badge = instance(map, "MapBadge");
  badge.x = 16;
  badge.y = 520 - 16 - badge.height;
  const tip = instance(map, "MapTooltip");
  tip.x = 960 - 16 - tip.width;
  tip.y = 64;

  const places = sectionPanel(column, { name: "Places", gap: 24 });
  await text(places, "Places", { style: "heading/panel", color: "gray/900" });
  const grid = frame(places, { name: "grid", dir: "HORIZONTAL", gap: 12, wrap: true, align: "MIN" });
  grid.layoutSizingHorizontal = "FILL";
  SITE.travel.regions.forEach((r, i) => {
    const cities = SITE.travel.cities.filter((c) => r.codes.includes(c.countryCode));
    if (!cities.length) return;
    const inst = instance(grid, "PlaceGroup", { State: i === 0 ? "Open" : "Closed" });
    inst.resize(474, inst.height);
    setTextProps(inst, { Name: r.name, Meta: `${cities.length} ${cities.length === 1 ? "city" : "cities"} / ${cities.reduce((sum, c) => sum + c.photos, 0)} photos` });
  });

  const story = sectionPanel(column, { name: "Life Story", gap: 24 });
  const storyTitle = frame(story, { name: "h2", dir: "HORIZONTAL", gap: 8, align: "CENTER" });
  icon(storyTitle, "map-pin", { size: 20, color: "primary" });
  await text(storyTitle, "Life Story", { style: "heading/panel", color: "gray/900" });
  const storyRow = frame(story, { name: "row", dir: "HORIZONTAL", gap: 40, align: "MIN" });
  storyRow.layoutSizingHorizontal = "FILL";
  const timeline = frame(storyRow, { name: "timeline", gap: 0 });
  timeline.layoutSizingHorizontal = "FILL";
  for (const m of SITE.personal.milestones) {
    const inst = instance(timeline, "Milestone", {}, { fillW: true });
    setTextProps(inst, { Title: m.title, Date: m.date, Description: m.description, Location: m.location || "" });
  }
  const strip = frame(storyRow, { name: "gallery (sticky)", gap: 12, w: 260 });
  for (const img of SITE.personal.gallery) {
    const tile = instance(strip, "GalleryTile", { State: "Default" });
    setTextProps(tile, { Caption: img.caption });
    tile.resize(260, 195);
    await paintPhoto(tile, img.url);
  }

  const favs = sectionPanel(column, { name: "Favorites", gap: 24 });
  await text(favs, "Favorites", { style: "heading/panel", color: "gray/900" });
  const favRow = frame(favs, { name: "grid", dir: "HORIZONTAL", gap: 24, align: "MIN" });
  favRow.layoutSizingHorizontal = "FILL";
  for (const [key, label, ic] of [["books", "Books", "book"], ["websites", "Websites", "globe"], ["technologies", "Technologies", "cpu"]]) {
    const card = frame(favRow, { name: `favorites/${key}`, gap: 12, pad: 20, radius: "radius-lg", fill: "surface-muted", stroke: "border" });
    card.layoutSizingHorizontal = "FILL";
    const h = frame(card, { name: "header", dir: "HORIZONTAL", gap: 8, align: "CENTER" });
    icon(h, ic, { size: 16, color: "primary" });
    await text(h, label, { style: "body/sm-semibold", color: "gray/900" });
    const list = frame(card, { name: "items", gap: 8 });
    list.layoutSizingHorizontal = "FILL";
    for (const item of SITE.personal.favorites[key]) await text(list, item, { style: "body/sm", color: "gray/600", fill: true });
  }
  return column.parent;
}

async function notFoundPage(page) {
  const column = await pageShell(page, "Not found · /404", 768);
  const panel = sectionPanel(column, { gap: 16 });
  setTextProps(instance(panel, "Eyebrow"), { Label: "404" });
  await pageHeading(panel, "Page not found");
  await text(panel, "That link points somewhere that does not exist. The pages that do are all one click away.", { style: "body/lead", color: "text-muted", fill: true });
  const b = instance(panel, "Button", { State: "Default", Style: "Primary", Size: "Small" });
  setTextProps(b, { Label: "Back to home", "Leading icon": false, "Trailing icon": false });
  return column.parent;
}

/** Hero preview in every theme mode, side by side. */
async function themePreviews(page) {
  const row = frame(page, { name: "Theme previews · hero", dir: "HORIZONTAL", gap: 48, align: "MIN" });
  for (const t of SITE.site.themes) {
    const holder = frame(row, { name: `theme=${t.id}`, gap: 16, pad: 32, w: 560, fill: "surface-muted", radius: 24, stroke: "border" });
    if (KIT.themeModes[t.id]) holder.setExplicitVariableModeForCollection(KIT.themeCollection, KIT.themeModes[t.id]);
    await text(holder, `${t.label} · data-theme="${t.id}"`, { style: "label/section-eyebrow", color: "text-muted" });
    const panel = sectionPanel(holder, { gap: 0, pad: 32 });
    await heroSection(panel, { w: 432, mobile: true });
    const nav = frame(holder, { name: "nav sample", gap: 4, w: 240 });
    setTextProps(instance(nav, "NavItem", { State: "Active" }, { fillW: true }), { Label: "Experience" });
    setTextProps(instance(nav, "NavItem", { State: "Hover" }, { fillW: true }), { Label: "About" });
    setTextProps(instance(nav, "NavItem", { State: "Default" }, { fillW: true }), { Label: "Skills" });
  }
  return row;
}

async function buildScreensPage() {
  const page = await getOrCreatePage(PAGE_NAMES.screens);
  await figma.setCurrentPageAsync(page);
  const made = [];
  const add = async (label, fn) => {
    const node = await step(label, () => fn(page));
    if (node) made.push(node);
  };
  await add("Screens · Home desktop", homeDesktop);
  await add("Screens · Home mobile", homeMobile);
  await add("Screens · Skills", skillsPage);
  for (const p of SITE.projects.filter((x) => x.featured)) {
    await add(`Screens · Project ${p.slug}`, (pg) => projectPage(pg, p));
  }
  await add("Screens · Personal", personalPage);
  await add("Screens · 404", notFoundPage);
  await add("Screens · Theme previews", themePreviews);

  // Two columns: tall home screens on the left, the rest stacked on the right.
  const [desktop, mobile, ...rest] = made;
  if (desktop) {
    desktop.x = 0;
    desktop.y = 0;
  }
  if (mobile) {
    mobile.x = desktop ? desktop.width + 120 : 0;
    mobile.y = 0;
  }
  placeBelow(rest, (desktop ? desktop.width : 0) + 120 + (mobile ? mobile.width : 0) + 120, 0, 120);
  return page;
}
