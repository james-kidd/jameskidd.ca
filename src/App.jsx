import { useSyncExternalStore } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { useRouteMeta } from "./hooks/useRouteMeta";
import ShellPage from "./pages/ShellPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  subscribeTheme,
  getThemeSnapshot,
  getServerThemeSnapshot,
} from "./theme";

// The site is one page. Sections, the project and personal pages and their
// components are still in the repo but are not routed: see src/data/hero.js.
function AppRoutes() {
  useScrollToTop();
  useRouteMeta();

  return (
    <Routes>
      <Route path="/" element={<ShellPage />} />
      {/* Prerendered to dist/404.html, which Vercel serves for unknown paths. */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/**
 * Router-agnostic app body. The client wraps this in <BrowserRouter>; the
 * prerenderer wraps it in <StaticRouter>.
 *
 * `localStorage` and `document` do not exist during prerendering, so the theme
 * is read through an external store whose server snapshot is `null`. The
 * server markup and the first client render therefore always match, and the
 * stored theme takes over immediately after hydration. First paint is still
 * correct because index.html applies `data-theme` inline before any CSS runs.
 */
export function AppShell() {
  // Subscribing keeps the stored theme applied after hydration.
  useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  return <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
