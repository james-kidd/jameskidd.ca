"use client";

import { useEffect, useState } from "react";
import type { Site } from "@/content/schema";

type Line = Site["typingLines"][number];
type Current = { mode: "typing"; text: string } | { mode: "strike"; line: Line };

const TYPE_SPEED = 45;
const PAUSE = 600;
const STRIKE_PAUSE = 800;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const phrase = (line: Line, word: string) => `${line.prefix}${word}${line.suffix ?? ""}`;

/**
 * Types each line, strikes the old phrase, retypes it with the new one.
 * Renders nothing on the server; an invisible copy of the finished lines
 * reserves the space so the page does not shift while it plays. Visitors who
 * prefer reduced motion get the finished lines straight away.
 */
export function TypingAnimation({ lines }: { lines: Line[] }) {
  const [completed, setCompleted] = useState<string[]>([]);
  const [current, setCurrent] = useState<Current | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Yield once so a StrictMode remount replays cleanly from the top.
      await Promise.resolve();
      if (cancelled) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCompleted(lines.map((line) => phrase(line, line.next)));
        return;
      }

      setCompleted([]);
      setCurrent(null);

      for (const line of lines) {
        const before = phrase(line, line.old);
        const after = phrase(line, line.next);

        for (let i = 0; i <= before.length; i++) {
          if (cancelled) return;
          setCurrent({ mode: "typing", text: before.slice(0, i) });
          await sleep(TYPE_SPEED);
        }
        await sleep(PAUSE);
        if (cancelled) return;

        setCurrent({ mode: "strike", line });
        await sleep(STRIKE_PAUSE);
        if (cancelled) return;

        for (let i = 0; i <= after.length; i++) {
          if (cancelled) return;
          setCurrent({ mode: "typing", text: after.slice(0, i) });
          await sleep(TYPE_SPEED);
        }
        await sleep(PAUSE);
        if (cancelled) return;

        setCompleted((prev) => [...prev, after]);
        setCurrent(null);
        await sleep(200);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [lines]);

  return (
    <div className="t-code grid">
      {/* Reserves the final height. Hidden from screen readers and pointer events. */}
      <div className="invisible col-start-1 row-start-1" aria-hidden>
        {lines.map((line, i) => (
          <div key={i}>{phrase(line, line.next)}</div>
        ))}
      </div>

      <div className="col-start-1 row-start-1">
        {completed.map((text, i) => (
          <div key={i}>{text}</div>
        ))}
        {current && (
          <div>
            {current.mode === "strike" ? (
              <>
                {current.line.prefix}
                <span className="text-ink-muted line-through">{current.line.old}</span>
                {current.line.suffix}
              </>
            ) : (
              current.text
            )}
            <span
              className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-accent align-text-bottom"
              aria-hidden
            />
          </div>
        )}
      </div>
    </div>
  );
}
