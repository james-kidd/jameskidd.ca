export function Tags({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="tag t-small">
          {item}
        </li>
      ))}
    </ul>
  );
}
