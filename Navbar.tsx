import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Clock,
  Database,
  Activity,
  Zap,
  Presentation,
  Sun,
  Moon,
  Sparkles,
  Bot,
  Box,
  Volume2,
  VolumeX,
  Megaphone,
  Sliders,
  Play,
  MapPin
} from 'lucide-react';
import { ThemeMode, CityConfig } from '../types';
import { toggleMute, getIsMuted, playClick } from '../lib/soundEffects';

export const CITIES: CityConfig[] = [
  {
    id: 'delhi',
    name: 'Delhi NCR',
    basinName: 'Yamuna River Basin',
    center: { lat: 28.6139, lng: 77.209 },
    zoom: 13,
    population: 18500000,
    activeSensorsCount: 2481,
    activeAssetsCount: 18
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metro',
    basinName: 'Mithi River Coastal Basin',
    center: { lat: 19.076, lng: 72.8777 },
    zoom: 13,
    population: 20400000,
    activeSensorsCount: 3120,
    activeAssetsCount: 26
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Urban',
    basinName: 'Vrishabhavathi Drainage Basin',
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 13,
    population: 13100000,
    activeSensorsCount: 1890,
    activeAssetsCount: 14
  }
];

interface NavbarProps {
  wsConnected: boolean;
  activeAlertsCount: number;
  selectedCity: CityConfig;
  onSelectCity: (city: CityConfig) => void;
  onOpenSchemaModal: () => void;
  onOpenPitchDeckModal: () => void;
  onOpenCopilotModal: () => void;
  onOpenLidarModal: () => void;
  onOpenBroadcastModal: () => void;
  onOpenSimulationModal: () => void;
  onRunEmergencyScenario: () => void;
  onTriggerSurgeSim: () => void;
  isSimulating: boolean;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wsConnected,
  activeAlertsCount,
  selectedCity,
  onSelectCity,
  onOpenSchemaModal,
  onOpenPitchDeckModal,
  onOpenCopilotModal,
  onOpenLidarModal,
  onOpenBroadcastModal,
  onOpenSimulationModal,
  onRunEmergencyScenario,
  onTriggerSurgeSim,
  isSimulating,
  themeMode,
  onToggleTheme
}) => {
  const [time, setTime] = useState<string>('');
  const [muted, setMuted] = useState<boolean>(getIsMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleMute();
    setMuted(newState);
    if (!newState) playClick();
  };

  const isLight = themeMode === 'light';

  return (
    <header
      className={`border-b px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 transition-all duration-300 shadow-sm ${
        isLight
          ? 'bg-white/80 border-slate-200/80 text-slate-900 backdrop-blur-2xl'
          : 'bg-[#0A0D14]/80 border-white/10 text-slate-100 backdrop-blur-2xl'
      }`}
    >
      {/* Brand & Command Center Identifier */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white font-black shadow-lg shadow-blue-500/25 active:scale-95 transition-transform">
          <Activity className="w-5 h-5 text-white stroke-[2.5]" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={`text-base font-extrabold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Nexo<span className="text-blue-500 font-extrabold">.AI</span>
            </h1>
            <span
              className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                isLight
                  ? 'bg-blue-50 text-blue-600 border-blue-200/80'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
              }`}
            >
              URBAN TWIN
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
            Disaster Intelligence & Emergency Command
          </p>
        </div>

        {/* Multi-City Tenant Selector */}
        <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200/80 dark:border-slate-800/80 text-xs font-medium">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <select
            value={selectedCity.id}
            onChange={(e) => {
              const found = CITIES.find((c) => c.id === e.target.value);
              if (found) onSelectCity(found);
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition ${
              isLight ? 'bg-slate-100/90 border-slate-200 text-slate-800 hover:bg-slate-200/60' : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.basinName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Middle Telemetry & Connection Indicators */}
      <div className="flex items-center gap-2 md:gap-3 text-xs font-medium">
        {/* WS Connection Status */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition ${
            wsConnected
              ? isLight
                ? 'bg-emerald-50 border-emerald-200/80 text-emerald-700'
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : isLight
              ? 'bg-amber-50 border-amber-200/80 text-amber-700'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${wsConnected ? 'animate-pulse text-emerald-500' : 'text-amber-500'}`} />
          <span className="hidden md:inline">{wsConnected ? 'LIVE TELEMETRY' : 'CONNECTING...'}</span>
          <span className="md:hidden">{wsConnected ? 'LIVE' : 'WAIT'}</span>
        </div>

        {/* Active Emergency Counter */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition ${
            activeAlertsCount > 0
              ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 animate-pulse'
              : isLight
              ? 'bg-slate-100 border-slate-200/80 text-slate-600'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          <span>
            <strong className="font-bold">{activeAlertsCount}</strong> <span className="hidden sm:inline">INCIDENTS</span>
          </span>
        </div>

        {/* Real-Time UTC Clock */}
        <div
          className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium text-slate-600 dark:text-slate-300 ${
            isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>{time}</span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Emergency Scenario Automation Runner */}
        <button
          onClick={onRunEmergencyScenario}
          title="Run complete 10-step automated disaster scenario sequence"
          className="ios-button flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">DEMO SCENARIO</span>
        </button>

        {/* Simulation Engine What-If Modeler */}
        <button
          onClick={onOpenSimulationModal}
          className={`ios-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
            isLight
              ? 'bg-cyan-50 hover:bg-cyan-100/80 border-cyan-200 text-cyan-800'
              : 'bg-cyan-950/40 hover:bg-cyan-900/60 border-cyan-800/80 text-cyan-300'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-500" />
          <span className="hidden md:inline">SIMULATION</span>
        </button>

        {/* OmniMind AI Copilot Button */}
        <button
          onClick={onOpenCopilotModal}
          className="ios-button flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:brightness-110 text-white shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI COPILOT</span>
        </button>

        {/* LiDAR Inspector Trigger */}
        <button
          onClick={onOpenLidarModal}
          className={`ios-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
            isLight
              ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-800'
              : 'bg-amber-950/40 hover:bg-amber-900/60 border-amber-800/80 text-amber-300'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden lg:inline">LiDAR</span>
        </button>

        {/* Citizen Broadcast Console Trigger */}
        <button
          onClick={onOpenBroadcastModal}
          className={`ios-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
            isLight
              ? 'bg-rose-50 hover:bg-rose-100/80 border-rose-200 text-rose-800'
              : 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-800/80 text-rose-300'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden xl:inline">BROADCAST</span>
        </button>

        {/* Sound Toggle Button */}
        <button
          onClick={handleSoundToggle}
          title={muted ? 'Unmute Command Center Audio Feedback' : 'Mute Audio Feedback'}
          className={`p-2 rounded-full border transition cursor-pointer flex items-center justify-center active:scale-90 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
              : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
          }`}
        >
          {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />}
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={onToggleTheme}
          title="Toggle Light Theme vs Dark Executive Command View"
          className={`p-2 rounded-full border transition cursor-pointer flex items-center justify-center active:scale-90 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700'
              : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-amber-400'
          }`}
        >
          {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* SIH Pitch Deck Trigger */}
        <button
          onClick={onOpenPitchDeckModal}
          className="ios-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer"
        >
          <Presentation className="w-3.5 h-3.5" />
          <span className="hidden 2xl:inline">PITCH</span>
        </button>

        {/* System Schema & Architecture Inspector */}
        <button
          onClick={onOpenSchemaModal}
          className={`ios-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition cursor-pointer ${
            isLight
              ? 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200 text-slate-700'
              : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden 2xl:inline">SCHEMAS</span>
        </button>
      </div>
    </header>
  );
};


