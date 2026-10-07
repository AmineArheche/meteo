// radarService.js - Service RainViewer & MyRadar API Live Tiles
const RAINVIEWER_API = 'https://api.rainviewer.com/public/weather-maps.json';

// Palettes radar officielles RainViewer
export const RADAR_COLOR_SCHEMES = [
  { id: 2, name: 'Doppler Universel', desc: 'Standard international (Bleu > Vert > Jaune > Rouge > Magenta)' },
  { id: 1, name: 'RainViewer Classique', desc: 'Palette contrastée ultra-haute résolution' },
  { id: 3, name: 'TITAN Storm', desc: 'Analyse d\'orages sévères et supercellules' },
  { id: 4, name: 'Weather Channel', desc: 'Palette intuitive grand public' },
  { id: 6, name: 'NEXRAD Level III', desc: 'Précision météo professionnelle américaine' },
  { id: 8, name: 'Dark Sky Tactical', desc: 'Contraste sombre optimisé pour cockpit' },
];

// Échelle dBZ avec descriptions précises (RainViewer & MyRadar)
export const DBZ_SCALE = [
  { dbz: 10, label: 'Bruine légère', color: '#00e5ff', rate: '0.1 - 0.5 mm/h' },
  { dbz: 20, label: 'Pluie faible', color: '#00b0ff', rate: '0.5 - 2 mm/h' },
  { dbz: 30, label: 'Pluie modérée', color: '#00e676', rate: '2 - 6 mm/h' },
  { dbz: 40, label: 'Averse soutenue', color: '#ffea00', rate: '6 - 15 mm/h' },
  { dbz: 50, label: 'Forte pluie / Orage', color: '#ff9100', rate: '15 - 35 mm/h' },
  { dbz: 60, label: 'Orage violent / Grêle', color: '#ff1744', rate: '> 35 mm/h' },
  { dbz: 70, label: 'Supercellule extrême', color: '#d500f9', rate: '> 70 mm/h' },
];

/**
 * Récupère les métadonnées et frames radar en temps réel depuis RainViewer
 */
export async function fetchRadarMetadata() {
  try {
    const response = await fetch(RAINVIEWER_API);
    if (!response.ok) {
      throw new Error(`RainViewer API indisponible (${response.status})`);
    }
    const data = await response.json();
    const host = data.host || 'https://tilecache.rainviewer.com';
    const past = data.radar?.past || [];
    const nowcast = data.radar?.nowcast || [];
    const satellite = data.satellite?.infrared || [];

    // Combiner frames passées et prévisionnelles
    const allFrames = [
      ...past.map((frame, index) => ({
        ...frame,
        type: 'past',
        isNowcast: false,
        relativeMinutes: -Math.round((past[past.length - 1]?.time - frame.time) / 60),
        label: formatTime(frame.time),
      })),
      ...nowcast.map((frame) => ({
        ...frame,
        type: 'nowcast',
        isNowcast: true,
        relativeMinutes: Math.round((frame.time - past[past.length - 1]?.time) / 60),
        label: `+${Math.round((frame.time - past[past.length - 1]?.time) / 60)} min (${formatTime(frame.time)})`,
      })),
    ];

    return {
      host,
      generated: data.generated,
      frames: allFrames,
      pastFrames: past,
      nowcastFrames: nowcast,
      satelliteFrames: satellite,
      currentFrameIndex: Math.max(0, past.length - 1),
    };
  } catch (error) {
    console.warn('Erreur chargement RainViewer API, utilisation des données de secours:', error);
    return createFallbackRadarData();
  }
}

/**
 * Construit l'URL du tile RainViewer
 */
export function getRadarTileTemplate(host, path, colorScheme = 2, smooth = true, snow = true) {
  if (!host || !path) return '';
  const options = `${smooth ? '1' : '0'}_${snow ? '1' : '0'}`;
  return `${host}${path}/256/{z}/{x}/{y}/${colorScheme}/${options}.png`;
}

/**
 * Construit l'URL de tuile Satellite Infrarouge
 */
export function getSatelliteTileTemplate(host, path) {
  if (!host || !path) return '';
  return `${host}${path}/256/{z}/{x}/{y}/0/0_0.png`;
}

function formatTime(unixTimestamp) {
  if (!unixTimestamp) return '';
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createFallbackRadarData() {
  const now = Math.floor(Date.now() / 1000);
  const frames = [];
  for (let i = 12; i >= 0; i--) {
    const time = now - i * 600;
    frames.push({
      time,
      path: '/v2/radar/sample',
      type: 'past',
      isNowcast: false,
      relativeMinutes: -i * 10,
      label: formatTime(time),
    });
  }
  return {
    host: 'https://tilecache.rainviewer.com',
    generated: now,
    frames,
    pastFrames: frames,
    nowcastFrames: [],
    satelliteFrames: [],
    currentFrameIndex: frames.length - 1,
  };
}
