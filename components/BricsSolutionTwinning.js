'use client';

import React, { useState } from 'react';
import { Sparkles, Globe2, ArrowRight, CheckCircle2, TrendingDown, Leaf, Users, Award } from 'lucide-react';

const TWINNING_DATABASE = {
  water: {
    category: 'Drinking Water & Sanitation',
    twinnedCity: 'Fortaleza, Brazil 🇧🇷 & Durban, South Africa 🇿🇦',
    blueprintTitle: 'Decentralized Solar Reverse-Osmosis & Rainwater Harvesting Swales',
    capexSavings: '34% Lower CAPEX',
    coBenefit: '4.8M Liters conserved annually & zero diesel pump emissions',
    sdgs: ['SDG 6: Clean Water', 'SDG 11: Sustainable Cities', 'SDG 13: Climate Action'],
    summary: 'By pairing decentralized solar water ATMs (tested in Fortaleza) with community stormwater recharge wells (developed in Durban), local water scarcity is mitigated at a fraction of central pipeline costs.'
  },
  roads: {
    category: 'Roads & Urban Mobility',
    twinnedCity: 'Curitiba, Brazil 🇧🇷 & Indore, India 🇮🇳',
    blueprintTitle: 'Bio-CNG Bus Rapid Transit (BRT) & Priority Feeder Corridors',
    capexSavings: '42% Lower Operating Cost',
    coBenefit: '38 min average daily commute reduction & 12,000 tons CO2 abated',
    sdgs: ['SDG 9: Resilient Infrastructure', 'SDG 11: Sustainable Transport', 'SDG 13: Climate Action'],
    summary: 'Adapting Curitiba\'s world-renowned dedicated bus transit grid with Indore\'s organic municipal waste-to-BioCNG fuel generation ensures carbon-neutral, low-cost commuter transit.'
  },
  health: {
    category: 'Public Health & Clinics',
    twinnedCity: 'Kazan, Russia 🇷🇺 & Belo Horizonte, Brazil 🇧🇷',
    blueprintTitle: 'Modular Community Telemedicine Cubes & Unified Digital Health Grid',
    capexSavings: '28% Faster Deployment',
    coBenefit: 'Zero-wait triage for 45,000 low-income households',
    sdgs: ['SDG 3: Good Health', 'SDG 10: Reduced Inequalities', 'SDG 11: Community Care'],
    summary: 'Deploying modular prefabricated clinics with integrated broadband telemedicine links mirrors Kazan’s digital health network, ensuring primary medical access in high-density informal settlements.'
  },
  sanitation: {
    category: 'Waste & Drainage',
    twinnedCity: 'Chengdu, China 🇨🇳 & Johannesburg, South Africa 🇿🇦',
    blueprintTitle: 'Sponge City Permeable Subsurface Drainage & Automated Segregation',
    capexSavings: '39% Flood Damage Reduction',
    coBenefit: 'Zero street waterlogging during extreme monsoons & 85% waste diversion',
    sdgs: ['SDG 6: Water & Sanitation', 'SDG 11: Resilient Communities', 'SDG 12: Circular Economy'],
    summary: 'Chengdu\'s permeable bio-pavement and wetland retention basins combined with community recycling hubs prevent urban flash flooding while generating local circular jobs.'
  },
  education: {
    category: 'Education & Child Centers',
    twinnedCity: 'St. Petersburg, Russia 🇷🇺 & Bangalore, India 🇮🇳',
    blueprintTitle: 'Solarized Digital STEM Centers & Community Skill Hubs',
    capexSavings: '25% Energy Self-Sufficiency',
    coBenefit: 'Access for 8,500 students to high-speed public learning cloud',
    sdgs: ['SDG 4: Quality Education', 'SDG 7: Clean Energy', 'SDG 9: Digital Innovation'],
    summary: 'Solar-powered community learning centers equipped with open-source digital curricula deliver vocational robotics and digital literacy with zero dependence on unreliable grid power.'
  },
  skill: {
    category: 'Skill Training & Jobs',
    twinnedCity: 'Shenzhen, China 🇨🇳 & Johannesburg, South Africa 🇿🇦',
    blueprintTitle: 'Public Maker-Spaces & Solar Vocational Micro-Enterprises',
    capexSavings: '31% Higher Job Placement',
    coBenefit: '1,200 youth certified yearly in green energy maintenance',
    sdgs: ['SDG 8: Decent Work', 'SDG 9: Industry Innovation', 'SDG 10: Reduced Inequalities'],
    summary: 'Replicating Shenzhen\'s open hardware incubator model with localized micro-financing trains local youth to maintain municipal solar grids and electric mobility fleets.'
  }
};

export default function BricsSolutionTwinning({ currentCategory = 'roads', onAdoptBlueprint }) {
  const [adopted, setAdopted] = useState(false);

  // Normalize key
  const catKey = Object.keys(TWINNING_DATABASE).find(k => 
    currentCategory.toLowerCase().includes(k)
  ) || 'roads';

  const twin = TWINNING_DATABASE[catKey];

  const handleAdopt = () => {
    setAdopted(true);
    if (onAdoptBlueprint) {
      onAdoptBlueprint(twin);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 sm:p-5 border border-blue-800 shadow-md space-y-3.5">
      
      {/* Header with BRICS Flags */}
      <div className="flex items-center justify-between border-b border-blue-800/80 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
            <Globe2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                BRICS Solution Twinning Engine
              </span>
              <span className="text-xs">🇧🇷 🇷🇺 🇮🇳 🇨🇳 🇿🇦</span>
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-white">Cross-Border Civic Digital Twin</h3>
          </div>
        </div>
        
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <TrendingDown className="h-3 w-3" />
          {twin.capexSavings}
        </span>
      </div>

      {/* Blueprint Title and Twinned Cities */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
          Twinned Partner Cities: <strong className="text-slate-200">{twin.twinnedCity}</strong>
        </span>
        <h4 className="text-sm sm:text-base font-extrabold text-blue-200 leading-snug">
          {twin.blueprintTitle}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-medium pt-1">
          {twin.summary}
        </p>
      </div>

      {/* Impact Metrics & SDG Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex items-center gap-2">
          <Leaf className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-slate-200 font-medium">
            <strong>Co-Benefit:</strong> {twin.coBenefit}
          </span>
        </div>
        <div className="bg-white/5 border border-white/10 p-2.5 rounded-lg flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400 shrink-0" />
          <span className="text-[11px] text-slate-200 font-medium">
            <strong>Scalability:</strong> Sovereign DPGA Certified
          </span>
        </div>
      </div>

      {/* UN SDG Pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        {twin.sdgs.map((sdg, i) => (
          <span key={i} className="bg-blue-500/20 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-400/20">
            {sdg}
          </span>
        ))}
      </div>

      {/* Bottom Action */}
      <div className="pt-2 border-t border-blue-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400 font-medium">
          Evidence-based multilateral best practice transfer
        </span>
        <button
          type="button"
          onClick={handleAdopt}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer ${
            adopted 
              ? 'bg-emerald-600 text-white' 
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
          }`}
        >
          {adopted ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Blueprint Adopted
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Adopt Twinning Model
            </>
          )}
        </button>
      </div>

    </div>
  );
}
