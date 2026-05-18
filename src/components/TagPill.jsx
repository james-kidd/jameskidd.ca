export default function TagPill({ children, href, title }) {
  const className = "tag-pill";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        title={title}
        className={className}
      >
        {children}
      </a>
    );
  }

  return <span className={className}>{children}</span>;
}
