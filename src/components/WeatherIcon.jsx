// WeatherIcon.jsx - Rendu d'icônes météo stylisées et animées
import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudHail,
} from 'lucide-react';
import { getWeatherDetailsByCode } from '../services/weatherUtils';

export default function WeatherIcon({ weatherCode = 0, isDay = true, className = 'w-8 h-8', animated = true }) {
  const details = getWeatherDetailsByCode(weatherCode, isDay);

  const getIconElement = () => {
    const iconClass = `${className} transition-transform duration-300`;

    switch (details.iconName) {
      case 'Sun':
        return <Sun className={`${iconClass} text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] ${animated ? 'animate-spin-slow' : ''}`} />;
      case 'Moon':
        return <Moon className={`${iconClass} text-indigo-300 drop-shadow-[0_0_12px_rgba(165,180,252,0.5)] ${animated ? 'animate-pulse-slow' : ''}`} />;
      case 'CloudSun':
        return <CloudSun className={`${iconClass} text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)] ${animated ? 'animate-float' : ''}`} />;
      case 'CloudMoon':
        return <CloudMoon className={`${iconClass} text-indigo-300 drop-shadow-[0_0_10px_rgba(165,180,252,0.4)] ${animated ? 'animate-float' : ''}`} />;
      case 'Cloud':
        return <Cloud className={`${iconClass} text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)] ${animated ? 'animate-float' : ''}`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${iconClass} text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]`} />;
      case 'CloudRain':
      case 'CloudRainWind':
        return <CloudRain className={`${iconClass} text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]`} />;
      case 'CloudSnow':
      case 'Snowflake':
        return <CloudSnow className={`${iconClass} text-cyan-200 drop-shadow-[0_0_12px_rgba(165,243,252,0.7)]`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${iconClass} text-yellow-300 drop-shadow-[0_0_14px_rgba(253,224,71,0.8)]`} />;
      case 'CloudFog':
        return <CloudFog className={`${iconClass} text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.4)]`} />;
      case 'CloudHail':
        return <CloudHail className={`${iconClass} text-blue-300 drop-shadow-[0_0_10px_rgba(147,197,253,0.5)]`} />;
      default:
        return <Sun className={`${iconClass} text-amber-400`} />;
    }
  };

  return <div className="inline-flex items-center justify-center">{getIconElement()}</div>;
}
