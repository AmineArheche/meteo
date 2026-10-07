# Code Review 20 — 3D Earth Globe (NASA) & Doppler Radar System

**Date de revue :** 9 Octobre 2026  
**Auditeur :** Antigravity Senior Staff Engineer  
**Statut :** ✅ **APPROUVÉ (Sign-off v2.0.0)**  
**Périmètre :** [EarthGlobe3D.jsx](file:///c:/Users/amine/.gemini/antigravity-ide/scratch/weather-app/src/components/EarthGlobe3D.jsx), [RadarMap.jsx](file:///c:/Users/amine/.gemini/antigravity-ide/scratch/weather-app/src/components/RadarMap.jsx), [radarService.js](file:///c:/Users/amine/.gemini/antigravity-ide/scratch/weather-app/src/services/radarService.js)

---

## 1. Revue d'Architecture Three.js & WebGL

- **Initialisation & Canvas :** Le renderer WebGL utilise `antialias: true` et le tone mapping `ACESFilmicToneMapping` pour une fidélité photoréaliste.
- **Gestion de la mémoire :** Implémentation correcte du nettoyage dans le hook `useEffect` (`cancelAnimationFrame`, suppression des event listeners, `renderer.dispose()`).
- **Coordonnées sphériques :** Conversion trigonométrique précise pour l'ancrage des balises Doppler sur le globe 3D à partir des coordonnées GPS (lat, lon).
- **Intégration NASA GLTF :** L'iframe officielle NASA Solar System Exploration (`gltf_embed/2393/`) est encapsulée avec gestion d'état réactive et bascule instantanée avec le mode Three.js.

---

## 2. Revue du Système Radar Leaflet & Fonds de Carte

- **Élimination du filigrane API :** Remplacement réussi de CartoDB par **Esri Dark Gray Canvas** et **Esri World Imagery**. Aucune clé d'API requise, aucune bannière d'avertissement.
- **Tuiles RainViewer Doppler :** Chargement dynamique des tuiles 256x256 avec cache de repli en cas d'indisponibilité du CDN.
- **Scrubber Temporel :** Synchronisation fluide du slider temporel avec interpolation des 13 frames historiques (2 heures).

---

## 3. Conformité & Qualité de Build

- **Oxlint / Linter :** 0 erreur, 0 warning critique.
- **Vite Production Bundle :** Compilation réussie sans régression.
