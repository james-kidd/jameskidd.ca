/* ================================================================== *
 * 40-motion.js — every movement on the site, isolated.
 *
 * One frame per interaction: what triggers it, which CSS properties move,
 * duration + easing (from the Tailwind classes / JS constants), and the
 * before/after states side by side. Prototype reactions are written onto
 * the master variants so any instance can be played in Present mode.
 * ================================================================== */

const MOTION_SPECS = [
  {
    id: "expand-experience",
    title: "Expand / collapse · ExperienceCard",
    source: "src/sections/components/ExperienceCard.jsx",
    trigger: "Click anywhere on the card header (useState toggle)",
    properties: "grid-template-rows 0fr → 1fr · opacity 0 → 1 · margin-top 0 → 16px · chevron swaps down/up · dot gains .active",
    timing: "500ms · ease-in-out (transition-all duration-500)",
    notes: "Hover on the whole .timeline-item turns rail, dot border and title primary (300ms).",
    component: "ExperienceCard",
    states: [{ State: "Collapsed" }, { State: "Hover" }, { State: "Expanded" }],
    wires: [
      { from: { State: "Collapsed" }, to: { State: "Expanded" }, trigger: "ON_CLICK", ms: 500, easing: "EASE_IN_AND_OUT", both: true },
      { from: { State: "Collapsed" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 300, easing: "EASE_OUT" },
    ],
  },
  {
    id: "expand-education",
    title: "Expand / collapse · EducationCard",
    source: "src/sections/components/EducationCard.jsx",
    trigger: "Click on the trigger block",
    properties: "max-height 0 → 500px · opacity 0 → 1 · margin-top 0 → 16px · dot scale 1 → 1.25 + fill primary · label 'View details' ↔ 'Hide details'",
    timing: "500ms · ease-out (transition-all duration-500 ease-out); dot 300ms",
    notes: "Trigger block hover: bg gray-50, school title + 'View details' turn primary.",
    component: "EducationCard",
    states: [{ State: "Collapsed" }, { State: "Hover" }, { State: "Expanded" }],
    wires: [
      { from: { State: "Collapsed" }, to: { State: "Expanded" }, trigger: "ON_CLICK", ms: 500, easing: "EASE_OUT", both: true },
      { from: { State: "Collapsed" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 300, easing: "EASE_OUT" },
    ],
  },
  {
    id: "expand-project",
    title: "Expand / collapse · ProjectCard (accordion)",
    source: "src/sections/ProjectsSection.jsx + components/ProjectCard.jsx",
    trigger: "Click header — only one card open at a time (expandedIndex state, featured project open by default)",
    properties: "grid-template-rows 0fr → 1fr · opacity 0 → 1 · one-line description hides · 'Live Demo' badge hides while open",
    timing: "500ms · ease-in-out",
    notes: "Title turns primary on hover (transition-colors). 'Details' link stops propagation so it navigates instead of toggling.",
    component: "ProjectCard",
    states: [{ State: "Collapsed", Featured: "No" }, { State: "Expanded", Featured: "No" }, { State: "Collapsed", Featured: "Yes" }],
    wires: [
      { from: { State: "Collapsed", Featured: "No" }, to: { State: "Expanded", Featured: "No" }, trigger: "ON_CLICK", ms: 500, easing: "EASE_IN_AND_OUT", both: true },
      { from: { State: "Collapsed", Featured: "Yes" }, to: { State: "Expanded", Featured: "Yes" }, trigger: "ON_CLICK", ms: 500, easing: "EASE_IN_AND_OUT", both: true },
    ],
  },
  {
    id: "expand-pillar",
    title: "Expand / collapse · PillarCard (/skills)",
    source: "src/pages/SkillsPage.jsx (PillarCard)",
    trigger: "Click the header button",
    properties: "grid-template-rows 0fr → 1fr · opacity 0 → 1 · margin-top 0 → 20px · chevron swaps",
    timing: "500ms · ease-in-out",
    component: "PillarCard",
    states: [{ State: "Collapsed" }, { State: "Expanded" }],
    wires: [{ from: { State: "Collapsed" }, to: { State: "Expanded" }, trigger: "ON_CLICK", ms: 500, easing: "EASE_IN_AND_OUT", both: true }],
  },
  {
    id: "tag-pill-hover",
    title: "Hover · TagPill",
    source: "src/index.css (.tag-pill)",
    trigger: "Hover the pill, or hover a parent .group (skill cards, timeline items)",
    properties: "background gray-100 → white · border transparent → primary · text gray-600 → primary · shadow-sm",
    timing: "200ms · transition-colors",
    notes: "Selected = TravelMap region filter (bg primary, text white) — instant, driven by state.",
    component: "TagPill",
    states: [{ State: "Default" }, { State: "Hover" }, { State: "Selected" }],
    wires: [{ from: { State: "Default" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 200, easing: "EASE_OUT" }],
  },
  {
    id: "button-hover",
    title: "Hover / press · Button",
    source: "src/index.css (.btn-primary, .btn-outline, .btn-pill)",
    trigger: "Hover; pill also reacts to :active",
    properties: "Primary: bg primary → primary-dark · Outline: text + border → primary · Pill: border → primary/50, text → primary; :active scale 0.95",
    timing: "150ms · transition-colors (Tailwind default); pill transition-all",
    component: "Button",
    states: [
      { State: "Default", Style: "Primary", Size: "Default" }, { State: "Hover", Style: "Primary", Size: "Default" },
      { State: "Default", Style: "Outline", Size: "Default" }, { State: "Hover", Style: "Outline", Size: "Default" },
      { State: "Default", Style: "Pill", Size: "Default" }, { State: "Hover", Style: "Pill", Size: "Default" },
    ],
    wires: [
      { from: { State: "Default", Style: "Primary", Size: "Default" }, to: { State: "Hover", Style: "Primary", Size: "Default" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
      { from: { State: "Default", Style: "Outline", Size: "Default" }, to: { State: "Hover", Style: "Outline", Size: "Default" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
      { from: { State: "Default", Style: "Pill", Size: "Default" }, to: { State: "Hover", Style: "Pill", Size: "Default" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
      { from: { State: "Default", Style: "Primary", Size: "Small" }, to: { State: "Hover", Style: "Primary", Size: "Small" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
      { from: { State: "Default", Style: "Outline", Size: "Small" }, to: { State: "Hover", Style: "Outline", Size: "Small" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
      { from: { State: "Default", Style: "Pill", Size: "Small" }, to: { State: "Hover", Style: "Pill", Size: "Small" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
    ],
  },
  {
    id: "text-link-hover",
    title: "Hover · TextLink arrow nudge",
    source: "SkillsSection.jsx, PersonalSection.jsx, ProjectCard.jsx",
    trigger: "Hover the link (or its .group parent)",
    properties: "underline (primary tone) / text → primary (muted tone) · arrow translate-x 0 → 4px",
    timing: "150ms · transition-colors + transition-transform",
    component: "TextLink",
    states: [{ State: "Default", Tone: "Primary" }, { State: "Hover", Tone: "Primary" }, { State: "Default", Tone: "Muted" }, { State: "Hover", Tone: "Muted" }],
    wires: [
      { from: { State: "Default", Tone: "Primary" }, to: { State: "Hover", Tone: "Primary" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
      { from: { State: "Default", Tone: "Muted" }, to: { State: "Hover", Tone: "Muted" }, trigger: "ON_HOVER", ms: 150, easing: "EASE_OUT" },
    ],
  },
  {
    id: "nav-item",
    title: "Hover + scroll-spy · NavItem",
    source: "src/layout/Navigation.jsx · src/hooks/useScrollSpy.js · src/index.css (.nav-item)",
    trigger: "Hover; Active follows the section crossing the viewport middle (IntersectionObserver, rootMargin -50% 0px -50% 0px)",
    properties: "Hover: bg white, text gray-900, shadow-sm, indicator border primary · Active: bg white, text primary, 1px border, indicator filled primary-dark",
    timing: "200ms · transition-all",
    notes: "Click smooth-scrolls to the section (scrollIntoView behavior: smooth) and closes the mobile menu.",
    component: "NavItem",
    states: [{ State: "Default" }, { State: "Hover" }, { State: "Active" }],
    wires: [
      { from: { State: "Default" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 200, easing: "EASE_OUT" },
      { from: { State: "Default" }, to: { State: "Active" }, trigger: "ON_CLICK", ms: 200, easing: "EASE_OUT" },
    ],
  },
  {
    id: "theme-switch",
    title: "Theme switch · ThemeSwatch + palette swap",
    source: "src/layout/ThemeControls.jsx · src/theme.js · index.html inline script",
    trigger: "Click a swatch → setTheme(id) writes <html data-theme> and localStorage 'portfolio-theme'",
    properties: "Swatch: ring-2 ring-offset-2 ring-gray-300 + scale 1.1 (selected) vs opacity 0.5 → 1 on hover · every --token re-resolves through [data-theme] — no CSS transition on the tokens, the palette swaps instantly",
    timing: "200ms · transition-all on the swatch; palette 0ms",
    notes: "Other tabs follow via the storage event. Prerendered HTML has no theme; the inline script applies it before first paint.",
    component: "ThemeSwatch",
    states: SITE.site.themes.flatMap((t) => [{ Selected: "No", Theme: t.label }, { Selected: "Yes", Theme: t.label }]),
    wires: SITE.site.themes.map((t) => ({ from: { Selected: "No", Theme: t.label }, to: { Selected: "Yes", Theme: t.label }, trigger: "ON_CLICK", ms: 200, easing: "EASE_OUT", both: true })),
  },
  {
    id: "icon-box-hover",
    title: "Hover · IconBox / SocialIcon",
    source: "src/index.css (.icon-box) · src/components/SocialIcon.jsx",
    trigger: "Hover the .group parent (skill card, pillar) or the social link",
    properties: "bg primary/10 → primary/20 · icon primary → primary-dark · SocialIcon: scale 1 → 1.1",
    timing: "200ms · transition-colors / transition-transform",
    component: "IconBox",
    states: [{ State: "Default" }, { State: "Hover" }],
    wires: [{ from: { State: "Default" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 200, easing: "EASE_OUT" }],
  },
  {
    id: "expand-toggle",
    title: "Hover + toggle · ExpandToggle",
    source: "src/components/ExpandToggle.jsx",
    trigger: "Hover nudges the chevron; click flips isExpanded (label + chevron)",
    properties: "chevron translate-y ±2px (group-hover) · label 'View More' ↔ 'Show Less' · chevron-down ↔ chevron-up",
    timing: "150ms · transition-transform",
    component: "ExpandToggle",
    states: [{ State: "Collapsed" }, { State: "Expanded" }],
    wires: [{ from: { State: "Collapsed" }, to: { State: "Expanded" }, trigger: "ON_CLICK", ms: 150, easing: "EASE_OUT", both: true }],
  },
  {
    id: "gallery-hover",
    title: "Hover · GalleryTile → Lightbox",
    source: "src/sections/PersonalSection.jsx · src/pages/PersonalPage.jsx · src/components/GalleryLightbox.jsx",
    trigger: "Hover the tile; click opens the lightbox at that index",
    properties: "image scale 1 → 1.05 · overlay black/0 → black/30 · caption opacity 0 → 1 · lightbox: fixed inset-0 bg-black/85, body overflow hidden, Esc / ← → keys, dots bg-white/35 ↔ white, prev/next disabled at 20% opacity",
    timing: "image 500ms · overlay 300ms · caption 150ms (transition-transform / transition-colors / transition-opacity); lightbox mounts instantly",
    component: "GalleryTile",
    states: [{ State: "Default" }, { State: "Hover" }],
    wires: [{ from: { State: "Default" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 500, easing: "EASE_OUT" }],
  },
  {
    id: "typing",
    title: "Hero typing animation",
    source: "src/components/TypingAnimation.jsx",
    trigger: "Mounts once per page load (StrictMode remount replays it)",
    properties: `Per line: type the old phrase at ${SITE.typing.timing.typeSpeedMs}ms/char → pause ${SITE.typing.timing.pauseMs}ms → strike the old phrase (line-through, opacity 0.4) for ${SITE.typing.timing.strikePauseMs}ms → type the new phrase → pause ${SITE.typing.timing.pauseMs}ms → commit and wait 200ms → next line. Cursor: 2px primary bar, animate-pulse (2s, cubic-bezier(.4,0,.6,1), infinite), hidden when done.`,
    timing: `${SITE.typing.timing.typeSpeedMs}ms/char · pauses ${SITE.typing.timing.pauseMs}/${SITE.typing.timing.strikePauseMs}/200ms`,
    notes: `Script: ${SITE.typing.lines.map((l) => `"${l.prefix}[${l.old} → ${l.new}]${l.suffix}"`).join(" · ")} (hard-coded LINES constant).`,
    component: "TypingLine",
    states: [{ Mode: "Typing" }, { Mode: "Strike" }, { Mode: "Done" }],
    wires: [
      { from: { Mode: "Typing" }, to: { Mode: "Strike" }, trigger: "ON_CLICK", ms: SITE.typing.timing.strikePauseMs, easing: "LINEAR" },
      { from: { Mode: "Strike" }, to: { Mode: "Done" }, trigger: "ON_CLICK", ms: SITE.typing.timing.pauseMs, easing: "LINEAR" },
      { from: { Mode: "Done" }, to: { Mode: "Typing" }, trigger: "ON_CLICK", ms: 200, easing: "LINEAR" },
    ],
  },
  {
    id: "bipartite",
    title: "Step cycle · BipartiteVisual",
    source: "src/components/BipartiteVisual.jsx (embedded in manager-dna.mdx)",
    trigger: "Click the pill button: step = (step + 1) % 3",
    properties: "bipartite edges + regime boxes opacity 1 → 0 · projected edges opacity 0 → 1 · Fund nodes travel to new cx/cy · Fund 3 fill text-muted → primary-dark on step 2 · info box mounts (no transition) · button turns solid primary on step 2",
    timing: "edges 700ms · regime boxes 500ms · node travel 1000ms ease-in-out (transition-all duration-1000)",
    component: "BipartiteVisual",
    states: [{ Step: "0" }, { Step: "1" }, { Step: "2" }],
    wires: [
      { from: { Step: "0" }, to: { Step: "1" }, trigger: "ON_CLICK", ms: 1000, easing: "EASE_IN_AND_OUT" },
      { from: { Step: "1" }, to: { Step: "2" }, trigger: "ON_CLICK", ms: 1000, easing: "EASE_IN_AND_OUT" },
      { from: { Step: "2" }, to: { Step: "0" }, trigger: "ON_CLICK", ms: 1000, easing: "EASE_IN_AND_OUT" },
    ],
  },
  {
    id: "places",
    title: "Accordion · PlaceGroup (/personal)",
    source: "src/pages/PersonalPage.jsx",
    trigger: "Click a region — one open at a time (expandedGroup state)",
    properties: "bg surface → secondary · border → primary · city pills mount below (no transition) · hover: shadow-sm",
    timing: "150ms · transition-all",
    component: "PlaceGroup",
    states: [{ State: "Closed" }, { State: "Open" }],
    wires: [{ from: { State: "Closed" }, to: { State: "Open" }, trigger: "ON_CLICK", ms: 150, easing: "EASE_OUT", both: true }],
  },
  {
    id: "mobile-menu",
    title: "Mobile menu · MobileHeader",
    source: "src/layout/Layout.jsx",
    trigger: "Tap the menu button (isMobileMenuOpen state); closes when a nav item is tapped",
    properties: "icon Menu ↔ X · sheet (fixed inset-x-0 top-16, bg white, border-b, shadow-xl) mounts / unmounts with no transition · button hover bg gray-100",
    timing: "0ms (mount) · 150ms button hover",
    component: "MobileHeader",
    states: [{ State: "Closed" }, { State: "Open" }],
    wires: [{ from: { State: "Closed" }, to: { State: "Open" }, trigger: "ON_CLICK", ms: 0, easing: "LINEAR", both: true }],
  },
  {
    id: "map",
    title: "Travel map · filters, markers, tooltip",
    source: "src/sections/TravelMap.jsx",
    trigger: "Click a region filter; hover / focus a marker",
    properties: "filter chip → Selected · ZoomableGroup jumps to the region's center/zoom (react-simple-maps, no tween) · markers filtered by country · Geography hover fill: visited color-mix(primary 25%, surface) / others surface-muted · MapTooltip mounts top-right on hover/focus · count badge updates",
    timing: "marker transition-opacity / transition-transform 200ms (no state change today) · everything else instant",
    component: "MapMarker",
    states: [{ Kind: "City" }, { Kind: "University" }],
    wires: [],
  },
  {
    id: "skill-card-hover",
    title: "Hover · SkillCard (.card-hover)",
    source: "src/index.css (.card, .card-hover)",
    trigger: "Hover or focus-within",
    properties: "border-color → color-mix(primary 30%, border) · child tag pills go to their hover state (group-hover)",
    timing: "300ms · transform, box-shadow, border-color, background-color",
    component: "SkillCard",
    states: [{ State: "Default" }, { State: "Hover" }],
    wires: [{ from: { State: "Default" }, to: { State: "Hover" }, trigger: "ON_HOVER", ms: 300, easing: "EASE_OUT" }],
  },
  {
    id: "routing",
    title: "Route + scroll behaviour (no component)",
    source: "src/hooks/useScrollToTop.js · src/hooks/useRouteMeta.js · src/layout/Layout.jsx",
    trigger: "pathname change · nav click · mobile 'Swipe to explore' hint",
    properties: "window.scrollTo(0,0) on every route change except the first mount (keeps browser scroll restoration) · <head> title/meta/canonical updated in an effect · nav click: scrollIntoView({ behavior: 'smooth' }) · hint chevron: animate-pulse at 40% opacity",
    timing: "smooth scroll (browser) · pulse 2s infinite",
    component: null,
    states: [],
    wires: [],
  },
];

async function motionCard(page, spec) {
  const card = frame(page, { name: `Motion · ${spec.id}`, gap: 20, pad: 32, w: 1120, radius: 24, fill: "surface", stroke: "border", effect: "shadow/soft" });
  await docHeader(card, spec.title, spec.source);
  const specs = frame(card, { name: "spec", gap: 8 });
  specs.layoutSizingHorizontal = "FILL";
  await specRow(specs, "Trigger", spec.trigger);
  await specRow(specs, "Animates", spec.properties);
  await specRow(specs, "Timing", spec.timing);
  if (spec.notes) await specRow(specs, "Notes", spec.notes);

  if (spec.component && KIT.components[spec.component]) {
    const set = KIT.components[spec.component];
    const row = frame(card, { name: "states", dir: "HORIZONTAL", gap: 32, align: "MIN", wrap: true, pad: [8, 0, 0, 0] });
    row.layoutSizingHorizontal = "FILL";
    for (const props of spec.states) {
      const cell = frame(row, { name: Object.values(props).join(" / "), gap: 8, align: "MIN" });
      await text(cell, Object.keys(props).map((k) => `${k}=${props[k]}`).join(", "), { style: "body/xs", color: "text-muted" });
      const inst = instance(cell, spec.component, props);
      if (inst.width > 1056) inst.resize(1056, inst.height);
    }
    // Interactions live on the master variants so every instance can play them.
    for (const w of spec.wires) {
      const from = variantOf(set, w.from);
      const to = variantOf(set, w.to);
      if (!from || !to || from === to) continue;
      await wire(from, to, w.trigger, w.ms, w.easing);
      if (w.both) await wire(to, from, w.trigger, w.ms, w.easing);
    }
    if (spec.wires.length) {
      await text(card, `Prototype: ${spec.wires.length} interaction${spec.wires.length > 1 ? "s" : ""} written on the ${spec.component} variants (smart animate). Open any instance in Present mode to play it.`, { style: "body/xs", color: "text-muted", fill: true });
    }
  } else if (spec.component) {
    warn(`Motion spec ${spec.id}: component ${spec.component} not built.`);
  }
  return card;
}

async function buildMotionPage() {
  const page = await getOrCreatePage(PAGE_NAMES.motion);
  await figma.setCurrentPageAsync(page);

  const intro = frame(page, { name: "About this page", gap: 12, pad: 32, w: 1120, radius: 24, fill: "secondary", stroke: "border" });
  await docHeader(intro, "Motion & States", "Every animation and toggle on jameskidd.ca, isolated: trigger, animated properties, duration and easing, and the before/after states as instances. Durations come from the Motion variable collection on the Foundations page.");
  await text(intro, "Rule of thumb from the code: colour hovers 200ms, card hovers 300ms, expand/collapse 500ms, the BipartiteVisual 700–1000ms. Everything uses Tailwind's default ease (cubic-bezier(.4,0,.2,1)) unless the card says ease-out.", { style: "body/sm", color: "text-muted", fill: true });

  const cards = [intro];
  for (const spec of MOTION_SPECS) {
    const card = await step(`Motion · ${spec.id}`, () => motionCard(page, spec));
    if (card) cards.push(card);
  }
  placeBelow(cards, 0, 0, 64);
  return page;
}
