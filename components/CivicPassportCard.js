'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Award, 
  Lock, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function CivicPassportCard({
  submissionId = 'SUB-BRICS-2026-001',
  userName = 'Citizen Contributor',
  countryCode = 'IND',
  category = 'Roads & Urban Mobility',
  wardName = 'Ward 14 - Koregaon Park',
  timestamp = new Date().toISOString(),
  sha256Hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
}) {
  const [copied, setCopied] = useState(false);
  const [showJsonLd, setShowJsonLd] = useState(false);

  const COUNTRY_META = {
    IND: { flag: '🇮🇳', name: 'Republic of India', scheme: 'India Stack / DPG Node', gradient: 'from-amber-600 via-orange-500 to-emerald-700' },
    BRA: { flag: '🇧🇷', name: 'República Federativa do Brasil', scheme: 'Gov.br / DPG Node', gradient: 'from-emerald-700 via-yellow-600 to-blue-700' },
    RUS: { flag: '🇷🇺', name: 'Российская Федерация', scheme: 'Gosuslugi / DPG Node', gradient: 'from-blue-700 via-white to-red-600' },
    CHN: { flag: '🇨🇳', name: 'People\'s Republic of China', scheme: 'DPI National Portal / DPG Node', gradient: 'from-red-700 via-amber-600 to-red-800' },
    ZAF: { flag: '🇿🇦', name: 'Republic of South Africa', scheme: 'GovZA / DPG Node', gradient: 'from-emerald-700 via-amber-600 to-blue-800' }
  };

  const meta = COUNTRY_META[countryCode] || COUNTRY_META.IND;

  const credentialJson = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://w3id.org/security/suites/jws-2020/v1"
    ],
    "id": `urn:uuid:${submissionId}`,
    "type": ["VerifiableCredential", "CivicParticipationCredential"],
    "issuer": "did:dpg:civis-brics:sovereign-node",
    "issuanceDate": timestamp,
    "credentialSubject": {
      "id": `did:pkh:brics:${submissionId}`,
      "citizenAlias": userName,
      "jurisdiction": meta.name,
      "sector": wardName,
      "focusCategory": category,
      "contributionTier": "Verified Community Planner"
    },
    "proof": {
      "type": "JsonWebSignature2020",
      "created": timestamp,
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:dpg:civis-brics:sovereign-node#key-1",
      "jws": `eyJhbGciOiJIUzI1NiJ9...${sha256Hash.substring(0, 16)}`
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(credentialJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Visual Identity Pass */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl border border-slate-700 p-4 sm:p-5 select-none transition-all duration-300 hover:shadow-2xl">
        
        {/* Holographic Watermark Pattern */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header Stripe */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.flag}</span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-black block">
                CIVIS-BRICS Sovereign Pass
              </span>
              <h3 className="text-xs font-bold text-slate-200">W3C Verifiable Civic Credential</h3>
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Verified
          </span>
        </div>

        {/* Card Body */}
        <div className="py-3.5 flex items-center justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Civic Partner</span>
              <p className="text-sm sm:text-base font-extrabold text-white truncate">{userName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Category</span>
                <span className="font-semibold text-slate-200 text-[11px] truncate block">{category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Territory</span>
                <span className="font-semibold text-slate-200 text-[11px] truncate block">{wardName}</span>
              </div>
            </div>
          </div>

          {/* Dynamic SVG QR Code */}
          <div className="bg-white p-2 rounded-xl shrink-0 shadow-md flex flex-col items-center">
            <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="white" />
              {/* Corner position markers */}
              <rect x="8" y="8" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="14" y="14" width="16" height="16" fill="white" />
              <rect x="18" y="18" width="8" height="8" fill="#0f172a" />

              <rect x="64" y="8" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="70" y="14" width="16" height="16" fill="white" />
              <rect x="74" y="18" width="8" height="8" fill="#0f172a" />

              <rect x="8" y="64" width="28" height="28" rx="4" fill="#0f172a" />
              <rect x="14" y="70" width="16" height="16" fill="white" />
              <rect x="18" y="74" width="8" height="8" fill="#0f172a" />

              {/* Data matrix pattern */}
              <rect x="42" y="14" width="6" height="6" fill="#0f172a" />
              <rect x="52" y="22" width="6" height="6" fill="#0f172a" />
              <rect x="42" y="42" width="16" height="16" rx="2" fill="#2563eb" />
              <rect x="22" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="72" y="44" width="6" height="6" fill="#0f172a" />
              <rect x="44" y="72" width="8" height="8" fill="#0f172a" />
              <rect x="68" y="68" width="6" height="6" fill="#0f172a" />
              <rect x="80" y="80" width="8" height="8" fill="#0f172a" />
            </svg>
            <span className="text-[9px] font-mono text-slate-800 font-bold mt-1">SCAN PROOF</span>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-[11px] font-mono">
          <div className="text-slate-400 truncate max-w-[200px]">
            <span className="text-[9px] uppercase tracking-wider block text-slate-500 font-bold">Credential Ref</span>
            <span className="text-slate-300 font-bold">{submissionId}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase tracking-wider block text-slate-500 font-bold">DPI Standard</span>
            <span className="text-emerald-400 font-bold">UN DPG 9/9</span>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-blue-900" />
          Print / Save Pass
        </button>

        <button
          type="button"
          onClick={() => setShowJsonLd(!showJsonLd)}
          className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
        >
          <Lock className="h-3.5 w-3.5 text-emerald-700" />
          JSON-LD Proof
          {showJsonLd ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Collapsible W3C JSON-LD Proof */}
      {showJsonLd && (
        <div className="bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
            <span>W3C Verifiable Credential 2.0 Payload</span>
            <button
              onClick={handleCopyJson}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans font-bold cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
          <pre className="text-[10px] leading-relaxed text-emerald-400 max-h-48 overflow-y-auto whitespace-pre-wrap select-all">
            {JSON.stringify(credentialJson, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}
