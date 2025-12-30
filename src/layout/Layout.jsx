import { useState } from "react";
import { Menu, X, Github, Linkedin, Instagram } from "lucide-react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { heroData } from "../data";

/* ===================== HELPERS ===================== */

function Navigation({ sections, activeSection, onNavigate }) {
  return sections
    .filter((s) => s.nav !== false) // default: show
    .map(({ id, label, navLabel }) => {
      const isActive = activeSection === id;

      return (
        <a
          key={id}
          href={`#${id}`}
          onClick={(e) => onNavigate(e, id)}
          className={`nav-item ${isActive ? "active" : ""}`}
        >
          <span className="text-sm font-medium tracking-wide">
            {navLabel ?? label}
          </span>
          <span className="nav-indicator" />
        </a>
      );
    });
}


function ThemeControls({ currentTheme, setTheme }) {
  const themes = [
    { id: "tech", color: "#2563eb", label: "Tech" },
    { id: "nature", color: "#059669", label: "Nature" },
    { id: "editorial", color: "#be123c", label: "Editorial" },
  ];

  return (
    <div className="pt-4 border-t border-gray-100">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Theme
      </div>
      <div className="flex gap-4">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            aria-label={`Switch to ${t.label} theme`}
            className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
              currentTheme === t.id
                ? "ring-2 ring-offset-2 ring-gray-300 scale-110"
                : "border-transparent opacity-50 hover:opacity-100"
            }`}
            style={{ backgroundColor: t.color }}
          />
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ type, url }) {
  const ICONS = {
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
  };

  const Icon = ICONS[type];
  if (!url || !Icon) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="icon-soft hover:scale-110 transition-transform duration-200"
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

function IdentityBlock() {
  return (
    <div className="pt-12 border-t border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
        {heroData.name}
      </h1>

      <p className="text-sm font-medium text-gray-400 mb-6">
        {heroData.title}
      </p>

      <div className="flex items-center gap-5 mb-4">
        <SocialIcon type="github" url={heroData.socials?.github} />
        <SocialIcon type="linkedin" url={heroData.socials?.linkedin} />
        <SocialIcon type="instagram" url={heroData.socials?.instagram} />
      </div>
    </div>
  );
}

/* ===================== LAYOUT ===================== */

export default function Layout({ children, sections, currentTheme, setTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionIds = sections.map((s) => s.id);
  const activeSection = useScrollSpy(sectionIds);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen md:flex">
      {/* MOBILE HEADER */}
      <header className="md:hidden glass-header p-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-16 z-40 bg-white border-b shadow-xl"
          style={{ borderColor: "var(--border)" }}
        >
          <nav className="flex flex-col p-4 space-y-4">
            <Navigation
              sections={sections}
              activeSection={activeSection}
              onNavigate={scrollToSection}
            />
            <ThemeControls
              currentTheme={currentTheme}
              setTheme={setTheme}
            />
          </nav>
        </div>
      )}
      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex md:w-80 md:fixed md:inset-y-0 border-r bg-white"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex flex-col h-full px-10 py-10">

          {/* THEME CONTROLS (GLOBAL MODE) */}
          <div className="mb-6 scale-90 origin-left opacity-80">            
            <ThemeControls
              currentTheme={currentTheme}
              setTheme={setTheme}
            />
          </div>

          <div className="flex-1" />


          {/* NAVIGATION */}
          <nav className="space-y-1">
            <Navigation
              sections={sections}
              activeSection={activeSection}
              onNavigate={scrollToSection}
            />
          </nav>

          <div className="flex-1" />

          {/* IDENTITY (TERMINAL CONTENT) */}
          <IdentityBlock />

        </div>
      </aside>


      {/* CONTENT */}
      <main className="flex-1 md:ml-80">
        <div className="max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-20">
          {children}
        </div>
      </main>
    </div>
  );
}
