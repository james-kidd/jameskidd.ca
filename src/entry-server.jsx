/* eslint-disable react-refresh/only-export-components -- build entry, never hot-reloaded */
// src/entry-server.jsx
//
// SSG entry point. Built with `vite build --ssr` and consumed by
// scripts/prerender.js — never shipped to the browser.

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
// React Router v7 exports StaticRouter from the package root; the v6-era
// "react-router-dom/server" subpath no longer exists.
import { StaticRouter } from "react-router-dom";
import { AppShell } from "./App.jsx";
export {
  getRoutePaths,
  resolveMeta,
  toHeadTags,
  canonicalUrl,
  DEFAULT_META,
  INDEXABLE_ROUTE_META,
} from "./seo";

/** Render one route to a static HTML string. */
export function render(pathname) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={pathname}>
        <AppShell />
      </StaticRouter>
    </StrictMode>
  );
}
