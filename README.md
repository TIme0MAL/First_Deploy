# Système de Gestion de Bibliothèque

Une application web moderne pour gérer une bibliothèque, développée en JavaScript vanilla avec une interface utilisateur intuitive.

## Fonctionnalités

- **Gestion des livres**
  - Ajouter de nouveaux livres avec titre, auteur, ISBN, année et catégorie
  - Supprimer des livres de la collection
  - Affichage en grille avec cartes modernes

- **Système d'emprunt**
  - Emprunter des livres disponibles
  - Retourner des livres empruntés
  - Suivi des emprunteurs et des dates

- **Recherche et filtrage**
  - Recherche par titre, auteur ou ISBN
  - Filtrage par catégorie
  - Filtrage par statut (disponible/emprunté)

- **Statistiques**
  - Nombre total de livres
  - Livres disponibles
  - Livres empruntés

- **Stockage persistant**
  - Sauvegarde automatique dans localStorage
  - Les données sont conservées même après fermeture du navigateur

## Installation

1. Clonez ou téléchargez ce projet
2. Aucune installation nécessaire - c'est du JavaScript vanilla!

## Utilisation

### Option 1: Ouvrir directement
Double-cliquez sur le fichier `index.html` pour ouvrir l'application dans votre navigateur.

### Option 2: Utiliser un serveur local
Si vous avez Node.js installé:

```bash
# Installer les dépendances de développement
npm install

# Lancer le serveur local
npm run serve
```

## Structure du projet

```
gestion-bibliotheque/
│
├── index.html      # Page HTML principale
├── styles.css      # Styles CSS avec design moderne
├── script.js       # Logique JavaScript de l'application
├── package.json    # Configuration npm
└── README.md       # Ce fichier
```

## Technologies utilisées

- **HTML5** - Structure de l'application
- **CSS3** - Styles modernes avec Grid et Flexbox
- **JavaScript (ES6+)** - Logique de l'application
- **Font Awesome** - Icônes
- **Google Fonts (Poppins)** - Typographie
- **localStorage** - Stockage des données

## Catégories de livres disponibles

- Roman
- Science-Fiction
- Histoire
- Biographie
- Science
- Informatique
- Autre

## Captures d'écran

L'application présente:
- Un header bleu avec dégradé
- Un formulaire d'ajout de livre
- Des contrôles de recherche et filtrage
- Des cartes de statistiques colorées
- Une grille de livres responsive
- Un modal pour l'emprunt de livres

## Personnalisation

Vous pouvez facilement personnaliser l'application en modifiant:
- Les couleurs dans le fichier `styles.css` (variables CSS)
- Les catégories de livres dans `index.html` et `script.js`
- La durée d'emprunt par défaut (actuellement 30 jours)

## Support navigateur

L'application fonctionne sur tous les navigateurs modernes:
- Chrome
- Firefox
- Safari
- Edge

## Licence

Ce projet est sous licence MIT. Vous êtes libre de l'utiliser et de le modifier. #   F i r s t _ D e p l o y  
 