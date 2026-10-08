// App.jsx - Composant Racine de RainRadar Pro (RainViewer & MyRadar Edition)
import React, { useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { useFavorites } from './hooks/useFavorites';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FavoritesBar from './components/FavoritesBar';
import EarthGlobe3D from './components/EarthGlobe3D';
import RadarMap from './components/RadarMap';
import RainNowcast from './components/RainNowcast';
import SevereWeatherTracker from './components/SevereWeatherTracker';
import CurrentWeather from './components/CurrentWeather';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import BackgroundEffects from './components/BackgroundEffects';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  const {
    weatherData,
    loading,
    error,
    unit,
    toggleUnit,
    activeLocation,
    fetchWeather,
    fetchWeatherByCoords,
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

  const [activeTab, setActiveTab] = useState('globe'); // 'globe', 'radar', 'nowcast', 'split', 'dashboard', 'alerts'
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
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

  const handleMapCoordinateSelect = async (lat, lng) => {
    showNotification(`📍 Localisation du point [${lat.toFixed(2)}, ${lng.toFixed(2)}]...`);
    await fetchWeatherByCoords(lat, lng);
    showNotification(`✅ Météo mise à jour pour le point sélectionné`);
  };

  const currentCode = weatherData?.current?.weatherCode ?? 0;
  const isDay = weatherData?.current?.isDay ?? true;

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 bg-[#070B14]">
      {/* Dynamic Animated Atmosphere */}
      <BackgroundEffects weatherCode={currentCode} isDay={isDay} />

      {/* Marquee Ticker d'Alerte MyRadar (Bandeau de surveillance supérieure) */}
      <div className="relative z-30 w-full bg-slate-950/90 border-b border-cyan-500/20 text-xs py-1.5 px-4 overflow-hidden backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white uppercase tracking-wider">RÉSEAU DOPPLER ACTIF :</span>
            <span>1 200+ Stations mondiales</span>
            <span className="text-slate-500">•</span>
            <span>Balayage 2 min</span>
            <span className="text-slate-500">•</span>
            <span>Résolution 100m RainViewer</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Surveillance orages &amp; fronts pluvieux MyRadar Live</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 glass-panel bg-slate-900/95 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-cyan-400/50 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Header Bar avec tabs de navigation */}
        <Header
          unit={unit}
          onToggleUnit={toggleUnit}
          onCurrentLocation={() => {
            fetchCurrentLocationWeather();
            showNotification("📍 Recherche de votre position GPS...");
          }}
          onRefresh={() => {
            refreshWeather();
            showNotification("🔄 Données radar et météo actualisées.");
          }}
          loading={loading}
          lastUpdated={weatherData?.lastUpdated}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* City Search Bar & Favoris */}
        <div className="space-y-3 mb-5">
          <SearchBar
            onSelectCity={handleSelectCity}
            onSearchSubmit={searchAndFetchCity}
            loading={loading}
          />

          <FavoritesBar
            favorites={favorites}
            activeCityName={activeLocation?.name}
            onSelectFavorite={handleSelectCity}
            onRemoveFavorite={(name) => {
              removeFavorite(name);
              showNotification(`${name} retirée des favoris.`);
            }}
          />
        </div>

        {/* Gestion des erreurs / Chargement */}
        {error && !weatherData ? (
          <ErrorState
            error={error}
            onRetry={refreshWeather}
            onSelectCity={handleSelectCity}
          />
        ) : loading && !weatherData ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* VUE 0 : GLOBE TERRESTRE 3D (NASA Solar System Model & WebGL) */}
            {activeTab === 'globe' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <EarthGlobe3D
                  activeLocation={activeLocation}
                  weatherData={weatherData}
                  onSelectCity={handleSelectCity}
                />
                <RainNowcast
                  weatherData={weatherData}
                  activeLocation={activeLocation}
                />
              </div>
            )}

            {/* VUE 1 : RADAR DOPPLER LIVE (RainViewer Core) */}
            {activeTab === 'radar' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <RadarMap
                  activeLocation={activeLocation}
                  onSelectCoordinates={handleMapCoordinateSelect}
                  unit={unit}
                />
                <RainNowcast
                  weatherData={weatherData}
                  activeLocation={activeLocation}
                />
              </div>
            )}

            {/* VUE 2 : NOWCAST 120 MIN (RainViewer Signature) */}
            {activeTab === 'nowcast' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <RainNowcast
                  weatherData={weatherData}
                  activeLocation={activeLocation}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RadarMap
                    activeLocation={activeLocation}
                    onSelectCoordinates={handleMapCoordinateSelect}
                    unit={unit}
                  />
                  {weatherData && (
                    <HourlyForecast
                      hourly={weatherData.hourly}
                      unit={unit}
                    />
                  )}
                </div>
              </div>
            )}

            {/* VUE 3 : COCKPIT SPLIT SCREEN (RainViewer & MyRadar Pro Workstation) */}
            {activeTab === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
                {/* Volet gauche : Radar interactif plein écran */}
                <div className="lg:col-span-7 space-y-4">
                  <RadarMap
                    activeLocation={activeLocation}
                    onSelectCoordinates={handleMapCoordinateSelect}
                    unit={unit}
                  />
                  <RainNowcast
                    weatherData={weatherData}
                    activeLocation={activeLocation}
                  />
                </div>

                {/* Volet droit : Télémétrie météo et conditions directes */}
                <div className="lg:col-span-5 space-y-4">
                  {weatherData && (
                    <>
                      <CurrentWeather
                        weatherData={weatherData}
                        unit={unit}
                        isFavorite={isFavorite}
                        onToggleFavorite={handleToggleFavoriteWithFeedback}
                      />
                      <WeatherDetails
                        current={weatherData.current}
                        unit={unit}
                      />
                      <HourlyForecast
                        hourly={weatherData.hourly}
                        unit={unit}
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* VUE 4 : TABLEAU DE BORD MÉTÉO COMPLET */}
            {activeTab === 'dashboard' && weatherData && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <CurrentWeather
                  weatherData={weatherData}
                  unit={unit}
                  isFavorite={isFavorite}
                  onToggleFavorite={handleToggleFavoriteWithFeedback}
                />
                <HourlyForecast
                  hourly={weatherData.hourly}
                  unit={unit}
                />
                <WeatherDetails
                  current={weatherData.current}
                  unit={unit}
                />
                <DailyForecast
                  daily={weatherData.daily}
                  unit={unit}
                />
              </div>
            )}

            {/* VUE 5 : ALERTES & TEMPÊTES (MyRadar Signature) */}
            {activeTab === 'alerts' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <SevereWeatherTracker
                  activeLocation={activeLocation}
                />
                <RadarMap
                  activeLocation={activeLocation}
                  onSelectCoordinates={handleMapCoordinateSelect}
                  unit={unit}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
