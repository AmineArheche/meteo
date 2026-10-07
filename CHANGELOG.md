# Changelog — RainRadar Pro (AmineArheche/meteo)

## [2.0.0] - 2026-10-09
### Added
- **🌍 Earth 3D Exploration Model** : Intégration du modèle 3D officiel de la NASA (GLTF 2393) et du globe 3D Three.js WebGL avec nuages et halo atmosphérique.
- **🛰️ RainViewer Doppler Radar** : API de tuiles radar en direct, lecteur d'animation 2h, échelle dBZ officielle et inspecteur ponctuel (*Tap-on-map*).
- **⏱️ Hyperlocal Rain Nowcast 120 min** : Histogramme interactif prédictif minute par minute avec alertes de précipitations imminentes.
- **🚨 MyRadar Storm Cell Tracker** : Suivi des cellules orageuses convectives, détection de grêle et surveillance des systèmes tropicaux.
- **🔲 Cockpit Mixte (Split Screen)** : Vue de travail combinant la carte radar interactive et la télémétrie météo en direct.

### Fixed
- **🗺️ Watermark CartoDB éliminé** : Remplacement par Esri Dark Canvas et Esri World Imagery (aucune clé d'API requise).

### Documentation & Code Review
- Rapport de revue d'architecture #20 (`docs/reviews/20_RADAR_3D_REVIEW.md`).
- Traçabilité complète des issues GitHub #4 à #10 (`docs/GITHUB_ISSUES_ROADMAP.md`).

---

## [1.1.0] - 2026-10-02
- Complete peer code review integration.
- Refined glassmorphism styling and high-contrast accessibility.
