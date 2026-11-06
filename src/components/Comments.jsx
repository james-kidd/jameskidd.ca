import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { commentsConfig } from "../data/comments";

const GISCUS_SRC = "https://giscus.app/client.js";

/**
 * Click-to-load giscus thread. `term` identifies the thread, normally the
 * page path without a leading slash ("projects/<slug>"). Renders nothing
 * until src/data/comments.js has `enabled: true` and the ids filled in.
 *
 * The script is injected only after the click, inside an effect, so the
 * prerender pass never touches `document` and no visitor loads giscus
 * without asking for it.
 */
export default function Comments({ term }) {
  const [wanted, setWanted] = useState(false);
  const host = useRef(null);

  useEffect(() => {
    if (!wanted || !host.current) return undefined;
    const target = host.current;

    const script = document.createElement("script");
    script.src = GISCUS_SRC;
    script.async = true;
    script.crossOrigin = "anonymous";
    const attributes = {
      "data-repo": commentsConfig.repo,
      "data-repo-id": commentsConfig.repoId,
      "data-category": commentsConfig.category,
      "data-category-id": commentsConfig.categoryId,
      "data-mapping": "specific",
      "data-term": term,
      "data-strict": "1",
      "data-reactions-enabled": "0",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "preferred_color_scheme",
      "data-lang": "en",
    };
    for (const [name, value] of Object.entries(attributes)) {
      script.setAttribute(name, value);
    }
    target.appendChild(script);

    return () => {
      target.replaceChildren();
    };
  }, [wanted, term]);

  if (!commentsConfig.enabled) return null;

  return (
    <section aria-labelledby="comments-heading" className="section-panel">
      <h2 id="comments-heading" className="font-bold text-lg text-(--text-strong) mb-2">
        Comments
      </h2>
      {wanted ? (
        <div ref={host} className="giscus" />
      ) : (
        <>
          <p className="text-body text-sm mb-4">
            Comments run on GitHub Discussions. Loading them fetches a script from giscus.app;
            posting needs a GitHub account.
          </p>
          <button type="button" className="btn btn-outline text-sm py-2.5 px-5" onClick={() => setWanted(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Load comments
          </button>
        </>
      )}
    </section>
  );
}
