import React from 'react';
import { WaterAnalyticsData } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Droplets, Activity, CloudRain, AlertTriangle, TrendingUp } from 'lucide-react';

interface WaterAnalyticsProps {
  analytics: WaterAnalyticsData;
  isLightTheme?: boolean;
}

export const WaterAnalytics: React.FC<WaterAnalyticsProps> = ({ analytics, isLightTheme = false }) => {
  const isDangerous = analytics.level_percentage >= 80;

  return (
    <div
      className={`ios-glass ios-card p-4 space-y-3.5 shadow-xl transition-all duration-300 ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b pb-2.5 ${
          isLightTheme ? 'border-slate-200/80' : 'border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500">
            <Droplets className="w-4 h-4" />
          </div>
          <h2
            className={`text-xs font-extrabold tracking-tight ${
              isLightTheme ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            BASIN HYDROMETRICS & FORECASTING
          </h2>
        </div>
        <span
          className={`px-3 py-0.5 text-[10px] font-extrabold rounded-full ${
            isDangerous
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse'
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {isDangerous ? 'HIGH SPILL RISK' : 'STABLE HYDROMETRICS'}
        </span>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Depth & Capacity Percentage */}
        <div
          className={`p-3 rounded-2xl border font-sans ${
            isLightTheme ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-950/80 border-slate-800/80'
          }`}
        >
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">BASIN LEVEL</div>
          <div
            className={`text-base font-extrabold mt-0.5 ${
              isLightTheme ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            {analytics.current_level_meters}m{' '}
            <span
              className={`text-xs ${
                isDangerous ? 'text-rose-500 font-black' : 'text-blue-500'
              }`}
            >
              ({analytics.level_percentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isDangerous ? 'bg-rose-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, analytics.level_percentage)}%` }}
            />
          </div>
        </div>

        {/* Discharge Flow Rate */}
        <div
          className={`p-3 rounded-2xl border font-sans ${
            isLightTheme ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-950/80 border-slate-800/80'
          }`}
        >
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">DISCHARGE FLOW</div>
          <div className="text-base font-extrabold text-blue-500 mt-0.5">
            {analytics.discharge_rate_m3s}{' '}
            <span className="text-xs text-slate-400 font-medium">m³/s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-amber-500" /> +12.4% vs 3hr avg
          </div>
        </div>

        {/* Flow Speed */}
        <div
          className={`p-2.5 rounded-xl border font-mono ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}
        >
          <div className="text-[10px] text-slate-500">FLOW SPEED</div>
          <div className="text-base font-bold text-amber-500 mt-0.5">
            {analytics.flow_speed_ms}{' '}
            <span className="text-xs text-slate-400">m/s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Spillway Gate 2 Open</div>
        </div>

        {/* Quality Metrics */}
        <div
          className={`p-2.5 rounded-xl border font-mono ${
            isLightTheme ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
          }`}
        >
          <div className="text-[10px] text-slate-400">TURBIDITY / pH</div>
          <div className="text-base font-bold text-slate-100 mt-0.5">
            {analytics.turbidity_ntu}{' '}
            <span className="text-xs text-slate-400">NTU</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">pH {analytics.ph_level} (Normal)</div>
        </div>
      </div>

      {/* 24-Hour Flood Forecasting Timeline Chart */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
        <div className="flex items-center justify-between mb-2 text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> FLOOD FORECAST TIMELINE (WATER BASIN % CAPACITY)
          </span>
          <span className="text-[10px] text-red-400 font-bold">CRITICAL THRESHOLD = 80%</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.forecast_timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waterLevelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDangerous ? '#ef4444' : '#06b6d4'} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={isDangerous ? '#ef4444' : '#06b6d4'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              />
              <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'DANGER THRESHOLD (80%)', fill: '#ef4444', fontSize: 9 }} />
              <Area
                type="monotone"
                dataKey="predicted_level"
                name="Water Capacity (%)"
                stroke={isDangerous ? '#ef4444' : '#06b6d4'}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#waterLevelGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
