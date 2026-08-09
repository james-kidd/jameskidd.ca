import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useScrollSpy } from "../hooks/useScrollSpy";
import Navigation from "./Navigation";
import ThemeControls from "./ThemeControls";
import IdentityBlock from "./IdentityBlock";

export default function Layout({ children, sections, currentTheme }) {
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
            <ThemeControls currentTheme={currentTheme} />
          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden md:flex md:w-80 md:fixed md:inset-y-0 border-r bg-white"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex flex-col h-full px-10 py-10">
          <div className="mb-6 scale-90 origin-left opacity-80">
            <ThemeControls currentTheme={currentTheme} />
          </div>

          <div className="flex-1" />

          <nav className="space-y-1">
            <Navigation
              sections={sections}
              activeSection={activeSection}
              onNavigate={scrollToSection}
            />
          </nav>

          <div className="flex-1" />

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
