// weatherService.js - Service d'intégration API météo & géocodage

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEO_BASE = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/**
 * Recherche des villes par nom (Autocomplétion & Géocodage mondial)
 * @param {string} query 
 * @returns {Promise<Array>}
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${GEOCODING_BASE}?name=${encodeURIComponent(query.trim())}&count=7&language=fr&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur recherche: ${response.statusText}`);
    
    const data = await response.json();
    if (!data.results || !data.results.length) return [];

    return data.results.map((item) => ({
      id: `${item.id || item.latitude + '_' + item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code ? item.country_code.toLowerCase() : '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      elevation: item.elevation,
    }));
  } catch (error) {
    console.warn('Erreur lors du géocodage:', error);
    return [];
  }
}

/**
 * Récupère les informations d'une ville à partir de ses coordonnées GPS (Géolocalisation inversée)
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `${REVERSE_GEO_BASE}?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Ma Position',
        country: data.countryName || '',
        countryCode: data.countryCode ? data.countryCode.toLowerCase() : '',
        admin1: data.principalSubdivision || '',
        latitude,
        longitude,
      };
    }
  } catch (e) {
    console.warn('Reverse geocoding BigDataCloud échoué, fallback générique:', e);
  }

  return {
    name: 'Position Actuelle',
    country: '',
    countryCode: '',
    latitude,
    longitude,
  };
}

/**
 * Récupère les données météo complètes pour des coordonnées
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} timezone 
 * @param {Object} locationInfo 
 * @returns {Promise<Object>}
 */
export async function getWeatherData(latitude, longitude, timezone = 'auto', locationInfo = {}) {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'dew_point_2m',
        'apparent_temperature',
        'precipitation_probability',
        'weather_code',
        'visibility',
        'wind_speed_10m',
        'uv_index',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      timezone: timezone || 'auto',
      forecast_days: '8',
    });

    const url = `${OPEN_METEO_BASE}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Échec de récupération météo (${response.status})`);
    }

    const raw = await response.json();
    return formatWeatherData(raw, locationInfo);
  } catch (error) {
    console.error('Erreur API météo:', error);
    throw error;
  }
}

/**
 * Structure et normalise les données météo
 */
function formatWeatherData(data, locationInfo) {
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  // Traitement des prévisions horaires (prochaines 24 heures à partir de l'heure courante)
  const currentIsoTime = current.time;
  let startIndex = 0;
  if (hourly.time && hourly.time.length) {
    const foundIndex = hourly.time.findIndex(t => t >= currentIsoTime);
    startIndex = foundIndex !== -1 ? foundIndex : 0;
  }

  const hourlyForecast = [];
  for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time?.length || 0); i++) {
    hourlyForecast.push({
      time: hourly.time[i],
      temperature: hourly.temperature_2m?.[i] ?? 0,
      feelsLike: hourly.apparent_temperature?.[i] ?? 0,
      weatherCode: hourly.weather_code?.[i] ?? 0,
      pop: hourly.precipitation_probability?.[i] ?? 0,
      humidity: hourly.relative_humidity_2m?.[i] ?? 0,
      windSpeed: hourly.wind_speed_10m?.[i] ?? 0,
      uvIndex: hourly.uv_index?.[i] ?? 0,
      isDay: hourly.is_day ? hourly.is_day[i] : (new Date(hourly.time[i]).getHours() >= 6 && new Date(hourly.time[i]).getHours() < 20 ? 1 : 0),
    });
  }

  // Traitement des prévisions sur 7 jours
  const dailyForecast = [];
  const daysCount = Math.min(7, daily.time?.length || 0);
  for (let i = 0; i < daysCount; i++) {
    dailyForecast.push({
      date: daily.time[i],
      isToday: i === 0,
      weatherCode: daily.weather_code?.[i] ?? 0,
      tempMax: daily.temperature_2m_max?.[i] ?? 0,
      tempMin: daily.temperature_2m_min?.[i] ?? 0,
      feelsLikeMax: daily.apparent_temperature_max?.[i] ?? 0,
      feelsLikeMin: daily.apparent_temperature_min?.[i] ?? 0,
      sunrise: daily.sunrise?.[i] || '',
      sunset: daily.sunset?.[i] || '',
      uvIndexMax: daily.uv_index_max?.[i] ?? 0,
      popMax: daily.precipitation_probability_max?.[i] ?? 0,
      rainSum: daily.precipitation_sum?.[i] ?? 0,
      windMax: daily.wind_speed_10m_max?.[i] ?? 0,
    });
  }

  // Visibilité courante (extraite de hourly pour l'heure actuelle)
  const currentVisibilityMeters = hourly.visibility?.[startIndex] ?? 10000;
  const currentVisibilityKm = Math.round((currentVisibilityMeters / 1000) * 10) / 10;

  // Point de rosée courant
  const currentDewPoint = hourly.dew_point_2m?.[startIndex] ?? (current.temperature_2m - ((100 - current.relative_humidity_2m) / 5));

  // UV courant
  const currentUv = hourly.uv_index?.[startIndex] ?? daily.uv_index_max?.[0] ?? 0;

  return {
    location: {
      name: locationInfo.name || 'Ville sélectionnée',
      country: locationInfo.country || '',
      countryCode: locationInfo.countryCode || '',
      admin1: locationInfo.admin1 || '',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      elevation: data.elevation,
    },
    current: {
      time: current.time,
      isDay: current.is_day === 1,
      temperature: current.temperature_2m ?? 0,
      feelsLike: current.apparent_temperature ?? 0,
      weatherCode: current.weather_code ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      dewPoint: Math.round(currentDewPoint * 10) / 10,
      pressure: Math.round(current.pressure_msl || current.surface_pressure || 1013),
      windSpeed: Math.round(current.wind_speed_10m || 0),
      windDirection: current.wind_direction_10m || 0,
      windGusts: Math.round(current.wind_gusts_10m || 0),
      cloudCover: current.cloud_cover || 0,
      precipitation: current.precipitation || 0,
      uvIndex: currentUv,
      visibilityKm: currentVisibilityKm,
      tempMaxToday: daily.temperature_2m_max?.[0] ?? current.temperature_2m,
      tempMinToday: daily.temperature_2m_min?.[0] ?? current.temperature_2m,
      sunriseToday: daily.sunrise?.[0] || '',
      sunsetToday: daily.sunset?.[0] || '',
    },
    hourly: hourlyForecast,
    daily: dailyForecast,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Recherche et charge directement une ville par son nom
 */
export async function fetchWeatherByCityName(cityName) {
  const cities = await searchCities(cityName);
  if (!cities.length) {
    throw new Error(`Aucune ville trouvée pour "${cityName}". Veuillez vérifier l'orthographe.`);
  }

  const targetCity = cities[0];
  return getWeatherData(targetCity.latitude, targetCity.longitude, targetCity.timezone, targetCity);
}
