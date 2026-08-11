import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Presentation,
  CheckCircle2,
  Users,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  ArrowRight,
  Building,
  Radio,
  FileText,
  Award
} from 'lucide-react';

interface SihPitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLightTheme?: boolean;
}

export const SihPitchDeckModal: React.FC<SihPitchDeckModalProps> = ({
  isOpen,
  onClose,
  isLightTheme = false
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const totalSlides = 9;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div
        className={`w-full max-w-5xl h-[88vh] max-h-[780px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isLightTheme
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Pitch Deck Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <Presentation className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono uppercase tracking-tight">
                  SIH EXECUTIVE PITCH DECK
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  SLIDE {currentSlide} OF {totalSlides}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Presentation — Smart India Hackathon (SIH) Open Innovation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Use <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">←</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">→</kbd> to navigate
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body Canvas */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto flex flex-col justify-center relative">
          {/* SLIDE 1: Title Slide */}
          {currentSlide === 1 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto py-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4" /> SMART INDIA HACKATHON
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-mono uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OmniTwin
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                AI-Driven Urban Digital Twin for Integrated Disaster & Infrastructure Management
              </p>
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                <div>
                  PRESENTED BY: <strong className="text-cyan-500 font-bold">Team Digital Twin Pioneers</strong>
                </div>
                <span className="hidden sm:inline">•</span>
                <div>SIH Open Innovation Category</div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Team Members */}
          {currentSlide === 2 && (
            <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn w-full">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Users className="w-6 h-6 text-cyan-500" />
                <h2 className="text-xl font-bold font-mono uppercase">Slide 2: Team Members</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                  <div className="font-bold text-cyan-500 text-sm">Dhruv Sharma</div>
                  <div className="text-slate-500 dark:text-slate-400">AI/ML & Backend Architecture</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                    Designed high-throughput telemetry ingestion & WebSocket broadcast engine.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                  <div className="font-bold text-blue-500 text-sm">Frontend & UI/UX Lead</div>
                  <div className="text-slate-500 dark:text-slate-400">Command Center Design</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                    Crafted responsive Leaflet GIS twin & emergency dispatch interfaces.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                  <div className="font-bold text-indigo-500 text-sm">Backend Systems Lead</div>
                  <div className="text-slate-500 dark:text-slate-400">REST APIs & GIS Processing</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                    Integrated PostGIS spatial queries and Express server logic.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
                  <div className="font-bold text-amber-500 text-sm">Drone Telemetry Specialist</div>
                  <div className="text-slate-500 dark:text-slate-400">Computer Vision & YOLO</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                    Engineered drone stream bounding box overlays & micro-crack detection.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2 sm:col-span-2 md:col-span-1">
                  <div className="font-bold text-emerald-500 text-sm">Data Integration / IoT</div>
                  <div className="text-slate-500 dark:text-slate-400">TimescaleDB & Water Analytics</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                    Developed 24hr flood forecasting time-series forecasting pipelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Problem Statement */}
          {currentSlide === 3 && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-bold font-mono uppercase">Slide 3: Problem Statement</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-300 font-medium leading-relaxed text-sm">
                  <strong>PROBLEM TITLE:</strong> AI-Driven Urban Digital Twin for Integrated Disaster & Infrastructure Management
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h3 className="font-bold text-cyan-500 font-mono text-sm uppercase">What it solves</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Eliminates the "silo effect" in city governance. Currently, traffic, flood telemetry, and structural integrity operate in isolated pipelines, causing critical delays during urban crises.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h3 className="font-bold text-amber-500 font-mono text-sm uppercase">Why we chose this</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Solving a single issue isn't enough. We tackled the technical challenge of unifying drone vision, water IoT, and AI traffic routing into a single proactive ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Real-World Problem Alignment */}
          {currentSlide === 4 && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Building className="w-6 h-6 text-amber-500" />
                <h2 className="text-xl font-bold font-mono uppercase">Slide 4: Real-World Alignment</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-amber-500 font-bold">WHO FACES THIS ISSUE?</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Municipal authorities, disaster response teams (NDRF/SDRF), urban planners, and citizens impacted by flash floods or bridge structural failures.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-cyan-500 font-bold">SYSTEM GAP</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Fragmented reactive management where emergency forces are notified after floods peak or bridges develop severe stress.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 md:col-span-2 space-y-1.5 bg-emerald-500/5 border-emerald-500/20">
                  <span className="text-emerald-500 font-bold">NATIONAL SCHEME ALIGNMENT</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    Directly advances the <strong>Smart Cities Mission</strong>, <strong>Digital India</strong>, and <strong>National Disaster Management Authority (NDMA)</strong> frameworks by digitizing urban response pipelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Proposed Solution */}
          {currentSlide === 5 && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Zap className="w-6 h-6 text-cyan-500" />
                <h2 className="text-xl font-bold font-mono uppercase">Slide 5: Proposed Solution</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-cyan-500 font-bold">1. AUTOMATED STRUCTURAL MONITORING</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    Autonomous AI drones inspecting bridges & roads with computer vision crack overlays.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-blue-500 font-bold">2. PREDICTIVE WATER INTELLIGENCE</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    24-hour flood forecasting charts & IoT spillway surge detection (&gt;80% critical thresholds).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-amber-500 font-bold">3. DYNAMIC EMERGENCY ROUTING</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    AI traffic preemption opening "Green Corridors" for NDRF units while diverting civilian vehicles.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-emerald-500 font-bold">4. UNIFIED COMMAND DASHBOARD</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    Single-screen GIS Digital Twin providing city commanders real-time situational awareness.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: Tech Stack & Architecture */}
          {currentSlide === 6 && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Cpu className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-bold font-mono uppercase">Slide 6: Tech Stack</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-500">FRONTEND</div>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• React 18 & TypeScript</li>
                    <li>• Tailwind CSS & Lucide</li>
                    <li>• Leaflet & Mapbox GIS</li>
                    <li>• Recharts Data Viz</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-amber-500">BACKEND & AI</div>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Express + WebSockets (3000)</li>
                    <li>• Python FastAPI (YOLO/CV)</li>
                    <li>• PostgreSQL + PostGIS</li>
                    <li>• TimescaleDB Hypertables</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-500">DEPLOYMENT</div>
                  <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                    <li>• Cloud Run Containers</li>
                    <li>• Edge WebSockets Proxy</li>
                    <li>• Real-Time Ingestion API</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: Architecture Flow Diagram */}
          {currentSlide === 7 && (
            <div className="space-y-5 max-w-4xl mx-auto animate-fadeIn">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Layers className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-bold font-mono uppercase">Slide 7: Architecture Flow</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center font-mono text-xs">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-300 space-y-2">
                  <div className="font-bold uppercase text-sm">1. DATA SOURCES</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    IoT Water Sensors • Drone Video Streams • Live Traffic Cameras
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 space-y-2">
                  <div className="font-bold uppercase text-sm">2. AI & PROCESSING</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Anomaly Detection • YOLO Bounding Box • PostGIS Spatial Engine
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-300 space-y-2">
                  <div className="font-bold uppercase text-sm">3. ACTIONABLE COMMAND</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Web Twin Map • Single-Click NDRF Dispatch • Green Corridors
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8 & 9: Thank You */}
          {currentSlide >= 8 && (
            <div className="space-y-6 text-center max-w-2xl mx-auto py-8 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black font-mono uppercase tracking-tight text-emerald-500">
                THANK YOU
              </h2>
              <p className="text-lg font-bold font-mono text-slate-600 dark:text-slate-300">
                Project OmniTwin — Ready to redefine urban resilience.
              </p>
              <div className="pt-4 text-xs font-mono text-slate-500">
                Open for Q&A and Evaluator Interactive Live Demo
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/80 font-mono text-xs">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> PREVIOUS
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                  currentSlide === idx + 1
                    ? 'bg-cyan-500 scale-125'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
            disabled={currentSlide === totalSlides}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold disabled:opacity-40 cursor-pointer"
          >
            NEXT <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
