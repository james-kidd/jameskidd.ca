import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function NotFoundPage() {
  return (
    <PageShell>
      <div className="section-panel">
        <span className="eyebrow text-(--primary) mb-3 block">404</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-(--text-strong) tracking-tight mb-4">
          Page not found
        </h1>
        <p className="section-lead text-(--text-muted) mb-8">
          That link points somewhere that does not exist. The pages that do are
          all one click away.
        </p>
        <Link to="/" className="btn btn-primary inline-flex w-fit text-sm py-2.5 px-5">
          Back to home
        </Link>
      </div>
    </PageShell>
  );
}
