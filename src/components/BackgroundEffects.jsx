// BackgroundEffects.jsx - Effets d'ambiance et particules météorologiques animées
import React, { useMemo } from 'react';

export default function BackgroundEffects({ weatherCode, isDay = true }) {
  // Déterminer le type d'ambiance
  const atmosphere = useMemo(() => {
    // 0: Ciel dégagé, 1-2: Ensoleillé/peu nuageux
    if (weatherCode === 0 || weatherCode === 1) {
      return isDay ? 'sunny' : 'night-clear';
    }
    // 2-3: Nuageux
    if (weatherCode === 2 || weatherCode === 3) {
      return isDay ? 'cloudy-day' : 'cloudy-night';
    }
    // 45, 48: Brouillard
    if (weatherCode === 45 || weatherCode === 48) {
      return 'fog';
    }
    // 51-65, 80-82: Pluie
    if ((weatherCode >= 51 && weatherCode <= 65) || (weatherCode >= 80 && weatherCode <= 82)) {
      return weatherCode >= 65 || weatherCode === 82 ? 'rain-heavy' : 'rain-light';
    }
    // 71-77, 85-86: Neige
    if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
      return 'snow';
    }
    // 95-99: Orage
    if (weatherCode >= 95) {
      return 'thunderstorm';
    }
    return isDay ? 'sunny' : 'night-clear';
  }, [weatherCode, isDay]);

// Helper déterministe pour éviter les fonctions impures au rendu
function pseudoRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

  // Génération aléatoire d'étoiles pour la nuit
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${(pseudoRandom(i * 1.1) * 85).toFixed(1)}%`,
      left: `${(pseudoRandom(i * 2.3) * 98).toFixed(1)}%`,
      size: `${(pseudoRandom(i * 3.7) * 2.5 + 1).toFixed(1)}px`,
      duration: `${(pseudoRandom(i * 4.9) * 3 + 2).toFixed(1)}s`,
      delay: `${(pseudoRandom(i * 5.2) * 4).toFixed(1)}s`,
    }));
  }, []);

  // Gouttes de pluie
  const rainDrops = useMemo(() => {
    const count = atmosphere === 'rain-heavy' || atmosphere === 'thunderstorm' ? 55 : 25;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(pseudoRandom(i * 7.1) * 100).toFixed(1)}%`,
      duration: `${(pseudoRandom(i * 8.3) * 0.4 + 0.5).toFixed(2)}s`,
      delay: `${(pseudoRandom(i * 9.7) * 2).toFixed(2)}s`,
      height: `${(pseudoRandom(i * 11.3) * 18 + 12).toFixed(0)}px`,
      opacity: Number((pseudoRandom(i * 13.9) * 0.5 + 0.3).toFixed(2)),
    }));
  }, [atmosphere]);

  // Flocons de neige
  const snowflakes = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${(pseudoRandom(i * 17.1) * 100).toFixed(1)}%`,
      duration: `${(pseudoRandom(i * 19.3) * 4 + 3).toFixed(1)}s`,
      delay: `${(pseudoRandom(i * 23.7) * 5).toFixed(1)}s`,
      size: `${(pseudoRandom(i * 29.1) * 5 + 3).toFixed(1)}px`,
      opacity: Number((pseudoRandom(i * 31.3) * 0.6 + 0.3).toFixed(2)),
    }));
  }, []);

  // Dégradés de fond selon l'ambiance
  const getGradientClasses = () => {
    switch (atmosphere) {
      case 'sunny':
        return 'from-amber-600/30 via-sky-600/30 to-blue-900/60 bg-gradient-to-br';
      case 'night-clear':
        return 'from-slate-950 via-indigo-950/70 to-slate-900 bg-gradient-to-b';
      case 'cloudy-day':
        return 'from-slate-700/40 via-blue-900/30 to-slate-950 bg-gradient-to-br';
      case 'cloudy-night':
        return 'from-slate-950 via-slate-900 to-indigo-950/80 bg-gradient-to-b';
      case 'rain-light':
      case 'rain-heavy':
        return 'from-slate-900 via-sky-950/80 to-blue-950 bg-gradient-to-b';
      case 'thunderstorm':
        return 'from-indigo-950 via-purple-950/60 to-slate-950 bg-gradient-to-b';
      case 'snow':
        return 'from-sky-900/40 via-slate-800/50 to-slate-950 bg-gradient-to-br';
      case 'fog':
        return 'from-slate-800/60 via-slate-900/80 to-slate-950 bg-gradient-to-b';
      default:
        return 'from-sky-900/40 via-slate-900 to-slate-950 bg-gradient-to-br';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Background Gradient */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${getGradientClasses()}`} />

      {/* Ambiance Soleil / Rayons lumineux */}
      {atmosphere === 'sunny' && (
        <>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-20 right-40 w-72 h-72 bg-sky-400/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Ambiance Étoiles (Nuit claire) */}
      {(atmosphere === 'night-clear' || atmosphere === 'cloudy-night') && (
        <>
          <div className="absolute top-10 right-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          {atmosphere === 'night-clear' && stars.map(star => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            />
          ))}
        </>
      )}

      {/* Nuages flottants */}
      {(atmosphere === 'cloudy-day' || atmosphere === 'cloudy-night' || atmosphere === 'fog' || atmosphere === 'rain-light') && (
        <>
          <div className="absolute top-12 -left-20 w-96 h-40 bg-slate-400/10 rounded-full blur-2xl animate-float" />
          <div className="absolute top-48 right-0 w-[30rem] h-52 bg-slate-500/10 rounded-full blur-3xl animate-float-reverse" />
        </>
      )}

      {/* Pluie animée */}
      {(atmosphere === 'rain-light' || atmosphere === 'rain-heavy' || atmosphere === 'thunderstorm') && (
        <div className="absolute inset-0">
          {rainDrops.map(drop => (
            <div
              key={drop.id}
              className="raindrop-item absolute w-[1.5px] bg-gradient-to-b from-sky-200/60 to-blue-400/20 rounded-full"
              style={{
                left: drop.left,
                height: drop.height,
                animationDuration: drop.duration,
                animationDelay: drop.delay,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* Éclairs Orage */}
      {atmosphere === 'thunderstorm' && (
        <div className="lightning-flash absolute inset-0 bg-indigo-200/20 backdrop-blur-xs" />
      )}

      {/* Neige animée */}
      {atmosphere === 'snow' && (
        <div className="absolute inset-0">
          {snowflakes.map(flake => (
            <div
              key={flake.id}
              className="snowflake-item absolute rounded-full bg-white shadow-[0_0_8px_white]"
              style={{
                left: flake.left,
                width: flake.size,
                height: flake.size,
                animationDuration: flake.duration,
                animationDelay: flake.delay,
                opacity: flake.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle Grid Overlay for modern cyber/glass aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-slate-950/40 to-slate-950/80 pointer-events-none" />
    </div>
  );
}
