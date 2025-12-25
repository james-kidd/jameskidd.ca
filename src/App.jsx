import React, { useState, useEffect } from 'react';
import Layout from './layout/Layout';
import { siteConfig, heroData } from './data';
import * as SectionComponents from './sections';
import HeroSection from './sections/HeroSection';

function App() {
  const [currentTheme, setCurrentTheme] = useState('tech');

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) setCurrentTheme(saved);
  }, []);

  // Apply theme globally
  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
    localStorage.setItem('portfolio-theme', currentTheme);
  }, [currentTheme]);

  return (
    <Layout
      navigation={siteConfig.navigation}
      currentTheme={currentTheme}
      setTheme={setCurrentTheme}
    >
      <HeroSection data={heroData} />

      {siteConfig.navigation.map((item) => {
        const Component = SectionComponents[item.component];
        if (!Component) return null;

        return (
          <section
            id={item.id}
            key={item.id}
            className="py-20 border-t border-gray-100 first:border-0"
          >
            <Component data={item.data} />
          </section>
        );
      })}
    </Layout>
  );
}

export default App;
