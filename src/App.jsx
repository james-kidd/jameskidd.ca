import { createElement, useSyncExternalStore } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollToTop } from "./hooks/useScrollToTop";
import { useRouteMeta } from "./hooks/useRouteMeta";
import Layout from "./layout/Layout";
import HeroSection from "./sections/HeroSection";
import { SECTIONS } from "./sections/registry";
import { heroData, sectionData } from "./data";
import SkillsPage from "./pages/SkillsPage";
import ProjectPage from "./pages/ProjectPage";
import PersonalPage from "./pages/PersonalPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  subscribeTheme,
  getThemeSnapshot,
  getServerThemeSnapshot,
} from "./theme";

function HomePage() {
  return (
    <>
      <HeroSection data={heroData} />

      {SECTIONS.map(({ id, Component }) => (
        <section id={id} key={id} className="section-block first:border-0">
          {createElement(Component, { data: sectionData[id] })}
        </section>
      ))}
    </>
  );
}

function AppRoutes({ currentTheme }) {
  useScrollToTop();
  useRouteMeta();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout sections={SECTIONS} currentTheme={currentTheme}>
            <HomePage />
          </Layout>
        }
      />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/personal" element={<PersonalPage />} />
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
  const currentTheme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  return <AppRoutes currentTheme={currentTheme} />;
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
