// Footer.jsx - Pied de page officiel avec profil développeur Full-Stack & GitHub
import React from 'react';
import { Cloud, ShieldCheck, Code2, Globe, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full mt-14 pt-8 pb-10 border-t border-white/10 bg-slate-950/70 backdrop-blur-xl text-center text-xs text-slate-400">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Ligne principale : Développeur & Profils */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 p-4 rounded-2xl bg-slate-900/60 border border-white/5 shadow-xl">
          {/* Identité Développeur */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 font-black text-sm">
              AA
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="text-sm font-bold text-white tracking-wide">Amine Arheche</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  <Code2 className="w-3 h-3 text-sky-400" />
                  Full-Stack Web Developer
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <span>Crafted with</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse inline" />
                <span>for weather & aerology enthusiasts</span>
              </p>
            </div>
          </div>

          {/* Liens GitHub & Portfolio */}
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {/* Profil GitHub */}
            <a
              href="https://github.com/AmineArheche"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil GitHub Amine Arheche"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-sky-500/50 transition-all duration-200 shadow-md group"
            >
              <svg className="w-4 h-4 fill-current text-slate-300 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="font-semibold text-xs">GitHub Profile</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-400 transition-colors" />
            </a>

            {/* Dépôt GitHub Meteo */}
            <a
              href="https://github.com/AmineArheche/meteo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Code source sur GitHub"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 hover:border-indigo-500/50 transition-all duration-200 shadow-md group"
            >
              <Code2 className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
              <span className="font-semibold text-xs">Repository</span>
            </a>

            {/* Portfolio Personnel */}
            <a
              href="https://aminearheche.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Site Web Portfolio Amine Arheche"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 hover:text-sky-200 border border-sky-500/30 hover:border-sky-500/60 transition-all duration-200 shadow-md group"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-xs">Portfolio</span>
            </a>
          </div>
        </div>

        {/* Ligne secondaire : Métadonnées de l'application & API */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <Cloud className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-200">RainRadar Pro v2.1</span>
            <span className="text-slate-600">•</span>
            <span>NASA 3D Earth GLTF & RainViewer Doppler Radar</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 flex-wrap justify-center">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Open Data (WMO / Esri)
            </span>
            <span className="text-slate-700">|</span>
            <span>© {currentYear} Amine Arheche — Tous droits réservés</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
