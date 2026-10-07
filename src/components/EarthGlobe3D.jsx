// EarthGlobe3D.jsx - Modèle 3D Interactif de la Terre (NASA Solar System Exploration & Three.js Globe)
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Globe,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Compass,
  Navigation,
  Sparkles,
  Layers,
  Info,
  Radio,
  ExternalLink,
  ChevronRight,
  Sun,
  Eye
} from 'lucide-react';

const NASA_EMBED_URL = 'https://solarsystem.nasa.gov/gltf_embed/2393/';

// Villes clés avec coordonnées géographiques
const WORLD_HOTSPOTS = [
  { name: 'Casablanca', lat: 33.5731, lon: -7.5898, region: 'Afrique du Nord' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, region: 'Europe' },
  { name: 'Miami (Cyclones)', lat: 25.7617, lon: -80.1918, region: 'Floride / Caraïbes' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, region: 'Amérique du Nord' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, region: 'Asie Pacifique' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, region: 'Océanie' },
];

export default function EarthGlobe3D({
  activeLocation,
  weatherData,
  onSelectCity,
}) {
  const [viewMode, setViewMode] = useState('three'); // 'three' (WebGL interactif météo) ou 'nasa' (Embed GLTF officiel)
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.002);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusedHotspot, setFocusedHotspot] = useState(null);

  const canvasContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const earthMeshRef = useRef(null);
  const cloudsMeshRef = useRef(null);
  const atmosphereMeshRef = useRef(null);
  const pinGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Conversion latitude/longitude en coordonnées 3D cartésiennes (x, y, z)
  const latLonToVector3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  // Initialisation Three.js WebGL Earth Globe
  useEffect(() => {
    if (viewMode !== 'three' || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 1. Scène
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Caméra
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Nettoyer conteneur
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Éclairage solaire directionnel & ambiant
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // 5. Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Textures haute définition Terre NASA Blue Marble
    const earthTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'
    );
    const specularTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
    );
    const cloudsTexture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    );

    // 6. Sphère Terrestre Principale
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      specularMap: specularTexture,
      specular: new THREE.Color(0x264653),
      shininess: 15,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 7. Couche Nuageuse
    const cloudsGeometry = new THREE.SphereGeometry(1.015, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 8. Halo Atmosphérique Cyan / Bleu
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 0.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // 9. Groupe de balises / Pinpoints des villes
    const pinGroup = new THREE.Group();
    earthMesh.add(pinGroup);
    pinGroupRef.current = pinGroup;

    // 10. Champ d'étoiles spatial
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = (Math.random() - 0.5) * 50;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0x90e0ef, size: 0.08, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Contrôles de souris interactifs (rotation manuelle et zoom)
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !earthMeshRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      earthMeshRef.current.rotation.y += deltaX * 0.005;
      earthMeshRef.current.rotation.x += deltaY * 0.005;
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += deltaX * 0.005;
        cloudsMeshRef.current.rotation.x += deltaY * 0.005;
      }

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(1.5, Math.min(4.5, camera.position.z + e.deltaY * 0.002));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Redimensionnement automatique
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Boucle de rendu continue
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && earthMeshRef.current && !isDragging) {
        earthMeshRef.current.rotation.y += rotationSpeed;
        if (cloudsMeshRef.current) {
          cloudsMeshRef.current.rotation.y += rotationSpeed * 1.15; // Dérive différentielle des nuages
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [viewMode]);

  // Placer la balise Doppler pour la ville active sur le globe
  useEffect(() => {
    if (viewMode !== 'three' || !pinGroupRef.current || !activeLocation) return;
    const group = pinGroupRef.current;

    // Vider les anciennes balises
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const { latitude, longitude, name } = activeLocation;
    const pos = latLonToVector3(latitude, longitude, 1.02);

    // Marqueur pin balise
    const pinGeo = new THREE.SphereGeometry(0.025, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.copy(pos);
    group.add(pinMesh);

    // Anneau de balayage radar
    const ringGeo = new THREE.RingGeometry(0.035, 0.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.copy(pos);
    ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
    group.add(ringMesh);

    // Aligner la caméra vers la ville active
    if (earthMeshRef.current) {
      const targetY = -((longitude + 90) * (Math.PI / 180));
      const targetX = (latitude * (Math.PI / 180)) * 0.35;
      earthMeshRef.current.rotation.y = targetY;
      earthMeshRef.current.rotation.x = targetX;
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y = targetY;
        cloudsMeshRef.current.rotation.x = targetX;
      }
    }
  }, [activeLocation, viewMode]);

  // Téléportation vers un hotspot mondial
  const handleTeleport = (spot) => {
    setFocusedHotspot(spot);
    if (earthMeshRef.current) {
      const targetY = -((spot.lon + 90) * (Math.PI / 180));
      const targetX = (spot.lat * (Math.PI / 180)) * 0.35;
      earthMeshRef.current.rotation.y = targetY;
      earthMeshRef.current.rotation.x = targetX;
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y = targetY;
        cloudsMeshRef.current.rotation.x = targetX;
      }
    }
    if (onSelectCity) {
      onSelectCity({
        name: spot.name,
        latitude: spot.lat,
        longitude: spot.lon,
        country: spot.region,
      });
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#03060E] shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[640px] sm:h-[720px]'
      }`}
    >
      {/* 1. VUE THREE.JS GLOBE WEBGL */}
      {viewMode === 'three' && (
        <div
          ref={canvasContainerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        />
      )}

      {/* 2. VUE OFFICIELLE NASA EMBED GLTF (Earth 3D Model Solar System) */}
      {viewMode === 'nasa' && (
        <div className="w-full h-full relative bg-black">
          <iframe
            src={NASA_EMBED_URL}
            title="Earth 3D Model - NASA Solar System Exploration"
            className="w-full h-full border-0 select-none"
            allow="fullscreen; vr"
          />
        </div>
      )}

      {/* HUD SUPÉRIEUR : Titre & Commutateur de Mode (NASA GLTF vs Three.js) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/40 shadow-xl text-white">
          <div className="relative flex items-center justify-center">
            <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                Terre 3D • NASA Exploration
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                {viewMode === 'nasa' ? 'GLTF Officiel 2393' : 'Atmosphère WebGL'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Modèle photoréaliste • Diamètre : 12 756 km • Orbite 365.25j
            </span>
          </div>
        </div>

        {/* Boutons de sélection du mode de rendu 3D */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl text-xs">
          <button
            onClick={() => setViewMode('three')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === 'three'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Globe WebGL Météo</span>
          </button>

          <button
            onClick={() => setViewMode('nasa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              viewMode === 'nasa'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>NASA Embed 3D</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all ml-1"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran 3D'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SÉLECTEUR DE SECTEURS TERRESTRES (Téléportation rapide) */}
      <div className="absolute top-20 left-4 z-20 hidden md:flex items-center gap-1.5 pointer-events-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl bg-slate-900/85 backdrop-blur-md text-cyan-400 border border-cyan-500/30">
          Téléportation 3D :
        </span>
        {WORLD_HOTSPOTS.map((spot) => (
          <button
            key={spot.name}
            onClick={() => handleTeleport(spot)}
            className={`px-2.5 py-1 rounded-xl backdrop-blur-md border text-[11px] font-semibold transition-all ${
              activeLocation?.name === spot.name
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 border-white/10'
            }`}
          >
            {spot.name}
          </button>
        ))}
      </div>

      {/* HUD LATÉRAL DROIT : Télémétrie Scientifique NASA & Météo de la Ville Active */}
      <div className="absolute top-24 right-4 z-20 w-64 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 shadow-2xl text-white space-y-3 pointer-events-auto hidden lg:block animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Télémétrie Planétaire</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            NOMINAL
          </span>
        </div>

        {/* Paramètres Astronomiques de la Terre */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
            <div className="text-[10px] text-slate-400">Diamètre</div>
            <div className="text-sm font-black text-white font-mono">12 756 km</div>
            <div className="text-[9px] text-slate-400">Équatorial</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
            <div className="text-[10px] text-slate-400">Inclinaison Axe</div>
            <div className="text-sm font-black text-cyan-300 font-mono">23.44°</div>
            <div className="text-[9px] text-slate-400">Saisons</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
            <div className="text-[10px] text-slate-400">Vitesse Orbite</div>
            <div className="text-sm font-black text-emerald-400 font-mono">29.78 km/s</div>
            <div className="text-[9px] text-slate-400">107 200 km/h</div>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/60 border border-white/5">
            <div className="text-[10px] text-slate-400">Atmosphère</div>
            <div className="text-sm font-black text-purple-300 font-mono">78% N₂ / 21% O₂</div>
            <div className="text-[9px] text-slate-400">P = 1 013 hPa</div>
          </div>
        </div>

        {/* Focus sur le point actif */}
        {activeLocation && (
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
            <div className="text-[10px] text-cyan-400 uppercase font-bold flex items-center justify-between">
              <span>Position Active</span>
              <span className="font-mono">{activeLocation.name}</span>
            </div>
            <div className="text-[11px] text-slate-300 font-mono">
              Lat: {activeLocation.latitude?.toFixed(2)}° • Lon: {activeLocation.longitude?.toFixed(2)}°
            </div>
            {weatherData?.current && (
              <div className="pt-1 border-t border-cyan-500/20 flex items-center justify-between text-xs font-bold text-white">
                <span>Température :</span>
                <span className="text-cyan-300">{Math.round(weatherData.current.temperature)}°C</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE INFÉRIEURE : Contrôles d'animation & Rotation */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-wrap items-center justify-between gap-3">
          {/* Contrôles de rotation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2.5 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg ${
                autoRotate
                  ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title={autoRotate ? 'Mettre en pause la rotation' : 'Activer la rotation automatique'}
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (earthMeshRef.current) {
                  earthMeshRef.current.rotation.set(0, 0, 0);
                  if (cloudsMeshRef.current) cloudsMeshRef.current.rotation.set(0, 0, 0);
                }
                if (cameraRef.current) cameraRef.current.position.set(0, 0, 2.8);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Réinitialiser la caméra"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>

            {/* Vitesse de rotation */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-white/10 text-[11px]">
              <button
                onClick={() => setRotationSpeed(0.001)}
                className={`px-2 py-0.5 rounded-lg font-mono ${
                  rotationSpeed === 0.001 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                0.5x
              </button>
              <button
                onClick={() => setRotationSpeed(0.002)}
                className={`px-2 py-0.5 rounded-lg font-mono ${
                  rotationSpeed === 0.002 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setRotationSpeed(0.005)}
                className={`px-2 py-0.5 rounded-lg font-mono ${
                  rotationSpeed === 0.005 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                2.5x
              </button>
            </div>
          </div>

          {/* Guide d'interaction tactile / souris */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span className="hidden md:inline">🖱️ Glisser pour orienter • Molette pour zoomer</span>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              Rayon R = 6 371 km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
