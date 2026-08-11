import React, { useState } from 'react';
import {
  Navigation,
  ShieldAlert,
  Car,
  Clock,
  Zap,
  Route,
  ArrowRightLeft,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { EmergencyCorridor, ActiveAsset, Incident } from '../types';

interface SmartTrafficRoutingPanelProps {
  assets?: ActiveAsset[];
  incidents?: Incident[];
  onTriggerCorridor?: (corridorId: string) => void;
  isLightTheme?: boolean;
}

export const SmartTrafficRoutingPanel: React.FC<SmartTrafficRoutingPanelProps> = ({
  assets = [],
  incidents = [],
  onTriggerCorridor,
  isLightTheme = false
}) => {
  const [activeTab, setActiveTab] = useState<'corridors' | 'diversions'>('corridors');
  const [optimizedCorridorId, setOptimizedCorridorId] = useState<string | null>(null);

  const handleReoptimize = (corridorId: string) => {
    setOptimizedCorridorId(corridorId);
    if (onTriggerCorridor) {
      onTriggerCorridor(corridorId);
    }
    setTimeout(() => {
      setOptimizedCorridorId(null);
    }, 3000);
  };

  // Sample dynamic corridors calculated by AI Traffic Digital Twin
  const sampleCorridors: EmergencyCorridor[] = [
    {
      id: 'corridor_ndrf_01',
      name: 'Green Corridor Alpha (NDRF HQ -> Yamuna Spillway)',
      asset_id: 'asset_ndrf_01',
      incident_id: 'inc_001',
      origin: { lat: 28.625, lng: 77.202 },
      destination: { lat: 28.6139, lng: 77.209 },
      waypoints: [
        [28.625, 77.202],
        [28.62, 77.205],
        [28.615, 77.208],
        [28.6139, 77.209]
      ],
      distance_km: 4.8,
      eta_minutes: 6,
      time_saved_minutes: 14,
      signals_cleared: 7,
      civilian_diversion_route: [
        [28.622, 77.195],
        [28.61, 77.198],
        [28.598, 77.205]
      ],
      status: 'active'
    },
    {
      id: 'corridor_ndrf_02',
      name: 'Emergency Route Beta (Engineers Squad -> Victoria Flyover)',
      asset_id: 'asset_ndrf_02',
      incident_id: 'inc_002',
      origin: { lat: 28.618, lng: 77.212 },
      destination: { lat: 28.605, lng: 77.225 },
      waypoints: [
        [28.618, 77.212],
        [28.612, 77.218],
        [28.605, 77.225]
      ],
      distance_km: 3.2,
      eta_minutes: 4,
      time_saved_minutes: 9,
      signals_cleared: 5,
      civilian_diversion_route: [
        [28.614, 77.222],
        [28.608, 77.232]
      ],
      status: 'active'
    }
  ];

  return (
    <div
      className={`ios-glass ios-card transition-all duration-300 shadow-xl p-4 font-sans ${
        isLightTheme
          ? 'bg-white/70 border-white/80 text-slate-900'
          : 'bg-slate-900/60 border-white/10 text-slate-100'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800/80 mb-3.5 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 active:scale-95 transition-transform">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-tight uppercase flex items-center gap-2">
              Smart Traffic & Emergency Routing
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                AI GREEN CORRIDORS
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Dynamic signal preemptions & civilian traffic diversion matrices
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-full bg-slate-200/60 dark:bg-slate-950/80 border border-slate-300/40 dark:border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('corridors')}
            className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-extrabold ${
              activeTab === 'corridors'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Corridors ({sampleCorridors.length})
          </button>
          <button
            onClick={() => setActiveTab('diversions')}
            className={`px-3 py-1 rounded-full transition-all duration-200 cursor-pointer font-extrabold ${
              activeTab === 'diversions'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Diversions
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'corridors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleCorridors.map((corridor) => (
            <div
              key={corridor.id}
              className={`p-3.5 rounded-xl border transition ${
                isLightTheme
                  ? 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  {corridor.name}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  STATUS: GREEN CLEARANCE
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 my-2.5 text-center font-mono">
                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">ETA SPEEDS</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {corridor.eta_minutes} MINS
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">TIME SAVED</div>
                  <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                    +{corridor.time_saved_minutes} MINS
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">SIGNALS CLEARED</div>
                  <div className="text-sm font-black text-cyan-600 dark:text-cyan-400">
                    {corridor.signals_cleared} GREEN
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Distance: {corridor.distance_km} km | Autonomous Preemption
                </span>
                <button
                  onClick={() => handleReoptimize(corridor.id)}
                  className={`px-2.5 py-1 rounded font-bold transition shadow cursor-pointer text-[11px] ${
                    optimizedCorridorId === corridor.id
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {optimizedCorridorId === corridor.id ? '✓ ROUTE RE-OPTIMIZED' : 'RE-OPTIMIZE ROUTE'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Civilian Traffic Diversions */
        <div className="space-y-2.5 text-xs font-mono">
          <div className="p-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-600 dark:text-red-400">
                ACTIVE CIVILIAN TRAFFIC DIVERSION — SECTOR 04 WATER RISE
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Yamuna Riverbank Expressway (KM 12-16) closed due to 78% spillway water rise.
                Civilian vehicles automatically rerouted to Northern Bypass Arterial. Dynamic VMS signs updated.
              </p>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Reroute Delay: +4.2 mins</span>
                <span>•</span>
                <span>Smart Signals Active: 12 Juncs</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Congestion Reduced 38%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
