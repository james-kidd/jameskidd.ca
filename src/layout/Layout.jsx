import React, { useState } from "react";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { heroData } from "../data/index";

export default function Layout({
  children,
  navigation,
  currentTheme,
  setTheme,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* Scroll Spy */
  const sectionIds = navigation.map((nav) => nav.id);
  const activeSection = useScrollSpy(sectionIds);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  /* Social Icons */
  const SocialIcon = ({ type, url }) => {
    const icons = {
      github: <Github className="w-5 h-5" />,
      linkedin: <Linkedin className="w-5 h-5" />,
      instagram: <Instagram className="w-5 h-5" />,
    };
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="icon-soft hover:scale-110 transition-transform duration-200"
      >
        {icons[type]}
      </a>
    );
  };
  /* Theme Button */
  const ThemeButton = ({ themeName, color, label }) => (
    <button
      onClick={() => setTheme(themeName)}
      className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
        currentTheme === themeName
          ? "ring-2 ring-offset-2 ring-gray-300 scale-110"
          : "border-transparent opacity-50 hover:opacity-100"
      }`}
      style={{ backgroundColor: color }}
      title={label}
      aria-label={`Switch to ${label} theme`}
    />
  );

  return (
    <div className="min-h-screen md:flex">

      {/* MOBILE HEADER */}
      <header className="md:hidden glass-header p-4 flex justify-between items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-xl">
          <nav className="flex flex-col p-4 space-y-4">
            {navigation.map((nav) => (
              <a
                key={nav.id}
                href={`#${nav.id}`}
                onClick={(e) => scrollToSection(e, nav.id)}
                className={
                  activeSection === nav.id
                    ? "text-(--primary)"
                    : "text-gray-600"
                }
              >
                {nav.label}
              </a>
            ))}

            <div className="pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Theme
              </div>
              <div className="flex gap-4">
                <ThemeButton themeName="tech" color="#2563eb" label="Tech" />
                <ThemeButton themeName="nature" color="#059669" label="Nature" />
                <ThemeButton themeName="editorial" color="#be123c" label="Editorial" />
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-80 md:fixed md:inset-y-0 border-r border-gray-100 bg-white">
        <div className="flex flex-col h-full px-10 py-12">

          {/* NAVIGATION */}
          <nav className="space-y-1">
            {navigation.map((nav) => {
              const isActive = activeSection === nav.id;
              return (
                <a
                  key={nav.id}
                  href={`#${nav.id}`}
                  onClick={(e) => scrollToSection(e, nav.id)}
                  className={`
                    group flex items-center justify-between
                    py-3 px-2 rounded-lg
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-gray-50/80 text-(--primary)"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="text-sm font-medium tracking-wide">
                    {nav.label}
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-(--primary) scale-100"
                        : "bg-gray-300 scale-0 group-hover:scale-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* IDENTITY / CONTACT */}
          <div className="pt-8 border-t border-gray-100">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
              {heroData.name}
            </h1>

            <p className="text-sm font-medium text-gray-400 mb-6">
              {heroData.title}
            </p>

            <div className="flex items-center gap-5 mb-4">
              <SocialIcon type="github" url={heroData.socials?.github} />
              <SocialIcon type="linkedin" url={heroData.socials?.linkedin} />
            </div>

            {heroData.contact?.email && (
              <a
                href={`mailto:${heroData.contact.email}`}
                className="block mb-6 text-xs font-mono text-gray-400 hover:text-(--primary)"
              >
                {heroData.contact.email}
              </a>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                Mode
              </span>
              <div className="flex gap-3">
                <ThemeButton themeName="tech" color="#2563eb" label="Tech" />
                <ThemeButton themeName="nature" color="#059669" label="Nature" />
                <ThemeButton themeName="editorial" color="#be123c" label="Editorial" />
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-80 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-20">
          {children}
        </div>
      </main>
    </div>
  );
}
