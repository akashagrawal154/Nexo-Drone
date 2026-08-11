import React, { useState } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  Droplets,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';
import { playClick } from '../lib/soundEffects';

interface HistoricalTimeMachineProps {
  isLightTheme?: boolean;
}

export const HistoricalTimeMachine: React.FC<HistoricalTimeMachineProps> = ({ isLightTheme = false }) => {
  const [timeStepIndex, setTimeStepIndex] = useState<number>(2); // Default to NOW (Index 2)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const timelineSteps = [
    {
      timeLabel: '-6 HOURS',
      subLabel: 'Pre-Storm Baseline',
      waterLevel: 42.0,
      discharge: 120,
      inundationKm2: 0.1,
      affectedHouseholds: 0,
      status: 'STABLE',
      color: 'emerald'
    },
    {
      timeLabel: '-3 HOURS',
      subLabel: 'Heavy Downpour Inception',
      waterLevel: 64.5,
      discharge: 280,
      inundationKm2: 0.8,
      affectedHouseholds: 120,
      status: 'WARNING',
      color: 'amber'
    },
    {
      timeLabel: 'NOW (LIVE)',
      subLabel: 'Hydrological Threshold Breach',
      waterLevel: 86.5,
      discharge: 420,
      inundationKm2: 3.4,
      affectedHouseholds: 1450,
      status: 'CRITICAL SURGE',
      color: 'red'
    },
    {
      timeLabel: '+3 HOURS',
      subLabel: 'Peak Discharge Forecast',
      waterLevel: 92.0,
      discharge: 540,
      inundationKm2: 5.2,
      affectedHouseholds: 3200,
      status: 'PEAK SPILLWAY FLOOD',
      color: 'red'
    },
    {
      timeLabel: '+6 HOURS',
      subLabel: 'Upstream Gate Release',
      waterLevel: 78.0,
      discharge: 390,
      inundationKm2: 4.1,
      affectedHouseholds: 2800,
      status: 'SUBSIDING',
      color: 'amber'
    },
    {
      timeLabel: '+12 HOURS',
      subLabel: 'System Recovery & Drainage',
      waterLevel: 51.0,
      discharge: 180,
      inundationKm2: 1.2,
      affectedHouseholds: 400,
      status: 'NORMALIZING',
      color: 'emerald'
    }
  ];

  const currentStep = timelineSteps[timeStepIndex];

  return (
    <div
      className={`ios-glass ios-card p-4 space-y-3.5 shadow-xl transition-all duration-300 font-sans text-xs ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500">
            <Clock className="w-4 h-4 animate-spin-slow" />
          </div>
          <h2 className="text-xs font-extrabold tracking-tight">
            PREDICTIVE FLOOD TIMELINE & HISTORICAL REPLAY
          </h2>
        </div>
        <span className="px-3 py-0.5 text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
          12-HOUR AI HYDROLOGICAL PREDICTION
        </span>
      </div>

      {/* Scrubbing Slider Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-bold">SCRUB TIMELINE:</span>
          <span className="font-bold text-cyan-500">{currentStep.timeLabel} • {currentStep.subLabel}</span>
        </div>

        <input
          type="range"
          min="0"
          max={timelineSteps.length - 1}
          value={timeStepIndex}
          onChange={(e) => {
            playClick();
            setTimeStepIndex(parseInt(e.target.value));
          }}
          className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />

        {/* Step Ticks */}
        <div className="grid grid-cols-6 gap-1 text-[10px] text-center text-slate-400">
          {timelineSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setTimeStepIndex(idx)}
              className={`p-1 rounded transition cursor-pointer ${
                timeStepIndex === idx ? 'font-bold text-cyan-500 underline' : 'hover:text-slate-200'
              }`}
            >
              {step.timeLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step Key Analytics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div
          className={`p-2.5 rounded-xl border ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="text-[10px] text-slate-500">WATER CAPACITY</div>
          <div className="text-base font-bold text-cyan-500 mt-0.5">{currentStep.waterLevel}%</div>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="text-[10px] text-slate-500">DISCHARGE RATE</div>
          <div className="text-base font-bold text-amber-500 mt-0.5">{currentStep.discharge} m³/s</div>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="text-[10px] text-slate-500">INUNDATION AREA</div>
          <div className="text-base font-bold text-red-500 mt-0.5">{currentStep.inundationKm2} km²</div>
        </div>

        <div
          className={`p-2.5 rounded-xl border ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="text-[10px] text-slate-500">RISK STATUS</div>
          <div className="text-xs font-bold text-emerald-500 mt-1 uppercase">{currentStep.status}</div>
        </div>
      </div>
    </div>
  );
};
