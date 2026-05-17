import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageShell({ children, backLabel = "Home" }) {
  return (
    <div className="min-h-screen bg-(--surface-muted)">
      <div className="max-w-3xl mx-auto px-6 py-12 md:px-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) hover:text-(--primary) transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        {children}
      </div>
    </div>
  );
}
