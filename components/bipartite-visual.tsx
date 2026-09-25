"use client";

import { useState } from "react";

/**
 * Three-step walkthrough of the Managerial DNA graph: the bipartite factor
 * map, its projection onto managers, and the degenerate "everyone matches"
 * case. Positions are percentages of a fixed-height SVG, so the drawing
 * follows the column width while the labels stay at their normal text size.
 */

type Step = 0 | 1 | 2;

const STEPS: { title: string; subtitle: string; button: string }[] = [
  {
    title: "The Factor Map (Bipartite Graph)",
    subtitle: "Managers (left) map to their factor behaviors across n distinct market regimes (right).",
    button: "Execute projection",
  },
  {
    title: "Structural Equivalence (Scenario A)",
    subtitle: "Regime nodes are removed. Managers 1 and 2 are linked by shared DNA across all n environments.",
    button: "What if they all match?",
  },
  {
    title: "The Monoculture (Scenario B)",
    subtitle: "All managers share the exact same DNA. Further analysis is required to find differentiation.",
    button: "Reset to bipartite",
  },
];

const NOTES: Record<Step, { title: string; body: string } | null> = {
  0: null,
  1: {
    title: "Scenario A: Partial match",
    body: "Fund 1 and Fund 2 reacted identically across all n market regimes. The algorithm collapses them into a single heavy cluster. Fund 3 drifted differently and is isolated.",
  },
  2: {
    title: "Scenario B: The monoculture",
    body: "If all funds collapse into a single structural clone, the sector is a monoculture. Further analysis is required (e.g., hidden liquidity constraints, sub-factor tilts) to find true diversification.",
  },
};

// Fund positions per step, as [x, y] percentages of the drawing.
const FUNDS: Record<Step, [string, string][]> = {
  0: [["22%", "25%"], ["22%", "50%"], ["22%", "75%"]],
  1: [["50%", "32%"], ["50%", "52%"], ["22%", "80%"]],
  2: [["38%", "40%"], ["62%", "40%"], ["50%", "66%"]],
};
const FUND_R = 28;

const REGIMES: { y: string; label: string; dashed?: boolean }[] = [
  { y: "18%", label: "Crash: Defensive" },
  { y: "39%", label: "Bull: Aggressive" },
  { y: "60%", label: "Stagnant: Yield" },
  { y: "81%", label: "… Regime n", dashed: true },
];
const REGIME_X = "76%";
const REGIME_W = 144;
const REGIME_H = 36;

// Which fund (index) is drawn to which regime (index) in the bipartite view.
const EDGES: [number, number][] = [
  [0, 0], [0, 1], [0, 3],
  [1, 0], [1, 1], [1, 3],
  [2, 2],
];

const MOVE = "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-in-out";
const FADE = "motion-safe:transition-opacity motion-safe:duration-500";

export function BipartiteVisual() {
  const [step, setStep] = useState<Step>(0);
  const funds = FUNDS[step];
  const projected = step > 0;
  const monoculture = step === 2;
  const note = NOTES[step];
  const [f1, f2, f3] = funds;

  return (
    <div className="card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="t-heading">{STEPS[step]?.title}</p>
          <p className="t-small mt-1 text-ink-muted">{STEPS[step]?.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setStep(((step + 1) % 3) as Step)}
          className={`${monoculture ? "btn" : "btn-ghost"} t-label shrink-0`}
        >
          {STEPS[step]?.button}
        </button>
      </div>

      <svg
        role="img"
        aria-label={STEPS[step]?.title}
        className="mt-5 h-80 w-full rounded-sm border border-line bg-surface"
      >
        {/* Bipartite edges */}
        <g className={`${FADE} ${projected ? "opacity-0" : "opacity-100"}`}>
          {EDGES.map(([fund, regime]) => {
            const from = FUNDS[0][fund];
            const to = REGIMES[regime];
            if (!from || !to) return null;
            return (
              <line
                key={`${fund}-${regime}`}
                x1={from[0]}
                y1={from[1]}
                x2={REGIME_X}
                y2={to.y}
                className="stroke-line"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            );
          })}
        </g>

        {/* Projected (unipartite) edges */}
        {f1 && f2 && f3 && (
          <g className={`${FADE} ${projected ? "opacity-100" : "opacity-0"}`}>
            <line x1={f1[0]} y1={f1[1]} x2={f2[0]} y2={f2[1]} className="stroke-accent" strokeWidth={7} />
            <g className={`${FADE} ${monoculture ? "opacity-100" : "opacity-0"}`}>
              <line x1={f2[0]} y1={f2[1]} x2={f3[0]} y2={f3[1]} className="stroke-accent" strokeWidth={7} />
              <line x1={f1[0]} y1={f1[1]} x2={f3[0]} y2={f3[1]} className="stroke-accent" strokeWidth={7} />
            </g>
          </g>
        )}

        {/* Regime nodes */}
        <g className={`${FADE} ${projected ? "opacity-0" : "opacity-100"}`}>
          {REGIMES.map(({ y, label, dashed }) => (
            <g key={label}>
              <rect
                x={REGIME_X}
                y={y}
                width={REGIME_W}
                height={REGIME_H}
                rx={6}
                transform={`translate(${-REGIME_W / 2}, ${-REGIME_H / 2})`}
                className={dashed ? "fill-transparent stroke-ink-muted" : "fill-ink-muted"}
                strokeWidth={dashed ? 1.5 : 0}
                strokeDasharray={dashed ? "4 4" : undefined}
              />
              <text
                x={REGIME_X}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`t-label ${dashed ? "fill-ink-muted" : "fill-surface"}`}
              >
                {label}
              </text>
            </g>
          ))}
        </g>

        {/* Fund nodes */}
        {funds.map(([x, y], i) => {
          const matched = i < 2 || monoculture;
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={FUND_R}
                className={`${MOVE} ${matched ? "fill-accent" : "fill-ink-muted"}`}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`t-label ${MOVE} ${matched ? "fill-accent-ink" : "fill-surface"}`}
              >
                Fund {i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="t-small mt-4 min-h-[3.5rem]" aria-live="polite">
        {note ? (
          <>
            <p className="text-ink">{note.title}</p>
            <p className="mt-1 text-ink-muted">{note.body}</p>
          </>
        ) : (
          <p className="text-ink-muted">
            Edges are weighted by inverse Euclidean distance: the closer a manager&apos;s behaviour to a regime-specific
            risk profile, the heavier the edge.
          </p>
        )}
      </div>
    </div>
  );
}
