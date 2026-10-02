// App.jsx - Composant Racine de l'application Météo
import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { useFavorites } from './hooks/useFavorites';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FavoritesBar from './components/FavoritesBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import BackgroundEffects from './components/BackgroundEffects';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';

export default function App() {
  const {
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
  } = useWeather();

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  } = useFavorites();

  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleToggleFavoriteWithFeedback = (loc) => {
    const wasFav = isFavorite(loc.name, loc.country);
    toggleFavorite(loc);
    showNotification(
      wasFav
        ? `${loc.name} a été retirée des favoris.`
        : `✨ ${loc.name} a été ajoutée à vos favoris !`
    );
  };

  const handleSelectCity = (city) => {
    fetchWeather(city);
  };

  const currentCode = weatherData?.current?.weatherCode ?? 0;
  const isDay = weatherData?.current?.isDay ?? true;

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Dynamic Animated Weather Atmosphere */}
      <BackgroundEffects weatherCode={currentCode} isDay={isDay} />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 glass-panel bg-slate-900/90 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-sky-400/40 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Bar */}
        <Header
          unit={unit}
          onToggleUnit={toggleUnit}
          onCurrentLocation={() => {
            fetchCurrentLocationWeather();
            showNotification("📍 Recherche de votre position GPS...");
          }}
          onRefresh={() => {
            refreshWeather();
            showNotification("🔄 Météo actualisée en direct.");
          }}
          loading={loading}
          lastUpdated={weatherData?.lastUpdated}
        />

        {/* City Search Bar */}
        <SearchBar
          onSelectCity={handleSelectCity}
          onSearchSubmit={searchAndFetchCity}
          loading={loading}
        />

        {/* Pinned Favorites Quick Pills */}
        <FavoritesBar
          favorites={favorites}
          activeCityName={activeLocation?.name}
          onSelectFavorite={handleSelectCity}
          onRemoveFavorite={(name) => {
            removeFavorite(name);
            showNotification(`${name} retirée des favoris.`);
          }}
        />

        {/* Content Views */}
        {error && !weatherData ? (
          <ErrorState
            error={error}
            onRetry={refreshWeather}
            onSelectCity={handleSelectCity}
          />
        ) : loading && !weatherData ? (
          <LoadingSkeleton />
        ) : (
          weatherData && (
            <div className="space-y-6 transition-opacity duration-300">
              {/* Hero Current Weather */}
              <CurrentWeather
                weatherData={weatherData}
                unit={unit}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavoriteWithFeedback}
              />

              {/* 24-Hour Forecast */}
              <HourlyForecast
                hourly={weatherData.hourly}
                unit={unit}
              />

              {/* Detailed Metrics Grid */}
              <WeatherDetails
                current={weatherData.current}
                unit={unit}
              />

              {/* 7-Day Extended Forecast */}
              <DailyForecast
                daily={weatherData.daily}
                unit={unit}
              />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
