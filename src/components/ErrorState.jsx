// ErrorState.jsx - Affichage convivial des erreurs avec suggestions de secours
import React from 'react';
import { AlertTriangle, RefreshCw, MapPin, Compass } from 'lucide-react';

const SUGGESTED_CITIES = [
  { name: 'Casablanca', country: 'Maroc', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Fès', country: 'Maroc', latitude: 34.0333, longitude: -5.0000, timezone: 'Africa/Casablanca' },
  { name: 'Tokyo', country: 'Japon', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Marrakech', country: 'Maroc', latitude: 31.6295, longitude: -7.9811, timezone: 'Africa/Casablanca' },
];

export default function ErrorState({ error, onRetry, onSelectCity }) {
  return (
    <div className="relative z-10 w-full mb-8">
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto border border-rose-500/30">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-['Outfit']">
          Oups ! Une erreur est survenue
        </h3>

        <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
          {error || "Impossible de charger les données météorologiques. Veuillez vérifier votre connexion ou le nom de la ville."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
        </div>

        {/* Suggested Cities Chips */}
        <div className="pt-6 border-t border-white/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            Essayez l'une de ces villes populaires :
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => onSelectCity(city)}
                className="glass-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-slate-200 hover:text-white cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-sky-400" />
                <span>{city.name}</span>
                <span className="text-slate-400 text-[10px]">({city.country})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
