import { ChevronDown, ChevronUp } from "lucide-react";

export default function ExpandToggle({ isExpanded, onToggle, expandedLabel = "Show Less", collapsedLabel = "View More" }) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="btn-pill group"
    >
      <span>{isExpanded ? expandedLabel : collapsedLabel}</span>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
      ) : (
        <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
      )}
    </button>
  );
}
