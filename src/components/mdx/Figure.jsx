export default function Figure({ src, alt, caption }) {
  return (
    <figure className="my-8">
      <div className="section-surface overflow-hidden">
        <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-(--text-muted) text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
