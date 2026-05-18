import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollToTop } from "./hooks/useScrollToTop";
import Layout from "./layout/Layout";
import HeroSection from "./sections/HeroSection";
import { SECTIONS } from "./sections/registry";
import { heroData, sectionData } from "./data";
import SkillsPage from "./pages/SkillsPage";
import ProjectPage from "./pages/ProjectPage";

function HomePage() {
  return (
    <>
      <HeroSection data={heroData} />

      {SECTIONS.map(({ id, Component }) => (
        <section id={id} key={id} className="section-block first:border-0">
          <Component data={sectionData[id]} />
        </section>
      ))}
    </>
  );
}

function AppRoutes({ currentTheme, setTheme }) {
  useScrollToTop();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            sections={SECTIONS}
            currentTheme={currentTheme}
            setTheme={setTheme}
          >
            <HomePage />
          </Layout>
        }
      />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
    </Routes>
  );
}

function App() {
  const [currentTheme, setCurrentTheme] = useState("tech");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) setCurrentTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
    localStorage.setItem("portfolio-theme", currentTheme);
  }, [currentTheme]);

  return (
    <BrowserRouter>
      <AppRoutes currentTheme={currentTheme} setTheme={setCurrentTheme} />
    </BrowserRouter>
  );
}

export default App;
