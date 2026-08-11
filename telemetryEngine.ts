import {
  Sensor,
  Incident,
  ActiveAsset,
  TelemetryPayload,
  DroneTelemetryPayload,
  WaterAnalyticsData,
  WSMessage
} from '../types';
import { WebSocket } from 'ws';

// Connected WebSocket clients registry
export const wsClients: Set<WebSocket> = new Set();

export function broadcastWSMessage(msg: WSMessage) {
  const json = JSON.stringify(msg);
  wsClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// Initial Mock Data Store representing a major metropolitan coastal river/infrastructure zone
export const sensorsStore: Map<string, Sensor> = new Map([
  [
    'sns_water_01',
    {
      id: 'sns_water_01',
      name: 'North River Spree Basin Gauge',
      type: 'water_level',
      location: { lat: 28.6139, lng: 77.209, address: 'Yamuna Riverbank Sector 4', district: 'North Metro' },
      current_status: 'warning',
      last_ping: new Date().toISOString(),
      value: 78.4,
      unit: '%',
      threshold_warning: 70,
      threshold_critical: 85,
      historical_values: Array.from({ length: 12 }, (_, i) => ({
        timestamp: new Date(Date.now() - (12 - i) * 3600 * 1000).toISOString(),
        value: 55 + Math.sin(i / 2) * 20 + Math.random() * 5
      }))
    }
  ],
  [
    'sns_water_02',
    {
      id: 'sns_water_02',
      name: 'Central Canal Lock #3 Surge Sensor',
      type: 'water_level',
      location: { lat: 28.628, lng: 77.218, address: 'Central Drainage Lock 3', district: 'Central District' },
      current_status: 'normal',
      last_ping: new Date().toISOString(),
      value: 42.1,
      unit: '%',
      threshold_warning: 70,
      threshold_critical: 85,
      historical_values: Array.from({ length: 12 }, (_, i) => ({
        timestamp: new Date(Date.now() - (12 - i) * 3600 * 1000).toISOString(),
        value: 40 + Math.random() * 4
      }))
    }
  ],
  [
    'sns_struct_01',
    {
      id: 'sns_struct_01',
      name: 'Victoria Flyover Bridge Strain Sensor',
      type: 'structural_health',
      location: { lat: 28.605, lng: 77.225, address: 'Victoria Overpass Span 12', district: 'East Transit' },
      current_status: 'critical',
      last_ping: new Date().toISOString(),
      value: 88.2,
      unit: 'kPa',
      threshold_warning: 75,
      threshold_critical: 85
    }
  ],
  [
    'sns_traffic_01',
    {
      id: 'sns_traffic_01',
      name: 'Ring Road Junction AI Traffic Cam',
      type: 'traffic_cam',
      location: { lat: 28.618, lng: 77.198, address: 'Ring Road Expressway KM 14', district: 'West Arterial' },
      current_status: 'warning',
      last_ping: new Date().toISOString(),
      value: 89,
      unit: 'vehicles/min',
      threshold_warning: 80,
      threshold_critical: 120
    }
  ]
]);

export const incidentsStore: Map<string, Incident> = new Map([
  [
    'inc_001',
    {
      id: 'inc_001',
      title: 'Yamuna Flash Flood Warning - Spillway Overflow',
      description: 'Water level breached 78% capacity at North Basin. Rapid surface runoff detected upstream.',
      severity_level: 4,
      type: 'flood',
      coordinates: { lat: 28.6139, lng: 77.209 },
      affected_radius: 850,
      timestamp: new Date(Date.now() - 1800 * 1000).toISOString(),
      status: 'active',
      triggered_by_sensor_id: 'sns_water_01',
      recommended_action: 'Deploy NDRF Flood Unit 01. Activate spillway gates 2 & 3. Evacuate low-lying banks.'
    }
  ],
  [
    'inc_002',
    {
      id: 'inc_002',
      title: 'Victoria Bridge Structural Micro-Crack Detection',
      description: 'AI Drone Alpha-1 acoustic & thermal analysis confirmed 14mm tensile strain micro-fracture on Pillar B.',
      severity_level: 5,
      type: 'structural_damage',
      coordinates: { lat: 28.605, lng: 77.225 },
      affected_radius: 350,
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
      status: 'investigating',
      triggered_by_sensor_id: 'sns_struct_01',
      assigned_asset_id: 'asset_drone_01',
      recommended_action: 'Halt heavy vehicular freight across Victoria Flyover. Dispatch structural engineering audit squad.'
    }
  ]
]);

export const assetsStore: Map<string, ActiveAsset> = new Map([
  [
    'asset_drone_01',
    {
      id: 'asset_drone_01',
      name: 'Autonomous Vision Drone Alpha-1',
      type: 'drone',
      current_location: { lat: 28.606, lng: 77.224 },
      assigned_incident_id: 'inc_002',
      battery_pct: 78,
      status: 'on_site',
      heading: 142,
      speed_kmh: 32,
      crew_count: 0
    }
  ],
  [
    'asset_ndrf_01',
    {
      id: 'asset_ndrf_01',
      name: 'NDRF Rescue Taskforce Battalion 4',
      type: 'ndrf_team',
      current_location: { lat: 28.625, lng: 77.202 },
      assigned_incident_id: null,
      battery_pct: 95,
      status: 'idle',
      heading: 0,
      speed_kmh: 0,
      crew_count: 24
    }
  ],
  [
    'asset_ndrf_02',
    {
      id: 'asset_ndrf_02',
      name: 'NDRF Heavy Flood Rescue Craft 02',
      type: 'fire_boat',
      current_location: { lat: 28.618, lng: 77.212 },
      assigned_incident_id: 'inc_001',
      battery_pct: 88,
      status: 'en_route',
      heading: 85,
      speed_kmh: 42,
      crew_count: 8
    }
  ]
]);

export function getWaterAnalytics(): WaterAnalyticsData {
  const waterSensor = sensorsStore.get('sns_water_01');
  const currentVal = waterSensor ? waterSensor.value : 78.4;
  const maxCap = 100.0;
  
  const timeline = [
    { time: '06:00', predicted_level: 52.1, rainfall_mm: 12, risk_level: 'safe' as const },
    { time: '09:00', predicted_level: 61.4, rainfall_mm: 28, risk_level: 'safe' as const },
    { time: '12:00', predicted_level: 72.0, rainfall_mm: 45, risk_level: 'moderate' as const },
    { time: '15:00', predicted_level: currentVal, rainfall_mm: 68, risk_level: currentVal > 80 ? ('severe' as const) : ('high' as const) },
    { time: '18:00 (FC)', predicted_level: Math.min(100, currentVal + 6.2), rainfall_mm: 82, risk_level: 'high' as const },
    { time: '21:00 (FC)', predicted_level: Math.min(100, currentVal + 11.5), rainfall_mm: 95, risk_level: 'severe' as const },
    { time: '00:00 (FC)', predicted_level: Math.min(100, currentVal + 8.0), rainfall_mm: 40, risk_level: 'severe' as const },
    { time: '03:00 (FC)', predicted_level: Math.max(40, currentVal - 4.5), rainfall_mm: 15, risk_level: 'moderate' as const }
  ];

  return {
    current_level_meters: Number((currentVal * 0.12).toFixed(2)),
    max_capacity_meters: 12.0,
    level_percentage: Number(currentVal.toFixed(1)),
    discharge_rate_m3s: Number((1420 + currentVal * 18.5).toFixed(1)),
    turbidity_ntu: 48.2,
    ph_level: 7.2,
    flow_speed_ms: 3.8,
    forecast_timeline: timeline
  };
}

/**
 * High-Throughput Telemetry Ingestion Logic
 * Analyzes ingested metrics against warning/critical thresholds.
 * Auto-triggers alerts over WebSockets when threshold is breached (>80% water level).
 */
export function processIngestedTelemetry(payload: TelemetryPayload) {
  let sensor = sensorsStore.get(payload.sensor_id);

  if (!sensor) {
    sensor = {
      id: payload.sensor_id,
      name: `Sensor ${payload.sensor_id}`,
      type: payload.sensor_type,
      location: payload.location || { lat: 28.615, lng: 77.21 },
      current_status: 'normal',
      last_ping: payload.timestamp || new Date().toISOString(),
      value: payload.value,
      unit: payload.unit || '%',
      threshold_warning: 70,
      threshold_critical: 80
    };
  } else {
    sensor.value = payload.value;
    sensor.last_ping = payload.timestamp || new Date().toISOString();
  }

  // Threshold anomaly evaluation logic
  let newIncidentTriggered: Incident | null = null;

  if (sensor.value >= sensor.threshold_critical) {
    sensor.current_status = 'critical';

    // If threshold breached (>80%), auto-generate or update high severity incident
    const existingInc = Array.from(incidentsStore.values()).find(
      (inc) => inc.triggered_by_sensor_id === sensor!.id && inc.status !== 'resolved'
    );

    if (!existingInc) {
      const incId = `inc_surge_${Date.now().toString().slice(-4)}`;
      const severity = sensor.value > 90 ? 5 : 4;
      const newInc: Incident = {
        id: incId,
        title: `AUTOMATED CRITICAL ALERT: ${sensor.name} Breached ${sensor.value.toFixed(1)}${sensor.unit}`,
        description: `Telemetry surge detected at ${sensor.location.address || 'Urban Sector'}. Immediate emergency response required.`,
        severity_level: severity as any,
        type: sensor.type === 'water_level' ? 'flood' : 'structural_damage',
        coordinates: sensor.location,
        affected_radius: 1200,
        timestamp: new Date().toISOString(),
        status: 'active',
        triggered_by_sensor_id: sensor.id,
        recommended_action: `Dispatch NDRF Battalion immediately. Issue local civilian siren broadcast.`
      };

      incidentsStore.set(incId, newInc);
      newIncidentTriggered = newInc;
    }
  } else if (sensor.value >= sensor.threshold_warning) {
    sensor.current_status = 'warning';
  } else {
    sensor.current_status = 'normal';
  }

  sensorsStore.set(sensor.id, sensor);

  // Broadcast WebSocket update
  broadcastWSMessage({
    event: 'TELEMETRY_UPDATE',
    data: {
      sensor,
      ingested_value: payload.value
    },
    timestamp: new Date().toISOString()
  });

  if (newIncidentTriggered) {
    broadcastWSMessage({
      event: 'ALERT_TRIGGERED',
      data: newIncidentTriggered,
      timestamp: new Date().toISOString()
    });
  }

  return { sensor, incident_created: newIncidentTriggered };
}

/**
 * Dispatch NDRF Unit or Drone to an Incident ID
 */
export function dispatchAssetToIncident(assetId: string, incidentId: string) {
  const asset = assetsStore.get(assetId);
  const incident = incidentsStore.get(incidentId);

  if (!asset || !incident) {
    return { success: false, message: 'Asset or Incident not found.' };
  }

  asset.assigned_incident_id = incident.id;
  asset.status = 'en_route';
  asset.current_location = {
    lat: (asset.current_location.lat + incident.coordinates.lat) / 2,
    lng: (asset.current_location.lng + incident.coordinates.lng) / 2
  };
  assetsStore.set(asset.id, asset);

  incident.assigned_asset_id = asset.id;
  incident.status = 'dispatched';
  incidentsStore.set(incident.id, incident);

  broadcastWSMessage({
    event: 'DISPATCH_UPDATED',
    data: { asset, incident },
    timestamp: new Date().toISOString()
  });

  return { success: true, asset, incident };
}
