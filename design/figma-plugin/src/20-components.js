/* ================================================================== *
 * 20-components.js — every site element as a component (set) with states.
 *
 * Naming follows the React components (src/components, src/sections,
 * src/layout) so Code Connect / a designer can map 1:1. Each set carries a
 * `description` naming the source file and the CSS class it mirrors.
 * ================================================================== */

const CONTENT_W = 896; // max-w-4xl home content column
const PANEL_INNER_W = CONTENT_W - 64; // .section-panel md:p-8
const CARD_W = PANEL_INNER_W - 8; // timeline lists sit in `ml-2`

/* ------------------------------------------------------------------ *
 * Icons
 * ------------------------------------------------------------------ */

async function buildIcons(parent) {
  const comps = [];
  for (const name of Object.keys(ICONS)) {
    const comp = figma.createComponent();
    comp.name = `icon/${name}`;
    comp.resize(24, 24);
    comp.fills = [];
    comp.clipsContent = false;
    comp.description = `lucide-react <${ICONS[name].pascal} /> · stroke 2 on a 24px grid. Recolour by overriding the vector strokes.`;
    let svg;
    try {
      svg = figma.createNodeFromSvg(ICONS[name].svg);
    } catch (err) {
      warn(`Icon ${name}: ${err.message}`);
      continue;
    }
    for (const child of [...svg.children]) {
      comp.appendChild(child);
      child.constraints = { horizontal: "SCALE", vertical: "SCALE" };
    }
    svg.remove();
    recolorIcon(comp, "text-strong");
    KIT.icons[name] = comp;
    comps.push(comp);
  }
  // 12 per row grid
  comps.forEach((c, i) => {
    c.x = (i % 12) * 48;
    c.y = Math.floor(i / 12) * 48;
  });
  const holder = frame(null, { name: "Icons (lucide-react)", dir: "NONE", w: 12 * 48, h: Math.ceil(comps.length / 12) * 48 });
  for (const c of comps) holder.appendChild(c);
  parent.appendChild(holder);
  status(`Icons: ${comps.length}`);
  return holder;
}

/* ------------------------------------------------------------------ *
 * Atoms
 * ------------------------------------------------------------------ */

async function buildTagPill(parent) {
  return variantSet(parent, "TagPill", [{ prop: "State", values: ["Default", "Hover", "Selected"] }], async ({ State }) => {
    const selected = State === "Selected";
    const c = component(null, {
      dir: "HORIZONTAL",
      pad: selected ? [6, 16] : [4, 12],
      radius: "radius-full",
      align: "CENTER",
      fill: selected ? "primary" : State === "Hover" ? "white" : "gray/100",
      stroke: selected || State === "Hover" ? "primary" : { color: "gray/100", opacity: 0 },
      effect: State === "Hover" ? "shadow/sm" : undefined,
    });
    await text(c, "Python", { name: "label", style: "body/xs", color: selected ? "white" : State === "Hover" ? "primary" : "gray/600" });
    return c;
  }, {
    description: ".tag-pill (src/components/TagPill.jsx). Hover: bg white, border+text primary, shadow-sm, 200ms. Selected = TravelMap filter (aria-pressed).",
    props: [{ name: "Label", type: "TEXT", value: "Python", node: "label" }],
  });
}

async function buildBadge(parent) {
  return variantSet(parent, "Badge", [{ prop: "Variant", values: ["Neutral", "Primary", "Featured", "Outline", "Stack"] }], async ({ Variant }) => {
    const spec = {
      Neutral: { fill: "gray/100", color: "gray/600", stroke: null, style: "body/xs", pad: [4, 8], radius: "radius-md" },
      Primary: { fill: "secondary", color: "primary-dark", stroke: { color: "primary", opacity: 0.1 }, style: "body/xs", pad: [4, 8], radius: "radius-md" },
      Featured: { fill: "primary", color: "white", stroke: null, style: "label/micro-bold", pad: [2, 8], radius: "radius-full" },
      Outline: { fill: null, color: "primary", stroke: "primary", style: "label/micro-bold", pad: [2, 8], radius: "radius-full" },
      Stack: { fill: "primary", fillOpacity: 0.08, color: "primary", stroke: { color: "primary", opacity: 0.2 }, style: "body/xs-semibold", pad: [4, 12], radius: "radius-full" },
    }[Variant];
    const c = component(null, { dir: "HORIZONTAL", pad: spec.pad, radius: spec.radius, align: "CENTER", fill: spec.fill, fillOpacity: spec.fillOpacity, stroke: spec.stroke });
    const label = { Neutral: "58 cities", Primary: "Badge", Featured: "Featured", Outline: "Live Demo", Stack: "Python" }[Variant];
    await text(c, label, { name: "label", style: spec.style, color: spec.color });
    return c;
  }, {
    description: ".badge / .badge-neutral / .badge-primary (index.css); Featured + Outline pills from ProjectCard.jsx; Stack = hero tech chip (HeroSection.jsx).",
    props: [{ name: "Label", type: "TEXT", value: "Badge", node: "label" }],
  });
}

async function buildButton(parent) {
  return variantSet(parent, "Button",
    [
      { prop: "State", values: ["Default", "Hover"] },
      { prop: "Style", values: ["Primary", "Outline", "Pill"] },
      { prop: "Size", values: ["Default", "Small"] },
    ],
    async ({ State, Style, Size }) => {
      const hover = State === "Hover";
      const pill = Style === "Pill";
      const pad = pill ? [8, 24] : Size === "Small" ? [10, 20] : [16, 32];
      const spec = {
        Primary: { fill: hover ? "primary-dark" : "primary", color: "white", stroke: null },
        Outline: { fill: "white", color: hover ? "primary" : "gray/500", stroke: hover ? "primary" : "gray/200" },
        Pill: { fill: "surface", color: hover ? "primary" : "text-muted", stroke: hover ? { color: "primary", opacity: 0.5 } : "border" },
      }[Style];
      const c = component(null, {
        dir: "HORIZONTAL", gap: 8, pad, align: "CENTER", justify: "CENTER",
        radius: pill ? "radius-full" : "radius-lg",
        fill: spec.fill, stroke: spec.stroke, effect: pill ? "shadow/sm" : undefined,
      });
      const lead = icon(c, "linkedin", { name: "leading-icon", size: 16, color: spec.color });
      lead.visible = Style === "Outline";
      await text(c, Style === "Primary" ? "Resume" : Style === "Outline" ? "LinkedIn" : "View More",
        { name: "label", style: pill || Size === "Small" ? "body/sm-semibold" : "body/base-medium", color: spec.color });
      const trail = icon(c, Style === "Pill" ? "chevron-down" : "file-text", { name: "trailing-icon", size: 16, color: spec.color });
      trail.visible = Style !== "Outline";
      if (pill && hover) trail.y += 2; // group-hover:translate-y-0.5
      return c;
    },
    {
      description: ".btn .btn-primary / .btn-outline (HeroSection, ProjectPage, NotFoundPage) and .btn-pill (ExpandToggle, BipartiteVisual). Note `rounded-lg` renders 18px because --radius-lg overrides Tailwind. Hover 150ms colours; pill active:scale-95.",
      props: [
        { name: "Label", type: "TEXT", value: "Resume", node: "label" },
        { name: "Leading icon", type: "BOOLEAN", value: false, node: "leading-icon" },
        { name: "Trailing icon", type: "BOOLEAN", value: true, node: "trailing-icon" },
        { name: "Icon", type: "INSTANCE_SWAP", value: KIT.icons["file-text"] ? KIT.icons["file-text"].id : undefined, node: "trailing-icon" },
      ].filter((p) => p.value !== undefined),
    });
}

async function buildTextLink(parent) {
  return variantSet(parent, "TextLink",
    [{ prop: "State", values: ["Default", "Hover"] }, { prop: "Tone", values: ["Primary", "Muted"] }],
    async ({ State, Tone }) => {
      const hover = State === "Hover";
      const color = Tone === "Primary" ? "primary" : hover ? "primary" : "text-muted";
      const c = component(null, { dir: "HORIZONTAL", gap: 8, align: "CENTER" });
      const t = await text(c, Tone === "Primary" ? "View Core Technologies" : "Details", { name: "label", style: "body/sm-medium", color });
      if (hover && Tone === "Primary") t.textDecoration = "UNDERLINE";
      const arrow = icon(c, "arrow-right", { name: "icon", size: 16, color });
      if (hover) arrow.x += 4; // group-hover:translate-x-1
      return c;
    },
    {
      description: "Inline links with a trailing arrow (SkillsSection, ProjectCard 'Details', PersonalSection). Primary: hover underline. Muted: hover text primary. Arrow nudges 4px on hover.",
      props: [{ name: "Label", type: "TEXT", value: "View Core Technologies", node: "label" }],
    });
}

async function buildNavItem(parent) {
  return variantSet(parent, "NavItem", [{ prop: "State", values: ["Default", "Hover", "Active"] }], async ({ State }) => {
    const active = State === "Active";
    const hover = State === "Hover";
    const c = component(null, {
      dir: "HORIZONTAL", gap: 12, pad: [12, 16], w: 240, align: "CENTER", justify: "SPACE_BETWEEN", radius: "radius-lg",
      fill: active || hover ? "white" : null,
      stroke: active ? "border" : null,
      effect: hover ? "shadow/sm" : undefined,
    });
    await text(c, "Experience", { name: "label", style: "label/nav", color: active ? "primary" : hover ? "gray/900" : "gray/600" });
    ellipse(c, {
      name: "indicator", size: 8,
      fill: active ? "primary-dark" : null,
      stroke: active || hover ? "primary" : "gray/300",
    });
    return c;
  }, {
    description: ".nav-item / .nav-indicator (src/layout/Navigation.jsx). Active is driven by useScrollSpy. Hover: bg white + shadow-sm + indicator border primary, 200ms.",
    props: [{ name: "Label", type: "TEXT", value: "Experience", node: "label" }],
  });
}

async function buildThemeSwatch(parent) {
  const themes = SITE.site.themes;
  const set = await variantSet(parent, "ThemeSwatch",
    [{ prop: "Selected", values: ["No", "Yes"] }, { prop: "Theme", values: themes.map((t) => t.label) }],
    async ({ Selected, Theme }) => {
      const theme = themes.find((t) => t.label === Theme);
      const selected = Selected === "Yes";
      const c = component(null, { dir: "NONE", w: 34, h: 34 });
      if (selected) {
        const ring = ellipse(c, { name: "ring", size: 34, fill: "white", stroke: "gray/300", strokeWeight: 2, strokeAlign: "INSIDE" });
        ring.x = 0;
        ring.y = 0;
      }
      const size = selected ? 26 : 24;
      const dot = ellipse(c, { name: "swatch", size, fill: theme.color });
      dot.x = (34 - size) / 2;
      dot.y = (34 - size) / 2;
      if (!selected) dot.opacity = 0.5;
      return c;
    },
    { description: "Theme buttons (src/layout/ThemeControls.jsx). Selected: ring-2 ring-offset-2 ring-gray-300 + scale-110. Unselected: opacity 50%, hover 100%. Colours come from THEMES in src/theme.js (hard-coded, not tokens)." });
  return set;
}

async function buildThemeControls(parent) {
  const c = component(parent, { name: "ThemeControls", gap: 12, pad: [16, 0, 0, 0], w: 240 });
  const top = divider(c, "gray/100");
  top.name = "border-top";
  await text(c, "Theme", { name: "label", style: "label/section-eyebrow", color: "gray/400" });
  const row = frame(c, { name: "swatches", dir: "HORIZONTAL", gap: 16, align: "CENTER" });
  for (const t of SITE.site.themes) {
    instance(row, "ThemeSwatch", { Selected: t.default ? "Yes" : "No", Theme: t.label });
  }
  return singleComponent("ThemeControls", c, { description: "src/layout/ThemeControls.jsx — pt-4 border-t border-gray-100. Rendered at scale-90 / opacity-80 in the desktop sidebar." });
}

async function buildIconBox(parent) {
  return variantSet(parent, "IconBox", [{ prop: "State", values: ["Default", "Hover"] }], async ({ State }) => {
    const hover = State === "Hover";
    const c = component(null, { dir: "HORIZONTAL", pad: 8, radius: "radius-lg", align: "CENTER", justify: "CENTER", fill: "primary", fillOpacity: hover ? 0.2 : 0.1 });
    icon(c, "github", { name: "icon", size: 20, color: hover ? "primary-dark" : "primary" });
    return c;
  }, {
    description: ".icon-box (src/components/IconBox.jsx, SocialIcon.jsx, SkillCard, pillars). Group hover: bg primary/20 + icon primary-dark, 200ms. SocialIcon adds hover:scale-110.",
    props: [{ name: "Icon", type: "INSTANCE_SWAP", value: KIT.icons.github ? KIT.icons.github.id : undefined, node: "icon" }].filter((p) => p.value !== undefined),
  });
}

async function buildSectionTitle(parent) {
  const c = component(parent, { name: "SectionTitle", dir: "HORIZONTAL", gap: 12, align: "CENTER" });
  icon(c, "folder-git-2", { name: "icon", size: 28, color: "primary" });
  await text(c, "Selected Projects", { name: "label", style: "heading/section", color: "text-strong" });
  return singleComponent("SectionTitle", c, {
    description: ".section-title (src/components/SectionTitle.jsx) — text-2xl md:text-3xl font-bold, optional 28px primary icon.",
    props: [
      { name: "Label", type: "TEXT", value: "Selected Projects", node: "label" },
      { name: "Show icon", type: "BOOLEAN", value: true, node: "icon" },
      { name: "Icon", type: "INSTANCE_SWAP", value: KIT.icons["folder-git-2"] ? KIT.icons["folder-git-2"].id : undefined, node: "icon" },
    ].filter((p) => p.value !== undefined),
  });
}

async function buildEyebrow(parent) {
  const c = component(parent, { name: "Eyebrow", dir: "HORIZONTAL" });
  await text(c, SITE.identity.title, { name: "label", style: "label/eyebrow", color: "primary" });
  return singleComponent("Eyebrow", c, {
    description: ".eyebrow — 11px semibold uppercase, tracking .24em. Colour is primary on hero/pages, primary-dark by default, gray-400 for 'Key Coursework'.",
    props: [{ name: "Label", type: "TEXT", value: SITE.identity.title, node: "label" }],
  });
}

async function buildExpandToggle(parent) {
  return variantSet(parent, "ExpandToggle", [{ prop: "State", values: ["Collapsed", "Expanded"] }], async ({ State }) => {
    const expanded = State === "Expanded";
    const c = component(null, { dir: "HORIZONTAL", gap: 8, pad: [8, 24], align: "CENTER", radius: "radius-full", fill: "surface", stroke: "border", effect: "shadow/sm" });
    await text(c, expanded ? "Show Less" : "View More", { name: "label", style: "body/sm-medium", color: "text-muted" });
    icon(c, expanded ? "chevron-up" : "chevron-down", { name: "icon", size: 16, color: "text-muted" });
    return c;
  }, {
    description: "src/components/ExpandToggle.jsx — .btn-pill with a chevron that nudges 2px on hover (group-hover:translate-y). aria-expanded toggles the label.",
    props: [{ name: "Label", type: "TEXT", value: "View More", node: "label" }],
  });
}

async function buildTimelineDot(parent) {
  return variantSet(parent, "TimelineDot", [{ prop: "State", values: ["Default", "Hover", "Active"] }], async ({ State }) => {
    const c = component(null, { dir: "NONE", w: 16, h: 16 });
    const active = State === "Active";
    const d = ellipse(c, {
      name: "dot", size: 16,
      fill: active ? "primary" : "white",
      stroke: active || State === "Hover" ? "primary" : { color: "primary", opacity: 0.5 },
      strokeWeight: 2,
    });
    d.x = 0;
    d.y = 0;
    return c;
  }, { description: ".timeline-dot (index.css) — 16px, border-2 primary/50 on white; hover border primary; .active fills primary. EducationCard expanded also scales it 1.25." });
}

/* ------------------------------------------------------------------ *
 * Timeline cards
 * ------------------------------------------------------------------ */

/** `.timeline-item` chrome: left border, dot, padded content column. */
function timelineShell(width, hover, dotState) {
  const c = component(null, { dir: "HORIZONTAL", w: width, gap: 0 });
  const rail = frame(c, { name: "rail", dir: "NONE", w: 2, fill: hover ? "primary" : "border" });
  rail.layoutSizingVertical = "FILL";
  const content = frame(c, { name: "content", gap: 0, pad: [0, 0, 32, 30] });
  content.layoutSizingHorizontal = "FILL";
  const dot = instance(c, "TimelineDot", { State: dotState });
  dot.layoutPositioning = "ABSOLUTE";
  dot.x = -7;
  dot.y = 0;
  return { c, content };
}

async function buildExperienceCard(parent) {
  const role = SITE.experience.roles[0];
  return variantSet(parent, "ExperienceCard", [{ prop: "State", values: ["Collapsed", "Hover", "Expanded"] }], async ({ State }) => {
    const expanded = State === "Expanded";
    const hover = State === "Hover";
    const { c, content } = timelineShell(CARD_W, hover, expanded ? "Active" : hover ? "Hover" : "Default");

    const head = frame(content, { name: "header", dir: "HORIZONTAL", gap: 16, align: "MIN", justify: "SPACE_BETWEEN", pad: [0, 0, 4, 0] });
    head.layoutSizingHorizontal = "FILL";
    await text(head, role.title, { name: "title", style: "heading/card", color: hover ? "primary" : "gray/900" });
    const date = frame(head, { name: "date-row", dir: "HORIZONTAL", gap: 4, align: "CENTER" });
    icon(date, "calendar", { size: 16, color: "gray/500" });
    await text(date, role.date, { name: "date", style: "body/sm-medium", color: "gray/500" });

    const org = frame(content, { name: "company-row", dir: "HORIZONTAL", gap: 8, align: "CENTER", pad: [0, 0, 8, 0] });
    icon(org, "building-2", { size: 16, color: "gray/700" });
    await text(org, role.company, { name: "company", style: "body/base-medium", color: "gray/700" });

    const chev = frame(content, { name: "chevron-row", dir: "HORIZONTAL", pad: [4, 0, 0, 0], opacity: hover ? 1 : 0.8 });
    icon(chev, expanded ? "chevron-up" : "chevron-down", { size: 16, color: "primary" });

    if (expanded) {
      const body = frame(content, { name: "body", gap: 12, pad: [16, 0, 0, 0] });
      body.layoutSizingHorizontal = "FILL";
      for (const p of role.paragraphs) await text(body, p, { style: "body/sm", color: "text-muted", fill: true });
      const pills = frame(content, { name: "skills", dir: "HORIZONTAL", gap: 8, wrap: true, pad: [24, 0, 16, 0] });
      pills.layoutSizingHorizontal = "FILL";
      for (const s of role.skills) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: s });
      const link = frame(content, { name: "link", dir: "HORIZONTAL", gap: 4, align: "CENTER" });
      await text(link, "View Organization", { style: "body/sm-medium", color: "primary" });
      icon(link, "arrow-up-right", { size: 16, color: "primary" });
    }
    return c;
  }, {
    description: "src/sections/components/ExperienceCard.jsx (.timeline-item). Click toggles the body: grid-rows 0fr→1fr + opacity, 500ms ease-in-out. Hover: rail, dot and title turn primary (300ms). Body prose comes from src/content/experience/*.mdx.",
    props: [
      { name: "Title", type: "TEXT", value: role.title, node: "title" },
      { name: "Company", type: "TEXT", value: role.company, node: "company" },
      { name: "Date", type: "TEXT", value: role.date, node: "date" },
    ],
  });
}

async function buildEducationCard(parent) {
  const edu = SITE.about.education[0];
  return variantSet(parent, "EducationCard", [{ prop: "State", values: ["Collapsed", "Hover", "Expanded"] }], async ({ State }) => {
    const expanded = State === "Expanded";
    const hover = State === "Hover";
    const { c, content } = timelineShell(CARD_W, hover, expanded ? "Active" : hover ? "Hover" : "Default");

    const inner = frame(content, { name: "trigger", gap: 8, pad: 16, radius: 12, fill: hover ? "gray/50" : null });
    inner.layoutSizingHorizontal = "FILL";
    const head = frame(inner, { name: "header", dir: "HORIZONTAL", gap: 8, align: "MIN", justify: "SPACE_BETWEEN" });
    head.layoutSizingHorizontal = "FILL";
    await text(head, edu.school, { name: "school", style: "heading/card", color: hover ? "primary" : "gray/900" });
    const yr = frame(head, { name: "year-row", dir: "HORIZONTAL", gap: 6, align: "CENTER" });
    icon(yr, "calendar", { size: 12, color: "gray/500" });
    await text(yr, edu.year, { name: "year", style: "body/xs", color: "gray/500" });
    await text(inner, edu.degree, { name: "degree", style: "body/sm-medium", color: "primary" });
    const cta = frame(inner, { name: "details-row", dir: "HORIZONTAL", gap: 4, align: "CENTER" });
    await text(cta, expanded ? "Hide details" : "View details", { name: "cta", style: "label/section-eyebrow", color: hover ? "primary" : "gray/400" });
    icon(cta, expanded ? "chevron-up" : "chevron-down", { size: 16, color: hover ? "primary" : "gray/400" });

    if (expanded) {
      const body = frame(content, { name: "body", gap: 24, pad: [16, 8, 8, 16] });
      body.layoutSizingHorizontal = "FILL";
      await text(body, edu.description, { name: "description", style: "body/sm", color: "gray/600", fill: true });
      const cw = frame(body, { name: "coursework", gap: 12 });
      cw.layoutSizingHorizontal = "FILL";
      await text(cw, "Key Coursework", { style: "label/eyebrow", color: "gray/400" });
      const pills = frame(cw, { name: "pills", dir: "HORIZONTAL", gap: 8, wrap: true });
      pills.layoutSizingHorizontal = "FILL";
      for (const course of edu.coursework) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: course.code });
    }
    return c;
  }, {
    description: "src/sections/components/EducationCard.jsx. Click toggles max-height 0→500px + opacity, 500ms ease-out; the dot scales 1.25 and fills primary. Course pills link to the course pages (title = course name).",
    props: [
      { name: "School", type: "TEXT", value: edu.school, node: "school" },
      { name: "Degree", type: "TEXT", value: edu.degree, node: "degree" },
      { name: "Year", type: "TEXT", value: edu.year, node: "year" },
    ],
  });
}

async function buildMilestone(parent) {
  const m = SITE.personal.milestones[0];
  const { c, content } = timelineShell(600, false, "Default");
  const head = frame(content, { name: "header", dir: "HORIZONTAL", gap: 12, align: "MIN", justify: "SPACE_BETWEEN", pad: [0, 0, 4, 0] });
  head.layoutSizingHorizontal = "FILL";
  await text(head, m.title, { name: "title", style: "body/base-medium", color: "text-strong" });
  await text(head, m.date, { name: "date", style: "body/sm-medium", color: "primary" });
  await text(content, m.description, { name: "description", style: "body/sm", color: "text-muted", fill: true });
  const loc = frame(content, { name: "location-row", dir: "HORIZONTAL", gap: 4, align: "CENTER", pad: [4, 0, 0, 0] });
  icon(loc, "map-pin", { size: 12, color: "gray/400" });
  await text(loc, m.location, { name: "location", style: "body/xs", color: "gray/400" });
  parent.appendChild(c);
  return singleComponent("Milestone", c, {
    description: "Life Story row (src/pages/PersonalPage.jsx) — .timeline-item with title / date / description / location. Data: src/data/sections/personal/milestones.js.",
    props: [
      { name: "Title", type: "TEXT", value: m.title, node: "title" },
      { name: "Date", type: "TEXT", value: m.date, node: "date" },
      { name: "Description", type: "TEXT", value: m.description, node: "description" },
      { name: "Location", type: "TEXT", value: m.location, node: "location" },
    ],
  });
}

/* ------------------------------------------------------------------ *
 * Project + skills cards
 * ------------------------------------------------------------------ */

async function buildProjectCard(parent) {
  const project = SITE.projects.find((p) => p.featured) || SITE.projects[0];
  return variantSet(parent, "ProjectCard",
    [{ prop: "State", values: ["Collapsed", "Expanded"] }, { prop: "Featured", values: ["No", "Yes"] }],
    async ({ State, Featured }) => {
      const expanded = State === "Expanded";
      const featured = Featured === "Yes";
      const c = component(null, { w: CONTENT_W, fill: featured ? "secondary" : null });

      const head = frame(c, { name: "header", dir: "HORIZONTAL", gap: 16, align: "MIN", justify: "SPACE_BETWEEN", pad: [20, 16] });
      head.layoutSizingHorizontal = "FILL";
      const left = frame(head, { name: "summary", gap: 4 });
      left.layoutSizingHorizontal = "FILL";
      const titleRow = frame(left, { name: "title-row", dir: "HORIZONTAL", gap: 8, align: "CENTER", wrap: true });
      titleRow.layoutSizingHorizontal = "FILL";
      await text(titleRow, project.title, { name: "title", style: "heading/card", color: "text-strong" });
      const tag = await text(titleRow, project.tag || "'23 — First pseudo-AI agent", { name: "tag", style: "label/micro-italic", color: "text-muted", italic: true });
      tag.visible = Boolean(project.tag);
      const fb = instance(titleRow, "Badge", { Variant: "Featured" });
      fb.name = "featured-badge";
      fb.visible = featured;
      const demo = instance(titleRow, "Badge", { Variant: "Outline" });
      demo.name = "demo-badge";
      demo.visible = Boolean(project.demo) && !expanded;
      if (!expanded) {
        await text(left, project.description, { name: "description", style: "body/sm", color: "text-muted", fill: true });
      }
      icon(head, expanded ? "chevron-up" : "chevron-down", { name: "chevron", size: 20, color: "text-muted" });

      if (expanded) {
        const body = frame(c, { name: "body", gap: 16, pad: [0, 16, 24, 16] });
        body.layoutSizingHorizontal = "FILL";
        await text(body, project.description, { name: "description", style: "body/sm", color: "text-muted", fill: true });
        const pills = frame(body, { name: "skills", dir: "HORIZONTAL", gap: 8, wrap: true });
        pills.layoutSizingHorizontal = "FILL";
        for (const s of project.skills) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: s });
        const actions = frame(body, { name: "actions", dir: "HORIZONTAL", gap: 12, align: "CENTER", wrap: true });
        actions.layoutSizingHorizontal = "FILL";
        const live = frame(actions, { name: "live-demo", dir: "HORIZONTAL", gap: 6, pad: [6, 12], align: "CENTER", radius: "radius-lg", fill: "primary" });
        await text(live, "Live Demo", { style: "body/sm-semibold", color: "white" });
        icon(live, "arrow-up-right", { size: 14, color: "white" });
        live.visible = Boolean(project.demo);
        const gh = frame(actions, { name: "github", dir: "HORIZONTAL", gap: 6, align: "CENTER" });
        icon(gh, "github", { size: 16, color: "text-muted" });
        await text(gh, "GitHub", { style: "body/sm", color: "text-muted" });
        gh.visible = Boolean(project.link);
        spacer(actions, 1, 1).layoutSizingHorizontal = "FILL";
        setTextProps(instance(actions, "TextLink", { State: "Default", Tone: "Muted" }), { Label: "Details" });
      }
      divider(c, "border").name = "border-bottom";
      return c;
    },
    {
      description: "src/sections/components/ProjectCard.jsx. One card is expanded at a time (ProjectsSection state, featured first). Expand: grid-rows 0fr→1fr + opacity 500ms ease-in-out. Featured rows use bg secondary. Data: src/content/projects/*.mdx frontmatter.",
      props: [
        { name: "Title", type: "TEXT", value: project.title, node: "title" },
        { name: "Description", type: "TEXT", value: project.description, node: "description" },
        { name: "Tag", type: "TEXT", value: project.tag || "", node: "tag" },
        { name: "Show tag", type: "BOOLEAN", value: Boolean(project.tag), node: "tag" },
        { name: "Show demo badge", type: "BOOLEAN", value: Boolean(project.demo), node: "demo-badge" },
      ],
    });
}

async function buildSkillCard(parent) {
  const block = SITE.skills.blocks[0];
  return variantSet(parent, "SkillCard", [{ prop: "State", values: ["Default", "Hover"] }], async ({ State }) => {
    const hover = State === "Hover";
    const c = component(null, { gap: 20, pad: 24, w: 454, radius: 16, fill: "surface", stroke: hover ? mixHex(TOKEN_HEX.primary, TOKEN_HEX.border, 0.7) : "border", effect: "shadow/soft" });
    const head = frame(c, { name: "header", dir: "HORIZONTAL", gap: 12, align: "CENTER" });
    instance(head, "IconBox", { State: hover ? "Hover" : "Default" }).name = "icon-box";
    await text(head, block.title, { name: "title", style: "heading/card-bold", color: "text-strong" });
    const pills = frame(c, { name: "items", dir: "HORIZONTAL", gap: 8, wrap: true });
    pills.layoutSizingHorizontal = "FILL";
    for (const item of block.items) setTextProps(instance(pills, "TagPill", { State: "Default" }), { Label: item });
    return c;
  }, {
    description: "src/sections/components/SkillCard.jsx (.card .card-hover). Hover: border mixes 30% primary into --border (300ms). Data: src/data/sections/skills.js.",
    props: [{ name: "Title", type: "TEXT", value: block.title, node: "title" }],
  });
}

async function buildPillarCard(parent) {
  const pillar = SITE.skills.pillars[0];
  const iconName = { settings: "settings", rocket: "rocket", barChart: "chart-column" }[pillar.icon] || "sparkles";
  return variantSet(parent, "PillarCard", [{ prop: "State", values: ["Collapsed", "Expanded"] }], async ({ State }) => {
    const expanded = State === "Expanded";
    const c = component(null, { gap: 0, pad: 32, w: 293, radius: "radius-lg", fill: "surface", stroke: "border", effect: "shadow/soft" });
    const head = frame(c, { name: "trigger", dir: "HORIZONTAL", gap: 12, align: "CENTER" });
    head.layoutSizingHorizontal = "FILL";
    const ib = instance(head, "IconBox", { State: "Default" });
    ib.name = "icon-box";
    overrideIcon(ib, iconName, "primary", "icon");
    const col = frame(head, { name: "titles", gap: 0 });
    col.layoutSizingHorizontal = "FILL";
    await text(col, pillar.title, { name: "title", style: "heading/card-bold", color: "text-strong" });
    await text(col, pillar.subtitle, { name: "subtitle", style: "body/sm", color: "text-muted", fill: true });
    icon(head, expanded ? "chevron-up" : "chevron-down", { size: 20, color: "text-muted" });

    const listWrap = frame(c, { name: "evidence", gap: 12, pad: [16, 0, 0, 0] });
    listWrap.layoutSizingHorizontal = "FILL";
    divider(listWrap, "border").name = "border-top";
    const list = frame(listWrap, { name: "items", gap: 8 });
    list.layoutSizingHorizontal = "FILL";
    for (const item of pillar.evidence) {
      const row = frame(list, { name: "item", dir: "HORIZONTAL", gap: 8, align: "MIN" });
      row.layoutSizingHorizontal = "FILL";
      const b = ellipse(row, { name: "bullet", size: 6, fill: "primary" });
      b.y = 6;
      await text(row, item, { style: "body/sm", color: "text-muted", fill: true });
    }
    if (expanded) {
      const body = frame(c, { name: "body", gap: 12, pad: [12, 0, 0, 0] });
      body.layoutSizingHorizontal = "FILL";
      divider(body, "border");
      for (const p of pillar.paragraphs) await text(body, p, { style: "body/sm", color: "text-muted", fill: true });
    }
    return c;
  }, {
    description: "PillarCard in src/pages/SkillsPage.jsx — click toggles the MDX description (grid-rows, 500ms ease-in-out). Data: src/content/pillars/*.mdx.",
    props: [
      { name: "Title", type: "TEXT", value: pillar.title, node: "title" },
      { name: "Subtitle", type: "TEXT", value: pillar.subtitle, node: "subtitle" },
    ],
  });
}

async function buildPillarSummary(parent) {
  const pillar = SITE.skills.pillars[0];
  const c = component(parent, { name: "PillarSummary", gap: 0, pad: 24, w: PANEL_INNER_W, radius: "radius-lg", fill: "surface-muted", stroke: "border" });
  const row = frame(c, { name: "row", dir: "HORIZONTAL", gap: 16, align: "MIN" });
  row.layoutSizingHorizontal = "FILL";
  const ib = instance(row, "IconBox", { State: "Default" });
  ib.name = "icon-box";
  const col = frame(row, { name: "text", gap: 4 });
  col.layoutSizingHorizontal = "FILL";
  await text(col, pillar.title, { name: "title", style: "heading/card-bold", color: "text-strong" });
  await text(col, pillar.subtitle, { name: "subtitle", style: "body/sm", color: "text-muted", fill: true });
  const list = frame(col, { name: "evidence", gap: 6, pad: [8, 0, 0, 0] });
  list.layoutSizingHorizontal = "FILL";
  for (const item of pillar.evidence) {
    const r = frame(list, { name: "item", dir: "HORIZONTAL", gap: 8, align: "MIN" });
    r.layoutSizingHorizontal = "FILL";
    const b = ellipse(r, { name: "bullet", size: 4, fill: "primary" });
    b.y = 8;
    await text(r, item, { style: "body/sm", color: "text-muted", fill: true });
  }
  return singleComponent("PillarSummary", c, {
    description: "Pillar row on the home Skills section (src/sections/SkillsSection.jsx) — .surface-muted p-6 with icon-box, title, subtitle, evidence bullets.",
    props: [
      { name: "Title", type: "TEXT", value: pillar.title, node: "title" },
      { name: "Subtitle", type: "TEXT", value: pillar.subtitle, node: "subtitle" },
    ],
  });
}

/* ------------------------------------------------------------------ *
 * Personal
 * ------------------------------------------------------------------ */

async function buildStatTile(parent) {
  return variantSet(parent, "StatTile", [{ prop: "Variant", values: ["Card", "Compact"] }], async ({ Variant }) => {
    const card = Variant === "Card";
    const c = component(null, { gap: 8, pad: card ? 16 : 0, w: card ? 200 : 120, align: "CENTER", radius: card ? "radius-lg" : 0, fill: card ? "surface-muted" : null, stroke: card ? "border" : null });
    icon(c, "globe", { name: "icon", size: 20, color: "primary" });
    await text(c, String(SITE.travel.stats.countriesVisited), { name: "value", style: "heading/panel", color: "gray/900", align: "CENTER" });
    await text(c, "Countries", { name: "label", style: "label/micro", color: "gray/400", align: "CENTER" });
    return c;
  }, {
    description: "Stat counters. Card = /personal hero grid (surface-muted p-4). Compact = TravelPreview on the home page. Values come from src/data/travel.js (auto-generated).",
    props: [
      { name: "Value", type: "TEXT", value: String(SITE.travel.stats.countriesVisited), node: "value" },
      { name: "Label", type: "TEXT", value: "Countries", node: "label" },
      { name: "Icon", type: "INSTANCE_SWAP", value: KIT.icons.globe ? KIT.icons.globe.id : undefined, node: "icon" },
    ].filter((p) => p.value !== undefined),
  });
}

async function buildQuickStats(parent) {
  const c = component(parent, { name: "QuickStats", gap: 16, pad: 24, w: 277, radius: "radius-lg", fill: "surface-muted", stroke: "border" });
  const head = frame(c, { name: "header", dir: "HORIZONTAL", gap: 8, align: "CENTER" });
  icon(head, "coffee", { size: 16, color: "gray/900" });
  await text(head, "Quick Stats", { style: "heading/card-bold", color: "gray/900" });
  const list = frame(c, { name: "stats", gap: 12 });
  list.layoutSizingHorizontal = "FILL";
  for (const s of SITE.personal.stats) {
    const row = frame(list, { name: s.label, gap: 2 });
    row.layoutSizingHorizontal = "FILL";
    await text(row, s.label, { style: "label/section-eyebrow", color: "gray/400" });
    await text(row, s.value, { style: "body/base-medium", color: "gray/800", fill: true });
  }
  return singleComponent("QuickStats", c, { description: "QuickStats card (src/sections/PersonalSection.jsx). Data: src/data/sections/personal/stats.js — note 'Countries Visited: 39' disagrees with travel.js (29)." });
}

async function buildGalleryTile(parent) {
  const img = SITE.personal.gallery[0];
  return variantSet(parent, "GalleryTile", [{ prop: "State", values: ["Default", "Hover"] }], async ({ State }) => {
    const hover = State === "Hover";
    const c = component(null, { dir: "NONE", w: 266, h: 200, radius: 12, fill: "gray/100", clip: true });
    const photo = rect(c, { name: "photo", w: hover ? 279 : 266, h: hover ? 210 : 200, fill: "gray/300" });
    photo.x = hover ? -6.5 : 0;
    photo.y = hover ? -5 : 0;
    photo.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    const overlay = frame(c, { name: "overlay", dir: "HORIZONTAL", w: 266, h: 200, pad: [8, 12], justify: "MIN", align: "MAX", fill: "black", fillOpacity: hover ? 0.3 : 0 });
    overlay.x = 0;
    overlay.y = 0;
    overlay.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    const cap = await text(overlay, img.caption, { name: "caption", style: "body/sm-medium", color: "white" });
    cap.opacity = hover ? 1 : 0;
    return c;
  }, {
    description: "Gallery tile (PersonalSection.jsx + PersonalPage.jsx) — aspect 4/3, rounded-xl. Hover: image scale-105 (500ms), overlay black/30 (300ms), caption fades in. Click opens GalleryLightbox.",
    props: [{ name: "Caption", type: "TEXT", value: img.caption, node: "caption" }],
  });
}

async function buildMapMarker(parent) {
  return variantSet(parent, "MapMarker", [{ prop: "Kind", values: ["City", "University"] }], async ({ Kind }) => {
    const r = 5.5;
    const c = component(null, { dir: "NONE", w: (r + 3) * 2, h: (r + 3) * 2 });
    const halo = ellipse(c, { name: "halo", size: (r + 3) * 2, fill: "primary", fillOpacity: 0.15 });
    halo.x = 0;
    halo.y = 0;
    const dot = ellipse(c, { name: "dot", size: r * 2, fill: Kind === "University" ? "accent-warn" : "primary", stroke: "surface", strokeWeight: 1.5, strokeAlign: "OUTSIDE" });
    dot.x = 3;
    dot.y = 3;
    return c;
  }, { description: "TravelMap marker (src/sections/TravelMap.jsx). Radius 3–7px by photo count (markerSize). University tag uses the hard-coded #f59e0b → accent-warn token. Hover/focus shows MapTooltip." });
}

async function buildMapTooltip(parent) {
  const city = SITE.travel.cities[0];
  const c = component(parent, { name: "MapTooltip", gap: 12, pad: 16, w: 192, radius: "radius-lg", fill: "surface", stroke: "border", effect: "shadow/soft" });
  await text(c, city.city, { name: "city", style: "body/sm-semibold", color: "text-strong" });
  await text(c, city.country, { name: "country", style: "body/xs", color: "text-muted" });
  const row = frame(c, { name: "meta", dir: "HORIZONTAL", gap: 16, align: "CENTER" });
  const photos = frame(row, { name: "photos", dir: "HORIZONTAL", gap: 6, align: "CENTER" });
  icon(photos, "camera", { size: 14, color: "primary" });
  await text(photos, String(city.photos), { name: "photo-count", style: "body/xs", color: "text-muted" });
  const years = frame(row, { name: "years", dir: "HORIZONTAL", gap: 6, align: "CENTER" });
  ellipse(years, { size: 6, fill: "border" });
  await text(years, city.firstVisit === city.lastVisit ? city.firstVisit : `${city.firstVisit}-${city.lastVisit}`, { name: "visit-range", style: "body/xs", color: "text-muted" });
  return singleComponent("MapTooltip", c, {
    description: "TravelMap tooltip — .section-panel !p-4 min-w-48, pointer-events-none, appears on marker hover/focus.",
    props: [
      { name: "City", type: "TEXT", value: city.city, node: "city" },
      { name: "Country", type: "TEXT", value: city.country, node: "country" },
      { name: "Photos", type: "TEXT", value: String(city.photos), node: "photo-count" },
      { name: "Years", type: "TEXT", value: `${city.firstVisit}-${city.lastVisit}`, node: "visit-range" },
    ],
  });
}

async function buildMapBadge(parent) {
  const c = component(parent, { name: "MapBadge", dir: "HORIZONTAL", gap: 8, pad: [8, 12], align: "CENTER", radius: "radius-md", fill: "white", fillOpacity: 0.9, effect: "shadow/sm" });
  await text(c, `${SITE.travel.stats.citiesExplored} cities`, { name: "cities", style: "body/xs-semibold", color: "text-strong" });
  await text(c, "|", { style: "body/xs", color: "border" });
  await text(c, `${SITE.travel.stats.countriesVisited} countries`, { name: "countries", style: "body/xs", color: "text-muted" });
  return singleComponent("MapBadge", c, {
    description: "TravelMap count badge (.badge .badge-neutral bg-white/90 backdrop-blur shadow-sm), bottom-left of the map.",
    props: [
      { name: "Cities", type: "TEXT", value: `${SITE.travel.stats.citiesExplored} cities`, node: "cities" },
      { name: "Countries", type: "TEXT", value: `${SITE.travel.stats.countriesVisited} countries`, node: "countries" },
    ],
  });
}

async function buildPlaceGroup(parent) {
  const region = SITE.travel.regions[0];
  const cities = SITE.travel.cities.filter((c) => region.codes.includes(c.countryCode));
  return variantSet(parent, "PlaceGroup", [{ prop: "State", values: ["Closed", "Open"] }], async ({ State }) => {
    const open = State === "Open";
    const c = component(null, { w: 458, gap: 0 });
    const btn = frame(c, { name: "button", dir: "HORIZONTAL", pad: 16, align: "CENTER", justify: "SPACE_BETWEEN", radius: 12, fill: open ? "secondary" : "surface", stroke: open ? "primary" : "border" });
    btn.layoutSizingHorizontal = "FILL";
    await text(btn, region.name, { name: "name", style: "body/base-medium", color: "gray/900" });
    await text(btn, `${cities.length} ${cities.length === 1 ? "city" : "cities"} / ${cities.reduce((s, x) => s + x.photos, 0)} photos`, { name: "meta", style: "body/xs", color: "gray/400" });
    if (open) {
      const pills = frame(c, { name: "cities", dir: "HORIZONTAL", gap: 8, wrap: true, pad: [12, 16] });
      pills.layoutSizingHorizontal = "FILL";
      for (const city of cities) {
        const pill = frame(pills, { name: city.city, dir: "HORIZONTAL", gap: 4, pad: [4, 12], radius: "radius-full", fill: "gray/100", align: "CENTER" });
        await text(pill, city.city, { style: "body/xs", color: "gray/600" });
        await text(pill, String(city.photos), { style: "body/xs", color: "gray/300" });
      }
    }
    return c;
  }, {
    description: "Places accordion (src/pages/PersonalPage.jsx) — one group open at a time. Open: bg secondary + border primary; hover: shadow-sm. Regions are hard-coded in CONTINENTS.",
    props: [
      { name: "Name", type: "TEXT", value: region.name, node: "name" },
      { name: "Meta", type: "TEXT", value: `${cities.length} cities / ${cities.reduce((s, x) => s + x.photos, 0)} photos`, node: "meta" },
    ],
  });
}

async function buildFavoritesCard(parent) {
  const items = SITE.personal.favorites.books;
  const c = component(parent, { name: "FavoritesCard", gap: 12, pad: 20, w: 293, radius: "radius-lg", fill: "surface-muted", stroke: "border" });
  const head = frame(c, { name: "header", dir: "HORIZONTAL", gap: 8, align: "CENTER" });
  icon(head, "book", { name: "icon", size: 16, color: "primary" });
  await text(head, "Books", { name: "title", style: "body/sm-semibold", color: "gray/900" });
  const list = frame(c, { name: "items", gap: 8 });
  list.layoutSizingHorizontal = "FILL";
  for (const item of items) await text(list, item, { style: "body/sm", color: "gray/600", fill: true });
  return singleComponent("FavoritesCard", c, {
    description: "Favorites column (src/pages/PersonalPage.jsx). Data: src/data/sections/personal/favorites.js.",
    props: [
      { name: "Title", type: "TEXT", value: "Books", node: "title" },
      { name: "Icon", type: "INSTANCE_SWAP", value: KIT.icons.book ? KIT.icons.book.id : undefined, node: "icon" },
    ].filter((p) => p.value !== undefined),
  });
}

async function buildLightbox(parent) {
  const dots = await variantSet(parent, "LightboxDot", [{ prop: "State", values: ["Off", "On"] }], async ({ State }) => {
    const c = component(null, { dir: "NONE", w: 8, h: 8 });
    const d = ellipse(c, { size: 8, fill: "white", fillOpacity: State === "On" ? 1 : 0.35 });
    d.x = 0;
    d.y = 0;
    return c;
  }, { description: "GalleryLightbox pagination dot — bg-white vs bg-white/35, transition-colors." });

  const c = component(parent, { name: "GalleryLightbox", dir: "NONE", w: 1440, h: 900, fill: "black", fillOpacity: 0.85 });
  const stage = frame(c, { name: "stage", gap: 12, align: "CENTER", w: 768 });
  stage.x = (1440 - 768) / 2;
  stage.y = 120;
  rect(stage, { name: "image", w: 768, h: 576, fill: "gray/700", radius: 12 });
  await text(stage, SITE.personal.gallery[0].caption, { name: "caption", style: "body/sm", color: "white", colorOpacity: 0.6, align: "CENTER" });
  const dotRow = frame(stage, { name: "dots", dir: "HORIZONTAL", gap: 8, pad: [4, 0, 0, 0] });
  SITE.personal.gallery.forEach((_, i) => instance(dotRow, "LightboxDot", { State: i === 0 ? "On" : "Off" }));
  const close = icon(c, "x", { name: "close", size: 24, color: "white", opacity: 0.7 });
  close.x = stage.x + 768 - 24;
  close.y = stage.y - 40;
  const prev = icon(c, "chevron-left", { name: "previous", size: 32, color: "white", opacity: 0.2 });
  prev.x = stage.x - 48;
  prev.y = stage.y + 288 - 16;
  const next = icon(c, "chevron-right", { name: "next", size: 32, color: "white", opacity: 0.7 });
  next.x = stage.x + 768 + 16;
  next.y = stage.y + 288 - 16;
  singleComponent("GalleryLightbox", c, { description: "src/components/GalleryLightbox.jsx — fixed overlay bg-black/85, Esc / arrow keys, prev disabled at 20% opacity on the first photo. Body scroll locked while open." });
  return dots;
}

/* ------------------------------------------------------------------ *
 * Hero + layout pieces
 * ------------------------------------------------------------------ */

async function buildContactInfo(parent) {
  const c = component(parent, { name: "ContactInfo", gap: 2, pad: [8, 12], w: 448, radius: "radius-md", fill: "white", stroke: { color: "border", opacity: 0.4 } });
  for (const g of SITE.identity.contactGuidance) {
    const row = frame(c, { name: g.key, dir: "HORIZONTAL", gap: 4, align: "CENTER", wrap: true });
    row.layoutSizingHorizontal = "FILL";
    await text(row, `${g.label}:`, { style: "label/contact", color: "text-muted" }).then((t) => (t.fontName = fontFor(TEXT_STYLE_DEFS["body/sm-medium"])));
    await text(row, g.text, { name: `${g.key}-text`, style: "label/contact", color: g.isEmail ? "primary" : "text-muted" });
  }
  return singleComponent("ContactInfo", c, { description: "src/components/ContactInfo.jsx — recruiter / contract guidance rows. Data: heroData.contactGuidance + emails (src/data/hero.js)." });
}

async function buildTypingLine(parent) {
  const line = SITE.typing.lines[0];
  const full = line.prefix + line.new + line.suffix;
  return variantSet(parent, "TypingLine", [{ prop: "Mode", values: ["Typing", "Strike", "Done"] }], async ({ Mode }) => {
    const c = component(null, { dir: "HORIZONTAL", gap: 2, align: "MAX" });
    if (Mode === "Strike") {
      await text(c, line.prefix, { style: "code/mono", color: "text-muted" });
      await text(c, line.old, { name: "struck", style: "code/mono", color: "text-muted", strike: true, opacity: 0.4 });
      await text(c, line.suffix || " ", { style: "code/mono", color: "text-muted" });
    } else {
      await text(c, Mode === "Typing" ? (line.prefix + line.old + line.suffix).slice(0, 10) : full, { name: "text", style: "code/mono", color: "text-muted" });
    }
    if (Mode !== "Done") {
      const cursor = rect(c, { name: "cursor", w: 2, h: 16, fill: "primary" });
      cursor.y = 4;
    }
    return c;
  }, {
    description: `src/components/TypingAnimation.jsx — types the old phrase (${SITE.typing.timing.typeSpeedMs}ms/char), pauses ${SITE.typing.timing.pauseMs}ms, strikes it (${SITE.typing.timing.strikePauseMs}ms), retypes the new phrase. Cursor is a 2px primary bar with animate-pulse. Lines are hard-coded in the component.`,
    props: [{ name: "Text", type: "TEXT", value: full, node: "text" }],
  });
}

async function buildIdentityBlock(parent) {
  const c = component(parent, { name: "IdentityBlock", gap: 0, pad: [48, 0, 0, 0], w: 240 });
  divider(c, "gray/100").name = "border-top";
  await text(c, SITE.identity.name, { name: "name", style: "heading/identity", color: "gray/900" });
  const t = await text(c, SITE.identity.title, { name: "title", style: "body/sm-medium", color: "gray/400", fill: true });
  t.y = 4;
  const socials = frame(c, { name: "socials", dir: "HORIZONTAL", gap: 20, align: "CENTER", pad: [24, 0, 16, 0] });
  for (const key of ["github", "linkedin", "instagram"]) {
    const ib = instance(socials, "IconBox", { State: "Default" });
    ib.name = `social/${key}`;
    const ic = ib.findOne((n) => n.type === "INSTANCE" && n.name === "icon");
    if (ic && KIT.icons[key]) {
      try {
        ic.swapComponent(KIT.icons[key]);
        recolorIcon(ic, "primary");
      } catch (err) {
        warn(`IdentityBlock ${key}: ${err.message}`);
      }
    }
    if (key === "instagram") ib.visible = Boolean(SITE.identity.socials.instagram);
  }
  return singleComponent("IdentityBlock", c, { description: "src/layout/IdentityBlock.jsx — sidebar footer. Instagram icon is hidden because heroData.socials has no instagram URL (the handle lives in personal.mdx instead)." });
}

async function buildMobileHeader(parent) {
  const set = await variantSet(parent, "MobileHeader", [{ prop: "State", values: ["Closed", "Open"] }], async ({ State }) => {
    const c = component(null, { dir: "HORIZONTAL", pad: 16, w: 390, align: "CENTER", fill: "white", fillOpacity: 0.85 });
    const btn = frame(c, { name: "menu-button", dir: "HORIZONTAL", pad: 8, radius: "radius-lg", align: "CENTER" });
    icon(btn, State === "Open" ? "x" : "menu", { size: 24, color: "gray/900" });
    const b = rect(c, { name: "border-bottom", w: 390, h: 1, fill: "border" });
    b.layoutPositioning = "ABSOLUTE";
    b.x = 0;
    b.y = c.height - 1;
    return c;
  }, { description: ".glass-header (src/layout/Layout.jsx) — md:hidden, bg-white/85 backdrop-blur-md border-b. Button hover bg-gray-100; icon swaps Menu ↔ X." });

  const sheet = component(parent, { name: "MobileMenu", gap: 16, pad: 16, w: 390, fill: "white", stroke: "border", effect: "shadow/xl" });
  for (const s of SITE.site.sections) {
    const item = instance(sheet, "NavItem", { State: s.id === SITE.site.sections[0].id ? "Active" : "Default" }, { fillW: true });
    setTextProps(item, { Label: s.label });
  }
  instance(sheet, "ThemeControls", {}, { fillW: true });
  singleComponent("MobileMenu", sheet, { description: "Mobile menu sheet (Layout.jsx) — fixed inset-x-0 top-16 z-40 bg-white border-b shadow-xl; closes on navigate." });
  return set;
}

/* ------------------------------------------------------------------ *
 * MDX components
 * ------------------------------------------------------------------ */

async function buildCallout(parent) {
  const sample = SITE.projects.flatMap((p) => p.blocks).find((b) => b.type === "callout") || { title: "Algorithmic Note", text: "Callout body.", variant: "aside" };
  return variantSet(parent, "Callout", [{ prop: "Type", values: ["Note", "Aside", "Warn"] }], async ({ Type }) => {
    const c = component(null, { dir: "HORIZONTAL", gap: 16, pad: 20, w: 704, align: "MIN", radius: "radius-lg", fill: "surface-muted", stroke: "border" });
    const ic = icon(c, { Note: "info", Aside: "lightbulb", Warn: "triangle-alert" }[Type], { name: "icon", size: 20, color: "primary" });
    ic.y = 2;
    const col = frame(c, { name: "content", gap: 8 });
    col.layoutSizingHorizontal = "FILL";
    await text(col, sample.title, { name: "title", style: "body/prose", color: "text-strong" }).then((t) => (t.fontName = fontFor(TEXT_STYLE_DEFS["body/sm-semibold"])));
    await text(col, sample.text, { name: "body", style: "body/prose", color: "text-muted", fill: true });
    return c;
  }, {
    description: "src/components/mdx/Callout.jsx — <Callout type=\"note|aside|warn\" title>. .surface-muted p-5 with a 20px primary icon.",
    props: [
      { name: "Title", type: "TEXT", value: sample.title, node: "title" },
      { name: "Body", type: "TEXT", value: sample.text, node: "body" },
      { name: "Show title", type: "BOOLEAN", value: true, node: "title" },
    ],
  });
}

async function buildFigure(parent) {
  const c = component(parent, { name: "Figure", gap: 12, w: 704, align: "CENTER" });
  const surface = frame(c, { name: "surface", dir: "NONE", w: 704, h: 396, radius: "radius-lg", fill: "surface", stroke: "border", effect: "shadow/soft", clip: true });
  rect(surface, { name: "image", w: 704, h: 396, fill: "gray/200" });
  await text(c, "Figure caption", { name: "caption", style: "body/sm", color: "text-muted", align: "CENTER" });
  return singleComponent("Figure", c, {
    description: "src/components/mdx/Figure.jsx — .section-surface image with an optional centred caption.",
    props: [{ name: "Caption", type: "TEXT", value: "Figure caption", node: "caption" }],
  });
}

/** BipartiteVisual — the interactive SVG in the Managerial DNA write-up, one variant per step. */
async function buildBipartiteVisual(parent) {
  const W = 640;
  const H = 320;
  const pct = (x, y) => ({ x: (x / 100) * W, y: (y / 100) * H });
  const positions = [
    [pct(25, 25), pct(25, 50), pct(25, 75)],
    [pct(50, 30), pct(50, 45), pct(25, 80)],
    [pct(42, 40), pct(58, 40), pct(50, 60)],
  ];
  const titles = ["The Factor Map (Bipartite Graph)", "Structural Equivalence (Scenario A)", "The Monoculture (Scenario B)"];
  const subtitles = [
    "Managers (Left) map to their factor behaviors across n distinct Market Regimes (Right).",
    "Regime nodes are removed. Managers 1 and 2 are linked by shared DNA across all n environments.",
    "All managers share the exact same DNA. Further analysis is required to find differentiation.",
  ];
  const buttons = ["Execute Projection", "What if they ALL match?", "Reset to Bipartite"];
  const regimes = [
    { y: 20, label: "Crash: Defensive", dashed: false },
    { y: 40, label: "Bull: Aggressive", dashed: false },
    { y: 60, label: "Stagnant: Yield", dashed: false },
    { y: 80, label: "... Regime n", dashed: true },
  ];

  const line = (canvas, a, b, color, weight, dashed, opacity) => {
    const v = figma.createVector();
    v.name = "edge";
    canvas.appendChild(v);
    v.vectorPaths = [{ windingRule: "NONE", data: `M ${a.x} ${a.y} L ${b.x} ${b.y}` }];
    v.strokes = [paintOf(color)];
    v.strokeWeight = weight;
    v.strokeCap = "ROUND";
    if (dashed) v.dashPattern = [4, 4];
    if (opacity !== undefined) v.opacity = opacity;
    v.x = Math.min(a.x, b.x);
    v.y = Math.min(a.y, b.y);
    return v;
  };

  return variantSet(parent, "BipartiteVisual", [{ prop: "Step", values: ["0", "1", "2"] }], async ({ Step }) => {
    const step = Number(Step);
    const mono = step === 2;
    const c = component(null, { gap: 24, pad: 32, w: 704, radius: "radius-lg", fill: "surface", stroke: "border", effect: "shadow/soft" });
    const head = frame(c, { name: "header", dir: "HORIZONTAL", gap: 16, align: "CENTER", justify: "SPACE_BETWEEN" });
    head.layoutSizingHorizontal = "FILL";
    const titles2 = frame(head, { name: "titles", gap: 4 });
    titles2.layoutSizingHorizontal = "FILL";
    await text(titles2, titles[step], { name: "title", style: "heading/card-bold", color: "text-strong" });
    await text(titles2, subtitles[step], { name: "subtitle", style: "body/sm", color: "text-muted", fill: true });
    const btn = instance(head, "Button", { State: "Default", Style: "Pill", Size: "Default" });
    setTextProps(btn, { Label: buttons[step], "Trailing icon": false });
    if (mono) {
      btn.fills = [tokenPaint("primary")];
      btn.strokes = [tokenPaint("primary-dark")];
      for (const t of btn.findAllWithCriteria({ types: ["TEXT"] })) t.fills = [tokenPaint("white")];
    }

    const canvas = frame(c, { name: "canvas", dir: "NONE", w: W, h: H, radius: "radius-lg", fill: "surface-muted", stroke: "border", clip: true });
    const P = positions[step];
    // bipartite edges (step 0 only)
    if (step === 0) {
      const right = (y) => pct(75, y);
      const edges = [[0, 20], [0, 40], [0, 80], [1, 20], [1, 40], [1, 80], [2, 60]];
      for (const [i, y] of edges) line(canvas, P[i], right(y), "border", 2, true);
      for (const r of regimes) {
        const box2 = frame(canvas, { name: r.label, dir: "HORIZONTAL", w: 110, h: 40, align: "CENTER", justify: "CENTER", radius: 8, fill: r.dashed ? null : "text-muted", stroke: r.dashed ? "text-muted" : null, strokeWeight: 2 });
        if (r.dashed) box2.dashPattern = [4, 4];
        box2.x = (75 / 100) * W - 55;
        box2.y = (r.y / 100) * H - 20;
        await text(box2, r.label, { style: "body/xs-semibold", color: r.dashed ? "text-muted" : "white", size: 10 });
      }
    } else {
      line(canvas, P[0], P[1], "primary", 8, false);
      if (mono) {
        line(canvas, P[1], P[2], "primary", 8, false);
        line(canvas, P[0], P[2], "primary", 8, false);
      }
    }
    // manager nodes
    for (let i = 0; i < 3; i++) {
      const node = frame(canvas, { name: `Fund ${i + 1}`, dir: "HORIZONTAL", w: 48, h: 48, align: "CENTER", justify: "CENTER", radius: "radius-full", fill: i === 2 && !mono ? "text-muted" : "primary-dark" });
      node.x = P[i].x - 24;
      node.y = P[i].y - 24;
      await text(node, `Fund ${i + 1}`, { style: "body/xs-semibold", color: "white" });
    }
    // info boxes
    if (step > 0) {
      const info = frame(canvas, { name: "info", gap: 4, pad: 16, w: 252, radius: 12, fill: "surface", fillOpacity: 0.95, stroke: mono ? "primary" : "border", effect: "shadow/lg" });
      await text(info, mono ? "Scenario B: The Monoculture" : "Scenario A: Partial Match", { style: "body/sm-semibold", color: mono ? "primary-dark" : "text-strong" });
      await text(info, mono
        ? "If all funds collapse into a single structural clone, the sector is a monoculture. Further analysis is required (e.g., hidden liquidity constraints, sub-factor tilts) to find true diversification."
        : "Fund 1 and Fund 2 reacted identically across all n market regimes. The algorithm collapses them into a single heavy cluster. Fund 3 drifted differently and is isolated.",
        { style: "body/xs", color: "text-muted", w: 220 });
      info.x = W - 24 - 252;
      info.y = H / 2 - info.height / 2;
    }
    return c;
  }, { description: "src/components/BipartiteVisual.jsx — embedded in manager-dna.mdx. The pill button cycles Step 0→1→2→0. Edges fade 700ms; nodes travel 1000ms ease-in-out; edge weight and node colours change per step." });
}

/* ------------------------------------------------------------------ *
 * Containers (documentation of the CSS surfaces)
 * ------------------------------------------------------------------ */

async function buildContainers(parent) {
  const specs = [
    { name: "SectionPanel", css: ".section-panel — p-6 md:p-8, bg surface, 1px border, radius-lg, shadow-soft. Wraps every home section and page block.", pad: 32, fill: "surface", stroke: "border", effect: "shadow/soft", radius: "radius-lg" },
    { name: "SurfaceMuted", css: ".surface-muted — bg surface-muted, 1px border, radius-lg. Pillars, quick stats, callouts, stat tiles, favorites.", pad: 24, fill: "surface-muted", stroke: "border", radius: "radius-lg" },
    { name: "SectionSurface", css: ".section-surface — like .section-panel without padding; used by Figure and the TravelMap frame.", pad: 0, fill: "surface", stroke: "border", effect: "shadow/soft", radius: "radius-lg" },
    { name: "Card", css: ".card — p-6 rounded-2xl (16px) bg surface border shadow-soft; .card-hover mixes 30% primary into the border.", pad: 24, fill: "surface", stroke: "border", effect: "shadow/soft", radius: 16 },
  ];
  for (const s of specs) {
    const c = component(parent, { name: s.name, gap: 8, pad: s.pad, w: 480, radius: s.radius, fill: s.fill, stroke: s.stroke, effect: s.effect });
    const inner = frame(c, { name: "content", gap: 4, pad: s.pad === 0 ? 24 : 0 });
    inner.layoutSizingHorizontal = "FILL";
    await text(inner, s.name, { style: "heading/card", color: "text-strong" });
    await text(inner, s.css, { style: "body/sm", color: "text-muted", fill: true });
    singleComponent(s.name, c, { description: s.css });
  }
  const back = await variantSet(parent, "BackLink", [{ prop: "State", values: ["Default", "Hover"] }], async ({ State }) => {
    const hover = State === "Hover";
    const c = component(null, { dir: "HORIZONTAL", gap: 8, align: "CENTER" });
    icon(c, "arrow-left", { size: 16, color: hover ? "primary" : "text-muted" });
    await text(c, "Home", { name: "label", style: "body/sm-medium", color: hover ? "primary" : "text-muted" });
    return c;
  }, {
    description: "src/components/PageShell.jsx back link — text-muted, hover primary (transition-colors). Every non-home route uses PageShell (no nav).",
    props: [{ name: "Label", type: "TEXT", value: "Home", node: "label" }],
  });
  return back;
}

/* ------------------------------------------------------------------ *
 * Page assembly
 * ------------------------------------------------------------------ */

async function buildComponentsPage() {
  const page = await getOrCreatePage(PAGE_NAMES.components);
  await figma.setCurrentPageAsync(page);

  const groups = [
    ["Icons", async (s) => [await buildIcons(s)]],
    ["Atoms", async (s) => [await buildEyebrow(s), await buildTagPill(s), await buildBadge(s), await buildTimelineDot(s), await buildIconBox(s)]],
    ["Actions", async (s) => [await buildButton(s), await buildTextLink(s), await buildExpandToggle(s), await buildContainers(s)]],
    ["Navigation", async (s) => [await buildNavItem(s), await buildThemeSwatch(s), await buildThemeControls(s), await buildIdentityBlock(s), await buildMobileHeader(s)]],
    ["Hero", async (s) => [await buildTypingLine(s), await buildContactInfo(s), await buildSectionTitle(s)]],
    ["Cards", async (s) => [await buildExperienceCard(s), await buildEducationCard(s), await buildProjectCard(s)]],
    ["Skills", async (s) => [await buildSkillCard(s), await buildPillarSummary(s), await buildPillarCard(s)]],
    ["Personal", async (s) => [await buildStatTile(s), await buildQuickStats(s), await buildGalleryTile(s), await buildMilestone(s), await buildFavoritesCard(s), await buildPlaceGroup(s)]],
    ["Travel map", async (s) => [await buildMapMarker(s), await buildMapTooltip(s), await buildMapBadge(s)]],
    ["Overlays", async (s) => [await buildLightbox(s)]],
    ["MDX", async (s) => [await buildCallout(s), await buildFigure(s), await buildBipartiteVisual(s)]],
  ];

  let y = 0;
  for (const [name, build] of groups) {
    const section = figma.createSection();
    section.name = name;
    page.appendChild(section);
    const made = await step(`Components · ${name}`, () => build(section));
    // Lay the section's children out in a row and size the section to fit.
    const pad = 48;
    let x = pad;
    let maxH = 0;
    for (const child of section.children) {
      child.x = x;
      child.y = pad;
      x += child.width + pad;
      maxH = Math.max(maxH, child.height);
    }
    section.resizeWithoutConstraints(Math.max(x, 600), maxH + pad * 2);
    section.x = 0;
    section.y = y;
    y += section.height + 120;
    if (!made) warn(`Section "${name}" finished with errors.`);
  }
  status(`Components: ${Object.keys(KIT.components).length} sets/components`);
  return page;
}
