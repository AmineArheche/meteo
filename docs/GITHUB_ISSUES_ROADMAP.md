# 📌 Roadmap des Issues GitHub — AmineArheche/meteo

Ce document recense les tickets et spécifications associées aux jalons majeurs du projet.

---

### Issue #4 : `feat(radar): integrate RainViewer live Doppler radar tile layers`
- **Description :** Intégrer les tuiles radar mondiales haute résolution de RainViewer.
- **Résolution :** Création de `src/services/radarService.js` et `src/components/RadarMap.jsx`.
- **Statut :** ✅ Résolu dans le jalon v2.0.

---

### Issue #5 : `feat(nowcast): 120-minute minute-by-minute rain curve navigation`
- **Description :** Fournir une analyse prédictive des précipitations minute par minute sur 2 heures.
- **Résolution :** Composant `src/components/RainNowcast.jsx` avec bascule dBZ / mm/h.
- **Statut :** ✅ Résolu dans le jalon v2.0.

---

### Issue #6 : `feat(alerts): MyRadar severe storm cell tracker & weather warnings`
- **Description :** Tableau de bord de veille météorologique sévère et suivi des cellules orageuses.
- **Résolution :** Composant `src/components/SevereWeatherTracker.jsx` et bandeau de surveillance supérieur.
- **Statut :** ✅ Résolu dans le jalon v2.0.

---

### Issue #7 : `feat(3d-globe): integrate NASA 3D Earth exploration & WebGL globe`
- **Description :** Offrir une exploration de la Terre en 3D photoréaliste façon NASA Exploration.
- **Résolution :** Composant `src/components/EarthGlobe3D.jsx` combinant Three.js WebGL et le modèle GLTF officiel NASA 2393.
- **Statut :** ✅ Résolu dans le jalon v2.0.

---

### Issue #8 : `fix(basemap): eliminate CartoDB API key watermark using Esri Dark`
- **Description :** Éliminer le filigrane "API KEY REQUIRED" apparu sur les fonds de carte CartoDB.
- **Résolution :** Migration vers Esri Dark Gray Canvas et Esri World Imagery sans clé API.
- **Statut :** ✅ Résolu dans le jalon v2.0.

---

### Issue #9 : `perf(webgl): optimize Three.js render loop & Leaflet tile memory`
- **Description :** Optimiser les performances de rendu WebGL et la libération mémoire à la fermeture des vues.
- **Résolution :** Cleanup hooks complets dans les composants 3D et 2D.
- **Statut :** ✅ Résolu dans le jalon v2.0.

---

### Issue #10 : `release(v2.0.0): RainRadar Pro milestone release & sign-off`
- **Description :** Audit final de code review, tag v2.0.0 et synchronisation GitHub.
- **Résolution :** 50 commits atomiques et release tag v2.0.0.
- **Statut :** 🎯 Prêt pour déploiement le 9 Octobre.
