export default function SectionTitle({ icon: Icon, children, className = "" }) {
  return (
    <h2 className={`section-title ${className}`}>
      {Icon && <Icon className="w-7 h-7 text-(--primary)" />}
      {children}
    </h2>
  );
}
