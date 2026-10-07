# 🛰️ RainRadar Pro — Station Météo Doppler & Globe 3D NASA

Application météo et aérologique haute définition combinant le modèle 3D de la Terre de la NASA, l'imagerie radar Doppler de **RainViewer** et les alertes sévères de **MyRadar**.

---

## 🌟 Fonctionnalités Clés

- **🌍 Globe Terrestre 3D Interactif :**
  - Modèle 3D officiel [NASA Solar System Exploration](https://solarsystem.nasa.gov/gltf_embed/2393/) (`GLTF 2393`).
  - Globe WebGL Three.js avec textures haute fidélité *Blue Marble*, atmosphère cyan luminescente et dérive différentielle des nuages.
  - Balises de téléportation 3D et télémétrie astronomique en temps réel.
- **🛰️ Radar Doppler Live RainViewer :**
  - Couverture mondiale à résolution 100m actualisée toutes les 2 minutes.
  - Lecteur scrubber d'animation sur 2 heures (passé et maintenant).
  - Échelle de réflectivité officielle en dBZ (10 à 70+ dBZ).
  - Inspection ponctuelle au clic (*Tap-on-map*).
- **⏱️ Nowcast Hyperlocal 120 Minutes :**
  - Navigation de pluie minute par minute avec indicateurs d'accalmies et de débuts d'averses.
- **🚨 Surveillance Tempêtes MyRadar :**
  - Traqueur de cellules orageuses convectives, trajectoires et probabilités de grêle.
- **🗺️ Fonds de Carte Esri Haute Définition :**
  - Intégration d'Esri Dark Canvas et Esri World Imagery garantissant zéro filigrane d'API.

---

## 🛠️ Stack Technique

- **Frontend :** React 19, Vite 8, TailwindCSS
- **Rendu 3D :** Three.js (WebGL), NASA GLTF Embedded Viewer
- **Cartographie :** Leaflet 1.9, Esri Maps, RainViewer Tile API
- **Données Météorologiques :** Open-Meteo API, RainViewer TileCache

---

## 🚀 Démarrage Rapide

```bash
# Installation des dépendances
npm install

# Lancement du serveur de développement
npm run dev

# Compilation de production
npm run build
```