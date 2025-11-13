# CHANGELOG

Toutes les modifications notables de ce projet seront documentées dans ce fichier.  
Le format est basé sur [Conventional Commits](https://www.conventionalcommits.org/),  
et ce projet adhère au [versionnage sémantique](https://semver.org/lang/fr/).

---

## [1.0.0] – 2025-11-13

### 🎉 Première version stable

- Refactorisation complète du mini CRM “spaghetti”.
- Architecture modulaire (`contacts.js`, `tasks.js`, `storage.js`, `dom.js`, `router.js`).
- Ajout du router Navigo pour la navigation Accueil / Contacts / Tâches.
- Introduction d’ESLint, Prettier, Husky et Commitlint.
- Tests unitaires sur les modules `contacts` et `tasks` avec Jest.

#### Commits correspondants

- `feat(router): ajout du routing Navigo`
- `refactor(dom): extraction des sélecteurs DOM`
- `feat(storage): persistance déterministe via localStorage`
- `test(tasks): ajout des tests unitaires sur la création et suppression`
- `chore: ajout configuration eslint + prettier`
- `docs: création du README initial`

---

## [0.2.0] – 2025-11-08

### ✨ Nouvelles fonctionnalités

- Ajout de la validation de formulaires sans `alert()`.
- Confirmation non bloquante lors de la suppression de contact.
- Gestions des tâches orphelines (réassignation automatique).

#### Commits correspondants

- `feat(validation): ajout validation des champs contact et tâche`
- `feat(ui): remplacement des alert par notifications`
- `fix(tasks): réassignation automatique des tâches orphelines`

---

## [0.1.0] – 2025-11-01

### 🧩 Version initiale “Spaghetti”

- Code monolithique avec logique, DOM et persistance mélangées.
- Sauvegardes aléatoires, fonctions globales, duplication de logique.
- Point de départ pour le TP de refactorisation.

#### Commits correspondants

- `chore(init): ajout du code spaghetti initial`
- `docs: création du fichier LICENSE`
- `style: ajustements mineurs sur le CSS inline`
