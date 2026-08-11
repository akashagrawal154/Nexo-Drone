import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Volume2,
  Tv,
  MessageCircle,
  Users,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { playClick, playAlertSiren } from '../lib/soundEffects';

interface PublicBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightTheme?: boolean;
}

export const PublicBroadcastModal: React.FC<PublicBroadcastModalProps> = ({
  isOpen,
  onClose,
  isLightTheme = false
}) => {
  const [channels, setChannels] = useState({
    cellBroadcast: true,
    sirens: true,
    vmsRoadSigns: true,
    whatsAppBot: true
  });

  const [messageText, setMessageText] = useState(
    'EMERGENCY ALERT: Yamuna Riverbank Sector 04 water level at 86.5% capacity breach. Immediate evacuation advised for low-lying areas (0-100m from riverbank). Proceed to High-Ground Shelter 01 (Public School 14).'
  );

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const handleTriggerBroadcast = () => {
    playAlertSiren();
    setIsBroadcasting(true);

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
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
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 text-white shadow-md">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider">
                  CITIZEN MASS EMERGENCY BROADCAST CONSOLE
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full">
                  142,500 RECIPIENTS IN TARGET ZONE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                Multi-Channel Cell Broadcast, Acoustic Sirens, VMS Signs & WhatsApp Hotline
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 font-mono text-xs">
          {/* Channel Selectors Grid */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase">SELECT BROADCAST DISPATCH CHANNELS:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cell Broadcast SMS */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  channels.cellBroadcast
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-300'
                    : isLightTheme
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-cyan-500" />
                  <div>
                    <div className="font-bold">CELL BROADCAST SMS</div>
                    <div className="text-[10px] opacity-75 font-sans">142,500 active SIM cards in Sector 04</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.cellBroadcast}
                  onChange={(e) => setChannels({ ...channels, cellBroadcast: e.target.checked })}
                  className="accent-cyan-500 rounded cursor-pointer"
                />
              </label>

              {/* Acoustic Sirens */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  channels.sirens
                    ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-300'
                    : isLightTheme
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-red-500" />
                  <div>
                    <div className="font-bold">120dB SIREN ARRAY</div>
                    <div className="text-[10px] opacity-75 font-sans">12 Sector High-Decibel Warning Speakers</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.sirens}
                  onChange={(e) => setChannels({ ...channels, sirens: e.target.checked })}
                  className="accent-red-500 rounded cursor-pointer"
                />
              </label>

              {/* VMS Road Signs */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  channels.vmsRoadSigns
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300'
                    : isLightTheme
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tv className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-bold">SMART VMS ROAD SIGNS</div>
                    <div className="text-[10px] opacity-75 font-sans">6 Overhead Highway Matrix Displays</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.vmsRoadSigns}
                  onChange={(e) => setChannels({ ...channels, vmsRoadSigns: e.target.checked })}
                  className="accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {/* WhatsApp Bot */}
              <label
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  channels.whatsAppBot
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                    : isLightTheme
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-bold">WHATSAPP DISASTER BOT</div>
                    <div className="text-[10px] opacity-75 font-sans">Automated refuge shelter location pins</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.whatsAppBot}
                  onChange={(e) => setChannels({ ...channels, whatsAppBot: e.target.checked })}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Broadcast Message Composer */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase">EMERGENCY BROADCAST PAYLOAD:</label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className={`w-full p-3 rounded-xl border font-sans text-xs focus:outline-none focus:ring-2 focus:ring-red-500 ${
                isLightTheme
                  ? 'bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-slate-950 border-slate-800 text-white'
              }`}
            />
          </div>

          {/* Success Status Notice */}
          {broadcastSent && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-bold animate-fade-in">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>✓ EMERGENCY BROADCAST TRANSMITTED TO ALL 142,500 RECIPIENTS & SIRENS ACTIVATED</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className={`px-4 py-2.5 rounded-xl font-bold border transition cursor-pointer ${
                isLightTheme
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              CANCEL
            </button>

            <button
              onClick={handleTriggerBroadcast}
              disabled={isBroadcasting}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer active:scale-95 transition disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current animate-pulse" />
              <span>{isBroadcasting ? 'TRANSMITTING...' : 'DISPATCH MASS BROADCAST'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
