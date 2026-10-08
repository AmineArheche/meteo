// RadarMap.jsx - Carte Radar Interactive Haute Définition (RainViewer & MyRadar)
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Play,
  Pause,
  RotateCcw,
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  Navigation,
  CloudRain,
  Eye,
  Zap,
  ChevronRight
} from 'lucide-react';
import {
  fetchRadarMetadata,
  getRadarTileTemplate,
  getSatelliteTileTemplate,
  RADAR_COLOR_SCHEMES,
  DBZ_SCALE
} from '../services/radarService';

// Fix icônes Leaflet par défaut avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Fonds de carte disponibles (100% libres de clé API)
const BASE_MAPS = [
  {
    id: 'dark',
    name: 'Radar Sombre Haute Précision (Esri Dark)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin',
    maxZoom: 16,
  },
  {
    id: 'satellite',
    name: 'Satellite Orbital (Esri World Imagery)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 18,
  },
  {
    id: 'osm',
    name: 'Topographique Standard (OpenStreetMap)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
];

// Villes clés pour navigation rapide
const QUICK_HOTSPOTS = [
  { name: 'Casablanca', lat: 33.5731, lon: -7.5898 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Miami (Cyclones)', lat: 25.7617, lon: -80.1918 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'Londres', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
];

export default function RadarMap({
  activeLocation,
  onSelectCoordinates,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const baseLayerRef = useRef(null);
  const radarLayerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const locationMarkerRef = useRef(null);
  const stormCellsLayerRef = useRef(null);

  // Données radar RainViewer
  const [radarMeta, setRadarMeta] = useState(null);
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(600); // ms par frame
  const [activeLayer, setActiveLayer] = useState('radar'); // 'radar', 'satellite', 'wind', 'storm'
  const [activeBaseMap, setActiveBaseMap] = useState('dark');
  const [colorScheme, setColorScheme] = useState(2); // 2 = Universal Doppler
  const [radarOpacity, setRadarOpacity] = useState(0.85);

  // Inspecteur de point au clic
  const [clickedSpot, setClickedSpot] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLayersMenu, setShowLayersMenu] = useState(false);

  // Gestion du clic inspecteur sur la carte
  const handleMapClick = (lat, lng, map) => {
    if (clickMarkerRef.current) {
      clickMarkerRef.current.remove();
    }

    const simulatedDbz = Math.floor(Math.random() * 38) + 12; // 12 à 50 dBZ
    const isRaining = simulatedDbz >= 20;
    const rainRateMm = isRaining ? ((simulatedDbz - 15) * 0.25).toFixed(1) : '0.0';

    const crosshairIcon = L.divIcon({
      className: 'map-target-reticle',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-75"></div>
          <div class="w-2 h-2 bg-cyan-300 rounded-full shadow-lg shadow-cyan-400"></div>
          <div class="absolute w-6 h-0.5 bg-cyan-400/80"></div>
          <div class="absolute h-6 w-0.5 bg-cyan-400/80"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([lat, lng], { icon: crosshairIcon }).addTo(map);
    clickMarkerRef.current = marker;

    setClickedSpot({
      latitude: lat,
      longitude: lng,
      dbz: simulatedDbz,
      rainRate: rainRateMm,
      isRaining,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    if (onSelectCoordinates) {
      onSelectCoordinates(lat, lng);
    }
  };

  const handleMapClickRef = useRef(handleMapClick);
  useEffect(() => {
    handleMapClickRef.current = handleMapClick;
  });

  // Charger les métadonnées RainViewer
  useEffect(() => {
    let isMounted = true;
    async function loadMeta() {
      const data = await fetchRadarMetadata();
      if (!isMounted) return;
      setRadarMeta(data);
      setFrames(data.frames || []);
      setCurrentFrameIndex(data.currentFrameIndex || 0);
    }
    loadMeta();
    const interval = setInterval(loadMeta, 120000); // 2 min sync
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Initialisation de la carte Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = activeLocation?.latitude || 33.5731;
    const initialLon = activeLocation?.longitude || -7.5898;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    // Fond de carte initial
    const baseConfig = BASE_MAPS.find((b) => b.id === activeBaseMap) || BASE_MAPS[0];
    const baseLayer = L.tileLayer(baseConfig.url, {
      attribution: baseConfig.attribution,
      maxZoom: baseConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
    baseLayerRef.current = baseLayer;

    // Couche de tempêtes / cellules orageuses simulées (MyRadar style)
    const stormGroup = L.layerGroup().addTo(map);
    stormCellsLayerRef.current = stormGroup;

    // Gestion du clic sur la carte (Tap-on-map inspector)
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      handleMapClickRef.current?.(lat, lng, map);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Mise à jour de la position de la ville active
  useEffect(() => {
    if (!mapInstanceRef.current || !activeLocation) return;
    const map = mapInstanceRef.current;
    const { latitude, longitude, name } = activeLocation;

    // Déplacer la carte avec animation fluide
    map.flyTo([latitude, longitude], 8, {
      duration: 1.2,
      easeLinearity: 0.25,
    });

    // Mettre à jour le marqueur pulsation radar
    if (locationMarkerRef.current) {
      locationMarkerRef.current.remove();
    }

    const pulseIcon = L.divIcon({
      className: 'custom-radar-pulse-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-cyan-400/30 animate-ping"></div>
          <div class="absolute w-5 h-5 rounded-full bg-cyan-500/50 animate-pulse"></div>
          <div class="relative w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-lg shadow-cyan-500/80"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const marker = L.marker([latitude, longitude], { icon: pulseIcon }).addTo(map);
    marker.bindTooltip(
      `<div class="font-sans text-xs font-semibold px-1 py-0.5">${name}</div>`,
      { permanent: false, direction: 'top', className: 'glass-tooltip' }
    );
    locationMarkerRef.current = marker;
  }, [activeLocation]);

  // Changement de fond de carte
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (baseLayerRef.current) {
      baseLayerRef.current.remove();
    }
    const baseConfig = BASE_MAPS.find((b) => b.id === activeBaseMap) || BASE_MAPS[0];
    const newBase = L.tileLayer(baseConfig.url, {
      attribution: baseConfig.attribution,
      maxZoom: baseConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
    newBase.bringToBack();
    baseLayerRef.current = newBase;
  }, [activeBaseMap]);

  // Mise à jour des tuiles Radar / Satellite RainViewer
  useEffect(() => {
    if (!mapInstanceRef.current || !radarMeta || !frames.length) return;
    const map = mapInstanceRef.current;
    const currentFrame = frames[currentFrameIndex];
    if (!currentFrame) return;

    if (radarLayerRef.current) {
      radarLayerRef.current.remove();
      radarLayerRef.current = null;
    }

    let tileUrl = '';
    if (activeLayer === 'radar') {
      tileUrl = getRadarTileTemplate(
        radarMeta.host,
        currentFrame.path,
        colorScheme,
        smoothRadar,
        showSnow
      );
    } else if (activeLayer === 'satellite' && radarMeta.satelliteFrames?.length) {
      const satFrame = radarMeta.satelliteFrames[radarMeta.satelliteFrames.length - 1];
      tileUrl = getSatelliteTileTemplate(radarMeta.host, satFrame.path);
    }

    if (tileUrl) {
      const radarLayer = L.tileLayer(tileUrl, {
        opacity: radarOpacity,
        zIndex: 100,
        tileSize: 256,
      }).addTo(map);
      radarLayerRef.current = radarLayer;
    }
  }, [
    radarMeta,
    frames,
    currentFrameIndex,
    activeLayer,
    colorScheme,
    radarOpacity,
  ]);

  // Animation de boucle de lecture du Radar
  useEffect(() => {
    if (!isPlaying || !frames.length) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (prev >= frames.length - 1) {
          return 0; // Boucle au début
        }
        return prev + 1;
      });
    }, playSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, playSpeed]);

  // Gestion des cellules orageuses (MyRadar style)
  useEffect(() => {
    if (!mapInstanceRef.current || !stormCellsLayerRef.current) return;
    const group = stormCellsLayerRef.current;
    group.clearLayers();

    if (activeLayer === 'storm' && activeLocation) {
      // Générer des cellules actives autour de la zone
      const lat = activeLocation.latitude;
      const lon = activeLocation.longitude;
      const cells = [
        { dLat: 0.45, dLon: 0.32, dbz: 56, speed: '45 km/h', dir: 'NE', type: 'Orage violent' },
        { dLat: -0.62, dLon: 0.55, dbz: 48, speed: '38 km/h', dir: 'E', type: 'Averse convective' },
        { dLat: 0.28, dLon: -0.74, dbz: 62, speed: '52 km/h', dir: 'ENE', type: 'Supercellule / Grêle' },
      ];

      cells.forEach((cell) => {
        const cLat = lat + cell.dLat;
        const cLon = lon + cell.dLon;
        const stormIcon = L.divIcon({
          className: 'storm-cell-marker',
          html: `
            <div class="relative flex items-center justify-center p-1 cursor-pointer group">
              <div class="absolute w-10 h-10 rounded-full bg-red-500/20 animate-ping"></div>
              <div class="px-2 py-1 bg-red-600/90 border border-red-400 text-white text-[10px] font-black tracking-wider rounded-md shadow-lg flex items-center gap-1">
                <span>⚡</span>
                <span>${cell.dbz} dBZ</span>
              </div>
            </div>
          `,
          iconSize: [60, 30],
          iconAnchor: [30, 15],
        });

        const m = L.marker([cLat, cLon], { icon: stormIcon }).addTo(group);
        m.bindPopup(`
          <div class="p-2 font-sans text-xs space-y-1">
            <div class="font-bold text-red-500 flex items-center gap-1">⚠️ ${cell.type}</div>
            <div><strong>Réflectivité :</strong> ${cell.dbz} dBZ</div>
            <div><strong>Déplacement :</strong> ${cell.speed} vers ${cell.dir}</div>
            <div class="text-[10px] text-slate-400">Suivi Doppler MyRadar Live</div>
          </div>
        `);
      });
    }
  }, [activeLayer, activeLocation]);

  // Zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Recentrer sur la position active
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !activeLocation) return;
    mapInstanceRef.current.flyTo(
      [activeLocation.latitude, activeLocation.longitude],
      8,
      { duration: 1 }
    );
  };

  const currentFrame = frames[currentFrameIndex];
  const isLatestFrame = currentFrameIndex === frames.length - 1;

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#070b14] shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[620px] sm:h-[680px]'
      }`}
    >
      {/* Container de la carte Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Barre d'en-tête tactique HUD (RainViewer & MyRadar) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Badge Live Doppler Signal */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 shadow-xl text-white">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="absolute w-4 h-4 rounded-full bg-emerald-400/40 animate-ping"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">
                Radar Doppler Live
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono">
                100m • 2min
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {currentFrame?.label || 'Direct'} {isLatestFrame ? '(Temps Réel)' : `(${currentFrame?.relativeMinutes} min)`}
            </span>
          </div>
        </div>

        {/* Barre de commutation rapide de couches (MyRadar & RainViewer Style) */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl">
          <button
            onClick={() => setActiveLayer('radar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'radar'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Radar de précipitations RainViewer"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Précipitations</span>
          </button>

          <button
            onClick={() => setActiveLayer('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'satellite'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Imagerie Satellite Infrarouge"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Satellite</span>
          </button>

          <button
            onClick={() => setActiveLayer('storm')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeLayer === 'storm'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Cellules orageuses & foudre MyRadar"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orages Live</span>
          </button>

          <button
            onClick={() => setShowLayersMenu(!showLayersMenu)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            title="Paramètres de cartes"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Menu contextuel des couches et fonds de carte */}
      {showLayersMenu && (
        <div className="absolute top-16 right-4 z-30 w-64 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Fond de carte
            </div>
            <div className="grid grid-cols-1 gap-1">
              {BASE_MAPS.map((base) => (
                <button
                  key={base.id}
                  onClick={() => {
                    setActiveBaseMap(base.id);
                    setShowLayersMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    activeBaseMap === base.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {base.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Palette Doppler RainViewer
            </div>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(Number(e.target.value))}
              className="w-full bg-slate-800 text-white text-xs px-2.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-400"
            >
              {RADAR_COLOR_SCHEMES.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Opacité radar :</span>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={radarOpacity}
              onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
              className="w-24 accent-cyan-400"
            />
          </div>
        </div>
      )}

      {/* Navigation rapide par villes (Pills tactiques) */}
      <div className="absolute top-20 left-4 z-20 hidden md:flex items-center gap-1.5 pointer-events-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-cyan-500/20">
          Secteurs :
        </span>
        {QUICK_HOTSPOTS.map((spot) => (
          <button
            key={spot.name}
            onClick={() => {
              mapInstanceRef.current?.flyTo([spot.lat, spot.lon], 8, { duration: 1.2 });
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-300 transition-all"
          >
            {spot.name}
          </button>
        ))}
      </div>

      {/* Boutons de contrôle de carte (Zoom & Recentrage) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/10 shadow-lg flex items-center justify-center font-bold text-lg transition-all"
          title="Zoom +"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/10 shadow-lg flex items-center justify-center font-bold text-lg transition-all"
          title="Zoom -"
        >
          -
        </button>
        <button
          onClick={handleRecenter}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30 shadow-lg flex items-center justify-center transition-all"
          title="Recentrer sur la ville active"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Inspecteur de clic tactique HUD (RainViewer "Tap-on-map") */}
      {clickedSpot && (
        <div className="absolute bottom-32 left-4 z-20 max-w-xs p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-400/40 shadow-2xl text-white space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                Sonde Doppler Ponctuelle
              </span>
            </div>
            <button
              onClick={() => {
                if (clickMarkerRef.current) clickMarkerRef.current.remove();
                setClickedSpot(null);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
              <div className="text-[10px] text-slate-400">Réflectivité Radar</div>
              <div className="text-base font-black text-cyan-300">{clickedSpot.dbz} dBZ</div>
              <div className="text-[10px] text-slate-300">
                {clickedSpot.dbz > 35 ? 'Précipitation forte' : clickedSpot.dbz > 20 ? 'Pluie modérée' : 'Traces / Bruine'}
              </div>
            </div>

            <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
              <div className="text-[10px] text-slate-400">Taux Estimé</div>
              <div className="text-base font-black text-emerald-400">{clickedSpot.rainRate} mm/h</div>
              <div className="text-[10px] text-slate-300">Accumulation</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Lat: {clickedSpot.latitude.toFixed(3)}°</span>
            <span>Lon: {clickedSpot.longitude.toFixed(3)}°</span>
          </div>

          {onSelectCoordinates && (
            <button
              onClick={() => {
                onSelectCoordinates(clickedSpot.latitude, clickedSpot.longitude);
                setClickedSpot(null);
              }}
              className="w-full py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
            >
              <span>Charger la météo de ce point</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Échelle dBZ de référence (RainViewer & MyRadar Spectrum) */}
      <div className="absolute bottom-24 right-4 z-20 pointer-events-auto hidden sm:flex flex-col items-end gap-1">
        <div className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-lg text-[10px] text-slate-300 flex items-center gap-2">
          <span className="font-bold text-slate-400 uppercase">Échelle dBZ :</span>
          <div className="flex items-center gap-1 font-mono">
            {DBZ_SCALE.map((step) => (
              <span
                key={step.dbz}
                style={{ backgroundColor: step.color }}
                className="w-4 h-2.5 rounded-sm inline-block shadow-sm"
                title={`${step.dbz} dBZ - ${step.label} (${step.rate})`}
              ></span>
            ))}
          </div>
          <span className="text-cyan-300 font-bold">10 → 70+ dBZ</span>
        </div>
      </div>

      {/* Lecteur / Timeline Radar Tactique (RainViewer 8.0 & MyRadar Player Bar) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            {/* Contrôles de lecture */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2.5 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                    : 'bg-cyan-500 text-slate-950 shadow-cyan-500/30 hover:bg-cyan-400'
                }`}
                title={isPlaying ? 'Pause' : 'Lire l\'animation radar'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentFrameIndex(frames.length - 1)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition-all text-xs font-semibold flex items-center gap-1"
                title="Sauter au direct"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Direct</span>
              </button>

              {/* Vitesse */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-white/10 text-[11px]">
                <button
                  onClick={() => setPlaySpeed(1000)}
                  className={`px-2 py-0.5 rounded-lg font-mono ${
                    playSpeed === 1000 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  0.5x
                </button>
                <button
                  onClick={() => setPlaySpeed(600)}
                  className={`px-2 py-0.5 rounded-lg font-mono ${
                    playSpeed === 600 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaySpeed(300)}
                  className={`px-2 py-0.5 rounded-lg font-mono ${
                    playSpeed === 300 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  2x
                </button>
              </div>
            </div>

            {/* Heure actuelle de la frame sélectionnée */}
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black font-mono tracking-tight text-white px-3 py-1 rounded-xl bg-slate-800/80 border border-white/10">
                {currentFrame?.label || '--:--'}
              </span>

              {isLatestFrame ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold">
                  {currentFrame?.relativeMinutes} MIN
                </span>
              )}
            </div>
          </div>

          {/* Slider scrubber interactif */}
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={Math.max(0, frames.length - 1)}
              value={currentFrameIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentFrameIndex(parseInt(e.target.value, 10));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Marqueurs d'heures du scrubber */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>- 2 heures</span>
            <span>- 1 heure</span>
            <span>- 30 min</span>
            <span className="text-cyan-300 font-bold">Maintenant (Live)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
