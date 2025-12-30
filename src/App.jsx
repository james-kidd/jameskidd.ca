import React, { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import HeroSection from "./sections/HeroSection";
import { SECTIONS } from "./sections/registry";
import { heroData, sectionData } from "./data";

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
    <Layout
      sections={SECTIONS}
      currentTheme={currentTheme}
      setTheme={setCurrentTheme}
    >
      <HeroSection data={heroData} />

      {SECTIONS.map(({ id, Component }) => (
        <section
          id={id}
          key={id}
          className="section-block first:border-0"
        >
          <Component data={sectionData[id]} />
        </section>
      ))}
    </Layout>
  );
}

export default App;
