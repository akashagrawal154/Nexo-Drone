import React, { useState } from 'react';
import { ActiveAsset } from '../types';
import {
  Video,
  Eye,
  Flame,
  Crosshair,
  Maximize2,
  Compass,
  BatteryCharging,
  Zap,
  Sliders,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface DroneVisionViewerProps {
  droneAsset?: ActiveAsset;
  isLightTheme?: boolean;
}

export const DroneVisionViewer: React.FC<DroneVisionViewerProps> = ({ droneAsset, isLightTheme = false }) => {
  const [visionMode, setVisionMode] = useState<'optical' | 'thermal' | 'ai_overlay'>('ai_overlay');
  const [cameraZoom, setCameraZoom] = useState<number>(2.4);

  // Simulated AI Bounding Box Detections over the stream
  const aiDetections = [
    {
      id: 'det_01',
      label: 'Structural Fracture #12B',
      confidence: 0.94,
      severity: 'critical',
      box: { top: '32%', left: '28%', width: '22%', height: '18%' }
    },
    {
      id: 'det_02',
      label: 'Riverbed Water Level Line',
      confidence: 0.89,
      severity: 'warning',
      box: { top: '60%', left: '15%', width: '70%', height: '14%' }
    },
    {
      id: 'det_03',
      label: 'Submerged Debris Hazard',
      confidence: 0.82,
      severity: 'medium',
      box: { top: '72%', left: '55%', width: '18%', height: '12%' }
    }
  ];

  return (
    <div
      className={`ios-glass ios-card overflow-hidden flex flex-col h-full shadow-xl transition-all duration-300 ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Feed Header */}
      <div
        className={`p-3.5 border-b flex items-center justify-between ${
          isLightTheme ? 'bg-slate-100/80 border-slate-200/80' : 'bg-slate-900/80 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500">
            <Video className="w-4 h-4 animate-pulse" />
          </div>
          <h2
            className={`text-xs font-extrabold tracking-tight ${
              isLightTheme ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            AI DRONE VISION STREAM
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-0.5 text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
            REC 4K HDR • {cameraZoom}X ZOOM
          </span>
        </div>
      </div>


      {/* Main Video Viewport Container */}
      <div className="relative flex-1 min-h-[260px] bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
        {/* Background Synthetic Camera View (Gradient / Bridge & River Vector Imagery) */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            visionMode === 'thermal'
              ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-700 opacity-90'
              : 'bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950'
          }`}
        >
          {/* Grid Scanning Lines Simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

          {/* Animated Scanline Overlay */}
          <div className="absolute inset-x-0 h-1 bg-cyan-500/50 shadow-[0_0_15px_#06b6d4] animate-scan" />

          {/* Synthetic Bridge & Water Canvas Artwork */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 250">
            {/* River Flow Curve */}
            <path d="M 0 160 Q 200 130 400 180 L 400 250 L 0 250 Z" fill="#0284c7" opacity="0.3" />
            {/* Flyover Bridge Pillars */}
            <line x1="80" y1="90" x2="320" y2="90" stroke="#94a3b8" strokeWidth="12" />
            <rect x="120" y="90" width="16" height="70" fill="#64748b" />
            <rect x="260" y="90" width="16" height="70" fill="#64748b" />
          </svg>
        </div>

        {/* HUD Crosshair Center Reticle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <Crosshair className="w-16 h-16 text-cyan-400/40 stroke-[1]" />
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
        </div>

        {/* AI Bounding Box Overlays (If enabled) */}
        {visionMode !== 'thermal' &&
          aiDetections.map((det) => (
            <div
              key={det.id}
              style={{
                top: det.box.top,
                left: det.box.left,
                width: det.box.width,
                height: det.box.height
              }}
              className={`absolute border-2 ${
                det.severity === 'critical'
                  ? 'border-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                  : 'border-amber-400 bg-amber-400/10'
              } rounded pointer-events-none flex flex-col justify-between p-1 transition-all`}
            >
              <div className="flex items-center justify-between bg-slate-950/80 px-1 py-0.5 rounded text-[9px] font-mono">
                <span className="font-bold text-slate-100">{det.label}</span>
                <span className="text-cyan-400 font-bold">{(det.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="self-end text-[8px] font-mono bg-red-950 text-red-300 px-1 rounded uppercase font-bold">
                {det.severity}
              </div>
            </div>
          ))}

        {/* Corner HUD Telemetry Overlay */}
        <div className="absolute top-2 left-2 z-10 font-mono text-[10px] text-cyan-300 bg-slate-950/80 backdrop-blur p-2 rounded border border-slate-800 space-y-0.5">
          <div>ALT: <span className="font-bold text-white">48.2m</span></div>
          <div>SPD: <span className="font-bold text-white">32.4 km/h</span></div>
          <div>HEAD: <span className="font-bold text-white">142° SE</span></div>
        </div>

        <div className="absolute top-2 right-2 z-10 font-mono text-[10px] text-emerald-400 bg-slate-950/80 backdrop-blur p-2 rounded border border-slate-800 space-y-0.5 text-right">
          <div>BAT: <span className="font-bold text-white">78%</span></div>
          <div>GPS: <span className="font-bold text-white">28.606, 77.224</span></div>
          <div>FPS: <span className="font-bold text-white">60.0</span></div>
        </div>
      </div>

      {/* Camera Mode Toolbar Controls */}
      <div className="p-2.5 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setVisionMode('ai_overlay')}
            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
              visionMode === 'ai_overlay'
                ? 'bg-cyan-600 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            AI OVERLAY
          </button>
          <button
            onClick={() => setVisionMode('thermal')}
            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
              visionMode === 'thermal'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            FLIR THERMAL
          </button>
          <button
            onClick={() => setVisionMode('optical')}
            className={`px-2.5 py-1 rounded font-bold transition cursor-pointer ${
              visionMode === 'optical'
                ? 'bg-slate-700 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            RGB OPTICAL
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">ZOOM:</span>
          <button
            onClick={() => setCameraZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold cursor-pointer"
          >
            -
          </button>
          <span className="text-cyan-400 font-bold">{cameraZoom}X</span>
          <button
            onClick={() => setCameraZoom((z) => Math.min(5, +(z + 0.5).toFixed(1)))}
            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
