export type SensorType = 'water_level' | 'traffic_cam' | 'structural_health' | 'seismic' | 'air_quality' | 'water_quality' | 'weather';

export type SensorStatus = 'normal' | 'warning' | 'critical' | 'offline';

export interface SensorLocation {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
}

export interface Sensor {
  id: string;
  device_code?: string;
  name: string;
  type: SensorType;
  location: SensorLocation;
  current_status: SensorStatus;
  last_ping: string;
  value: number;
  unit: string;
  threshold_warning: number;
  threshold_critical: number;
  battery_pct?: number;
  historical_values?: { timestamp: string; value: number }[];
}

export type IncidentSeverity = 1 | 2 | 3 | 4 | 5;

export type IncidentType = 'flood' | 'structural_damage' | 'traffic_gridlock' | 'landslide' | 'bridge_stress' | 'water_contamination';

export type IncidentStatus = 'active' | 'investigating' | 'dispatched' | 'resolved';

export interface ImpactAnalysis {
  affectedPopulation: number;
  affectedRoadsCount: number;
  affectedBuildingsCount: number;
  hospitalsInZone: string[];
  schoolsInZone: string[];
  powerStationsCount: number;
  evacuationRoutesCount: number;
  criticalInfrastructureIds: string[];
}

export interface AICorrelation {
  confidenceScore: number;
  rootCause: string;
  triggeringSensors: string[];
  eventClusterSummary: string;
  severityReasoning: string;
  recommendedAssetTypes: AssetType[];
  impactAnalysis: ImpactAnalysis;
}

export interface Incident {
  id: string;
  incident_code?: string;
  title: string;
  description: string;
  severity_level: IncidentSeverity;
  type: IncidentType;
  coordinates: {
    lat: number;
    lng: number;
  };
  affected_radius: number; // in meters
  timestamp: string;
  status: IncidentStatus;
  triggered_by_sensor_id?: string;
  assigned_asset_id?: string;
  recommended_action?: string;
  ai_correlation?: AICorrelation;
}

export type AssetType = 'drone' | 'ndrf_team' | 'fire_boat' | 'evacuation_vehicle' | 'ambulance' | 'police_unit';

export type AssetStatus = 'idle' | 'en_route' | 'on_site' | 'maintenance' | 'refueling';

export interface ActiveAsset {
  id: string;
  asset_code?: string;
  name: string;
  type: AssetType;
  current_location: {
    lat: number;
    lng: number;
  };
  assigned_incident_id?: string | null;
  battery_pct: number; // 0 - 100
  status: AssetStatus;
  heading?: number;
  speed_kmh?: number;
  crew_count?: number;
  operator_name?: string;
  eta_minutes?: number;
  distance_km?: number;
  capability_match_pct?: number;
}

export interface TelemetryPayload {
  sensor_id: string;
  sensor_type: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
  battery_level?: number;
}

export interface DroneTelemetryPayload {
  drone_id: string;
  location: {
    lat: number;
    lng: number;
    altitude_m: number;
  };
  battery_pct: number;
  speed_m_s: number;
  camera_angle_deg: number;
  ai_detections: {
    id: string;
    label: string;
    confidence: number;
    bounding_box: [number, number, number, number]; // [x, y, width, height] in percentages
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export interface WaterAnalyticsData {
  current_level_meters: number;
  max_capacity_meters: number;
  level_percentage: number;
  discharge_rate_m3s: number;
  turbidity_ntu: number;
  ph_level: number;
  flow_speed_ms: number;
  forecast_timeline: {
    time: string;
    predicted_level: number;
    rainfall_mm: number;
    risk_level: 'safe' | 'moderate' | 'high' | 'severe';
  }[];
}

export interface WSMessage {
  event: 'TELEMETRY_UPDATE' | 'ALERT_TRIGGERED' | 'DISPATCH_UPDATED' | 'INCIDENT_RESOLVED' | 'SYSTEM_STATUS' | 'SIMULATION_UPDATE' | 'SCENARIO_STARTED';
  data: any;
  timestamp: string;
}

export interface EmergencyCorridor {
  id: string;
  name: string;
  asset_id: string;
  incident_id: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  waypoints: [number, number][];
  distance_km: number;
  eta_minutes: number;
  time_saved_minutes: number;
  signals_cleared: number;
  civilian_diversion_route: [number, number][];
  status: 'active' | 'clearing' | 'standby';
}

export type ThemeMode = 'light' | 'dark';

export interface MapLayerConfig {
  structuralHealth: boolean;
  waterFlow: boolean;
  liveTraffic: boolean;
  sensors: boolean;
  incidents: boolean;
  assets: boolean;
  droneTrajectories: boolean;
  emergencyCorridors: boolean;
  civilianDiversions: boolean;
}

export interface CityConfig {
  id: string;
  name: string;
  basinName: string;
  center: { lat: number; lng: number };
  zoom: number;
  population: number;
  activeSensorsCount: number;
  activeAssetsCount: number;
}

export interface CityRiskIndex {
  overallScore: number; // 0 - 100
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: {
    floodRisk: number;
    trafficRisk: number;
    structuralRisk: number;
    weatherRisk: number;
    contaminationRisk: number;
  };
}

export interface SimulationConfig {
  rainfallMmHr: number;
  riverLevelRiseMeters: number;
  drainageCapacityPct: number;
  gateReleaseM3s: number;
}

export interface SimulationResults {
  predictedFloodInundationKm2: number;
  estimatedAffectedPopulation: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threatenedInfrastructure: string[];
  recommendedDefenses: string[];
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  actor: string; // e.g. "COMMANDER", "AI CORRELATION ENGINE", "TELEMETRY GATEWAY"
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical' | 'dispatch';
}


