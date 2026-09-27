'use client';

import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  HeartHandshake, 
  Activity, 
  Vote, 
  BarChart3,
  Sliders
} from 'lucide-react';

const DEFAULT_ALLOCATION = {
  health: 25,
  water: 25,
  roads: 20,
  education: 20,
  energy: 10
};

// Benchmark city consensus across BRICS pilots
const CITY_CONSENSUS = {
  health: 22,
  water: 28,
  roads: 22,
  education: 18,
  energy: 10
};

const PILLAR_CONFIG = [
  { key: 'water', label: '💧 Drinking Water & Sanitation', desc: 'Piped water, sewage treatment & flood drainage', color: 'bg-blue-600' },
  { key: 'health', label: '🏥 Public Health & Clinics', desc: 'Primary health centers & diagnostic dispensaries', color: 'bg-rose-600' },
  { key: 'roads', label: '🛣️ Roads & Transit', desc: 'Pothole repair, pedestrian walkways & bus transit', color: 'bg-amber-600' },
  { key: 'education', label: '🏫 Schools & Child Centers', desc: 'Public school modernization & digital classrooms', color: 'bg-emerald-600' },
  { key: 'energy', label: '⚡ Clean Energy & Lighting', desc: 'Solar streetlights, micro-grids & green spaces', color: 'bg-indigo-600' }
];

export default function CitizenBudgetSandbox({ countryCode = 'IND', onVoteSubmitted }) {
  const [allocation, setAllocation] = useState(DEFAULT_ALLOCATION);
  const [voted, setVoted] = useState(false);

  const totalAllocated = Object.values(allocation).reduce((a, b) => a + b, 0);

  const handleSliderChange = (key, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
    setAllocation(prev => ({
      ...prev,
      [key]: num
    }));
  };

  // Calculate alignment with city consensus
  const alignmentDelta = Object.keys(allocation).reduce((acc, k) => {
    return acc + Math.abs(allocation[k] - CITY_CONSENSUS[k]);
  }, 0);
  const harmonyIndex = Math.max(0, Math.min(100, Math.round(100 - (alignmentDelta * 0.75))));

  const handleVote = () => {
    setVoted(true);
    if (onVoteSubmitted) {
      onVoteSubmitted(allocation);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4">
      
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              Civic Budget Sandbox
            </span>
            <span className="text-xs font-bold text-slate-500">Participatory Democracy Mode</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-blue-900 mt-0.5 flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-[#f97316]" />
            What If You Were The Municipal Planner?
          </h3>
        </div>

        {/* Harmony Index */}
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-right">
          <span className="text-[10px] font-bold uppercase text-slate-500 block">Civic Alignment</span>
          <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
            {harmonyIndex}% Harmonized
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-medium">
        Allocate your community’s capital budget across key civic priorities. Your allocation directly informs the multi-criteria optimization weights used by municipal engineers.
      </p>

      {/* Multi-Pillar Slider Grid */}
      <div className="space-y-3">
        {PILLAR_CONFIG.map(pillar => {
          const val = allocation[pillar.key];
          const cityVal = CITY_CONSENSUS[pillar.key];

          return (
            <div key={pillar.key} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{pillar.label}</span>
                  <span className="text-[11px] text-slate-500 block">{pillar.desc}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-blue-950 font-mono bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {val}%
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">City avg: {cityVal}%</span>
                </div>
              </div>

              {/* Slider */}
              <input 
                type="range"
                min="0"
                max="60"
                value={val}
                onChange={(e) => handleSliderChange(pillar.key, e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-900"
              />
            </div>
          );
        })}
      </div>

      {/* Total Budget Meter */}
      <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">Total Budget Allocation:</span>
        <span className={`font-mono font-black text-xs sm:text-sm ${
          totalAllocated === 100 ? 'text-emerald-700' : 'text-amber-700'
        }`}>
          {totalAllocated}% {totalAllocated === 100 ? '✓ (100% Balanced)' : `(${100 - totalAllocated > 0 ? `+${100 - totalAllocated}% Left` : `${totalAllocated - 100}% Exceeded`})`}
        </span>
      </div>

      {/* Submit Allocation Vote */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleVote}
          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer ${
            voted 
              ? 'bg-emerald-700 text-white' 
              : 'bg-blue-900 hover:bg-blue-800 text-white'
          }`}
        >
          {voted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Civic Budget Vote Registered on DPG Ledger!
            </>
          ) : (
            <>
              <Vote className="h-4 w-4" />
              Cast Participatory Budget Vote ({harmonyIndex}% Match)
            </>
          )}
        </button>
      </div>

    </div>
  );
}
