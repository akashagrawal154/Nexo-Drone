import React, { useState } from 'react';
import { Zap, Droplets, RefreshCw, Key, ShieldCheck, Radio } from 'lucide-react';

interface TelemetrySimulatorPanelProps {
  onSimulateSurge: (level: number) => void;
  onResetSensors: () => void;
  isLightTheme?: boolean;
}

export const TelemetrySimulatorPanel: React.FC<TelemetrySimulatorPanelProps> = ({
  onSimulateSurge,
  onResetSensors,
  isLightTheme = false
}) => {
  const [customVal, setCustomVal] = useState<number>(86.5);

  return (
    <div
      className={`ios-glass ios-card p-3.5 flex flex-wrap items-center justify-between gap-3 font-sans transition-all duration-300 ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Left: Simulation Label */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 active:scale-95 transition-transform">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <span className={`font-extrabold text-xs tracking-tight ${isLightTheme ? 'text-slate-900' : 'text-slate-100'}`}>
            TELEMETRY SIMULATOR & HARNESS
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Inject mock sensor telemetry to test automated threshold breach alerts over WebSockets
          </p>
        </div>
      </div>

      {/* Center: Ingest Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            isLightTheme ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}
        >
          <span className="text-[11px] text-slate-500 font-medium">WATER LEVEL:</span>
          <input
            type="number"
            min="10"
            max="100"
            value={customVal}
            onChange={(e) => setCustomVal(parseFloat(e.target.value) || 50)}
            className={`w-12 font-extrabold text-xs text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isLightTheme
                ? 'bg-white text-blue-600 border-slate-200'
                : 'bg-slate-900 text-blue-400 border-slate-700'
            }`}
          />
          <span className="text-slate-400 text-[11px] font-medium">%</span>
        </div>

        <button
          onClick={() => onSimulateSurge(customVal)}
          className="ios-button px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-500 to-rose-600 hover:brightness-110 text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-500/20 active:scale-95 transition"
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>INGEST SURGE ({customVal}%)</span>
        </button>

        <button
          onClick={onResetSensors}
          className={`ios-button px-4 py-1.5 text-xs font-semibold border flex items-center gap-1.5 cursor-pointer active:scale-95 transition ${
            isLightTheme
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-500" />
          <span>NORMALIZE (45%)</span>
        </button>
      </div>

      {/* Right: Security Key status */}
      <div
        className={`hidden lg:flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border ${
          isLightTheme
            ? 'bg-slate-100/90 border-slate-200 text-slate-600'
            : 'bg-slate-950/80 border-slate-800 text-slate-400'
        }`}
      >
        <Key className="w-3 h-3 text-blue-500" />
        <span>
          X-API-KEY:{' '}
          <strong className={isLightTheme ? 'text-slate-900' : 'text-slate-200'}>
            omni_live_key_9823417a8c
          </strong>
        </span>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 ml-1" />
      </div>
    </div>
  );
};
