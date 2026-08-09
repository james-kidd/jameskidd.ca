// src/hooks/useRouteMeta.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resolveMeta, toHeadTags } from "../seo";

function upsertMeta({ selector, attrs, content }) {
  let el = document.head.querySelector(selector);

  if (!el) {
    el = document.createElement("meta");
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');

  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }

  el.setAttribute("href", href);
}

/**
 * Keeps <head> in sync with the active route on client-side navigation.
 *
 * The prerendered HTML already ships the correct tags for a cold load, so this
 * only ever mutates tags that already exist — it never duplicates them, and it
 * runs in an effect so it cannot disturb hydration.
 */
export function useRouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, canonical, metas } = toHeadTags(resolveMeta(pathname));

    document.title = title;
    metas.forEach(upsertMeta);
    upsertCanonical(canonical);
  }, [pathname]);
}
