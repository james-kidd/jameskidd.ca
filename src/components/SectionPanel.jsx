export default function SectionPanel({ children, className = "" }) {
  return (
    <div className="section-shell">
      <div className={`section-panel space-y-10 ${className}`}>
        {children}
      </div>
    </div>
  );
}
