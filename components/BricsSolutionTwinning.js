'use client';

import React, { useState } from 'react';
import { Sparkles, Globe2, ArrowRight, CheckCircle2, TrendingDown, Leaf, Users, ChevronDown, ChevronUp } from 'lucide-react';

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

export default function BricsSolutionTwinning({ currentCategory = 'roads', onAdoptBlueprint, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
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
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 transition">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/70 transition cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-base shrink-0">💡</span>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Inspiration: {twin.blueprintTitle}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Proven in {twin.twinnedCity}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 shrink-0 ml-2">
          <span className="text-xs font-semibold hidden sm:inline">{isOpen ? 'Hide' : 'View'}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-200 bg-white animate-in fade-in duration-150">
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {twin.summary}
          </p>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700">
            <strong>Key Benefit:</strong> {twin.coBenefit}
          </div>

          <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
            <span className="text-[11px] text-emerald-700 font-semibold">{twin.capexSavings}</span>
            <button
              type="button"
              onClick={handleAdopt}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                adopted 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {adopted ? '✓ Added to Suggestion' : 'Reference this Idea'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
