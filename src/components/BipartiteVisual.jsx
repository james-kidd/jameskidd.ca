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

  const clusterColor = step === 2 ? "#7e22ce" : "#1e40af";
  const edgeColor = step === 2 ? "#9333ea" : "#2563eb";
  const isolatedColor = "#b91c1c";
  const btnColor = step === 2 ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700";

  return (
    <div className="my-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800 font-sans">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            {getTitle()}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {getSubtitle()}
          </p>
        </div>
        <button
          onClick={() => setStep((prev) => (prev + 1) % 3)}
          className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors ${btnColor}`}
        >
          {getButtonText()}
        </button>
      </div>

      <div className="relative w-full h-80 bg-gray-50 dark:bg-gray-950 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
        <svg className="absolute inset-0 w-full h-full">
          {/* Bipartite Edges */}
          <g className={`transition-opacity duration-700 ${step > 0 ? 'opacity-0' : 'opacity-100'}`}>
            <line x1="25%" y1="25%" x2="75%" y2="20%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="25%" x2="75%" y2="40%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="25%" x2="75%" y2="80%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="50%" x2="75%" y2="20%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="50%" x2="75%" y2="40%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="50%" x2="75%" y2="80%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="75%" x2="75%" y2="60%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
          </g>

          {/* Projected Edges (Unipartite) */}
          <g className={`transition-opacity duration-700 ${step > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <line x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} stroke={edgeColor} strokeWidth="8" className="transition-all duration-1000" />
            <line x1={pos2.x} y1={pos2.y} x2={pos3.x} y2={pos3.y} stroke={edgeColor} strokeWidth="8" className={`transition-all duration-1000 ${step === 2 ? 'opacity-100' : 'opacity-0'}`} />
            <line x1={pos1.x} y1={pos1.y} x2={pos3.x} y2={pos3.y} stroke={edgeColor} strokeWidth="8" className={`transition-all duration-1000 ${step === 2 ? 'opacity-100' : 'opacity-0'}`} />
          </g>

          {/* Left Nodes: Managers */}
          <circle cx={pos1.x} cy={pos1.y} r="24" fill={clusterColor} className="transition-all duration-1000 ease-in-out" />
          <text x={pos1.x} y={pos1.y} textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" className="transition-all duration-1000">Fund 1</text>

          <circle cx={pos2.x} cy={pos2.y} r="24" fill={clusterColor} className="transition-all duration-1000 ease-in-out" />
          <text x={pos2.x} y={pos2.y} textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" className="transition-all duration-1000">Fund 2</text>

          <circle cx={pos3.x} cy={pos3.y} r="24" fill={step === 2 ? clusterColor : isolatedColor} className="transition-all duration-1000 ease-in-out" />
          <text x={pos3.x} y={pos3.y} textAnchor="middle" dy=".3em" fill="white" fontSize="12" fontWeight="bold" className="transition-all duration-1000">Fund 3</text>

          {/* Right Nodes: Behaviors */}
          <g className={`transition-opacity duration-500 ${step > 0 ? 'opacity-0' : 'opacity-100'}`}>
            <rect x="calc(75% - 55px)" y="calc(20% - 20px)" width="110" height="40" rx="8" fill="#4b5563" />
            <text x="75%" y="20%" textAnchor="middle" dy=".3em" fill="white" fontSize="10" fontWeight="bold">Crash: Defensive</text>

            <rect x="calc(75% - 55px)" y="calc(40% - 20px)" width="110" height="40" rx="8" fill="#4b5563" />
            <text x="75%" y="40%" textAnchor="middle" dy=".3em" fill="white" fontSize="10" fontWeight="bold">Bull: Aggressive</text>

            <rect x="calc(75% - 55px)" y="calc(60% - 20px)" width="110" height="40" rx="8" fill="#4b5563" />
            <text x="75%" y="60%" textAnchor="middle" dy=".3em" fill="white" fontSize="10" fontWeight="bold">Stagnant: Yield</text>

            <rect x="calc(75% - 55px)" y="calc(80% - 20px)" width="110" height="40" rx="8" fill="transparent" stroke="#6b7280" strokeWidth="2" strokeDasharray="4" />
            <text x="75%" y="80%" textAnchor="middle" dy=".3em" fill="#6b7280" fontSize="10" fontWeight="bold">... Regime n</text>
          </g>
        </svg>

        {/* Info Box: Scenario A */}
        {step === 1 && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none animate-fade-in">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Scenario A: Partial Match</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[220px]">
                Fund 1 and Fund 2 reacted identically <strong className="text-blue-600 dark:text-blue-400">across all <em>n</em> market regimes</strong>. The math collapses them into a single heavy cluster. Fund 3 drifted differently and is isolated.
              </p>
            </div>
          </div>
        )}

        {/* Info Box: Scenario B */}
        {step === 2 && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none animate-fade-in">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-bold text-purple-700 dark:text-purple-400">Scenario B: The Monoculture</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 max-w-[220px]">
                If <em>all</em> funds collapse into a single structural clone, the sector is a <strong className="text-purple-600 dark:text-purple-400">monoculture</strong>. We must execute <strong>further analysis</strong> (e.g., hidden liquidity constraints, sub-factor tilts) to find true diversification.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
