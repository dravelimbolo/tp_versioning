# TP – Refactorisation et versionning d’un mini CRM JavaScript

## Objectif

Ce TP consiste à **refactoriser et versionner proprement** une application JavaScript monolithique et “spaghetti” :  
le **Mini CRM**, une petite interface de gestion de contacts et de tâches.

L’objectif pédagogique est de :

- Structurer le projet pour le rendre maintenable.
- Appliquer les bonnes pratiques de **versionning Git** et de **collaboration** (branches, PR, conventions).
- Mettre en place des **outils de qualité de code** (ESLint, Prettier).
- Introduire une architecture minimale et modulaire.
- Mettre en œuvre des **tests automatisés** et une logique déterministe.

---

## Étapes du TP

### 1. Organisation et planification

- Créer un **tableau Kanban** (GitHub Projects, Notion, Trello, etc.) et **prioriser les tâches**.
- Répartir les issues selon la logique _To do / In progress / Done_.

---

### 2. Initialisation du projet

- Initialiser le **repository Git** avec deux branches :
  - `main` (stabilisée)
  - `develop` (intégration)
- Héberger le projet sur **GitHub**.
- Définir la **licence GPL** dans le fichier `LICENSE`.
- Créer un **README** clair présentant :
  - le contexte du projet ;
  - la structure actuelle du code ;
  - les axes d’amélioration prévus.

---

### 3. Convention de versionning

- Définir les **conventions de nommage** :
  - Branches : `feature/`, `fix/`, `refactor/`, `test/`
  - Commits : **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.)
- Définir un **modèle de Pull Request** pour les revues de code.

---

### 4. Mise en qualité du code

- Installer et configurer **ESLint** + **Prettier**.
- Extraire le **CSS** dans un fichier séparé.
- _(Optionnel)_ : refactoriser le CSS en **SCSS** avec variables et mixins.

---

### 5. Nettoyage et lisibilité

- Renommer les **variables incohérentes** (`mail` → `email`, `who` → `assignedTo`).
- Supprimer le **code mort** (`updateContactEmailMaybe`, `sortTasksByWeird`…).
- Extraire tous les **sélecteurs DOM** dans un seul module (ex: `dom.js`).
- Remplacer les `alert()` par des **messages d’interface non bloquants** (toasts, notifications, etc.).

---

### 6. Architecture minimale

- Isoler la **persistance** (`localStorage`) dans un module `storage.js`.
- Créer deux modules indépendants :
  - `contacts.js` pour la gestion des contacts.
  - `tasks.js` pour la gestion des tâches.
- Introduire un **router** (dépendance npm, ex: `navigo`, `page.js`) pour afficher :
  - **Accueil**
  - **Contacts**
  - **Tâches**

---

### 7. Tests et couverture

- Ajouter des tests unitaires avec **Jest** (et **Supertest** si besoin).
- Tester la logique pure :
  - création / suppression de contact ;
  - création / suppression / toggle de tâche.
- Mesurer la **couverture de tests** et fixer un seuil minimum (ex : 70%).

---

### 8. Robustesse et UX

- Implémenter une **validation de formulaire propre** :
  - nom ≥ 2 caractères ;
  - email valide ;
  - titre de tâche ≥ 3 caractères ;
  - sans `alert()` bloquant.
- Empêcher la **suppression silencieuse** : ajout d’une confirmation non bloquante.
- Gérer les **tâches orphelines** (après suppression d’un contact) :
  - réassigner à “Non assigné” ;
  - ou proposer un choix.
- Supprimer la **randomisation** du comportement (`Math.random()`).
- Remplacer les requêtes **XHR** par **fetch()** avec gestion d’erreurs claire.

---

### 9. Bonnes pratiques Git et collaboration

- **Branching** : 1 _issue_ = 1 _branche_, PR limitée (< 150 lignes).
- **Rebase propre** avant chaque merge (résolution de conflits notamment sur `renderContacts` / `renderTasks`).
- **Code Review** systématique avec checklist :
  - nommage cohérent ;
  - pas de duplication ;
  - test présent ;
  - accessibilité respectée.
- **Changelog** généré automatiquement via **Conventional Commits**.

---

## Extensions possibles (pour aller plus loin)

- Ajouter un **filtre de tâches** (toutes / en cours / terminées).
- Implémenter un **tri** et une **recherche** côté contacts.
- Ajouter un **export/import JSON** (sauvegarde manuelle).
- Implémenter un **Dark Mode** en injectant proprement des classes CSS.

---

## Livrables attendus

- Repository GitHub public (avec `main` et `develop`).
- Kanban des issues (capture d’écran ou lien).
- README mis à jour et complet.
- Historique Git propre (commits lisibles et cohérents).
- Modules JS et tests fonctionnels.

---

## Évaluation

| Critère         | Description                              | Pondération |
| --------------- | ---------------------------------------- | ----------- |
| Organisation    | Kanban, branches, convention Git         | 20%         |
| Qualité du code | ESLint, refactor, structure modulaire    | 30%         |
| Fonctionnalités | Persistance, router, comportement stable | 25%         |
| Tests           | Présence, pertinence, couverture         | 15%         |
| Collaboration   | Pull requests, revues, changelog         | 10%         |

---

## License

LICENCE PUBLIQUE GÉNÉRALE GNU  
Version 3, 29 juin 2007

Copyright (C) 2007 Free Software Foundation, Inc.  
[https://fsf.org/](https://fsf.org/)

Cette licence garantit à chacun **le droit d’utiliser, d’étudier, de modifier et de redistribuer** le logiciel, à condition que ces mêmes libertés soient **préservées pour tous les utilisateurs** et que toute distribution mentionne clairement la présente licence et le code source correspondant.

Pour le texte complet de la licence GNU GPL version 3, voir :  
[https://www.gnu.org/licenses/gpl-3.0.txt](https://www.gnu.org/licenses/gpl-3.0.txt)
