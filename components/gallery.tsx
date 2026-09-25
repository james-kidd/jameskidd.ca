"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/schema";

/**
 * Photo grid with a lightbox. The lightbox is a native <dialog>, which gives
 * focus trapping and Escape-to-close for free; arrow keys move between photos.
 */
export function Gallery({ photos, className = "" }: { photos: Photo[]; className?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) el.showModal();
    if (index === null && el.open) el.close();
  }, [index]);

  const current = index === null ? undefined : photos[index];
  const prev = () => setIndex((i) => (i === null ? i : Math.max(0, i - 1)));
  const next = () => setIndex((i) => (i === null ? i : Math.min(photos.length - 1, i + 1)));

  return (
    <>
      <ul className={`grid grid-cols-2 gap-3 ${className}`}>
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-md bg-surface-raised"
              aria-label={`Open photo: ${photo.alt}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 240px, 45vw"
                className="object-cover motion-safe:transition-transform motion-safe:duration-500 group-hover:scale-105"
              />
              {photo.caption && (
                <span className="t-label absolute inset-x-0 bottom-0 bg-linear-to-t from-overlay to-transparent px-3 pb-2 pt-8 text-left text-on-overlay">
                  {photo.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIndex(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") prev();
          if (event.key === "ArrowRight") next();
        }}
        className="fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none bg-transparent p-0 text-on-overlay backdrop:bg-overlay"
      >
        {current && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
            <figure className="flex w-full max-w-4xl flex-col items-center gap-3">
              <div className="relative h-[75vh] w-full">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="rounded-md object-contain"
                  priority
                />
              </div>
              {current.caption && <figcaption className="t-small opacity-80">{current.caption}</figcaption>}
            </figure>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous photo"
                className="rounded-sm p-1 opacity-80 hover:opacity-100 disabled:opacity-25"
              >
                <ChevronLeft className="size-6" aria-hidden />
              </button>
              <ul className="flex gap-2">
                {photos.map((photo, i) => (
                  <li key={photo.src}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Photo ${i + 1}`}
                      aria-current={i === index}
                      className={`block size-2 rounded-full bg-on-overlay ${i === index ? "" : "opacity-35"}`}
                    />
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={next}
                disabled={index === photos.length - 1}
                aria-label="Next photo"
                className="rounded-sm p-1 opacity-80 hover:opacity-100 disabled:opacity-25"
              >
                <ChevronRight className="size-6" aria-hidden />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIndex(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-sm p-1 opacity-80 hover:opacity-100"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
