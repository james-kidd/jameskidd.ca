import Callout from "./Callout";
import Figure from "./Figure";
import BipartiteVisual from "../BipartiteVisual";

export const mdxComponents = {
  Callout,
  Figure,
  BipartiteVisual,
  h2: (props) => (
    <h2
      className="text-2xl font-bold text-(--text-strong) mt-10 mb-4 tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-lg font-semibold text-(--text-strong) mt-8 mb-3"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-body text-[15px] leading-relaxed my-4" {...props} />
  ),
  ul: (props) => (
    <ul
      className="space-y-2 my-4 pl-5 list-disc marker:text-(--primary) text-[15px] text-(--text-muted) leading-relaxed"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="space-y-2 my-4 pl-5 list-decimal marker:text-(--primary) text-[15px] text-(--text-muted) leading-relaxed"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-(--text-strong)" {...props} />
  ),
  em: (props) => <em className="italic text-(--text-strong)" {...props} />,
  a: (props) => (
    <a
      className="text-(--primary) hover:text-(--primary-dark) underline underline-offset-2"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="px-1.5 py-0.5 rounded bg-(--surface-muted) border border-(--border) text-[0.9em] font-mono"
      {...props}
    />
  ),
};
