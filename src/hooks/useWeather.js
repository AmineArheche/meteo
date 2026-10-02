import { useState, useEffect, useCallback } from 'react';
import { getWeatherData, searchCities, reverseGeocode } from '../services/weatherService';

const DEFAULT_LOCATION = {
  name: 'Casablanca',
  country: 'Maroc',
  admin1: 'Casablanca-Settat',
  latitude: 33.5731,
  longitude: -7.5898,
  timezone: 'Africa/Casablanca'
};

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('aerocast_weather_unit') || 'C';
  });
  const [activeLocation, setActiveLocation] = useState(DEFAULT_LOCATION);

  const toggleUnit = () => {
    setUnit(prev => {
      const next = prev === 'C' ? 'F' : 'C';
      localStorage.setItem('aerocast_weather_unit', next);
      return next;
    });
  };

  /**
   * Charge la météo par objet Location (avec coordonnées)
   */
  const fetchWeather = useCallback(async (loc) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(loc.latitude, loc.longitude, loc.timezone, loc);
      setWeatherData(data);
      setActiveLocation(loc);
    } catch (err) {
      console.error('Erreur chargement météo:', err);
      setError(err.message || 'Impossible de récupérer les données météo.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charge la météo par nom de ville (saisie textuelle)
   */
  const searchAndFetchCity = async (cityName) => {
    if (!cityName || !cityName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const cities = await searchCities(cityName);
      if (!cities || cities.length === 0) {
        throw new Error(`Aucun résultat trouvé pour la ville "${cityName}".`);
      }
      const topCity = cities[0];
      const data = await getWeatherData(topCity.latitude, topCity.longitude, topCity.timezone, topCity);
      setWeatherData(data);
      setActiveLocation(topCity);
    } catch (err) {
      console.error('Erreur recherche ville:', err);
      setError(err.message || `Erreur lors de la recherche de "${cityName}".`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Détecte la position GPS actuelle de l'utilisateur
   */
  const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const locInfo = await reverseGeocode(lat, lon);
          const data = await getWeatherData(lat, lon, 'auto', locInfo);
          setWeatherData(data);
          setActiveLocation(locInfo);
        } catch (err) {
          console.error('Erreur récupération GPS:', err);
          setError("Impossible de déterminer la météo de votre position actuelle.");
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError("Accès à la position refusé. Veuillez autoriser la géolocalisation ou rechercher une ville.");
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError("Position GPS indisponible. Veuillez réessayer.");
            break;
          case geoError.TIMEOUT:
            setError("Délai d'attente dépassé pour la géolocalisation.");
            break;
          default:
            setError("Erreur lors de la détection de votre géolocalisation.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Chargement initial
  useEffect(() => {
    let ignore = false;
    async function loadInitialWeather() {
      try {
        const data = await getWeatherData(
          DEFAULT_LOCATION.latitude,
          DEFAULT_LOCATION.longitude,
          DEFAULT_LOCATION.timezone,
          DEFAULT_LOCATION
        );
        if (!ignore) {
          setWeatherData(data);
          setActiveLocation(DEFAULT_LOCATION);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Erreur chargement météo:', err);
          setError(err.message || 'Impossible de récupérer les données météo.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialWeather();
    return () => {
      ignore = true;
    };
  }, []);

  const refreshWeather = () => {
    if (activeLocation) {
      fetchWeather(activeLocation);
    }
  };

  return {
    weatherData,
    loading,
    error,
    unit,
    toggleUnit,
    activeLocation,
    fetchWeather,
    searchAndFetchCity,
    fetchCurrentLocationWeather,
    refreshWeather,
  };
}
