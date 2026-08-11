import React, { useState } from 'react';
import {
  X,
  Activity,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Cpu,
  Zap,
  Gauge,
  Box,
  Info
} from 'lucide-react';
import { playClick } from '../lib/soundEffects';

interface LidarScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightTheme?: boolean;
}

export const LidarScanModal: React.FC<LidarScanModalProps> = ({
  isOpen,
  onClose,
  isLightTheme = false
}) => {
  const [selectedAsset, setSelectedAsset] = useState<'bridge' | 'spillway' | 'overpass'>('bridge');
  const [viewMode, setViewMode] = useState<'lidar' | 'fea_stress' | 'vibration'>('fea_stress');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className={`w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
          isLightTheme ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-md">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider">
                  3D LiDAR & STRUCTURAL FEA INSPECTOR
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full">
                  REAL-TIME STRAIN SENSOR TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Piezoelectric Micro-Strain & Resonant Frequency Analytics for Urban Infrastructure
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLightTheme
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar */}
        <div
          className={`p-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${
            isLightTheme ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}
        >
          {/* Asset Selectors */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">TARGET INFRASTRUCTURE:</span>
            <button
              onClick={() => setSelectedAsset('bridge')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                selectedAsset === 'bridge'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow'
                  : isLightTheme
                  ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              🌉 Yamuna Bridge #04
            </button>

            <button
              onClick={() => setSelectedAsset('spillway')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                selectedAsset === 'spillway'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow'
                  : isLightTheme
                  ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              🌊 Spillway Gate #02
            </button>

            <button
              onClick={() => setSelectedAsset('overpass')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${
                selectedAsset === 'overpass'
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow'
                  : isLightTheme
                  ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              🚆 Metro Sector Overpass
            </button>
          </div>

          {/* View Modes */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">VIEW LAYER:</span>
            <button
              onClick={() => setViewMode('fea_stress')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                viewMode === 'fea_stress'
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              🔥 FEA Stress Map
            </button>
            <button
              onClick={() => setViewMode('lidar')}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition cursor-pointer ${
                viewMode === 'lidar'
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              🌐 3D LiDAR Point Cloud
            </button>
          </div>
        </div>

        {/* Main Inspection Viewport Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Canvas Viewport (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-950 relative flex items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden">
            {/* Synthetic Vector / SVG Point Cloud & Stress Contour View */}
            <svg
              viewBox="0 0 800 450"
              className="w-full h-full max-h-[460px] drop-shadow-2xl select-none"
            >
              <defs>
                <linearGradient id="stressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="85%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>

                <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="800" height="450" fill="url(#gridPattern)" />

              {/* River Water Level Line */}
              <rect x="0" y="320" width="800" height="130" fill="#0284c7" opacity="0.25" />
              <line x1="0" y1="320" x2="800" y2="320" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6,6" />
              <text x="20" y="310" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold">
                HIGH WATER LINE: +14.2m (DISCHARGE SPILL)
              </text>

              {/* Bridge / Structure Geometry */}
              {selectedAsset === 'bridge' && (
                <g>
                  {/* Bridge Piers */}
                  <rect x="180" y="180" width="50" height="180" fill="#334155" stroke="#475569" strokeWidth="2" />
                  <rect x="570" y="180" width="50" height="180" fill="#334155" stroke="#475569" strokeWidth="2" />

                  {/* Bridge Deck */}
                  <rect x="60" y="160" width="680" height="24" fill={viewMode === 'fea_stress' ? 'url(#stressGrad)' : '#0ea5e9'} rx="4" />

                  {/* Cable Suspensions */}
                  <path d="M 60 160 Q 400 290 740 160" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="4,4" />

                  {/* Strain Sensor Markers */}
                  <g className="cursor-pointer group">
                    <circle cx="205" cy="172" r="8" fill="#ef4444" className="animate-ping opacity-75" />
                    <circle cx="205" cy="172" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                    <text x="220" y="168" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      PIEZO SENSOR #01: 142.8 µε (Scour Area)
                    </text>
                  </g>

                  <g className="cursor-pointer group">
                    <circle cx="595" cy="172" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <text x="610" y="168" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      PIEZO SENSOR #02: 88.2 µε (Nominal)
                    </text>
                  </g>
                </g>
              )}

              {selectedAsset === 'spillway' && (
                <g>
                  <path d="M 150 100 L 250 380 L 550 380 L 650 100 Z" fill="#1e293b" stroke="#334155" strokeWidth="3" />
                  <rect x="320" y="140" width="160" height="180" fill="url(#stressGrad)" opacity="0.85" rx="8" />
                  <circle cx="400" cy="220" r="10" fill="#ef4444" className="animate-pulse" />
                  <text x="420" y="225" fill="#f87171" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    HYDRAULIC PRESSURE: 42.8 kPa
                  </text>
                </g>
              )}

              {selectedAsset === 'overpass' && (
                <g>
                  <path d="M 100 350 L 700 120" stroke="url(#stressGrad)" strokeWidth="20" strokeLinecap="round" />
                  <circle cx="400" cy="235" r="8" fill="#f59e0b" className="animate-pulse" />
                  <text x="420" y="230" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    BEARING PAD DEFORMATION: 2.1mm
                  </text>
                </g>
              )}

              {/* LiDAR Point Cloud Particles (SVG Scatter overlay) */}
              {viewMode === 'lidar' && (
                <g opacity="0.8">
                  {Array.from({ length: 120 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={80 + (i * 13) % 640}
                      cy={150 + Math.sin(i) * 35}
                      r={Math.random() * 2 + 1}
                      fill={i % 3 === 0 ? '#06b6d4' : i % 2 === 0 ? '#3b82f6' : '#10b981'}
                    />
                  ))}
                </g>
              )}
            </svg>

            {/* Overlaid Telemetry Hud */}
            <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                <span>LiDAR DENSITY: 12,400 pts/m²</span>
              </div>
              <div>ACCURACY: ±0.4mm Laser Pulse</div>
              <div>FEA SOLVER: Elastic Structural Mesh</div>
            </div>
          </div>

          {/* Right Metrics Panel (4 Cols) */}
          <div
            className={`lg:col-span-4 p-4 font-mono text-xs space-y-4 overflow-y-auto ${
              isLightTheme ? 'bg-slate-50' : 'bg-slate-900'
            }`}
          >
            {/* Safety Index Gauge Card */}
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isLightTheme ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
                <span>SAFETY FACTOR INDEX (SF)</span>
                <span className="text-emerald-500 font-bold">NOMINAL</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1.42</span>
                <span className="text-xs text-slate-500">/ 1.0 Min Risk Limit</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '71%' }} />
              </div>
            </div>

            {/* Live Piezo Sensors */}
            <div
              className={`p-3.5 rounded-xl border space-y-2.5 ${
                isLightTheme ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                <span>PIEZO SENSOR TELEMETRY</span>
                <Cpu className="w-4 h-4 text-cyan-500" />
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Micro-Strain (µε):</span>
                  <span className="font-bold text-amber-500">142.8 µε</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Vibration Frequency:</span>
                  <span className="font-bold text-cyan-500">1.24 Hz</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pier Scour Depth:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">0.84 m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bearing Expansion:</span>
                  <span className="font-bold text-emerald-500">+1.2 mm</span>
                </div>
              </div>
            </div>

            {/* AI Diagnostics Recommendation */}
            <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-900 dark:text-cyan-200 space-y-1.5 text-[11px]">
              <div className="font-bold flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
                <Zap className="w-4 h-4 fill-current" />
                <span>AI STRUCTURAL DIAGNOSIS</span>
              </div>
              <p className="leading-snug">
                No resonant frequency risk detected. Pier #01 experiencing moderate water flow drag (+12%).
                Heavy transport vehicles recommended to maintain 30 km/h speed limit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
