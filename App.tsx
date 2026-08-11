import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sensor,
  Incident,
  ActiveAsset,
  WaterAnalyticsData,
  WSMessage,
  ThemeMode,
  CityConfig,
  CityRiskIndex,
  AuditTrailEntry
} from './types';
import { Navbar, CITIES } from './components/Navbar';
import { InteractiveMap } from './components/InteractiveMap';
import { AlertDispatchPanel } from './components/AlertDispatchPanel';
import { DroneVisionViewer } from './components/DroneVisionViewer';
import { WaterAnalytics } from './components/WaterAnalytics';
import { ArchitectureSchemaModal } from './components/ArchitectureSchemaModal';
import { TelemetrySimulatorPanel } from './components/TelemetrySimulatorPanel';
import { SmartTrafficRoutingPanel } from './components/SmartTrafficRoutingPanel';
import { SihPitchDeckModal } from './components/SihPitchDeckModal';
import { UrbanAiCopilotModal } from './components/UrbanAiCopilotModal';
import { LidarScanModal } from './components/LidarScanModal';
import { PublicBroadcastModal } from './components/PublicBroadcastModal';
import { HistoricalTimeMachine } from './components/HistoricalTimeMachine';
import { CityRiskIndexStrip } from './components/CityRiskIndexStrip';
import { SimulationEngineModal } from './components/SimulationEngineModal';
import { AuditTrailPanel } from './components/AuditTrailPanel';
import { Activity, ShieldAlert, WifiOff } from 'lucide-react';
import { playSiren, playDispatch, playClick } from './lib/soundEffects';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<CityConfig>(CITIES[0]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [assets, setAssets] = useState<ActiveAsset[]>([]);
  const [waterAnalytics, setWaterAnalytics] = useState<WaterAnalyticsData>({
    current_level_meters: 9.4,
    max_capacity_meters: 12.0,
    level_percentage: 78.4,
    discharge_rate_m3s: 2870.5,
    turbidity_ntu: 48.2,
    ph_level: 7.2,
    flow_speed_ms: 3.8,
    forecast_timeline: []
  });

  const [riskIndex, setRiskIndex] = useState<CityRiskIndex>({
    overallScore: 68,
    level: 'HIGH',
    breakdown: {
      floodRisk: 82,
      trafficRisk: 61,
      structuralRisk: 43,
      weatherRisk: 71,
      contaminationRisk: 28
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditTrailEntry[]>([
    {
      id: 'log-1',
      timestamp: '17:02:14 UTC',
      actor: 'TELEMETRY GATEWAY',
      action: 'INGESTED SENSOR WL-DEL-001',
      details: 'Water basin level recorded at 78.4% capacity (Threshold Warning).',
      severity: 'warning'
    },
    {
      id: 'log-2',
      timestamp: '17:03:00 UTC',
      actor: 'AI CORRELATION ENGINE',
      action: 'MULTI-SENSOR CLUSTER INFERENCE',
      details: 'Correlated 3 hydrometric sensors with upstream cloudburst. Inferred flash flood risk (96% confidence).',
      severity: 'critical'
    },
    {
      id: 'log-3',
      timestamp: '17:03:22 UTC',
      actor: 'DISPATCHER',
      action: 'ASSIGNED ASSET NDRF BATTALION 4',
      details: 'Dispatched heavy rescue taskforce to Yamuna Basin Sector 04.',
      severity: 'dispatch'
    }
  ]);

  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState<boolean>(false);
  const [isCopilotModalOpen, setIsCopilotModalOpen] = useState<boolean>(false);
  const [isLidarModalOpen, setIsLidarModalOpen] = useState<boolean>(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const addAuditLog = (actor: string, action: string, details: string, severity: AuditTrailEntry['severity']) => {
    const newEntry: AuditTrailEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(11, 19) + ' UTC',
      actor,
      action,
      details,
      severity
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Fetch Initial REST Data Snapshot
  const fetchSnapshot = useCallback(async () => {
    try {
      const headers = { 'X-API-Key': 'omni_live_key_9823417a8c' };

      const [incRes, snsRes, astRes, watRes] = await Promise.all([
        fetch('/api/incidents/active', { headers }),
        fetch('/api/sensors', { headers }),
        fetch('/api/assets', { headers }),
        fetch('/api/analytics/water', { headers })
      ]);

      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(incData.incidents || []);
      }
      if (snsRes.ok) {
        const snsData = await snsRes.json();
        setSensors(snsData.sensors || []);
      }
      if (astRes.ok) {
        const astData = await astRes.json();
        setAssets(astData.assets || []);
      }
      if (watRes.ok) {
        const watData = await watRes.json();
        if (watData.data) setWaterAnalytics(watData.data);
      }
    } catch (err) {
      console.warn('[Nexo] Initial snapshot fetch notice:', err);
    }
  }, []);

  // Connect to WebSocket Server
  useEffect(() => {
    fetchSnapshot();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const connectWS = () => {
      console.log('[Nexo] Connecting WebSockets:', wsUrl);
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsConnected(true);
        console.log('[Nexo] WebSocket Connected to Command Server.');
      };

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);

          if (msg.event === 'SYSTEM_STATUS') {
            if (msg.data.sensors) setSensors(msg.data.sensors);
            if (msg.data.active_incidents) setIncidents(msg.data.active_incidents);
            if (msg.data.assets) setAssets(msg.data.assets);
            if (msg.data.water_analytics) setWaterAnalytics(msg.data.water_analytics);
          } else if (msg.event === 'TELEMETRY_UPDATE') {
            const updatedSensor: Sensor = msg.data.sensor;
            if (updatedSensor) {
              setSensors((prev) =>
                prev.map((s) => (s.id === updatedSensor.id ? updatedSensor : s))
              );

              // Update water level analytics if water sensor
              if (updatedSensor.type === 'water_level') {
                setWaterAnalytics((prev) => ({
                  ...prev,
                  current_level_meters: Number((updatedSensor.value * 0.12).toFixed(2)),
                  level_percentage: Number(updatedSensor.value.toFixed(1)),
                  discharge_rate_m3s: Number((1420 + updatedSensor.value * 18.5).toFixed(1))
                }));

                // Dynamically update City Risk Index
                if (updatedSensor.value > 80) {
                  setRiskIndex((r) => ({
                    ...r,
                    overallScore: Math.min(98, Math.round(updatedSensor.value * 1.05)),
                    level: 'CRITICAL',
                    breakdown: { ...r.breakdown, floodRisk: Math.round(updatedSensor.value) }
                  }));
                }
              }
            }
          } else if (msg.event === 'ALERT_TRIGGERED') {
            const newInc: Incident = msg.data;
            if (newInc) {
              setIncidents((prev) => [newInc, ...prev.filter((i) => i.id !== newInc.id)]);
              setBannerAlert(`CRITICAL BREACH: ${newInc.title}`);
              playSiren();
              addAuditLog('AI CORRELATION ENGINE', 'CRITICAL INCIDENT GENERATED', newInc.title, 'critical');
              setTimeout(() => setBannerAlert(null), 8000);
            }
          } else if (msg.event === 'DISPATCH_UPDATED') {
            const { asset, incident } = msg.data;
            if (asset) {
              setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
            }
            if (incident) {
              setIncidents((prev) => prev.map((i) => (i.id === incident.id ? incident : i)));
            }
          } else if (msg.event === 'INCIDENT_RESOLVED') {
            const { incident_id } = msg.data;
            setIncidents((prev) => prev.filter((i) => i.id !== incident_id));
            addAuditLog('OPERATOR', 'INCIDENT RESOLVED', `Incident ${incident_id} closed.`, 'info');
          }
        } catch (err) {
          console.error('[Nexo] WS parse error:', err);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        console.warn('[Nexo] WebSocket disconnected. Retrying in 3s...');
        setTimeout(connectWS, 3000);
      };

      ws.onerror = () => {
        setWsConnected(false);
      };

      wsRef.current = ws;
    };

    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [fetchSnapshot]);

  // Execute NDRF Dispatch
  const handleDispatchAsset = async (assetId: string, incidentId: string) => {
    try {
      playDispatch();
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'omni_live_key_9823417a8c'
        },
        body: JSON.stringify({ asset_id: assetId, incident_id: incidentId })
      });
      if (res.ok) {
        addAuditLog('DISPATCHER', 'DISPATCHED TASKFORCE', `Assigned Asset ${assetId} to Incident ${incidentId}`, 'dispatch');
        fetchSnapshot();
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    }
  };

  // Execute Incident Resolution
  const handleResolveIncident = async (incidentId: string) => {
    try {
      playClick();
      const res = await fetch('/api/incidents/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'omni_live_key_9823417a8c'
        },
        body: JSON.stringify({ incident_id: incidentId })
      });
      if (res.ok) {
        setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  // Trigger Simulated Water Level Surge (>80% breach)
  const handleSimulateSurge = async (levelPercentage: number = 88.5) => {
    setIsSimulating(true);
    addAuditLog('SIMULATOR', 'EXECUTED TELEMETRY SURGE', `Forced water level pulse to ${levelPercentage}%`, 'warning');
    try {
      await fetch('/api/simulate/surge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'omni_live_key_9823417a8c'
        },
        body: JSON.stringify({ value: levelPercentage })
      });
    } catch (err) {
      console.error('Simulate surge error:', err);
    } finally {
      setTimeout(() => setIsSimulating(false), 800);
    }
  };

  // Automated 10-Step Emergency Scenario Sequence
  const handleRunEmergencyScenario = () => {
    playSiren();
    addAuditLog('COMMANDER', 'INITIATED FULL DEMO EMERGENCY SCENARIO', 'Executing automated 10-step disaster management loop.', 'critical');
    
    // Step 1: Heavy rain inception & water surge
    handleSimulateSurge(92.4);

    // Step 2: Open AI Copilot with briefing
    setTimeout(() => {
      setIsCopilotModalOpen(true);
      addAuditLog('AI COPILOT', 'DISASTER INTELLIGENCE INITIALIZED', 'Evaluated Yamuna basin vector layers & population exposure.', 'critical');
    }, 1500);

    // Step 3: Trigger Green Corridor
    setTimeout(() => {
      handleTriggerCorridor('corridor-01');
      addAuditLog('SMART TRAFFIC', 'GREEN CORRIDOR PREEMPTION', 'Preempted 6 traffic signals along Ring Road Expressway.', 'dispatch');
    }, 3500);

    // Step 4: Dispatch NDRF Unit
    setTimeout(() => {
      if (assets.length > 0 && incidents.length > 0) {
        handleDispatchAsset(assets[0].id, incidents[0].id);
      }
    }, 5500);

    // Step 5: Citizen Mass Broadcast Modal
    setTimeout(() => {
      setIsBroadcastModalOpen(true);
      addAuditLog('PUBLIC SAFETY', 'CITIZEN BROADCAST CONSOLE ACTIVE', 'Targeting 142,500 residents for Cell Broadcast SMS alert.', 'warning');
    }, 7500);
  };

  // Reset sensors to normal safe levels
  const handleResetSensors = async () => {
    try {
      addAuditLog('OPERATOR', 'RESET SENSOR BASELINE', 'Restored water sensor to safe 45% level.', 'info');
      await fetch('/api/ingest/telemetry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'omni_live_key_9823417a8c'
        },
        body: JSON.stringify({
          sensor_id: 'sns_water_01',
          sensor_type: 'water_level',
          value: 45.0,
          unit: '%'
        })
      });
      setRiskIndex((r) => ({ ...r, overallScore: 32, level: 'LOW', breakdown: { ...r.breakdown, floodRisk: 35 } }));
    } catch (err) {
      console.error('Reset sensors error:', err);
    }
  };

  const handleTriggerCorridor = (corridorId: string) => {
    playDispatch();
    setBannerAlert(
      `AI TRAFFIC PREEMPTION: Green Corridor (${corridorId}) signal timings re-synchronized with active emergency dispatch.`
    );
  };

  const activeDrone = assets.find((a) => a.type === 'drone') || assets[0];

  const isLightTheme = themeMode === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950 bg-futuristic-grid ${
        isLightTheme ? 'bg-slate-100 text-slate-900' : 'bg-[#060911] text-slate-100'
      }`}
    >
      {/* Ambient Sci-Fi Glow Orbs */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="pointer-events-none fixed bottom-10 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-blue-600/10 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none fixed top-1/2 right-10 w-[400px] h-[400px] bg-rose-500/5 dark:bg-amber-500/5 rounded-full blur-[100px] -z-10" />

      {/* Navbar Header */}
      <Navbar
        wsConnected={wsConnected}
        activeAlertsCount={incidents.filter((i) => i.status !== 'resolved').length}
        selectedCity={selectedCity}
        onSelectCity={(city) => {
          setSelectedCity(city);
          addAuditLog('COMMANDER', 'SWITCHED CITY TENANT', `Activated command view for ${city.name} (${city.basinName}).`, 'info');
        }}
        onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
        onOpenPitchDeckModal={() => setIsPitchDeckModalOpen(true)}
        onOpenCopilotModal={() => setIsCopilotModalOpen(true)}
        onOpenLidarModal={() => setIsLidarModalOpen(true)}
        onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
        onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
        onRunEmergencyScenario={handleRunEmergencyScenario}
        onTriggerSurgeSim={() => handleSimulateSurge(88.5)}
        isSimulating={isSimulating}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode((m) => (m === 'dark' ? 'light' : 'dark'))}
      />

      {/* Critical Emergency Banner Notice */}
      {bannerAlert && (
        <div className="bg-red-600 text-white font-mono text-xs py-2 px-4 flex items-center justify-between font-bold animate-pulse shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{bannerAlert}</span>
          </div>
          <button
            onClick={() => setBannerAlert(null)}
            className="text-white hover:text-slate-200 text-xs underline cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Main Command Dashboard Grid Layout */}
      <main className="flex-1 p-3 sm:p-4 space-y-3.5 max-w-[1800px] mx-auto w-full">
        {/* City Risk Index Header Strip */}
        <CityRiskIndexStrip
          riskIndex={riskIndex}
          activeIncidentsCount={incidents.filter((i) => i.status !== 'resolved').length}
          sensorsOnlineCount={selectedCity.activeSensorsCount}
          assetsActiveCount={selectedCity.activeAssetsCount}
          isLightTheme={isLightTheme}
        />

        {/* Simulator Control Bar */}
        <TelemetrySimulatorPanel
          onSimulateSurge={handleSimulateSurge}
          onResetSensors={handleResetSensors}
          isLightTheme={isLightTheme}
        />

        {/* Master Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Left Column: Interactive Map Core (8 Cols on large displays) */}
          <div className="lg:col-span-8 flex flex-col gap-3.5 min-h-[520px]">
            {/* Interactive Spatial Map */}
            <div className="h-[480px] sm:h-[560px] w-full">
              <InteractiveMap
                sensors={sensors}
                incidents={incidents}
                assets={assets}
                onSelectIncident={() => {}}
                onDispatchAsset={handleDispatchAsset}
                isLightTheme={isLightTheme}
              />
            </div>

            {/* Predictive Time Machine Slider */}
            <HistoricalTimeMachine isLightTheme={isLightTheme} />

            {/* Audit Trail & Event Logs Panel */}
            <AuditTrailPanel logs={auditLogs} isLightTheme={isLightTheme} />

            {/* Water Analytics & Smart Traffic Routing dual row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
              <WaterAnalytics analytics={waterAnalytics} isLightTheme={isLightTheme} />
              <SmartTrafficRoutingPanel
                assets={assets}
                incidents={incidents}
                onTriggerCorridor={handleTriggerCorridor}
                isLightTheme={isLightTheme}
              />
            </div>
          </div>

          {/* Right Column: Alert Feed & Drone AI Vision (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {/* Component 2: Alert & Dispatch Panel */}
            <div className="h-[380px]">
              <AlertDispatchPanel
                incidents={incidents}
                assets={assets}
                onDispatch={handleDispatchAsset}
                onResolve={handleResolveIncident}
                isLightTheme={isLightTheme}
              />
            </div>

            {/* Component 3: Drone Vision Viewer with AI overlays */}
            <div className="h-[380px]">
              <DroneVisionViewer droneAsset={activeDrone} isLightTheme={isLightTheme} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Bar */}
      <footer
        className={`border-t px-4 py-2.5 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 transition-colors ${
          isLightTheme
            ? 'bg-white border-slate-200 text-slate-600'
            : 'bg-slate-950 border-slate-800/80 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-500" />
          <span>NEXO URBAN DIGITAL TWIN • DISASTER INTELLIGENCE & COMMAND CENTER</span>
        </div>
        <div>
          API ENDPOINT: <code className="text-cyan-600 dark:text-cyan-400 font-bold">/api/ingest/telemetry</code> | WEBSOCKET: <code className="text-emerald-600 dark:text-emerald-400 font-bold">ws://0.0.0.0:3000/ws</code>
        </div>
      </footer>

      {/* Digital Twin Simulation Engine What-If Modeler Modal */}
      <SimulationEngineModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        onApplySimulationToTwin={(cfg) => {
          setIsSimulationModalOpen(false);
          handleSimulateSurge(cfg.rainfallMmHr);
        }}
        isLightTheme={isLightTheme}
      />

      {/* Database & Architecture Schema Inspector Modal */}
      <ArchitectureSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      {/* Smart India Hackathon (SIH) Pitch Deck Presentation Modal */}
      <SihPitchDeckModal
        isOpen={isPitchDeckModalOpen}
        onClose={() => setIsPitchDeckModalOpen(false)}
      />

      {/* OmniMind AI Copilot Disaster Assistant Modal */}
      <UrbanAiCopilotModal
        isOpen={isCopilotModalOpen}
        onClose={() => setIsCopilotModalOpen(false)}
        onDispatchAction={(action) => {
          setIsCopilotModalOpen(false);
          if (action === 'CORRIDOR') {
            handleTriggerCorridor('corridor-01');
          } else if (action === 'BROADCAST') {
            setIsBroadcastModalOpen(true);
          } else if (action === 'DISPATCH' && incidents.length > 0 && assets.length > 0) {
            handleDispatchAsset(assets[0].id, incidents[0].id);
          }
        }}
        isLightTheme={isLightTheme}
      />

      {/* 3D Structural LiDAR FEA Modal */}
      <LidarScanModal
        isOpen={isLidarModalOpen}
        onClose={() => setIsLidarModalOpen(false)}
        isLightTheme={isLightTheme}
      />

      {/* Mass Citizen Broadcast Console Modal */}
      <PublicBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        isLightTheme={isLightTheme}
      />
    </div>
  );
}

