// scripts/prerender.js
//
// Turns the client build into real, crawlable HTML.
//
// Runs after both Vite passes:
//   1. `vite build`                              -> dist/            (client assets + template)
//   2. `vite build --ssr src/entry-server.jsx`   -> dist-ssr/        (node render bundle)
//   3. this script                               -> dist/<route>/index.html
//
// For every route in src/seo.js it renders the React tree to a string, injects
// it into #root, and swaps the <!--seo:start-->…<!--seo:end--> block in
// index.html for that route's title / description / canonical / OG / Twitter
// tags. The browser bundle then hydrates the markup it finds.

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CLIENT_DIR = join(ROOT, "dist");
const SERVER_ENTRY = join(ROOT, "dist-ssr", "entry-server.js");

const ROOT_PLACEHOLDER = '<div id="root"></div>';
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

/** Minimal HTML attribute-value escaping for meta content. */
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderHead({ title, canonical, metas }) {
  const lines = [
    "<!--seo:start-->",
    `    <title>${escapeText(title)}</title>`,
    ...metas.map(({ attrs, content }) => {
      const attrString = Object.entries(attrs)
        .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
        .join(" ");
      return `    <meta ${attrString} content="${escapeAttr(content)}" />`;
    }),
    `    <link rel="canonical" href="${escapeAttr(canonical)}" />`,
    "    <!--seo:end-->",
  ];

  return lines.join("\n");
}

/**
 * `/` -> dist/index.html, `/projects/foo` -> dist/projects/foo.html
 *
 * Flat `.html` files (rather than `<route>/index.html`) are what both
 * `vite preview` and Vercel's `cleanUrls` resolve for an extensionless URL.
 */
function outputPathFor(routePath) {
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  return clean ? join(CLIENT_DIR, `${clean}.html`) : join(CLIENT_DIR, "index.html");
}

function renderSitemap(routeMeta, canonicalUrl) {
  const urls = routeMeta
    .map((meta) => `  <url><loc>${escapeText(canonicalUrl(meta.path))}</loc></url>`)
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

function renderRobots(sitemapUrl) {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl}`, ""].join("\n");
}

/**
 * The sitewide fallback tags in index.html are hand-written, so they can drift
 * from DEFAULT_META. Production is unaffected (every route is rewritten below),
 * but `npm run dev` would serve the stale copy — so say so loudly.
 */
function warnOnDefaultDrift(template, defaultMeta) {
  const stale = [defaultMeta.title, defaultMeta.description].filter(
    (value) => !template.includes(escapeText(value)) && !template.includes(escapeAttr(value))
  );

  if (stale.length > 0) {
    console.warn(
      "prerender: index.html's <!--seo:start--> defaults no longer match DEFAULT_META in src/seo.js.\n" +
        "           Prerendered pages are correct; only `npm run dev` serves the stale copy."
    );
  }
}

async function main() {
  try {
    await access(SERVER_ENTRY);
  } catch {
    throw new Error(
      `prerender: missing ${SERVER_ENTRY.slice(ROOT.length + 1)} — run \`npm run build:ssr\` first (or just \`npm run build\`).`
    );
  }

  const templatePath = join(CLIENT_DIR, "index.html");
  // Read the template up front: the `/` route overwrites this same file.
  const template = await readFile(templatePath, "utf8");

  if (!template.includes(ROOT_PLACEHOLDER)) {
    throw new Error(`prerender: could not find ${ROOT_PLACEHOLDER} in ${templatePath}`);
  }
  if (!SEO_BLOCK.test(template)) {
    throw new Error(`prerender: could not find the <!--seo:start--> block in ${templatePath}`);
  }

  const {
    render,
    getRoutePaths,
    resolveMeta,
    toHeadTags,
    canonicalUrl,
    DEFAULT_META,
    INDEXABLE_ROUTE_META,
  } = await import(pathToFileURL(SERVER_ENTRY).href);

  warnOnDefaultDrift(template, DEFAULT_META);

  const routes = getRoutePaths();

  for (const routePath of routes) {
    const appHtml = render(routePath);
    const head = renderHead(toHeadTags(resolveMeta(routePath)));

    const html = template
      .replace(SEO_BLOCK, () => head)
      .replace(ROOT_PLACEHOLDER, () => `<div id="root">${appHtml}</div>`);

    const outFile = outputPathFor(routePath);
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html, "utf8");

    console.log(`prerendered ${routePath} -> ${outFile.slice(ROOT.length + 1)}`);
  }

  const sitemapUrl = canonicalUrl("/sitemap.xml");
  await writeFile(
    join(CLIENT_DIR, "sitemap.xml"),
    renderSitemap(INDEXABLE_ROUTE_META, canonicalUrl),
    "utf8"
  );
  await writeFile(join(CLIENT_DIR, "robots.txt"), renderRobots(sitemapUrl), "utf8");

  console.log(
    `prerender: ${routes.length} route(s) + sitemap.xml + robots.txt written to dist/`
  );
}

main().catch((error) => {
  console.error("prerender failed:", error);
  process.exitCode = 1;
});
