// CurrentWeather.jsx - Dashboard principal de la météo actuelle
import React from 'react';
import { Star, MapPin, Calendar, Clock, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  getWeatherDetailsByCode,
  formatTemperature,
  convertTemp,
} from '../services/weatherUtils';

export default function CurrentWeather({
  weatherData,
  unit,
  isFavorite,
  onToggleFavorite,
}) {
  if (!weatherData) return null;

  const { location, current } = weatherData;
  const weatherDetails = getWeatherDetailsByCode(current.weatherCode, current.isDay);

  // Formatage date locale
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  const isFav = isFavorite(location.name, location.country);

  return (
    <div className="relative z-10 w-full mb-6">
      <div className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:border-white/30">
        {/* Glow ambient background inside card */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Location & Date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between md:justify-start gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-inner">
                  <MapPin className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-['Outfit']">
                      {location.name}
                    </h2>
                    {location.countryCode && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                        {location.countryCode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {location.admin1 ? `${location.admin1}, ` : ''}{location.country || 'Monde'}
                  </p>
                </div>
              </div>

              {/* Toggle Favorite Button */}
              <button
                onClick={() => onToggleFavorite(location)}
                title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                  isFav
                    ? 'bg-amber-400/20 text-amber-400 border border-amber-400/40 shadow-lg shadow-amber-500/20'
                    : 'glass-card text-slate-400 hover:text-amber-300 hover:bg-white/15'
                }`}
              >
                <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>

            {/* Date and Status Badge */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {dateCapitalized}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {current.isDay ? 'Jour' : 'Nuit'}
              </span>
            </div>
          </div>

          {/* Center / Right Column: Temperature, Icon and Condition */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-6 sm:gap-10 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
            {/* Animated Weather Icon */}
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/15 shadow-inner backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <WeatherIcon
                  weatherCode={current.weatherCode}
                  isDay={current.isDay}
                  className="w-16 h-16 sm:w-20 sm:h-20"
                />
              </div>
            </div>

            {/* Temperature & Details */}
            <div className="space-y-1 text-right sm:text-left md:text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent font-['Outfit']">
                  {convertTemp(current.temperature, unit)}
                </span>
                <span className="text-2xl sm:text-3xl font-light text-sky-400">
                  °{unit}
                </span>
              </div>

              {/* Weather Condition Label */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/30 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                {weatherDetails.label}
              </div>

              {/* Feels like & Min / Max */}
              <div className="pt-2 flex flex-col sm:flex-row md:flex-col items-end gap-1 text-xs text-slate-300">
                <div>
                  Ressenti : <span className="text-white font-semibold">{formatTemperature(current.feelsLike, unit)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-emerald-300 font-medium">
                    <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
                    {formatTemperature(current.tempMaxToday, unit)}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="flex items-center text-sky-300 font-medium">
                    <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
                    {formatTemperature(current.tempMinToday, unit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
