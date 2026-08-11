import React, { useState } from 'react';
import { X, Sliders, Play, RotateCcw, CloudRain, Droplets, ShieldAlert, CheckCircle, Activity, Building2, MapPin } from 'lucide-react';
import { SimulationConfig, SimulationResults } from '../types';

interface SimulationEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySimulationToTwin?: (config: SimulationConfig) => void;
  isLightTheme?: boolean;
}

export const SimulationEngineModal: React.FC<SimulationEngineModalProps> = ({
  isOpen,
  onClose,
  onApplySimulationToTwin,
  isLightTheme = false
}) => {
  const [config, setConfig] = useState<SimulationConfig>({
    rainfallMmHr: 85,
    riverLevelRiseMeters: 2.8,
    drainageCapacityPct: 45,
    gateReleaseM3s: 450
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [results, setResults] = useState<SimulationResults | null>({
    predictedFloodInundationKm2: 18.4,
    estimatedAffectedPopulation: 34200,
    riskLevel: 'HIGH',
    threatenedInfrastructure: [
      'Yamuna Bridge #04 Low-Lying Abutment',
      'Metro Line 3 Civil Lines Substation',
      'ISBT Kashmiri Gate Drainage Outfall',
      'Old Railway Bridge Low-Bank Slums'
    ],
    recommendedDefenses: [
      'Pre-emptively open Barrage Spillway Gate #2 & #4 by +150 m³/s',
      'Deploy 4x High-Capacity 500-HP Modular Pumps at Kashmiri Gate',
      'Issue Pre-Evacuation Alert via Cell Broadcast for Sector 4 & 7',
      'Establish Emergency Traffic Green Corridor along Ring Road'
    ]
  });

  if (!isOpen) return null;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Calculate dynamic results based on sliders
      const baseKm2 = (config.rainfallMmHr * 0.15) + (config.riverLevelRiseMeters * 3.5) - (config.drainageCapacityPct * 0.08);
      const inundatedKm2 = Math.max(1.2, parseFloat(baseKm2.toFixed(1)));
      const affectedPop = Math.round(inundatedKm2 * 1850);
      
      let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
      if (inundatedKm2 > 25 || config.rainfallMmHr > 110) risk = 'CRITICAL';
      else if (inundatedKm2 > 12) risk = 'HIGH';
      else if (inundatedKm2 > 5) risk = 'MEDIUM';

      setResults({
        predictedFloodInundationKm2: inundatedKm2,
        estimatedAffectedPopulation: affectedPop,
        riskLevel: risk,
        threatenedInfrastructure: [
          'Yamuna Bridge #04 Structural Piers',
          'Kashmiri Gate Transport Hub Underpass',
          'Sector 12 Municipal Pumping Station',
          'Ring Road Corridor Sector B'
        ],
        recommendedDefenses: [
          `Increase Barrage Gate Release to ${Math.min(1200, config.gateReleaseM3s + 200)} m³/s`,
          'Activate Mobile NDRF Rescue Taskforce Alpha & Beta',
          'Pre-position 12x Flood Evacuation Buses at Civil Lines',
          'Activate VMS Dynamic Road Diversions on Outer Ring Road'
        ]
      });

      setIsSimulating(false);
      if (onApplySimulationToTwin) {
        onApplySimulationToTwin(config);
      }
    }, 800);
  };

  const handleReset = () => {
    setConfig({
      rainfallMmHr: 35,
      riverLevelRiseMeters: 0.8,
      drainageCapacityPct: 85,
      gateReleaseM3s: 200
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
          isLightTheme ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-mono font-bold tracking-tight">NEXO DIGITAL TWIN SIMULATION ENGINE</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  WHAT-IF SCENARIO MODELER
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Simulate hydrometric storm stress, barrage gate releases, and urban drainage bottlenecks in real time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
          {/* Left Column: Parameter Sliders */}
          <div className="space-y-5 border-r border-slate-200 dark:border-slate-800 pr-0 lg:pr-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-500" />
                ENVIRONMENTAL CONTROLS
              </span>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> RESET
              </button>
            </div>

            {/* Slider 1: Rainfall Intensity */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  Cloudburst / Rainfall Intensity
                </label>
                <span className="font-bold text-blue-600 dark:text-blue-400">{config.rainfallMmHr} mm/hr</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={config.rainfallMmHr}
                onChange={(e) => setConfig({ ...config, rainfallMmHr: parseInt(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Light (5 mm)</span>
                <span>Heavy (50 mm)</span>
                <span>Extreme (150 mm)</span>
              </div>
            </div>

            {/* Slider 2: River Basin Elevation Surge */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  River Crest Level Rise (+m)
                </label>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">+{config.riverLevelRiseMeters} m</span>
              </div>
              <input
                type="range"
                min="0"
                max="5.0"
                step="0.1"
                value={config.riverLevelRiseMeters}
                onChange={(e) => setConfig({ ...config, riverLevelRiseMeters: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Baseline (0.0m)</span>
                <span>Warning (+2.0m)</span>
                <span>Breach (+5.0m)</span>
              </div>
            </div>

            {/* Slider 3: Urban Drainage Capacity */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-500" />
                  Stormwater Drainage Efficiency
                </label>
                <span className="font-bold text-amber-600 dark:text-amber-400">{config.drainageCapacityPct}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={config.drainageCapacityPct}
                onChange={(e) => setConfig({ ...config, drainageCapacityPct: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20% (Clogged Outfalls)</span>
                <span>100% (Full Flow)</span>
              </div>
            </div>

            {/* Slider 4: Barrage Discharge Rate */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Barrage Gate Release Rate
                </label>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{config.gateReleaseM3s} m³/s</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="25"
                value={config.gateReleaseM3s}
                onChange={(e) => setConfig({ ...config, gateReleaseM3s: parseInt(e.target.value) })}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wide shadow-lg transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>COMPUTING HYDRODYNAMIC MATRIX...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>EXECUTE WHAT-IF SIMULATION</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output Simulation Impact Matrix */}
          <div className="space-y-4">
            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              PREDICTED IMPACT ANALYSIS MATRIX
            </span>

            {results && (
              <div className="space-y-4">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">ESTIMATED FLOOD FOOTPRINT</div>
                    <div className="text-xl font-extrabold text-red-600 dark:text-red-400">
                      {results.predictedFloodInundationKm2} <span className="text-xs">km²</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">AFFECTED RESIDENTS</div>
                    <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
                      {results.estimatedAffectedPopulation.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Threatened Infrastructure List */}
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    THREATENED CRITICAL INFRASTRUCTURE ({results.threatenedInfrastructure.length})
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {results.threatenedInfrastructure.map((infra, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        <span>{infra}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommended Defense Protocol */}
                <div className="p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
                  <div className="font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-500" />
                    AI RECOMMENDED TACTICAL DEFENSES
                  </div>
                  <div className="space-y-1.5">
                    {results.recommendedDefenses.map((def, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="text-cyan-500 font-bold">0{idx + 1}.</span>
                        <span>{def}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
