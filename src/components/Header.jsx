// Header.jsx - Barre de navigation supérieure (RainViewer & MyRadar Styling)
import React from 'react';
import {
  Globe,
  Radio,
  Navigation,
  RefreshCw,
  CloudRain,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  Columns,
  Activity
} from 'lucide-react';

export default function Header({
  unit,
  onToggleUnit,
  onCurrentLocation,
  onRefresh,
  loading,
  lastUpdated,
  activeTab,
  onSelectTab,
}) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null;

  const tabs = [
    { id: 'globe', name: 'Globe 3D Terre', icon: Globe, badge: 'NASA 3D' },
    { id: 'radar', name: 'Radar Doppler Live', icon: Radio, badge: 'Live 100m' },
    { id: 'nowcast', name: 'Nowcast 120 min', icon: Clock, badge: 'RainViewer' },
    { id: 'split', name: 'Cockpit Mixte', icon: Columns, badge: 'Pro' },
    { id: 'dashboard', name: 'Météo & Prévisions', icon: LayoutDashboard },
    { id: 'alerts', name: 'Alertes & Tempêtes', icon: ShieldAlert, badge: 'MyRadar' },
  ];

  return (
    <header className="relative z-20 w-full mb-6 space-y-3">
      {/* Barre Principale */}
      <div className="glass-panel rounded-3xl px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/25 bg-slate-950/80 backdrop-blur-2xl shadow-2xl">
        {/* Brand & Statuts Radar Live */}
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400/40">
            <Radio className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit'] flex items-center gap-1.5">
                <span>RainRadar</span>
                <span className="text-cyan-400">Pro</span>
              </h1>
              <span className="text-[10px] font-mono uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hidden sm:inline-block">
                RainViewer &amp; MyRadar
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                1200+ Radars Connectés
              </span>
              <span>•</span>
              <span>Résolution 100m</span>
              {formattedTime && (
                <>
                  <span>•</span>
                  <span>Direct : <strong className="text-slate-200">{formattedTime}</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contrôles d'action rapide */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Bouton GPS */}
          <button
            onClick={onCurrentLocation}
            title="Localiser par GPS"
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 disabled:opacity-50 transition-all cursor-pointer shadow-md"
          >
            <Navigation className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Ma Position</span>
          </button>

          {/* Commutateur d'unité °C / °F */}
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center gap-1 shadow-md">
            <button
              onClick={() => unit !== 'C' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                unit === 'C'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => unit !== 'F' && onToggleUnit()}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                unit === 'F'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Bouton Rafraîchir */}
          <button
            onClick={onRefresh}
            title="Rafraîchir les données radar et météo"
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 disabled:opacity-50 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Barre d'onglets de navigation tactique (RainViewer & MyRadar Views) */}
      <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 border border-cyan-300/50'
                  : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
              <span>{tab.name}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md font-black ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
