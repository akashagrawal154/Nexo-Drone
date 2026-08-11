import React, { useState } from 'react';
import { TIMESCALEDB_TELEMETRY_SCHEMA_SQL, MONGO_SERIES_COLLECTION_SCHEMA } from '../db/timescale-mongo-schema';
import {
  Database,
  X,
  Copy,
  Check,
  FolderTree,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Server,
  FileCode
} from 'lucide-react';

interface ArchitectureSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureSchemaModal: React.FC<ArchitectureSchemaModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'nosql' | 'monorepo' | 'apis'>('sql');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const postgresSqlSchema = `-- ====================================================================
-- OmniTwin: Urban Digital Twin PostgreSQL + PostGIS Schema Definition
-- Integrated Disaster and Infrastructure Management Database
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ACCESS CONTROL TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator',
    department VARCHAR(100) DEFAULT 'Disaster Response',
    api_key VARCHAR(128) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SENSORS TABLE (IoT Infrastructure Water Level, Cameras, Structural Sensors)
CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL, -- GIS spatial Point (WGS84)
    address TEXT,
    district VARCHAR(100),
    current_status VARCHAR(20) DEFAULT 'normal',
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_value NUMERIC(10, 2),
    unit VARCHAR(20),
    threshold_warning NUMERIC(10, 2) NOT NULL,
    threshold_critical NUMERIC(10, 2) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sensors_spatial ON sensors USING GIST (location);

-- 3. INCIDENTS / ALERTS TABLE
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5),
    type VARCHAR(50) NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    affected_radius_meters NUMERIC(10, 2) DEFAULT 100.0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'active',
    triggered_by_sensor_id VARCHAR(64) REFERENCES sensors(id),
    assigned_asset_id VARCHAR(64),
    recommended_action TEXT
);

CREATE INDEX IF NOT EXISTS idx_incidents_spatial ON incidents USING GIST (coordinates);

-- 4. ACTIVE ASSETS TABLE (Drones & NDRF Rescue Teams)
CREATE TABLE IF NOT EXISTS active_assets (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    current_location GEOMETRY(Point, 4326) NOT NULL,
    assigned_incident_id VARCHAR(64) REFERENCES incidents(id),
    battery_pct INTEGER CHECK (battery_pct BETWEEN 0 AND 100),
    status VARCHAR(30) DEFAULT 'idle',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const monorepoTree = `omnitwin-digitaltwin/
├── server.ts                       # Express Backend + WebSockets (/ws) on Port 3000
├── package.json                    # Full-Stack Dependencies & Scripts (tsx + esbuild)
├── metadata.json                   # App Capabilities & Name Metadata
├── tsconfig.json                   # TypeScript Compiler Specs
├── src/
│   ├── main.tsx                    # React Entry point
│   ├── App.tsx                     # Command Center Master Dashboard Layout
│   ├── index.css                   # Custom Command Center & Leaflet CSS
│   ├── types.ts                    # TypeScript Data Models (Sensors, Incidents, Assets)
│   ├── db/
│   │   ├── schema.sql              # PostgreSQL + PostGIS Spatial Schema DDL
│   │   └── timescale-mongo-schema.ts # TimescaleDB Hypertables & MongoDB Schemas
│   ├── server/
│   │   ├── authMiddleware.ts       # API Key & Bearer Token Security Middleware
│   │   └── telemetryEngine.ts      # Telemetry Ingestion, Anomaly Engine & WS Broadcasting
│   └── components/
│       ├── Navbar.tsx              # Command Center Header & Telemetry Indicators
│       ├── InteractiveMap.tsx      # GIS Spatial Map with Layer Controls (Leaflet)
│       ├── AlertDispatchPanel.tsx  # Emergency Feed & NDRF Single-Click Dispatch
│       ├── DroneVisionViewer.tsx   # Live Synthetic Camera Feed & AI Bounding Overlays
│       ├── WaterAnalytics.tsx      # Water Level Gauge & 24hr Flood Forecast Chart
│       └── ArchitectureSchemaModal.tsx # Full System Schema Inspector
`;

  const apiDocs = `====================================================================
OmniTwin Core REST API & WebSocket Protocol Reference
====================================================================

SECURITY & AUTHENTICATION:
Header Required: X-API-Key: omni_live_key_9823417a8c
OR Authorization: Bearer omni_bearer_token_demo

1. POST /api/ingest/telemetry
High-Throughput Endpoint for Water Sensor & Drone Telemetry
Payload:
{
  "sensor_id": "sns_water_01",
  "sensor_type": "water_level",
  "value": 88.5,
  "unit": "%",
  "timestamp": "2026-08-11T09:45:00Z"
}
Response:
{
  "success": true,
  "sensor_status": "critical",
  "incident_triggered": true,
  "incident_id": "inc_surge_1042"
}

2. GET /api/incidents/active
Fetches all active emergency incidents.

3. GET /api/sensors
Returns real-time status of all urban sensors.

4. POST /api/dispatch
Dispatches an NDRF Rescue Unit or Drone to an incident.
Payload:
{
  "asset_id": "asset_ndrf_01",
  "incident_id": "inc_001"
}

5. WEBSOCKET PROTOCOL (ws://<host>:3000/ws)
Pushes real-time alerts & telemetry streams:
Events: 'TELEMETRY_UPDATE' | 'ALERT_TRIGGERED' | 'DISPATCH_UPDATED' | 'INCIDENT_RESOLVED'
`;

  const getCurrentText = () => {
    if (activeTab === 'sql') return postgresSqlSchema;
    if (activeTab === 'nosql') return TIMESCALEDB_TELEMETRY_SCHEMA_SQL + '\n\n' + JSON.stringify(MONGO_SERIES_COLLECTION_SCHEMA, null, 2);
    if (activeTab === 'monorepo') return monorepoTree;
    return apiDocs;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-slate-100 uppercase">
                OMNITWIN SYSTEM ARCHITECTURE & DATABASE SCHEMAS
              </h2>
              <p className="text-[11px] text-slate-400">PostgreSQL/PostGIS, TimescaleDB, Express + WebSockets Monorepo Stack</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="px-4 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-2 border-b-2 font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> POSTGRESQL + POSTGIS (SQL)
          </button>

          <button
            onClick={() => setActiveTab('nosql')}
            className={`px-3 py-2 border-b-2 font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nosql'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> TIMESCALEDB & MONGO (NOSQL)
          </button>

          <button
            onClick={() => setActiveTab('monorepo')}
            className={`px-3 py-2 border-b-2 font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'monorepo'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" /> MONOREPO FOLDER LAYOUT
          </button>

          <button
            onClick={() => setActiveTab('apis')}
            className={`px-3 py-2 border-b-2 font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'apis'
                ? 'border-cyan-400 text-cyan-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> REST APIs & WEBSOCKET PROTOCOL
          </button>
        </div>

        {/* Code Content Container */}
        <div className="relative flex-1 p-4 bg-slate-950 overflow-y-auto">
          <button
            onClick={handleCopy}
            className="absolute top-6 right-6 p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-md z-10"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" /> COPY CODE
              </>
            )}
          </button>

          <pre className="text-xs font-mono text-cyan-300/90 leading-relaxed overflow-x-auto selection:bg-cyan-500 selection:text-slate-950 p-2">
            <code>{getCurrentText()}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>OMNITWIN ENTERPRISE ARCHITECTURE — HIGH-FREQUENCY TELEMETRY READY</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
