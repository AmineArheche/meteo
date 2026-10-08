// SevereWeatherTracker.jsx - Module de suivi des Alertes Sévères & Tempêtes (MyRadar Signature)
import React, { useState } from 'react';
import {
  Zap,
  Wind,
  ShieldAlert,
  Volume2,
  VolumeX
} from 'lucide-react';
import { soundAlerts } from '../services/soundAlerts.js';

const MOCK_SEVERE_ALERTS = [
  {
    id: 'alert-1',
    type: 'Orage Supercellulaire',
    severity: 'warning',
    urgency: 'Imminente',
    headline: 'Activité convective intense avec risque de grêle localisée',
    area: 'Rayon de 45 km autour de la station radar',
    issued: 'Il y a 14 min',
    expires: 'Dans 2h',
    dbzPeak: 62,
    windGusts: '85 km/h',
  },
  {
    id: 'alert-2',
    type: 'Vents Violents & Rafales',
    severity: 'watch',
    urgency: 'Attendue',
    headline: 'Rafales de vent supérieures à 70 km/h sous les grains',
    area: 'Couloir littoral et reliefs exposés',
    issued: 'Il y a 35 min',
    expires: 'Dans 4h',
    dbzPeak: 48,
    windGusts: '75 km/h',
  },
  {
    id: 'alert-3',
    type: 'Risque Hydrologique / Ruissellement',
    severity: 'advisory',
    urgency: 'Surveillance',
    headline: 'Cumuls de pluie rapides pouvant atteindre 30mm en 1 heure',
    area: 'Zones basses et axes routiers',
    issued: 'Il y a 1h',
    expires: 'Dans 6h',
    dbzPeak: 54,
    windGusts: '55 km/h',
  },
];

const MOCK_STORM_CELLS = [
  {
    id: 'CELL-A4',
    name: 'Cellule Alpha-4',
    intensity: '58 dBZ',
    type: 'Orage Violent',
    speed: '48 km/h',
    heading: '045° (NE)',
    hailProbability: '75%',
    topAltitude: '12 500 m',
    status: 'En renforcement',
  },
  {
    id: 'CELL-B2',
    name: 'Cellule Bravo-2',
    intensity: '46 dBZ',
    type: 'Averse Convective',
    speed: '36 km/h',
    heading: '070° (ENE)',
    hailProbability: '25%',
    topAltitude: '9 200 m',
    status: 'Stable',
  },
  {
    id: 'CELL-C9',
    name: 'Cellule Charlie-9',
    intensity: '64 dBZ',
    type: 'Supercellule / Grêle',
    speed: '55 km/h',
    heading: '030° (NNE)',
    hailProbability: '90%',
    topAltitude: '14 800 m',
    status: 'Pic critique',
  },
];

export default function SevereWeatherTracker({ activeLocation: _activeLocation, onFocusCell: _onFocusCell }) {
  const [selectedTab, setSelectedTab] = useState('alerts'); // 'alerts', 'cells', 'tropical'
  const [isMuted, setIsMuted] = useState(soundAlerts.isMuted());

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-2xl border border-red-500/20 shadow-2xl space-y-5">
      {/* En-tête MyRadar Tactical */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-400/30">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
              Surveillance Météo Sévère & Traqueurs de Tempêtes
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              MyRadar Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Détection automatique des cellules orageuses, supercellules et vigilances météo
          </p>
        </div>

        {/* Commandes et Onglets */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Bouton Sirène Audio Synthétisée */}
          <button
            onClick={() => {
              const nowMuted = soundAlerts.toggleMute();
              setIsMuted(nowMuted);
              if (!nowMuted) {
                soundAlerts.playSevereWarningBeep();
              }
            }}
            title={isMuted ? 'Activer les alertes sonores' : 'Couper les alertes sonores'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-semibold transition-all ${
              !isMuted
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-slate-800/80 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Audio Actif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Muet</span>
              </>
            )}
          </button>

          {/* Onglets de catégories */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setSelectedTab('alerts')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedTab === 'alerts'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vigilances (3)
            </button>
            <button
              onClick={() => setSelectedTab('cells')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedTab === 'cells'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cellules Radar (3)
            </button>
            <button
              onClick={() => setSelectedTab('tropical')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedTab === 'tropical'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Systèmes Tropicaux
            </button>
          </div>
        </div>
      </div>

      {/* Vue 1 : Alertes & Bulletins de vigilance */}
      {selectedTab === 'alerts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MOCK_SEVERE_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-red-500/40 transition-all space-y-3 relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  alert.severity === 'warning'
                    ? 'bg-red-500'
                    : alert.severity === 'watch'
                    ? 'bg-amber-500'
                    : 'bg-cyan-500'
                }`}
              />

              <div className="flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                    alert.severity === 'warning'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : alert.severity === 'watch'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}
                >
                  {alert.type}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{alert.issued}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {alert.headline}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{alert.area}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1 text-red-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Pic : {alert.dbzPeak} dBZ</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Wind className="w-3.5 h-3.5" />
                  <span>{alert.windGusts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue 2 : Traqueur de cellules orageuses doppler */}
      {selectedTab === 'cells' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MOCK_STORM_CELLS.map((cell) => (
              <div
                key={cell.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      {cell.id}
                    </span>
                    <span className="text-xs font-bold text-white">{cell.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                    {cell.intensity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Vitesse & Cap</span>
                    <strong className="text-white font-mono">{cell.speed} • {cell.heading}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Risque Grêle</span>
                    <strong className="text-amber-400 font-mono">{cell.hailProbability}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Sommet Écho</span>
                    <strong className="text-slate-300 font-mono">{cell.topAltitude}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Tendance</span>
                    <strong className="text-cyan-300">{cell.status}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vue 3 : Systèmes Tropicaux & Cyclones (MyRadar Signature) */}
      {selectedTab === 'tropical' && (
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                Surveillance Globale
              </span>
              <h3 className="text-sm font-bold text-white">
                Bassin Atlantique & Océan Indien
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Aucun cyclone ou dépression tropicale majeure ne menace directement la zone géographique immédiate. Suivi satellitaire NOAA / NHC en veille active.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Activité Cyclonique Nominale
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
