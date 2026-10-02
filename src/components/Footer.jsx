// Footer.jsx - Pied de page avec métadonnées et sources de données
import React from 'react';
import { Cloud, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-10 w-full mt-10 pt-6 pb-8 border-t border-white/10 text-center text-xs text-slate-400">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <Cloud className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-white">AeroCast Météo Pro</span>
          <span className="text-slate-500">•</span>
          <span>Données en temps réel Open-Meteo (WMO)</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Gratuit & Sans Clé API
          </span>
          <span className="text-slate-600">|</span>
          <span>React • Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
