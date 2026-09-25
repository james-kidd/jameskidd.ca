import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20 md:py-32">
      <p className="t-label">404</p>
      <h1 className="t-title mt-3">Page not found</h1>
      <p className="t-lead mt-4 text-ink-muted">
        That link points somewhere that does not exist. The pages that do are all one click away.
      </p>
      <Link href="/" className="btn-ghost t-label mt-8">
        <ArrowLeft className="size-4" aria-hidden />
        Back to home
      </Link>
    </section>
  );
}
