import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the initial mount. Pages are prerendered, so the browser can restore
    // a saved scroll position on reload / bfcache — scrolling to the top here
    // would yank the reader back to the hero.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname]);
}
