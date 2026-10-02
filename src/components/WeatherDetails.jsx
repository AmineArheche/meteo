// WeatherDetails.jsx - Grille de widgets détaillés des conditions météo
import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Gauge,
  Eye,
  Sunrise,
  Sunset,
  Navigation2,
} from 'lucide-react';
import {
  formatWindSpeed,
  getWindDirection,
  getUVIndexInfo,
  formatTemperature,
  formatHour,
  calculateSunProgress,
} from '../services/weatherUtils';

export default function WeatherDetails({ current, unit }) {
  if (!current) return null;

  const uvInfo = getUVIndexInfo(current.uvIndex);
  const windDirLabel = getWindDirection(current.windDirection);
  const sunProgress = calculateSunProgress(current.sunriseToday, current.sunsetToday);

  return (
    <div className="relative z-10 w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Indicateurs Météorologiques Détaillés
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Vent & Rafales */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vent & Rafales</span>
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 group-hover:scale-110 transition-transform">
              <Wind className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-['Outfit']">
                {formatWindSpeed(current.windSpeed, unit)}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rafales jusqu'à <span className="text-slate-200 font-medium">{formatWindSpeed(current.windGusts, unit)}</span>
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
            <div
              className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-300 transition-transform duration-700"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            >
              <Navigation2 className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{windDirLabel}</span>
          </div>
        </div>

        {/* 2. Humidité & Point de Rosée */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Humidité de l'Air</span>
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 group-hover:scale-110 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-['Outfit']">
                {current.humidity}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${current.humidity}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Point de rosée</span>
            <span className="text-white font-medium">{formatTemperature(current.dewPoint, unit)}</span>
          </div>
        </div>

        {/* 3. Indice UV */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Indice UV</span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition-transform">
              <Sun className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl font-extrabold text-white font-['Outfit']">
                {Math.round(current.uvIndex)}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${uvInfo.bg} ${uvInfo.color}`}>
                {uvInfo.level}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`${uvInfo.barColor} h-full rounded-full transition-all duration-1000`}
                style={{ width: `${Math.min(100, (current.uvIndex / 11) * 100)}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-slate-400 truncate">
            {uvInfo.advice}
          </div>
        </div>

        {/* 4. Pression Atmosphérique */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pression</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
              <Gauge className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white font-['Outfit']">
                {current.pressure}
              </span>
              <span className="text-xs text-slate-400 font-medium">hPa</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {current.pressure >= 1020 ? 'Anticyclonique (Temps stable)' : current.pressure <= 1005 ? 'Dépressionnaire (Instable)' : 'Pression normale'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Niveau de la mer</span>
            <span className="text-emerald-400 font-medium">Standard</span>
          </div>
        </div>

        {/* 5. Visibilité */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Visibilité</span>
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 group-hover:scale-110 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-white font-['Outfit']">
                {current.visibilityKm}
              </span>
              <span className="text-xs text-slate-400 font-medium">km</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {current.visibilityKm >= 10 ? 'Visibilité dégagée et excellente' : current.visibilityKm >= 5 ? 'Visibilité modérée' : 'Brouillard / Brume épaisse'}
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Qualité atmosphérique</span>
            <span className="text-indigo-300 font-medium">Bonne</span>
          </div>
        </div>

        {/* 6. Lever & Coucher du Soleil avec Arc Solaire */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Éphéméride Solaire</span>
            <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 group-hover:scale-110 transition-transform">
              <Sunrise className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Sunrise className="w-4 h-4" />
                <span>{current.sunriseToday ? formatHour(current.sunriseToday) : '--:--'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-300">
                <Sunset className="w-4 h-4" />
                <span>{current.sunsetToday ? formatHour(current.sunsetToday) : '--:--'}</span>
              </div>
            </div>

            {/* Arc / Barre de progression de la journée */}
            <div className="relative w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 via-yellow-300 to-rose-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${sunProgress}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
            <span>Progression du jour</span>
            <span className="text-amber-400 font-medium">{sunProgress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
