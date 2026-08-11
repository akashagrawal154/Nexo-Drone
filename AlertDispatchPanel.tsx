import React, { useState } from 'react';
import { Incident, ActiveAsset } from '../types';
import {
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  MapPin,
  Flame,
  Users,
  X
} from 'lucide-react';

interface AlertDispatchPanelProps {
  incidents: Incident[];
  assets: ActiveAsset[];
  onDispatch: (assetId: string, incidentId: string) => void;
  onResolve: (incidentId: string) => void;
  isLightTheme?: boolean;
}

export const AlertDispatchPanel: React.FC<AlertDispatchPanelProps> = ({
  incidents,
  assets,
  onDispatch,
  onResolve,
  isLightTheme = false
}) => {
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState<Incident | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  const activeIncidents = incidents.filter((inc) => inc.status !== 'resolved');

  const handleExecuteDispatch = () => {
    if (!selectedIncidentForDispatch || !selectedAssetId) return;
    onDispatch(selectedAssetId, selectedIncidentForDispatch.id);
    setSelectedIncidentForDispatch(null);
    setSelectedAssetId('');
  };

  return (
    <div
      className={`ios-glass ios-card flex flex-col h-full overflow-hidden shadow-xl transition-all duration-300 ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Header */}
      <div
        className={`p-3.5 border-b flex items-center justify-between ${
          isLightTheme ? 'bg-slate-100/80 border-slate-200/80' : 'bg-slate-900/80 border-slate-800/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-rose-500/10 text-rose-500">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
          <h2
            className={`text-xs font-extrabold tracking-tight ${
              isLightTheme ? 'text-slate-900' : 'text-slate-100'
            }`}
          >
            EMERGENCY ALERTS & DISPATCH
          </h2>
        </div>
        <span className="px-3 py-0.5 text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-full">
          {activeIncidents.length} ACTIVE
        </span>
      </div>

      {/* Incident List Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeIncidents.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-70" />
            <p>NO ACTIVE EMERGENCY BREACHES</p>
            <p className="text-[10px] text-slate-400">All urban sectors operating within safe parameters.</p>
          </div>
        ) : (
          activeIncidents.map((inc) => {
            const isCritical = inc.severity_level >= 4;
            const assignedAsset = assets.find((a) => a.id === inc.assigned_asset_id);

            return (
              <div
                key={inc.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCritical
                    ? isLightTheme
                      ? 'bg-red-50/60 border-red-200 shadow-sm'
                      : 'bg-red-950/20 border-red-800/80 shadow-lg shadow-red-950/20'
                    : isLightTheme
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-amber-950/20 border-amber-800/80'
                }`}
              >
                {/* Title and Severity Tag */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                        isCritical ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      LVL {inc.severity_level}
                    </span>
                    <h3
                      className={`text-xs font-bold line-clamp-1 ${
                        isLightTheme ? 'text-slate-900' : 'text-slate-100'
                      }`}
                    >
                      {inc.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                    {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug mb-2">
                  {inc.description}
                </p>

                {/* Location & Sensor reference */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono p-2 rounded-lg border mb-2.5 ${
                    isLightTheme ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-500" />
                    <span>
                      {inc.coordinates.lat.toFixed(3)}, {inc.coordinates.lng.toFixed(3)}
                    </span>
                  </div>
                  <div>Radius: <span className="font-bold">{inc.affected_radius}m</span></div>
                  <div>Status: <span className="uppercase text-amber-500 font-bold">{inc.status}</span></div>
                </div>

                {/* Recommended Action */}
                {inc.recommended_action && (
                  <div className="text-[10px] text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 mb-2.5">
                    <strong className="text-cyan-600 dark:text-cyan-400">REC ACTION:</strong> {inc.recommended_action}
                  </div>
                )}

                {/* Dispatch Status / Action Buttons */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  {assignedAsset ? (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>DISPATCHED: {assignedAsset.name}</span>
                    </div>
                  ) : (
                    /* Single-Click Dispatch Button requested by user */
                    <button
                      onClick={() => {
                        setSelectedIncidentForDispatch(inc);
                        const available = assets.find((a) => a.status === 'idle') || assets[0];
                        if (available) setSelectedAssetId(available.id);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg shadow cursor-pointer active:scale-95 transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>DISPATCH NDRF</span>
                    </button>
                  )}

                  <button
                    onClick={() => onResolve(inc.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>RESOLVE</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>


      {/* Dispatch NDRF Modal */}
      {selectedIncidentForDispatch && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 max-w-md w-full shadow-2xl font-sans text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-red-400 font-mono font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>DISPATCH EMERGENCY RESCUE TEAM</span>
              </div>
              <button
                onClick={() => setSelectedIncidentForDispatch(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-slate-300 font-bold mb-1">{selectedIncidentForDispatch.title}</p>
              <p className="text-[11px] text-slate-400">{selectedIncidentForDispatch.description}</p>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-slate-300 font-mono text-[11px] block">
                SELECT NDRF TASKFORCE / DRONE UNIT:
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              >
                {assets.map((ast) => (
                  <option key={ast.id} value={ast.id}>
                    {ast.name} ({ast.type.toUpperCase()}) — Battery: {ast.battery_pct}% — Status: {ast.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedIncidentForDispatch(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 font-mono text-xs hover:bg-slate-700 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handleExecuteDispatch}
                disabled={!selectedAssetId}
                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>CONFIRM DISPATCH</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
