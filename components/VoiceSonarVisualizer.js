'use client';

import React, { useEffect, useState } from 'react';
import { Mic, Activity, Sparkles, ShieldCheck, CheckCircle2, Square } from 'lucide-react';

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

  const LANG_NAMES = {
    en: 'English (General)',
    hi: 'हिन्दी (Hindi)',
    pt: 'Português (Brasil)',
    ru: 'Русский (Russian)',
    zh: '中文 (Mandarin)',
    mr: 'मराठी (Marathi)'
  };

  useEffect(() => {
    setDetectedDialect(LANG_NAMES[currentLang] || 'Multilingual');
  }, [currentLang]);

  useEffect(() => {
    if (!transcript) {
      setInferredCategory('Listening to speech...');
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
      setDecibel(Math.floor(38 + Math.random() * 40));
    }, 120);
    return () => clearInterval(interval);
  }, [isRecording]);

  // CRITICAL: Only render when user is actively recording audio!
  if (!isRecording) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-3.5 border border-blue-700 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-blue-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            Listening to your voice... ({detectedDialect})
          </span>
        </div>
        <span className="text-[11px] font-mono text-blue-200 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
          {decibel} dB
        </span>
      </div>

      {/* Real-time Frequency Waveform Bars */}
      <div className="flex items-center justify-center gap-1.5 h-9 px-2 bg-blue-950/50 rounded-lg border border-blue-800/60">
        {[40, 65, 85, 30, 95, 75, 45, 90, 60, 100, 70, 80, 50, 85, 40].map((h, idx) => {
          const dynamicHeight = Math.max(20, Math.min(100, h + Math.sin((decibel + idx * 25) / 10) * 35));
          return (
            <div 
              key={idx} 
              className={`w-1.5 rounded-full transition-all duration-75 ${
                idx % 2 === 0 ? 'bg-blue-400' : 'bg-emerald-400'
              }`}
              style={{ height: `${dynamicHeight}%` }}
            />
          );
        })}
      </div>

      {/* Live transcript text bubble */}
      {transcript && (
        <div className="bg-blue-950/70 p-2.5 rounded-lg border border-blue-800/80 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-blue-300 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-300" />
            Transcribed:
          </span>
          <p className="text-slate-100 italic font-medium leading-relaxed max-h-16 overflow-y-auto">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <span className="text-[11px] text-blue-200 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          Detected: <strong className="text-white">{inferredCategory}</strong>
        </span>
        <button
          type="button"
          onClick={onStop}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Square className="h-3 w-3 fill-white" />
          Stop & Keep Text
        </button>
      </div>

    </div>
  );
}
