import React from 'react';
import { CalendarDays, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  getWeatherDetailsByCode,
  convertTemp,
  formatDayName,
} from '../services/weatherUtils';

export default function DailyForecast({ daily, unit }) {
  if (!daily || daily.length === 0) return null;

  // Calcul du min absolu et max absolu pour calibrer les barres visuelles
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const minTempGlobal = Math.min(...allMins);
  const maxTempGlobal = Math.max(...allMaxs);
  const tempRange = Math.max(1, maxTempGlobal - minTempGlobal);

  return (
    <div className="relative z-10 w-full mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-200 tracking-wide uppercase flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-sky-400" />
          Prévisions sur 7 Jours
        </h3>
        <span className="text-xs text-slate-400 font-medium">Semaine à venir</span>
      </div>

      <div className="glass-panel rounded-3xl p-4 sm:p-6 divide-y divide-white/10">
        {daily.map((day) => {
          const details = getWeatherDetailsByCode(day.weatherCode, true);
          const dayTitle = formatDayName(day.date, day.isToday);

          // Calcul des proportions pour la barre de température
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - minTempGlobal) / tempRange) * 100));
          const widthPercent = Math.max(15, Math.min(100 - leftPercent, ((day.tempMax - day.tempMin) / tempRange) * 100));

          return (
            <div
              key={day.date}
              className={`py-3.5 sm:py-4 px-2 sm:px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl transition-all duration-200 ${
                day.isToday ? 'bg-white/5' : 'hover:bg-white/[0.04]'
              }`}
            >
              {/* Day & Condition */}
              <div className="flex items-center gap-4 sm:w-1/3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                  <WeatherIcon
                    weatherCode={day.weatherCode}
                    isDay={true}
                    className="w-6 h-6"
                    animated={false}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm sm:text-base font-bold ${day.isToday ? 'text-sky-400' : 'text-white'}`}>
                      {dayTitle}
                    </span>
                    {day.isToday && (
                      <span className="text-[10px] uppercase font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-400/30">
                        Auj.
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 capitalize">
                    {details.label}
                  </p>
                </div>
              </div>

              {/* Rain Chance */}
              <div className="flex items-center gap-1.5 sm:w-1/6 text-xs text-sky-300 font-medium">
                {day.popMax > 0 ? (
                  <div className="flex items-center gap-1 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-400/20">
                    <Droplets className="w-3.5 h-3.5 text-sky-400" />
                    <span>{day.popMax}%</span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs">Sec</span>
                )}
              </div>

              {/* Min - Max Temperature Bar */}
              <div className="flex items-center gap-3 sm:w-1/2 justify-end">
                <span className="text-xs sm:text-sm font-semibold text-slate-400 w-10 text-right">
                  {convertTemp(day.tempMin, unit)}°
                </span>

                {/* Visual Gradient Temperature Range Bar */}
                <div className="flex-1 max-w-[160px] h-2 bg-white/10 rounded-full relative overflow-hidden hidden sm:block">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 shadow-sm"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-sm sm:text-base font-bold text-white w-10 text-left">
                  {convertTemp(day.tempMax, unit)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
