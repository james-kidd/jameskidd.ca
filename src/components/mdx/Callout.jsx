import { Info, Lightbulb, AlertTriangle } from "lucide-react";

const ICONS = {
  note: Info,
  aside: Lightbulb,
  warn: AlertTriangle,
};

export default function Callout({ type = "note", title, children }) {
  const Icon = ICONS[type] ?? Info;

  return (
    <aside className="my-6 surface-muted p-5 flex gap-4">
      <Icon className="w-5 h-5 mt-0.5 shrink-0 text-(--primary)" />
      <div className="space-y-2 text-[15px] leading-relaxed">
        {title && (
          <p className="font-semibold text-(--text-strong) m-0">{title}</p>
        )}
        <div className="text-body [&>p]:m-0 [&>p+p]:mt-2">{children}</div>
      </div>
    </aside>
  );
}
