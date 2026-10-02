/* ================================================================== *
 * 50-content.js — Content model page (copy deck), Cover, Getting started.
 * ================================================================== */

/** Key/value rows for one record; nested arrays/objects are flattened to text. */
async function recordCard(parent, title, record, opts) {
  const o = opts || {};
  const card = frame(parent, { name: title, gap: 8, pad: 16, radius: "radius-lg", fill: "surface", stroke: "border" });
  card.layoutSizingHorizontal = "FILL";
  await text(card, title, { style: "body/sm-semibold", color: "text-strong", fill: true });
  for (const key of Object.keys(record)) {
    if ((o.skip || []).includes(key)) continue;
    const value = record[key];
    if (value === null || value === undefined || value === "") continue;
    let shown;
    if (Array.isArray(value)) {
      shown = value.every((v) => typeof v !== "object") ? value.join(" · ") : `${value.length} items`;
    } else if (typeof value === "object") {
      shown = Object.keys(value).map((k) => `${k}: ${typeof value[k] === "object" ? JSON.stringify(value[k]) : value[k]}`).join(" · ");
    } else {
      shown = String(value);
    }
    await specRow(card, key, shown);
  }
  return card;
}

async function collectionFrame(page, title, caption) {
  const f = frame(page, { name: title, gap: 16, pad: 32, w: 1120, radius: 24, fill: "surface-muted", stroke: "border" });
  await docHeader(f, title, caption);
  return f;
}

async function buildContentPage() {
  const page = await getOrCreatePage(PAGE_NAMES.content);
  await figma.setCurrentPageAsync(page);
  const frames = [];

  const intro = await collectionFrame(page, "Content model", `Every string the site renders, grouped the way the repo stores it. Generated from design/content/site-content.json — edit the source file named on each card, run \`npm run design:content\`, then rebuild this kit. Content (sentences) lives in src/content/*.mdx; data (lists, links, numbers) lives in src/data/*.js.`);
  frames.push(intro);

  const identity = await collectionFrame(page, "Identity + navigation", "src/data/hero.js · src/theme.js · src/sections/registry.js");
  await recordCard(identity, "heroData", SITE.identity, { skip: ["contactGuidance", "source"] });
  await recordCard(identity, "contactGuidance", Object.fromEntries(SITE.identity.contactGuidance.map((g) => [g.label, g.text])));
  await recordCard(identity, "themes", Object.fromEntries(SITE.site.themes.map((t) => [t.id, `${t.label} ${t.color}${t.default ? " (default)" : ""}`])));
  await recordCard(identity, "sections (home order + nav)", Object.fromEntries(SITE.site.sections.map((s, i) => [String(i + 1), `${s.label} (#${s.id})`])));
  await recordCard(identity, "typing animation script", Object.fromEntries(SITE.typing.lines.map((l, i) => [`line ${i + 1}`, `${l.prefix}[${l.old} → ${l.new}]${l.suffix}`])));
  frames.push(identity);

  const about = await collectionFrame(page, "About + education", "src/content/about.mdx · src/data/sections/education.js");
  await recordCard(about, "about.mdx", Object.fromEntries(SITE.about.intro.map((p, i) => [`¶${i + 1}`, p])));
  for (const e of SITE.about.education) {
    await recordCard(about, e.school, { degree: e.degree, year: e.year, description: e.description, coursework: e.coursework.map((c) => `${c.code} — ${c.name}`) });
  }
  frames.push(about);

  const exp = await collectionFrame(page, "Experience", "src/content/experience/*.mdx · groups in src/data/sections/index.js");
  for (const g of SITE.experience.groups) {
    for (const id of g.roles) {
      const r = SITE.experience.roles.find((x) => x.id === id);
      await recordCard(exp, `${g.label} · ${r.title}`, { company: r.company, date: r.date, skills: r.skills, link: r.link, body: r.paragraphs.join("\n\n"), source: r.source });
    }
  }
  frames.push(exp);

  const skills = await collectionFrame(page, "Skills", "src/data/skills-detail.js · src/data/sections/skills.js · src/content/pillars/*.mdx");
  await recordCard(skills, "skillsDetailData", { headline: SITE.skills.headline, positioning: SITE.skills.positioning, sectionLead: SITE.skills.sectionLead });
  for (const b of SITE.skills.blocks) await recordCard(skills, `block · ${b.title}`, { id: b.id, icon: b.icon, items: b.items });
  for (const p of SITE.skills.pillars) await recordCard(skills, `pillar · ${p.title}`, { subtitle: p.subtitle, icon: p.icon, evidence: p.evidence, description: p.paragraphs.join("\n\n"), source: p.source });
  frames.push(skills);

  const projects = await collectionFrame(page, "Projects", "src/content/projects/*.mdx — frontmatter is data, the body is the write-up");
  for (const p of SITE.projects) {
    const body = p.blocks.map((b) => {
      if (b.type === "heading") return `${"#".repeat(b.level)} ${b.text}`;
      if (b.type === "paragraph") return b.text;
      if (b.type === "list") return b.items.map((i) => `• ${i}`).join("\n");
      if (b.type === "callout") return `[${b.variant}${b.title ? ": " + b.title : ""}] ${b.text}`;
      if (b.type === "embed") return `<${b.component} />`;
      return "———";
    }).join("\n\n");
    await recordCard(projects, p.title, { slug: p.slug, featured: p.featured ? "yes" : "no", tag: p.tag, description: p.description, skills: p.skills, link: p.link, demo: p.demo, embed: p.embed, "write-up": body, source: p.source });
  }
  frames.push(projects);

  const personal = await collectionFrame(page, "Personal", "src/content/personal.mdx · src/data/sections/personal/*.js");
  await recordCard(personal, "personal.mdx", { title: SITE.personal.title, instagram: SITE.personal.instagram, handle: SITE.personal.instagramHandle, description: SITE.personal.description.join("\n\n") });
  await recordCard(personal, "stats (QuickStats)", Object.fromEntries(SITE.personal.stats.map((s) => [s.label, s.value])));
  for (const m of SITE.personal.milestones) await recordCard(personal, `milestone · ${m.title}`, { date: m.date, location: m.location, description: m.description });
  await recordCard(personal, "favorites", SITE.personal.favorites);
  await recordCard(personal, "gallery", Object.fromEntries(SITE.personal.gallery.map((g) => [g.id, `${g.src} · "${g.caption}" · alt: ${g.alt}`])));
  frames.push(personal);

  const travel = await collectionFrame(page, "Travel (generated)", "src/data/travel.js is auto-generated from photo EXIF — do not edit. Filters + regions are hard-coded in TravelMap.jsx / PersonalPage.jsx.");
  await recordCard(travel, "stats", SITE.travel.stats);
  await recordCard(travel, "countries", Object.fromEntries(SITE.travel.countries.map((c) => [c.code, `${c.name} (${c.photos})`])));
  await recordCard(travel, "map filters", Object.fromEntries(SITE.travel.mapFilters.map((f) => [f.label, f.codes ? f.codes.join(", ") : "all"])));
  await recordCard(travel, "regions", Object.fromEntries(SITE.travel.regions.map((r) => [r.name, r.codes.join(", ")])));
  await recordCard(travel, "cities", Object.fromEntries(SITE.travel.cities.map((c) => [`${c.city}, ${c.countryCode}`, `${c.photos} photos · ${c.firstVisit}–${c.lastVisit}${c.tag ? " · " + c.tag : ""}`])));
  frames.push(travel);

  const ui = await collectionFrame(page, "UI strings still inside components", "Copy that is not yet in src/data or src/content — the migration backlog. Each row names the file it was lifted from.");
  await recordCard(ui, "strings", Object.fromEntries(SITE.ui.map((s) => [s.key, `"${s.text}" — ${s.source}`])));
  frames.push(ui);

  const routes = await collectionFrame(page, "Routes + <title>", "src/seo.js builds these from the same inputs; the prerenderer emits one HTML file per route.");
  await recordCard(routes, "routes", Object.fromEntries(SITE.routes.map((r) => [r.path, r.title])));
  frames.push(routes);

  placeBelow(frames, 0, 0, 64);
  return page;
}

/* ------------------------------------------------------------------ *
 * Cover + Getting started
 * ------------------------------------------------------------------ */

async function buildCoverPage() {
  const page = await getOrCreatePage(PAGE_NAMES.cover);
  await figma.setCurrentPageAsync(page);
  const cover = frame(page, { name: "Cover", gap: 24, pad: 96, w: 1600, h: 900, justify: "MAX", fill: "surface-muted" });
  setTextProps(instance(cover, "Eyebrow"), { Label: "Design kit · generated from the codebase" });
  const title = frame(cover, { name: "title", dir: "HORIZONTAL", gap: 0, align: "MAX" });
  await text(title, SITE.site.name, { style: "display/hero", color: "gray/900" });
  await text(title, ".", { style: "display/hero", color: "primary" });
  await text(cover, `${SITE.identity.title} — ${SITE.site.url}`, { style: "body/lead-lg", color: "text-muted" });
  const meta = frame(cover, { name: "meta", gap: 4, pad: [24, 0, 0, 0] });
  await text(meta, `Pages: ${Object.values(PAGE_NAMES).join(" · ")}`, { style: "body/sm", color: "text-muted" });
  await text(meta, `Built ${new Date().toISOString().slice(0, 10)} · ${Object.keys(KIT.vars).length} variables · ${Object.keys(KIT.textStyles).length} text styles · ${Object.keys(KIT.components).length} components · ${Object.keys(KIT.icons).length} icons`, { style: "body/sm", color: "text-muted" });
  const swatches = frame(cover, { name: "themes", dir: "HORIZONTAL", gap: 16, pad: [16, 0, 0, 0] });
  for (const t of SITE.site.themes) instance(swatches, "ThemeSwatch", { Selected: t.default ? "Yes" : "No", Theme: t.label });
  return page;
}

async function buildStartPage() {
  const page = await getOrCreatePage(PAGE_NAMES.start);
  await figma.setCurrentPageAsync(page);
  const doc = frame(page, { name: "Getting started", gap: 24, pad: 48, w: 960, radius: 24, fill: "surface", stroke: "border" });
  await docHeader(doc, "How this file maps to the code", "The kit is generated by design/figma-plugin in the jameskidd.ca repository. Re-run the plugin after content or token changes; tick 'Replace' to rebuild in place.");
  const rows = [
    ["Variables", "Global + Theme collections use the exact CSS custom-property names (surface, primary, radius-lg …). Export them as DTCG JSON to overwrite tokens/*.json — see docs/figma-tokens.md. Primitives (gray/*) are Tailwind values still used directly in JSX. Spacing and Motion are reference collections."],
    ["Text styles", "Named by role (display/hero, body/prose, label/eyebrow). Each description carries the Tailwind classes it mirrors. Sans = Inter (stand-in for system-ui / Segoe UI); the editorial theme's Georgia is stored in the font-family-sans variable."],
    ["Components", "Named after the React components. Variant axes are the states the code actually has (State=Collapsed/Hover/Expanded, Featured=Yes/No …). Text that comes from data is exposed as TEXT properties; icons as INSTANCE_SWAP."],
    ["Screens", "Every route, assembled from instances and filled with the real content. Theme previews pin each Theme mode so the palette can be compared side by side."],
    ["Motion & States", "One card per interaction with trigger, animated CSS properties, duration and easing, and prototype links on the master variants (smart animate)."],
    ["Content model", "A copy deck of every string, grouped by source file. Use it to review copy; edit the source, not the Figma text."],
    ["Editing", "Change the design here, then port to code: colours → tokens/*.json, type → src/index.css @layer components, structure → the component files named in each set's description. Or push the kit tokens back with npm run tokens."],
    ["Code Connect", "Sets are named 1:1 with src/components, src/sections/components and src/layout, so a .figma.jsx map per component is a straight mapping."],
  ];
  for (const [k, v] of rows) await specRow(doc, k, v);
  return page;
}
