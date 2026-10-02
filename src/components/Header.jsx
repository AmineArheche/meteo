// Header.jsx - Barre de navigation supérieure
import React from 'react';
import { CloudSun, Navigation, RefreshCw } from 'lucide-react';

export default function Header({
  unit,
  onToggleUnit,
  onCurrentLocation,
  onRefresh,
  loading,
  lastUpdated
}) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="relative z-10 w-full mb-6">
      <div className="glass-panel rounded-2xl px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 ring-1 ring-white/20">
            <CloudSun className="w-6 h-6 text-white animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-200 bg-clip-text text-transparent font-['Outfit']">
                AeroCast
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Live
              </span>
            </div>
            {formattedTime && (
              <p className="text-xs text-slate-400">
                Mis à jour à <span className="text-slate-200 font-medium">{formattedTime}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          {/* Geolocation Button */}
          <button
            onClick={onCurrentLocation}
            title="Utiliser ma position GPS actuelle"
            disabled={loading}
            className="glass-pill flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-sky-500/20 hover:border-sky-400/40 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Navigation className={`w-4 h-4 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Ma Position</span>
          </button>

          {/* Unit Switcher °C / °F */}
          <div className="p-1 glass-card rounded-xl flex items-center gap-1">
            <button
              onClick={() => unit !== 'C' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'F' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Rafraîchir les prévisions"
            disabled={loading}
            className="glass-pill p-2 sm:p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
