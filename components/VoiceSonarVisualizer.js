'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Activity, Sparkles, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function VoiceSonarVisualizer({ 
  isRecording, 
  currentLang = 'en', 
  transcript = '', 
  onApplyTranscript,
  onStop 
}) {
  const [decibel, setDecibel] = useState(42);
  const [urgencyScore, setUrgencyScore] = useState(78);
  const [detectedDialect, setDetectedDialect] = useState('Detecting...');
  const [inferredCategory, setInferredCategory] = useState('Analyzing...');
  const animFrameRef = useRef(null);

  const LANG_NAMES = {
    en: 'English (General/BRICS)',
    hi: 'हिन्दी (Hindi - North/Central)',
    pt: 'Português (Brasil)',
    ru: 'Русский (Russian)',
    zh: '中文 (Mandarin / 普通话)',
    mr: 'मराठी (Marathi - Western India)'
  };

  useEffect(() => {
    setDetectedDialect(LANG_NAMES[currentLang] || 'BRICS Multilingual');
  }, [currentLang]);

  // Infer category and urgency from transcript in real time
  useEffect(() => {
    if (!transcript) {
      setInferredCategory('Awaiting speech input...');
      setUrgencyScore(50);
      return;
    }

    const lower = transcript.toLowerCase();
    let cat = 'Public Infrastructure';
    let urgency = 65;

    if (lower.match(/water|pani|água|вода|水|jal|leak|drain|sanitation/)) {
      cat = 'Drinking Water & Sanitation';
      urgency = 88;
    } else if (lower.match(/road|pothole|estrada|дорога|路|sadak|traffic|bridge/)) {
      cat = 'Roads & Urban Mobility';
      urgency = 82;
    } else if (lower.match(/hospital|clinic|doctor|saúde|больница|医院|swasthya|health/)) {
      cat = 'Public Health & Clinics';
      urgency = 92;
    } else if (lower.match(/school|education|escola|школа|学校|shala|college/)) {
      cat = 'Education & Child Centers';
      urgency = 74;
    } else if (lower.match(/light|solar|electric|luz|электричество|电|bijli|power/)) {
      cat = 'Clean Energy & Lighting';
      urgency = 79;
    }

    setInferredCategory(cat);
    setUrgencyScore(urgency);
  }, [transcript]);

  // Audio wave fluctuation simulation loop when active
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setDecibel(Math.floor(35 + Math.random() * 45));
    }, 120);

    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isRecording && !transcript) return null;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-3.5 border border-slate-700 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" />
            AI Voice Sonar & Acoustic Pipeline
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          {decibel} dB &bull; Web Audio
        </span>
      </div>

      {/* Real-time Frequency Waveform Bars */}
      <div className="flex items-center justify-center gap-1.5 h-10 px-2 bg-slate-950/70 rounded-lg border border-slate-800/80">
        {[40, 65, 85, 30, 95, 75, 45, 90, 60, 100, 70, 80, 50, 85, 40].map((h, idx) => {
          const dynamicHeight = isRecording 
            ? Math.max(15, Math.min(100, h + Math.sin((decibel + idx * 25) / 10) * 35))
            : 20;
          return (
            <div 
              key={idx} 
              className={`w-1.5 rounded-full transition-all duration-75 ${
                idx % 2 === 0 ? 'bg-gradient-to-t from-blue-500 to-indigo-400' : 'bg-gradient-to-t from-emerald-400 to-teal-300'
              }`}
              style={{ height: `${dynamicHeight}%` }}
            />
          );
        })}
      </div>

      {/* Live AI Speech Telemetry */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/70 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Dialect & NLP Node</span>
          <span className="font-bold text-slate-200 truncate block text-[11px]">
            {detectedDialect}
          </span>
        </div>
        <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/70 space-y-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Inferred Priority Category</span>
          <span className="font-bold text-emerald-400 truncate block text-[11px]">
            {inferredCategory}
          </span>
        </div>
      </div>

      {/* Live transcript text bubble */}
      {transcript && (
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Transcribed Text Stream
          </span>
          <p className="text-slate-200 italic font-medium leading-relaxed max-h-20 overflow-y-auto">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Bottom controls */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Urgency Sonar: <strong className="text-white font-mono">{urgencyScore}%</strong>
        </span>
        <div className="flex items-center gap-2">
          {isRecording && onStop && (
            <button
              type="button"
              onClick={onStop}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-1 rounded-md transition shadow-xs cursor-pointer"
            >
              Finish Audio
            </button>
          )}
          {transcript && onApplyTranscript && (
            <button
              type="button"
              onClick={() => onApplyTranscript(transcript)}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="h-3 w-3" />
              Apply to Form
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
