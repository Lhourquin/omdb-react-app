# OMDb Movie Search App

Application React de recherche de films utilisant l'API OMDb.

## Instructions pour lancer le projet

### Prérequis
- Node.js (version 22 ou supérieure)
- npm ou yarn

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Build de production
```bash
npm run build
```

### Tests
```bash
# Lancer les tests
npm run test

# Tests avec interface graphique
npm run test:ui

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Linting
```bash
npm run lint
```

### Prévisualisation du build
```bash
npm run preview
```


## Choix techniques

### Architecture
- **Architecture fonctionnelle** : Utilisation exclusive de fonctions pures et de hooks React, sans classes
- **Séparation des responsabilités** : Structure claire avec dossiers `components/`, `hooks/`, `services/`, `types/` et `utils/`
- **Gestion d'état locale** : Hooks personnalisés (`useMovieSearch`, `useMovieDetails`) avec `useState` et `useLocalStorage`

### Stack technique
- **React 19** avec TypeScript strict
- **Vite** comme bundler et serveur de développement
- **React Compiler** activé pour l'optimisation automatique
- **Tailwind CSS** pour le styling avec approche mobile-first (via cdn)
- **Vitest** pour les tests unitaires avec couverture de code 

### API et données
- **OMDb API** pour la recherche et les détails de films
- **Cache intelligent** : Système de cache en mémoire avec localStorage pour l'historique
- **Gestion d'erreurs** : Classes d'erreurs personnalisées (`NetworkError`, `ApiError`, `MovieNotFoundError`)
- **Pagination** : Support complet de la pagination OMDb avec persistance de la page courante

### Fonctionnalités avancées
- **Historique de recherche** : Sauvegarde automatique des 10 dernières recherches
- **Cache de résultats** : Évite les appels API redondants
- **Mode hors-ligne** : Persistance des données de recherche
- **Interface responsive** : Design adaptatif avec Tailwind CSS
- **Tests complets** : Couverture des services, hooks et utilitaires avec MSW pour le mocking

## Améliorations possibles

### Limites actuelles
- **API Key exposée** : La clé API OMDb est stockée dans les variables d'environnement côté client
- **Images non optimisées** : Pas de lazy loading ou d'optimisation des images de posters

### Améliorations possibles
- **Sécurité** : Déplacer l'API key côté serveur avec un proxy
- **Performance** : Ajouter React.memo, useMemo et useCallback pour optimiser les re-renders
- **Accessibilité** : Ajouter plus d'ARIA labels, support clavier complet, focus management
- **Fonctionnalités** : Filtres avancés, favoris, comparaison de films, recommandations
- **PWA** : Service worker pour le mode hors-ligne complet
- **Tests** : Tests d'intégration avec Cypress/Playwright
- **Monitoring** : Ajout d'analytics et de monitoring d'erreurs (Sentry)
- **Architecture** : Découplage API via interfaces et mappers - permettrait d'utiliser TMDB, IMDb ou autres APIs sans modifier la logique métier
