import React, { useState } from 'react';

export default function BipartiteVisual() {
  const [step, setStep] = useState(0);

  const getTitle = () => {
    if (step === 0) return "The Factor Map (Bipartite Graph)";
    if (step === 1) return "Structural Equivalence (Scenario A)";
    return "The Monoculture (Scenario B)";
  };

  const getSubtitle = () => {
    if (step === 0) return "Managers (Left) map to their factor behaviors across n distinct Market Regimes (Right).";
    if (step === 1) return "Regime nodes are removed. Managers 1 and 2 are linked by shared DNA across all n environments.";
    return "All managers share the exact same DNA. Further analysis is required to find differentiation.";
  };

  const getButtonText = () => {
    if (step === 0) return "Execute Projection";
    if (step === 1) return "What if they ALL match?";
    return "Reset to Bipartite";
  };

  const pos1 = step === 0 ? { x: "25%", y: "25%" } : (step === 1 ? { x: "50%", y: "30%" } : { x: "42%", y: "40%" });
  const pos2 = step === 0 ? { x: "25%", y: "50%" } : (step === 1 ? { x: "50%", y: "45%" } : { x: "58%", y: "40%" });
  const pos3 = step === 0 ? { x: "25%", y: "75%" } : (step === 1 ? { x: "25%", y: "80%" } : { x: "50%", y: "60%" });

  const monoculture = step === 2;

  return (
    <div className="my-8 section-panel">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h4 className="text-lg font-bold" style={{ color: "var(--text-strong)" }}>
            {getTitle()}
          </h4>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {getSubtitle()}
          </p>
        </div>
        <button
          onClick={() => setStep((prev) => (prev + 1) % 3)}
          className="btn-pill text-sm font-semibold"
          style={monoculture ? {
            background: "var(--primary)",
            color: "white",
            borderColor: "var(--primary-dark)",
          } : undefined}
        >
          {getButtonText()}
        </button>
      </div>

      <div
        className="relative w-full h-80 rounded-lg overflow-hidden"
        style={{
          background: "var(--surface-muted)",
          border: "1px solid var(--border)",
        }}
      >
        <svg className="absolute inset-0 w-full h-full">
          {/* Bipartite Edges */}
          <g className={`transition-opacity duration-700 ${step > 0 ? 'opacity-0' : 'opacity-100'}`}>
            {[
              ["25%", "25%", "75%", "20%"],
              ["25%", "25%", "75%", "40%"],
              ["25%", "25%", "75%", "80%"],
              ["25%", "50%", "75%", "20%"],
              ["25%", "50%", "75%", "40%"],
              ["25%", "50%", "75%", "80%"],
              ["25%", "75%", "75%", "60%"],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="2" strokeDasharray="4" />
            ))}
          </g>

          {/* Projected Edges (Unipartite) */}
          <g className={`transition-opacity duration-700 ${step > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <line x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} stroke="var(--primary)" strokeWidth="8" className="transition-all duration-1000" />
            <line x1={pos2.x} y1={pos2.y} x2={pos3.x} y2={pos3.y} stroke="var(--primary)" strokeWidth="8" className={`transition-all duration-1000 ${monoculture ? 'opacity-100' : 'opacity-0'}`} />
            <line x1={pos1.x} y1={pos1.y} x2={pos3.x} y2={pos3.y} stroke="var(--primary)" strokeWidth="8" className={`transition-all duration-1000 ${monoculture ? 'opacity-100' : 'opacity-0'}`} />
          </g>

          {/* Left Nodes: Managers */}
          <circle cx={pos1.x} cy={pos1.y} r="24" fill="var(--primary-dark)" className="transition-all duration-1000 ease-in-out" />
          <text x={pos1.x} y={pos1.y} textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" className="transition-all duration-1000">Fund 1</text>

          <circle cx={pos2.x} cy={pos2.y} r="24" fill="var(--primary-dark)" className="transition-all duration-1000 ease-in-out" />
          <text x={pos2.x} y={pos2.y} textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" className="transition-all duration-1000">Fund 2</text>

          <circle cx={pos3.x} cy={pos3.y} r="24" fill={monoculture ? "var(--primary-dark)" : "var(--text-muted)"} className="transition-all duration-1000 ease-in-out" />
          <text x={pos3.x} y={pos3.y} textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" className="transition-all duration-1000">Fund 3</text>

          {/* Right Nodes: Behaviors */}
          <g className={`transition-opacity duration-500 ${step > 0 ? 'opacity-0' : 'opacity-100'}`}>
            {[
              { y: "20%", label: "Crash: Defensive", dashed: false },
              { y: "40%", label: "Bull: Aggressive", dashed: false },
              { y: "60%", label: "Stagnant: Yield", dashed: false },
              { y: "80%", label: "... Regime n", dashed: true },
            ].map(({ y, label, dashed }) => (
              <g key={label}>
                <rect
                  x="calc(75% - 55px)" y={`calc(${y} - 20px)`}
                  width="110" height="40" rx="8"
                  fill={dashed ? "transparent" : "var(--text-muted)"}
                  stroke={dashed ? "var(--text-muted)" : "none"}
                  strokeWidth={dashed ? "2" : "0"}
                  strokeDasharray={dashed ? "4" : "0"}
                />
                <text x="75%" y={y} textAnchor="middle" dy=".3em"
                  fill={dashed ? "var(--text-muted)" : "white"}
                  fontSize="10" fontWeight="bold"
                >
                  {label}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* Info Box: Scenario A */}
        {step === 1 && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className="backdrop-blur-sm p-4 rounded-xl shadow-lg"
              style={{
                background: "color-mix(in srgb, var(--surface) 95%, transparent)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-sm font-bold" style={{ color: "var(--text-strong)" }}>Scenario A: Partial Match</p>
              <p className="text-xs mt-1 max-w-[220px]" style={{ color: "var(--text-muted)" }}>
                Fund 1 and Fund 2 reacted identically <strong style={{ color: "var(--primary)" }}>across all <em>n</em> market regimes</strong>. The algorithm collapses them into a single heavy cluster. Fund 3 drifted differently and is isolated.
              </p>
            </div>
          </div>
        )}

        {/* Info Box: Scenario B */}
        {step === 2 && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className="backdrop-blur-sm p-4 rounded-xl shadow-lg"
              style={{
                background: "color-mix(in srgb, var(--surface) 95%, transparent)",
                border: "1px solid var(--primary)",
              }}
            >
              <p className="text-sm font-bold" style={{ color: "var(--primary-dark)" }}>Scenario B: The Monoculture</p>
              <p className="text-xs mt-1 max-w-[220px]" style={{ color: "var(--text-muted)" }}>
                If <em>all</em> funds collapse into a single structural clone, the sector is a <strong style={{ color: "var(--primary)" }}>monoculture</strong>. Further analysis is required (e.g., hidden liquidity constraints, sub-factor tilts) to find true diversification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
