// FavoritesBar.jsx - Barre d'accès rapide aux villes favorites
import React from 'react';
import { Star, X, MapPin } from 'lucide-react';

export default function FavoritesBar({
  favorites,
  activeCityName,
  onSelectFavorite,
  onRemoveFavorite,
}) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="relative z-10 w-full mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400/90 pl-1 pr-2 shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-400/30" />
          <span className="hidden sm:inline">Favoris :</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {favorites.map((fav) => {
            const isActive = activeCityName?.toLowerCase() === fav.name?.toLowerCase();
            return (
              <div
                key={fav.name}
                className={`group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'glass-pill-active'
                    : 'glass-pill text-slate-300 hover:text-white'
                }`}
              >
                <button
                  onClick={() => onSelectFavorite(fav)}
                  className="flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <MapPin className="w-3 h-3 text-sky-400" />
                  <span>{fav.name}</span>
                  {fav.country && (
                    <span className="text-[10px] opacity-75">
                      ({fav.country.slice(0, 3).toUpperCase()})
                    </span>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(fav.name);
                  }}
                  title={`Retirer ${fav.name} des favoris`}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
