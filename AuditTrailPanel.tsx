import React, { useState } from 'react';
import { History, Shield, AlertTriangle, CheckCircle2, User, Filter, Search } from 'lucide-react';
import { AuditTrailEntry } from '../types';

interface AuditTrailPanelProps {
  logs: AuditTrailEntry[];
  isLightTheme?: boolean;
}

export const AuditTrailPanel: React.FC<AuditTrailPanelProps> = ({ logs, isLightTheme = false }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesSev = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const getSeverityBadge = (severity: AuditTrailEntry['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'dispatch':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div
      className={`ios-glass ios-card p-4 shadow-md font-sans text-xs transition-all duration-300 space-y-3.5 ${
        isLightTheme ? 'bg-white/70 text-slate-900 border-white/80' : 'bg-slate-900/60 text-slate-100 border-white/10'
      }`}
    >
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500">
            <History className="w-4 h-4" />
          </div>
          <span className="font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">COMMAND AUDIT TRAIL</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-200/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold">
            {logs.length} EVENTS RECORDED
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 w-36 sm:w-48 transition"
            />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 font-medium"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="dispatch">Dispatch</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">No audit logs matching current filter parameters.</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-cyan-500/40 transition"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${getSeverityBadge(log.severity)}`}>
                  {log.actor}
                </span>
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{log.action}</div>
                  <div className="text-[11px] text-slate-500">{log.details}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
