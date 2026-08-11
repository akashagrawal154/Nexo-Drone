-- ====================================================================
-- OmniTwin: Urban Digital Twin PostgreSQL + PostGIS Schema Definition
-- Integrated Disaster and Infrastructure Management Database
-- ====================================================================

-- Enable PostGIS spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ACCESS CONTROL TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'operator', -- 'admin', 'commander', 'operator', 'field_agent'
    department VARCHAR(100) DEFAULT 'Disaster Response',
    api_key VARCHAR(128) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. SENSORS TABLE (IoT Infrastructure Water Level, Cameras, Structural Sensors)
CREATE TABLE IF NOT EXISTS sensors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'water_level', 'traffic_cam', 'structural_health', 'seismic'
    location GEOMETRY(Point, 4326) NOT NULL, -- Spatial GIS point (WGS84 lat/lng)
    address TEXT,
    district VARCHAR(100),
    current_status VARCHAR(20) DEFAULT 'normal', -- 'normal', 'warning', 'critical', 'offline'
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_value NUMERIC(10, 2),
    unit VARCHAR(20),
    threshold_warning NUMERIC(10, 2) NOT NULL,
    threshold_critical NUMERIC(10, 2) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create spatial index for high-performance proximity queries on sensors
CREATE INDEX IF NOT EXISTS idx_sensors_spatial ON sensors USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_sensors_status ON sensors (current_status);

-- 3. INCIDENTS / ALERTS TABLE (Emergency & Structural Risk Records)
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    severity_level INTEGER CHECK (severity_level BETWEEN 1 AND 5),
    type VARCHAR(50) NOT NULL, -- 'flood', 'structural_damage', 'traffic_gridlock', 'landslide'
    coordinates GEOMETRY(Point, 4326) NOT NULL, -- GIS center coordinates
    affected_radius_meters NUMERIC(10, 2) DEFAULT 100.0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'active', -- 'active', 'investigating', 'dispatched', 'resolved'
    triggered_by_sensor_id VARCHAR(64) REFERENCES sensors(id) ON DELETE SET NULL,
    assigned_asset_id VARCHAR(64),
    recommended_action TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_incidents_spatial ON incidents USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents (status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents (severity_level DESC);

-- 4. ACTIVE ASSETS TABLE (Drones, NDRF Rescue Teams, Emergency Vehicles)
CREATE TABLE IF NOT EXISTS active_assets (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'drone', 'ndrf_team', 'fire_boat', 'evacuation_vehicle'
    current_location GEOMETRY(Point, 4326) NOT NULL,
    assigned_incident_id VARCHAR(64) REFERENCES incidents(id) ON DELETE SET NULL,
    battery_pct INTEGER CHECK (battery_pct BETWEEN 0 AND 100),
    status VARCHAR(30) DEFAULT 'idle', -- 'idle', 'en_route', 'on_site', 'maintenance'
    heading NUMERIC(5, 2), -- 0 - 360 degrees
    speed_kmh NUMERIC(5, 2) DEFAULT 0.0,
    crew_count INTEGER DEFAULT 1,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_spatial ON active_assets USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_assets_status ON active_assets (status);

-- 5. INCIDENT AUDIT LOGS & DISPATCH HISTORY TABLE
CREATE TABLE IF NOT EXISTS dispatch_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id VARCHAR(64) NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    asset_id VARCHAR(64) NOT NULL REFERENCES active_assets(id) ON DELETE CASCADE,
    dispatched_by UUID REFERENCES users(id),
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    dispatch_status VARCHAR(50) DEFAULT 'initiated'
);

-- FUNCTION & TRIGGER: Auto-update last_updated column
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_assets_timestamp
    BEFORE UPDATE ON active_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
