# Changelog — RainRadar Pro (AmineArheche/meteo)

## [2.1.0-rc1] - 2026-10-08
### Added
- **⚙️ GitHub Actions CI/CD Pipeline** : Automatisation du linting, des tests unitaires et du déploiement GitHub Pages (`.github/workflows/`).
- **🧪 Suite de Tests Unitaires Node.js 22** : 15 tests automatisés couvrant les conversions météo, l'algorithme des tuiles radar RainViewer et le synthétiseur audio.
- **📱 PWA & Offline Support** : Web App Manifest et Service Worker (`sw.js`) pour mise en cache hors-ligne des tuiles radar et assets.
- **🔊 Moteur Audio Synthétisé Web Audio API** : Alertes sonores paramétrables pour cellules orageuses et impulsions radar.
- **📋 Templates GitHub Issues & PR** : Formulaires de signalement de bugs, demandes d'évolutions et checklist de pull request.

## [2.0.0] - 2026-10-07
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
