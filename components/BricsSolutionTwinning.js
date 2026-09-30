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
    <div className="bg-blue-50/70 border border-blue-200 rounded-xl overflow-hidden transition shadow-xs">
      {/* Clickable Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-blue-100/50 transition cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Globe2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-blue-950">
                💡 Global Best Practice Idea
              </span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-semibold">
                {twin.capexSavings}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate max-w-[280px] sm:max-w-md">
              {twin.twinnedCity}: {twin.blueprintTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-blue-700 shrink-0">
          <span className="text-[11px] font-bold hidden sm:inline">
            {isOpen ? 'Hide' : 'Explore'}
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded Blueprint Details */}
      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-blue-200/80 bg-white/60 animate-in fade-in duration-200">
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {twin.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-2">
              <Leaf className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="text-emerald-950 font-medium">
                <strong>Impact:</strong> {twin.coBenefit}
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="text-blue-950 font-medium">
                <strong>Source:</strong> {twin.twinnedCity}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              {twin.sdgs.map((sdg, i) => (
                <span key={i} className="bg-blue-100/80 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                  {sdg}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAdopt}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer ${
                adopted 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-blue-900 hover:bg-blue-800 text-white'
              }`}
            >
              {adopted ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Included in Suggestion
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Adopt This Solution
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
