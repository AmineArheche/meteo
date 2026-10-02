// SearchBar.jsx - Barre de recherche avec autocomplétion intelligente et suggestions
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Loader2 } from 'lucide-react';
import { searchCities } from '../services/weatherService';

export default function SearchBar({ onSelectCity, onSearchSubmit, loading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  // Debounced API search for auto-completion
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (e) {
        console.error('Erreur recherche suggestions:', e);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    setQuery(`${city.name}${city.country ? ', ' + city.country : ''}`);
    setIsOpen(false);
    setSuggestions([]);
    onSelectCity(city);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      setIsOpen(false);
      onSearchSubmit(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchContainerRef} className="relative z-30 w-full mb-5">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            setSelectedIndex(-1);
            if (val.trim().length < 2) {
              setSuggestions([]);
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une ville (ex: Fès, Casablanca, Paris, Tokyo)..."
          className="glass-input w-full pl-12 pr-24 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base placeholder:text-slate-400/80 shadow-xl focus:shadow-sky-500/10"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Explorer
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 glass-panel bg-slate-900/90 rounded-2xl overflow-hidden shadow-2xl border border-white/20 divide-y divide-white/5 animate-in fade-in duration-200">
          <div className="px-4 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-950/40">
            Villes suggérées ({suggestions.length})
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {suggestions.map((city, idx) => (
              <li key={city.id || `${city.name}-${idx}`}>
                <button
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors cursor-pointer ${
                    selectedIndex === idx
                      ? 'bg-sky-500/20 text-white'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm sm:text-base text-white">
                        {city.name}
                      </span>
                      {city.admin1 && (
                        <span className="text-xs text-slate-400 ml-2 font-normal">
                          ({city.admin1})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                    {city.country || 'Monde'}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
