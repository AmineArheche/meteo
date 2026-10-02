// weatherUtils.js - Utilitaires de conversion, formatage et mapping météo

/**
 * Interprétation des codes météo standards WMO (World Meteorological Organization)
 * @param {number} code - Code météo WMO
 * @param {boolean} isDay - Indique s'il fait jour (1) ou nuit (0)
 */
export function getWeatherDetailsByCode(code, isDay = true) {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Ciel dégagé' : 'Nuit claire',
        iconName: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'sunny' : 'night',
        effect: isDay ? 'sun-rays' : 'stars',
        description: isDay ? 'Conditions ensoleillées et lumineuses' : 'Ciel étoilé et calme',
      };
    case 1:
      return {
        label: isDay ? 'Plutôt ensoleillé' : 'Nuit peu nuageuse',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: isDay ? 'sunny' : 'night',
        effect: isDay ? 'sun-rays' : 'stars',
        description: 'Quelques éclaircies passagères',
      };
    case 2:
      return {
        label: 'Partiellement nuageux',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        theme: isDay ? 'cloudy' : 'night',
        effect: 'clouds',
        description: 'Alternance de nuages et d’éclaircies',
      };
    case 3:
      return {
        label: 'Ciel couvert',
        iconName: 'Cloud',
        theme: 'cloudy',
        effect: 'clouds',
        description: 'Nuages denses et ciel gris',
      };
    case 45:
    case 48:
      return {
        label: 'Brouillard givrant',
        iconName: 'CloudFog',
        theme: 'cloudy',
        effect: 'fog',
        description: 'Visibilité réduite, prudence sur les routes',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Bruine légère',
        iconName: 'CloudDrizzle',
        theme: 'rainy',
        effect: 'rain',
        description: 'Fines gouttelettes intermittentes',
      };
    case 56:
    case 57:
      return {
        label: 'Bruine verglaçante',
        iconName: 'CloudHail',
        theme: 'snow',
        effect: 'snow',
        description: 'Risque de verglas sur les surfaces',
      };
    case 61:
      return {
        label: 'Pluie faible',
        iconName: 'CloudRain',
        theme: 'rainy',
        effect: 'rain',
        description: 'Pluie douce et continue',
      };
    case 63:
      return {
        label: 'Pluie modérée',
        iconName: 'CloudRain',
        theme: 'rainy',
        effect: 'rain',
        description: 'Précipitations régulières',
      };
    case 65:
      return {
        label: 'Forte pluie',
        iconName: 'CloudRainWind',
        theme: 'rainy',
        effect: 'rain-heavy',
        description: 'Averses intenses et soutenues',
      };
    case 66:
    case 67:
      return {
        label: 'Pluie verglaçante',
        iconName: 'CloudHail',
        theme: 'snow',
        effect: 'rain-heavy',
        description: 'Précipitations glacées',
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Chutes de neige',
        iconName: 'CloudSnow',
        theme: 'snow',
        effect: 'snow',
        description: 'Flocons de neige réguliers',
      };
    case 77:
      return {
        label: 'Grains de neige',
        iconName: 'Snowflake',
        theme: 'snow',
        effect: 'snow',
        description: 'Précipitations neigeuses fines',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Averses de pluie',
        iconName: 'CloudRainWind',
        theme: 'rainy',
        effect: 'rain-heavy',
        description: 'Fortes averses intermittentes',
      };
    case 85:
    case 86:
      return {
        label: 'Averses de neige',
        iconName: 'CloudSnow',
        theme: 'snow',
        effect: 'snow',
        description: 'Bourrasques de neige',
      };
    case 95:
      return {
        label: 'Orage modéré',
        iconName: 'CloudLightning',
        theme: 'storm',
        effect: 'thunder',
        description: 'Activité électrique et tonnerre',
      };
    case 96:
    case 99:
      return {
        label: 'Orage avec grêle',
        iconName: 'CloudLightning',
        theme: 'storm',
        effect: 'thunder',
        description: 'Orage violent accompagné de grêle',
      };
    default:
      return {
        label: isDay ? 'Temps variable' : 'Nuit calme',
        iconName: isDay ? 'Sun' : 'Moon',
        theme: isDay ? 'sunny' : 'night',
        effect: isDay ? 'sun-rays' : 'stars',
        description: 'Conditions stables',
      };
  }
}

/**
 * Convertit une température selon l'unité choisie
 */
export function formatTemperature(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

/**
 * Retourne la valeur numérique convertie
 */
export function convertTemp(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return 0;
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

/**
 * Formatage de la vitesse du vent
 */
export function formatWindSpeed(speedKmh, unit = 'C') {
  if (speedKmh === undefined || speedKmh === null) return '--';
  if (unit === 'F') {
    const mph = speedKmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

/**
 * Conversion de l'orientation du vent en direction cardinale (FR)
 */
export function getWindDirection(degrees) {
  if (degrees === undefined || degrees === null) return 'N/A';
  const directions = [
    'Nord (N)',
    'Nord-Nord-Est (NNE)',
    'Nord-Est (NE)',
    'Est-Nord-Est (ENE)',
    'Est (E)',
    'Est-Sud-Est (ESE)',
    'Sud-Est (SE)',
    'Sud-Sud-Est (SSE)',
    'Sud (S)',
    'Sud-Sud-Ouest (SSO)',
    'Sud-Ouest (SO)',
    'Ouest-Sud-Ouest (OSO)',
    'Ouest (O)',
    'Ouest-Nord-Ouest (ONO)',
    'Nord-Ouest (NO)',
    'Nord-Nord-Ouest (NNO)',
  ];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Évaluation du niveau de risque de l'indice UV
 */
export function getUVIndexInfo(uv) {
  const value = Math.round(uv || 0);
  if (value <= 2) {
    return { level: 'Faible', color: 'text-emerald-400', bg: 'bg-emerald-500/20', barColor: 'bg-emerald-500', advice: 'Aucune protection requise' };
  } else if (value <= 5) {
    return { level: 'Modéré', color: 'text-amber-400', bg: 'bg-amber-500/20', barColor: 'bg-amber-500', advice: 'Protection solaire recommandée' };
  } else if (value <= 7) {
    return { level: 'Élevé', color: 'text-orange-400', bg: 'bg-orange-500/20', barColor: 'bg-orange-500', advice: 'Chapeau et lunettes conseillés' };
  } else if (value <= 10) {
    return { level: 'Très Élevé', color: 'text-rose-400', bg: 'bg-rose-500/20', barColor: 'bg-rose-500', advice: 'Évitez l’exposition entre 12h et 16h' };
  } else {
    return { level: 'Extrême', color: 'text-purple-400', bg: 'bg-purple-500/20', barColor: 'bg-purple-500', advice: 'Restez à l’ombre impérativement' };
  }
}

/**
 * Formate une date ISO en jour lisible en français
 */
export function formatDayName(dateString, isToday = false) {
  if (isToday) return "Aujourd'hui";
  try {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    const formatted = day.charAt(0).toUpperCase() + day.slice(1);
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('fr-FR', { month: 'short' });
    return `${formatted} ${dayNum} ${month}`;
  } catch {
    return dateString;
  }
}

/**
 * Formate l'heure à partir d'une chaîne ISO
 */
export function formatHour(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoString;
  }
}

/**
 * Calcule la progression du soleil dans la journée (0 à 100%)
 */
export function calculateSunProgress(sunriseIso, sunsetIso) {
  try {
    const now = new Date().getTime();
    const rise = new Date(sunriseIso).getTime();
    const set = new Date(sunsetIso).getTime();

    if (now < rise) return 0;
    if (now > set) return 100;
    return Math.min(100, Math.max(0, Math.round(((now - rise) / (set - rise)) * 100)));
  } catch {
    return 50;
  }
}
