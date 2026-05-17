const THEMES = [
  { id: "tech", color: "#2563eb", label: "Tech" },
  { id: "nature", color: "#059669", label: "Nature" },
  { id: "editorial", color: "#be123c", label: "Editorial" },
];

export default function ThemeControls({ currentTheme, setTheme }) {
  return (
    <div className="pt-4 border-t border-gray-100">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Theme
      </div>
      <div className="flex gap-4">
        {THEMES.map((t) => (
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
