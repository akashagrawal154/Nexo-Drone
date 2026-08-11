import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Sensor,
  Incident,
  ActiveAsset,
  MapLayerConfig
} from '../types';
import {
  Layers,
  Activity,
  Eye,
  EyeOff,
  Radio,
  Navigation,
  Droplets,
  AlertOctagon,
  ShieldAlert,
  Car,
  Compass,
  Maximize2
} from 'lucide-react';

interface InteractiveMapProps {
  sensors: Sensor[];
  incidents: Incident[];
  assets: ActiveAsset[];
  onSelectIncident: (inc: Incident) => void;
  onDispatchAsset: (assetId: string, incidentId: string) => void;
  isLightTheme?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  sensors,
  incidents,
  assets,
  onSelectIncident,
  onDispatchAsset,
  isLightTheme = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [layers, setLayers] = useState<MapLayerConfig>({
    structuralHealth: true,
    waterFlow: true,
    liveTraffic: true,
    sensors: true,
    incidents: true,
    assets: true,
    droneTrajectories: true,
    emergencyCorridors: true,
    civilianDiversions: true
  });

  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState<boolean>(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Delhi NCR Yamuna basin / Urban Center (28.6139, 77.209)
    const map = L.map(mapContainerRef.current, {
      center: [28.6139, 77.209],
      zoom: 13,
      zoomControl: false
    });

    const tileUrl = isLightTheme
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when Theme Mode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileUrl = isLightTheme
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    tileLayerRef.current.setUrl(tileUrl);
  }, [isLightTheme]);

  // Update Markers & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Render Water Flow / Flood Overlay Polygons/Circles
    if (layers.waterFlow) {
      // Yamuna River Basin Flow Vector Simulation
      const riverPolyline = L.polyline(
        [
          [28.65, 77.22],
          [28.63, 77.215],
          [28.6139, 77.209],
          [28.59, 77.21],
          [28.57, 77.225]
        ],
        {
          color: '#06b6d4',
          weight: 10,
          opacity: 0.75,
          dashArray: '8, 8',
          lineCap: 'round'
        }
      ).addTo(layerGroup);
      riverPolyline.bindTooltip('Yamuna Main Water Corridor — Flow: 1,840 m³/s (Elevated Risk)', {
        sticky: true,
        className: 'font-mono text-xs shadow-md'
      });
    }

    // 2. Emergency Green Corridors
    if (layers.emergencyCorridors) {
      // NDRF to Flood Site
      const greenCorridor = L.polyline(
        [
          [28.625, 77.202],
          [28.62, 77.205],
          [28.615, 77.208],
          [28.6139, 77.209]
        ],
        {
          color: '#10b981',
          weight: 8,
          opacity: 0.9,
          dashArray: '12, 12',
          className: 'animate-corridor-flow'
        }
      ).addTo(layerGroup);
      greenCorridor.bindTooltip('⚡ EMERGENCY GREEN CORRIDOR: NDRF Battalion 4 En Route (14 mins saved)', {
        sticky: true
      });
    }

    // 3. Civilian Traffic Diversion
    if (layers.civilianDiversions) {
      const diversionPolyline = L.polyline(
        [
          [28.622, 77.195],
          [28.61, 77.198],
          [28.598, 77.205]
        ],
        {
          color: '#ef4444',
          weight: 5,
          opacity: 0.8,
          dashArray: '6, 6'
        }
      ).addTo(layerGroup);
      diversionPolyline.bindTooltip('⛔ CIVILIAN TRAFFIC DIVERSION: Avoid Riverbank Sector 4', {
        sticky: true
      });
    }

    // 4. Live Traffic Congestion Vector
    if (layers.liveTraffic) {
      const trafficPolyline = L.polyline(
        [
          [28.62, 77.19],
          [28.618, 77.198],
          [28.61, 77.22],
          [28.605, 77.225]
        ],
        {
          color: '#f59e0b',
          weight: 5,
          opacity: 0.75
        }
      ).addTo(layerGroup);
      trafficPolyline.bindTooltip('Ring Road Expressway Corridor — Speed: 18 km/h (Congestion)', { sticky: true });
    }


    // 3. Render Incidents with Pulsing Radius Overlays
    if (layers.incidents) {
      incidents
        .filter((inc) => inc.status !== 'resolved')
        .forEach((inc) => {
          const isCritical = inc.severity_level >= 4;
          const color = isCritical ? '#ef4444' : '#f59e0b';

          // Affected Radius Circle
          L.circle([inc.coordinates.lat, inc.coordinates.lng], {
            radius: inc.affected_radius,
            color: color,
            fillColor: color,
            fillOpacity: 0.25,
            weight: 2,
            dashArray: '6, 6'
          }).addTo(layerGroup);

          // Pulse HTML Marker
          const iconHtml = `
            <div class="relative flex items-center justify-center w-8 h-8">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${
                isCritical ? 'bg-red-500' : 'bg-amber-500'
              } opacity-75"></span>
              <div class="relative flex items-center justify-center w-7 h-7 rounded-full ${
                isCritical ? 'bg-red-600' : 'bg-amber-600'
              } text-white font-bold border-2 border-white shadow-lg text-xs">
                ${inc.severity_level}
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-incident-pin',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const marker = L.marker([inc.coordinates.lat, inc.coordinates.lng], { icon: customIcon }).addTo(
            layerGroup
          );

          marker.bindPopup(`
            <div class="font-sans text-xs space-y-2">
              <div class="flex items-center justify-between border-b border-slate-700 pb-1">
                <span class="font-mono font-bold text-red-400 uppercase">SEVERITY LEVEL ${inc.severity_level}</span>
                <span class="px-1.5 py-0.5 text-[10px] bg-red-950 text-red-300 rounded font-mono">${inc.type}</span>
              </div>
              <p class="font-bold text-white">${inc.title}</p>
              <p class="text-slate-300 text-[11px]">${inc.description}</p>
              <div class="text-[10px] font-mono text-slate-400">
                Radius: ${inc.affected_radius}m | Lat: ${inc.coordinates.lat.toFixed(4)}, Lng: ${inc.coordinates.lng.toFixed(4)}
              </div>
            </div>
          `);
        });
    }

    // 4. Render Sensors
    if (layers.sensors) {
      sensors.forEach((sns) => {
        // Filter by layer type
        if (sns.type === 'structural_health' && !layers.structuralHealth) return;
        if (sns.type === 'water_level' && !layers.waterFlow) return;

        let iconBg = 'bg-cyan-500';
        if (sns.current_status === 'warning') iconBg = 'bg-amber-500';
        if (sns.current_status === 'critical') iconBg = 'bg-red-500';

        const iconHtml = `
          <div class="flex items-center justify-center w-6 h-6 rounded-md ${iconBg} text-slate-950 shadow-md border border-slate-900 font-mono text-[10px] font-bold">
            ${sns.type === 'water_level' ? 'H2O' : sns.type === 'structural_health' ? 'STR' : 'CAM'}
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-sensor-pin',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([sns.location.lat, sns.location.lng], { icon }).addTo(layerGroup);

        marker.bindPopup(`
          <div class="font-sans text-xs space-y-1.5">
            <div class="font-bold text-white border-b border-slate-700 pb-1">${sns.name}</div>
            <div class="flex justify-between font-mono text-[11px]">
              <span class="text-slate-400">Reading:</span>
              <span class="font-bold text-cyan-400">${sns.value} ${sns.unit}</span>
            </div>
            <div class="flex justify-between font-mono text-[11px]">
              <span class="text-slate-400">Status:</span>
              <span class="uppercase font-bold ${
                sns.current_status === 'critical'
                  ? 'text-red-400'
                  : sns.current_status === 'warning'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }">${sns.current_status}</span>
            </div>
            <div class="text-[10px] text-slate-400 pt-1">${sns.location.address || ''}</div>
          </div>
        `);
      });
    }

    // 5. Render Active Assets (Drones / NDRF)
    if (layers.assets) {
      assets.forEach((ast) => {
        const isDrone = ast.type === 'drone';

        const iconHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border-2 ${
            isDrone ? 'border-cyan-400' : 'border-emerald-400'
          } shadow-lg text-white">
            <span class="font-mono text-[10px] font-bold">${isDrone ? '🛸' : '🚒'}</span>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'custom-asset-pin',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([ast.current_location.lat, ast.current_location.lng], { icon }).addTo(
          layerGroup
        );

        marker.bindPopup(`
          <div class="font-sans text-xs space-y-1.5">
            <div class="font-bold text-emerald-400 border-b border-slate-700 pb-1">${ast.name}</div>
            <div class="text-slate-300">Type: <span class="font-mono uppercase">${ast.type}</span></div>
            <div class="text-slate-300">Battery: <span class="font-mono font-bold text-amber-400">${ast.battery_pct}%</span></div>
            <div class="text-slate-300">Status: <span class="font-mono font-bold uppercase text-cyan-400">${ast.status}</span></div>
          </div>
        `);
      });
    }
  }, [sensors, incidents, assets, layers]);

  return (
    <div
      className={`relative w-full h-full min-h-[420px] ios-card overflow-hidden border shadow-xl flex flex-col transition-all duration-300 ${
        isLightTheme ? 'border-white/80 bg-white/70 text-slate-900' : 'border-white/10 bg-slate-900/60 text-slate-100'
      }`}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div
          className={`px-3.5 py-2 rounded-full ios-glass border text-xs font-semibold flex items-center gap-2 shadow-lg transition active:scale-95 ${
            isLightTheme
              ? 'bg-white/80 border-white/80 text-slate-900'
              : 'bg-slate-900/80 border-white/10 text-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-blue-500 animate-spin-slow" />
          <span>GIS SPATIAL TWIN — METRO SECTOR 04</span>
        </div>
      </div>

      {/* Layer Toggle Floating Drawer */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
          className={`ios-button px-3.5 py-2 rounded-full ios-glass border shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-semibold transition active:scale-95 ${
            isLightTheme
              ? 'bg-white/80 border-white/80 hover:bg-white text-slate-900'
              : 'bg-slate-900/80 border-white/10 hover:bg-slate-800/90 text-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="hidden sm:inline">LAYERS</span>
        </button>

        {isLayerPanelOpen && (
          <div
            className={`mt-2 w-64 p-3.5 rounded-3xl ios-glass border shadow-2xl text-xs space-y-2.5 font-sans ${
              isLightTheme
                ? 'bg-white/90 border-white/80 text-slate-800'
                : 'bg-slate-900/90 border-white/10 text-slate-200'
            }`}
          >
            <div className="font-bold border-b border-slate-200/80 dark:border-slate-800/80 pb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold">GIS LAYERS</span>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">TOGGLE VIEWS</span>
            </div>

            <div className="space-y-1 text-[11px]">
              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Water Flow & Basin
                </span>
                <input
                  type="checkbox"
                  checked={layers.waterFlow}
                  onChange={(e) => setLayers({ ...layers, waterFlow: e.target.checked })}
                  className="accent-cyan-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-emerald-500" /> AI Green Corridors
                </span>
                <input
                  type="checkbox"
                  checked={layers.emergencyCorridors}
                  onChange={(e) => setLayers({ ...layers, emergencyCorridors: e.target.checked })}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Civilian Diversions
                </span>
                <input
                  type="checkbox"
                  checked={layers.civilianDiversions}
                  onChange={(e) => setLayers({ ...layers, civilianDiversions: e.target.checked })}
                  className="accent-red-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-amber-500" /> Structural Health
                </span>
                <input
                  type="checkbox"
                  checked={layers.structuralHealth}
                  onChange={(e) => setLayers({ ...layers, structuralHealth: e.target.checked })}
                  className="accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-yellow-500" /> Live Traffic Grid
                </span>
                <input
                  type="checkbox"
                  checked={layers.liveTraffic}
                  onChange={(e) => setLayers({ ...layers, liveTraffic: e.target.checked })}
                  className="accent-yellow-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Incidents & Radius
                </span>
                <input
                  type="checkbox"
                  checked={layers.incidents}
                  onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
                  className="accent-red-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-1 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-emerald-500" /> Drones & NDRF Assets
                </span>
                <input
                  type="checkbox"
                  checked={layers.assets}
                  onChange={(e) => setLayers({ ...layers, assets: e.target.checked })}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Main Map Render Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Footer Map Legend */}
      <div
        className={`absolute bottom-3 left-3 z-20 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl backdrop-blur border text-[11px] font-mono shadow-lg ${
          isLightTheme
            ? 'bg-white/90 border-slate-200 text-slate-700'
            : 'bg-slate-900/90 border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Green Corridor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>Civilian Diversion</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Warning / Flood</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
          <span>Sensors / Assets</span>
        </div>
      </div>
    </div>
  );
};
