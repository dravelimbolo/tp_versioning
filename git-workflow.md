# Git workflow

Ce workflow est conçu pour une équipe de 6 apprenants + 1 lead. Il favorise des PRs courtes, des revues fréquentes et des releases régulières.

## Branches

- `main` : branche stable, protégée. Release uniquement via PR.
- `develop` : intégration de fonctionnalités validées par review, mais pas encore release.
- Branches de travail :
  - `feature/<sujet>`
  - `fix/<bug>`
  - `refactor/<cible>`
  - `test/<cible>`
  - `chore/<outillage>`

## Cycle de travail

1. Créer ou prendre une issue priorisée sur le Kanban.
2. Créer la branche depuis `develop`.
3. Commits fréquents et propres (Conventional Commits).
4. Ouvrir une PR vers `develop`.
5. Demander une review. Corriger si nécessaire.
6. Merge via squash ou rebase (selon la règle du repo).
7. Quand `develop` est stable, ouvrir une PR `develop` → `main` pour release.

## Règles de merge

- Vers `develop` : squash-merge recommandé pour un historique lisible par feature.
- Vers `main` : merge commit avec tag de version ou release PR.

## Hotfix

- En cas de bug critique en production :
  - Brancher depuis `main` : `hotfix/<bug>`
  - PR vers `main`, tagger une version patch, puis back-merge vers `develop`.

## Commit message

Format :

```bash
<type>(scope)?: <description courte>
```

- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Scope : module ou zone (`tasks`, `contacts`, `storage`, `router`, `ui`, etc.)

## Intégration continue

- Lint + tests lancés sur chaque PR.
- Rejet automatique si lint KO, tests KO, ou couverture < seuil.

## Changelog

- Généré automatiquement à partir des commits (standard-version ou semantic-release).

```bash
# Création d’une branche de feature
git checkout develop
git pull
git checkout -b feature/contacts-validation

# Commits conventionnels
git commit -m "feat(contacts): validation nom et email"
git commit -m "test(contacts): cas limites sur email invalide"

# Ouvrir la PR vers develop
git push -u origin feature/contacts-validation
# puis créer la PR sur GitHub
```
