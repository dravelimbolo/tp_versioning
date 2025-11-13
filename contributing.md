# CONTRIBUTING

Merci de contribuer à ce projet d’entraînement. Ce dépôt simule un environnement d’équipe professionnel : conventions strictes, revues de code, tests et CI.

## Prérequis

- Node.js LTS et npm installés
- Git configuré (nom, email)
- Accès en écriture au dépôt (ou travail en fork selon consigne)
- Avoir lu `git-workflow.md` et `architecture.md`

## Installation

1. Cloner le dépôt
2. Installer les dépendances
3. Lancer l’application en local

Voir le README du projet pour les commandes.

## Règles générales

- Une issue = une branche = une Pull Request.
- Petites PRs, ciblées, descriptives.
- Pas de commit sur `main`. Merge via PR uniquement.
- Respect strict d’ESLint + Prettier + Commitlint.
- Tests verts et couverture ≥ seuil défini avant merge.

## Conventions Git

- Branches :
  - `feature/<sujet-court>`
  - `fix/<bug-ou-sujet>`
  - `refactor/<cible>`
  - `test/<cible>`
  - `chore/<outillage>`
- Commits (Conventional Commits) :
  - `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
  - Scope optionnel : `feat(tasks): ...`

Exemples :

- `feat(router): affichage des vues Accueil/Contacts/Tâches`
- `refactor(dom): extraction des sélecteurs dans dom.js`
- `fix(storage): persistance déterministe`

## Qualité de code

- ESLint et Prettier doivent passer avant push.
- Interdits : code mort, logs permanents, variables non typées implicitement, fonctions de plus de ~40 lignes non justifiées, duplication évitable.
- UI : pas d’`alert()`. Utiliser des notifications non bloquantes.

## Tests

- Écrire des tests unitaires pour la logique pure (`contacts.js`, `tasks.js`, `storage.js`).
- Couverture minimale : à préciser dans le README (ex. 70 %).
- Les PRs qui réduisent la couverture significativement doivent l’expliquer.

## Accessibilité

- Labels pour les champs de formulaire.
- Messages d’erreur lisibles par lecteur d’écran.
- Contrastes suffisants.

## Processus de Pull Request

- Décrire le contexte, la solution et l’impact.
- Lier l’issue (`Closes #XX`).
- Ajouter une checklist :
  - [ ] Lint OK
  - [ ] Tests ajoutés/ajustés
  - [ ] Couverture respectée
  - [ ] Docs/README mis à jour
- Au moins une review approuvée avant merge.

## Convention de dossier

- `src/` : code applicatif
- `src/contacts.js`, `src/tasks.js`, `src/storage.js`, `src/dom.js`, `src/router.js`
- `public/` : assets statiques
- `tests/` : tests unitaires

## Sécurité

- Pas de secrets en clair.
- Ne pas introduire de dépendances inutiles.

## Discussion technique

- Utiliser les issues pour les décisions.
- Rédiger de courts ADR si la décision impacte l’architecture (`docs/adr/`).

```bash
# Exemple d’ADR minimal (structure de fichier)
mkdir -p docs/adr
cat > docs/adr/0001-routing.md <<'EOF'
# 0001 - Choix du routeur
Date: 2025-11-13
Décision: Utiliser Navigo pour un routing hash-based simple.
Motivation: API simple, bundle léger, pas de dépendances complexes.
Conséquences: Couplage minimal, remplaçable facilement.
EOF
```
