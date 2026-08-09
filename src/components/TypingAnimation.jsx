import { useState, useEffect } from "react";

const LINES = [
  { prefix: "I ", old: "code with", new: "orchestrate AI with", suffix: " taste" },
  {
    prefix: "I design ",
    old: "reliable data systems",
    new: "to rely on",
    suffix: "",
  },
  { prefix: "I ", old: "train models", new: "calculate decisions", suffix: "" },
];

const TYPE_SPEED = 45;
const PAUSE = 600;
const STRIKE_PAUSE = 800;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function TypingAnimation() {
  const [completed, setCompleted] = useState([]);
  const [current, setCurrent] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Reset asynchronously so a StrictMode remount replays from the top
      // without setting state synchronously inside the effect body.
      await Promise.resolve();
      if (cancelled) return;

      setCompleted([]);
      setCurrent(null);
      setDone(false);

      for (let i = 0; i < LINES.length; i++) {
        const line = LINES[i];
        const oldFull = line.prefix + line.old + line.suffix;
        const newFull = line.prefix + line.new + line.suffix;

        for (let c = 0; c <= oldFull.length; c++) {
          if (cancelled) return;
          setCurrent({ mode: "typing", text: oldFull.slice(0, c) });
          await sleep(TYPE_SPEED);
        }

        await sleep(PAUSE);
        if (cancelled) return;

        setCurrent({
          mode: "strike",
          prefix: line.prefix,
          struck: line.old,
          suffix: line.suffix,
        });

        await sleep(STRIKE_PAUSE);
        if (cancelled) return;

        for (let c = 0; c <= newFull.length; c++) {
          if (cancelled) return;
          setCurrent({ mode: "typing", text: newFull.slice(0, c) });
          await sleep(TYPE_SPEED);
        }

        await sleep(PAUSE);
        if (cancelled) return;

        setCompleted((prev) => [...prev, newFull]);
        setCurrent(null);

        await sleep(200);
      }

      if (cancelled) return;
      setDone(true);
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="font-mono text-sm md:text-base space-y-1.5 text-(--text-muted)">
      {completed.map((text, i) => (
        <div key={i} className="text-(--text-body)">
          {text}
        </div>
      ))}

      {current && (
        <div className="text-(--text-body)">
          {current.mode === "strike" ? (
            <>
              <span>{current.prefix}</span>
              <span className="line-through opacity-40">{current.struck}</span>
              <span>{current.suffix}</span>
            </>
          ) : (
            <span>{current.text}</span>
          )}
          <span className="inline-block w-[2px] h-[1em] bg-(--primary) ml-0.5 align-text-bottom animate-pulse" />
        </div>
      )}

      {done && !current && (
        <span className="inline-block w-[2px] h-[1em] bg-(--primary) ml-0.5 animate-pulse opacity-0" />
      )}
    </div>
  );
}
