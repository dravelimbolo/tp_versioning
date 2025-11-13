# Créer une release

Deux approches coexistent : manuelle (GitHub) et automatisée (depuis les commits).

## Approche 1 — Release manuelle (simple et pédagogique)

1. S’assurer que `develop` est à jour et stable.
2. Ouvrir une PR `develop` → `main` et la merger après review.
3. Créer un tag sémantique sur `main` :
   - `v1.0.0` pour une première version stable
   - `v1.0.1` pour un correctif
   - `v1.1.0` pour une nouvelle fonctionnalité sans rupture
4. Rédiger les notes de version (changements majeurs, corrections, améliorations).
5. Publier la release sur GitHub.

Étapes détaillées ci-dessous.

## Approche 2 — Automatisée (à partir des commits)

- Utiliser `standard-version` ou `semantic-release` :
  - Génère/maintient `CHANGELOG.md`
  - Crée le tag
  - Optionnel : publie automatiquement sur GitHub

Cette approche exige des commits parfaitement conformes et une CI configurée.

## Étapes concrètes — Manuelle

1. Mettre `main` à jour
2. Choisir le numéro de version selon SemVer
3. Tagger
4. Pousser le tag
5. Créer la release GitHub en s’appuyant sur le tag

## Commandes

```bash
# Se placer sur main et mettre à jour
git checkout main
git pull

# Choisir une version (ex. 1.0.0)
export VERSION=v1.0.0

# Créer le tag annoté avec un message
git tag -a "$VERSION" -m "Release $VERSION"

# Pousser le tag distant
git push origin "$VERSION"

# Ouvrir GitHub > Releases > Draft a new release
# - Sélectionner le tag v1.0.0
# - Titre: v1.0.0
# - Notes: points clés (feat, fix, refactor significatifs)
```

## Étapes concrètes — Automatisée avec standard-version

1. Installer l’outil en dev
2. Ajouter un script npm
3. Générer la version et le changelog
4. Pousser commit + tag
5. Créer la release GitHub à partir du tag (ou automatiser via CI)

Notes : nécessite des commits conformes.

## Commandes

```bash
# Installer
npm i -D standard-version

# Ajouter dans package.json
# "release": "standard-version"

# Générer une nouvelle version (détectée via commits)
npm run release

# Pousser commit + tag
git push --follow-tags origin main

# Créer la release GitHub depuis le tag (interface web),
# ou automatiser avec une action GitHub.
```

## Recommandations pédagogiques

- Commencer par la release manuelle pour comprendre SemVer et les tags.
- Introduire ensuite `standard-version` pour l’automatisation du changelog.
- En fin de séquence, montrer `semantic-release` dans la CI pour une chaîne complète.
