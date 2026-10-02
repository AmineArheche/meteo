// useFavorites.js - Hook pour la gestion des villes favorites et stockage local
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'aerocast_favorite_cities_v1';

const DEFAULT_FAVORITES = [
  { name: 'Casablanca', country: 'Maroc', admin1: 'Casablanca-Settat', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Fès', country: 'Maroc', admin1: 'Fès-Meknès', latitude: 34.0333, longitude: -5.0000, timezone: 'Africa/Casablanca' },
  { name: 'New York', country: 'États-Unis', admin1: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
];

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erreur lecture localStorage favoris:', e);
    }
    return DEFAULT_FAVORITES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Erreur sauvegarde localStorage favoris:', e);
    }
  }, [favorites]);

  const isFavorite = (cityName, country) => {
    if (!cityName) return false;
    return favorites.some(
      fav => fav.name.toLowerCase() === cityName.toLowerCase() &&
             (!country || !fav.country || fav.country.toLowerCase() === country.toLowerCase())
    );
  };

  const addFavorite = (location) => {
    if (!location || !location.name) return;
    if (isFavorite(location.name, location.country)) return;

    const newFav = {
      name: location.name,
      country: location.country || '',
      admin1: location.admin1 || '',
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone || 'auto',
    };

    setFavorites(prev => [newFav, ...prev]);
  };

  const removeFavorite = (cityName) => {
    setFavorites(prev => prev.filter(fav => fav.name.toLowerCase() !== cityName.toLowerCase()));
  };

  const toggleFavorite = (location) => {
    if (!location || !location.name) return;
    if (isFavorite(location.name, location.country)) {
      removeFavorite(location.name);
    } else {
      addFavorite(location);
    }
  };

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}
