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
    <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-sm space-y-2.5 animate-in fade-in duration-150">
      
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span className="text-xs font-semibold text-rose-300">
            Recording voice note...
          </span>
        </div>
        <button
          type="button"
          onClick={onStop}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
        >
          <Square className="h-3 w-3 fill-white" />
          <span>Finish</span>
        </button>
      </div>

      {/* Waveform */}
      <div className="flex items-center justify-center gap-1.5 h-8 px-2 bg-slate-950/70 rounded-lg">
        {[40, 65, 85, 30, 95, 75, 45, 90, 60, 100, 70, 80, 50, 85, 40].map((h, idx) => {
          const dynamicHeight = Math.max(20, Math.min(100, h + Math.sin((decibel + idx * 25) / 10) * 35));
          return (
            <div 
              key={idx} 
              className="w-1 rounded-full transition-all duration-75 bg-blue-400"
              style={{ height: `${dynamicHeight}%` }}
            />
          );
        })}
      </div>

      {/* Live transcript text bubble */}
      {transcript && (
        <p className="text-xs text-slate-300 italic line-clamp-2 px-1">
          "{transcript}"
        </p>
      )}

    </div>
  );
}
