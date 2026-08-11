import React from 'react';
import { ShieldAlert, Activity, AlertTriangle, Radio, Users, Building, Droplets, Zap, ShieldCheck } from 'lucide-react';
import { CityRiskIndex } from '../types';

interface CityRiskIndexStripProps {
  riskIndex: CityRiskIndex;
  activeIncidentsCount: number;
  sensorsOnlineCount: number;
  assetsActiveCount: number;
  isLightTheme?: boolean;
}

export const CityRiskIndexStrip: React.FC<CityRiskIndexStripProps> = ({
  riskIndex,
  activeIncidentsCount,
  sensorsOnlineCount,
  assetsActiveCount,
  isLightTheme = false
}) => {
  const getBadgeColor = (level: CityRiskIndex['level']) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div
      className={`ios-glass ios-card p-3.5 flex flex-wrap items-center justify-between gap-3 font-sans transition-all duration-300 ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Left: Overall Risk Score Badge */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-transform">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">NEXO CITY RISK INDEX</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeColor(riskIndex.level)}`}>
                {riskIndex.level}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{riskIndex.overallScore}</span>
              <span className="text-[11px] text-slate-500 font-medium">/ 100 THREAT LEVEL</span>
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="hidden sm:block h-8 w-px bg-slate-200/80 dark:bg-slate-800/80" />

        {/* Sub-Risk Breakdown Bars */}
        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span>FLOOD</span>
              <span className="font-bold text-red-500 ml-2">{riskIndex.breakdown.floodRisk}%</span>
            </div>
            <div className="w-20 bg-slate-200/80 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${riskIndex.breakdown.floodRisk}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span>TRAFFIC</span>
              <span className="font-bold text-amber-500 ml-2">{riskIndex.breakdown.trafficRisk}%</span>
            </div>
            <div className="w-20 bg-slate-200/80 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full transition-all duration-500" style={{ width: `${riskIndex.breakdown.trafficRisk}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium mb-1">
              <span>STRUCTURAL</span>
              <span className="font-bold text-blue-500 ml-2">{riskIndex.breakdown.structuralRisk}%</span>
            </div>
            <div className="w-20 bg-slate-200/80 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${riskIndex.breakdown.structuralRisk}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Center: Real-Time Operational Counters */}
      <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>ACTIVE INCIDENTS: <strong>{activeIncidentsCount}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300">
          <Radio className="w-3.5 h-3.5" />
          <span>SENSORS ONLINE: <strong>{sensorsOnlineCount}</strong></span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300">
          <Zap className="w-3.5 h-3.5" />
          <span>RESCUE UNITS: <strong>{assetsActiveCount} ACTIVE</strong></span>
        </div>
      </div>
    </div>
  );
};
