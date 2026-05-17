export default function Navigation({ sections, activeSection, onNavigate }) {
  return sections
    .filter((s) => s.nav !== false)
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
