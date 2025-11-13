# 🚀 Mini CRM – TP Versioning & Architecture Modulaire

---

## 📌 Contexte du projet

**Mini CRM** est une application JavaScript conçue pour gérer des **contacts** et des **tâches** de manière efficace. Ce projet s’inscrit dans le cadre d’un TP visant à :
- Transformer un code monolithique en une **architecture modulaire**
- Appliquer les **bonnes pratiques Git** (branches, commits, PR)
- Assurer la **maintenabilité** et la **testabilité** du code
- Utiliser des outils de qualité (ESLint, Prettier, Jest)

---

## 📁 Structure du projet

```markdown
TP_VERSIONING/
├─ .gitignore
├─ CHANGELOG.md
├─ README.md
├─ app.js
├─ architecture.md
├─ contributing.md
├─ git-workflow.md
├─ index.html
├─ package.json
├─ release.md
└─ tests/
```

---

## ⚙️ Prérequis

Pour exécuter ce projet, assurez-vous d’avoir installé :
- **Node.js** (version 16 ou supérieure)
- **npm** (généralement installé avec Node.js)
- Un **navigateur moderne** (Chrome, Firefox, Edge)
- **Git** configuré avec votre nom et e-mail utilisateur
- Des connaissances de base en **JavaScript ES6+**, **DOM** et **Git**

---

## 🛠️ Installation

### 1. Cloner le dépôt
```bash
git clone https://github.com/ton-utilisateur/TP_VERSIONING.git
cd TP_VERSIONING
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm start
```
*(Ouvre automatiquement `index.html` dans votre navigateur par défaut)*

### 4. Exécuter les tests unitaires
```bash
npm test
```

### 5. Vérifier la qualité du code
```bash
npm run lint
npm run format
```

---

## 🤝 Contribution

### Processus de contribution
1. **Créer une issue** sur GitHub pour décrire votre contribution.
2. **Créer une branche** dédiée à partir de `develop` :
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. **Effectuer vos modifications** et commiter avec des messages clairs :
   ```bash
   git add .
   git commit -m "feat: ajouter une nouvelle fonctionnalité de contact"
   ```
4. **Ouvrir une Pull Request** vers la branche `develop`.
5. **Ajouter des reviewers** et cocher la checklist de la PR.
6. **Rebaser et merger** après validation :
   ```bash
   git pull --rebase origin develop
   ```

### Conventions de commits
- `feat:` → nouvelle fonctionnalité
- `fix:` → correction de bug
- `refactor:` → amélioration du code existant
- `test:` → ajout ou mise à jour de tests
- `chore:` → maintenance, configuration ou dépendances

---

## 📜 Licence

**LICENCE PUBLIQUE GÉNÉRALE GNU**
Version 3, 29 juin 2007
Copyright (C) 2007 Free Software Foundation, Inc.
[https://fsf.org/](https://fsf.org/)

Cette licence garantit à chacun le droit d’utiliser, d’étudier, de modifier et de redistribuer le logiciel, à condition que ces mêmes libertés soient préservées pour tous les utilisateurs et que toute distribution mentionne clairement la présente licence et le code source correspondant.

Pour le texte complet de la licence GNU GPL version 3, voir :
[https://www.gnu.org/licenses/gpl-3.0.txt](https://www.gnu.org/licenses/gpl-3.0.txt)
