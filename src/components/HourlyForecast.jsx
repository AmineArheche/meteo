// HourlyForecast.jsx - Prévisions heure par heure sur 24 heures
import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { convertTemp, formatHour } from '../services/weatherUtils';

export default function HourlyForecast({ hourly, unit }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="relative z-10 w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          Prévisions sur 24 Heures
        </h3>
        <span className="text-xs text-slate-400">Glisser pour voir plus →</span>
      </div>

      {/* Horizontal scrolling strip */}
      <div className="glass-panel rounded-3xl p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20">
        <div className="flex items-center gap-3 min-w-max pb-2 pt-1">
          {hourly.map((item, index) => {
            const isFirst = index === 0;
            const hourLabel = isFirst ? 'Maintenant' : formatHour(item.time);

            return (
              <div
                key={item.time}
                className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[5.5rem] transition-all duration-300 ${
                  isFirst
                    ? 'bg-sky-500/25 border border-sky-400/40 shadow-lg shadow-sky-500/20 scale-102'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Time Label */}
                <span className={`text-xs font-semibold ${isFirst ? 'text-sky-300' : 'text-slate-300'}`}>
                  {hourLabel}
                </span>

                {/* Weather Icon */}
                <div className="my-2.5">
                  <WeatherIcon
                    weatherCode={item.weatherCode}
                    isDay={item.isDay === 1}
                    className="w-8 h-8"
                  />
                </div>

                {/* Temperature */}
                <span className="text-base font-bold text-white font-['Outfit']">
                  {convertTemp(item.temperature, unit)}°
                </span>

                {/* Rain probability */}
                <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-full">
                  <Droplets className="w-3 h-3 text-sky-400" />
                  <span>{item.pop}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
